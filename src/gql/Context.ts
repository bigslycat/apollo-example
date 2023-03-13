import { server } from './generated'

type Todo = Omit<server.Todo, 'deleted'>
type Id = server.Scalars['ID']

type TodoData = Omit<Todo, '__typename' | 'id'>
type TodoShape = Partial<TodoData>

export class Context {
  private static getTodoId(url: TodoUrl): Id
  private static getTodoId(url: TodoUrl | TodosUrl): undefined | Id
  private static getTodoId(url: TodoUrl | TodosUrl): undefined | Id {
    const id = Context.TODO_ID_REGEXP.exec(url)?.groups?.id
    if (id) return +id
  }

  private static readonly TODO_ID_REGEXP = /^\/api\/todos\/(?<id>[0-9]+)$/iu

  private static getDb = () =>
    new Promise<IDBDatabase>((resolve, reject) => {
      const dbRequest = indexedDB.open('todo-backend', 1)

      dbRequest.addEventListener('success', () => {
        resolve(dbRequest.result)
      })

      dbRequest.addEventListener('error', () => reject(dbRequest.error))

      dbRequest.addEventListener('upgradeneeded', e => {
        switch (e.oldVersion) {
          case 0:
            dbRequest.result.createObjectStore('todos', {
              keyPath: 'id',
              autoIncrement: true,
            })

            break
        }
      })
    })

  private readonly db: Promise<IDBDatabase>

  constructor(private readonly options: Context.Options) {
    this.db = Context.getDb()
  }

  private sleep(dontFail = false) {
    return new Promise<void>((resolve, reject) =>
      setTimeout(
        () =>
          this.options.error && !dontFail
            ? reject(new Error('wtf?'))
            : resolve(),
        this.options.delay,
      ),
    )
  }

  get(url: TodosUrl): Promise<Todo[]>
  get(url: TodoUrl): Promise<Todo>
  async get(url: TodosUrl | TodoUrl): Promise<Todo[] | Todo> {
    const request = new Context.Request({
      log: this.options.log,
      method: Context.Request.Method.GET,
      url,
    })

    try {
      request.start()

      await this.sleep(true)
      const id = Context.getTodoId(url)
      const result = id ? await this.getTodo(id) : await this.getTodos()

      request.success(result)

      return result
    } catch (error) {
      request.fail(error)
      throw error
    }
  }

  private async getStorage(name: string, mode?: IDBTransactionMode) {
    const db = await this.db
    const transaction = db.transaction(name, mode)
    return {
      transaction,
      storage: transaction.objectStore(name),
    }
  }

  private async getTodo(id: Id): Promise<Todo> {
    const todos = await this.getStorage('todos', 'readonly')
    return handleRequest<Todo>(todos.storage.get(id))
  }

  private async getTodos(): Promise<Todo[]> {
    const todos = await this.getStorage('todos', 'readonly')
    const cursor = todos.storage.openCursor()
    return handleCursor(cursor)
  }

  async post(url: TodosUrl, data: TodoData): Promise<Todo> {
    const request = new Context.Request({
      log: this.options.log,
      method: Context.Request.Method.POST,
      url,
      body: data,
    })

    try {
      request.start()

      await this.sleep()
      const todos = await this.getStorage('todos', 'readwrite')
      const id = await handleRequest(todos.storage.put(data) as IDBRequest<Id>)
      const result = await this.getTodo(id)

      request.success(result)

      return result
    } catch (error) {
      request.fail(error)
      throw error
    }
  }

  async patch(url: TodoUrl, data: TodoShape): Promise<Todo> {
    const request = new Context.Request({
      log: this.options.log,
      method: Context.Request.Method.PATCH,
      url,
      body: data,
    })

    try {
      request.start()

      await this.sleep()
      const id = Context.getTodoId(url)
      const todo = await this.getTodo(id)
      const todos = await this.getStorage('todos', 'readwrite')
      await handleRequest(todos.storage.put({ ...todo, ...data }))
      const result = await this.getTodo(id)

      request.success(result)

      return result
    } catch (error) {
      request.fail(error)
      throw error
    }
  }

  async delete(url: TodoUrl): Promise<Todo> {
    const request = new Context.Request({
      log: this.options.log,
      method: Context.Request.Method.DELETE,
      url,
    })

    try {
      request.start()

      await this.sleep()
      const id = Context.getTodoId(url)
      const todo = await this.getTodo(id)
      const todos = await this.getStorage('todos', 'readwrite')
      await handleRequest(todos.storage.delete(id))

      request.success(todo)

      return todo
    } catch (error) {
      request.fail(error)
      throw error
    }
  }
}

const handleRequest = <T>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    request.addEventListener('success', () => resolve(request.result), {
      once: true,
    })

    request.addEventListener('error', () => reject(request.error), {
      once: true,
    })
  })

const handleCursor = <T>(request: IDBRequest<IDBCursorWithValue | null>) =>
  new Promise<T[]>((resolve, reject) => {
    const rows: T[] = []

    request.addEventListener('success', () => {
      if (request.result) {
        rows.push(request.result.value)
        request.result.continue()
      } else {
        resolve(rows)
      }
    })

    request.addEventListener('error', () => reject(request.error), {
      once: true,
    })
  })

export namespace Context {
  export interface Options {
    readonly delay: number
    readonly error: boolean
    log(event: Request.Event): void
  }

  export class Request {
    private readonly id: number

    constructor(private readonly options: Request.Options) {
      this.id = Request.getId()
    }

    start() {
      this.options.log({
        requestId: this.id,
        phase: Request.Phase.Start,
        method: this.options.method,
        url: this.options.url,
        requestBody: this.options.body,
      })
    }

    success(responseBody: unknown) {
      this.options.log({
        requestId: this.id,
        phase: Request.Phase.Success,
        responseBody,
      })
    }

    fail(responseBody: unknown) {
      this.options.log({
        requestId: this.id,
        phase: Request.Phase.Fail,
        responseBody:
          responseBody instanceof Error
            ? {
                name: responseBody.name,
                message: responseBody.message,
              }
            : responseBody,
      })
    }
  }

  export namespace Request {
    export interface Options {
      log(event: Request.Event): void
      readonly url: string
      readonly method: Method
      readonly body?: Readonly<Record<string, unknown>>
    }

    export type Event = Event.Start | Event.Success | Event.Fail

    let lastId = 1

    export function getId() {
      return lastId++
    }

    export namespace Event {
      export interface Start {
        readonly requestId: number
        readonly phase: Phase.Start
        readonly url: string
        readonly method: Method
        readonly requestBody?: Readonly<Record<string, unknown>>
      }

      export interface Success {
        readonly requestId: number
        readonly phase: Phase.Success
        readonly responseBody: unknown
      }

      export interface Fail {
        readonly requestId: number
        readonly phase: Phase.Fail
        readonly responseBody: unknown
      }
    }

    export enum Phase {
      Start,
      Success,
      Fail,
    }

    export enum Method {
      GET = 'GET',
      POST = 'POST',
      PATCH = 'PATCH',
      DELETE = 'DELETE',
    }
  }
}

type TodosUrl = '/api/todos' | '/api/todos/'
type TodoUrl = `/api/todos/${Id}`

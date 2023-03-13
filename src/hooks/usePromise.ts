import { useEffect, useState } from 'react'

export function usePromise<Data, Error = unknown>(handle: () => Promise<Data>) {
  const [result, setResult] = useState<Result<Data, Error>>({
    data: null,
    error: null,
  })

  useEffect(() => {
    let set = (result: Result<Data, Error>) => setResult(result)

    handle()
      .then(data => set({ data, error: null }))
      .catch(error => set({ error, data: null }))

    return () => {
      set = () => {}
    }
  }, [handle])

  return result
}

export type Result<Data, Error> =
  | Result.Pending
  | Result.Ok<Data>
  | Result.Err<Error>

export namespace Result {
  export interface Pending {
    data: null
    error: null
  }

  export interface Ok<Data> {
    data: Data
    error: null
  }

  export interface Err<Error> {
    data: null
    error: Error
  }
}

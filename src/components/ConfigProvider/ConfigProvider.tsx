import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  Cache,
  Reference,
} from '@apollo/client'
import { SchemaLink } from '@apollo/client/link/schema'
import {
  createContext,
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { makeExecutableSchema } from '@graphql-tools/schema'

import { Context, resolvers, Schema } from '../../gql'
import { Toggle, useToggle } from '../../hooks'

export interface Config {
  readonly optimistic: Toggle
  readonly returnError: Toggle
  readonly mockRequestDelay: State<number>
  readonly eventLog: readonly LogRecord[]
}

type State<S> = readonly [S, Dispatch<SetStateAction<S>>]

export const ConfigContext = createContext<Config>(null!)

export const useConfig = () => useContext(ConfigContext)

function useBackendLog() {
  const [eventMap, setEventMap] = useState<Readonly<Record<string, LogRecord>>>(
    {},
  )

  const eventLog = useMemo<readonly LogRecord[]>(
    () => Object.values(eventMap),
    [eventMap],
  )

  const log = useCallback<Context.Options['log']>(event => {
    switch (event.phase) {
      case Context.Request.Phase.Start:
        setEventMap(map => ({
          ...map,
          [event.requestId]: {
            requestId: event.requestId,
            method: event.method,
            url: event.url,
            requestState: RequestState.Pending,
            requestBody: event.requestBody,
          },
        }))

        break

      case Context.Request.Phase.Success:
        setEventMap(map => ({
          ...map,
          [event.requestId]: {
            ...map[event.requestId],
            requestState: RequestState.Success,
            responseBody: event.responseBody,
          },
        }))

        break

      case Context.Request.Phase.Fail:
        setEventMap(map => ({
          ...map,
          [event.requestId]: {
            ...map[event.requestId],
            requestState: RequestState.Failed,
            responseBody: event.responseBody,
          },
        }))

        break
    }
  }, [])

  return {
    log,
    eventLog,
  }
}

interface LogRecord {
  readonly requestId: number
  readonly method: Context.Request.Method
  readonly url: string
  readonly requestState: RequestState
  readonly requestBody?: unknown
  readonly responseBody?: unknown
}

export enum RequestState {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
}

export const ConfigProvider = memo<{ children?: ReactNode }>(({ children }) => {
  const optimistic = useToggle()
  const returnError = useToggle()
  const [mockRequestDelay, setMockRequestDelay] = useState(500)

  const { eventLog, log } = useBackendLog()

  const config = useMemo<Config>(
    () => ({
      optimistic,
      returnError,
      mockRequestDelay: [mockRequestDelay, setMockRequestDelay],
      eventLog,
    }),
    [eventLog, mockRequestDelay, optimistic, returnError],
  )

  const mockRequestErrorRef = useRef(returnError[0])
  mockRequestErrorRef.current = returnError[0]

  const mockRequestDelayRef = useRef(mockRequestDelay)
  mockRequestDelayRef.current = mockRequestDelay

  const client = useMemo(() => {
    const schema = makeExecutableSchema({
      typeDefs: Schema,
      resolvers,
    })

    const context = new Context({
      get delay() {
        return mockRequestDelayRef.current
      },
      get error() {
        return mockRequestErrorRef.current
      },
      log,
    })

    const link = new SchemaLink({
      schema,
      context,
    })

    const cache = new InMemoryCache()

    return new ApolloClient({
      cache,
      link,
      connectToDevTools: true,
      typeDefs: Schema,
    })
  }, [log])

  return (
    <ApolloProvider client={client}>
      <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
    </ApolloProvider>
  )
})

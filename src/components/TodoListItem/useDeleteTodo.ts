import {
  makeReference,
  Reference,
  useApolloClient,
  useMutation,
} from '@apollo/client'
import { useCallback } from 'react'

import { graphql } from '../../gql'
import { useConfig } from '../ConfigProvider'

const DeleteTodo = graphql(/* GraphQL */ `
  mutation DeleteTodo($id: ID!) {
    removeTodo(id: $id) {
      id
    }
  }
`)

export function useDeleteTodo(id: number) {
  const {
    optimistic: [optimistic],
  } = useConfig()

  const [mutate, result] = useMutation(DeleteTodo, {
    variables: { id },

    update: (cache, { data }) => {
      const key = cache.identify(data!.removeTodo!)

      cache.modify({
        fields: {
          todos: (referenses: Reference[]): Reference[] =>
            referenses.filter(ref => ref.__ref !== key),
        },

        broadcast: true,
        optimistic,
      })
    },

    optimisticResponse: optimistic
      ? ({ id }) =>
          ({
            __typename: 'Mutation',
            removeTodo: {
              __typename: 'Todo',
              id,
            },
          } as const)
      : undefined,
  })

  const handle = useCallback(() => {
    mutate()
  }, [mutate])

  return [handle, result] as const
}

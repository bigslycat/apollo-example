import { useMutation, useQuery } from '@apollo/client'
import { ChangeEventHandler, useCallback } from 'react'

import { graphql } from '../../gql'
import { useConfig } from '../ConfigProvider'

const ToggleTodo = graphql(/* GraphQL */ `
  mutation ToggleTodo($id: ID!, $done: Boolean!) {
    toggleTodo(id: $id, done: $done) {
      id
      done
    }
  }
`)

export const useToggleTodo = (
  id: number,
): readonly [ChangeEventHandler<HTMLInputElement>, typeof result] => {
  const {
    optimistic: [optimistic],
  } = useConfig()

  const [mutate, result] = useMutation(ToggleTodo, {
    optimisticResponse: optimistic
      ? ({ id, done }) =>
          ({
            __typename: 'Mutation',
            toggleTodo: {
              __typename: 'Todo',
              id,
              done,
            },
          } as const)
      : undefined,
  })

  const handle = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e =>
      mutate({
        variables: {
          id,
          done: e.target.checked,
        },
      }),
    [id, mutate],
  )

  return [handle, result]
}

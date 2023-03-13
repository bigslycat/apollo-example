import { makeReference, useMutation } from '@apollo/client'
import { Modifier, Reference } from '@apollo/client/cache'
import { useCallback } from 'react'

import { graphql } from '../../gql'
import { useInputValue } from '../../hooks'
import { useConfig } from '../ConfigProvider'

const AddTodo = graphql(/* GraphQL */ `
  mutation AddTodo($name: String!) {
    addTodo(name: $name) {
      id
      name
      done
    }
  }
`)

export function useAddTodo() {
  const [name, { handleChange, clear }] = useInputValue()

  const {
    optimistic: [optimistic],
  } = useConfig()

  const [mutate, { loading }] = useMutation(AddTodo, {
    update: (cache, { data }) =>
      cache.modify({
        fields: {
          todos: existingTodos => [
            ...existingTodos,
            makeReference(cache.identify(data!.addTodo)!),
          ],
        },
      }),

    optimisticResponse: optimistic
      ? ({ name }) =>
          ({
            __typename: 'Mutation',
            addTodo: {
              __typename: 'Todo',
              id: -1,
              name,
              done: false,
            },
          } as const)
      : undefined,

    onCompleted: clear,
  })

  const onSubmit = useCallback(() => {
    mutate({
      variables: { name },
    })
  }, [mutate, name])

  return {
    name,
    loading,
    handleChange,
    onSubmit,
  }
}

import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { graphql } from '../../gql'
import { useInputValue, useToggle } from '../../hooks'
import { useConfig } from '../ConfigProvider'

const RenameTodo = graphql(/* GraphQL */ `
  mutation RenameTodo($id: ID!, $name: String!) {
    renameTodo(id: $id, name: $name) {
      id
      name
    }
  }
`)

export function useRenameTodo(id: number, initialName: string) {
  const {
    optimistic: [optimistic],
  } = useConfig()

  const [enabled, { enable, disable }] = useToggle()
  const [name, { handleChange, setValue, clear }] = useInputValue(initialName)

  const close = useCallback(() => {
    clear()
    disable()
  }, [clear, disable])

  const open = useCallback(() => {
    setValue(initialName)
    enable()
  }, [enable, initialName, setValue])

  const [mutate, { loading }] = useMutation(RenameTodo, {
    onCompleted: close,

    optimisticResponse: optimistic
      ? ({ id, name }) =>
          ({
            __typename: 'Mutation',
            renameTodo: {
              __typename: 'Todo',
              id,
              name,
            },
          } as const)
      : undefined,
  })

  const handleSubmit = useCallback((): void => {
    mutate({
      variables: {
        id,
        name,
      },
    })
  }, [id, mutate, name])

  return {
    nameFieldValue: name,
    enabled,
    toggle: enabled ? close : open,
    handleChange,
    handleSubmit,
    loading,
  } as const
}

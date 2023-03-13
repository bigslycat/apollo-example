import { useQuery } from '@apollo/client'

import { graphql } from '../../gql'

const GetTodo = graphql(/* GraphQL */ `
  query GetTodo($id: ID!) {
    todo(id: $id) {
      id
      name
      done
    }
  }
`)

export const useTodo = (id: number) => useQuery(GetTodo, { variables: { id } })

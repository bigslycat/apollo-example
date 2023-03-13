import { useQuery, QueryResult } from '@apollo/client'
import { useMemo } from 'react'

import { GetTodosQuery, GetTodosQueryVariables, graphql } from '../../gql'

const GetTodos = graphql(/* GraphQL */ `
  query GetTodos {
    todos {
      id
      name
      done
    }
  }
`)

export function useTodos(): QueryResult<GetTodosQuery, GetTodosQueryVariables> {
  const { data, error, loading } = useQuery(GetTodos)

  console.log({ data, error, loading })

  return useQuery(GetTodos)
}

import { gql } from '@apollo/client'

export const Query = gql`
  type Query {
    todos: [Todo!]!
    todo(id: ID!): Todo
  }
`

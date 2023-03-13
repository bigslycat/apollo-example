import { gql } from '@apollo/client'

export const Todo = gql`
  type Todo {
    id: ID!
    name: String!
    done: Boolean!
  }
`

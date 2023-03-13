import { gql } from '@apollo/client'

export const Mutation = gql`
  type Mutation {
    addTodo(name: String!): Todo!
    renameTodo(id: ID!, name: String!): Todo
    toggleTodo(id: ID!, done: Boolean!): Todo
    removeTodo(id: ID!): Todo
  }

  type AddingTodoResult {
    todo: Todo!
    todoList: [Todo!]!
  }
`

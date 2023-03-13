/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  mutation AddTodo($name: String!) {\n    addTodo(name: $name) {\n      id\n      name\n      done\n    }\n  }\n": types.AddTodoDocument,
    "\n  query GetTodos {\n    todos {\n      id\n      name\n      done\n    }\n  }\n": types.GetTodosDocument,
    "\n  mutation DeleteTodo($id: ID!) {\n    removeTodo(id: $id) {\n      id\n    }\n  }\n": types.DeleteTodoDocument,
    "\n  mutation RenameTodo($id: ID!, $name: String!) {\n    renameTodo(id: $id, name: $name) {\n      id\n      name\n    }\n  }\n": types.RenameTodoDocument,
    "\n  query GetTodo($id: ID!) {\n    todo(id: $id) {\n      id\n      name\n      done\n    }\n  }\n": types.GetTodoDocument,
    "\n  mutation ToggleTodo($id: ID!, $done: Boolean!) {\n    toggleTodo(id: $id, done: $done) {\n      id\n      done\n    }\n  }\n": types.ToggleTodoDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddTodo($name: String!) {\n    addTodo(name: $name) {\n      id\n      name\n      done\n    }\n  }\n"): (typeof documents)["\n  mutation AddTodo($name: String!) {\n    addTodo(name: $name) {\n      id\n      name\n      done\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetTodos {\n    todos {\n      id\n      name\n      done\n    }\n  }\n"): (typeof documents)["\n  query GetTodos {\n    todos {\n      id\n      name\n      done\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTodo($id: ID!) {\n    removeTodo(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTodo($id: ID!) {\n    removeTodo(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RenameTodo($id: ID!, $name: String!) {\n    renameTodo(id: $id, name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation RenameTodo($id: ID!, $name: String!) {\n    renameTodo(id: $id, name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetTodo($id: ID!) {\n    todo(id: $id) {\n      id\n      name\n      done\n    }\n  }\n"): (typeof documents)["\n  query GetTodo($id: ID!) {\n    todo(id: $id) {\n      id\n      name\n      done\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ToggleTodo($id: ID!, $done: Boolean!) {\n    toggleTodo(id: $id, done: $done) {\n      id\n      done\n    }\n  }\n"): (typeof documents)["\n  mutation ToggleTodo($id: ID!, $done: Boolean!) {\n    toggleTodo(id: $id, done: $done) {\n      id\n      done\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
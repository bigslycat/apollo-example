import { Context } from './Context'
import type { server } from './generated'

export const resolvers: server.Resolvers<Context> = {
  Query: {
    todos: (_, __, ctx) => ctx.get('/api/todos'),
    todo: (_, { id }, ctx) => ctx.get(`/api/todos/${id}`),
  },

  Mutation: {
    addTodo: (_, { name }, ctx) =>
      ctx.post('/api/todos', {
        name,
        done: false,
      }),

    async toggleTodo(_, { id }, ctx) {
      const url = `/api/todos/${id}` as const
      const { done } = await ctx.get(url)
      return ctx.patch(url, { done: !done })
    },

    renameTodo: (_, { id, name }, ctx) =>
      ctx.patch(`/api/todos/${id}`, { name }),

    removeTodo: (_, { id }, ctx) => ctx.delete(`/api/todos/${id}`),
  },
}

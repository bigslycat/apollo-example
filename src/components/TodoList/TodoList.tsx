import { memo, useCallback, useEffect } from 'react'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from '@mui/material'

import { PlusOne, Add } from '@mui/icons-material'

import { useTodos } from './useTodos'
import { TodoListItem } from '../TodoListItem'
import { useAddTodo } from './useAddTodo'
import { gql, makeReference } from '@apollo/client'
import { useConfig } from '../ConfigProvider'

export const TodoList = memo(() => {
  const { data, loading } = useTodos()

  const {
    optimistic: [optimistic],
  } = useConfig()

  const {
    name: nameFieldValue,
    handleChange,
    onSubmit,
    loading: adding,
  } = useAddTodo()

  if (loading) {
    return (
      <Box
        sx={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      {/* <Button onClick={add}>Add</Button> */}
      <List>
        {data?.todos.map(todo => (
          <TodoListItem
            key={todo.id}
            id={todo.id}
            name={todo.name}
            done={todo.done}
          />
        ))}

        {!(optimistic && adding) && (
          <ListItem
            dense
            secondaryAction={
              <IconButton edge='end' disabled={adding} onClick={onSubmit}>
                <Add />
              </IconButton>
            }
          >
            <ListItemIcon />

            <Box
              component='form'
              onSubmit={e => {
                e.preventDefault()
                onSubmit()
              }}
              sx={{ flex: '1 1 auto' }}
            >
              <Input
                placeholder='Введите название'
                value={nameFieldValue}
                onChange={handleChange}
                autoFocus
                size='medium'
                fullWidth
                required
                disabled={adding}
              />
            </Box>
          </ListItem>
        )}
      </List>
    </>
  )
})

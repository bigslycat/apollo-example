import { ChangeEventHandler, memo } from 'react'
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Input,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import { useToggleTodo } from './useToggleTodo'
import { useRenameTodo } from './useRenameTodo'
import { useConfig } from '../ConfigProvider'
import { useToggle } from '../../hooks'
import { useDeleteTodo } from './useDeleteTodo'

export const TodoListItem = memo<TodoListItem.Props>(({ id, name, done }) => {
  const {
    optimistic: [optimistic],
  } = useConfig()

  const [mouseOver, { enable: mouseOverOn, disable: mouseOverOff }] =
    useToggle()

  const [toggle, { loading: changing }] = useToggleTodo(id)
  const [deleteTodo, { loading: deleting }] = useDeleteTodo(id)

  const {
    nameFieldValue,
    enabled: renamingFormEnabled,
    toggle: toggleRenamingForm,
    handleChange,
    loading: renaming,
    handleSubmit,
  } = useRenameTodo(id, name)

  const pending = changing || deleting || renaming

  const showRenamingForm = renamingFormEnabled && !(renaming && optimistic)

  return (
    <ListItem
      dense
      disablePadding={!showRenamingForm}
      onMouseOver={mouseOverOn}
      onMouseOut={mouseOverOff}
      secondaryAction={
        showRenamingForm ? (
          <IconButton
            edge='end'
            onClick={toggleRenamingForm}
            disabled={renaming || id < 0}
          >
            <CancelIcon />
          </IconButton>
        ) : (
          mouseOver &&
          id > 0 && (
            <IconButton
              edge='end'
              disabled={(changing && !optimistic) || id < 0}
              onClick={deleteTodo}
            >
              <DeleteForeverIcon />
            </IconButton>
          )
        )
      }
    >
      {showRenamingForm ? (
        <>
          <TodoCheckbox
            checked={done}
            disabled={(pending && !optimistic) || showRenamingForm}
            pending={pending && !optimistic}
            onToggle={toggle}
          />

          <Box
            component='form'
            onSubmit={e => {
              e.preventDefault()
              handleSubmit()
            }}
            sx={{ flex: '1 1 auto' }}
          >
            <Input
              placeholder='Введите название'
              value={nameFieldValue}
              onChange={handleChange}
              autoFocus
              fullWidth
              required
              disabled={renaming && !optimistic}
              onKeyDown={e => {
                if (e.key === 'Escape') toggleRenamingForm()
              }}
            />
          </Box>
        </>
      ) : (
        <ListItemButton
          disableRipple
          onClick={toggleRenamingForm}
          disabled={(pending && !optimistic) || id < 0}
        >
          <TodoCheckbox
            checked={done}
            disabled={(pending && !optimistic) || showRenamingForm || id < 1}
            pending={pending && !optimistic}
            onToggle={toggle}
          />

          <ListItemText primary={name} />
        </ListItemButton>
      )}
    </ListItem>
  )
})

export namespace TodoListItem {
  export interface Props {
    id: number
    name: string
    done: boolean
  }
}

const Pending = memo<{ enabled: boolean }>(({ enabled }) =>
  enabled ? <CircularProgress size={24} /> : null,
)

interface TodoCheckboxProps {
  checked?: boolean
  disabled?: boolean
  pending?: boolean
  onToggle?: ChangeEventHandler<HTMLInputElement>
}

const TodoCheckbox = memo<TodoCheckboxProps>(
  ({ checked, disabled, pending, onToggle }) => {
    const checkboxPendingIcon = pending ? (
      <CircularProgress size={24} />
    ) : undefined

    return (
      <ListItemIcon onClick={e => e.stopPropagation()}>
        <Checkbox
          edge='start'
          checked={checked}
          tabIndex={-1}
          onChange={onToggle}
          icon={checkboxPendingIcon}
          checkedIcon={checkboxPendingIcon}
          disabled={disabled}
        />
      </ListItemIcon>
    )
  },
)

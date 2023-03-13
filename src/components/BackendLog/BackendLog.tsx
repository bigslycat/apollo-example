import { memo } from 'react'
import {
  Box,
  CircularProgress,
  css,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from '@mui/material'

import { RequestState, useConfig } from '../ConfigProvider'
import {
  CheckCircleRounded,
  CheckRounded,
  ErrorRounded,
} from '@mui/icons-material'

export const BackendLog = memo(() => {
  const { eventLog } = useConfig()

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
      <Table stickyHeader size='small'>
        <TableHead>
          <TableRow>
            <Th></Th>
            <Th>Запрос</Th>
            <Th>Тело запроса</Th>
            <Th>Тело ответа</Th>
          </TableRow>
        </TableHead>

        <TableBody>
          {eventLog.map(logRecord => (
            <TableRow color='text.secondary' hover key={logRecord.requestId}>
              <Cell>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Status requestState={logRecord.requestState} />
                </Box>
              </Cell>
              <Cell mono>
                {logRecord.method} {logRecord.url}
              </Cell>
              <Cell mono>{JSON.stringify(logRecord.requestBody || null)}</Cell>
              <Cell mono>
                {logRecord.requestState !== 'Pending' &&
                  JSON.stringify(logRecord.responseBody || null)}
              </Cell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
})

const Status = memo<{ requestState: RequestState }>(props => {
  switch (props.requestState) {
    case RequestState.Pending:
      return <CircularProgress size={20} thickness={4} />

    case RequestState.Success:
      return <CheckRounded color='success' fontSize='small' />

    case RequestState.Failed:
      return <ErrorRounded color='error' fontSize='small' />
  }
})

const Th = styled(TableCell)`
  white-space: nowrap;
`

const Cell = styled(TableCell)`
  ${(props: { mono?: boolean }) =>
    props.mono &&
    css`
      font-family: 'Roboto Mono';
      white-space: pre;
    `}
`

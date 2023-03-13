import { memo } from 'react'

import { ConfigProvider, useConfig } from '../ConfigProvider'
import { TodoList } from '../TodoList'
import {
  Box,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  FormGroup,
  GlobalStyles,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { BackendLog } from '../BackendLog'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto-mono/400.css'

export const App = memo(() => {
  return (
    <ConfigProvider>
      <CssBaseline enableColorScheme />
      <GlobalStyles
        styles={{
          'html, body, #root': {
            height: '100%',
          },
        }}
      />

      <Stack height='100%'>
        <Grid container spacing={4} width='100%' p={4} justifyContent='center'>
          <Grid xs={6} md={5} lg={4} xl={3}>
            <Paper sx={{ minHeight: '50%', position: 'relative' }}>
              <TodoList />
            </Paper>
          </Grid>

          <Grid xs={6} md={5} lg={4} xl={3}>
            <ConfigBox />
          </Grid>
        </Grid>

        <Box p={3} sx={{ overflow: 'hidden' }}>
          <BackendLog />
        </Box>
      </Stack>
    </ConfigProvider>
  )
})

const ConfigBox = memo(() => {
  const { mockRequestDelay, optimistic, returnError } = useConfig()

  return (
    <Box>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox checked={optimistic[0]} onChange={optimistic[1].toggle} />
          }
          label='Оптимистичный UI'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={returnError[0]}
              onChange={returnError[1].toggle}
            />
          }
          label='Имитировать ошибку ответа сервера'
        />

        <Typography gutterBottom mt={2}>
          Задержка ответа моков: {mockRequestDelay[0]}ms
        </Typography>
        <Slider
          min={100}
          max={3000}
          step={100}
          value={mockRequestDelay[0]}
          onChange={(_, value) => mockRequestDelay[1](value as number)}
          valueLabelDisplay='auto'
        />
      </FormGroup>
    </Box>
  )
})

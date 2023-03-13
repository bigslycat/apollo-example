import { ChangeEventHandler, useCallback, useMemo, useState } from 'react'

export function useInputValue(initialValue = '') {
  const [value, setValue] = useState(initialValue)

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => setValue(e.target.value),
    [],
  )

  const clear = useCallback(() => setValue(''), [])

  const methods = useMemo(
    () =>
      ({
        handleChange,
        setValue,
        clear,
      } as const),
    [clear, handleChange],
  )

  return [value, methods] as const
}

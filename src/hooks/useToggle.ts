import { ChangeEventHandler, useCallback, useMemo, useState } from 'react'

export type Toggle = readonly [boolean, ToggleMethods]

export interface ToggleMethods {
  enable(): void
  disable(): void
  toggle(): void
  change(value: boolean): void
}

export function useToggle(initialValue = false) {
  const [enabled, change] = useState(initialValue)

  const enable = useCallback(() => change(true), [])
  const disable = useCallback(() => change(false), [])
  const toggle = useCallback(() => change(not), [])
  const handleCheckboxChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(e => change(e.target.checked), [])

  const methods = useMemo<ToggleMethods>(
    () => ({
      enable,
      disable,
      toggle,
      change,
      handleCheckboxChange,
    }),
    [disable, enable, handleCheckboxChange, toggle],
  )

  return useMemo(() => [enabled, methods] as const, [enabled, methods])
}

const not = (value: boolean) => !value

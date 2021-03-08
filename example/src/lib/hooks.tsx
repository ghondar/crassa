
import { useEffect, useRef, EffectCallback } from 'react'

const { NODE_ENV } = process.env

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useComponentDidMount = (func: EffectCallback): void => useEffect(func, [])

export const useComponentWillMount = (func: EffectCallback): void => {
  const willMount = useRef(true)

  if(willMount.current && NODE_ENV === 'production')
    func()

  useComponentDidMount(() => {
    willMount.current = false
    if(NODE_ENV === 'development')
      func()
  })
}

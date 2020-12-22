import React, { FC } from 'react'

type LoadingProps = Record<string, never>

const Loading: FC<LoadingProps> = () => {
  return (
    <div
      style={{
        display       : 'flex',
        justifyContent: 'center',
        alignItems    : 'center',
        position      : 'absolute',
        right         : 0,
        left          : 0,
        top           : 0,
        bottom        : 0
      }}>
      Cargando...
    </div>
  )
}

export default Loading

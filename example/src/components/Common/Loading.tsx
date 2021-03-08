import { FC } from 'react'

type LoadingProps = Record<string, never>

const Loading: FC<LoadingProps> = () => (
  <div
    style={{
      alignItems    : 'center',
      bottom        : 0,
      display       : 'flex',
      justifyContent: 'center',
      left          : 0,
      position      : 'absolute',
      right         : 0,
      top           : 0
    }}>
      Cargando...
  </div>
)

export default Loading

import { FC } from 'react'
import { Store } from 'redux'
import { Provider } from 'react-redux'

interface RootProps {
  store: Store
}

const Root: FC<RootProps> = ({ store, children }) => (
  <Provider store={store}>{children}</Provider>
)

export default Root

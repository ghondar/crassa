import { FC } from 'react'
import { Provider } from 'react-redux'
import { Store } from 'redux'

import DevTools from './DevTools'

interface RootProps {
  store: Store
}

const Root: FC<RootProps> = ({ store, children }) => (
  <Provider store={store}>
    <div>
      {children}
      <DevTools />
    </div>
  </Provider>
)

export default Root

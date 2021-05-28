import React from 'react'
import { render, waitForElement } from '@testing-library/react'
import App from '../App'

it('renders correctly', async () => {
  const tree = render(<App />)
  await waitForElement(() => tree.getByTestId('counter'))
  expect(tree).toMatchSnapshot()
})

import { render } from '@testing-library/react-native'
import React from 'react'
import { PaperProvider } from 'react-native-paper'

import { Button } from './Button'
import { LingoTheme } from '../../../theme/LingoTheme'

describe('Button', () => {
  it('should render correctly and match snapshot', () => {
    const { toJSON } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <PaperProvider theme={LingoTheme}>
        <Button mode="contained">Test Button</Button>
      </PaperProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly with loading state and match snapshot', () => {
    const { toJSON } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <PaperProvider theme={LingoTheme}>
        <Button mode="contained" loading={true}>
          Test Button
        </Button>
      </PaperProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly with disabled state and match snapshot', () => {
    const { toJSON } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <PaperProvider theme={LingoTheme}>
        <Button mode="contained" disabled={true}>
          Test Button
        </Button>
      </PaperProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })
})

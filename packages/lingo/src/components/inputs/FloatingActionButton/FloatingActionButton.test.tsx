import { render } from '@testing-library/react-native'
import React from 'react'
import { PaperProvider } from 'react-native-paper'

import { FloatingActionButton } from './FloatingActionButton'
import { LingoTheme } from '../../../theme'

describe('FloatingActionButton', () => {
  it('should render correctly', () => {
    const { getByTestId, toJSON } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <PaperProvider theme={LingoTheme}>
        <FloatingActionButton icon={'plus'} onPress={jest.fn()} />
      </PaperProvider>
    )
    expect(getByTestId('paper-fab')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })
})

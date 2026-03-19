import { render } from '@testing-library/react-native'
import React from 'react'
import { PaperProvider } from 'react-native-paper'

import { IconButton } from './IconButton'
import { LingoTheme } from '../../../theme'

describe('IconButton', () => {
  it('should render correctly', () => {
    const { getByTestId, toJSON } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <PaperProvider theme={LingoTheme}>
        <IconButton icon={'camera'} onPress={jest.fn()} />
      </PaperProvider>
    )
    expect(getByTestId('paper-iconbutton')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })
})

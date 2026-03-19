import { render } from '@testing-library/react-native'
import React from 'react'
import { PaperProvider } from 'react-native-paper'

import { Slider } from './Slider'
import { LingoTheme } from '../../../theme'

describe('Slider', () => {
  it('should render correctly', () => {
    const { getByTestId, toJSON } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <PaperProvider theme={LingoTheme}>
        <Slider value={5} minimumValue={1} maximumValue={10} />
      </PaperProvider>
    )
    expect(getByTestId('paper-slider')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })
})

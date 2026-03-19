import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { PaperProvider } from 'react-native-paper'

import { ButtonGroup } from './ButtonGroup'
import { LingoTheme } from '../../../theme'

describe('ButtonGroup', () => {
  it('should render buttons correctly', () => {
    const { getByText, toJSON } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <PaperProvider theme={LingoTheme}>
        <ButtonGroup
          buttons={[
            { label: 'Button 1', onPress: jest.fn() },
            { label: 'Button 2', onPress: jest.fn() },
          ]}
          mode="contained"
        />
      </PaperProvider>
    )

    expect(getByText('Button 1')).toBeTruthy()
    expect(getByText('Button 2')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should call onPress callbacks when buttons are pressed', () => {
    const button1Press = jest.fn()
    const button2Press = jest.fn()

    const { getByText } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <PaperProvider theme={LingoTheme}>
        <ButtonGroup
          buttons={[
            { label: 'Button 1', onPress: button1Press },
            { label: 'Button 2', onPress: button2Press },
          ]}
          mode="contained"
        />
      </PaperProvider>
    )

    fireEvent.press(getByText('Button 1'))
    expect(button1Press).toHaveBeenCalled()

    fireEvent.press(getByText('Button 2'))
    expect(button2Press).toHaveBeenCalled()
  })

  it('should render correctly and match snapshot with different modes', () => {
    const { toJSON } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <PaperProvider theme={LingoTheme}>
        <ButtonGroup
          buttons={[
            { label: 'Button 1', onPress: jest.fn() },
            { label: 'Button 2', onPress: jest.fn() },
          ]}
          mode="outlined"
        />
      </PaperProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })
})

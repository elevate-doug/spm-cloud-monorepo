import { render } from '@testing-library/react-native'
import React from 'react'

import PaperButton from '.'

describe('PaperButton', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<PaperButton mode="text">Test</PaperButton>)
    expect(getByTestId('paper-button')).toBeTruthy()
  })
})

import { render } from '@testing-library/react-native'
import React from 'react'

import { RadioGroup } from './RadioGroup'

describe('RadioGroup', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(
      <RadioGroup
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
      />
    )
    expect(getByTestId('paper-radiogroup')).toBeTruthy()
  })
})

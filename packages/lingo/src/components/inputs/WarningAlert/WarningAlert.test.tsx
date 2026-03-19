import { render } from '@testing-library/react-native'

import { WarningAlert } from './WarningAlert'

describe('WarningAlert', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <WarningAlert title="Test Title" message="Test message content" />
    )

    expect(getByText('Test Title')).toBeTruthy()
    expect(getByText('Test message content')).toBeTruthy()
  })
})

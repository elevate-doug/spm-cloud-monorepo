import { act, render } from '@testing-library/react-native'
import { PaperProvider } from 'react-native-paper'

import { ScanningTemplate } from './ScanningTemplate'
import { LingoTheme } from '../../theme'

describe('ScanningTemplate', () => {
  const defaultProps = {
    userName: 'Test User',
    processPointPlaceholder: 'Enter process point',
    productPlaceholder: 'Enter product',
    onProcessPointChangeText: jest.fn(),
    onProductChangeText: jest.fn(),
    onSearchProcessPoint: jest.fn(),
    onSearchProduct: jest.fn(),
  }

  it('renders correctly with default props', () => {
    const { getByText, toJSON } = render(
      // @ts-ignore
      <PaperProvider theme={LingoTheme}>
        <ScanningTemplate {...defaultProps} />
      </PaperProvider>
    )

    expect(getByText('Scan or search')).toBeTruthy()
    expect(getByText('User: Test User')).toBeTruthy()
    expect(getByText('Recent scans')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders correctly with recent scans', () => {
    const recentScans = [
      {
        product: 'Test Product',
        index: '123',
        processPoint: 'Location 1',
        quantity: 5,
        timestamp: '2024-03-20',
      },
    ]

    const { getByText, toJSON } = render(
      <PaperProvider theme={LingoTheme}>
        <ScanningTemplate {...defaultProps} recentScans={recentScans} />
      </PaperProvider>
    )

    expect(getByText('Test Product')).toBeTruthy()
    expect(getByText('Location: Location 1')).toBeTruthy()
    expect(getByText('123')).toBeTruthy()
    expect(getByText('Qty: 5')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders empty state when no recent scans', () => {
    const { getByText, toJSON } = render(
      <PaperProvider theme={LingoTheme}>
        <ScanningTemplate {...defaultProps} recentScans={[]} />
      </PaperProvider>
    )

    expect(getByText('No recent scans')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('calls onChangeText handlers when text is entered', () => {
    const { getByPlaceholderText } = render(
      <PaperProvider theme={LingoTheme}>
        <ScanningTemplate {...defaultProps} />
      </PaperProvider>
    )

    const processPointInput = getByPlaceholderText('Enter process point')
    const productInput = getByPlaceholderText('Enter product')

    act(() => {
      processPointInput.props.onChangeText('New Process Point')
      productInput.props.onChangeText('New Product')
    })

    expect(defaultProps.onProcessPointChangeText).toHaveBeenCalledWith(
      'New Process Point'
    )
    expect(defaultProps.onProductChangeText).toHaveBeenCalledWith('New Product')
  })

  it('calls onSearch handlers when search is triggered', () => {
    const { getByPlaceholderText } = render(
      <PaperProvider theme={LingoTheme}>
        <ScanningTemplate {...defaultProps} />
      </PaperProvider>
    )

    const processPointInput = getByPlaceholderText('Enter process point')
    const productInput = getByPlaceholderText('Enter product')

    act(() => {
      processPointInput.props.onSubmitEditing()
      productInput.props.onSubmitEditing()
    })

    expect(defaultProps.onSearchProcessPoint).toHaveBeenCalled()
    expect(defaultProps.onSearchProduct).toHaveBeenCalled()
  })
})

import { render } from '@testing-library/react-native'
import { Provider as PaperProvider } from 'react-native-paper'

import { LingoTheme } from '../../../theme'
import { Typography } from '../../typography/Typography'
describe('Text Component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <PaperProvider theme={LingoTheme}>
        <Typography variant="h4">Test Text</Typography>
      </PaperProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render with the Inter font family', () => {
    const { getByText, toJSON } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <PaperProvider theme={LingoTheme}>
        <Typography variant="h4">Test Text</Typography>
      </PaperProvider>
    )
    const textElement = getByText('Test Text')
    // Flatten the style array
    const flattenedStyle = Array.isArray(textElement.props.style)
      ? textElement.props.style.reduce(
          (acc: string | any[], style: any) => acc.concat(style),
          []
        )
      : [textElement.props.style]
    // Check if any of the styles contain the fontFamily property
    const fontFamilyStyle = flattenedStyle.find(
      (style: { fontFamily: string }) =>
        style && style.fontFamily === 'Inter-Regular'
    )
    expect(fontFamilyStyle).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })
})

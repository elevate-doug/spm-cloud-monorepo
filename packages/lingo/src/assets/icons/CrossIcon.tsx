import { ViewStyle } from 'react-native'
import Svg, { Path } from 'react-native-svg'

interface CrossIconProps {
  color?: string
  size?: number
  // SVGIcon compatibility props
  fill?: string
  width?: number
  height?: number
  style?: ViewStyle
}

const CrossIcon = ({ color, size, fill, width, height }: CrossIconProps) => {
  const iconColor = color ?? fill ?? '#000'
  const iconSize = size ?? width ?? height ?? 24

  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      style={{ backgroundColor: 'transparent' }}
    >
      <Path
        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
        fill={iconColor}
      />
    </Svg>
  )
}
export default CrossIcon

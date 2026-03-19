import { Dimensions, ViewStyle } from 'react-native'

import { LingoColors } from '../theme'

export const VH = Dimensions.get('window').height
export const VW = Dimensions.get('window').width

export const SH = Dimensions.get('screen').height
export const SW = Dimensions.get('screen').width

export const H_PADDING = 16
export const V_PADDING = 16

export const DEFAULT_BORDER_RADIUS = 4

export const TOP_SHADOW: Readonly<
  Pick<ViewStyle, 'borderTopWidth' | 'borderTopColor'>
> = Object.freeze({
  borderTopWidth: 1.5,
  borderTopColor: LingoColors.borderShadow,
})

export const DEFAULT_BORDER_RADIUS_LG = 15

export const BIG_INPUT = {
  height: 74,
  fontSize: 34,
}

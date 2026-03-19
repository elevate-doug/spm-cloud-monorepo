import {
  MD3LightTheme as MD3Theme,
  DefaultTheme as MD2Theme,
} from 'react-native-paper'

import { LingoTheme } from './LingoTheme'

export const themeV2 = {
  ...MD2Theme,
  ...LingoTheme,
  version: 2,
}

export const themeV3 = {
  ...MD3Theme,
  ...LingoTheme,
  version: 3,
}

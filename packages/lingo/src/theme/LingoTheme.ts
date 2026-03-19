import { DefaultTheme } from 'react-native-paper'

import { LingoColors } from './Colors'
import { fontDefinitions } from './fontDefinitions'

export const LingoTheme = {
  ...DefaultTheme,
  version: 2,
  fonts: fontDefinitions,
  colors: {
    ...DefaultTheme.colors,
    primary: LingoColors.primary.main,
    accent: LingoColors.secondary.main,
    background: LingoColors.background.default,
    surface: LingoColors.background.paper,
    text: LingoColors.text.primary,
    disabled: LingoColors.text.disabled,
    placeholder: LingoColors.text.secondary,
    backdrop: LingoColors.overlayBackground,
    onSurface: LingoColors.text.primary,
    notification: LingoColors.secondary.main,
    success: LingoColors.success.main,
    error: LingoColors.error.main,
    border: LingoColors.border,
    highlight: LingoColors.highlightBackground,
  },
}

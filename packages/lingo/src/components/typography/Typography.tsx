import { FC, ReactNode } from 'react'
import { StyleSheet, Text, TextStyle, StyleProp } from 'react-native'

import { LingoColors } from '../../theme'

export type TypographyName =
  | 'body1'
  | 'body2'
  | 'subtitle1'
  | 'subtitle2'
  | 'overline'
  | 'caption'
  | 'h6'
  | 'h5'
  | 'h4'
  | 'h3'
  | 'h2'
  | 'h1'
  | 'buttonMedium'

export type TypographyProps = {
  variant?: TypographyName
  children: ReactNode | undefined
  color?: string
  primary?: boolean
  bold?: boolean
  style?: StyleProp<TextStyle>
  italic?: boolean
}

export const DEFAULT_FONT_FAMILY = 'Inter-Regular'

export const typographyStyleMap: Record<TypographyName, TextStyle> =
  StyleSheet.create({
    body1: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    body2: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20.02,
      letterSpacing: 0.17,
    },
    subtitle1: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 21.98,
      letterSpacing: 0.1,
    },
    overline: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 31.92,
      letterSpacing: 1,
    },
    caption: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 19.92,
      letterSpacing: 0.4,
    },
    h6: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 20,
      fontWeight: '500',
      lineHeight: 32,
      letterSpacing: 0.15,
    },
    h5: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 24,
      fontWeight: '400',
      lineHeight: 32,
    },
    h4: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 34,
      fontWeight: '400',
      lineHeight: 41.99,
      letterSpacing: 0.25,
    },
    h3: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 48,
      fontWeight: '400',
      lineHeight: 56.02,
    },
    h2: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 60,
      fontWeight: '300',
      lineHeight: 72,
      letterSpacing: -0.5,
    },
    h1: {
      fontFamily: 'Inter-Regular',
      color: LingoColors.primary.main,
      fontSize: 96,
      fontWeight: '300',
      lineHeight: 112.03,
      letterSpacing: -1.5,
    },
    buttonMedium: {
      fontFamily: 'Inter-Medium',
      color: LingoColors.primary.main,
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 24,
      letterSpacing: 0.4,
    },
  })

export const Typography: FC<TypographyProps> = ({
  variant = 'body1',
  children,
  color = LingoColors.text.primary,
  primary = false,
  bold = false,
  style,
  italic = false,
}) => {
  const _style = typographyStyleMap[variant]

  // Handle undefined, null, or empty children to prevent text node errors
  if (children === undefined || children === null || children === '') {
    return null
  }

  let fmtStr = children
  if (variant === 'overline' && typeof children === 'string') {
    fmtStr = children.toUpperCase()
  }

  if (primary) {
    color = LingoColors.primary.main
  }

  return (
    <Text
      style={[
        style,
        _style,
        {
          color,
          fontFamily: bold ? 'Inter-Medium' : 'Inter-Regular',
          fontWeight: bold ? '600' : _style.fontWeight,
          fontStyle: italic ? 'italic' : 'normal',
        },
      ]}
    >
      {fmtStr}
    </Text>
  )
}

import React, { FC, ReactNode } from 'react'
import { StyleProp, TextStyle } from 'react-native'
import {
  Text as PaperText,
  TextProps as PaperTextProps,
  useTheme,
} from 'react-native-paper'
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types'

type VariantMapping = {
  [key: string]: VariantProp<never>
}

// Mapping Lingo names to RN Paper variant names
export const variantMapping: VariantMapping = {
  h1: 'displayLarge',
  h2: 'displayMedium',
  h3: 'displaySmall',
  h4: 'headlineLarge',
  h5: 'headlineMedium',
  h6: 'headlineSmall',
  subtitle1: 'titleLarge',
  subtitle2: 'titleMedium',
  body1: 'bodyLarge',
  body2: 'bodyMedium',
  button: 'labelLarge',
  caption: 'labelMedium',
  overline: 'labelSmall',
}

export interface TextProps extends Omit<PaperTextProps<never>, 'variant'> {
  variant: keyof VariantMapping
  style?: StyleProp<TextStyle>
  children: ReactNode
}

export const Text: FC<TextProps> = ({ variant, style, ...props }) => {
  const theme = useTheme()
  const paperVariant = variantMapping[variant]

  const combinedStyle = [
    {
      fontFamily: theme.fonts[paperVariant]?.fontFamily,
      fontSize: theme.fonts[paperVariant]?.fontSize,
      fontWeight: theme.fonts[paperVariant]?.fontWeight,
    },
    style,
  ]

  return (
    <PaperText variant={paperVariant} style={combinedStyle} {...props}>
      {props.children}
    </PaperText>
  )
}

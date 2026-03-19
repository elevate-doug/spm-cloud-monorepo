import React, { FC, ReactNode } from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'

import { LingoColors } from '../../../../theme/Colors'

interface CustomButtonProps {
  mode: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal'
  icon?: string
  loading?: boolean
  disabled?: boolean
  compact?: boolean
  onPress?: () => void
  children: ReactNode
}

const CustomButton: FC<CustomButtonProps> = ({
  mode,
  icon,
  loading,
  disabled,
  compact,
  onPress,
  children,
}) => {
  return (
    <PaperButton
      mode={mode}
      icon={icon}
      loading={loading}
      disabled={disabled}
      compact={compact}
      onPress={onPress}
      contentStyle={styles.buttonContent}
      labelStyle={[
        styles.buttonLabel,
        mode === 'text' && styles.textButtonLabel,
        mode === 'outlined' && styles.outlinedButtonLabel,
        disabled && styles.disabledLabel,
      ]}
      style={[
        styles.button,
        mode === 'contained' && styles.containedButton,
        mode === 'outlined' && styles.outlinedButton,
        mode === 'elevated' && styles.elevatedButton,
        mode === 'contained-tonal' && styles.containedTonalButton,
        disabled && styles.disabledButton,
      ]}
      testID="paper-button"
    >
      {children}
    </PaperButton>
  )
}

const styles = StyleSheet.create({
  button: {
    margin: 0,
    userSelect: 'none',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 22,
    minWidth: 36,
    position: 'relative',
    borderWidth: 0,
    textDecorationLine: 'none',
    borderRadius: 4,
  },
  buttonLabel: {
    color: LingoColors.primary.contrastText,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 26,
    fontFamily: 'Inter-Regular',
    textTransform: 'uppercase',
    letterSpacing: 0.46,
  },
  containedButton: {
    backgroundColor: LingoColors.primary.main,
    shadowColor: LingoColors.textShadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9, // For Android shadow
  },
  outlinedButton: {
    borderColor: LingoColors.primary.main,
    borderWidth: 1,
  },
  textButtonLabel: {
    color: LingoColors.primary.main,
  },
  outlinedButtonLabel: {
    color: LingoColors.primary.main,
  },
  elevatedButton: {
    elevation: 3,
  },
  containedTonalButton: {
    backgroundColor: LingoColors.secondary.main,
  },
  disabledButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0, 0, 0, 0.38)',
  },
  disabledLabel: {
    color: 'rgba(0, 0, 0, 0.38)',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CustomButton

import { FC, ReactNode } from 'react'
import {
  ActivityIndicator,
  DimensionValue,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import { Icon } from 'react-native-paper'

import { LingoColors } from '../../../theme'
import { DEFAULT_BORDER_RADIUS, H_PADDING, V_PADDING } from '../../../values'

export type ButtonProps = {
  mode:
    | 'text'
    | 'outlined'
    | 'contained'
    | 'elevated'
    | 'contained-tonal'
    | 'contained-warning'
  loading?: boolean
  disabled?: boolean
  onPress?: () => void
  children: ReactNode
  customStyle?: ViewStyle
  customTextStyle?: TextStyle
  iconLeft?: string
  minWidth?: DimensionValue | undefined
  testID?: string
}

export const Button: FC<ButtonProps> = ({
  mode,
  loading,
  disabled,
  onPress,
  children,
  customStyle,
  customTextStyle,
  iconLeft,
  minWidth,
  testID,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        mode === 'contained' && styles.containedButton,
        mode === 'outlined' && styles.outlinedButton,
        mode === 'elevated' && styles.elevatedButton,
        mode === 'contained-tonal' && styles.containedTonalButton,
        mode === 'contained-warning' && styles.containedButtonWarning,
        disabled && styles.disabledButton,
        loading && styles.loadingStyle,
        customStyle,
        !!minWidth && { minWidth },
      ]}
      testID={testID || 'custom-button'}
    >
      {loading && (
        <ActivityIndicator
          color={LingoColors.background.default}
          style={{ height: 20 }}
        />
      )}
      {iconLeft && (
        <Icon
          source={iconLeft}
          size={20}
          color={LingoColors.primary.contrastText}
        />
      )}
      {!loading && (
        <Text
          style={[
            styles.buttonLabel,
            mode === 'text' && styles.textButtonLabel,
            mode === 'outlined' && styles.outlinedButtonLabel,
            disabled && styles.disabledLabel,
            customTextStyle,
          ]}
        >
          {/* NOTE: Intentional blank string left during loading animation to prevent button height from shrinking. */}
          {loading ? ' ' : children}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    gap: H_PADDING,
    margin: 0,
    userSelect: 'none',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 0,
    textDecorationLine: 'none',
    borderRadius: DEFAULT_BORDER_RADIUS,
    paddingVertical: V_PADDING / 2,
    paddingHorizontal: H_PADDING,
  },
  loadingStyle: {
    height: 42.5,
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
    elevation: 9,
  },
  containedButtonWarning: {
    backgroundColor: LingoColors.error.main,
    shadowColor: LingoColors.textShadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  outlinedButton: {
    borderColor: LingoColors.primary.main,
    backgroundColor: 'transparent',
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
    backgroundColor: LingoColors.action.disabledBackground,
    color: 'rgba(0, 0, 0, 0.38)',
    elevation: 0,
    borderWidth: 0,
  },
  disabledLabel: {
    color: 'rgba(0, 0, 0, 0.38)',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'rgba(0, 0, 0, 0.38)',
  },
})

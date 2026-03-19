import { FC } from 'react'
import { GestureResponderEvent, StyleSheet, ViewStyle } from 'react-native'
import { IconButton as PaperIconButton } from 'react-native-paper'

import { LingoColors } from '../../../theme/Colors'
import { H_PADDING } from '../../../values'

export type IconButtonProps = {
  icon: string
  color?: string
  size?: number
  onPress: (e: GestureResponderEvent) => void
  disabled?: boolean
  style?: ViewStyle
  hitSlop?: { top: number; bottom: number; left: number; right: number }
}

export const IconButton: FC<IconButtonProps> = ({
  icon,
  color = LingoColors.primary.main,
  size = 24,
  onPress,
  disabled = false,
  style,
  hitSlop,
}) => {
  return (
    <PaperIconButton
      icon={icon}
      iconColor={color}
      size={size}
      onPress={onPress}
      style={[styles.iconButton, style]}
      disabled={disabled}
      testID="paper-iconbutton"
      hitSlop={hitSlop}
    />
  )
}

const styles = StyleSheet.create({
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
    userSelect: 'none',
    verticalAlign: 'middle',
    textDecorationLine: 'none',
    textAlign: 'center',
    flex: 0,
    fontSize: 24, // 1.5rem
    borderRadius: 48,
    overflow: 'visible',
    height: 48,
    width: 48,
    // transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
})

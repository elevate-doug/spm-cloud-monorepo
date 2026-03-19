import React, { FC, useState } from 'react'
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'

import { Typography } from '../../components/typography'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values'

export type HomeButtonProps = {
  icon: React.ReactNode
  label: string
  onPress: () => void
  style?: ViewStyle
  selected?: boolean
}
export const HomeButton: FC<HomeButtonProps> = ({
  icon,
  label,
  onPress,
  style,
  selected = false,
}) => {
  const [isPressed, setIsPressed] = useState(selected)

  return (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        isPressed && { backgroundColor: LingoColors.highlightBackground },
        style,
      ]}
      activeOpacity={1}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
    >
      {icon}
      <Typography
        variant="h6"
        color={isPressed ? LingoColors.primary.dark : LingoColors.primary.main}
        bold
      >
        {label}
      </Typography>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  itemContainer: {
    gap: H_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING / 1.5,
    width: '100%',
    backgroundColor: LingoColors.background.paper,
  },
})

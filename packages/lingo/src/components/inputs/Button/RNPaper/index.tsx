import React, { FC, ReactNode } from 'react'
import { Button as PaperButton } from 'react-native-paper'

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
    >
      {children}
    </PaperButton>
  )
}

export default CustomButton

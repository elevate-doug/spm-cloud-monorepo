import { FC, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Checkbox as PaperCheckbox } from 'react-native-paper'

import { LingoColors } from '../../../theme'
import { H_PADDING } from '../../../values'
import { Typography } from '../../typography'

export type CheckboxProps = {
  label: string
  checked?: boolean
  onValueChange?: (checked: boolean) => void
  disabled?: boolean
  containerStyle?: StyleProp<ViewStyle>
}

export const Checkbox: FC<CheckboxProps> = ({
  label,
  checked = false,
  onValueChange,
  disabled = false,
  containerStyle,
}) => {
  const handlePress = () => {
    onValueChange?.(!checked)
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <PaperCheckbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={handlePress}
        disabled={disabled}
        testID="paper-checkbox"
        color={LingoColors.primary.main}
      />
      <Typography style={styles.label} variant="body1" bold>
        {label}
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: H_PADDING / 2,
  },
})

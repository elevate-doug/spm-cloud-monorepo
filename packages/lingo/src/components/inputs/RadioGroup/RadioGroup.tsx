import React, { FC, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { RadioButton } from 'react-native-paper'

import { LingoColors } from '../../../theme/Colors'

export type RadioGroupProps = {
  options: { label: string; value: string }[]
  initialSelected?: string
  disabled?: boolean
}

export const RadioGroup: FC<RadioGroupProps> = ({
  options,
  initialSelected,
  disabled,
}) => {
  const [checked, setChecked] = useState(initialSelected)

  return (
    <View style={styles.container} testID="paper-radiogroup">
      {options.map((option) => (
        <View key={option.value} style={styles.radioContainer}>
          <RadioButton
            value={option.value}
            status={checked === option.value ? 'checked' : 'unchecked'}
            onPress={() => setChecked(option.value)}
            disabled={disabled}
            color={LingoColors.primary.main}
          />
          <Text style={styles.label}>{option.label}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 24,
    color: LingoColors.text.secondary,
  },
})

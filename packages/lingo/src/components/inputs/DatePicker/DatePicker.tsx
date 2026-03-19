import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { FC, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import { TextInput as PaperTextInput } from 'react-native-paper'

import { LingoColors } from '../../../theme'

export type DatePickerProps = {
  label: string
  value: Date
  onChange: (date: Date) => void
  style?: ViewStyle
  disabled?: boolean
  testID?: string
}

export const DatePicker: FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  style,
  disabled = false,
  testID,
}) => {
  const [showPicker, setShowPicker] = useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const onChangeDate = (_: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false)
    if (date) onChange(date)
  }

  const onPress = () => !disabled && setShowPicker(true)

  return (
    <View style={[styles.container, style]} testID={testID}>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <PaperTextInput
          label={label}
          value={formatDate(value)}
          mode="outlined"
          editable={false}
          style={{
            ...styles.input,
            opacity: disabled ? 0.8 : 1,
          }}
          textColor={
            disabled ? LingoColors.grey[700] : LingoColors.text.primary
          }
          outlineColor={
            disabled
              ? LingoColors.grey[600]
              : showPicker
                ? LingoColors.primary.main
                : LingoColors.grey[400]
          }
          left={
            <PaperTextInput.Icon
              icon="calendar"
              onPress={onPress}
              color={
                disabled ? LingoColors.grey[400] : LingoColors.primary.main
              }
            />
          }
          testID={testID ? `${testID}-input` : undefined}
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker value={value} mode="date" onChange={onChangeDate} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: '100%',
  },
})

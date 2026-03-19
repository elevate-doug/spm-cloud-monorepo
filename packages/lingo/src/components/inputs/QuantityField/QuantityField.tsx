import { FC, useEffect, useState } from 'react'
import { Keyboard, StyleSheet, View, ViewStyle } from 'react-native'
import { TextInput as PaperTextInput } from 'react-native-paper'

import { LingoColors } from '../../../theme/Colors'
import { Typography } from '../../typography/Typography'
import { IconButton } from '../IconButton'
export interface QuantityFieldProps {
  value: number | ''
  minValue: number
  maxValue: number
  hideButtons?: boolean
  disabled?: boolean
  error: string
  onChangeValue: (value: number | '') => void
}
export const QuantityField: FC<QuantityFieldProps> = ({
  value = 0,
  minValue = 0,
  maxValue = 5,
  hideButtons = false,
  disabled = false,
  error,
  onChangeValue,
}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const disableIncrement = Number(value) >= maxValue
  const disableDecrement = Number(value) <= minValue
  const showButtons = !hideButtons && !isKeyboardVisible
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    )
    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])
  const onIncrement = () => onChangeValue(Number(value) + 1)
  const onDecrement = () => onChangeValue(Number(value) - 1)
  const onTextChange = (text: string) => {
    const number = parseInt(text, 10)
    if (!isNaN(number)) {
      onChangeValue(number)
    } else {
      onChangeValue('')
    }
  }
  const getThemeColors = () => ({
    colors: {
      text: LingoColors.text.primary,
      placeholder: error ? LingoColors.error.main : LingoColors.text.secondary,
      background: LingoColors.background.paper,
      primary: error ? LingoColors.error.main : LingoColors.primary.main,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        {showButtons && (
          <IconButton
            icon="minus"
            onPress={onDecrement}
            disabled={disableDecrement || disabled}
            style={{
              ...styles.controlButton,
              backgroundColor: disableDecrement
                ? LingoColors.grey[300]
                : LingoColors.primary.main,
            }}
            color={
              disableDecrement
                ? LingoColors.grey[800]
                : LingoColors.common.white
            }
          />
        )}
        <View style={styles.inputContainer}>
          <PaperTextInput
            label="Quantity"
            value={value.toString()}
            onChangeText={onTextChange}
            mode="outlined"
            style={styles.input}
            theme={getThemeColors()}
            keyboardType="numeric"
            disabled={disabled}
            right={
              isFocused ? (
                <PaperTextInput.Icon
                  icon="close"
                  size={30}
                  color={LingoColors.grey[600]}
                  onPress={() => onChangeValue('')}
                />
              ) : null
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            outlineColor={
              error ? LingoColors.error.main : LingoColors.grey.A400
            }
            selectTextOnFocus={true}
          />
          {error && (
            <Typography variant="body1" color={LingoColors.error.main}>
              {error}
            </Typography>
          )}
        </View>
        {showButtons && (
          <IconButton
            icon="plus"
            onPress={onIncrement}
            disabled={disableIncrement || disabled}
            style={
              [
                styles.controlButton,
                {
                  backgroundColor: disableIncrement
                    ? LingoColors.grey[300]
                    : LingoColors.primary.main,
                },
              ] as ViewStyle
            }
            color={
              disableIncrement
                ? LingoColors.grey[800]
                : LingoColors.common.white
            }
          />
        )}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  controls: {
    flexDirection: 'row',
  },
  controlButton: {
    height: 48,
    width: 48,
    marginTop: 24,
  },
  inputContainer: {
    width: 200, // minimum visible label width
    marginHorizontal: 8,
  },
  input: {
    width: '100%',
    height: 74,
    paddingVertical: 0,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    fontSize: 34,
  },
})

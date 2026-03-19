import { ForwardedRef, forwardRef, useState } from 'react'
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { TextInput as PaperTextInput } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { LingoColors } from '../../../theme'
import { BIG_INPUT, H_PADDING } from '../../../values'
import { Typography } from '../../typography'

export type TextFieldProps = {
  label?: string
  value: string
  onChangeText: (text: string) => void
  variant?: 'outlined' | 'outlined-big' | 'standard' | 'filled'
  secureTextEntry?: boolean
  error?: boolean
  helperText?: string
  style?: ViewStyle
  inputStyle?: ViewStyle
  leftIcon?: string
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  placeholder?: string
  disabled?: boolean
  enterKeyHint?: 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
  onSubmitEditing?: () => void
  clearTextOnFocus?: boolean
  selectTextOnFocus?: boolean
  onBlur?: () => void
  showClearButton?: boolean
  testID?: string
}

export const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    {
      label,
      value,
      onChangeText,
      variant = 'outlined',
      secureTextEntry = false,
      error = false,
      helperText,
      style,
      inputStyle,
      leftIcon,
      keyboardType,
      autoCapitalize,
      placeholder,
      disabled,
      enterKeyHint,
      onSubmitEditing,
      clearTextOnFocus = false,
      onBlur,
      selectTextOnFocus = false,
      showClearButton = false,
      testID,
    },
    ref: ForwardedRef<TextInput>
  ) => {
    const [isFocused, setIsFocused] = useState(false)

    const onChangeTextHandler = (text: string): void => {
      setIsFocused(true)
      onChangeText(text)
    }

    const onFocusHandler = () => {
      setIsFocused(true)
      if (clearTextOnFocus) clearText()
    }

    const handleOnBlur = () => {
      setIsFocused(false)
      onBlur?.()
    }

    const clearText = () => {
      onChangeText('')
      Keyboard.dismiss()
    }

    const shouldShowClearButton =
      showClearButton && isFocused && value.length > 0

    const getThemeColors = () => ({
      colors: {
        text: LingoColors.text.primary,
        placeholder: error
          ? LingoColors.error.main
          : LingoColors.text.secondary,
        background: LingoColors.background.paper,
        primary: error ? LingoColors.error.main : LingoColors.primary.main,
        onSurfaceVariant: error
          ? LingoColors.error.main
          : LingoColors.text.secondary,
        borderWidth: error || variant === 'outlined-big' ? 2 : 1,
      },
    })

    return (
      <View style={[styles.container, style]}>
        {(variant === 'outlined' || variant === 'outlined-big') && (
          <PaperTextInput
            ref={ref}
            clearTextOnFocus={clearTextOnFocus}
            selectTextOnFocus={selectTextOnFocus}
            label={label}
            value={value}
            onChangeText={onChangeTextHandler}
            placeholder={placeholder}
            mode="outlined"
            style={[
              variant === 'outlined-big' ? styles.outlinedBig : styles.outlined,
              inputStyle,
            ]}
            theme={getThemeColors()}
            secureTextEntry={secureTextEntry}
            error={error}
            testID={testID || 'paper-textfield'}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            left={
              leftIcon ? (
                <PaperTextInput.Icon
                  icon={leftIcon}
                  color={'rgba(0,0,0,0.56)'}
                />
              ) : undefined
            }
            outlineColor={'rgba(0, 0, 0, 0.23)'}
            outlineStyle={[
              {
                borderColor: error
                  ? LingoColors.error.main
                  : isFocused
                    ? LingoColors.primary.main
                    : LingoColors.input.outlined.enabledBorder,
              },
            ]}
            right={
              shouldShowClearButton ? (
                <PaperTextInput.Icon
                  icon="close"
                  color={'rgba(0,0,0,0.56)'}
                  onPress={clearText}
                />
              ) : undefined
            }
            onFocus={onFocusHandler}
            onBlur={handleOnBlur}
            disabled={disabled}
            enterKeyHint={enterKeyHint}
            onSubmitEditing={onSubmitEditing}
          />
        )}
        {variant === 'standard' && (
          <View style={styles.standardContainer}>
            <Text style={[styles.standardLabel, error && styles.errorText]}>
              {label}
            </Text>
            <View style={styles.standardInputContainer}>
              <TextInput
                ref={ref}
                clearTextOnFocus={clearTextOnFocus}
                selectTextOnFocus={selectTextOnFocus}
                value={value}
                onChangeText={onChangeText}
                style={[
                  styles.standardInput,
                  error && styles.errorInput,
                  inputStyle,
                ]}
                placeholder={placeholder}
                placeholderTextColor={LingoColors.text.placeholder}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                testID={testID || 'paper-textfield-standard'}
                autoCapitalize={autoCapitalize}
                onFocus={onFocusHandler}
                onBlur={handleOnBlur}
                editable={!disabled}
                enterKeyHint={enterKeyHint}
                onSubmitEditing={onSubmitEditing}
              />
              {shouldShowClearButton && (
                <TouchableOpacity
                  onPress={clearText}
                  style={styles.clearButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name="close" size={18} color="rgba(0,0,0,0.56)" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        {variant === 'filled' && (
          <PaperTextInput
            ref={ref}
            clearTextOnFocus={clearTextOnFocus}
            label={label}
            value={value}
            onChangeText={onChangeText}
            mode="flat"
            style={[styles.filled, inputStyle]}
            theme={getThemeColors()}
            onBlur={handleOnBlur}
            secureTextEntry={secureTextEntry}
            error={error}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            testID="paper-textfield"
            enterKeyHint={enterKeyHint}
            onSubmitEditing={onSubmitEditing}
            textColor={LingoColors.text.primary}
            editable={!disabled}
          />
        )}
        {helperText && (
          <Typography
            variant="caption"
            color={error ? LingoColors.error.main : LingoColors.text.secondary}
            style={styles.helperText}
          >
            {helperText}
          </Typography>
        )}
      </View>
    )
  }
)

TextField.displayName = 'TextField'

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  outlined: {
    width: '100%',
    minWidth: 300,
    paddingVertical: 0,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: LingoColors.background.paper,
  },
  outlinedBig: {
    ...BIG_INPUT,
  },
  standardContainer: {
    width: '100%',
  },
  standardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: LingoColors.inputBorder,
  },
  standardLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 12,
    height: 12,
    letterSpacing: 0.15,
    color: LingoColors.text.secondary,
  },
  standardInput: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.15,
    color: LingoColors.text.primary,
    padding: 0,
    height: 35,
    flex: 1,
  },
  errorInput: {
    borderBottomColor: LingoColors.error.main,
  },
  filled: {
    width: '100%',
    height: 56,
    backgroundColor: LingoColors.common.black,
  },
  errorText: {
    color: LingoColors.error.main,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  helperText: {
    color: LingoColors.text.secondary,
    marginLeft: H_PADDING,
  },
})

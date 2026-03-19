import { FC, Fragment, useRef, useState } from 'react'
import {
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import { Divider, Menu, TextInput as PaperTextInput } from 'react-native-paper'

import { LingoColors } from '../../../theme/Colors'
import { DEFAULT_BORDER_RADIUS, H_PADDING, VH } from '../../../values'
import { Touchable } from '../../buttons'
import { MenuItem } from '../../menu'

export type SelectProps = {
  state?: 'enabled' | 'hovered' | 'focused' | 'disabled' | 'error'
  options?: { label: string; value: string }[]
  value?: string
  onChangeText: (text: string) => void
  label?: string
  style?: ViewStyle
  error?: boolean
  helperText?: string
  fullWidth?: boolean
  placeholder?: string
  showDividers?: boolean
  testID?: string
}

export const Select: FC<SelectProps> = ({
  state = 'enabled',
  options = [],
  value,
  onChangeText,
  label = 'Value',
  style,
  error = false,
  helperText,
  fullWidth = false,
  placeholder,
  showDividers = true,
  testID,
  ...props
}) => {
  const [visible, setVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [width, setWidth] = useState(0)
  const anchorRef = useRef<View>(null)

  const getThemeColors = () => ({
    colors: {
      placeholder: error
        ? LingoColors.error.main
        : isFocused
          ? LingoColors.primary.main
          : LingoColors.text.secondary,
      background: LingoColors.background.paper,
      onSurfaceVariant: error
        ? LingoColors.error.main
        : LingoColors.text.secondary,
    },
  })

  const openMenu = () => {
    setVisible(true)
    setIsFocused(true)
  }
  const closeMenu = () => {
    setVisible(false)
    setIsFocused(false)
  }

  const selectOption = (selectedValue: string) => {
    onChangeText(selectedValue)
    closeMenu()
  }

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    setWidth(width)
  }

  const getSelectedLabel = () => {
    const selectedOption = options.find((option) => option.value === value)
    return selectedOption ? selectedOption.label : placeholder || ''
  }

  return (
    <View
      style={fullWidth ? styles.fullWidthContainer : null}
      ref={anchorRef}
      onLayout={handleLayout}
    >
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Touchable
            onPress={openMenu}
            style={styles.touchable}
            disabled={state === 'disabled'}
          >
            <PaperTextInput
              pointerEvents="none"
              mode="outlined"
              style={[
                styles.input,
                style,
                state === 'disabled' && styles.disabledState,
              ]}
              label={label}
              value={getSelectedLabel()}
              theme={getThemeColors()}
              disabled={state === 'disabled'}
              editable={false}
              error={error}
              outlineStyle={{
                borderWidth: 1,
                borderColor: isFocused
                  ? LingoColors.primary.main
                  : LingoColors.grey[400],
              }}
              right={
                <PaperTextInput.Icon
                  icon={isFocused ? 'menu-up' : 'menu-down'}
                  onPress={openMenu}
                  disabled={state === 'disabled'}
                  color={
                    isFocused
                      ? LingoColors.primary.main
                      : LingoColors.text.primary
                  }
                />
              }
              contentStyle={{ padding: H_PADDING }}
              testID={testID || 'paper-select'}
              placeholder={placeholder}
              textColor={LingoColors.text.primary}
              {...props}
            />
          </Touchable>
        }
        contentStyle={[styles.menuContent, { width }]}
        anchorPosition="bottom"
      >
        <ScrollView>
          {options.map((option, index) => (
            <Fragment key={`${option.value}-${index}`}>
              <MenuItem
                onPress={() => selectOption(option.value)}
                title={option.label}
                selected={option.value === value}
              />
              {showDividers && index < options.length - 1 && (
                <Divider style={styles.divider} />
              )}
            </Fragment>
          ))}
        </ScrollView>
      </Menu>
      {helperText && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {helperText}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  fullWidthContainer: {},
  touchable: { backgroundColor: 'transparent' },
  input: {
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: H_PADDING,
    borderRadius: 4,
  },
  menuContent: {
    backgroundColor: LingoColors.background.paper,
    borderRadius: DEFAULT_BORDER_RADIUS,
    paddingTop: 0,
    paddingBottom: 0,
    maxHeight: VH * 0.4,
  },
  divider: {
    backgroundColor: LingoColors.border,
  },
  filledVariant: {
    backgroundColor: '#0000000F',
  },
  smallSize: {
    height: 40,
  },
  outlineState: {
    borderColor: LingoColors.border,
  },
  outlineFocusedState: {
    borderColor: LingoColors.primary.main,
  },
  disabledState: {
    backgroundColor: 'lightgray',
    opacity: 0.5,
  },
  errorState: {
    borderColor: LingoColors.error.main,
  },
  errorText: {
    color: LingoColors.error.main,
  },
  helperText: {
    marginTop: 4,
  },
})

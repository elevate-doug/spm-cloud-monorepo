import { FC, useRef, useState } from 'react'
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Icon } from 'react-native-paper'

import SearchFieldIcon from '../../../assets/icons/SearchFieldIcon'
import { Typography } from '../../../components/typography/Typography'
import { LingoColors } from '../../../theme'
import { H_PADDING, V_PADDING } from '../../../values'
export type SearchFieldProps = {
  placeholder: string
  value: string
  searchButtonVisible?: boolean
  minLength?: number
  onChangeText: (text: string) => void
  onSearch?: () => void
  autoFocus?: boolean
  testID?: string
}
export const SearchField: FC<SearchFieldProps> = ({
  placeholder,
  value,
  searchButtonVisible = true,
  minLength,
  onChangeText,
  onSearch,
  autoFocus = false,
  testID,
}) => {
  const inputRef = useRef<TextInput>(null)

  const [isFocused, setIsFocused] = useState(false)
  const [searchPressed, setSearchPressed] = useState(false)

  const disabled =
    value?.length === 0 || (minLength ? value.length < minLength : false)
  const searchButtonColor = disabled
    ? LingoColors.text.disabled
    : LingoColors.primary.main

  const handleSearch = () => {
    inputRef.current?.blur()
    onSearch?.()
    setSearchPressed(true)
  }

  const handleOnChangeText = (text: string): void => {
    setSearchPressed(false)
    onChangeText(text)
  }

  return (
    <View>
      <View style={styles.container}>
        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainer_focused,
          ]}
        >
          <SearchFieldIcon color={LingoColors.grey[600]} size={24} />
          <TextInput
            ref={inputRef}
            value={value}
            returnKeyType="search"
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={LingoColors.grey[500]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={handleOnChangeText}
            onSubmitEditing={handleSearch}
            autoFocus={autoFocus}
            testID={testID}
          />
          {value && value.length > 0 && (
            <TouchableOpacity
              onPress={() => onChangeText('')}
              {...(Platform.OS === 'web'
                ? {
                    onMouseDown: (e: { preventDefault: () => void }) =>
                      e.preventDefault(),
                  }
                : {})}
            >
              <Icon source="close" size={24} color={LingoColors.grey[600]} />
            </TouchableOpacity>
          )}
        </View>
        {searchButtonVisible && isFocused && (
          <TouchableOpacity
            disabled={!!disabled}
            style={[styles.search, { backgroundColor: searchButtonColor }]}
            onPress={handleSearch}
            {...(Platform.OS === 'web'
              ? {
                  onMouseDown: (e: { preventDefault: () => void }) =>
                    e.preventDefault(),
                }
              : {})}
          >
            <SearchFieldIcon color={LingoColors.common.white} size={24} />
          </TouchableOpacity>
        )}
      </View>
      {isFocused &&
        searchPressed &&
        (value?.length || 0) < (minLength || 0) && (
          <Typography
            variant="caption"
            style={styles.minLength}
            color={LingoColors.grey[600]}
          >
            Enter {String(minLength)} characters before searching
          </Typography>
        )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    height: 56,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: LingoColors.border,
    backgroundColor: LingoColors.background.paper,
  },
  inputContainer_focused: {
    borderColor: LingoColors.primary.main,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    lineHeight: 24,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  search: {
    width: 48,
    height: 48,
    marginLeft: 16,
    backgroundColor: LingoColors.background.default,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minLength: {
    marginLeft: H_PADDING,
    marginTop: V_PADDING / 4,
  },
})

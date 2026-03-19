import { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import { Button, SearchField } from '../../components/inputs'
import { Typography } from '../../components/typography'
import { LingoColors } from '../../theme'
import { fontDefinitions } from '../../theme/fontDefinitions'
import { H_PADDING, V_PADDING } from '../../values'
export type SearchCaseTemplateProps = {
  value: string
  onChangeValue: (text: string) => void
  onCancel: () => void
  onContinue: () => void
}
export const SearchCaseTemplate: FC<SearchCaseTemplateProps> = ({
  value = '',
  onChangeValue,
  onCancel,
  onContinue,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h6" style={styles.header}>
          Search for Case
        </Typography>
        <Typography variant="body1" style={styles.text}>
          Enter all or part of the case number and press Search to search for
          the case.
        </Typography>
        <SearchField
          placeholder="Search for case"
          value={value}
          searchButtonVisible={false}
          minLength={3}
          onChangeText={onChangeValue}
          onSearch={onContinue}
        />
      </View>
      <View style={styles.buttons}>
        <Button mode="outlined" customStyle={styles.button} onPress={onCancel}>
          Cancel
        </Button>
        <Button
          mode="contained"
          customStyle={styles.button}
          disabled={value.length < 3}
          onPress={onContinue}
        >
          Search
        </Button>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
  },
  content: {
    flex: 1,
    paddingHorizontal: H_PADDING,
  },
  header: {
    marginVertical: V_PADDING,
    fontSize: fontDefinitions.headlineLarge.fontSize,
    fontWeight: fontDefinitions.displaySmall.fontWeight,
    letterSpacing: 0.8,
  },
  text: {
    marginBottom: V_PADDING,
    fontSize: 16,
    fontWeight: 400,
    color: 'rgba(0, 0, 0, 0.60)',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: V_PADDING,
    marginTop: V_PADDING,
    backgroundColor: LingoColors.background.paper,
  },
  button: {
    height: 42,
    flex: 0.45,
  },
})
export default SearchCaseTemplate

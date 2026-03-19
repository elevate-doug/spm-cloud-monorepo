import { FC } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Button, SearchField } from '../../components/inputs'
import { Typography } from '../../components/typography'
import { LingoColors } from '../../theme'
import { fontDefinitions } from '../../theme/fontDefinitions'
import { H_PADDING, V_PADDING } from '../../values'
export type SearchCaseItem = {
  barcode: string
  desc: string
  dateTime: string
}
export type SearchCaseResultsTemplateProps = {
  text: string
  onChangeText: (text: string) => void
  items: SearchCaseItem[]
  selectedItem: SearchCaseItem
  onSelectItem: (item: SearchCaseItem) => void
  onCancel: () => void
  onContinue: () => void
}
export const SearchCaseResultsTemplate: FC<SearchCaseResultsTemplateProps> = ({
  text = '',
  onChangeText,
  items,
  selectedItem,
  onSelectItem,
  onCancel,
  onContinue,
}) => {
  const renderItem = ({ item }: { item: SearchCaseItem }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        {
          backgroundColor:
            selectedItem === item
              ? LingoColors.highlightBackground
              : LingoColors.background.paper,
        },
      ]}
      onPress={() => onSelectItem(item)}
    >
      <Typography variant="body1" style={styles.itemBarcode}>
        {item.barcode}
      </Typography>
      <Typography variant="body1" style={styles.itemText}>
        {item.desc}
      </Typography>
      <Typography variant="body1" style={styles.itemText}>
        {item.dateTime}
      </Typography>
    </TouchableOpacity>
  )
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h6" style={styles.header}>
          Search for Case
        </Typography>
        <SearchField
          placeholder="Search for case"
          value={text}
          onChangeText={onChangeText}
          onSearch={onContinue}
        />
        <FlatList
          style={styles.list}
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.barcode}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <View style={styles.buttons}>
        <Button mode="outlined" customStyle={styles.button} onPress={onCancel}>
          Cancel
        </Button>
        <Button
          mode="contained"
          customStyle={styles.button}
          disabled={!selectedItem}
          onPress={onContinue}
        >
          OK
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
  list: {
    marginTop: V_PADDING,
  },
  separator: {
    height: 1,
    backgroundColor: LingoColors.border,
  },
  itemContainer: {
    padding: H_PADDING,
  },
  itemBarcode: {
    color: LingoColors.primary.main,
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.15,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 22,
    letterSpacing: 0.17,
    color: 'rgba(0, 0, 0, 0.60)',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: V_PADDING,
    marginTop: V_PADDING,
    backgroundColor: LingoColors.background.paper,
    shadowColor: LingoColors.common.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
  },
  button: {
    height: 42,
    flex: 0.45,
  },
})
export default SearchCaseResultsTemplate

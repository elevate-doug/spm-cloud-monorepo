import { StyleSheet, FlatList, View } from 'react-native'
import { List } from 'react-native-paper'

import { LingoColors } from '../../../theme/Colors'

export interface SimpleListProps<T> {
  data: T[]
  selectedItem: T | undefined
  keyExtractor: (item: T) => string
  labelExtractor: (item: T) => string
  onSelectItem: (item: T) => void
}

export function SimpleList<T>({
  data,
  selectedItem,
  keyExtractor,
  labelExtractor,
  onSelectItem,
}: SimpleListProps<T>) {
  const renderIndexItem = ({ item }: { item: T }) => (
    <List.Item
      title={[labelExtractor(item)]}
      style={[
        selectedItem &&
          keyExtractor(item) === keyExtractor(selectedItem) && {
            backgroundColor: LingoColors.highlightBackground,
          },
      ]}
      titleStyle={styles.listItemTitle}
      onPress={() => onSelectItem(item)}
    />
  )

  return (
    <FlatList
      data={data}
      renderItem={renderIndexItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  )
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: LingoColors.border,
  },
  listItemTitle: {
    color: LingoColors.primary.main,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
  },
})

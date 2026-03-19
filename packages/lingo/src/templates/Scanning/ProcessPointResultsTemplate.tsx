import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { ActivityIndicator, List } from 'react-native-paper'

import {
  ScrollProvider,
  useScroll,
} from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../components/containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import { Dropdown, SearchField } from '../../components/inputs'
import { Typography } from '../../components/typography'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { DEFAULT_BORDER_RADIUS_LG, H_PADDING, V_PADDING } from '../../values'

export type ProcessPointItem = {
  id: string
  label: string
  siteId: string
}

export type ProcessPointResultsTemplateProps = {
  searchText: string
  siteValue: string
  sites: { id: string; value: string }[]
  processPoints: ProcessPointItem[]
  loading: boolean
  onCancel: () => void
  onContinue: (processPoint: ProcessPointItem) => void
  onChangeSiteValue: (value: string) => void
  onChangeSearchText: (text: string) => void
}

type ProcessPointListProps = {
  items: ProcessPointItem[]
  renderItem: any
  selectedItem?: ProcessPointItem
  searchText: string
  siteValue: string
  sites: { id: string; value: string }[]
  onChangeSearchText: (text: string) => void
  onChangeSiteValue: (value: string) => void
  loading?: boolean
}

const ProcessPointList: FC<ProcessPointListProps> = ({
  items,
  renderItem,
  selectedItem,
  searchText,
  onChangeSearchText,
  siteValue,
  sites,
  onChangeSiteValue,
  loading,
}) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()
  const listRef = useRef<FlatList>(null)

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={LingoColors.primary.main} />
      ) : (
        <Typography variant="body1" color={LingoColors.text.disabled}>
          No process points found
        </Typography>
      )}
    </View>
  )

  return (
    <FlatList
      ref={listRef}
      data={loading ? [] : items}
      contentContainerStyle={[
        styles.list,
        (items.length === 0 || loading) && styles.emptyList,
      ]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
      onContentSizeChange={(_, height) => onContentChange(height)}
      removeClippedSubviews={false}
      ListEmptyComponent={ListEmptyComponent}
    />
  )
}

export const ProcessPointResultsTemplate: FC<
  ProcessPointResultsTemplateProps
> = ({
  searchText: searchTextOrigin,
  siteValue,
  sites,
  processPoints,
  loading,
  onCancel,
  onContinue,
  onChangeSiteValue,
  onChangeSearchText,
}) => {
  const [searchText, setSearchText] = useState(searchTextOrigin)
  const [items, setItems] = useState<ProcessPointItem[]>(processPoints)
  const [selectedItem, setSelectedItem] = useState<
    ProcessPointItem | undefined
  >()

  const filteredItems = useMemo(() => {
    if (!searchText) return items
    return items.filter((item) =>
      (item.label || '').toLowerCase().includes(searchText.toLowerCase())
    )
  }, [items, searchText])

  useEffect(() => {
    setItems(processPoints)
  }, [processPoints]) // checking if new array pointer was created

  useEffect(() => {
    setSearchText(searchTextOrigin)
    return () => {
      setItems([])
      setSearchText('')
    }
  }, [searchTextOrigin])

  const handleSearchTextChange = (text: string) => {
    setSearchText(text)
    onChangeSearchText(text)
  }

  const renderItem = ({ item }: { item: ProcessPointItem }) => (
    <List.Item
      testID="process-point-item"
      title={item.label}
      style={[
        styles.listItem,
        item.id === selectedItem?.id && {
          backgroundColor: LingoColors.highlightBackground,
        },
      ]}
      titleStyle={styles.listItemTitle}
      onPress={() => setSelectedItem(item)}
      disabled={loading}
    />
  )

  return (
    <View style={styles.root}>
      <ScrollProvider>
        <ShadowTopWrapper>
          <View style={styles.headerContainer}>
            <Typography variant="h6" bold style={styles.header}>
              Select a Process Point
            </Typography>
            <View style={styles.formContainer}>
              <SearchField
                placeholder="Search"
                value={searchText}
                searchButtonVisible={false}
                onChangeText={loading ? () => {} : onChangeSearchText}
              />
              <Dropdown
                label="Site"
                value={siteValue}
                options={sites.map((site) => ({
                  id: site.id,
                  value: site.value,
                }))}
                onChangeValue={loading ? () => {} : onChangeSiteValue}
                disabled={loading}
              />
            </View>
          </View>
        </ShadowTopWrapper>
        <ProcessPointList
          items={filteredItems}
          renderItem={renderItem}
          selectedItem={selectedItem}
          searchText={searchText}
          onChangeSearchText={handleSearchTextChange}
          siteValue={siteValue}
          sites={sites}
          onChangeSiteValue={onChangeSiteValue}
          loading={loading}
        />
        <ShadowBottomWrapper>
          <BottomButtons
            cancelOnPress={onCancel}
            submitOnPress={() => selectedItem && onContinue(selectedItem)}
            submitText="OK"
            cancelText="Cancel"
            isValid={true}
            isLoading={loading}
          />
        </ShadowBottomWrapper>
      </ScrollProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
  },
  headerContainer: {
    gap: V_PADDING,
    padding: V_PADDING,
  },
  formContainer: {
    gap: V_PADDING / 2,
  },
  list: {
    paddingTop: V_PADDING,
    paddingHorizontal: H_PADDING,
  },
  header: {},
  separator: {
    height: V_PADDING / 2,
  },
  buttons: {
    flexDirection: 'row',
    gap: H_PADDING,
    padding: H_PADDING,
  },
  button: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyList: {
    flexGrow: 1,
  },
  listItem: {
    backgroundColor: LingoColors.background.paper,
    borderRadius: DEFAULT_BORDER_RADIUS_LG,
    marginVertical: 2,
  },
  listItemTitle: {
    fontSize: 16,
  },
})

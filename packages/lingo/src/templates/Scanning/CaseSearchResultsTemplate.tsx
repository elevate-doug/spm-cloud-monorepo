import { FC, useEffect, useRef, useState } from 'react'
import {
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import { Touchable } from '../../components'
import {
  ScrollProvider,
  useScroll,
} from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../components/containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import { SearchField } from '../../components/inputs'
import { Typography } from '../../components/typography'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { DEFAULT_BORDER_RADIUS_LG, H_PADDING, V_PADDING } from '../../values'

export type CaseItem = {
  id: string
  caseId: string
  location: string
  city: string
  state: string
  locationName: string
  date: string
  time: string
}

type CaseListProps = {
  items: CaseItem[]
  renderItem: any
  selectedItem?: CaseItem
  loading?: boolean
}

const CaseList: FC<CaseListProps> = ({
  items,
  renderItem,
  selectedItem,
  loading,
}) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()
  const listRef = useRef<FlatList>(null)

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {loading && (
        <ActivityIndicator size="large" color={LingoColors.primary.main} />
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

interface CaseSearchResultsTemplateProps {
  searchText: string
  setSearchText: (text: string) => void
  cases: CaseItem[]
  isLoading: boolean
  isCancelLoading?: boolean
  onCancel: () => void
  onSearch: () => void
  onSelectCase?: (caseItem: CaseItem) => void
}

export const CaseSearchResultsTemplate: FC<CaseSearchResultsTemplateProps> = ({
  searchText,
  setSearchText,
  cases,
  isLoading,
  isCancelLoading = false,
  onCancel,
  onSearch,
  onSelectCase,
}) => {
  const [selectedItem, setSelectedItem] = useState<CaseItem | undefined>()
  const [isInputActive, setIsInputActive] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

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
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  const handleTextChange = (text: string) => {
    setSearchText(text)
    setIsInputActive(true)
  }

  const handleButtonPress = () => {
    if (selectedItem) {
      onSelectCase?.(selectedItem)
    } else {
      onSearch()
    }
  }

  const renderItem = ({ item }: { item: CaseItem }) => {
    const isSelected = item.id === selectedItem?.id

    return (
      <Touchable
        testID="case-result-item"
        onPress={() => {
          console.log('Item pressed:', item.id)
          if (item.id === selectedItem?.id) {
            setSelectedItem(undefined)
          } else {
            setSelectedItem(item)
          }
        }}
        disabled={isLoading}
        selected={isSelected}
        style={({ pressed }) => [styles.listItem, pressed && styles.pressed]}
      >
        <View style={styles.listItemContent}>
          <Typography variant="body1" color={LingoColors.primary.main}>
            {item.caseId}
          </Typography>
          <Typography variant="body2">
            {item.location}, {item.city}, {item.state}, {item.locationName}
          </Typography>
          <Typography variant="body2">
            {item.date} {item.time}
          </Typography>
        </View>
      </Touchable>
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollProvider>
        <ShadowTopWrapper>
          <View style={styles.headerContainer}>
            <Typography variant="h6" bold>
              Search for Case
            </Typography>
            {cases.length === 0 && (
              <Typography variant="body1" color={LingoColors.text.secondary}>
                Enter all or part of the case number and press Search to search
                for the case.
              </Typography>
            )}
            <SearchField
              placeholder="Search for case cart"
              value={searchText}
              onChangeText={handleTextChange}
              minLength={3}
              onSearch={onSearch}
              searchButtonVisible={isInputActive && searchText.length >= 3}
              autoFocus={true}
              testID="case-search-input"
            />
          </View>
        </ShadowTopWrapper>
        <CaseList
          items={cases}
          renderItem={renderItem}
          selectedItem={selectedItem}
          loading={isLoading}
        />
        {(!isKeyboardVisible || cases.length === 0) && (
          <ShadowBottomWrapper>
            <BottomButtons
              showCancelButton={true}
              cancelOnPress={onCancel}
              submitOnPress={handleButtonPress}
              isValid={!!selectedItem || searchText.length >= 3}
              isLoading={isLoading || isCancelLoading}
              submitText={selectedItem ? 'Ok' : 'Search'}
            />
          </ShadowBottomWrapper>
        )}
      </ScrollProvider>
    </SafeAreaView>
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
  list: {
    paddingBottom: V_PADDING,
    paddingHorizontal: H_PADDING,
  },
  separator: {
    height: V_PADDING / 2,
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
    padding: H_PADDING,
  },
  pressed: {
    opacity: 0.7,
  },
  listItemContent: {
    gap: 4,
    paddingVertical: V_PADDING,
    paddingHorizontal: H_PADDING / 2,
  },
  selected: {
    backgroundColor: LingoColors.highlightBackground,
  },
})

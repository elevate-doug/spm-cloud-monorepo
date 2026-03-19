import { FC, LegacyRef, useRef } from 'react'
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { ORRoomPoco } from '../../../../api'
import { Loading, Typography } from '../../components'
import {
  ScrollProvider,
  useScroll,
} from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../components/containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import {
  DialogMessage,
  DialogMessageRef,
} from '../../components/feedback/Dialog/DialogMessage'
import { SearchField } from '../../components/inputs'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { fontDefinitions } from '../../theme/fontDefinitions'
import { H_PADDING, V_PADDING } from '../../values'

export type CaseCartsSelectorProps = {
  title: string
  isLoading: boolean
  onQueryChange: (text: string) => void
  dialogMessageRef?: LegacyRef<DialogMessageRef>
  handleOkPress: () => void | Promise<void>
  handleCancelPress: () => void
  selectedItemId?: string
  setSelectedItemId: (itemId: string) => void
  searchResult: ORRoomPoco[]
  query?: string
}

const ItemList: FC<{
  tasks: ORRoomPoco[]
  renderItem: ListRenderItem<ORRoomPoco>
  listRef: React.RefObject<FlatList<ORRoomPoco>>
}> = ({ tasks, renderItem, listRef }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()
  return (
    <FlatList
      ref={listRef}
      style={styles.list}
      data={tasks}
      renderItem={renderItem}
      keyExtractor={(item) => `case-${item.id?.toString()}`}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
      onContentSizeChange={(_, height) => onContentChange(height)}
      removeClippedSubviews={false}
    />
  )
}

export const CaseCartsSelectorTemplate: FC<CaseCartsSelectorProps> = ({
  onQueryChange,
  dialogMessageRef,
  setSelectedItemId,
  handleOkPress,
  handleCancelPress,
  searchResult,
  isLoading,
  title,
  selectedItemId,
  query,
}) => {
  const listRef = useRef<FlatList>(null)
  const renderItem = ({ item }: { item: ORRoomPoco }) => {
    const isSelected = selectedItemId === item?.id?.toString()
    return (
      <View>
        <TouchableOpacity
          style={styles.itemContainer}
          activeOpacity={1}
          onPress={() => setSelectedItemId(item?.id?.toString())}
        >
          <Typography
            variant="body1"
            style={isSelected ? styles.selectedText : styles.itemText}
          >
            {item.name ?? ''}
          </Typography>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <DialogMessage ref={dialogMessageRef} />
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollProvider>
          <ShadowTopWrapper>
            <Typography variant="h6" style={styles.title} bold>
              {title}
            </Typography>
            <View style={styles.searchContainer}>
              <SearchField
                placeholder="Search"
                value={query ?? ''}
                onChangeText={onQueryChange}
              />
            </View>
          </ShadowTopWrapper>
          <ItemList
            tasks={searchResult}
            renderItem={renderItem}
            listRef={listRef}
          />
          <ShadowBottomWrapper>
            <BottomButtons
              cancelOnPress={handleCancelPress}
              submitOnPress={handleOkPress}
              submitText="OK"
              cancelText="CANCEL"
              isValid={!!selectedItemId}
              isLoading={false}
            />
          </ShadowBottomWrapper>
        </ScrollProvider>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: V_PADDING,
    backgroundColor: LingoColors.common.white,
  },
  title: {
    fontSize: fontDefinitions.headlineLarge.fontSize,
    fontWeight: '500',
    paddingVertical: 6,
    marginBottom: V_PADDING,
  },
  searchContainer: {
    flexDirection: 'column',
    gap: V_PADDING,
    marginBottom: H_PADDING,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: LingoColors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: LingoColors.border,
  },
  itemText: {
    flex: 1,
    color: LingoColors.primary.main,
    paddingVertical: V_PADDING,
    paddingHorizontal: H_PADDING,
  },
  selectedText: {
    color: LingoColors.primary.dark,
    backgroundColor: LingoColors.primary.selected,
    borderBottomWidth: 0,
  },
})

export default CaseCartsSelectorTemplate

import { FC, useEffect, useRef, useState } from 'react'
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native'

import { SearchField, Typography } from '../..'
import { BottomButtons } from '../../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../../theme'
import { fontDefinitions } from '../../../theme/fontDefinitions'
import { H_PADDING, V_PADDING } from '../../../values'
import {
  ScrollProvider,
  useScroll,
} from '../../containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../containers/ShadowTopWrapper/ShadowTopWrapper'
export type SelectorModalItem =
  | {
      label: string
      value: string
    }
  | {
      label: {
        title: string
        subtitle: string
      }
      value: string
    }

export type SelectorModalProps = {
  visible: boolean
  title: string
  subtitle?: string
  query: string
  onQueryChange: (text: string) => void
  handleOkPress?: (item?: SelectorModalItem) => void | Promise<void>
  handleCancelPress: () => void
  items: SelectorModalItem[]
  selectedItem?: SelectorModalItem
  minLength?: number
  submitText?: string
  cancelText?: string
  isValid: boolean
  onSearch?: () => void
  onItemSelect?: (item: SelectorModalItem) => void
}

const ItemList: FC<{
  items: SelectorModalItem[]
  renderItem: (item: SelectorModalItem) => JSX.Element
  selectedItem: SelectorModalItem | null
  scrollViewRef: React.RefObject<ScrollView>
  itemRefs: React.MutableRefObject<Record<string, View | null>>
}> = ({ items, renderItem, selectedItem, scrollViewRef, itemRefs }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()
  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.list}
      onScroll={handleScroll}
      onLayout={(event: any) => onLayout(event.nativeEvent.layout.height)}
      onContentSizeChange={(_: number, height: number) =>
        onContentChange(height)
      }
      keyboardShouldPersistTaps="handled"
    >
      {items.map((item) => (
        <View
          key={`selector-item-${item.value?.toString()}`}
          ref={(el) => {
            itemRefs.current[item.value] = el
          }}
        >
          {renderItem(item)}
        </View>
      ))}
    </ScrollView>
  )
}

export const SelectorModal: FC<SelectorModalProps> = ({
  visible,
  onQueryChange,
  handleOkPress,
  handleCancelPress,
  items,
  title,
  subtitle,
  query,
  selectedItem: initialSelected,
  minLength = 3,
  submitText = 'OK',
  cancelText = 'CANCEL',
  isValid,
  onSearch,
  onItemSelect,
}) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const itemRefs = useRef<Record<string, View | null>>({})
  const [selectedItem, setSelectedItem] = useState<SelectorModalItem | null>(
    initialSelected ?? null
  )

  useEffect(() => {
    setSelectedItem(initialSelected ?? null)
  }, [initialSelected])

  useEffect(() => {
    if (
      visible &&
      selectedItem &&
      scrollViewRef.current &&
      itemRefs.current[selectedItem.value]
    ) {
      setTimeout(
        () => {
          const scrollViewNode =
            (scrollViewRef.current as any).getInnerViewNode?.() ||
            (scrollViewRef.current as any).getScrollableNode?.() ||
            undefined
          if (scrollViewNode) {
            itemRefs.current[selectedItem.value]?.measureLayout(
              scrollViewNode,
              (_x: number, y: number) => {
                scrollViewRef.current?.scrollTo({ y, animated: true })
              },
              () => {}
            )
          }
        } /** No need to delay, but the setTimeout is required to scroll to the correct item */
      )
    }
  }, [visible, selectedItem, items])

  const renderItem = (item: SelectorModalItem) => {
    const isSelected = selectedItem?.value === item?.value
    return (
      <View>
        <TouchableOpacity
          style={{
            ...styles.itemContainer,
            ...(isSelected && styles.selectedItem),
          }}
          activeOpacity={1}
          onPress={() => {
            setSelectedItem(item)
            onItemSelect?.(item)
          }}
        >
          <Typography
            variant="body1"
            color={
              isSelected ? LingoColors.primary.dark : LingoColors.primary.main
            }
          >
            {typeof item.label === 'string' ? item.label : item.label.title}
          </Typography>
          {typeof item.label !== 'string' && (
            <Typography
              variant="caption"
              color={LingoColors.grey[600]}
              style={styles.subtitle}
            >
              {item.label.subtitle}
            </Typography>
          )}
        </TouchableOpacity>
      </View>
    )
  }
  const handleSubmitOnPress = () => {
    if (isValid && selectedItem) handleOkPress?.(selectedItem)
    else handleOkPress?.()
  }

  const handleSearch = () => {
    if (isValid) onSearch?.()
  }

  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        <ScrollProvider>
          <ShadowTopWrapper>
            <Typography variant="h6" bold>
              {title ?? ''}
            </Typography>
            {subtitle && (
              <Typography
                variant="body1"
                color={LingoColors.grey[600]}
                style={styles.subtitle}
              >
                {subtitle}
              </Typography>
            )}
            <View style={styles.searchContainer}>
              <SearchField
                placeholder="Search"
                value={query ?? ''}
                onChangeText={onQueryChange}
                minLength={minLength}
                onSearch={handleSearch}
              />
              {Boolean(query.length && query.length < minLength) && (
                <Typography
                  variant="caption"
                  color={LingoColors.grey[600]}
                  style={styles.minLength}
                >
                  Enter {minLength} characters before searching
                </Typography>
              )}
            </View>
          </ShadowTopWrapper>
          <ItemList
            items={items}
            renderItem={renderItem}
            selectedItem={selectedItem}
            scrollViewRef={scrollViewRef}
            itemRefs={itemRefs}
          />
          <ShadowBottomWrapper>
            <BottomButtons
              cancelOnPress={handleCancelPress}
              submitOnPress={handleSubmitOnPress}
              submitText={submitText}
              cancelText={cancelText}
              isValid={isValid}
              isLoading={false}
            />
          </ShadowBottomWrapper>
        </ScrollProvider>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: V_PADDING,
    paddingBottom: 0,
    backgroundColor: LingoColors.common.white,
  },
  subtitle: {
    fontSize: fontDefinitions.headlineLarge.fontSize,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'column',
    gap: V_PADDING,
    marginTop: V_PADDING,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: LingoColors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: LingoColors.border,
    paddingVertical: V_PADDING,
  },
  selectedItem: {
    backgroundColor: LingoColors.primary.selected,
    borderBottomWidth: 0,
  },
  minLength: {
    marginTop: -V_PADDING / 1.5,
    marginLeft: H_PADDING,
  },
})
export default SelectorModal

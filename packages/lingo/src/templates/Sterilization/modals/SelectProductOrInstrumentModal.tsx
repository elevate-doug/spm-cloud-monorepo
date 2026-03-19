import { FC, useEffect, useMemo, useRef, useState } from 'react'
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native'
import { Provider } from 'react-native-paper'

import { Select, SelectProps, Typography } from '../../../components'
import {
  ScrollProvider,
  useScroll,
} from '../../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../../components/containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import { SelectorWithModalItem } from '../../../components/inputs/SelectWithModal'
import { BottomButtons } from '../../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../../theme'
import { H_PADDING, V_PADDING } from '../../../values'

export type ProductOrInstrumentForList = {
  label: string
  value: string
  type: 'products' | 'instruments'
  siteIds?: string[]
}

export type SelectorProductInstrumentModalProps = {
  visible: boolean
  handleOkPress: (item: ProductOrInstrumentForList) => void | Promise<void>
  handleCancelPress: () => void
  selectedSiteId?: string
  sitesForSelect: SelectProps['options']
  onSiteChange: (siteId: string) => void
  productsOrInstrumentsForList: ProductOrInstrumentForList[]
  selectedProductOrInstrument?: ProductOrInstrumentForList['value']
}

const ItemList: FC<{
  items: SelectorWithModalItem[]
  renderItem: (item: SelectorWithModalItem) => JSX.Element
  selectedItem?: ProductOrInstrumentForList
  scrollViewRef: React.RefObject<ScrollView>
  itemRefs: React.MutableRefObject<Record<string, View | null>>
}> = ({ items, renderItem, scrollViewRef, itemRefs }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()
  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.list}
      onScroll={handleScroll}
      onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
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

const typesForSelect = [
  { label: 'Products', value: 'products' },
  { label: 'Instruments', value: 'instruments' },
]

export const SelectProductOrInstrumentModal: FC<
  SelectorProductInstrumentModalProps
> = ({
  visible,
  handleOkPress,
  handleCancelPress,
  selectedSiteId,
  sitesForSelect,
  onSiteChange,
  productsOrInstrumentsForList,
}) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const itemRefs = useRef<Record<string, View | null>>({})
  const [selectedItem, setSelectedItem] = useState<ProductOrInstrumentForList>()
  const [selectedType, setSelectedType] = useState<'instruments' | 'products'>(
    'instruments'
  )

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
            scrollViewRef.current?.getInnerViewNode?.() ||
            scrollViewRef.current?.getScrollableNode?.() ||
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
  }, [visible, selectedItem, productsOrInstrumentsForList])

  const renderItem = (item: SelectorWithModalItem) => {
    const isSelected = selectedItem?.value === item.value

    const onPress = () => {
      const productOrInstrument = productsOrInstrumentsForList.find(
        (productOrInstrument) => productOrInstrument.value === item.value
      )
      setSelectedItem(productOrInstrument)
    }

    return (
      <View>
        <TouchableOpacity
          style={styles.itemContainer}
          activeOpacity={1}
          onPress={onPress}
        >
          <Typography
            variant="body1"
            style={{
              ...styles.itemText,
              ...(isSelected && styles.selectedText),
            }}
            color={
              isSelected ? LingoColors.primary.dark : LingoColors.primary.main
            }
          >
            {item.label}
          </Typography>
        </TouchableOpacity>
      </View>
    )
  }
  const handleSubmitOnPress = () => {
    if (selectedItem) {
      handleOkPress(selectedItem)
    }
  }

  const onTypeChange = (type: 'products' | 'instruments') => {
    setSelectedType(type)
  }

  const items = useMemo(
    () =>
      productsOrInstrumentsForList.filter((item) => item.type === selectedType),
    [productsOrInstrumentsForList, selectedType]
  )

  return (
    <Modal visible={visible}>
      <Provider>
        <View style={styles.container}>
          <ScrollProvider>
            <ShadowTopWrapper>
              <Typography variant="h6" style={styles.title} bold>
                Select a Product/Instrument
              </Typography>
              <View style={styles.selectorContainer}>
                <Select
                  value={selectedType}
                  options={typesForSelect}
                  showDividers={false}
                  onChangeText={(text) =>
                    onTypeChange(text as 'products' | 'instruments')
                  }
                  label="Type"
                />
                <Select
                  value={selectedSiteId}
                  options={sitesForSelect}
                  showDividers={false}
                  onChangeText={onSiteChange}
                  label="Site"
                />
              </View>

              <Typography variant="body1" style={styles.title} bold>
                Select a{' '}
                {selectedType === 'products' ? 'Product' : 'Instrument'}
              </Typography>
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
                submitText="NEXT"
                cancelText="CANCEL"
                isValid={!!selectedItem}
                isLoading={false}
              />
            </ShadowBottomWrapper>
          </ScrollProvider>
        </View>
      </Provider>
    </Modal>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: V_PADDING,
    paddingVertical: 0,
    backgroundColor: LingoColors.common.white,
  },
  title: {
    paddingVertical: 6,
    marginBottom: V_PADDING,
  },
  selectorContainer: {
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
    paddingVertical: V_PADDING,
    paddingHorizontal: H_PADDING,
  },
  selectedText: {
    backgroundColor: LingoColors.primary.selected,
    borderBottomWidth: 0,
  },
})
export default SelectProductOrInstrumentModal

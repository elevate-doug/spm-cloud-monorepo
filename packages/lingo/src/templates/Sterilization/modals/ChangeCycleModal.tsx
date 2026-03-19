import { FC, useEffect, useRef, useState } from 'react'
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native'
import { Provider } from 'react-native-paper'

import { Typography } from '../../../components'
import {
  ScrollProvider,
  useScroll,
} from '../../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../../components/containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import { BottomButtons } from '../../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../../theme'
import { H_PADDING, V_PADDING } from '../../../values'

export type CycleOption = {
  label: string
  value: string
}

export type ChangeCycleModalProps = {
  visible: boolean
  handleOkPress: (cycleId: string) => void | Promise<void>
  handleCancelPress: () => void
  cycles: CycleOption[]
  selectedCycleId?: string
}

const ItemList: FC<{
  items: CycleOption[]
  renderItem: (item: CycleOption) => JSX.Element
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
          key={`cycle-item-${item.value}`}
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

export const ChangeCycleModal: FC<ChangeCycleModalProps> = ({
  visible,
  handleOkPress,
  handleCancelPress,
  cycles,
  selectedCycleId,
}) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const itemRefs = useRef<Record<string, View | null>>({})
  const [selectedCycle, setSelectedCycle] = useState<CycleOption | undefined>(
    cycles.find((c) => c.value === selectedCycleId)
  )

  useEffect(() => {
    if (
      visible &&
      selectedCycle &&
      scrollViewRef.current &&
      itemRefs.current[selectedCycle.value]
    ) {
      setTimeout(() => {
        const scrollViewNode =
          scrollViewRef.current?.getInnerViewNode?.() ||
          scrollViewRef.current?.getScrollableNode?.() ||
          undefined
        if (scrollViewNode) {
          itemRefs.current[selectedCycle.value]?.measureLayout(
            scrollViewNode,
            (_x: number, y: number) => {
              scrollViewRef.current?.scrollTo({ y, animated: true })
            },
            () => {}
          )
        }
      })
    }
  }, [visible, selectedCycle, cycles])

  const renderItem = (item: CycleOption) => {
    const isSelected = selectedCycle?.value === item.value

    const onPress = () => {
      setSelectedCycle(item)
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
    if (selectedCycle) {
      handleOkPress(selectedCycle.value)
    }
  }

  return (
    <Modal visible={visible}>
      <Provider>
        <View style={styles.container}>
          <ScrollProvider>
            <ShadowTopWrapper>
              <Typography variant="h6" style={styles.title} bold>
                Select a new cycle
              </Typography>
            </ShadowTopWrapper>
            <ItemList
              items={cycles}
              renderItem={renderItem}
              scrollViewRef={scrollViewRef}
              itemRefs={itemRefs}
            />
            <ShadowBottomWrapper>
              <BottomButtons
                cancelOnPress={handleCancelPress}
                submitOnPress={handleSubmitOnPress}
                submitText="CONTINUE"
                cancelText="CANCEL"
                isValid={!!selectedCycle}
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

export default ChangeCycleModal

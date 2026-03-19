import { FC, useRef, useState } from 'react'
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native'

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

export type SelectProductIndexModalProps = {
  visible: boolean
  handleOkPress: (indexNumber: string) => void | Promise<void>
  handleBackPress: () => void
  selectedIndex: string
  indexes: string[]
  productName: string
}

const IndexList: FC<{
  indexes: string[]
  renderIndex: (index: string) => JSX.Element
  selectedIndex?: string
  scrollViewRef: React.RefObject<ScrollView>
}> = ({ indexes, renderIndex, scrollViewRef }) => {
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
      {indexes.map((index) => (
        <View key={`index-item-${index}`}>{renderIndex(index)}</View>
      ))}
    </ScrollView>
  )
}

export const SelectProductIndexModal: FC<SelectProductIndexModalProps> = ({
  visible,
  handleOkPress,
  handleBackPress,
  selectedIndex,
  indexes,
  productName,
}) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [selectedItem, setSelectedItem] = useState<string>(selectedIndex)

  const renderIndex = (index: string) => {
    const isSelected = selectedItem === index
    return (
      <View>
        <TouchableOpacity
          style={styles.itemContainer}
          activeOpacity={1}
          onPress={() => setSelectedItem(index)}
        >
          <Typography
            variant="body1"
            style={{
              ...styles.itemText,
              ...(isSelected && styles.selectedText),
            }}
            color={LingoColors.primary.dark}
          >
            {index}
          </Typography>
        </TouchableOpacity>
      </View>
    )
  }

  const handleSubmitOnPress = async () => {
    if (selectedItem) {
      await handleOkPress(selectedItem)
    }
  }

  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        <ScrollProvider>
          <ShadowTopWrapper>
            <Typography variant="h6" style={styles.title} bold>
              Select a Product and Index
            </Typography>
            <Typography variant="body1" bold>
              Product selection
            </Typography>
            <Typography
              variant="body1"
              style={styles.productName}
              color={LingoColors.text.secondary}
            >
              {productName}
            </Typography>
            <Typography variant="body1" bold>
              Select an Index
            </Typography>
          </ShadowTopWrapper>
          <IndexList
            indexes={indexes}
            renderIndex={renderIndex}
            selectedIndex={selectedIndex}
            scrollViewRef={scrollViewRef}
          />
          <ShadowBottomWrapper>
            <BottomButtons
              cancelOnPress={handleBackPress}
              submitOnPress={handleSubmitOnPress}
              submitText="OK"
              cancelText="BACK"
              isValid={!!selectedItem}
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
    backgroundColor: LingoColors.background.paper,
    paddingTop: V_PADDING,
    paddingHorizontal: H_PADDING,
  },
  title: {
    marginBottom: V_PADDING,
  },
  productName: {
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

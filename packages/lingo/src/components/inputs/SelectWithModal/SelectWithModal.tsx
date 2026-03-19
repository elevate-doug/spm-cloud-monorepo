import React, { FC, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { SelectorModal, SelectorModalItem } from './SelectorModal'
import { LingoColors } from '../../../theme/Colors'
import { DEFAULT_BORDER_RADIUS, H_PADDING, V_PADDING } from '../../../values'
import { Typography } from '../../typography'
import { IconButton } from '../IconButton'

export type SelectorWithModalItem = {
  label: string
  value: string
}

export type SelectProps = {
  title: string
  state?: 'enabled' | 'disabled'
  selectedItem?: SelectorWithModalItem
  items: SelectorWithModalItem[]
  modalTitle: string
  onSelectItem: (item: SelectorWithModalItem) => void
  testID?: string
}

export const SelectWithModal: FC<SelectProps> = ({
  title,
  state = 'disabled',
  selectedItem,
  items,
  modalTitle,
  onSelectItem,
  testID,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [query, setQuery] = useState('')
  const [modalSelectedItem, setModalSelectedItem] = useState<
    SelectorWithModalItem | undefined
  >(selectedItem)

  // Update modal selected item when prop changes
  React.useEffect(() => {
    setModalSelectedItem(selectedItem)
  }, [selectedItem])

  // Reset modal selected item when modal opens
  React.useEffect(() => {
    if (modalVisible) {
      setModalSelectedItem(selectedItem)
    }
  }, [modalVisible, selectedItem])

  const renderDisabledInput = () => {
    return (
      <View
        style={[styles.container, styles.disabledContainer]}
        testID={testID}
      >
        <View style={styles.selectedItemInner}>
          <Typography bold color={LingoColors.grey[600]}>
            {title}
          </Typography>

          <Typography color={LingoColors.grey[600]}>
            {selectedItem?.label ?? ''}
          </Typography>
        </View>
      </View>
    )
  }

  const renderEnabledEmptyInput = () => {
    return (
      <View style={[styles.container, styles.emptyContainer]} testID={testID}>
        <Typography bold>{title}</Typography>

        <IconButton
          icon="plus"
          onPress={() => setModalVisible(true)}
          color={LingoColors.common.white}
          style={styles.addButton}
        />
      </View>
    )
  }

  const renderSelectedInput = () => {
    return (
      <View style={[styles.container]} testID={testID}>
        <View style={styles.selectedItemInner}>
          <Typography bold>{title}</Typography>

          <Typography>{selectedItem?.label ?? ''}</Typography>
        </View>

        <IconButton
          icon="pencil"
          onPress={() => setModalVisible(true)}
          color={LingoColors.common.white}
          style={styles.addButton}
        />
      </View>
    )
  }

  const handleOkPress = (item?: SelectorModalItem) => {
    if (!item) return

    onSelectItem({
      label: typeof item.label === 'string' ? item.label : item.label.title,
      value: typeof item.value === 'string' ? item.value : item.value,
    })
    setModalVisible(false)
  }

  const handleItemSelect = (item: SelectorWithModalItem) => {
    setModalSelectedItem(item)
  }

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      {state === 'disabled'
        ? renderDisabledInput()
        : selectedItem
          ? renderSelectedInput()
          : renderEnabledEmptyInput()}

      <SelectorModal
        visible={modalVisible}
        title={modalTitle}
        items={filteredItems}
        query={query}
        onQueryChange={setQuery}
        handleOkPress={handleOkPress}
        handleCancelPress={() => setModalVisible(false)}
        selectedItem={modalSelectedItem}
        isValid={!!modalSelectedItem}
        onItemSelect={handleItemSelect}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: LingoColors.primary.selected,
    borderRadius: DEFAULT_BORDER_RADIUS * 3,
    paddingLeft: H_PADDING * 2,
    paddingRight: H_PADDING,
    paddingVertical: V_PADDING,
    borderWidth: 0.5,
    borderColor: LingoColors.primary.light,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  disabledContainer: {
    backgroundColor: LingoColors.grey[200],
    borderColor: LingoColors.grey.A100,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: LingoColors.primary.main,
    height: V_PADDING * 2,
    width: V_PADDING * 2,
    padding: 0,
  },
  selectedItemInner: {
    gap: V_PADDING,
  },
})

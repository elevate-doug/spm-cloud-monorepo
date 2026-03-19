/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from 'react'
import { Modal, StyleSheet, View } from 'react-native'

import { TextField, Typography } from '../..'
import { BottomButtons } from '../../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../../theme'
import { V_PADDING } from '../../../values'

export type QuantityModalProps = {
  visible: boolean
  handleOkPress: () => void | Promise<void>
  handleCancelPress: () => void
  quantity?: string | null
  setQuantity: (quantity: string | null) => void
  title?: string
  errorMessage?: string
  maxQuantity?: number
}

export const QuantityModal: FC<QuantityModalProps> = ({
  visible,
  handleOkPress,
  handleCancelPress,
  quantity,
  setQuantity,
  title,
  maxQuantity = Infinity,
  errorMessage,
}) => {
  useEffect(() => {
    setQuantity(quantity ?? '1')

    // don't insert quantity here, this listener is used to set
    // default value when modal is opened
  }, [setQuantity])

  const isValid =
    !isNaN(Number(quantity)) &&
    Number(quantity) > 0 &&
    Number(quantity) <= maxQuantity

  const handleSubmitOnPress = () => {
    if (isValid) handleOkPress()
  }

  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        <View>
          <Typography variant="h6" style={styles.title} bold>
            {title ?? ''}
          </Typography>
          <View style={styles.quantityInputContainer}>
            <TextField
              value={quantity ?? ''}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.quantityInput}
              label="Quantity"
              variant="outlined-big"
              error={Boolean(errorMessage)}
              onSubmitEditing={handleSubmitOnPress}
              selectTextOnFocus
              showClearButton
            />
            <Typography variant="body1" color={LingoColors.error.main}>
              {errorMessage ?? ''}
            </Typography>
          </View>
        </View>

        <BottomButtons
          cancelOnPress={handleCancelPress}
          submitOnPress={handleSubmitOnPress}
          submitText="CONTINUE"
          cancelText="CANCEL"
          isValid={isValid}
          isLoading={false}
        />
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: V_PADDING,
    justifyContent: 'space-between',
  },
  title: {
    paddingVertical: V_PADDING / 2,
    marginBottom: V_PADDING,
  },

  quantityInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  quantityInput: {
    width: '50%',
    textAlign: 'center',
  },
  selectedText: {
    backgroundColor: LingoColors.primary.selected,
    borderBottomWidth: 0,
  },
})
export default QuantityModal

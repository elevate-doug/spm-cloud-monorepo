import { FC } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'

import {
  TextField,
  IconButton,
  Typography,
  ErrorNotification,
} from '../../components'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { useKeyboardDismiss } from '../../hooks/useKeyboardDismiss'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values'

export type TaskQuantitySelectorProps = {
  selectedTask: string
  quantity: string
  onQuantityChange: (quantity: string) => void
  onIncrement: () => void
  onDecrement: () => void
  onAdd: () => void
  onCancel: () => void
  maxQuantity?: number
  errorMessageTitle?: string
  errorMessage?: string
  disabled?: boolean
  warningMessage?: string
  maxQuantityWarning?: string
  onSubmitEditing?: () => void
}

export const TaskQuantitySelector: FC<TaskQuantitySelectorProps> = ({
  selectedTask,
  quantity,
  onQuantityChange,
  onIncrement,
  onDecrement,
  onAdd,
  onCancel,
  maxQuantity = 1,
  errorMessageTitle,
  errorMessage,
  disabled,
  warningMessage,
  maxQuantityWarning,
  onSubmitEditing,
}) => {
  const { isKeyboardVisible, dismissKeyboard } = useKeyboardDismiss()

  const disableIncrement =
    Boolean(errorMessage && errorMessageTitle) || !!warningMessage || disabled
  const disableDecrement = Number(quantity) <= 1 || disabled

  const renderSimpleError = () => {
    return (
      <View style={styles.simpleErrorContainer}>
        <Typography variant="body1" color={LingoColors.error.main}>
          {errorMessage ?? warningMessage ?? ''}
        </Typography>
      </View>
    )
  }

  const isValid =
    maxQuantity === 0 ||
    Boolean(
      !errorMessage &&
        !errorMessageTitle &&
        !disabled &&
        Number(quantity) > 0 &&
        Number(quantity) <= maxQuantity
    )

  const showSimpleErrorOrWarning = Boolean(
    (errorMessage || warningMessage) && !errorMessageTitle
  )
  const showNotification = Boolean(errorMessage && errorMessageTitle)

  const showMaxQuantityWarning =
    Number(quantity) > maxQuantity && !!maxQuantityWarning

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View>
          <Typography variant="h5" style={styles.subtitle}>
            Quantity
          </Typography>
          <Typography variant="h6" style={styles.taskName} bold>
            {selectedTask}
          </Typography>
          <View style={styles.quantityContainer}>
            <View style={styles.quantityInputContainer}>
              {!isKeyboardVisible && (
                <IconButton
                  icon="minus"
                  onPress={onDecrement}
                  disabled={disableDecrement}
                  style={{
                    backgroundColor: disableDecrement
                      ? LingoColors.icon.disabledBackground
                      : LingoColors.icon.enabledBackground,
                  }}
                  color={
                    disableDecrement
                      ? LingoColors.icon.disabled
                      : LingoColors.icon.enabled
                  }
                />
              )}
              <TextField
                value={quantity}
                onChangeText={onQuantityChange}
                keyboardType="numeric"
                style={styles.quantityInput}
                label="Quantity"
                variant="outlined-big"
                disabled={disabled}
                error={
                  Boolean(errorMessage && !errorMessageTitle) ||
                  Boolean(warningMessage)
                }
                onSubmitEditing={onSubmitEditing}
                selectTextOnFocus
                showClearButton
              />
              {!isKeyboardVisible && (
                <IconButton
                  icon="plus"
                  onPress={onIncrement}
                  disabled={disableIncrement}
                  style={{
                    backgroundColor: disableIncrement
                      ? LingoColors.icon.disabledBackground
                      : LingoColors.icon.enabledBackground,
                  }}
                  color={
                    disableIncrement
                      ? LingoColors.icon.disabled
                      : LingoColors.icon.enabled
                  }
                />
              )}
            </View>
            {showSimpleErrorOrWarning && renderSimpleError()}
          </View>
          <ErrorNotification
            visible={showNotification}
            errorMessageTitle={errorMessageTitle ?? ''}
            errorMessage={errorMessage ?? ''}
          />
        </View>

        <BottomButtons
          cancelOnPress={onCancel}
          submitOnPress={onAdd}
          submitText={isKeyboardVisible ? 'UPDATE' : 'ADD'}
          cancelText="CANCEL"
          isValid={isValid}
          isLoading={false}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
    padding: V_PADDING,
    justifyContent: 'space-between',
  },
  subtitle: {
    marginBottom: V_PADDING * 2,
  },
  taskName: {
    alignSelf: 'center',
    marginBottom: V_PADDING,
  },
  quantityContainer: {
    gap: H_PADDING,
    marginBottom: V_PADDING * 2,
  },
  quantityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: H_PADDING,
    width: '100%',
  },
  quantityInput: {
    width: '50%',
    textAlign: 'center',
  },
  simpleErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: H_PADDING / 2,
    marginTop: -H_PADDING / 2,
  },
  maxQuantityContainer: {
    padding: H_PADDING,
    backgroundColor: LingoColors.info.light,
    marginTop: -H_PADDING / 2,
  },
})

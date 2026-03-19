import { FC } from 'react'
import { Modal, StyleSheet, View } from 'react-native'

import { LingoColors } from '../../../theme'
import { DEFAULT_BORDER_RADIUS, V_PADDING } from '../../../values'
import { Typography } from '../../typography'
import { Button } from '../Button/Button'
export type ConfirmDialogProps = {
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmButtonColor?: string
  hideCancelButton?: boolean
  onConfirm: () => void
  onCancel?: () => void
}
export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  confirmButtonColor = LingoColors.primary.main,
  hideCancelButton = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Typography variant="h6" style={styles.title}>
            {title}
          </Typography>
          <Typography variant="body1" style={styles.message}>
            {message}
          </Typography>
          <View style={styles.buttonContainer}>
            {!hideCancelButton && (
              <Button
                mode="text"
                onPress={onCancel}
                customStyle={styles.button}
                customTextStyle={styles.buttonText}
              >
                {cancelText}
              </Button>
            )}
            <Button
              mode="text"
              onPress={onConfirm}
              customStyle={{
                ...styles.button,
                backgroundColor: confirmButtonColor,
              }}
              customTextStyle={
                confirmButtonColor
                  ? { color: LingoColors.common.white }
                  : styles.buttonText
              }
            >
              {confirmText}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: LingoColors.background.paper,
    borderRadius: DEFAULT_BORDER_RADIUS,
    padding: V_PADDING * 1.5,
    width: '80%',
    maxWidth: 400,
    elevation: 24,
    shadowColor: LingoColors.grey[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: DEFAULT_BORDER_RADIUS,
  },
  title: {
    marginBottom: V_PADDING,
    color: LingoColors.text.primary,
    fontWeight: 'bold',
  },
  message: {
    marginBottom: V_PADDING,
    color: LingoColors.text.secondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    minWidth: 64,
  },
  buttonText: {
    color: LingoColors.primary.main,
  },
})

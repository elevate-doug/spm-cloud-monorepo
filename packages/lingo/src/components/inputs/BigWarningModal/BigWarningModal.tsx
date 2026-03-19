import { FC } from 'react'
import { Modal, StatusBar, StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-paper'

import { LingoColors } from '../../../theme'
import { H_PADDING, V_PADDING } from '../../../values'
import { Typography } from '../../typography'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'

export type BigWarningModalProps = {
  visible: boolean
  title: string
  message: string
  checkboxLabel: string
  checked: boolean
  onCheckboxChange: (checked: boolean) => void
  onConfirmPress: () => void
  onCancelPress: () => void
  cancelText: string
  confirmText: string
}

export const BigWarningModal: FC<BigWarningModalProps> = ({
  visible,
  title,
  message,
  checkboxLabel,
  checked,
  onCheckboxChange,
  onConfirmPress,
  onCancelPress,
  cancelText,
  confirmText,
}) => {
  return (
    <Modal visible={visible}>
      <StatusBar
        backgroundColor={LingoColors.error.main}
        barStyle="light-content"
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconHeader}>
            <Icon
              source="alert-octagon"
              color={LingoColors.error.main}
              size={150}
            />
            <Typography variant="h5" bold>
              {title}
            </Typography>
          </View>
          <Typography variant="body1">{message}</Typography>
          <Checkbox
            label={checkboxLabel}
            containerStyle={styles.checkbox}
            checked={checked}
            onValueChange={onCheckboxChange}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            mode="outlined"
            onPress={onCancelPress}
            customStyle={styles.cancelButton}
          >
            {cancelText}
          </Button>
          <Button
            mode="contained-warning"
            onPress={onConfirmPress}
            disabled={!checked}
            customStyle={styles.confirmButton}
          >
            {confirmText}
          </Button>
        </View>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: V_PADDING,
  },
  content: {
    flex: 1,
    padding: V_PADDING,
    gap: V_PADDING,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginTop: V_PADDING,
    backgroundColor: LingoColors.alert.errorFill,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING,
  },
  cancelButton: {
    flex: 1,
    marginRight: H_PADDING / 2,
  },
  confirmButton: {
    flex: 1,
    marginLeft: H_PADDING / 2,
  },
})
export default BigWarningModal

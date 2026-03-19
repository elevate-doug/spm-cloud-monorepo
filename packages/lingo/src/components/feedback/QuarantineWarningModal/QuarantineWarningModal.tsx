import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Dialog, Portal } from 'react-native-paper'

import { LingoColors } from '../../../theme'
import { H_PADDING, V_PADDING } from '../../../values'
import { Button } from '../../inputs'
import { TextField } from '../../inputs/TextField'
import { Typography } from '../../typography'

export type QuarantineWarningModalProps = {
  visible: boolean
  productName: string
  requireCaseNumber: boolean
  caseNumberValue: string
  onCaseNumberChange: (text: string) => void
  caseNumberError?: string
  isCaseNumberValidating?: boolean
  onCancel: () => void
  onContinue: () => void
}

export const QuarantineWarningModal = ({
  visible,
  productName,
  requireCaseNumber,
  caseNumberValue,
  onCaseNumberChange,
  caseNumberError,
  isCaseNumberValidating,
  onCancel,
  onContinue,
}: QuarantineWarningModalProps) => {
  const isContinueDisabled =
    requireCaseNumber &&
    (!caseNumberValue.trim() || !!caseNumberError || !!isCaseNumberValidating)

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>
          <Typography variant="h6" bold>
            Warning
          </Typography>
        </Dialog.Title>
        <Dialog.Content>
          <Typography variant="body1">
            {`The product \u2018${productName}\u2019 is still in quarantine. Do you want to authorize early release from quarantine for this product?`}
          </Typography>
          {requireCaseNumber && (
            <View style={styles.caseNumberContainer}>
              <TextField
                label="Case Number"
                value={caseNumberValue}
                onChangeText={onCaseNumberChange}
                error={!!caseNumberError}
                helperText={caseNumberError}
                testID="quarantine-case-number-input"
              />
              {isCaseNumberValidating && (
                <ActivityIndicator
                  size="small"
                  style={styles.loadingIndicator}
                />
              )}
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="text"
            onPress={onCancel}
            customStyle={styles.buttonContainer}
            testID="quarantine-cancel-button"
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={onContinue}
            customStyle={styles.continueButton}
            disabled={isContinueDisabled}
            testID="quarantine-continue-button"
          >
            Continue
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING / 2,
  },
  continueButton: {
    marginLeft: H_PADDING,
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING / 2,
    backgroundColor: LingoColors.error.main,
  },
  caseNumberContainer: {
    marginTop: V_PADDING,
  },
  loadingIndicator: {
    marginTop: V_PADDING / 2,
  },
})

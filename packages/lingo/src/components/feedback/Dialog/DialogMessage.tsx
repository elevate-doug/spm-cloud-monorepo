import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Dialog, Portal } from 'react-native-paper'

import { LingoColors } from '../../../theme'
import { H_PADDING, V_PADDING } from '../../../values'
import { Button } from '../../inputs'
import { Typography } from '../../typography'

export enum DialogMessageMode {
  None,
  OK,
  Close,
  CloseOK,
  CancelContinue,
  NotCompletedCompleted,
  CancelCreateCase,
  CancelCustom,
  CancelUseCase,
  CancelLoad,
  Warning,
}

export enum DialogMessageResponse {
  Dismissed,
  OK,
  Close,
  Cancel,
  Continue,
  WarningContinue,
  NotCompleted,
  Completed,
  CreateCase,
  EndShift,
  ResetApp,
  UseCase,
}

export type CustomButtons = {
  primaryLabel?: string
  primaryResponse?: DialogMessageResponse
  secondaryLabel?: string
  secondaryResponse?: DialogMessageResponse
}

export type CaseDetails = {
  caseNumber: string
  time: string
  physician: string
  room: string
}

type DialogMessageState = {
  visible: boolean
  title: string
  message: string
  mode: DialogMessageMode
  customButtons?: CustomButtons
  caseDetails?: CaseDetails
  isDanger: boolean
}

export type DialogMessageRef = {
  showModal: (params: {
    title: string
    message: string
    mode?: DialogMessageMode
    customButtons?: CustomButtons
    caseDetails?: CaseDetails
    isDanger?: boolean
  }) => Promise<DialogMessageResponse>
  dismissModal: () => void
}

const DialogMessage = forwardRef<DialogMessageRef>((_props, ref) => {
  const responseResolveRef = useRef<(value: DialogMessageResponse) => void>()
  const [state, setState] = useState<DialogMessageState>({
    visible: false,
    title: '',
    message: '',
    mode: DialogMessageMode.OK,
    isDanger: false,
  })

  useImperativeHandle(ref, () => ({
    showModal: (params: {
      title: string
      message: string
      mode?: DialogMessageMode
      customButtons?: CustomButtons
      caseDetails?: CaseDetails
      isDanger?: boolean
    }): Promise<DialogMessageResponse> => {
      return new Promise((resolve) => {
        // Save the resolve function to call it later
        responseResolveRef.current = resolve
        setState({
          visible: true,
          title: params.title,
          message: params.message,
          mode: params.mode ?? DialogMessageMode.OK,
          customButtons: params.customButtons,
          caseDetails: params.caseDetails,
          isDanger: params.isDanger ?? false,
        })
      })
    },
    dismissModal: () => {
      resetState()
    },
  }))

  const onAction = (response: DialogMessageResponse) => {
    // Call the resolve function from `showModal` with the response
    const resolve = responseResolveRef.current
    // Clear the ref first to prevent multiple calls
    responseResolveRef.current = undefined
    // Reset state to hide the modal
    resetState()
    // Resolve the promise after a short delay to ensure state update happens first
    // This allows any listeners to process the state change before the promise resolves
    setTimeout(() => {
      resolve?.(response)
    }, 0)
  }

  const resetState = () => {
    setState({
      visible: false,
      title: '',
      message: '',
      mode: DialogMessageMode.OK,
      customButtons: undefined,
      caseDetails: undefined,
      isDanger: false,
    })
  }

  const getPrimaryButtonStyle = (baseStyle: ViewStyle): ViewStyle => {
    if (state.isDanger) {
      return {
        ...baseStyle,
        backgroundColor: LingoColors.error.main,
      } as ViewStyle
    }
    return baseStyle
  }

  const render2Buttons = (
    label1: string,
    response1: DialogMessageResponse,
    label2: string,
    response2: DialogMessageResponse
  ) => (
    <>
      <Button
        mode="text"
        onPress={() => onAction(response1)}
        customStyle={styles.buttonContainer}
        testID={
          response1 === DialogMessageResponse.Cancel
            ? 'dialog-cancel-button'
            : `dialog-button-${response1}`
        }
      >
        {label1}
      </Button>
      <Button
        mode="contained"
        customStyle={getPrimaryButtonStyle(
          state.mode === DialogMessageMode.Warning
            ? styles.warningButton
            : styles.rightButton
        )}
        onPress={() => onAction(response2)}
        testID={
          response2 === DialogMessageResponse.UseCase
            ? 'dialog-use-case-button'
            : response2 === DialogMessageResponse.CreateCase
              ? 'dialog-create-case-button'
              : `dialog-button-${response2}`
        }
      >
        {label2}
      </Button>
    </>
  )

  const renderButtons = () => {
    if (state.mode === DialogMessageMode.None) {
      return null
    } else if (state.mode === DialogMessageMode.OK) {
      return (
        <Button
          mode="contained"
          onPress={() => onAction(DialogMessageResponse.OK)}
          customStyle={getPrimaryButtonStyle(styles.buttonContainer)}
          testID="dialog-ok-button"
        >
          OK
        </Button>
      )
    } else if (state.mode === DialogMessageMode.Warning) {
      return render2Buttons(
        'Cancel',
        DialogMessageResponse.Cancel,
        'Continue',
        DialogMessageResponse.WarningContinue
      )
    } else if (state.mode === DialogMessageMode.Close) {
      return (
        <Button
          mode="contained"
          onPress={() => onAction(DialogMessageResponse.Close)}
          customStyle={getPrimaryButtonStyle(styles.buttonContainer)}
        >
          Close
        </Button>
      )
    } else if (state.mode === DialogMessageMode.CloseOK) {
      return render2Buttons(
        'Close',
        DialogMessageResponse.Close,
        'OK',
        DialogMessageResponse.OK
      )
    } else if (state.mode === DialogMessageMode.CancelContinue) {
      return render2Buttons(
        'Cancel',
        DialogMessageResponse.Cancel,
        'Continue',
        DialogMessageResponse.Continue
      )
    } else if (state.mode === DialogMessageMode.CancelLoad) {
      return render2Buttons(
        'Back',
        DialogMessageResponse.Cancel,
        'Cancel Load',
        DialogMessageResponse.Continue
      )
    } else if (state.mode === DialogMessageMode.NotCompletedCompleted) {
      return render2Buttons(
        'Not Completed',
        DialogMessageResponse.NotCompleted,
        'Completed',
        DialogMessageResponse.Completed
      )
    } else if (state.mode === DialogMessageMode.CancelCreateCase) {
      return render2Buttons(
        'Cancel',
        DialogMessageResponse.Cancel,
        'Create Case',
        DialogMessageResponse.CreateCase
      )
    } else if (state.mode === DialogMessageMode.CancelUseCase) {
      return render2Buttons(
        'CANCEL',
        DialogMessageResponse.Cancel,
        'USE CASE',
        DialogMessageResponse.UseCase
      )
    } else if (state.mode === DialogMessageMode.CancelCustom) {
      return render2Buttons(
        state.customButtons?.secondaryLabel ?? 'Cancel',
        state.customButtons?.secondaryResponse ?? DialogMessageResponse.Cancel,
        state.customButtons?.primaryLabel ?? 'Custom',
        state.customButtons?.primaryResponse ?? DialogMessageResponse.OK
      )
    }
  }

  const renderCaseDetails = () => {
    if (!state.caseDetails) return null

    return (
      <View style={styles.caseDetailsContainer}>
        <Typography variant="body1">
          Case number {state.caseDetails.caseNumber} already exists:
        </Typography>
        <View style={styles.detailsRow}>
          <Typography variant="body1" bold>
            Time:
          </Typography>
          <Typography variant="body1" style={styles.detailValue}>
            {state.caseDetails.time}
          </Typography>
        </View>
        <View style={styles.detailsRow}>
          <Typography variant="body1" bold>
            Physician:
          </Typography>
          <Typography variant="body1" style={styles.detailValue}>
            {state.caseDetails.physician}
          </Typography>
        </View>
        <View style={styles.detailsRow}>
          <Typography variant="body1" bold>
            Room:
          </Typography>
          <Typography variant="body1" style={styles.detailValue}>
            {state.caseDetails.room}
          </Typography>
        </View>
        <Typography variant="body1" style={styles.questionText}>
          Do you want to use this existing case or cancel changing the case
          number?
        </Typography>
      </View>
    )
  }

  return (
    <Portal>
      <Dialog
        visible={state.visible}
        onDismiss={() => onAction(DialogMessageResponse.Dismissed)}
      >
        <Dialog.Title>
          <Typography variant="h6" bold>
            {state.title}
          </Typography>
        </Dialog.Title>
        <Dialog.Content>
          {/* eslint-disable-next-line no-constant-condition */}
          {state.caseDetails ? (
            renderCaseDetails()
          ) : (
            <Typography variant="body1">{state.message}</Typography>
          )}
        </Dialog.Content>
        <Dialog.Actions>{renderButtons()}</Dialog.Actions>
      </Dialog>
    </Portal>
  )
})

DialogMessage.displayName = 'DialogMessage'

export { DialogMessage }

const styles = StyleSheet.create({
  rightButton: {
    marginLeft: H_PADDING,
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING / 2,
  },
  caseDetailsContainer: {
    marginTop: H_PADDING,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: V_PADDING,
  },
  detailValue: {
    flex: 1,
  },
  questionText: {
    marginTop: V_PADDING,
  },
  buttonContainer: {
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING / 2,
  },
  warningButton: {
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING / 2,
    backgroundColor: LingoColors.error.main,
  },
})

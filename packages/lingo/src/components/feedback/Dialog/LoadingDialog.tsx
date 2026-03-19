import { forwardRef, useImperativeHandle } from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Dialog, Portal } from 'react-native-paper'

import { DialogState, useDialog } from './useDialog'
import { V_PADDING } from '../../../values'
import { Button } from '../../inputs/Button'
import { Typography } from '../../typography'
export type LoadingDialogProps = {
  dialogProps: DialogState
}
export type LoadingDialogRef = {
  show: () => void
  hide: () => void
}
export const LoadingDialog = forwardRef<LoadingDialogRef, LoadingDialogProps>(
  (_props, ref) => {
    const { state, setState } = useDialog(_props.dialogProps)
    useImperativeHandle(ref, () => ({
      show: () => {
        setState({
          ...state,
          visible: true,
        })
      },
      hide: () => {
        setState({
          ...state,
          visible: false,
        })
      },
    }))
    const onDismiss = () => {
      setState({ ...state, visible: false })
    }
    return (
      <Portal>
        <Dialog
          dismissable={false}
          visible={state.visible}
          onDismiss={onDismiss}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: V_PADDING,
            gap: V_PADDING,
          }}
        >
          {state.loading && <ActivityIndicator size="large" />}
          <View style={{ gap: V_PADDING / 3 }}>
            <Typography
              variant="subtitle1"
              style={{ textAlign: 'center', fontWeight: 'bold' }}
            >
              {state.title}
            </Typography>
            <Typography variant="body2" style={{ textAlign: 'center' }}>
              {state.message}
            </Typography>
          </View>
          {state.secondaryCta && (
            <Button mode="text" onPress={state.secondaryCta.onPress}>
              {state.secondaryCta.text}
            </Button>
          )}
          {state.primaryCta && (
            <Button mode="contained" onPress={state.primaryCta.onPress}>
              {state.primaryCta.text}
            </Button>
          )}
        </Dialog>
      </Portal>
    )
  }
)
LoadingDialog.displayName = 'LoadingDialog'

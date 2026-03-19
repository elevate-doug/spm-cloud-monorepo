import { SafeAreaView, StyleSheet, View } from 'react-native'

import { Button } from '../../components'
import { V_PADDING } from '../../values'

type Props = {
  showCancelButton?: boolean
  cancelOnPress?: () => void
  submitOnPress?: () => void
  isValid: boolean
  isLoading?: boolean
  isRedButton?: boolean
  submitText?: string
  cancelText?: string
  submitTestID?: string
  cancelTestID?: string
}

/**
 * A generic container with 2 buttons, a primary and a secondary call to action,
 * stacked in a row horizontally.
 */
export const BottomButtons = ({
  showCancelButton = true,
  cancelOnPress,
  submitOnPress,
  isValid,
  isLoading = false,
  isRedButton = false,
  submitText = 'Save',
  cancelText = 'Cancel',
  submitTestID,
  cancelTestID,
}: Props) => {
  return (
    <SafeAreaView>
      <View style={styles.btnGroup}>
        {showCancelButton && (
          <Button
            mode="outlined"
            onPress={cancelOnPress}
            customStyle={styles.btn}
            disabled={isLoading}
            testID={cancelTestID}
          >
            {cancelText}
          </Button>
        )}
        <Button
          mode={isRedButton ? 'contained-warning' : 'contained'}
          onPress={submitOnPress}
          customStyle={styles.btn}
          disabled={!isValid}
          loading={isLoading}
          testID={submitTestID}
        >
          {submitText}
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  btnGroup: {
    flexDirection: 'row',
    gap: V_PADDING,
  },
  btn: {
    flex: 1,
  },
})

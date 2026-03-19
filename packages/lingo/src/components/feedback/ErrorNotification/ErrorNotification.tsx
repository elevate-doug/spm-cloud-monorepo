import { FC } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { LingoColors } from '../../../theme'
import { DEFAULT_BORDER_RADIUS, H_PADDING, V_PADDING } from '../../../values'
import { Typography } from '../../typography'

const DEFAULT_VERTICAL_PADDING = 16

export type ErrorNotificationProps = {
  errorMessageTitle: string
  errorMessage: string
  visible: boolean
  style?: StyleProp<ViewStyle>
}

const ErrorNotification: FC<ErrorNotificationProps> = ({
  errorMessageTitle,
  errorMessage,
  visible,
  style,
}) => {
  if (!visible) return null

  return (
    <View style={[styles.errorMessageContainer, style]}>
      <Typography
        variant="body1"
        color={LingoColors.alert.errorContent}
        style={styles.errorTitle}
        bold
      >
        {errorMessageTitle}
      </Typography>
      <Typography variant="body2" color={LingoColors.alert.errorContent}>
        {errorMessage}
      </Typography>
    </View>
  )
}

ErrorNotification.displayName = 'ErrorNotification'

export { ErrorNotification }

const styles = StyleSheet.create({
  errorMessageContainer: {
    backgroundColor: LingoColors.alert.errorFill,
    padding: V_PADDING || DEFAULT_VERTICAL_PADDING, // Sometimes V_PADDING is comming as undefined
    borderRadius: DEFAULT_BORDER_RADIUS,
  },
  errorTitle: {
    marginBottom: H_PADDING || DEFAULT_VERTICAL_PADDING / 2,
  },
})

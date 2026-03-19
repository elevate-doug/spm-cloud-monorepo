import React, { FC, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { LingoColors } from '../../../theme/Colors'
import { DEFAULT_BORDER_RADIUS, V_PADDING } from '../../../values'
import { Typography } from '../../typography'
import { IconButton } from '../IconButton'

export type WarningAlertProps = {
  title: string
  message: string
  hidden?: boolean
  onClose?: () => void
  type?: 'info' | 'error'
  timeToClose?: number
}

export const WarningAlert: FC<WarningAlertProps> = ({
  title,
  message,
  hidden,
  onClose,
  type = 'info',
  timeToClose,
}) => {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (timeToClose && onClose) {
      timeout = setTimeout(onClose, timeToClose)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [timeToClose, onClose])

  if (hidden) return null

  return (
    <View style={styles[type].container}>
      <View style={styles[type].titleContainer}>
        <Text style={styles[type].title}>{title}</Text>
        {!!onClose && (
          <IconButton
            onPress={onClose}
            icon="close"
            size={22}
            style={styles[type].icon}
            color={styles[type].icon.color}
          />
        )}
      </View>
      <Typography
        style={styles[type].message}
        color={styles[type].message.color}
      >
        {message}
      </Typography>
    </View>
  )
}

const styles = {
  info: StyleSheet.create({
    container: {
      backgroundColor: LingoColors.info.light,
      padding: V_PADDING,
      borderRadius: DEFAULT_BORDER_RADIUS,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    icon: { padding: 0, marginBottom: 4, color: LingoColors.info.dark },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: LingoColors.info.dark,
      marginBottom: 4,
    },
    message: {
      fontSize: 14,
      color: LingoColors.info.dark,
    },
  }),
  error: StyleSheet.create({
    container: {
      backgroundColor: LingoColors.alert.errorFill,
      padding: V_PADDING,
      borderRadius: DEFAULT_BORDER_RADIUS,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    icon: {
      padding: 0,
      marginBottom: 4,
      color: LingoColors.alert.errorContent,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    message: {
      fontSize: 14,
      color: LingoColors.alert.errorContent,
    },
  }),
}

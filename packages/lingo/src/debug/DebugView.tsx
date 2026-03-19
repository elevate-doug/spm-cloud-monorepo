import { FC, ReactNode, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { Touchable } from '../components'
import { Button, IconButton } from '../components/inputs'
import { Typography } from '../components/typography/Typography'
import { LingoColors } from '../theme/Colors'
import { H_PADDING, V_PADDING } from '../values'

/**
 * Debug wrapper view that puts debug UI content in a consistent UI container.
 */
export const DebugView: FC<{
  children: ReactNode
  initialStateVisible?: boolean
  toggleDebugView?: () => void
  onCancel?: () => void
}> = ({ children, initialStateVisible = true, toggleDebugView, onCancel }) => {
  const [isVisible, setIsVisible] = useState(initialStateVisible)

  if (!__DEV__) return null

  if (!isVisible)
    return (
      <SafeAreaView style={styles.openButton}>
        <View style={styles.touchable}>
          <Touchable
            style={{
              backgroundColor: 'transparent',
              alignSelf: 'center',
            }}
            onPress={() => {
              setIsVisible(true)
              toggleDebugView?.()
            }}
          >
            <Typography
              variant="caption"
              bold
              color={LingoColors.primary.dark}
              style={{
                width: 140,
                textAlign: 'right',
                textAlignVertical: 'center',
              }}
            >
              Open Debug View
            </Typography>
          </Touchable>
          <IconButton
            onPress={() => {
              setIsVisible(true)
              toggleDebugView?.()
            }}
            icon="arrow-up"
            color={LingoColors.primary.main}
          />
        </View>
      </SafeAreaView>
    )

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.titleContainer}>
        <Typography variant="caption" bold style={styles.title}>
          Debug View
        </Typography>
        <View style={styles.buttonContainer}>
          {onCancel && (
            <Button
              mode="outlined"
              onPress={onCancel}
              customStyle={styles.cancelButton}
            >
              Cancel
            </Button>
          )}
          <IconButton
            onPress={() => {
              setIsVisible(false)
              toggleDebugView?.()
            }}
            icon="close"
            color={LingoColors.primary.main}
          />
        </View>
      </View>
      <ScrollView>
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: LingoColors.border,
    backgroundColor: LingoColors.background.paper,
    gap: V_PADDING / 3,
    zIndex: 1000,
  },
  titleContainer: {
    flexDirection: 'row',
    paddingVertical: V_PADDING / 2,
    paddingHorizontal: H_PADDING,
    backgroundColor: LingoColors.background.dimmed,
    borderBottomWidth: 1,
    borderColor: LingoColors.border,
  },
  title: {
    flex: 1,
    textAlignVertical: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: H_PADDING / 2,
  },
  cancelButton: {
    minWidth: 80,
  },
  spacer: {
    flex: 1,
  },
  content: {
    padding: H_PADDING,
    gap: V_PADDING,
  },
  openButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  touchable: {
    position: 'absolute',
    flexDirection: 'row',
  },
})

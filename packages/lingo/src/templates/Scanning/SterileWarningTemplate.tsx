import { FC, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Checkbox } from 'react-native-paper'

import ExclamationMarkIcon from '../../assets/icons/ExclamationMarkIcon'
import { Typography } from '../../components'
import { Text } from '../../components/data-display'
import { Button } from '../../components/inputs'
import { LingoColors } from '../../theme'
import { DEFAULT_BORDER_RADIUS, H_PADDING, V_PADDING } from '../../values'

export type SterileWarningTemplateProps = {
  text: string
  mode: 'maintenance' | 'sterile'
  onCancel: () => void
  onContinue: () => void
}
export const SterileWarningTemplate: FC<SterileWarningTemplateProps> = ({
  text,
  mode,
  onCancel,
  onContinue,
}) => {
  const [checked, setChecked] = useState(false)
  const onChecked = () => setChecked(!checked)
  const renderMaintenanceButtons = () => {
    if (mode !== 'maintenance') return null
    return (
      <View style={[styles.buttons, styles.maintanenceButtons]}>
        <Button mode="outlined" customStyle={styles.cancel} onPress={onCancel}>
          Cancel
        </Button>
        <Button
          mode="elevated"
          customStyle={styles.continue}
          disabled={!checked}
          onPress={onContinue}
        >
          Continue
        </Button>
      </View>
    )
  }
  const renderSterileButtons = () => {
    if (mode !== 'sterile') return null
    return (
      <View style={[styles.buttons, styles.sterileButtons]}>
        <Button
          mode="elevated"
          customStyle={styles.continue}
          onPress={onContinue}
        >
          OK
        </Button>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <ExclamationMarkIcon width="150" height="150" />
          <Typography variant="h6" style={styles.header}>
            Sterile Warning
          </Typography>
        </View>
        <Typography variant="body1" style={styles.text}>
          {text}
        </Typography>
        {mode === 'maintenance' && (
          <TouchableOpacity style={styles.checkbox} onPress={onChecked}>
            <Checkbox.Android
              status={checked ? 'checked' : 'unchecked'}
              color={LingoColors.primary.main}
              onPress={onChecked}
            />
            <Text variant={'body1'} style={styles.checkboxLabel}>
              Yes, deliver this product
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {renderMaintenanceButtons()}
      {renderSterileButtons()}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: V_PADDING,
    backgroundColor: LingoColors.background.paper,
  },
  content: {
    flex: 1,
    paddingHorizontal: H_PADDING,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    marginHorizontal: 8,
    marginVertical: V_PADDING,
  },
  text: {
    fontSize: 18,
    marginTop: V_PADDING,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    marginTop: V_PADDING,
    borderRadius: DEFAULT_BORDER_RADIUS,
    backgroundColor: 'rgba(211, 47, 47, 0.04)',
  },
  checkboxLabel: {
    fontSize: 18,
    marginLeft: 4,
  },
  buttons: {
    flexDirection: 'row',
    padding: V_PADDING,
    marginTop: V_PADDING,
    backgroundColor: LingoColors.background.paper,
    shadowColor: LingoColors.common.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
  },
  maintanenceButtons: {
    justifyContent: 'space-between',
  },
  sterileButtons: {
    justifyContent: 'flex-end',
  },
  cancel: {
    height: 42,
    flex: 0.45,
  },
  continue: {
    height: 42,
    flex: 0.4,
    backgroundColor: LingoColors.error.main,
  },
})
export default SterileWarningTemplate

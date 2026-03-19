import { FC, useState } from 'react'
import { View, Switch, StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'

import { V_PADDING, H_PADDING } from '../../values'
import { Touchable } from '../buttons'
import { Typography } from '../typography'

// TODO: add more control types as needed
// Tip: use the 'foo' type to show how to handle custom control types
type ControlType = 'switch' | 'foo'

type ControlOnChangeType = (value: any) => void

interface Control {
  type: ControlType
  onChange?: ControlOnChangeType
}

export type MenuSubitemProps = {
  title: string
  onPress?: () => void
  isLast?: boolean
  control?: Control
}

/**
 * Menu Subitem
 *
 * - Displays a menu subitem used within a `MenuItem` accordion
 * - Displays a title and an optional control
 *
 * @param title - The title of the subitem
 * @param onPress - The callback function when the subitem is pressed
 * @param isLast - Whether the subitem is the last one in the list
 * @param control - The control to be displayed in the subitem
 */
export const MenuSubitem: FC<MenuSubitemProps> = ({
  title,
  onPress,
  isLast,
  control,
}) => {
  const [switchValue, setSwitchValue] = useState(false)

  const handleSwitchChange = (value: boolean) => {
    setSwitchValue(value)
    control?.onChange?.(value)
  }

  const _onPress = () => {
    if (control) {
      switch (control.type) {
        case 'switch':
          handleSwitchChange(!switchValue)
          break
        case 'foo':
          // just showing how to handle custom control types
          throw new Error('foo control not implemented yet')
      }
    } else {
      onPress?.()
    }
  }

  return (
    <>
      <Touchable onPress={_onPress} style={styles.touchable}>
        <View style={styles.container}>
          <Typography primary variant="body2">
            {title}
          </Typography>
          {control && control.type === 'switch' && (
            <Switch
              style={styles.switch}
              value={switchValue}
              onValueChange={handleSwitchChange}
            />
          )}
        </View>
        {!isLast && <Divider />}
      </Touchable>
      {isLast && <Divider />}
    </>
  )
}

const styles = StyleSheet.create({
  touchable: {
    paddingLeft: V_PADDING * 3,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: V_PADDING,
  },
  switch: {
    position: 'absolute',
    right: 0,
    top: V_PADDING / 1.5,
    bottom: V_PADDING / 1.5,
    marginRight: H_PADDING * 2,
  },
})

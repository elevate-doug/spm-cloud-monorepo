import { forwardRef, useState } from 'react'
import { Pressable, PressableProps, View } from 'react-native'
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes'

import { LingoColors } from '../../../theme'

export type TouchableProps = {
  selected?: boolean
} & PressableProps

export const Touchable = forwardRef<View, TouchableProps>((props, ref) => {
  const [active, setActive] = useState(false)

  const _onPressIn = () => {
    setActive(true)
  }

  const _onPressOut = () => {
    setActive(false)
  }

  const _onPress = (event: GestureResponderEvent) => {
    props?.onPress?.(event)
  }

  return (
    <Pressable
      ref={ref}
      {...props}
      onPressIn={_onPressIn}
      onPressOut={_onPressOut}
      onPress={_onPress}
      style={[
        props.style as never,
        {
          backgroundColor:
            active || props.selected
              ? LingoColors.primary.states.selected
              : LingoColors.background.default,
        },
      ]}
    />
  )
})

Touchable.displayName = 'Touchable'

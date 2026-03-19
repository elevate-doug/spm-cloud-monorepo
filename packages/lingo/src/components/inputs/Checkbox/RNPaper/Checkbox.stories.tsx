import React, { useState } from 'react'
import { View } from 'react-native'
import { Checkbox } from 'react-native-paper'

export const CheckboxStory = () => {
  const [checked, setChecked] = useState(false)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked(!checked)
        }}
      />
    </View>
  )
}

export default {
  title: 'OutOfBox/Inputs/Checkbox',
  component: CheckboxStory,
}

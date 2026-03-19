import React, { useState } from 'react'
import { View } from 'react-native'
import { RadioButton } from 'react-native-paper'

export const RadioButtonStory = () => {
  const [value, setValue] = useState('first')

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <RadioButton.Group
        onValueChange={(value) => setValue(value)}
        value={value}
      >
        <RadioButton.Item label="First" value="first" />
        <RadioButton.Item label="Second" value="second" />
      </RadioButton.Group>
    </View>
  )
}

export default {
  title: 'OutOfBox/Inputs/RadioButton',
  component: RadioButtonStory,
}

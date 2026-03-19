import { action } from '@storybook/addon-actions'
import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'

const IconButtonStory = () => (
  <View style={{ padding: 10 }}>
    <IconButton
      icon="camera"
      size={24}
      onPress={action('Icon button pressed')}
    />
  </View>
)

const meta: Meta<typeof IconButtonStory> = {
  title: 'OutOfBox/Inputs/IconButton',
  component: IconButtonStory,
}

export default meta

const Template: StoryFn = (args) => <IconButtonStory {...args} />

export const Default = Template.bind({})
Default.args = {}

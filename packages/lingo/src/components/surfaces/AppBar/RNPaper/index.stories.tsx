import { action } from '@storybook/addon-actions'
import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { Appbar } from 'react-native-paper'

export const AppbarStory = () => (
  <Appbar.Header>
    <Appbar.Content title="Title" />
    <Appbar.Action icon="magnify" onPress={action('Magnify button pressed')} />
    <Appbar.Action
      icon="dots-vertical"
      onPress={action('Dots-vertical button pressed')}
    />
  </Appbar.Header>
)

const meta: Meta<typeof AppbarStory> = {
  title: 'OutOfBox/Surfaces/Appbar',
  component: AppbarStory,
  argTypes: {
    onPress: { action: 'pressed' },
  },
}

export default meta

const Template: StoryFn = (args) => <AppbarStory {...args} />

export const Default = Template.bind({})
Default.args = {}

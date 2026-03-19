import { action } from '@storybook/addon-actions'
import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { FAB } from 'react-native-paper'

const FABStory = () => (
  <FAB
    icon="plus"
    onPress={action('Fab pressed')}
    style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
  />
)

const meta: Meta<typeof FABStory> = {
  title: 'OutOfBox/Inputs/FloatingActionButton',
  component: FABStory,
}

export default meta

const Template: StoryFn = (args) => <FABStory {...args} />

export const Default = Template.bind({})
Default.args = {}

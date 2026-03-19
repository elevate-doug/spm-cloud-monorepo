import { action } from '@storybook/addon-actions'
import { Meta, StoryFn } from '@storybook/react'
import React, { FC, useState } from 'react'
import { View, Button } from 'react-native'
import { Snackbar } from 'react-native-paper'

interface SnackbarStoryProps {
  onToggleSnackBar: () => void
  onDismissSnackBar: () => void
  onActionPress: () => void
}

const SnackbarStory: FC<SnackbarStoryProps> = ({
  onToggleSnackBar,
  onDismissSnackBar,
}) => {
  const [visible, setVisible] = useState(false)

  const toggleSnackBar = () => {
    onToggleSnackBar()
    setVisible(!visible)
  }

  const dismissSnackBar = () => {
    onDismissSnackBar()
    setVisible(false)
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Toggle Snackbar" onPress={toggleSnackBar} />
      <Snackbar
        visible={visible}
        onDismiss={dismissSnackBar}
        action={{
          label: 'Undo',
          onPress: () => {
            action('Snackbar pressed')
          },
        }}
      >
        Snackbar Example
      </Snackbar>
    </View>
  )
}

const meta: Meta<typeof SnackbarStory> = {
  title: 'OutOfBox/Feedback/Snackbar',
  component: SnackbarStory,
  argTypes: {
    onToggleSnackBar: { action: 'toggled snackbar' },
    onDismissSnackBar: { action: 'dismissed snackbar' },
    onActionPress: { action: 'Snackbar press' },
  },
}

export default meta

const Template: StoryFn<SnackbarStoryProps> = (args) => (
  <SnackbarStory {...args} />
)

export const Default = Template.bind({})
Default.args = {}

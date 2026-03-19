import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Dialog, Portal, Text } from 'react-native-paper'

export const DialogStory = () => {
  const [visible, setVisible] = useState(false)

  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button onPress={showDialog}>Show Dialog</Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text>This is a dialog example</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

export default {
  title: 'OutOfBox/Feedback/Dialog',
  component: DialogStory,
}

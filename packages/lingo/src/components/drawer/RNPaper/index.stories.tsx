import React from 'react'
import { Drawer } from 'react-native-paper'

export const DrawerStory = () => (
  <Drawer.Section title="Some title">
    <Drawer.Item label="First Item" icon="folder" active />
    <Drawer.Item label="Second Item" icon="folder" />
  </Drawer.Section>
)

export default {
  title: 'OutOfBox/Navigation/Drawer',
  component: DrawerStory,
}

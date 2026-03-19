import React from 'react'
import { List } from 'react-native-paper'

export const AccordionStory = () => (
  <List.Accordion
    title="Accordion"
    left={(props) => <List.Icon {...props} icon="folder" />}
  >
    <List.Item title="First item" />
    <List.Item title="Second item" />
  </List.Accordion>
)

export default {
  title: 'OutOfBox/Surfaces/Accordion',
  component: AccordionStory,
}

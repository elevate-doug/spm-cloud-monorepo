import React from 'react'
import { Card, Text } from 'react-native-paper'

export const CardStory = () => (
  <Card>
    <Card.Title title="Card Title" subtitle="Card Subtitle" />
    <Card.Content>
      <Text>Card content</Text>
    </Card.Content>
  </Card>
)

export default {
  title: 'OutOfBox/Surfaces/Card',
  component: CardStory,
}

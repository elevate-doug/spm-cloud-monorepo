import React, { useState } from 'react'
import { Banner } from 'react-native-paper'

export const ClosableAlertStory = () => {
  const [visible, setVisible] = useState(true)

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: 'Close',
          onPress: () => setVisible(false),
        },
      ]}
      icon="alert"
    >
      This is a closable alert banner (Banner in RN Paper).
    </Banner>
  )
}

export default {
  title: 'OutOfBox/Feedback/Alert',
  component: ClosableAlertStory,
}

import React from 'react'
import { View } from 'react-native'
import { ProgressBar } from 'react-native-paper'

import { LingoColors } from '../../../../theme/Colors'

export const ProgressBarStory = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'column',
      alignContent: 'center',
    }}
  >
    <ProgressBar progress={0.5} color={LingoColors.primary.main} />
  </View>
)

export default {
  title: 'OutOfBox/Feedback/ProgressBar',
  component: ProgressBarStory,
}

import { StyleSheet, View, ActivityIndicator } from 'react-native'

import { LingoColors } from '../../../theme/Colors'

export const Loading = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={LingoColors.primary.main} />
  </View>
)

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
})

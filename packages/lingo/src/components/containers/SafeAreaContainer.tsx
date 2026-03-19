import { PropsWithChildren, FC } from 'react'
import { SafeAreaView, StyleProp, StyleSheet, ViewStyle } from 'react-native'

export const SafeAreaContainer: FC<
  PropsWithChildren<{ style?: StyleProp<ViewStyle> | undefined }>
> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

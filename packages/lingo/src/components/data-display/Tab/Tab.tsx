import { FC, ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

export interface TabProps {
  label: string
  badge?: string
  disabled?: boolean
  children: ReactNode
}

export const Tab: FC<TabProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
})

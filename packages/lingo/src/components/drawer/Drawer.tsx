import { FC } from 'react'
import { SafeAreaView, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { Menu, MenuItemProps } from '../menu'

export interface DrawerProps {
  items: MenuItemProps[]
  appVersion: string
  menuStyle?: StyleProp<ViewStyle>
}

export const Drawer: FC<DrawerProps> = ({ items, appVersion, menuStyle }) => (
  <SafeAreaView style={styles.root}>
    <Menu items={items} appVersion={appVersion} style={menuStyle} />
  </SafeAreaView>
)

const styles = StyleSheet.create({
  root: { flex: 1 },
})

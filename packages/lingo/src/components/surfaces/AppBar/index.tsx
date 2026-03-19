import type { ComponentType } from 'react'
import { FC } from 'react'
import { Platform, Pressable, StyleSheet } from 'react-native'
import { Appbar as PaperAppbar } from 'react-native-paper'

import { LingoColors } from '../../../theme'

// Type for MaterialCommunityIcons component
type MaterialCommunityIconsType = ComponentType<{
  name: string
  size?: number
  color?: string
  style?: unknown
}>

// Conditionally import MaterialCommunityIcons for web
let MaterialCommunityIcons: MaterialCommunityIconsType | null = null
if (Platform.OS === 'web') {
  try {
    // Try to use @expo/vector-icons directly on web
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    MaterialCommunityIcons =
      require('@expo/vector-icons/MaterialCommunityIcons').default // eslint-disable-line @typescript-eslint/no-var-requires
  } catch {
    // Fallback if @expo/vector-icons is not available
    MaterialCommunityIcons = null
  }
}

interface AppBarProps {
  title: string
  onMenuPress: () => void
  showBackButton?: boolean
}

export const AppBar: FC<AppBarProps> = ({
  title,
  onMenuPress,
  showBackButton = false,
}) => {
  const iconName = showBackButton ? 'arrow-left' : 'menu'

  // On web, render the icon directly to ensure it displays
  const renderWebIcon = () => {
    if (Platform.OS !== 'web' || !MaterialCommunityIcons) {
      return null
    }
    return (
      <MaterialCommunityIcons
        name={iconName}
        size={24}
        color="white"
        style={styles.webIcon}
      />
    )
  }

  return (
    <PaperAppbar.Header style={{ backgroundColor: LingoColors.steris.brand }}>
      {Platform.OS === 'web' ? (
        <Pressable
          onPress={onMenuPress}
          style={[styles.webIconButton, styles.webIconButtonPressable]}
        >
          {renderWebIcon()}
        </Pressable>
      ) : (
        <PaperAppbar.Action
          icon={iconName}
          onPress={onMenuPress}
          color="white"
        />
      )}
      <PaperAppbar.Content title={title} titleStyle={{ color: 'white' }} />
    </PaperAppbar.Header>
  )
}

const styles = StyleSheet.create({
  webIconButton: Platform.select({
    web: {
      minWidth: 48,
      minHeight: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    default: {},
  }),
  webIconButtonPressable: Platform.select({
    web: {
      minWidth: 48,
      minHeight: 48,
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    },
    default: {},
  }),
  webIcon: Platform.select({
    web: {},
    default: {},
  }),
})

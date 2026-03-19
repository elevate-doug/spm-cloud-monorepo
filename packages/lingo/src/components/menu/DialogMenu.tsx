import { FC, Fragment, useState } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { Divider, Menu, Portal } from 'react-native-paper'

import { MenuItem } from './MenuItem'
import { LingoColors } from '../../theme'
import { SW, H_PADDING, DEFAULT_BORDER_RADIUS, V_PADDING } from '../../values'
import { IconButton } from '../inputs/IconButton'

export type DialogMenuProps = {
  items?: {
    label: string
    color?: string
    icon?: string
    onPress: () => void
  }[]
  icon?: string
  fullWidth?: boolean
  onVisibleChange?: (visible: boolean) => void
  iconWrapperSize?: number
  delayToOpen?: number
  position?: 'above' | 'below' | 'auto'
}

export const DialogMenu: FC<DialogMenuProps> = ({
  items = [],
  icon = 'dots-vertical',
  fullWidth = false,
  onVisibleChange,
  iconWrapperSize,
  delayToOpen = 0,
  position = 'auto',
}) => {
  const [btnIcon, setBtnIcon] = useState(icon)
  const [visible, setVisible] = useState(false)
  const [overlayOpacity] = useState(new Animated.Value(0))

  const openMenu = () => {
    setTimeout(() => {
      setVisible(true)
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }).start()
    }, delayToOpen)
    setBtnIcon('close')
    onVisibleChange?.(visible)
  }

  const closeMenu = () => {
    Animated.timing(overlayOpacity, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false)
      setBtnIcon(icon)
      onVisibleChange?.(visible)
    })
  }

  return (
    <View
      style={fullWidth ? styles.fullWidthContainer : styles.defaultContainer}
    >
      {visible && (
        <Portal>
          <Animated.View
            style={[styles.overlay, { opacity: overlayOpacity }]}
            pointerEvents={visible ? 'auto' : 'none'}
            onTouchEnd={closeMenu}
          />
        </Portal>
      )}
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchorPosition="bottom"
        anchor={
          <IconButton
            onPress={openMenu}
            icon={btnIcon}
            color={LingoColors.common.white}
            style={{
              ...styles.iconButton,
              width: iconWrapperSize,
              height: iconWrapperSize,
            }}
          />
        }
        contentStyle={styles.menuContent}
        style={[
          fullWidth ? styles.fullwidthMenuStyle : styles.menuStyle,
          position === 'above'
            ? styles.menuAbove
            : position === 'below'
              ? styles.menuBelow
              : null,
        ]}
      >
        {items.map((option, index) => (
          <Fragment key={index}>
            <MenuItem
              onPress={() => {
                closeMenu()
                option.onPress()
              }}
              title={option.label}
              iconName={option.icon}
              iconColor={option.color || LingoColors.grey[600]}
            />
            <Divider style={styles.divider} />
          </Fragment>
        ))}
      </Menu>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: LingoColors.overlayBackground,
    zIndex: 1000,
  },
  fullWidthContainer: {
    width: '100%',
    position: 'relative',
  },
  defaultContainer: {
    position: 'relative',
  },
  menuStyle: {
    width: 240,
    right: V_PADDING,
  },
  fullwidthMenuStyle: {
    width: SW - 2 * H_PADDING,
  },
  menuAbove: {
    marginTop: V_PADDING * -5,
  },
  menuBelow: {
    marginTop: V_PADDING * 2.3,
  },
  menuContent: {
    backgroundColor: LingoColors.background.paper,
    borderRadius: DEFAULT_BORDER_RADIUS,
    overflow: 'hidden',
    paddingTop: 0,
    paddingBottom: 0,
  },
  divider: {
    backgroundColor: LingoColors.border,
  },
  iconButton: {
    width: 44,
    height: 44,
    padding: 0,
    backgroundColor: LingoColors.primary.main,
  },
})

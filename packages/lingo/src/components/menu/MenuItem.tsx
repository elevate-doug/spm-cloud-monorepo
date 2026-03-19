import { FC, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  LayoutAnimation,
  StyleSheet,
  View,
} from 'react-native'
import { Icon } from 'react-native-paper'

import { MenuSubitem, MenuSubitemProps } from './MenuSubitem'
import { SVGIcon } from '../../assets/icons/SVGIcon'
import { LingoColors } from '../../theme'
import { V_PADDING } from '../../values'
import { Touchable } from '../buttons'
import { Typography } from '../typography'

export type RightAccessoryLoadingData = {
  isLoading?: boolean
  isVisible?: boolean
}

export type RightAccessoryFooData = {
  isBar?: boolean
}

export type RightAccessoryLoading = RightAccessory<RightAccessoryLoadingData>
export type RightAccessoryFoo = RightAccessory<RightAccessoryFooData>

const LoadingAccessory: FC<RightAccessoryLoadingData> = ({
  isLoading = false,
  isVisible = false,
}) => {
  if (!isVisible) return null
  return (
    <ActivityIndicator
      animating={isLoading}
      size="small"
      color={LingoColors.primary.main}
    />
  )
}

const FooAccessory: FC<RightAccessoryFooData> = ({ isBar }) => {
  return (
    <Typography primary variant="body1">
      {isBar ? 'Bar' : 'Baz'}
    </Typography>
  )
}

interface RightAccessory<T> {
  type: 'loading' | 'foo'
  data: T
}

const RightAccessoryTypeMap = {
  loading: LoadingAccessory,
  foo: FooAccessory,
}

export type MenuItemProps = {
  title: string
  onPress?: () => void
  iconName?: string
  iconColor?: string
  selected?: boolean
  accordionItems?: MenuSubitemProps[]
  accordionInitialOpen?: boolean
  rightAccessory?: RightAccessory<
    RightAccessoryLoadingData & RightAccessoryFooData
  >
}

/**
 * Menu Item
 * - Used within a `Menu`
 * - Displays a title and an optional icon
 * - Displays an accordion of subitems when the `accordionItems` prop is provided
 *
 * @param title - The title of the menu item
 * @param onPress - The callback function when the menu item is pressed
 * @param iconName - The name of the icon to be displayed
 * @param iconColor - The color of the icon to be displayed
 * @param selected - Whether the menu item is selected
 * @param accordionItems - The subitems to be displayed in the accordion
 * @param accordionInitialOpen - Whether the accordion is initially open
 * @param rightAccessory - The right accessory to be displayed
 */
export const MenuItem = ({
  title,
  onPress,
  iconName,
  iconColor,
  selected,
  accordionItems = [],
  accordionInitialOpen = false,
  rightAccessory,
}: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(accordionInitialOpen)
  const color = iconColor || LingoColors.primary.main

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [isOpen])

  const _onPress = () => {
    if (accordionItems && accordionItems?.length > 0) {
      setIsOpen(!isOpen)
    }
    onPress?.()
  }

  const renderRightAccessory = () => {
    if (!rightAccessory) return null
    const accessory = RightAccessoryTypeMap[rightAccessory.type]
    return accessory(rightAccessory.data)
  }

  return (
    <View>
      <Touchable onPress={_onPress} selected={selected}>
        <View
          style={[
            styles.touchable,
            {
              backgroundColor: selected
                ? LingoColors.primary.states.hover
                : 'transparent',
            },
          ]}
        >
          {iconName && <SVGIcon color={color} name={iconName} />}
          <View>
            <Typography variant="body1">{title}</Typography>
          </View>
          <View style={styles.rightAccessory}>{renderRightAccessory()}</View>
          {accordionItems.length > 0 && (
            <Icon
              color={LingoColors.primary.main}
              source={isOpen ? 'chevron-up' : 'chevron-down'}
              size={24}
            />
          )}
        </View>
      </Touchable>
      {isOpen && accordionItems.length > 0 && (
        <View style={styles.accordionContainer}>
          {accordionItems.map((item, index) => (
            <MenuSubitem
              key={`${item.title}-${index}`}
              {...item}
              isLast={index === accordionItems.length - 1}
            />
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: V_PADDING,
    paddingVertical: V_PADDING,
    paddingHorizontal: V_PADDING,
    height: 60,
  },
  title: {
    flex: 1,
  },
  rightAccessory: {},
  accordionContainer: {
    backgroundColor: LingoColors.background.paper,
  },
})

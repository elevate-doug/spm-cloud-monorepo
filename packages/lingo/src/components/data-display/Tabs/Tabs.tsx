import React, {
  Children,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { LingoColors } from '../../../theme'
import { V_PADDING } from '../../../values'
import { Typography } from '../../typography'
export interface TabsProps {
  onChangeIndex?: (index: number) => void
  children: ReactNode
  tabIndex: number
}

export const Tabs: FC<TabsProps> = ({ onChangeIndex, children, tabIndex }) => {
  const [activeIndex, setActiveIndex] = useState(tabIndex ?? 0)
  const [containerWidth, setContainerWidth] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollX = useRef(new Animated.Value(0)).current
  const tabsArray = Children.toArray(children)
  const isScrolling = useRef(false)

  useEffect(() => {
    handleTabPress(tabIndex)
  }, [tabIndex])

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width)
  }

  const handleTabPress = (index: number) => {
    if (isScrolling.current) return

    isScrolling.current = true
    setActiveIndex(index)

    scrollViewRef.current?.scrollTo({
      x: index * containerWidth,
      animated: true,
    })

    onChangeIndex?.(index)

    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrolling.current = false
    }, 300) // Match this with your scroll animation duration
  }

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        if (isScrolling.current) return

        const newIndex = Math.round(
          event.nativeEvent.contentOffset.x / containerWidth
        )
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex)
          onChangeIndex?.(newIndex)
        }
      },
    }
  )

  const handleMomentumScrollEnd = () => {
    isScrolling.current = false
  }

  const renderTabBadge = (
    badge?: string | number | boolean,
    isActive?: boolean
  ) => {
    if (!badge) return null

    return (
      <View style={[styles.badge, isActive && styles.activeBadge]}>
        <Typography
          variant="buttonMedium"
          color={
            isActive ? LingoColors.common.white : LingoColors.blueGray[700]
          }
          style={styles.badgeText}
        >
          {typeof badge === 'boolean' ? '' : badge?.toString()}
        </Typography>
      </View>
    )
  }

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <View style={styles.tabBar}>
        {tabsArray.map((tab: any, index) => {
          const isActive = index === activeIndex
          return (
            <TouchableOpacity
              key={index}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => handleTabPress(index)}
            >
              <Typography
                variant="buttonMedium"
                color={LingoColors.blueGray[700]}
              >
                {tab.props.label}
              </Typography>
              {renderTabBadge(tab.props.badge, isActive)}
            </TouchableOpacity>
          )
        })}
      </View>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        decelerationRate="fast"
      >
        {tabsArray.map((tab, index) => (
          <View
            key={index}
            style={[styles.tabContent, { width: containerWidth }]}
          >
            {React.isValidElement(tab) ? tab.props.children : tab}
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  tabBar: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: V_PADDING / 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: LingoColors.blueGray[700],
  },
  tabContent: {
    flex: 1,
  },
  badge: {
    borderRadius: 24,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: LingoColors.blueGray[700],
    paddingLeft: 1,
  },
  activeBadge: {
    backgroundColor: LingoColors.blueGray[700],
    borderWidth: 0,
  },
  badgeText: {
    top: -0.5,
  },
})

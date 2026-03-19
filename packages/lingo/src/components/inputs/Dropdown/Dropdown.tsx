import { FC, useEffect, useRef, useState } from 'react'
import {
  Animated,
  FlatList,
  Keyboard,
  LayoutAnimation,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { LingoColors } from '../../../theme'
import { DEFAULT_BORDER_RADIUS, H_PADDING, V_PADDING } from '../../../values'
import { Touchable } from '../../buttons'
import { Typography } from '../../typography'

const DROPDOWN_HEIGHT = 56
const DROPDOWN_ITEM_HEIGHT = V_PADDING + 16 // accounts for paddingVertical and reasonable text height

/**
 * Sanitizes a string for use in test IDs by removing special characters and replacing spaces with hyphens
 */
const sanitizeForTestID = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

type DropdownProps = {
  options: {
    id: string
    value: string
  }[]
  value: string
  onChangeValue?: (value: string) => void
  placeholder?: string
  maxOptionsVisible?: number
  errorMessage?: string
  label?: string
  disabled?: boolean
  testID?: string
}

export const Dropdown: FC<DropdownProps> = ({
  options,
  value,
  onChangeValue,
  placeholder,
  maxOptionsVisible = 3,
  errorMessage,
  label,
  disabled,
  testID,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasSelection, setHasSelection] = useState(!!value)
  const [pendingOpen, setPendingOpen] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  const hasContent = !!value || !!placeholder
  const triggerRef = useRef<View>(null)
  const labelTriggerRef = useRef<View>(null)
  const flatListRef = useRef<FlatList>(null)
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [backdropPosition, setBackdropPosition] = useState({
    width: 0,
  })
  const [absolutePosition, setAbsolutePosition] = useState({
    pageX: 0,
    pageY: 0,
  })
  const rotateAnim = useRef(new Animated.Value(0)).current
  const labelAnim = useRef(new Animated.Value(hasContent ? 1 : 0)).current
  const backdropAnim = useRef(new Animated.Value(hasContent ? 1 : 0)).current

  if (maxOptionsVisible <= 0) {
    console.warn(
      'maxOptionsVisible must be greater than 0; defaulting value to 3'
    )
    maxOptionsVisible = 3
  }

  /**
   * If a value is provided, animate the label and backdrop
   */
  useEffect(() => {
    if (hasContent) {
      animateLabel(true)
      animateBackdrop(true)
    }
  }, [hasContent])

  // Track keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    )

    return () => {
      keyboardDidShowListener?.remove()
      keyboardDidHideListener?.remove()
    }
  }, [])

  // Handle keyboard dismissal to open dropdown at correct position
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (pendingOpen) {
          setPendingOpen(false)
          updatePosition()
          setIsOpen(true)
          animateChevron(true)
          animateLabel(true)
          animateBackdrop(true)
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        }
      }
    )

    return () => {
      keyboardDidHideListener?.remove()
    }
  }, [pendingOpen])

  const animateChevron = (open: boolean) => {
    Animated.timing(rotateAnim, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const animateLabel = (up: boolean) => {
    Animated.timing(labelAnim, {
      toValue: up ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (up) {
        updateBackdropPosition()
      }
    })
  }

  const animateBackdrop = (show: boolean) => {
    Animated.timing(backdropAnim, {
      toValue: show ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const handleClose = () => {
    setIsOpen(false)
    animateChevron(false)
    if (!hasSelection && !placeholder) {
      animateLabel(false)
      animateBackdrop(false)
    }
  }

  const handleSelect = (selectedValue: string) => {
    setHasSelection(true)
    onChangeValue?.(selectedValue)
    setIsOpen(false)
    animateChevron(false)
  }

  const updatePosition = () => {
    if (triggerRef.current) {
      triggerRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({
          x: px,
          y: py - (StatusBar.currentHeight || 0),
          width: width,
          height: height,
        })
      })

      triggerRef.current.measureInWindow((x, y, width, height) => {
        setAbsolutePosition({
          pageX: x,
          pageY: y,
        })
      })
    }
  }

  const updateBackdropPosition = () => {
    if (labelTriggerRef.current) {
      labelTriggerRef.current.measure((fx, fy, width, height, px, py) => {
        setBackdropPosition({
          width: width + 6,
        })
      })
    }
  }

  const openDropdown = () => {
    updatePosition()
    setIsOpen(true)
    animateChevron(true)
    animateLabel(true)
    animateBackdrop(true)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    // Scroll to selected item after a short delay to ensure the FlatList has rendered
    setTimeout(() => {
      const selectedIndex = options.findIndex((option) => option.id === value)
      if (selectedIndex !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: selectedIndex,
          animated: false,
        })
      }
    }, 0)
  }

  const handlePress = () => {
    if (isOpen) {
      handleClose()
    } else {
      if (isKeyboardVisible) {
        Keyboard.dismiss()
        setPendingOpen(true)
      } else {
        openDropdown()
      }
    }
  }

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  const labelTranslateY = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [28, 0],
  })

  const labelScale = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.3, 1],
  })

  const handleLayout = () => {
    updatePosition()
  }

  const handleLabelLayout = () => {
    updateBackdropPosition()
  }

  let borderColor = LingoColors.input.outlined.enabledBorder
  let labelColor = LingoColors.text.secondary
  let triangleColor = LingoColors.action.active
  let valueColor = LingoColors.text.primary
  if (disabled) {
    borderColor = LingoColors.input.outlined.disabledBorder
    labelColor = LingoColors.text.disabled
    triangleColor = LingoColors.action.disabled
    valueColor = LingoColors.text.disabled
  } else if (errorMessage) {
    borderColor = LingoColors.error.main
    labelColor = LingoColors.error.main
  } else if (isOpen) {
    borderColor = LingoColors.primary.main
    labelColor = LingoColors.primary.main
  }

  return (
    <View>
      <Touchable
        disabled={disabled}
        ref={triggerRef}
        style={[
          styles.container,
          {
            borderWidth: isOpen ? 2 : 1,
            borderColor,
          },
        ]}
        onLayout={handleLayout}
        onPress={handlePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        testID={testID}
      >
        <View style={styles.innerContainer}>
          <Typography variant="body1" color={valueColor}>
            {String(
              options.find((option) => option.id === value)?.value ||
                value ||
                placeholder ||
                ''
            )}
          </Typography>
          <View style={styles.iconContainer}>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <View
                style={[styles.triangle, { borderTopColor: triangleColor }]}
              />
            </Animated.View>
          </View>
        </View>
        <Animated.View
          style={[
            styles.whiteBackdrop,
            {
              height: isOpen ? 2 : 1,
              top: isOpen ? -2 : -1,
              opacity: backdropAnim,
              width: backdropPosition.width,
            },
          ]}
        />
      </Touchable>
      {errorMessage && !disabled && (
        <Typography
          variant="caption"
          color={LingoColors.error.main}
          style={{ marginLeft: H_PADDING }}
        >
          {errorMessage}
        </Typography>
      )}
      <Animated.View
        ref={labelTriggerRef}
        onLayout={handleLabelLayout}
        style={[
          styles.labelContainer,
          {
            transform: [{ translateY: labelTranslateY }, { scale: labelScale }],
            transformOrigin: 'left',
            left: 13,
          },
        ]}
      >
        <Typography variant="caption" color={labelColor}>
          {label || ''}
        </Typography>
      </Animated.View>
      <Modal
        transparent={true}
        visible={isOpen}
        animationType="fade"
        onRequestClose={handleClose}
        testID={testID ? `${testID}-modal` : undefined}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View
            style={styles.modalOverlay}
            testID={testID ? `${testID}-modal-overlay` : undefined}
          >
            <View
              style={[
                styles.menu,
                {
                  overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
                  position: 'absolute',
                  top: absolutePosition.pageY + position.height,
                  left: absolutePosition.pageX,
                  width: position.width,
                  maxHeight: DROPDOWN_ITEM_HEIGHT * maxOptionsVisible + 16,
                },
              ]}
              testID={testID ? `${testID}-menu` : undefined}
            >
              <FlatList
                ref={flatListRef}
                data={options}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={styles.dropdownContainer}
                showsVerticalScrollIndicator={true}
                persistentScrollbar={Platform.OS === 'android'}
                scrollIndicatorInsets={{ right: 1 }}
                getItemLayout={(data, index) => ({
                  length: DROPDOWN_ITEM_HEIGHT,
                  offset: DROPDOWN_ITEM_HEIGHT * index,
                  index,
                })}
                renderItem={({ item }) => (
                  <Touchable
                    selected={item.id === value}
                    style={[
                      styles.dropdownItem,
                      { height: DROPDOWN_ITEM_HEIGHT },
                    ]}
                    onPress={() => handleSelect(item.id)}
                    testID={
                      testID
                        ? `${testID}-option-${sanitizeForTestID(item.value)}`
                        : undefined
                    }
                  >
                    <Typography
                      variant="body1"
                      color={LingoColors.text.primary}
                    >
                      {item.value}
                    </Typography>
                  </Touchable>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: DROPDOWN_HEIGHT,
    borderWidth: 1,
    borderColor: LingoColors.input.outlined.enabledBorder,
    borderRadius: DEFAULT_BORDER_RADIUS,
    marginTop: 8,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    top: -3,
    paddingHorizontal: 2,
  },
  whiteBackdrop: {
    position: 'absolute',
    backgroundColor: LingoColors.background.paper,
    width: 40,
    left: 9,
  },
  iconContainer: {
    marginLeft: 'auto',
    paddingHorizontal: 4,
  },
  dropdownContainer: {
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingHorizontal: H_PADDING,
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  menu: {
    backgroundColor: LingoColors.background.paper,
    position: 'absolute',
    borderRadius: DEFAULT_BORDER_RADIUS,
    shadowColor: LingoColors.elevation['1'].color,
    shadowOffset: {
      width: LingoColors.elevation['1'].x,
      height: LingoColors.elevation['1'].y,
    },
    shadowOpacity: LingoColors.elevation['1'].opacity,
    shadowRadius: LingoColors.elevation['1'].blur,
    elevation: LingoColors.elevation['1'].elevation,
    overflow: 'hidden',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: LingoColors.action.active,
  },
})

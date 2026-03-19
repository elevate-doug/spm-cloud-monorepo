import { FC, useEffect, useRef } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'

import { useAudio } from '../../../../../../client/app/hooks/useAudio'
// @ts-ignore
import successSound from '../../../../../../client/assets/sounds/Success.mp3'
import { LingoColors } from '../../../theme'
import { DEFAULT_BORDER_RADIUS_LG, H_PADDING, V_PADDING } from '../../../values'
import { Typography } from '../../typography'

export type AddedTasksButtonProps = {
  count: number
  onPress: () => void
  shouldAnimate?: boolean
}

export const AddedTasksButton: FC<AddedTasksButtonProps> = ({
  count,
  onPress,
  shouldAnimate = false,
}) => {
  const { playSound } = useAudio()
  // Initialize scale to 1 if count > 0 AND we shouldn't animate
  const scale = useRef(
    new Animated.Value(count > 0 && !shouldAnimate ? 1 : 0)
  ).current
  // Initialize prevCountRef to current count if we shouldn't animate, otherwise 0 to force trigger
  const prevCountRef = useRef(shouldAnimate ? 0 : count)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (count > 0 && prevCountRef.current <= 0) {
      scale.setValue(0)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        playSound(successSound)
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
          tension: 40,
        }).start()
        timeoutRef.current = null
      }, 600)
    } else if (count <= 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      scale.setValue(0)
    }
    prevCountRef.current = count
  }, [count, playSound, scale])

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Typography
          variant="body2"
          style={styles.text}
          color={LingoColors.common.white}
          bold
        >
          ADDED TASKS
        </Typography>

        {count ? (
          <Animated.View style={[styles.badge, { transform: [{ scale }] }]}>
            <Typography variant="caption" color={LingoColors.primary.main} bold>
              {count}
            </Typography>
          </Animated.View>
        ) : null}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: V_PADDING * 2,
    right: H_PADDING,
  },
  container: {
    backgroundColor: LingoColors.primary.main,
    borderRadius: DEFAULT_BORDER_RADIUS_LG * 2,
    paddingVertical: V_PADDING,
    paddingHorizontal: H_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    gap: H_PADDING / 2,
  },
  text: {
    color: LingoColors.common.white,
  },
  badge: {
    backgroundColor: LingoColors.common.white,
    borderRadius: DEFAULT_BORDER_RADIUS_LG,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: H_PADDING / 2.2,
  },
})

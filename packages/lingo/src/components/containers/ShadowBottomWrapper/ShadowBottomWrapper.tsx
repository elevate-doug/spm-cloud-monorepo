import { FC, PropsWithChildren } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { LingoColors } from '../../../theme'
import LinearGradient from '../../../utils/LinearGradient'
import { H_PADDING, V_PADDING } from '../../../values'
import { useScroll } from '../ScrollContext/ScrollContext'

export type ShadowBottomWrapperProps = PropsWithChildren

export const ShadowBottomWrapper: FC<ShadowBottomWrapperProps> = ({
  children,
}) => {
  const { isAtBottom, contentHeight, layoutHeight } = useScroll()
  const hasEnoughContent = contentHeight > layoutHeight + 20
  const showShadow = hasEnoughContent && !isAtBottom

  return (
    <View style={styles.wrapper}>
      {showShadow && Platform.OS === 'android' && (
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.06)']}
          style={styles.topGradient}
        />
      )}
      <View
        style={[
          styles.content,
          showShadow && Platform.OS === 'ios' && styles.wrapperShadow,
        ]}
      >
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: LingoColors.background.paper,
    zIndex: 1,
  },
  content: {
    paddingVertical: V_PADDING,
    backgroundColor: LingoColors.background.paper,
  },
  wrapperShadow: {
    shadowColor: LingoColors.common.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,

    elevation: 5,
  },
  topGradient: {
    position: 'absolute',
    top: -6,
    left: -H_PADDING * 2,
    right: -H_PADDING * 2,
    height: 6,
    zIndex: 2,
  },
})

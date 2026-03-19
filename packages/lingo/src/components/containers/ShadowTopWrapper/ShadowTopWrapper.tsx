import { FC, PropsWithChildren } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { LingoColors } from '../../../theme'
import LinearGradient from '../../../utils/LinearGradient'
import { H_PADDING } from '../../../values'
import { useScroll } from '../ScrollContext/ScrollContext'

export type ShadowTopWrapperProps = PropsWithChildren

export const ShadowTopWrapper: FC<ShadowTopWrapperProps> = ({ children }) => {
  const { scrollY } = useScroll()
  const showShadow = scrollY > 0

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.content,
          showShadow && Platform.OS === 'ios' && styles.wrapperShadow,
        ]}
      >
        {children}
      </View>
      {showShadow && Platform.OS === 'android' && (
        <LinearGradient
          colors={[LingoColors.borderShadowLight, 'transparent']}
          style={styles.bottomGradient}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: LingoColors.background.paper,
    zIndex: 1,
    marginHorizontal: -H_PADDING * 2,
  },
  content: {
    paddingHorizontal: H_PADDING * 2,
    backgroundColor: LingoColors.background.paper,
  },
  wrapperShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: -6,
    left: -H_PADDING * 2,
    right: -H_PADDING * 2,
    height: 6,
    zIndex: 2,
  },
})

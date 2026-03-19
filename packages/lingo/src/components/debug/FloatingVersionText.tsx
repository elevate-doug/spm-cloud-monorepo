import { FC, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { LingoColors } from '../../theme'
import { Typography } from '../typography'

type FloatingVersionTextProps = {
  versionString: string
}

export const FloatingVersionText: FC<FloatingVersionTextProps> = ({
  versionString,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setIsVisible(!isVisible)}
    >
      {isVisible && (
        <Typography variant="caption" color={LingoColors.text.secondary}>
          {versionString}
        </Typography>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 3,
    minWidth: 100,
    minHeight: 10,
  },
})

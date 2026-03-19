import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { FAB as PaperFAB } from 'react-native-paper'

import { LingoColors } from '../../../theme/Colors'
import { V_PADDING } from '../../../values'

export type FABProps = {
  icon: string
  label?: string
  loading?: boolean
  disabled?: boolean
  onPress: () => void
  iconColor?: string
}

export const FloatingActionButton: FC<FABProps> = ({
  icon,
  label,
  loading,
  disabled,
  onPress,
  iconColor = 'white',
}) => {
  return (
    <View style={styles.fabContainer}>
      <PaperFAB
        style={styles.fab}
        icon={icon}
        label={label}
        loading={loading}
        disabled={disabled}
        onPress={onPress}
        color={iconColor}
        testID="paper-fab"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: V_PADDING,
    right: V_PADDING,
    zIndex: 1050,
  },
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    margin: 0,
    marginRight: 8,
    userSelect: 'none',
    verticalAlign: 'middle',
    textDecorationLine: 'none',
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: 14, // 0.875rem
    lineHeight: 1.75,
    textTransform: 'uppercase',
    minHeight: 36,
    borderRadius: 28, // 50% of 56px
    padding: 0,
    minWidth: 0,
    width: 56,
    height: 56,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 1,
    elevation: 5, // For Android shadow
    backgroundColor: LingoColors.primary.main,
  },
})

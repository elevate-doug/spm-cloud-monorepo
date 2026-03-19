import React, { FC } from 'react'
import { View, SafeAreaView, Platform, Text, StyleSheet } from 'react-native'

import { IconButton } from '../../components'
import { LingoColors } from '../../theme'
import { fontDefinitions } from '../../theme/fontDefinitions'

export interface DetailsTitleTemplateProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export const DetailsTitleTemplate: FC<DetailsTitleTemplateProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <IconButton
              icon="close"
              color={LingoColors.text.primary}
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            />
            <Text style={styles.title}>{title}</Text>
          </View>
          {children}
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 8,
  },
  closeButton: {
    marginLeft: -8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: LingoColors.text.primary,
    fontSize: fontDefinitions.headlineLarge.fontSize,
    fontWeight: '500',
  },
})

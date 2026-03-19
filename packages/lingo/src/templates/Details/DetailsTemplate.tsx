import React, { FC } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values'
import { DetailsTitleTemplate } from '../DetailsTitle/DetailsTitleTemplate'

export interface DetailsTemplateProps {
  title: string
  itemName: string
  usualLocation?: string
  associatedFilesCount: number
  onClose: () => void
  onViewFiles: () => void
  children: React.ReactNode
}

export const DetailsTemplate: FC<DetailsTemplateProps> = ({
  title,
  itemName,
  usualLocation,
  associatedFilesCount,
  onClose,
  onViewFiles,
  children,
}) => {
  return (
    <DetailsTitleTemplate title={title} onClose={onClose}>
      <Text style={styles.itemName}>{itemName}</Text>
      {usualLocation && (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Usual Location:</Text>
          <Text style={styles.infoValue}>{usualLocation}</Text>
        </View>
      )}
      {associatedFilesCount > 0 && (
        <TouchableOpacity style={styles.filesButton} onPress={onViewFiles}>
          <Text style={styles.filesButtonText}>
            Associated files ({associatedFilesCount})
          </Text>
          <Text style={styles.viewFiles}>View files</Text>
        </TouchableOpacity>
      )}
      {children}
    </DetailsTitleTemplate>
  )
}

const styles = StyleSheet.create({
  itemName: {
    fontSize: 20,
    fontWeight: '500',
    paddingLeft: V_PADDING,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: LingoColors.grey[500],
  },
  infoBox: {
    flexDirection: 'row',
    padding: V_PADDING,
    paddingTop: V_PADDING / 2,
    borderBottomWidth: 0.5,
    borderBottomColor: LingoColors.grey[500],
  },
  infoLabel: {
    color: LingoColors.text.secondary,
    marginRight: H_PADDING,
  },
  infoValue: {
    color: LingoColors.text.primary,
  },
  filesButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: V_PADDING,
    borderBottomWidth: 0.5,
    borderBottomColor: LingoColors.grey[500],
  },
  filesButtonText: {
    color: LingoColors.text.secondary,
  },
  viewFiles: {
    color: LingoColors.primary.main,
  },
  subItem: {
    flexDirection: 'row',
    padding: V_PADDING,
    borderBottomWidth: 0.5,
    borderBottomColor: LingoColors.grey[500],
    alignItems: 'center',
  },
  subItemId: {
    fontSize: V_PADDING,
    fontWeight: '500',
  },
  subItemDetails: {
    flex: 1,
  },
  subItemText: {
    color: LingoColors.text.secondary,
  },
  sterileStatus: {
    textAlign: 'right',
    fontWeight: '500',
    fontSize: 16,
  },
  sterile: {
    color: 'green',
  },
  notSterile: {
    color: 'red',
  },
})

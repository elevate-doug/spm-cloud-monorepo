import { FC } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'

import { SterileTypeEnum } from '../../../../../client/app/constants/sterileTypeEnum'
import { File, SetIndexPoco, SetTypeFlatPoco } from '../../../../api'
import { Typography } from '../../components'
import { LingoColors } from '../../theme'
import { H_PADDING } from '../../values'
import { DetailsTemplate } from '../Details'

export interface ProductDetailsTemplateProps {
  item: SetTypeFlatPoco
  relatedItems: SetIndexPoco[]
  associatedFiles: File[]
  onClose: () => void
  onViewFiles: () => void
  formatDate: (dateString: string) => string
}

export const ProductDetailsTemplate: FC<ProductDetailsTemplateProps> = ({
  item,
  relatedItems,
  associatedFiles,
  onClose,
  onViewFiles,
  formatDate,
}) => {
  return (
    <DetailsTemplate
      title="Product Set"
      itemName={item.name}
      associatedFilesCount={associatedFiles.length}
      onClose={onClose}
      onViewFiles={onViewFiles}
      usualLocation={item.usualLocation ?? ''}
    >
      <FlatList
        data={relatedItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: subItem }) => (
          <View key={subItem.id} style={styles.subItem}>
            <View style={styles.subItemDetails}>
              <Typography variant="subtitle1" bold>
                {subItem.indexNumber}
              </Typography>
              <Typography variant="body1" color={LingoColors.text.secondary}>
                Location:{' '}
                {subItem.currentLocation !== 'Unknown'
                  ? subItem.currentLocation
                  : ''}
              </Typography>
              <Typography variant="body1" color={LingoColors.text.secondary}>
                Last Scan:{' '}
                {subItem.dateDone ? formatDate(subItem.dateDone) : ''}
              </Typography>
            </View>
            <Typography
              variant="body1"
              color={
                subItem.sterile === SterileTypeEnum.Sterile
                  ? LingoColors.success.main
                  : LingoColors.error.main
              }
              bold
            >
              {subItem.sterile === SterileTypeEnum.Sterile
                ? 'Sterile'
                : 'Not Sterile'}
            </Typography>
          </View>
        )}
      />
    </DetailsTemplate>
  )
}

const styles = StyleSheet.create({
  subItem: {
    flexDirection: 'row',
    padding: H_PADDING,
    borderBottomWidth: 0.5,
    borderBottomColor: LingoColors.grey[500],
    alignItems: 'center',
  },
  subItemDetails: {
    flex: 1,
  },
})

import { FC } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

import { useSitesStore } from '../../../../../client/app/store/useSitesStore'
import { File, SetTypePocoEntity } from '../../../../api'
import { LingoColors } from '../../theme'
import { V_PADDING } from '../../values'
import { DetailsTemplate } from '../Details'

export interface InstrumentDetailsTemplateProps {
  item: { id: number; name: string }
  relatedItems: SetTypePocoEntity[]
  associatedFiles: File[]
  onClose: () => void
  onViewFiles: () => void
}

export const InstrumentDetailsTemplate: FC<InstrumentDetailsTemplateProps> = ({
  item,
  relatedItems,
  associatedFiles,
  onClose,
  onViewFiles,
}) => {
  const { sites } = useSitesStore()

  const renderItem = ({ item: subItem }: { item: SetTypePocoEntity }) => {
    const site = sites.find((site) => site.id === subItem.siteId)
    return (
      <View key={subItem.id} style={styles.subItem}>
        <Text style={styles.subItemName}>{subItem.name}</Text>
        <Text style={styles.subItemText}>{subItem.productGroup}</Text>
        <Text style={styles.subItemText}>{site?.name}</Text>
      </View>
    )
  }
  const getItemKey = (item: SetTypePocoEntity): string => item.id.toString()

  return (
    <DetailsTemplate
      title="Instrument details"
      itemName={`Products containing: ${item.name}`}
      associatedFilesCount={associatedFiles.length}
      onClose={onClose}
      onViewFiles={onViewFiles}
    >
      <FlatList
        data={relatedItems}
        keyExtractor={getItemKey}
        renderItem={renderItem}
      />
    </DetailsTemplate>
  )
}

const styles = StyleSheet.create({
  subItem: {
    padding: V_PADDING,
    borderBottomWidth: 0.5,
    borderBottomColor: LingoColors.grey[500],
  },
  subItemName: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: V_PADDING / 4,
  },
  subItemText: {
    color: LingoColors.text.secondary,
  },
})

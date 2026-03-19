import { FC } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { ListReferenceDataDto } from '../../../../api'
import { Typography } from '../../components'
import {
  ConfirmDialog,
  ConfirmDialogProps,
  SearchField,
  Select,
} from '../../components/inputs'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values/Spacing'

export type CaseDeliverTemplateProps = {
  errors?: {
    site?: string
  }
  site: string
  sites: {
    label: string
    value: string
  }[]
  onSiteChange: (siteId: string) => void
  query: string
  patientLocations: ListReferenceDataDto[]
  dialog: ConfirmDialogProps
  onLocationSelect: (locationId: number) => void
  onQueryChange: (text: string) => void
  isLoading: boolean
  onCancel: () => void
  onSubmit: () => void
  selectedLocationId: number | null
}

const LoadingIndicator: FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={LingoColors.primary.main} />
  </View>
)

export const CaseDeliverTemplate: FC<CaseDeliverTemplateProps> = ({
  sites,
  site,
  onSiteChange,
  query,
  onQueryChange,
  isLoading,
  onCancel,
  onSubmit,
  patientLocations,
  dialog,
  onLocationSelect,
  selectedLocationId,
}) => {
  const renderItem = ({ item }: { item: ListReferenceDataDto }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        {
          backgroundColor:
            item.id === selectedLocationId
              ? LingoColors.primary.selected
              : 'transparent',
        },
      ]}
      onPress={() => onLocationSelect(item.id)}
    >
      <Typography variant="body1" color={LingoColors.primary.main}>
        {item.name}
      </Typography>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <View style={styles.content}>
          <ConfirmDialog
            visible={dialog.visible}
            title={dialog.title}
            message={dialog.message}
            onConfirm={dialog.onConfirm}
            confirmText="OK"
            hideCancelButton={true}
          />
          <Typography variant="h6" bold style={styles.title}>
            Select a Location
          </Typography>

          <SearchField
            placeholder="Search"
            value={query}
            onChangeText={onQueryChange}
          />

          <Select
            label="Site"
            value={site}
            onChangeText={onSiteChange}
            options={sites}
            style={styles.select}
          />

          <Typography variant="body1" style={styles.description}>
            Select the patient location for the case cart.
          </Typography>

          <FlatList
            data={patientLocations}
            style={styles.list}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}
      <View style={styles.bottomButtonsContainer}>
        <BottomButtons
          cancelOnPress={onCancel}
          submitOnPress={onSubmit}
          isValid={!isLoading && !!selectedLocationId}
          isLoading={isLoading}
          submitText="OK"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
    backgroundColor: LingoColors.background.paper,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: V_PADDING,
    justifyContent: 'flex-start',
  },
  title: {
    marginBottom: V_PADDING,
  },
  select: {
    marginTop: V_PADDING / 2,
  },
  description: {
    marginTop: V_PADDING / 2,
  },
  list: {
    marginTop: V_PADDING / 2,
  },
  listItem: {
    padding: H_PADDING * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: LingoColors.border,
  },
  listContainer: {
    flexGrow: 1,
  },
  bottomButtonsContainer: {
    padding: V_PADDING,
  },
})

export default CaseDeliverTemplate

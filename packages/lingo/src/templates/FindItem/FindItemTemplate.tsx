import { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  Button,
  Select,
  TextField,
  WarningAlert,
} from '../../components/inputs'
import { LingoColors } from '../../theme'
import { SearchArea, V_PADDING } from '../../values'

const searchAreaOptions = [
  { label: 'Products', value: SearchArea.Products },
  { label: 'Instruments', value: SearchArea.Instruments },
  { label: 'Both', value: SearchArea.Both },
]

export type FindItemProps = {
  searchArea: string
  onSearchAreaChange: (text: string) => void
  site: string
  sites: {
    label: string
    value: string
  }[]
  onSiteChange: (text: string) => void
  query: string
  onQueryChange: (text: string) => void
  onSearch: () => void
  errors: {
    searchArea?: string
    site?: string
    query?: string
  }
  showWarning: boolean
  onCloseWarning: () => void
  showBarcodeError: boolean
  onCloseBarcodeError: () => void
}

export const FindItem: FC<FindItemProps> = ({
  searchArea,
  onSearchAreaChange,
  site,
  onSiteChange,
  sites,
  query,
  onQueryChange,
  onSearch,
  errors,
  showWarning,
  showBarcodeError,
  onCloseBarcodeError,
  onCloseWarning,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topForm}>
        <WarningAlert
          title="Barcode scan error"
          message="Error processing barcode scan: item not found."
          hidden={!showBarcodeError}
          type="error"
          onClose={onCloseBarcodeError}
        />
        <Select
          label="Search Area"
          value={searchArea}
          onChangeText={onSearchAreaChange}
          options={searchAreaOptions}
          error={!!errors.searchArea}
          helperText={errors.searchArea}
          showDividers={false}
        />
        <Select
          label="Site"
          value={site}
          onChangeText={onSiteChange}
          options={sites}
          error={!!errors.site}
          helperText={errors.site}
          showDividers={false}
        />
        <TextField
          label="Product or Instrument"
          value={query}
          onChangeText={onQueryChange}
          variant="outlined"
          style={styles.textField}
          error={!!errors.query}
          helperText={errors.query}
          leftIcon="magnify"
          onSubmitEditing={onSearch}
          showClearButton
        />
        <WarningAlert
          title="No Results Found"
          message="Please refine your search and try again."
          hidden={!showWarning}
          onClose={onCloseWarning}
        />
      </View>
      <View style={styles.bottomButtonContainer}>
        <Button
          mode="contained"
          onPress={onSearch}
          disabled={query?.length < 3}
          customStyle={styles.button}
        >
          SEARCH
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: V_PADDING,
    backgroundColor: LingoColors.background.paper,
    gap: V_PADDING,
    justifyContent: 'space-between',
  },
  topForm: {
    justifyContent: 'flex-start',
    gap: V_PADDING,
  },
  textField: {
    marginBottom: V_PADDING,
  },
  bottomButtonContainer: {
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: V_PADDING / 2,
  },
})

export default FindItem

import { FC, LegacyRef } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import { SetTypeFlatPoco } from '../../../../api/src/service/set-type/SetTypeTypes'
import { Touchable, Typography } from '../../components'
import {
  DialogMessage,
  DialogMessageRef,
} from '../../components/feedback/Dialog/DialogMessage'
import { Button, SearchField, Select } from '../../components/inputs'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values'

export type CaseCartsProductsProps = {
  query: string
  onQueryChange: (text: string) => void
  site: string
  onSiteChange: (text: string) => void
  sites: {
    label: string
    value: string
  }[]
  dialogMessageRef: LegacyRef<DialogMessageRef>
  searchResult: SetTypeFlatPoco[]
  handleSearch: () => void
  handleOkPress: () => void
  handleCancelPress: () => void
  selectedProduct: SetTypeFlatPoco | undefined
  setSelectedProduct: (product: SetTypeFlatPoco | undefined) => void
}

export const CaseCartsProductsTemplate: FC<CaseCartsProductsProps> = ({
  query,
  onQueryChange,
  site,
  onSiteChange,
  sites,
  dialogMessageRef,
  searchResult,
  handleSearch,
  selectedProduct,
  setSelectedProduct,
  handleOkPress,
  handleCancelPress,
}) => {
  const isSelected = (product: SetTypeFlatPoco) => {
    return selectedProduct?.id === product.id
  }

  return (
    <View style={styles.container}>
      <DialogMessage ref={dialogMessageRef} />
      <Typography variant="subtitle1" style={styles.title} bold>
        Choose a Product
      </Typography>
      <View style={styles.searchContainer}>
        <SearchField
          placeholder="Scan case cart"
          value={query}
          onChangeText={onQueryChange}
          onSearch={handleSearch}
        />
        <Select
          label="Site"
          value={site}
          onChangeText={onSiteChange}
          options={sites}
        />
      </View>
      <FlatList
        data={searchResult}
        renderItem={({ item }) => (
          <Touchable onPress={() => setSelectedProduct(item)}>
            <View
              style={
                isSelected(item)
                  ? styles.selectedProductItem
                  : styles.productItem
              }
            >
              <Typography primary variant="subtitle1">
                {item.name}
              </Typography>
            </View>
          </Touchable>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          customStyle={styles.button}
          onPress={handleCancelPress}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          customStyle={styles.button}
          disabled={!selectedProduct || !site}
          onPress={handleOkPress}
        >
          OK
        </Button>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: V_PADDING,
    backgroundColor: LingoColors.common.white,
  },
  title: {
    paddingVertical: V_PADDING / 2,
    marginBottom: V_PADDING,
  },
  searchContainer: {
    flexDirection: 'column',
    gap: V_PADDING,
  },
  searchInput: {
    height: 40,
    borderColor: LingoColors.grey[300],
    borderWidth: 1,
    marginBottom: V_PADDING,
    paddingHorizontal: H_PADDING,
  },
  pickerContainer: {
    marginBottom: V_PADDING,
  },
  pickerLabel: {
    marginBottom: V_PADDING / 2,
  },
  picker: {
    height: 40,
    borderColor: LingoColors.grey[300],
    borderWidth: 1,
  },
  productItem: {
    padding: V_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: LingoColors.grey[300],
  },
  selectedProductItem: {
    padding: V_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: LingoColors.grey[300],
    backgroundColor: LingoColors.primary.selected,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'stretch',
    gap: V_PADDING,
    marginTop: V_PADDING,
  },
  button: {
    flex: 1,
    paddingVertical: V_PADDING / 2,
  },
})

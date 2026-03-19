import { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import { Button, Select } from '../../components'
import { SimpleList } from '../../components/data-display/List/SimpleList'
import { Typography } from '../../components/typography'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values'
export type ProductSiteItem = {
  value: string
  label: string
}
export type ProductItem = {
  id: string
  label: string
}
export type ProductsTemplateProps = {
  sites: ProductSiteItem[]
  selectedSite: ProductSiteItem
  onSelectSite: (site: string) => void
  products: ProductItem[]
  selectedProduct: ProductItem
  onSelectProduct: (product: ProductItem) => void
  onCancel: () => void
  onContinue: () => void
}
export const ProductsTemplate: FC<ProductsTemplateProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  products,
  selectedProduct,
  onSelectProduct,
  onCancel,
  onContinue,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Typography variant="h6" style={styles.header}>
            Select a Product and Index
          </Typography>
          <Select
            label="Site"
            value={selectedSite.value}
            options={sites}
            fullWidth={true}
            style={styles.site}
            onChangeText={onSelectSite}
          />
          <Typography variant="subtitle1" style={styles.title}>
            Select a Product
          </Typography>
          <SimpleList
            data={products}
            selectedItem={selectedProduct}
            keyExtractor={(item) => item.id}
            labelExtractor={(item) => item.label}
            onSelectItem={onSelectProduct}
          />
        </View>
      </View>
      <View style={styles.buttons}>
        <Button mode="outlined" customStyle={styles.button} onPress={onCancel}>
          Cancel
        </Button>
        <Button
          mode="contained"
          customStyle={styles.button}
          disabled={!selectedProduct}
          onPress={onContinue}
        >
          Next
        </Button>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
  },
  content: {
    flex: 1,
    paddingHorizontal: H_PADDING,
  },
  header: {
    marginVertical: V_PADDING,
    fontSize: 20,
  },
  site: {},
  title: {
    marginVertical: 16,
    fontSize: 14,
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: LingoColors.border,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: V_PADDING,
    backgroundColor: LingoColors.background.paper,
    shadowColor: LingoColors.common.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
  },
  button: {
    height: 42,
    flex: 0.45,
  },
})
export default ProductsTemplate

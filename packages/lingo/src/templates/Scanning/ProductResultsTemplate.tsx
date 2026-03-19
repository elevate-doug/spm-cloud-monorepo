import { FC, useRef, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native'
import { ActivityIndicator, List } from 'react-native-paper'

import {
  ScrollProvider,
  useScroll,
} from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../components/containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import { Dropdown } from '../../components/inputs'
import { Typography } from '../../components/typography'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
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

export interface ProductItemWithMetadata extends ProductItem {
  metadata?: {
    setTypeId: string
    hasMultipleIndexes: boolean
    indexCount: number
    indexes: Array<{
      id: string
      indexNumber: string
    }>
    selectedIndex?: {
      id: string
      indexNumber: string
    }
  }
}

export type ProductResultsTemplateProps = {
  sites: { id: string; value: string }[]
  siteValue: string | null
  products: ProductItem[]
  selectedProduct?: ProductItem
  loading?: boolean
  onChangeSiteValue?: (value: string) => void
  onSelectProduct?: (product: ProductItem) => void
  onCancel?: () => void
  onContinue?: (product: ProductItem) => void
}

type ProductListProps = {
  items: ProductItem[]
  renderItem: any
  selectedItem?: ProductItem
  siteValue: string
  sites: { id: string; value: string }[]
  onChangeSiteValue?: (site: string) => void
  loading?: boolean
}

const ProductList: FC<ProductListProps> = ({ items, renderItem, loading }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()
  const listRef = useRef<FlatList>(null)

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={LingoColors.primary.main} />
      ) : (
        <Typography variant="body1" color={LingoColors.text.disabled}>
          No products found
        </Typography>
      )}
    </View>
  )

  return (
    <FlatList
      ref={listRef}
      data={loading ? [] : items}
      contentContainerStyle={[
        styles.list,
        (items.length === 0 || loading) && styles.emptyList,
      ]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
      onContentSizeChange={(_, height) => onContentChange(height)}
      removeClippedSubviews={false}
      ListEmptyComponent={ListEmptyComponent}
    />
  )
}

export const ProductResultsTemplate: FC<ProductResultsTemplateProps> = ({
  sites = [],
  siteValue,
  products = [],
  loading = false,
  onChangeSiteValue,
  onCancel,
  onContinue,
}) => {
  const [selectedItem, setSelectedItem] = useState<ProductItem | undefined>()

  const renderItem = ({ item }: { item: ProductItem }) => (
    <List.Item
      testID="product-result-item"
      title={item.label}
      style={[
        styles.listItem,
        item.id === selectedItem?.id && {
          backgroundColor: LingoColors.highlightBackground,
        },
      ]}
      titleStyle={styles.listItemTitle}
      onPress={() => setSelectedItem(item)}
      disabled={loading}
    />
  )

  return (
    <SafeAreaView style={styles.root}>
      <ScrollProvider>
        <ShadowTopWrapper>
          <View style={styles.headerContainer}>
            <Typography variant="h6" bold>
              Select a Product and Index
            </Typography>
            <Dropdown
              label="Site"
              value={siteValue ?? ''}
              options={sites.map((site) => ({
                id: site.id,
                value: site.value,
              }))}
              onChangeValue={loading ? () => {} : onChangeSiteValue}
              disabled={loading}
            />
            <Typography variant="subtitle1" bold>
              Select a Product
            </Typography>
          </View>
        </ShadowTopWrapper>
        <ProductList
          items={products}
          renderItem={renderItem}
          selectedItem={selectedItem}
          siteValue={siteValue ?? ''}
          sites={sites}
          onChangeSiteValue={onChangeSiteValue}
          loading={loading}
        />
        <ShadowBottomWrapper>
          <BottomButtons
            cancelOnPress={onCancel}
            submitOnPress={() => selectedItem && onContinue?.(selectedItem)}
            submitText="OK"
            cancelText="Back"
            isValid={true}
            isLoading={loading}
          />
        </ShadowBottomWrapper>
      </ScrollProvider>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
  },
  headerContainer: {
    gap: V_PADDING * 1.5,
    padding: V_PADDING,
  },
  list: {
    flexGrow: 1,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  listItem: {
    paddingHorizontal: H_PADDING,
  },
  listItemTitle: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: LingoColors.border,
  },
  buttons: {
    gap: H_PADDING * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: H_PADDING,
  },
  button: {
    flex: 1,
  },
})

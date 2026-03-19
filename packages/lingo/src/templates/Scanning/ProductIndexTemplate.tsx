import { FC, useRef } from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native'
import { Divider, List } from 'react-native-paper'

import { ProductItem } from './ProductResultsTemplate'
import { Typography } from '../../components'
import {
  ScrollProvider,
  useScroll,
} from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../components/containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values'
export type ProductIndexItem = {
  id: string
  label: string
}

type ProductIndexListProps = {
  selectedProduct?: ProductItem
  indexes?: ProductIndexItem[]
  selectedIndex?: ProductIndexItem
  onSelectedIndex?: (index: ProductIndexItem) => void
  loading?: boolean
}

const ProductIndexList: FC<ProductIndexListProps> = ({
  selectedProduct,
  indexes,
  selectedIndex,
  onSelectedIndex,
  loading = true,
}) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()
  const listRef = useRef<FlatList>(null)

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={LingoColors.primary.main} />
      ) : (
        <Typography variant="body1" color={LingoColors.text.disabled}>
          No indexes found
        </Typography>
      )}
    </View>
  )

  const renderItem = ({ item }: { item: ProductIndexItem }) => (
    <List.Item
      testID="product-index-item"
      title={item.label}
      titleStyle={{
        color: LingoColors.primary.main,
      }}
      style={[
        item.id === selectedIndex?.id && {
          backgroundColor: LingoColors.highlightBackground,
        },
      ]}
      onPress={() => onSelectedIndex?.(item)}
      disabled={loading}
    />
  )

  return (
    <FlatList
      ref={listRef}
      data={loading ? [] : (indexes ?? [])}
      contentContainerStyle={[
        styles.listContent,
        ((indexes?.length ?? 0) === 0 || loading) && styles.emptyContainer,
      ]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
      onContentSizeChange={(_, height) => onContentChange(height)}
      removeClippedSubviews={false}
      ListEmptyComponent={ListEmptyComponent}
      ItemSeparatorComponent={() => <Divider />}
    />
  )
}

export type ProductIndexTemplateProps = {
  indexes?: ProductIndexItem[]
  selectedProduct?: ProductItem
  selectedIndex?: ProductIndexItem
  onSelectedIndex?: (index: ProductIndexItem) => void
  onCancel?: () => void
  onContinue?: () => void
  loading?: boolean
  productsLoading?: boolean
}
export const ProductIndexTemplate: FC<ProductIndexTemplateProps> = ({
  selectedProduct,
  indexes,
  selectedIndex,
  onSelectedIndex,
  onCancel,
  onContinue,
  loading = false,
  productsLoading = false,
}) => {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollProvider>
        <ShadowTopWrapper>
          <View style={styles.header}>
            <Typography variant="h6" bold>
              Select a Product and Index
            </Typography>
            <View>
              <Typography variant="subtitle1" bold>
                Product selection
              </Typography>
              <Typography variant="body1" color={LingoColors.text.secondary}>
                {selectedProduct?.label}
              </Typography>
            </View>
            <Typography variant="subtitle1" bold>
              Select an Index
            </Typography>
          </View>
        </ShadowTopWrapper>
        <View style={styles.content}>
          <ProductIndexList
            selectedProduct={selectedProduct}
            indexes={indexes}
            selectedIndex={selectedIndex}
            onSelectedIndex={onSelectedIndex}
            loading={productsLoading}
          />
        </View>
      </ScrollProvider>
      <ShadowBottomWrapper>
        <BottomButtons
          cancelOnPress={onCancel || (() => {})}
          submitOnPress={onContinue || (() => {})}
          submitText="Continue"
          cancelText="Back"
          isValid={true}
          isLoading={loading}
        />
      </ShadowBottomWrapper>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: H_PADDING,
  },
  header: {
    gap: V_PADDING * 1.5,
    padding: V_PADDING,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
})

import { FC, useRef } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Divider } from 'react-native-paper'

import { SearchField, Typography } from '../../components'
import {
  ScrollProvider,
  useScroll,
} from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowTopWrapper } from '../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import { LingoColors } from '../../theme'
import { DEFAULT_BORDER_RADIUS_LG, V_PADDING } from '../../values'

export type ScanProductsRecentScanItem = {
  product: string
  index: string
  processPoint: string
  quantity?: number
  timestamp?: string
  detail?: string
}

export type ScanningTemplateProps = {
  userName?: string
  processPointPlaceholder?: string
  processPointText?: string
  productPlaceholder?: string
  productText?: string
  recentScans?: ScanProductsRecentScanItem[]
  onProcessPointChangeText?: (text: string) => void
  onProductChangeText?: (text: string) => void
  onSearchProcessPoint?: () => void
  onSearchProduct?: () => void
  onProcessPointDialogDismiss?: () => void
  onProductDialogDismiss?: () => void
  children?: React.ReactNode
}

export const ScanningTemplate: FC<ScanningTemplateProps> = ({
  userName,
  processPointPlaceholder,
  processPointText,
  onProcessPointChangeText,
  productPlaceholder,
  productText,
  onProductChangeText,
  onSearchProcessPoint,
  onSearchProduct,
  recentScans,
  children,
}) => {
  const listRef = useRef<FlatList>(null)

  const RecentScansList = () => {
    const { handleScroll, onLayout, onContentChange } = useScroll()

    const renderRecentScanItem = ({
      item,
    }: {
      item: ScanProductsRecentScanItem
    }) => (
      <View style={styles.itemContainer}>
        <Typography variant="h6">{item.product}</Typography>
        <View style={styles.itemBottom}>
          <Typography variant="body2">
            {`Location: ${item.processPoint}`}
          </Typography>
          <Typography variant="body2">{item.index}</Typography>
        </View>
        {item.quantity && (
          <Typography variant="body2">{`Qty: ${item.quantity}`}</Typography>
        )}
      </View>
    )

    const renderEmptyList = () => (
      <>
        <View style={styles.emptyList}>
          <Typography variant="body1" color={LingoColors.text.disabled}>
            No recent scans
          </Typography>
        </View>
        <Divider style={{ backgroundColor: LingoColors.border }} />
      </>
    )

    return (
      <FlatList
        ref={listRef}
        keyboardShouldPersistTaps="always"
        data={recentScans}
        contentContainerStyle={styles.recentScansList}
        ItemSeparatorComponent={() => (
          <View style={{ height: V_PADDING / 2 }} />
        )}
        renderItem={renderRecentScanItem}
        ListEmptyComponent={renderEmptyList}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
        onContentSizeChange={(_, height) => onContentChange(height)}
      />
    )
  }

  return (
    <View style={styles.root}>
      <ScrollProvider>
        <ShadowTopWrapper>
          <View style={styles.headerContainer}>
            <View style={styles.topContainer}>
              <Typography variant="h6">Scan or search</Typography>
              <Typography variant="body1" color={LingoColors.text.secondary}>
                User: {userName ?? ''}
              </Typography>
            </View>
            <SearchField
              placeholder={processPointPlaceholder ?? ''}
              value={processPointText ?? ''}
              onChangeText={onProcessPointChangeText ?? (() => {})}
              onSearch={onSearchProcessPoint}
            />
            <SearchField
              placeholder={productPlaceholder ?? ''}
              value={productText ?? ''}
              minLength={3}
              onChangeText={onProductChangeText ?? (() => {})}
              onSearch={onSearchProduct ?? (() => {})}
            />
            {children}
            <Typography variant="subtitle1" style={styles.recentScansTitle}>
              Recent scans
            </Typography>
          </View>
        </ShadowTopWrapper>
        <RecentScansList />
      </ScrollProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
  },
  headerContainer: {
    padding: V_PADDING,
    gap: V_PADDING,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentScansTitle: {
    marginTop: V_PADDING,
  },
  recentScansList: {
    flexGrow: 1,
    paddingHorizontal: V_PADDING,
    paddingBottom: V_PADDING * 2,
  },
  itemContainer: {
    backgroundColor: LingoColors.highlightBackground,
    borderRadius: DEFAULT_BORDER_RADIUS_LG,
    borderWidth: 1,
    borderColor: LingoColors.primary.main,
    padding: V_PADDING,
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: V_PADDING / 2,
  },
  emptyList: {
    alignItems: 'center',
    padding: V_PADDING,
  },
})

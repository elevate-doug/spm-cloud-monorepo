import { format, parseISO } from 'date-fns'
import { FC, LegacyRef, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'

import { CaseFlatPoco } from '../../../../api/src/service/case/CaseTypes'
import { DialogMenu } from '../../components'
import {
  ScrollProvider,
  useScroll,
} from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../components/containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import {
  DialogMessage,
  DialogMessageRef,
} from '../../components/feedback/Dialog/DialogMessage'
import { Button, ConfirmDialog, SearchField } from '../../components/inputs'
import { Typography } from '../../components/typography/Typography'
import { LingoColors } from '../../theme'
import { DEFAULT_BORDER_RADIUS_LG, H_PADDING, V_PADDING } from '../../values'

const ItemList: FC<{
  items: CaseFlatPoco[]
  renderItem: ListRenderItem<CaseFlatPoco>
  listRef: React.RefObject<FlatList<CaseFlatPoco>>
}> = ({ items, renderItem, listRef }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()

  return (
    <FlatList
      ref={listRef}
      data={items}
      style={styles.flatListContainer}
      renderItem={renderItem}
      keyExtractor={(item) => `case-${item.id?.toString()}`}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
      onContentSizeChange={(_, height) => onContentChange(height)}
      removeClippedSubviews={false}
    />
  )
}

export type CaseCartsProps = {
  cases?: CaseFlatPoco[]
  query: string
  onQueryChange: (text: string) => void
  onBuildSelectedCase: (caseCart: CaseFlatPoco) => void
  onNavigateToAddEdit: (caseCart: CaseFlatPoco) => void
  onSearch: () => void
  isLoading: boolean
  dialogMessageRef: LegacyRef<DialogMessageRef>
  onRemoveCaseFromCaseCart: (caseCart: CaseFlatPoco) => void
  onNavigateToSplit: (caseCart: CaseFlatPoco) => void
  onNavigateToMove: (caseCart: CaseFlatPoco) => void
  onNavigateToDeliver: () => void
  onNavigateToAddCase: () => void
  onEmptyCart: () => void
  barcode?: string
}

export const CaseCartsTemplate: FC<CaseCartsProps> = ({
  cases,
  query,
  onQueryChange,
  onSearch,
  onBuildSelectedCase,
  onNavigateToAddEdit,
  isLoading,
  dialogMessageRef,
  onRemoveCaseFromCaseCart,
  onNavigateToSplit,
  onNavigateToMove,
  onNavigateToDeliver,
  onNavigateToAddCase,
  onEmptyCart,
  barcode,
}) => {
  const listRef = useRef<FlatList<CaseFlatPoco>>(null)

  const [caseCartToRemove, setCaseCartToRemove] = useState<
    CaseFlatPoco | undefined
  >(undefined)

  const scrollTo = (index: number) => {
    if (listRef.current) {
      listRef.current.scrollToIndex({ index, animated: true })
    }
  }

  const renderTitleText = (title: string, text: string) => {
    return (
      <View>
        <Typography
          variant="caption"
          color={LingoColors.text.secondary}
          style={styles.buildStatusText}
        >
          {title}
        </Typography>
        <Typography variant="body1" style={styles.titleText}>
          {text}
        </Typography>
      </View>
    )
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<CaseFlatPoco>) => {
    const isLastItem = cases && index === cases.length - 1

    const items = [
      {
        icon: 'build-circle',
        label: 'Build selected case',
        onPress: () => onBuildSelectedCase(item),
      },
      {
        icon: 'pencil',
        label: 'Edit case',
        onPress: () => onNavigateToAddEdit(item),
      },
      {
        icon: 'delete',
        label: 'Remove from cart',
        onPress: () => setCaseCartToRemove(item),
        color: LingoColors.red[500],
      },
      {
        icon: 'case-split',
        label: 'Split case',
        onPress: () => onNavigateToSplit(item),
      },
      {
        icon: 'swap-vertical-circle',
        label: 'Move case',
        onPress: () => onNavigateToMove(item),
      },
    ]

    return (
      <View style={styles.caseCard} key={`case-${item.uniqueId}`}>
        <View style={styles.caseCardHeader}>
          <Typography variant="body1" bold>
            {item.caseNumber ?? ''}
          </Typography>
          <DialogMenu
            items={items}
            iconWrapperSize={32}
            onVisibleChange={() => scrollTo(index)}
            delayToOpen={150}
            position={isLastItem ? 'above' : 'auto'}
          />
        </View>

        <View style={styles.caseCardInfo}>
          {renderTitleText('Physician', item.physicianName ?? '')}
          {renderTitleText('OR Room', item.orRoomName ?? '')}
        </View>

        <Typography variant="caption">
          {format(parseISO(item.whenStart), 'MM/dd/yyyy h:mm a')}
        </Typography>
      </View>
    )
  }

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={LingoColors.primary.main} />
    </View>
  )

  const renderCases = () => (
    <ScrollProvider>
      <View style={styles.growContainer}>
        <ShadowTopWrapper>
          <View style={styles.buildInfoContainer}>
            <View style={styles.buildInfoRow}>
              {renderTitleText('Cases', `${cases?.length ?? 0}`)}
              {renderTitleText('Build Status', 'In Progress')}
            </View>
            <Button
              mode="contained"
              onPress={onNavigateToAddCase}
              customStyle={styles.addCaseButton}
            >
              ADD CASE
            </Button>
          </View>
        </ShadowTopWrapper>

        <ItemList
          items={cases ?? []}
          renderItem={renderItem}
          listRef={listRef}
        />

        <ShadowBottomWrapper>
          <View style={styles.bottomButtons}>
            <Button
              mode="outlined"
              onPress={onEmptyCart}
              customStyle={styles.emptyCartButton}
              customTextStyle={styles.emptyCartButtonText}
            >
              EMPTY CART
            </Button>
            <Button
              mode="contained"
              onPress={onNavigateToDeliver}
              customStyle={styles.deliverCartButton}
            >
              DELIVER CART
            </Button>
          </View>
        </ShadowBottomWrapper>
      </View>
    </ScrollProvider>
  )

  const renderEmptyCases = () => (
    <View style={styles.addCaseContainer}>
      {renderTitleText('Build status', `0 case on cart ${barcode}`)}
      <Button
        mode="contained"
        onPress={onNavigateToAddCase}
        customStyle={styles.addCaseButton}
      >
        ADD CASE
      </Button>
    </View>
  )

  const renderInitialState = () => (
    <Typography
      variant="body1"
      style={styles.scanMessage}
      color={LingoColors.text.secondary}
    >
      Scan a cart to view its cases.
    </Typography>
  )

  const renderContent = () => {
    if (isLoading) {
      return renderLoading()
    } else if (!cases) {
      return renderInitialState()
    } else if (cases.length === 0) {
      return renderEmptyCases()
    } else {
      return renderCases()
    }
  }

  const hideCaseCartRemoveConfirmationDialog = () => {
    setCaseCartToRemove(undefined)
  }

  const removeCaseFromCaseCart = async () => {
    if (caseCartToRemove) {
      onRemoveCaseFromCaseCart(caseCartToRemove)
      setCaseCartToRemove(undefined)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={LingoColors.primary.main}
        barStyle="light-content"
      />
      <View style={styles.topForm}>
        <SearchField
          placeholder="Scan case cart"
          value={query}
          onChangeText={onQueryChange}
          onSearch={onSearch}
          minLength={3}
        />
      </View>
      {renderContent()}
      <DialogMessage ref={dialogMessageRef} />
      <ConfirmDialog
        visible={!!caseCartToRemove}
        title="Remove Case"
        message={`You are about to remove case ${caseCartToRemove?.caseNumber} from this cart. All products that had been scanned to this cart for this case will be flagged as no longer on the cart, and will be added to the needs list. \n\nDo you want to continue removing this case from the cart?`}
        confirmText="REMOVE CASE"
        confirmButtonColor={LingoColors.primary.main}
        onCancel={hideCaseCartRemoveConfirmationDialog}
        onConfirm={removeCaseFromCaseCart}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: V_PADDING,
    backgroundColor: LingoColors.background.paper,
    paddingBottom: 0,
  },
  growContainer: {
    flexGrow: 1,
  },
  topForm: {
    justifyContent: 'flex-start',
  },
  scanMessage: {
    marginTop: V_PADDING,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  addCaseContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buildStatusText: {
    marginBottom: 4,
  },
  titleText: {
    paddingBottom: H_PADDING / 2,
  },
  addCaseButton: {
    height: 44,
    paddingHorizontal: H_PADDING / 2,
  },
  caseCard: {
    marginBottom: V_PADDING,
    backgroundColor: LingoColors.primary.selected,
    padding: V_PADDING,
    borderRadius: DEFAULT_BORDER_RADIUS_LG,
    borderWidth: 1,
    borderColor: LingoColors.primary.main,
  },
  caseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: V_PADDING / 2,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: V_PADDING,
    backgroundColor: LingoColors.background.paper,
  },
  emptyCartButton: {
    flex: 1,
    height: 52,
    borderColor: LingoColors.error.main,
  },
  emptyCartButtonText: {
    fontWeight: 'bold',
    color: LingoColors.error.main,
  },
  deliverCartButton: {
    flex: 1,
    height: 52,
  },
  buildInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: V_PADDING,
    alignItems: 'center',
  },
  caseCardInfo: {
    flexDirection: 'row',
    gap: H_PADDING,
  },
  buildInfoRow: {
    flexDirection: 'row',
    gap: 32,
  },
  flatListContainer: {
    flex: 1,
  },
})

export default CaseCartsTemplate

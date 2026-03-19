import { FC, LegacyRef, useRef } from 'react'
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native'

import {
  ProductOrInstrumentForList,
  SelectProductOrInstrumentModal,
  ChangeCycleModal,
  CycleOption,
} from './modals'
import { SelectProductIndexModal } from './modals/SelectProductIndexModal'
import { SetTypeOrInstrumentPocoDto } from '../../../../api'
import { GENERIC_INDEX_NUMBER } from '../../../../api/src/service/ServiceConsts'
import {
  DialogMenu,
  DialogMessage,
  DialogMessageRef,
  Loading,
  Typography,
} from '../../components'
import {
  ScrollProvider,
  useScroll,
} from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../components/containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import { SearchField, SelectProps, Switch } from '../../components/inputs'
import { EnterQuantityModal } from '../../components/inputs/EnterQuantityModal/EnterQuantityModal'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { truncateText } from '../../utils/StringUtils'
import {
  DEFAULT_BORDER_RADIUS_LG,
  H_PADDING,
  V_PADDING,
} from '../../values/Spacing'

const ItemList: FC<{
  items: Partial<SetTypeOrInstrumentPocoDto>[]
  renderItem: ListRenderItem<Partial<SetTypeOrInstrumentPocoDto>>
  listRef: React.RefObject<FlatList<Partial<SetTypeOrInstrumentPocoDto>>>
}> = ({ items, renderItem, listRef }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()

  return (
    <FlatList
      ref={listRef}
      data={items}
      style={styles.flatListContainer}
      renderItem={renderItem}
      keyExtractor={(item) => `case-${item.description?.toString()}`}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
      onContentSizeChange={(_, height) => onContentChange(height)}
      removeClippedSubviews={false}
    />
  )
}

export type SterilizationLoadContentsTemplateProps = {
  title: string
  loading: boolean
  loadNumber: string
  dialogMessageRef?: LegacyRef<DialogMessageRef>
  query: string
  onQueryChange: (query: string) => void
  onSearch: () => void
  isNoItemsInLoad: boolean
  onNoItemsInLoadChange: (value: boolean) => void
  cycleName: string
  weightOfContents: number
  maxAllowedWeight: number
  isSelectingProductOrInstrument: boolean
  selectedProductOrInstrument?: ProductOrInstrumentForList
  onSelectProductOrInstrumentPress: (
    selectedProductOrInstrument?: ProductOrInstrumentForList
  ) => void
  onCancelSelectProductOrInstrumentPress: () => void
  productsOrInstrumentsForList: ProductOrInstrumentForList[]
  sitesForSelect: SelectProps['options']
  selectedSiteId?: string
  onSiteChange: (siteId: string) => void
  setTypeOrInstruments: Partial<SetTypeOrInstrumentPocoDto>[]
  onPreviousPress: () => void
  onNextPress: () => void
  isSelectingProductIndex: boolean
  onSelectProductIndexPress: (indexNumber: string) => void
  onCancelSelectProductIndexPress: () => void
  selectedIndex: string
  indexes: string[]
  onRemoveItem: (item: Partial<SetTypeOrInstrumentPocoDto>) => void
  onChangeQuantity: (item: Partial<SetTypeOrInstrumentPocoDto>) => void
  onChangeCycle: (item: Partial<SetTypeOrInstrumentPocoDto>) => void
  showChangeQuantityModal: boolean
  changeQuantityItem: Partial<SetTypeOrInstrumentPocoDto> | undefined
  newQuantity: number | ''
  setNewQuantity: (value: number | '') => void
  quantityError: string
  onCancelChangeQuantity: () => void
  onConfirmChangeQuantity: () => void
  maxQuantityModal: number
  isChangingCycle: boolean
  onChangeCyclePress: (cycleTypeId: string) => void
  onCancelChangeCycle: () => void
  allowedCycles: CycleOption[]
  selectedCycleTypeId?: string
}

export const SterilizationLoadContentsTemplate: FC<
  SterilizationLoadContentsTemplateProps
> = ({
  title,
  loading,
  dialogMessageRef,
  loadNumber,
  query,
  onQueryChange,
  onSearch,
  isNoItemsInLoad,
  onNoItemsInLoadChange,
  cycleName,
  isSelectingProductOrInstrument,
  onSelectProductOrInstrumentPress,
  onCancelSelectProductOrInstrumentPress,
  productsOrInstrumentsForList,
  sitesForSelect,
  selectedSiteId,
  onSiteChange,
  setTypeOrInstruments,
  onPreviousPress,
  onNextPress,
  weightOfContents,
  maxAllowedWeight,
  selectedIndex,
  indexes,
  isSelectingProductIndex,
  onSelectProductIndexPress,
  onCancelSelectProductIndexPress,
  selectedProductOrInstrument,
  onRemoveItem,
  onChangeQuantity,
  onChangeCycle,
  showChangeQuantityModal,
  changeQuantityItem,
  newQuantity,
  setNewQuantity,
  quantityError,
  onCancelChangeQuantity,
  onConfirmChangeQuantity,
  maxQuantityModal,
  isChangingCycle,
  onChangeCyclePress,
  onCancelChangeCycle,
  allowedCycles,
  selectedCycleTypeId,
}) => {
  const listRef = useRef<FlatList<Partial<SetTypeOrInstrumentPocoDto>>>(null)

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

  const renderItem = ({
    item,
    index,
  }: ListRenderItemInfo<Partial<SetTypeOrInstrumentPocoDto>>) => {
    const isLastItem =
      setTypeOrInstruments && index === setTypeOrInstruments.length - 1

    // Only show change quantity for instruments and products with '000' index
    const canChangeQuantity =
      item.isInstrument ||
      (!item.isInstrument &&
        item.setIndex?.indexNumber === GENERIC_INDEX_NUMBER)

    const items = [
      ...(canChangeQuantity
        ? [
            {
              icon: 'change-quantity',
              label: 'Change quantity',
              onPress: () => onChangeQuantity(item),
            },
          ]
        : []),
      ...(item.isSetInViolationOfCycleType
        ? [
            {
              icon: 'change-cycle',
              label: 'Change cycle',
              onPress: () => onChangeCycle(item),
            },
          ]
        : []),
      {
        icon: 'delete',
        label: 'Remove item',
        onPress: () => onRemoveItem(item),
        color: LingoColors.red[500],
      },
    ]

    return (
      <View
        style={[
          styles.listItem,
          item.isSetInViolationOfCycleType && styles.listItemIncompatible,
        ]}
        key={`case-${item.description?.toString()}-${index}}`}
      >
        <View style={styles.listItemHeader}>
          <View style={styles.listItemHeaderLeft}>
            <Typography variant="body1" bold>
              {truncateText(item.description ?? '')}
            </Typography>
            {item.isSetInViolationOfCycleType && (
              <Typography
                variant="caption"
                color={LingoColors.error.main}
                bold
                style={styles.incompatibleText}
              >
                Not allowed in cycle
              </Typography>
            )}
          </View>
          <DialogMenu
            items={items}
            iconWrapperSize={32}
            onVisibleChange={() => scrollTo(index)}
            delayToOpen={150}
            position={isLastItem ? 'above' : 'auto'}
          />
        </View>

        <View style={styles.listItemInfo}>
          {item.setIndex?.indexNumber === '000' || item.isInstrument
            ? renderTitleText('Quantity', item.qty?.toString() ?? '--')
            : null}
          {item.isInstrument
            ? null
            : renderTitleText('Index', item.setIndex?.indexNumber ?? '--')}
          {item.isInstrument
            ? null
            : renderTitleText(
                'Weight',
                typeof item.weight === 'number' ? item.weight.toString() : '--'
              )}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <DialogMessage ref={dialogMessageRef} />

      <SelectProductOrInstrumentModal
        visible={isSelectingProductOrInstrument}
        handleOkPress={onSelectProductOrInstrumentPress}
        handleCancelPress={onCancelSelectProductOrInstrumentPress}
        sitesForSelect={sitesForSelect}
        onSiteChange={onSiteChange}
        selectedSiteId={selectedSiteId}
        productsOrInstrumentsForList={productsOrInstrumentsForList}
      />

      <SelectProductIndexModal
        visible={isSelectingProductIndex}
        handleOkPress={onSelectProductIndexPress}
        handleBackPress={onCancelSelectProductIndexPress}
        selectedIndex={selectedIndex}
        indexes={indexes}
        productName={selectedProductOrInstrument?.label ?? ''}
      />

      {loading ? (
        <Loading />
      ) : (
        <ScrollProvider>
          <View style={styles.content}>
            <ShadowTopWrapper>
              <Typography variant="h6" bold>
                {title}
              </Typography>
              <View style={styles.loadTableRow}>
                <Typography
                  variant="caption"
                  color={LingoColors.text.secondary}
                  style={{ marginRight: -H_PADDING / 2 }}
                >
                  Load
                </Typography>
                <Typography variant="body1">#{loadNumber}</Typography>
                <Typography
                  variant="caption"
                  color={LingoColors.text.secondary}
                  style={{ marginRight: -H_PADDING / 2 }}
                >
                  Cycle
                </Typography>
                <Typography variant="body1">{cycleName ?? ''}</Typography>
              </View>

              <View style={styles.topForm}>
                <SearchField
                  placeholder="Search"
                  value={query}
                  onChangeText={onQueryChange}
                  onSearch={onSearch}
                  minLength={3}
                />
              </View>
              <View style={styles.switchRow}>
                <View style={styles.infoItem}>
                  <Typography
                    variant="caption"
                    color={LingoColors.text.secondary}
                    style={styles.buildStatusText}
                  >
                    Items in Load
                  </Typography>
                  <Typography variant="body1" style={styles.titleText}>
                    {setTypeOrInstruments.length}
                  </Typography>
                </View>
                <View style={styles.infoItem}>
                  <Typography
                    variant="caption"
                    color={LingoColors.text.secondary}
                    style={styles.buildStatusText}
                  >
                    Contents Weight
                  </Typography>
                  <Typography variant="body1" style={styles.titleText}>
                    {weightOfContents}/
                    <Typography
                      variant="body1"
                      color={
                        weightOfContents > maxAllowedWeight
                          ? LingoColors.error.main
                          : LingoColors.text.primary
                      }
                    >
                      {maxAllowedWeight}
                    </Typography>
                  </Typography>
                </View>
                <View style={styles.switchContainer}>
                  <Typography
                    variant="caption"
                    color={LingoColors.text.secondary}
                    style={styles.buildStatusText}
                  >
                    No items in load
                  </Typography>
                  <Switch
                    value={isNoItemsInLoad}
                    onChange={onNoItemsInLoadChange}
                    disabled={setTypeOrInstruments.length > 0}
                  />
                </View>
              </View>
            </ShadowTopWrapper>

            {setTypeOrInstruments.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Typography
                  variant="body1"
                  color={LingoColors.text.secondary}
                  style={styles.emptyStateText}
                >
                  There are no items in this load.
                </Typography>
              </View>
            ) : (
              <ItemList
                items={setTypeOrInstruments ?? []}
                renderItem={renderItem}
                listRef={listRef}
              />
            )}

            <ShadowBottomWrapper>
              <BottomButtons
                cancelOnPress={onPreviousPress}
                submitOnPress={onNextPress}
                isValid
                cancelText="PREVIOUS"
                submitText="NEXT"
                isLoading={false}
              />
            </ShadowBottomWrapper>
          </View>
        </ScrollProvider>
      )}

      <EnterQuantityModal
        visible={showChangeQuantityModal}
        title="Enter New Qty"
        subtitle={changeQuantityItem?.description ?? ''}
        quantity={newQuantity}
        setQuantity={setNewQuantity}
        error={quantityError}
        onCancel={onCancelChangeQuantity}
        onContinue={onConfirmChangeQuantity}
        cancelText="CANCEL"
        continueText="SAVE"
        minValue={1}
        maxValue={maxQuantityModal}
      />

      <ChangeCycleModal
        visible={isChangingCycle}
        handleOkPress={onChangeCyclePress}
        handleCancelPress={onCancelChangeCycle}
        cycles={allowedCycles}
        selectedCycleId={selectedCycleTypeId}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: V_PADDING,
    backgroundColor: LingoColors.background.paper,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: V_PADDING,
  },

  topForm: {
    justifyContent: 'flex-start',
    gap: V_PADDING,
    marginTop: V_PADDING,
  },

  buildStatusText: {
    marginBottom: 4,
  },
  titleText: {
    paddingBottom: V_PADDING / 2,
  },
  loadTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: V_PADDING,
    gap: H_PADDING,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: V_PADDING,
    gap: H_PADDING,
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  switchContainer: {
    alignItems: 'center',
    gap: H_PADDING / 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: V_PADDING * 4,
  },
  emptyStateText: {
    textAlign: 'center',
  },
  flatListContainer: {
    flex: 1,
    paddingVertical: V_PADDING,
  },
  listItem: {
    marginBottom: V_PADDING,
    backgroundColor: LingoColors.primary.selected,
    padding: V_PADDING,
    borderRadius: DEFAULT_BORDER_RADIUS_LG,
    borderWidth: 1,
    borderColor: LingoColors.primary.main,
  },
  listItemIncompatible: {
    borderColor: LingoColors.error.main,
    backgroundColor: LingoColors.error.states.hover,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: V_PADDING / 2,
  },
  listItemHeaderLeft: {
    flex: 1,
    marginRight: H_PADDING / 2,
  },
  incompatibleText: {
    marginTop: 4,
  },
  listItemInfo: {
    flexDirection: 'row',
    gap: H_PADDING,
  },
})

export default SterilizationLoadContentsTemplate

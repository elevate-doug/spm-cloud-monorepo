import { format, parseISO } from 'date-fns'
import { FC, LegacyRef, useState, useMemo, useEffect, useRef } from 'react'
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { CaseFlatPoco } from '../../../../api'
import {
  CaseNeedFlatPoco,
  CaseSetFlatPoco,
} from '../../../../api/src/service/case-cart-build/CaseCartBuildTypes'
import { DialogMenu } from '../../components'
import {
  DialogMessage,
  DialogMessageRef,
} from '../../components/feedback/Dialog/DialogMessage'
import {
  BigWarningModal,
  ConfirmDialog,
  SearchField,
} from '../../components/inputs'
import { EnterQuantityModal } from '../../components/inputs/EnterQuantityModal/EnterQuantityModal'
import { Typography } from '../../components/typography/Typography'
import { LingoColors } from '../../theme'
import { truncateText } from '../../utils/StringUtils'
import { DEFAULT_BORDER_RADIUS, V_PADDING, VH } from '../../values'

export type CaseCartsDetailsProps = {
  query: string
  onQueryChange: (text: string) => void
  onSearch: () => void
  dialogMessageRef: LegacyRef<DialogMessageRef>
  item: CaseSetFlatPoco & Partial<CaseFlatPoco>
  caseNeeds: CaseNeedFlatPoco[]
  addedSets: CaseSetFlatPoco[]
  onRemoveCaseNeed: (id: CaseNeedFlatPoco) => Promise<void>
  onRemoveCaseSet: (caseSet: CaseSetFlatPoco) => Promise<void>
  isLoading: boolean
  tabIndex: number
  setTabIndex: (index: number) => void
  showRedDot?: boolean
  minQuantity: number
  maxQuantity: number
  newQuantity: number | ''
  setNewQuantity: (value: number | '') => void
  error: string
  setError: (value: string) => void
  onChangeQuantity: (
    caseItem: CaseNeedFlatPoco | CaseSetFlatPoco,
    newQuantity: string
  ) => Promise<void>
  itemToScrollTo?: string | null
  resetItemToScrollTo?: () => void
  showEnterQuantityModal?: boolean
  onQuantityModalOkPress: () => void
  onQuantityModalCancelPress: () => void
  quantity?: string | null
  setQuantity: (quantity: string | null) => void
  errorMessage?: string
  bigWarning?: {
    visible: boolean
    title: string
    message: string
    checkboxLabel: string
    onConfirmPress: () => void
    onCancelPress: () => void
  }
}

export const ON_CART_INDEX = 0
export const STILL_NEEDED_INDEX = 1

const tabs = [
  { label: 'ON CART', badge: '' },
  { label: 'STILL NEEDED', badge: '' },
]

export const CaseCartsDetailsTemplate: FC<CaseCartsDetailsProps> = ({
  query,
  onQueryChange,
  onSearch,
  dialogMessageRef,
  item,
  caseNeeds,
  addedSets,
  onRemoveCaseNeed,
  onRemoveCaseSet,
  isLoading,
  setTabIndex,
  tabIndex,
  showRedDot,
  minQuantity,
  maxQuantity,
  newQuantity,
  setNewQuantity,
  error,
  onChangeQuantity,
  itemToScrollTo,
  resetItemToScrollTo,
  showEnterQuantityModal,
  onQuantityModalOkPress,
  onQuantityModalCancelPress,
  quantity,
  setQuantity,
  errorMessage,
  bigWarning,
}) => {
  const scrollViewRef = useRef<ScrollView>(null)

  const [caseNeedToRemove, setCaseNeedToRemove] = useState<
    CaseNeedFlatPoco | undefined
  >(undefined)
  const [caseSetToRemove, setCaseSetToRemove] = useState<
    CaseSetFlatPoco | undefined
  >(undefined)

  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [caseToChangeQuantity, setCaseToChangeQuantity] = useState<
    CaseNeedFlatPoco | CaseSetFlatPoco | undefined
  >(undefined)
  const [bigModalCheckboxChecked, setBigModalCheckboxChecked] = useState(false)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardVisible(true)
        setKeyboardHeight(e.endCoordinates.height)

        // Scroll to the search field position when keyboard appears
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: VH * 0.2, animated: true })
        }, 50)
      }
    )

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
        setKeyboardHeight(0)
      }
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  useEffect(() => {
    let scrollTimeoutId: ReturnType<typeof setTimeout> | null = null

    if (itemToScrollTo && scrollViewRef.current) {
      const itemToFind =
        tabIndex === STILL_NEEDED_INDEX
          ? caseNeeds.find((item) => item.id.toString() === itemToScrollTo)
          : addedSets.find((item) => item.id.toString() === itemToScrollTo)

      if (itemToFind) {
        const itemIndex =
          tabIndex === STILL_NEEDED_INDEX
            ? caseNeeds.findIndex(
                (item) => item.id.toString() === itemToScrollTo
              )
            : addedSets.findIndex(
                (item) => item.id.toString() === itemToScrollTo
              )

        if (itemIndex !== -1) {
          const itemHeight = 80
          const headerHeight = 150
          const scrollPosition = headerHeight + itemHeight * itemIndex
          scrollTimeoutId = setTimeout(() => {
            scrollViewRef.current?.scrollTo({
              y: scrollPosition,
              animated: true,
            })

            if (resetItemToScrollTo) {
              setTimeout(resetItemToScrollTo, 500)
            }
          }, 300)
        }
      }
    }

    return () => {
      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId)
      }
    }
  }, [itemToScrollTo, tabIndex, caseNeeds, addedSets])

  const tabsMemo = useMemo(() => {
    return tabs.map((tab, index) => {
      if (index === 0) {
        return { ...tab, badge: addedSets.length.toString() }
      } else {
        return { ...tab, badge: caseNeeds.length.toString() }
      }
    })
  }, [addedSets.length, caseNeeds.length])

  const renderStillNeededItem = (item: CaseNeedFlatPoco) => {
    const dialogMenuItems = [
      {
        icon: 'delete',
        label: 'Remove from cart',
        onPress: () => setCaseNeedToRemove(item),
        color: LingoColors.red[500],
      },
      {
        icon: 'change-quantity',
        label: 'Change quantity',
        onPress: () => {
          setCaseToChangeQuantity(item)
          setNewQuantity(item.qty)
        },
      },
    ]

    return (
      <View style={styles.caseCard} key={`case-${item.id}`}>
        <View style={styles.caseCardHeader}>
          <Typography variant="subtitle1" style={styles.caseNumber} bold>
            {truncateText(item.setDescription ?? '')}
          </Typography>
          <View style={styles.menuButtonContainer}>
            <DialogMenu
              icon="dots-vertical"
              items={dialogMenuItems}
              iconWrapperSize={32}
            />
          </View>
        </View>
        <View style={styles.buildInfoContainer}>
          <View style={styles.buildInfoRow}>
            <View>
              <Typography variant="body2" color={LingoColors.secondary.main}>
                Quantity
              </Typography>
              <Typography variant="body2" bold>
                {item.qty?.toString()}
              </Typography>
            </View>
            <View>
              <Typography variant="body2" color={LingoColors.secondary.main}>
                Most Available
              </Typography>
              <Typography variant="body2" bold>
                {truncateText(item.mostAvailableLocation ?? '', 25)}
              </Typography>
            </View>
          </View>
        </View>
      </View>
    )
  }

  const renderAddedItem = (item: CaseSetFlatPoco) => {
    const dialogMenuItems = [
      {
        icon: 'delete',
        label: 'Remove from cart',
        onPress: () => setCaseSetToRemove(item),
        color: LingoColors.red[500],
      },
      {
        icon: 'change-quantity',
        label: 'Change quantity',
        onPress: () => {
          setCaseToChangeQuantity(item)
          setNewQuantity(item.qty || 1)
        },
      },
    ]
    return (
      <View style={styles.caseCard} key={`case-${item.id}`}>
        <View style={styles.caseCardHeader}>
          <Typography variant="subtitle1" style={styles.caseNumber} bold>
            {truncateText(item.setDescription ?? '')}
          </Typography>
          <View style={styles.menuButtonContainer}>
            <DialogMenu icon="dots-vertical" items={dialogMenuItems} />
          </View>
        </View>
        <View style={styles.buildInfoContainer}>
          <View style={styles.buildInfoRow}>
            <View>
              <Typography variant="subtitle2" style={styles.buildStatusText}>
                Site
              </Typography>
              <Typography variant="subtitle1" bold>
                {item.siteName ?? ''}
              </Typography>
            </View>
            <View>
              <Typography variant="subtitle2" style={styles.buildStatusText}>
                Index
              </Typography>
              <Typography variant="subtitle1" bold>
                {item.setIndex ?? ''}
              </Typography>
            </View>
          </View>
        </View>
      </View>
    )
  }

  const renderSearchField = () => (
    <SearchField
      placeholder="Search for needs to add"
      value={query}
      onChangeText={onQueryChange}
      onSearch={onSearch}
      searchButtonVisible={false}
    />
  )

  const hideCaseNeedDeleteConfirmationDialog = () =>
    setCaseNeedToRemove(undefined)

  const hideCaseSetRemoveConfirmationDialog = () =>
    setCaseSetToRemove(undefined)

  const deleteCaseNeed = async () => {
    if (caseNeedToRemove) {
      await onRemoveCaseNeed(caseNeedToRemove)
      setCaseNeedToRemove(undefined)
    }
  }

  const deleteCaseSet = async () => {
    if (caseSetToRemove) {
      await onRemoveCaseSet(caseSetToRemove)
      setCaseSetToRemove(undefined)
    }
  }

  const onEnterQuantityModalContinue = async () => {
    if (caseToChangeQuantity && newQuantity) {
      await onChangeQuantity(caseToChangeQuantity, newQuantity.toString())
    }
    setCaseToChangeQuantity(undefined)
  }

  return (
    <View style={styles.container}>
      <DialogMessage ref={dialogMessageRef} />
      <ConfirmDialog
        visible={!!caseNeedToRemove}
        title="Confirm Remove"
        message="Are you sure you want to remove the product from the case cart?"
        confirmText="REMOVE"
        confirmButtonColor={LingoColors.primary.main}
        onCancel={hideCaseNeedDeleteConfirmationDialog}
        onConfirm={deleteCaseNeed}
      />
      <ConfirmDialog
        visible={!!caseSetToRemove}
        title="Confirm Remove"
        message="Are you sure you want to remove the product from the case cart?"
        confirmText="REMOVE"
        confirmButtonColor={LingoColors.primary.main}
        onCancel={hideCaseSetRemoveConfirmationDialog}
        onConfirm={deleteCaseSet}
      />

      <ScrollView
        ref={scrollViewRef}
        stickyHeaderIndices={[6]}
        style={styles.flexGrow}
        contentContainerStyle={[
          styles.contentContainer,
          keyboardVisible && { paddingBottom: keyboardHeight },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <Typography variant="h6" bold style={styles.title}>
          {`Case ${item.caseNumber}:`}
        </Typography>
        <Typography
          variant="subtitle1"
          style={styles.secondaryWithMargin}
          color={LingoColors.secondary.main}
        >
          {`${item.physicianName}, Room ${item.orRoomName}, at ${
            item.whenStart
              ? format(parseISO(item.whenStart), 'MM/dd/yyyy h:mm a')
              : 'Unknown time'
          }`}
        </Typography>
        <Typography variant="subtitle1" bold>
          Products
        </Typography>
        <Typography variant="body1" color={LingoColors.primary.disabled}>
          Scan items to the cart for this case
        </Typography>

        {/* Tab Header - This will be sticky */}
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            {tabsMemo.map((tab, index) => {
              const isActive = index === tabIndex
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.tab, isActive && styles.activeTab]}
                  onPress={() => setTabIndex(index)}
                >
                  <Typography
                    variant="buttonMedium"
                    color={LingoColors.blueGray[700]}
                  >
                    {tab.label}
                  </Typography>
                  {tab.badge ? (
                    <View
                      style={[styles.badge, isActive && styles.activeBadge]}
                    >
                      {Boolean(showRedDot && index === ON_CART_INDEX) && (
                        <View style={styles.redDot} />
                      )}
                      <Typography
                        variant="buttonMedium"
                        color={
                          isActive
                            ? LingoColors.common.white
                            : LingoColors.blueGray[700]
                        }
                        style={styles.badgeText}
                      >
                        {tab.badge}
                      </Typography>
                    </View>
                  ) : null}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View style={styles.tabContent}>
          {isLoading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator
                size="large"
                color={LingoColors.primary.main}
              />
            </View>
          ) : (
            <View style={styles.listContainer}>
              <EnterQuantityModal
                visible={!!caseToChangeQuantity}
                title="Change Quantity"
                subtitle={caseToChangeQuantity?.setDescription ?? ''}
                quantity={newQuantity}
                setQuantity={setNewQuantity}
                error={error}
                minValue={minQuantity}
                maxValue={maxQuantity}
                onCancel={() => setCaseToChangeQuantity(undefined)}
                onContinue={onEnterQuantityModalContinue}
                cancelText="CANCEL"
                continueText="CHANGE"
              />

              {tabIndex === STILL_NEEDED_INDEX && renderSearchField()}
              {tabIndex === 0
                ? addedSets.map(renderAddedItem)
                : caseNeeds.map(renderStillNeededItem)}
            </View>
          )}
        </View>

        <EnterQuantityModal
          visible={!!showEnterQuantityModal}
          onContinue={onQuantityModalOkPress}
          onCancel={onQuantityModalCancelPress}
          quantity={quantity ? Number(quantity) : ''}
          setQuantity={(value) => setQuantity(value.toString())}
          title="Enter Quantity"
          subtitle=""
          error={errorMessage ?? ''}
          minValue={minQuantity}
          maxValue={maxQuantity}
        />
        <BigWarningModal
          visible={!!bigWarning?.visible}
          title={bigWarning?.title ?? ''}
          message={bigWarning?.message ?? ''}
          checkboxLabel={bigWarning?.checkboxLabel ?? ''}
          checked={bigModalCheckboxChecked}
          onCheckboxChange={setBigModalCheckboxChecked}
          onConfirmPress={() =>
            bigWarning?.onConfirmPress ? bigWarning?.onConfirmPress() : {}
          }
          onCancelPress={() =>
            bigWarning?.onCancelPress ? bigWarning?.onCancelPress() : {}
          }
          cancelText="CANCEL"
          confirmText="CONTINUE"
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
  },
  flexGrow: {
    flexGrow: 1,
    padding: V_PADDING,
    paddingTop: 0,
  },
  title: {
    marginTop: V_PADDING,
  },
  secondaryWithMargin: {
    color: LingoColors.text.secondary,
    marginBottom: V_PADDING,
  },
  buildStatusText: {
    color: LingoColors.text.secondary,
    marginBottom: V_PADDING / 2,
  },
  caseCard: {
    marginTop: V_PADDING,
    backgroundColor: LingoColors.primary.selected,
    padding: V_PADDING,
    borderRadius: DEFAULT_BORDER_RADIUS * 4,
    borderWidth: 1,
    borderColor: LingoColors.primary.main,
  },
  caseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: V_PADDING,
  },
  caseNumber: {
    color: LingoColors.text.primary,
  },
  buildInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buildInfoRow: {
    flexDirection: 'row',
    gap: 32,
  },
  listContainer: {
    flex: 1,
    marginVertical: V_PADDING,
  },
  menuButtonContainer: {
    backgroundColor: LingoColors.primary.main,
    borderRadius: 50,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    flex: 1,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: LingoColors.background.paper,
  },
  tabBarContainer: {
    backgroundColor: LingoColors.background.paper,
    paddingTop: V_PADDING,
  },
  tabBar: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: V_PADDING / 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: LingoColors.blueGray[700],
  },
  badge: {
    borderRadius: 24,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: LingoColors.blueGray[700],
    paddingLeft: 1,
  },
  activeBadge: {
    backgroundColor: LingoColors.blueGray[700],
    borderWidth: 0,
  },
  badgeText: {
    top: -0.5,
  },
  redDot: {
    width: DEFAULT_BORDER_RADIUS * 2,
    height: DEFAULT_BORDER_RADIUS * 2,
    borderRadius: DEFAULT_BORDER_RADIUS,
    backgroundColor: LingoColors.error.dark,
    position: 'absolute',
    top: -3,
    right: 0,
  },
})

export default CaseCartsDetailsTemplate

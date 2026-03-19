import { format, parseISO } from 'date-fns'
import { FC, LegacyRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { CaseFlatPoco } from '../../../../api'
import {
  DialogMessage,
  DialogMessageRef,
  Loading,
  Typography,
} from '../../components'
import { Button, IconButton, Select } from '../../components/inputs'
import {
  SelectorModal,
  SelectorModalItem,
} from '../../components/inputs/SelectWithModal/SelectorModal'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import {
  DEFAULT_BORDER_RADIUS_LG,
  H_PADDING,
  V_PADDING,
} from '../../values/Spacing'

export type SterilizationLoadDetailsTemplateProps = {
  title: string
  loading: boolean
  loadNumber: string
  dialogMessageRef?: LegacyRef<DialogMessageRef>
  cycles: { label: string; value: string }[]
  selectedCycleTypeId?: string
  onChangeCycle: (cycleId: string) => void
  showReasons?: boolean
  reasons?: { label: string; value: string }[]
  selectedReasonId?: string
  onChangeReason: (reasonId: string) => void
  onSearchCase: (caseNumber: string) => void
  onAddCase: (caseId: string) => void
  onRemoveCase: () => void
  cases: { label: { title: string; subtitle: string }; value: string }[]
  onCloseCaseModal: () => void
  isCaseModalVisible: boolean
  onOpenCaseModal: () => void
  associatedCase: CaseFlatPoco | null
  onNext: () => void
}

export const SterilizationLoadDetailsTemplate: FC<
  SterilizationLoadDetailsTemplateProps
> = ({
  title,
  loading,
  dialogMessageRef,
  loadNumber,
  cycles,
  selectedCycleTypeId,
  onChangeCycle,
  showReasons,
  reasons,
  selectedReasonId,
  onChangeReason,
  cases,
  onSearchCase,
  onCloseCaseModal,
  isCaseModalVisible,
  onOpenCaseModal,
  onAddCase,
  onRemoveCase,
  associatedCase,
  onNext,
}) => {
  const minQueryLength = 3
  const [caseNumber, setCaseNumber] = useState('')
  const isSearching = cases.length === 0

  const onOkPress = (item: SelectorModalItem | undefined): void =>
    isSearching
      ? onSearchCase(caseNumber)
      : item?.value
        ? onAddCase?.(item?.value)
        : undefined

  return (
    <View style={styles.container}>
      <DialogMessage ref={dialogMessageRef} />
      {loading ? (
        <Loading />
      ) : (
        <>
          <View style={styles.content}>
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
            </View>

            <View style={styles.topForm}>
              <Select
                label="Cycle"
                value={selectedCycleTypeId || ''}
                onChangeText={onChangeCycle}
                options={cycles}
                showDividers={false}
              />
              {showReasons && (
                <Select
                  label="Reason"
                  value={selectedReasonId || ''}
                  onChangeText={onChangeReason}
                  options={reasons}
                  showDividers={false}
                />
              )}

              <Typography variant="body2" bold>
                Associated Case
              </Typography>

              {associatedCase ? (
                <View style={styles.caseCard}>
                  <View style={styles.caseCardHeader}>
                    <Typography variant="body1" bold>
                      {associatedCase.caseNumber ?? ''}
                    </Typography>
                    <IconButton
                      onPress={onRemoveCase}
                      icon={'delete'}
                      color={LingoColors.common.white}
                      style={styles.iconButton}
                    />
                  </View>

                  <Typography variant="body2">
                    {associatedCase.physicianName}, {associatedCase.orRoomName}
                  </Typography>

                  <Typography variant="caption">
                    {format(
                      parseISO(associatedCase.whenStart),
                      'MM/dd/yyyy h:mm a'
                    )}
                  </Typography>
                </View>
              ) : (
                <Button
                  mode="contained"
                  onPress={onOpenCaseModal}
                  customStyle={styles.button}
                  disabled={loading}
                >
                  FIND A CASE
                </Button>
              )}
            </View>
          </View>

          <SelectorModal
            visible={isCaseModalVisible}
            title="Search for Case"
            subtitle="Enter all or part of the case number and press Search to search for the case."
            query={caseNumber || ''}
            onQueryChange={setCaseNumber}
            handleOkPress={onOkPress}
            handleCancelPress={onCloseCaseModal}
            items={cases}
            submitText={isSearching ? 'SEARCH' : 'OK'}
            minLength={minQueryLength}
            isValid={caseNumber.length >= minQueryLength}
            onSearch={() => onSearchCase(caseNumber)}
          />

          <View style={styles.bottomButtons}>
            <BottomButtons
              submitOnPress={onNext}
              isValid
              showCancelButton={false}
              submitText="NEXT"
              isLoading={false}
            />
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: V_PADDING,
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
  loadTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: H_PADDING,
  },
  bottomButtons: {
    paddingHorizontal: V_PADDING,
  },
  button: {
    marginBottom: V_PADDING,
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
  iconButton: {
    width: 44,
    height: 44,
    padding: 0,
    backgroundColor: LingoColors.primary.main,
  },
})

export default SterilizationLoadDetailsTemplate

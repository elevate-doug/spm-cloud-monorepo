import { FC, LegacyRef, useRef } from 'react'
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native'

import {
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
import { Select, TextField } from '../../components/inputs'
import { DatePicker } from '../../components/inputs/DatePicker/DatePicker'
import {
  SelectorWithModalItem,
  SelectWithModal,
} from '../../components/inputs/SelectWithModal'
import { TimePicker } from '../../components/inputs/TimePicker/TimePicker'
import {
  CaseClassEnum,
  CaseClassEnumLabel,
  CaseClassEnumValues,
} from '../../constants/caseClass'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { V_PADDING } from '../../values/Spacing'
export type CaseAddEditTemplateProps = {
  site?: string
  sites: {
    label: string
    value: string
  }[]
  loading: boolean
  onSiteChange: (text: string) => void
  caseNumber: string
  onCaseNumberChange: (text: string) => void
  caseClass?: CaseClassEnum
  onCaseClassChange: (text: CaseClassEnum) => void
  viewOnly?: boolean
  whenStart: Date
  onWhenStartChange: (date: Date) => void
  whenEnd: Date
  onWhenEndChange: (date: Date) => void
  onBlurCaseNumber: () => void
  dialogMessageRef?: LegacyRef<DialogMessageRef>
  onCancel: () => void
  onSubmit: () => void
  canSubmit?: boolean
  orRooms: SelectorWithModalItem[]
  onSelectedOrRoom: (orRoom: SelectorWithModalItem) => void
  selectedOrRoom?: { label: string; value: string }
  physicians: SelectorWithModalItem[]
  onSelectedPhysician: (physician: SelectorWithModalItem) => void
  selectedPhysician?: { label: string; value: string }
}
const processedCaseClasses = CaseClassEnumValues.filter(
  (value) => value !== CaseClassEnum.Unknown
).map((value) => ({
  label: CaseClassEnumLabel[value as CaseClassEnum],
  value: value.toString(),
}))
const ScrollContainer: FC<{
  children: React.ReactNode
  scrollViewRef: React.RefObject<ScrollView>
}> = ({ children, scrollViewRef }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.content}
      contentContainerStyle={styles.contentContainer}
      onScroll={(event) => {
        handleScroll(event)
      }}
      onLayout={(event) => {
        onLayout(event.nativeEvent.layout.height)
      }}
      onContentSizeChange={(_, height) => {
        onContentChange(height)
      }}
      scrollEventThrottle={16}
      removeClippedSubviews={false}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={() => {
        // Dismiss keyboard when user starts scrolling
        Keyboard.dismiss()
      }}
    >
      {children}
    </ScrollView>
  )
}
export const CaseAddEditTemplate: FC<CaseAddEditTemplateProps> = ({
  sites,
  site,
  onSiteChange,
  caseNumber,
  onCaseNumberChange,
  caseClass,
  onCaseClassChange,
  viewOnly,
  whenStart,
  onWhenStartChange,
  whenEnd,
  onWhenEndChange,
  selectedOrRoom,
  selectedPhysician,
  onSelectedPhysician,
  physicians,
  loading,
  orRooms,
  onSelectedOrRoom,
  onCancel,
  onSubmit,
  canSubmit = true,
  onBlurCaseNumber,
  dialogMessageRef,
}) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const caseNumberInputRef = useRef<any>(null)

  const handleCaseClassChange = (value: string) => {
    onCaseClassChange(value as unknown as CaseClassEnum)
  }

  return (
    <View style={styles.container}>
      <DialogMessage ref={dialogMessageRef} />
      <ScrollProvider>
        {loading ? (
          <Loading />
        ) : (
          <>
            <ScrollContainer scrollViewRef={scrollViewRef}>
              <View style={styles.topForm}>
                <TextField
                  ref={caseNumberInputRef}
                  label="Case Number *"
                  value={caseNumber}
                  onChangeText={onCaseNumberChange}
                  variant="outlined"
                  helperText={''}
                  disabled={viewOnly}
                  onBlur={onBlurCaseNumber}
                  testID="case-number-input"
                />
                <Select
                  label="Site"
                  value={site ?? ''}
                  onChangeText={onSiteChange}
                  options={sites}
                  state={viewOnly ? 'disabled' : 'enabled'}
                  testID="site-select"
                />
                <Select
                  label="Case Class"
                  value={caseClass ? caseClass.toString() : ''}
                  onChangeText={handleCaseClassChange}
                  options={processedCaseClasses}
                  state={viewOnly ? 'disabled' : 'enabled'}
                  testID="case-class-select"
                />
                <Typography variant="h6" style={styles.timingText}>
                  Timing
                </Typography>
                <View style={styles.timingContainer}>
                  <View style={styles.dateTimeRow}>
                    <DatePicker
                      label="Start date"
                      value={whenStart}
                      onChange={onWhenStartChange}
                      disabled={viewOnly}
                      testID="start-date-picker"
                    />
                    <TimePicker
                      label="Start time"
                      value={whenStart}
                      onChange={onWhenStartChange}
                      disabled={viewOnly}
                      testID="start-time-picker"
                    />
                  </View>
                  <View style={styles.dateTimeRow}>
                    <DatePicker
                      label="End date"
                      value={whenEnd}
                      onChange={onWhenEndChange}
                      disabled={viewOnly}
                      testID="end-date-picker"
                    />
                    <TimePicker
                      label="End time"
                      value={whenEnd}
                      onChange={onWhenEndChange}
                      disabled={viewOnly}
                      testID="end-time-picker"
                    />
                  </View>
                  <SelectWithModal
                    title="Operating Room"
                    selectedItem={selectedOrRoom}
                    state={viewOnly ? 'disabled' : 'enabled'}
                    modalTitle="Select an Operating Room"
                    items={orRooms}
                    onSelectItem={onSelectedOrRoom}
                    testID="or-room-select"
                  />
                  <SelectWithModal
                    title="Physician"
                    selectedItem={selectedPhysician}
                    state={viewOnly ? 'disabled' : 'enabled'}
                    modalTitle="Select Physician"
                    items={physicians}
                    onSelectItem={onSelectedPhysician}
                    testID="physician-select"
                  />
                </View>
              </View>
            </ScrollContainer>
            <ShadowBottomWrapper>
              <BottomButtons
                cancelOnPress={onCancel}
                submitOnPress={onSubmit}
                isValid={canSubmit}
                submitText="Save & Close"
                isLoading={false}
                submitTestID="save-close-button"
                cancelTestID="cancel-button"
              />
            </ShadowBottomWrapper>
          </>
        )}
      </ScrollProvider>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: V_PADDING,
    paddingTop: V_PADDING,
    backgroundColor: LingoColors.background.paper,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: V_PADDING * 2,
  },
  topForm: {
    justifyContent: 'flex-start',
    gap: V_PADDING,
  },
  timingText: {
    marginBottom: -V_PADDING / 2,
  },
  timingContainer: {
    gap: V_PADDING,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: V_PADDING,
  },
  dateInput: {
    flex: 1,
  },
  timeInput: {
    flex: 1,
  },
})
export default CaseAddEditTemplate

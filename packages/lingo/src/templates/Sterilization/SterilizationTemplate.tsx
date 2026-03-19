import { format, parseISO } from 'date-fns'
import { FC, LegacyRef, useRef } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { SelectTestCycleModal } from './modals/SelectTestCycleModal'
import { SterilizerLoadFlatPoco, TestTypeFlatPoco } from '../../../../api'
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
import { Select } from '../../components/inputs'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { LoadStatusEnum } from '../../values'
import { H_PADDING, V_PADDING } from '../../values/Spacing'

export type SterilizationTemplateProps = {
  sterilizersSelectorList: { label: string; value: string }[]
  loading: boolean
  dialogMessageRef?: LegacyRef<DialogMessageRef>
  onResumeLoad: () => void
  onStartNewLoad: () => void
  onChangeSterilizer: (sterilizerId: string) => void
  selectedSterilizerId: string
  sterilizerLoad: SterilizerLoadFlatPoco | null
  showTestCycleModal: boolean
  requiredTests: TestTypeFlatPoco[]
  onRunTestPress: (testType: TestTypeFlatPoco) => void | Promise<void>
  onSkipTestsPress: () => void
}

const ScrollContainer: FC<{
  children: React.ReactNode
  scrollViewRef: React.RefObject<ScrollView>
}> = ({ children, scrollViewRef }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.content}
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
    >
      {children}
    </ScrollView>
  )
}

export const SterilizationTemplate: FC<SterilizationTemplateProps> = ({
  loading,
  sterilizersSelectorList,
  onResumeLoad,
  onStartNewLoad,
  onChangeSterilizer,
  selectedSterilizerId,
  dialogMessageRef,
  sterilizerLoad,
  showTestCycleModal,
  requiredTests,
  onRunTestPress,
  onSkipTestsPress,
}) => {
  const scrollViewRef = useRef<ScrollView>(null)

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
        <Typography variant="body1" style={styles.titleText} bold>
          {text}
        </Typography>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <DialogMessage ref={dialogMessageRef} />
      <SelectTestCycleModal
        visible={showTestCycleModal}
        handleRunTestPress={onRunTestPress}
        handleSkipTestsPress={onSkipTestsPress}
        requiredTests={requiredTests}
      />
      <ScrollProvider>
        {loading ? (
          <Loading />
        ) : (
          <>
            <ScrollContainer scrollViewRef={scrollViewRef}>
              <View style={styles.topForm}>
                <Select
                  label="Sterilizer"
                  value={selectedSterilizerId}
                  onChangeText={onChangeSterilizer}
                  options={sterilizersSelectorList}
                />
              </View>

              {sterilizerLoad && (
                <View>
                  <Typography
                    variant="subtitle1"
                    bold
                    style={styles.inProgressLoad}
                  >
                    {sterilizerLoad?.loadStatus === LoadStatusEnum.Building
                      ? 'In progress load:'
                      : 'Last load:'}
                  </Typography>
                  <View style={styles.loadTableRow}>
                    {renderTitleText(
                      'Load',
                      `Load ${sterilizerLoad?.loadNo ?? ''}`
                    )}
                    {renderTitleText(
                      'Date',
                      sterilizerLoad?.dateStart
                        ? format(parseISO(sterilizerLoad.dateStart), 'M/d/yyyy')
                        : ''
                    )}
                    {renderTitleText(
                      'Time',
                      sterilizerLoad?.dateStart
                        ? format(parseISO(sterilizerLoad.dateStart), 'h:mm a')
                        : ''
                    )}
                  </View>
                </View>
              )}
            </ScrollContainer>

            <ShadowBottomWrapper>
              {sterilizerLoad && (
                <BottomButtons
                  cancelOnPress={onResumeLoad}
                  submitOnPress={onStartNewLoad}
                  isValid
                  cancelText={'RESUME LOAD'}
                  showCancelButton={
                    sterilizerLoad?.loadStatus === LoadStatusEnum.Building
                  }
                  submitText="START NEW LOAD"
                  isLoading={false}
                />
              )}
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
    paddingTop: V_PADDING,
    paddingHorizontal: H_PADDING,
    backgroundColor: LingoColors.background.paper,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  topForm: {
    justifyContent: 'flex-start',
    gap: V_PADDING,
  },
  inProgressLoad: {
    marginTop: V_PADDING,
    marginBottom: V_PADDING / 2,
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
    gap: H_PADDING,
  },
})

export default SterilizationTemplate

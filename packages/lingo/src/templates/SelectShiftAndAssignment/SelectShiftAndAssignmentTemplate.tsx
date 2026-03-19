import { FC } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import {
  BottomCtaButtons,
  Dropdown,
  SafeAreaContainer,
  Typography,
} from '../../components'
import { LingoColors } from '../../theme'
import { V_PADDING } from '../../values'

export type SelectShiftAndAssignmentTemplateProps = {
  shift: string
  setShift: (value: string) => void
  assignment: string
  setAssignment: (value: string) => void
  primaryCtaOnPress: () => void
  loading: boolean
  isValid: boolean
  errorMessage?: string
  primaryCtaDisabled?: boolean
  secondaryCtaOnPress: () => void
  shiftOptions: { label: string; value: string }[]
  shiftPlaceholder?: string
  assignmentOptions: { label: string; value: string }[]
  assignmentPlaceholder?: string
}

export const SelectShiftAndAssignmentTemplate: FC<
  SelectShiftAndAssignmentTemplateProps
> = ({
  shift,
  setShift,
  assignment,
  setAssignment,
  primaryCtaOnPress,
  loading,
  isValid,
  errorMessage,
  secondaryCtaOnPress,
  primaryCtaDisabled = false,
  shiftOptions,
  shiftPlaceholder,
  assignmentOptions,
  assignmentPlaceholder,
}) => {
  const _primaryCtaOnPress = () => {
    primaryCtaOnPress()
  }

  const _onSecondaryCtaPress = () => {
    secondaryCtaOnPress()
  }

  return (
    <SafeAreaContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        overScrollMode="always"
        keyboardShouldPersistTaps="handled"
      >
        <Typography variant="h6">Select a Shift and Assignment</Typography>
        <View style={styles.inputs}>
          {errorMessage && (
            <Typography variant="body1" color={LingoColors.error.main}>
              {errorMessage}
            </Typography>
          )}
        </View>
        <Dropdown
          label="Shifts"
          value={shift}
          options={shiftOptions.map((option) => ({
            id: option.value,
            value: option.label,
          }))}
          onChangeValue={setShift}
          placeholder={shiftPlaceholder}
          maxOptionsVisible={5}
          testID="shift-dropdown"
        />
        <Dropdown
          label="Assignments"
          value={assignment}
          options={assignmentOptions.map((option) => ({
            id: option.value,
            value: option.label,
          }))}
          onChangeValue={setAssignment}
          placeholder={assignmentPlaceholder}
          maxOptionsVisible={8}
          testID="assignment-dropdown"
        />
      </ScrollView>
      <BottomCtaButtons
        onSecondaryCtaPress={_onSecondaryCtaPress}
        onPrimaryCtaPress={_primaryCtaOnPress}
        secondaryCtaText="Cancel"
        primaryCtaText="Ok"
        primaryCtaDisabled={primaryCtaDisabled}
        hideBorder={true}
        primaryCtaTestID="select-shift-assignment-primary-cta"
        secondaryCtaTestID="select-shift-assignment-secondary-cta"
      />
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: V_PADDING,
    gap: V_PADDING,
    backgroundColor: LingoColors.background.paper,
  },
  header: {
    gap: V_PADDING,
  },
  inputs: {
    gap: V_PADDING,
  },
  button: {
    alignSelf: 'center',
  },
})

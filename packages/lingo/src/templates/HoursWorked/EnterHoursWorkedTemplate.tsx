import { FC, useRef } from 'react'
import { ScrollView, StyleSheet, TextInput, View } from 'react-native'

import { Button, SafeAreaContainer, TextField } from '../../components'
import { Typography } from '../../components/typography/Typography'
import { LingoColors } from '../../theme/Colors'
import { V_PADDING, VW } from '../../values/Spacing'

export type EnterHoursWorkedTemplateProps = {
  regularHours: string
  setRegularHours: (value: string) => void
  overtimeHours: string
  setOvertimeHours: (value: string) => void
  primaryCtaOnPress: () => void
  loading: boolean
  isValid: boolean
  primaryCtaDisabled?: boolean
  errorMessage?: string
  overtimeErrorMessage?: string
  regularErrorMessage?: string
  onRegularHoursBlur?: () => void
  onOvertimeHoursBlur?: () => void
}

/**
 * The UI that displays right after a login if the user forgot to logout or end their shift.
 */
export const EnterHoursWorkedTemplate: FC<EnterHoursWorkedTemplateProps> = ({
  regularHours,
  setRegularHours,
  overtimeHours,
  setOvertimeHours,
  primaryCtaOnPress,
  loading,
  isValid,
  primaryCtaDisabled = false,
  errorMessage,
  overtimeErrorMessage,
  regularErrorMessage,
  onRegularHoursBlur,
  onOvertimeHoursBlur,
}) => {
  const regularHoursRef = useRef<TextInput>(null)
  const overtimeHoursRef = useRef<TextInput>(null)

  const _primaryCtaOnPress = () => {
    primaryCtaOnPress()
  }

  const focusOvertimeHours = () => {
    overtimeHoursRef.current?.focus()
  }

  return (
    <SafeAreaContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        overScrollMode="always"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Typography variant="h6" bold>
            Enter Hours Worked
          </Typography>
          <Typography variant="body1">
            Enter the number of regular and overtime hours worked during your
            previous shift.
          </Typography>
        </View>
        <View style={styles.inputs}>
          <TextField
            ref={regularHoursRef}
            value={regularHours.toString()}
            onChangeText={setRegularHours}
            label="Regular hours *"
            placeholder="Regular hours"
            keyboardType="numeric"
            enterKeyHint={'next'}
            onSubmitEditing={focusOvertimeHours}
            error={!!regularErrorMessage}
            helperText={regularErrorMessage && regularErrorMessage}
            onBlur={onRegularHoursBlur}
          />
          <TextField
            ref={overtimeHoursRef}
            value={overtimeHours.toString()}
            onChangeText={setOvertimeHours}
            label="Overtime hours *"
            placeholder="Overtime hours"
            keyboardType="numeric"
            enterKeyHint={isValid ? 'go' : 'next'}
            onSubmitEditing={isValid ? _primaryCtaOnPress : undefined}
            error={!!overtimeErrorMessage}
            helperText={overtimeErrorMessage && overtimeErrorMessage}
            onBlur={onOvertimeHoursBlur}
          />
          {errorMessage && (
            <Typography variant="body1" color={LingoColors.error.main}>
              {errorMessage}
            </Typography>
          )}
        </View>
        <View style={styles.button}>
          <Button
            mode="contained"
            onPress={_primaryCtaOnPress}
            loading={loading}
            disabled={primaryCtaDisabled}
            minWidth={VW * 0.55}
          >
            Ok
          </Button>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: V_PADDING,
    gap: V_PADDING * 1.5,
    backgroundColor: LingoColors.background.paper,
  },
  header: {
    gap: V_PADDING,
  },
  inputs: {
    gap: V_PADDING / 2,
  },
  button: {
    alignSelf: 'center',
  },
})

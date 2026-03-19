import { forwardRef } from 'react'
import { ScrollView, StyleSheet, Switch, View } from 'react-native'
import { Dialog, Divider, Portal, ProgressBar } from 'react-native-paper'

import { Typography, Select, Button } from '../../components'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING, VH } from '../../values'

export type RequestMetrics = {
  testType: 'Sequential' | 'Concurrent'
  successCount: number
  failureCount: number
  averageResponseTime: number
  maxResponseTime: number
  totalTime: number
  iterations: number
}

export type PressureTestDialogState = {
  visible: boolean
  loading?: boolean
  concurrentTest: boolean
  iterations: number
  progress?: number
  startTime?: Date
  endTime?: Date
}

export type PressureTestDialogProps = {
  dialogProps: PressureTestDialogState & {
    onChangeIterations: (value: string) => void
    onToggleConcurrent: () => void
    onStart: () => void
    onCancel: () => void
  }
  testRuns: RequestMetrics[]
  iterationOptions: Array<{ label: string; value: string }>
}

export type PressureTestDialogRef = {
  show: () => void
  hide: () => void
}

export const PressureTestDialogTemplate = forwardRef<
  PressureTestDialogRef,
  PressureTestDialogProps
>(({ dialogProps, testRuns, iterationOptions }, ref) => {
  const TestRunMetrics = ({
    testRun,
    index,
  }: {
    testRun: RequestMetrics
    index: number
  }) => {
    return (
      <View style={styles.metricsContainer}>
        <Typography variant="body2" bold>
          {`[${index + 1}] ${testRun.testType} Test`}
        </Typography>
        {testRun.totalTime > 0 && (
          <Typography variant="body2">
            {`Total time: ${(testRun.totalTime / 1000).toFixed(2)} sec.`}
          </Typography>
        )}
        {testRun.averageResponseTime > 0 && (
          <Typography variant="caption">
            {`Average response time: ${(
              testRun.averageResponseTime / 1000
            ).toFixed(2)} sec.`}
          </Typography>
        )}
        {testRun.maxResponseTime > 0 && (
          <Typography variant="caption">
            {`Max response time: ${(testRun.maxResponseTime / 1000).toFixed(2)} sec.`}
          </Typography>
        )}
        <View style={styles.metricsResultContainer}>
          <Typography variant="caption" color={LingoColors.success.main}>
            {`${testRun.successCount} / ${testRun.iterations} passed`}
          </Typography>
          <Typography
            variant="caption"
            color={
              testRun.failureCount > 0
                ? LingoColors.error.main
                : LingoColors.text.disabled
            }
          >
            {`${testRun.failureCount} failed`}
          </Typography>
          <Divider />
        </View>
      </View>
    )
  }

  return (
    <Portal>
      <Dialog
        dismissable={false}
        visible={dialogProps.visible}
        onDismiss={dialogProps.onCancel}
        style={styles.dialog}
      >
        <Typography variant="h6" bold>
          Perform Pressure Test
        </Typography>
        <Typography variant="body1">
          Are you sure you want to start a pressure test? The app may become
          unresponsive during this time.
          {'\n\n'}
          Would you like to continue?
        </Typography>
        <Select
          label="Number of Iterations"
          value={dialogProps.iterations?.toString() ?? '100'}
          options={iterationOptions}
          onChangeText={dialogProps.onChangeIterations}
        />
        <View style={styles.switchContainer}>
          <Typography variant="caption">Concurrent Test</Typography>
          <Switch
            value={dialogProps.concurrentTest}
            onValueChange={dialogProps.onToggleConcurrent}
          />
        </View>
        <ProgressBar progress={dialogProps.progress ?? 0} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {testRuns.length > 0 &&
            testRuns
              .map((testRun, index) => (
                <TestRunMetrics key={index} testRun={testRun} index={index} />
              ))
              .reverse()}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={dialogProps.onCancel}
            customStyle={styles.button}
          >
            Cancel
          </Button>
          <Button
            loading={dialogProps.loading}
            iconLeft={dialogProps.loading ? undefined : 'play'}
            mode="contained"
            onPress={dialogProps.onStart}
            customStyle={styles.button}
          >
            Start Test
          </Button>
        </View>
      </Dialog>
    </Portal>
  )
})

PressureTestDialogTemplate.displayName = 'PressureTestDialogTemplate'

const styles = StyleSheet.create({
  dialog: {
    justifyContent: 'center',
    padding: V_PADDING,
    gap: V_PADDING * 2,
  },
  metricsContainer: {
    gap: V_PADDING / 3,
  },
  metricsResultContainer: {
    alignItems: 'flex-end',
  },
  scrollView: {
    maxHeight: VH * 0.34,
  },
  scrollViewContent: {
    gap: V_PADDING,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: H_PADDING,
    justifyContent: 'flex-end',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: H_PADDING,
    justifyContent: 'flex-end',
  },
  button: {
    padding: V_PADDING / 2,
  },
})

import { FC, useRef, useState } from 'react'
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native'

import { TestTypeFlatPoco } from '../../../../../api'
import { Typography } from '../../../components'
import {
  ScrollProvider,
  useScroll,
} from '../../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../../components/containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import { BottomButtons } from '../../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../../theme'
import { H_PADDING, V_PADDING } from '../../../values'

export type SelectTestCycleModalProps = {
  visible: boolean
  handleRunTestPress: (testType: TestTypeFlatPoco) => void | Promise<void>
  handleSkipTestsPress: () => void
  requiredTests: TestTypeFlatPoco[]
}

const TestList: FC<{
  tests: TestTypeFlatPoco[]
  renderTest: (test: TestTypeFlatPoco) => JSX.Element
  selectedTest?: TestTypeFlatPoco
  scrollViewRef: React.RefObject<ScrollView>
  testRefs: React.MutableRefObject<Record<number, View | null>>
}> = ({ tests, renderTest, scrollViewRef, testRefs }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()
  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.list}
      onScroll={handleScroll}
      onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
      onContentSizeChange={(_: number, height: number) =>
        onContentChange(height)
      }
      keyboardShouldPersistTaps="handled"
    >
      {tests.map((test) => (
        <View
          key={`test-item-${test.id}`}
          ref={(el) => {
            testRefs.current[test.id] = el
          }}
        >
          {renderTest(test)}
        </View>
      ))}
    </ScrollView>
  )
}

export const SelectTestCycleModal: FC<SelectTestCycleModalProps> = ({
  visible,
  handleRunTestPress,
  handleSkipTestsPress,
  requiredTests,
}) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const testRefs = useRef<Record<number, View | null>>({})
  const [selectedTest, setSelectedTest] = useState<TestTypeFlatPoco>()

  const renderTest = (test: TestTypeFlatPoco) => {
    const isSelected = selectedTest?.id === test.id
    return (
      <View>
        <TouchableOpacity
          style={styles.testContainer}
          activeOpacity={1}
          onPress={() => setSelectedTest(test)}
        >
          <Typography
            variant="body1"
            style={{
              ...styles.testText,
              ...(isSelected && styles.selectedText),
            }}
            color={
              isSelected ? LingoColors.primary.dark : LingoColors.primary.main
            }
          >
            {test.name}
          </Typography>
        </TouchableOpacity>
      </View>
    )
  }

  const handleSubmitOnPress = () => {
    if (selectedTest) handleRunTestPress(selectedTest)
  }

  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        <ScrollProvider>
          <ShadowTopWrapper>
            <Typography variant="h6" style={styles.title} bold>
              Test Cycle Required
            </Typography>
            <Typography variant="body1" style={styles.subtitle}>
              Select a test to run in an empty load:
            </Typography>
          </ShadowTopWrapper>
          <TestList
            tests={requiredTests}
            renderTest={renderTest}
            selectedTest={selectedTest}
            scrollViewRef={scrollViewRef}
            testRefs={testRefs}
          />
          <ShadowBottomWrapper>
            <BottomButtons
              cancelOnPress={handleSkipTestsPress}
              submitOnPress={handleSubmitOnPress}
              submitText="RUN TEST"
              cancelText="SKIP TESTS"
              isValid={!!selectedTest}
              isLoading={false}
            />
          </ShadowBottomWrapper>
        </ScrollProvider>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: V_PADDING,
    paddingVertical: 0,
    backgroundColor: LingoColors.common.white,
  },
  title: {
    paddingVertical: 6,
    marginBottom: V_PADDING / 2,
  },
  subtitle: {
    marginBottom: V_PADDING,
    color: LingoColors.text.secondary,
  },
  list: {
    flex: 1,
  },
  testContainer: {
    backgroundColor: LingoColors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: LingoColors.border,
  },
  testText: {
    paddingVertical: V_PADDING,
    paddingHorizontal: H_PADDING,
  },
  selectedText: {
    backgroundColor: LingoColors.primary.selected,
    borderBottomWidth: 0,
  },
})

export default SelectTestCycleModal

import { FC, useEffect } from 'react'
import { Alert, FlatList, StyleSheet, View } from 'react-native'
import { IconButton, TextInput } from 'react-native-paper'

import { Typography } from '../../components'
import { Button, Select } from '../../components/inputs'
import { LingoColors } from '../../theme'
export type DocumentTasksProps = {
  quantity: string
  onQuantityChange: (text: string) => void
  onIncrement: () => void
  onDecrement: () => void
  task: string
  onTaskChange: (text: string) => void
  onAddTask: () => void
  previousTasks: { task: string; quantity: string }[]
  taskOptions: { label: string; value: string }[]
  errors: { [key: string]: string }
  maxQuantity?: number
  message: string
}
export const DocumentTasks: FC<DocumentTasksProps> = ({
  quantity,
  onQuantityChange,
  onIncrement,
  onDecrement,
  task,
  onTaskChange,
  onAddTask,
  previousTasks,
  taskOptions,
  errors,
  maxQuantity = 1,
  message,
}) => {
  const disableIncrement = Number(quantity) >= maxQuantity
  const disableDecrement = Number(quantity) <= 0
  useEffect(() => {
    if (message) {
      Alert.alert('Information', message)
    }
  }, [message])
  const renderTaskItem = ({
    item,
  }: {
    item: { task: string; quantity: string }
  }) => (
    <View style={styles.previousTasksRow}>
      <Typography variant="body1">{item.task}</Typography>
      <Typography variant="body1">{item.quantity}</Typography>
    </View>
  )
  const renderPlaceholder = () =>
    renderTaskItem({ item: { task: '', quantity: '' } })
  return (
    <View style={styles.container}>
      <View style={styles.taskRow}>
        <Select
          label="Choose a task"
          value={task}
          onChangeText={onTaskChange}
          options={taskOptions}
          style={styles.taskSelector}
          error={!!errors.task}
          helperText={errors.task}
          fullWidth={true}
        />
      </View>
      <View style={styles.quantityRow}>
        <Typography variant="body1" style={styles.quantityLabel}>
          Quantity:
        </Typography>
        <TextInput
          value={quantity}
          onChangeText={onQuantityChange}
          style={styles.quantityInput}
          error={!!errors.quantity}
          placeholder=""
          keyboardType="numeric"
          mode="outlined"
          disabled
        />
        <IconButton
          icon="minus"
          iconColor={
            disableDecrement
              ? LingoColors.action.disabled
              : LingoColors.primary.main
          }
          size={20}
          onPress={onDecrement}
          disabled={disableDecrement}
          style={[
            styles.quantityButton,
            disableDecrement && styles.disabledButton,
          ]}
        />
        <IconButton
          icon="plus"
          iconColor={
            disableIncrement
              ? LingoColors.action.disabled
              : LingoColors.primary.main
          }
          size={20}
          onPress={onIncrement}
          disabled={disableIncrement}
          style={[
            styles.quantityButton,
            disableIncrement && styles.disabledButton,
          ]}
        />
      </View>
      <View style={styles.submitButtonRow}>
        <Button mode="contained" onPress={onAddTask}>
          ADD
        </Button>
      </View>
      <View style={styles.previousTasksContainer}>
        <View style={styles.previousTasksRow}>
          <Typography variant="body1">Previous task</Typography>
          <Typography variant="body1">Qty</Typography>
        </View>
        <FlatList
          data={previousTasks.length > 0 ? previousTasks : []}
          renderItem={renderTaskItem}
          ListEmptyComponent={renderPlaceholder}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    marginRight: 10,
  },
  quantityInput: {
    marginRight: 10,
    backgroundColor: LingoColors.background.paper,
  },
  quantityButton: {
    backgroundColor: LingoColors.states.focus,
  },
  disabledButton: {
    backgroundColor: LingoColors.action.disabledBackground,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  taskSelector: {
    backgroundColor: LingoColors.background.paper,
  },
  submitButtonRow: {
    marginBottom: 16,
  },
  previousTasksContainer: {
    backgroundColor: LingoColors.background.paper,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: LingoColors.border,
    paddingHorizontal: 16,
    flex: 1,
  },
  previousTasksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
})

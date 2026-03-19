import { FC, useRef } from 'react'
import { View, StyleSheet, FlatList, ListRenderItem } from 'react-native'

import { Button, Typography } from '../../components'
import {
  useScroll,
  ScrollProvider,
} from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../components/containers/ShadowBottomWrapper'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values'

interface TaskItem {
  task: string
  quantity: string
}

const TaskList: FC<{
  tasks: TaskItem[]
  renderItem: ListRenderItem<TaskItem>
  listRef: React.RefObject<FlatList<TaskItem>>
}> = ({ tasks, renderItem, listRef }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()

  return (
    <FlatList
      ref={listRef}
      style={styles.list}
      data={tasks}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
      onContentSizeChange={(_, height) => onContentChange(height)}
      removeClippedSubviews={false}
    />
  )
}

export interface TaskSummaryProps {
  previousTasks: TaskItem[]
  onChooseTask: () => void
  disabled?: boolean
}

export const TaskSummary: FC<TaskSummaryProps> = ({
  previousTasks,
  onChooseTask,
  disabled = false,
}) => {
  const listRef = useRef<FlatList>(null)

  const renderTaskItem: ListRenderItem<TaskItem> = ({ item }) => (
    <View style={styles.taskItem}>
      <Typography variant="body2" style={styles.taskText}>
        {item.task}
      </Typography>
      <Typography variant="body2" style={styles.quantityText}>
        {item.quantity}
      </Typography>
    </View>
  )

  return (
    <View style={styles.container}>
      <ScrollProvider>
        <View style={styles.header}>
          <Typography variant="body1" bold>
            Previous task
          </Typography>
          <Typography variant="body1" bold>
            Qty
          </Typography>
        </View>
        <TaskList
          tasks={previousTasks}
          renderItem={renderTaskItem}
          listRef={listRef}
        />
        <ShadowBottomWrapper>
          <Button
            mode="contained"
            onPress={onChooseTask}
            customStyle={styles.button}
            disabled={disabled}
          >
            CHOOSE A TASK
          </Button>
        </ShadowBottomWrapper>
      </ScrollProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
    paddingTop: V_PADDING,
    paddingLeft: H_PADDING,
    paddingRight: H_PADDING,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: V_PADDING,
    paddingHorizontal: H_PADDING,
  },
  list: {
    flex: 1,
    paddingLeft: H_PADDING,
    paddingRight: H_PADDING,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: V_PADDING,
    width: '100%',
  },
  taskText: {
    flex: 1,
  },
  quantityText: {
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: LingoColors.text.secondary,
    marginTop: V_PADDING,
  },
  button: {
    paddingVertical: V_PADDING / 2,
  },
})

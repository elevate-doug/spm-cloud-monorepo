import { FC, useRef } from 'react'
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ListRenderItem,
} from 'react-native'
import { Provider } from 'react-native-paper'

import { Typography } from '../../components'
import {
  useScroll,
  ScrollProvider,
} from '../../components/containers/ScrollContext/ScrollContext'
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

export interface AddedTasksModalProps {
  visible: boolean
  previousTasks: TaskItem[]
  onClose: () => void
}

export const AddedTasksModal: FC<AddedTasksModalProps> = ({
  visible,
  previousTasks,
  onClose,
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
    <Modal visible={visible} animationType="slide" transparent={false}>
      <Provider>
        <View style={styles.container}>
          {/* Header with close button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Typography variant="h4" color={LingoColors.text.primary}>
                ×
              </Typography>
            </TouchableOpacity>
            <Typography variant="h6" style={styles.title} bold>
              Added tasks
            </Typography>
          </View>

          <View style={styles.content}>
            <ScrollProvider>
              <View style={styles.tableHeader}>
                <Typography variant="body1" bold>
                  Previous task
                </Typography>
                <Typography variant="body1" bold>
                  Qty
                </Typography>
              </View>

              {previousTasks.length > 0 ? (
                <TaskList
                  tasks={previousTasks}
                  renderItem={renderTaskItem}
                  listRef={listRef}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Typography
                    variant="body2"
                    color={LingoColors.text.secondary}
                    style={styles.emptyText}
                  >
                    No tasks added yet
                  </Typography>
                </View>
              )}
            </ScrollProvider>
          </View>
        </View>
      </Provider>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
    paddingHorizontal: H_PADDING * 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: V_PADDING,
  },
  closeButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tableHeader: {
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
    paddingVertical: V_PADDING * 0.5,
    width: '100%',
  },
  taskText: {
    flex: 1,
  },
  quantityText: {
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: LingoColors.text.secondary,
    marginTop: V_PADDING,
  },
})

import { FC, useRef, useState } from 'react'
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { fuzzySearch } from '../../../../../client/app/utils/StringUtils'
import {
  AddedTasksButton,
  ErrorNotification,
  TextField,
  Typography,
} from '../../components'
import {
  ScrollProvider,
  useScroll,
} from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowTopWrapper } from '../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values'
export type TaskOption = {
  label: string
  value: string
  dailyMaximumReached?: boolean
}
export type TaskListPickerProps = {
  tasks: TaskOption[]
  onTaskSelect: (task: TaskOption) => void
  addedTasksCount: number
  onAddedTasksPress: () => void
  shouldAnimateAddedTasks?: boolean
}
const TaskList: FC<{
  tasks: TaskOption[]
  renderItem: ListRenderItem<TaskOption>
  listRef: React.RefObject<FlatList>
}> = ({ tasks, renderItem, listRef }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()
  return (
    <FlatList
      ref={listRef}
      style={styles.list}
      data={tasks}
      renderItem={renderItem}
      keyExtractor={(item) => item.value}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
      onContentSizeChange={(_, height) => onContentChange(height)}
      removeClippedSubviews={false}
    />
  )
}
export const TaskListPicker: FC<TaskListPickerProps> = ({
  tasks,
  onTaskSelect,
  addedTasksCount,
  onAddedTasksPress,
  shouldAnimateAddedTasks,
}) => {
  const [query, setQuery] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const listRef = useRef<FlatList>(null)
  const filteredTasks = tasks.filter((task) =>
    query?.length >= 3 ? fuzzySearch(query, task.label) : true
  )
  const renderItem = ({ item }: { item: TaskOption }) => {
    const isSelected = selectedTaskId === item.value
    return (
      <View>
        <TouchableOpacity
          style={[styles.itemContainer]}
          activeOpacity={1}
          onPressIn={() => setSelectedTaskId(item.value)}
          onPress={() => onTaskSelect(item)}
        >
          <Typography
            variant="body1"
            style={isSelected ? styles.selectedText : styles.itemText}
            color={
              isSelected ? LingoColors.primary.dark : LingoColors.primary.main
            }
          >
            {item.label}
          </Typography>
          <ErrorNotification
            visible={!!item.dailyMaximumReached && isSelected}
            errorMessageTitle="Daily Maximum Reached"
            errorMessage={`The ${item.label} task is unable to be processed by your user again today. The quantity selected will put it over the daily maximum allowed.`}
            style={{ margin: H_PADDING }}
          />
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <ScrollProvider>
        <ShadowTopWrapper>
          <View>
            <Typography variant="h6" bold>
              Select Task
            </Typography>
            <TextField
              placeholder="Search"
              value={query}
              onChangeText={setQuery}
              style={styles.searchField}
              leftIcon="magnify"
            />
          </View>
        </ShadowTopWrapper>
        <TaskList
          tasks={filteredTasks}
          renderItem={renderItem}
          listRef={listRef}
        />
        <AddedTasksButton
          count={addedTasksCount}
          onPress={onAddedTasksPress}
          shouldAnimate={shouldAnimateAddedTasks}
        />
      </ScrollProvider>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
    padding: V_PADDING,
    paddingBottom: 0,
  },
  searchField: {
    marginVertical: V_PADDING,
    borderColor: 'rgba(0,0,0,0.23)',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: LingoColors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: LingoColors.border,
  },
  itemText: {
    flex: 1,
    paddingVertical: V_PADDING,
    paddingHorizontal: H_PADDING,
  },
  selectedText: {
    backgroundColor: LingoColors.primary.selected,
    paddingVertical: V_PADDING,
    paddingHorizontal: H_PADDING,
    borderBottomWidth: 0,
  },
})

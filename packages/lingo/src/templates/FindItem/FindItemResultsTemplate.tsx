import { FC, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { List } from 'react-native-paper'

import { Button, WarningAlert } from '../../components/inputs'
import { LingoColors } from '../../theme'
import LinearGradient from '../../utils/LinearGradient'
import { DEFAULT_BORDER_RADIUS, H_PADDING, V_PADDING } from '../../values'

export type FindItemResultItem = {
  id: number
  title: string
  subtitle?: string
  description?: string
}

export const MAX_ALLOWED_RESULTS = 200

export type FindItemResultsProps = {
  results: FindItemResultItem[]
  onItemPress: (itemId: number) => void
  onLoadMore: () => void
  onRefresh: () => void
  isRefreshing: boolean
  hasMore: boolean
  refineSearch: () => void
  renderedResultsCount: number
}

export const FindItemResults: FC<FindItemResultsProps> = ({
  results,
  onItemPress,
  onLoadMore,
  onRefresh,
  isRefreshing,
  hasMore,
  refineSearch,
  renderedResultsCount,
}) => {
  const [showBottomShadow, setShowBottomShadow] = useState(true)
  const flatListRef = useRef<FlatList>(null)

  const renderItem = ({ item }: { item: FindItemResultItem }) => {
    return (
      <List.Item
        title={item.title}
        description={() => (
          <View>
            {item.subtitle && (
              <Text style={styles.descriptionStyle}>{item.subtitle}</Text>
            )}
            {item.description && (
              <Text style={[styles.descriptionStyle]}>{item.description}</Text>
            )}
          </View>
        )}
        right={() => (
          <TouchableOpacity
            onPress={() => onItemPress(item.id)}
            style={styles.viewBtn}
          >
            <Text style={styles.viewBtnText}>VIEW</Text>
          </TouchableOpacity>
        )}
        style={styles.listItem}
        titleStyle={styles.titleStyle}
        descriptionStyle={styles.descriptionStyle}
      />
    )
  }

  const renderFooter = () => {
    if (!hasMore) return null
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator
          size="small"
          color={LingoColors.primary.main}
          testID="loading-indicator"
        />
      </View>
    )
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    const paddingToBottom = 20
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    setShowBottomShadow(!isCloseToBottom)
  }

  const renderHeader = () => {
    return (
      <View style={styles.listHeader}>
        <Button
          mode="outlined"
          onPress={refineSearch}
          customStyle={styles.button}
        >
          REFINE SEARCH
        </Button>
        <WarningAlert
          title="Too many results"
          message="Your search returned more than 200 results. Please refine your search criteria."
          hidden={renderedResultsCount < MAX_ALLOWED_RESULTS}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={results}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={hasMore ? onLoadMore : null}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {showBottomShadow && (
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}
          style={styles.bottomShadow}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
  },
  listHeader: {
    paddingHorizontal: V_PADDING,
  },
  separator: {
    height: 1,
    backgroundColor: LingoColors.border,
  },
  listItem: {
    borderBottomWidth: 1,
    paddingRight: V_PADDING,
    paddingLeft: V_PADDING * (2 / 3),
    borderBottomColor: LingoColors.grey[300],
  },
  titleStyle: {
    color: LingoColors.primary.main,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  descriptionStyle: {
    color: LingoColors.text.secondary,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.17,
    marginTop: 2,
  },
  footerLoader: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 1000,
  },
  viewBtnText: {
    color: LingoColors.primary.main,
  },
  viewBtn: {
    padding: H_PADDING / 2,
    paddingHorizontal: H_PADDING,
    borderColor: LingoColors.primary.main,
    borderWidth: 0.5,
    borderRadius: DEFAULT_BORDER_RADIUS,
    alignSelf: 'center',
  },
  button: {
    paddingVertical: V_PADDING / 2,
    marginVertical: V_PADDING,
  },
})

export default FindItemResults

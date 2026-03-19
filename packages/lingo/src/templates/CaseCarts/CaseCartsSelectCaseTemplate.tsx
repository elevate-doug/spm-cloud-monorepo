import { format, parseISO } from 'date-fns'
import { FC, LegacyRef, useRef } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

import { CaseFlatPoco } from '../../../../api'
import { Loading, Typography } from '../../components'
import {
  ScrollProvider,
  useScroll,
} from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../components/containers/ShadowBottomWrapper'
import { ShadowTopWrapper } from '../../components/containers/ShadowTopWrapper/ShadowTopWrapper'
import {
  DialogMessage,
  DialogMessageRef,
} from '../../components/feedback/Dialog/DialogMessage'
import { SearchField } from '../../components/inputs'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { fontDefinitions } from '../../theme/fontDefinitions'
import { V_PADDING } from '../../values'

export type CaseCartsSelectCaseProps = {
  query: string
  onQueryChange: (text: string) => void
  dialogMessageRef: LegacyRef<DialogMessageRef>
  handleSearch: () => void
  handleOkPress: () => void
  handleCancelPress: () => void
  selectedCase: CaseFlatPoco | null
  searchResult: CaseFlatPoco[]
  setSelectedCase: (caseCart: CaseFlatPoco | null) => void
  isLoading: boolean
}

const CaseList: FC<{
  cases: CaseFlatPoco[]
  listRef: React.RefObject<FlatList>
  selectedCase: CaseFlatPoco | null
  setSelectedCase: (caseCart: CaseFlatPoco | null) => void
}> = ({ cases, listRef, selectedCase, setSelectedCase }) => {
  const { handleScroll, onLayout, onContentChange } = useScroll()

  const renderItem = ({ item }: { item: CaseFlatPoco }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (selectedCase?.uniqueId === item.uniqueId) {
            setSelectedCase(null)
          } else {
            setSelectedCase(item)
          }
        }}
        style={
          selectedCase?.uniqueId === item.uniqueId
            ? styles.selectedProductItem
            : styles.productItem
        }
      >
        <Typography variant="body1" color={LingoColors.primary.main}>
          {item.caseNumber ?? ''}
        </Typography>
        <Typography variant="body2" color={LingoColors.secondary.main}>
          {item.physicianName ? `${item.physicianName}, ` : ''}
          {item.orRoomName ? `Room ${item.orRoomName}` : ''}
        </Typography>
        <Typography variant="body2" color={LingoColors.secondary.main}>
          {format(parseISO(item.whenStart), 'M/d/yyyy h:mm a')}
        </Typography>
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      ref={listRef}
      data={cases}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      scrollEventThrottle={V_PADDING}
      onScroll={handleScroll}
      onLayout={(event) => onLayout(event.nativeEvent.layout.height)}
      onContentSizeChange={(_, height) => onContentChange(height)}
      removeClippedSubviews={false}
    />
  )
}

export const CaseCartsSelectCaseTemplate: FC<CaseCartsSelectCaseProps> = ({
  query,
  onQueryChange,
  dialogMessageRef,
  handleSearch,
  selectedCase,
  setSelectedCase,
  handleOkPress,
  handleCancelPress,
  searchResult,
  isLoading,
}) => {
  const listRef = useRef<FlatList>(null)

  return (
    <View style={styles.container}>
      <DialogMessage ref={dialogMessageRef} />
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollProvider>
          <ShadowTopWrapper>
            <Typography variant="h6" style={styles.title} bold>
              Search for Case
            </Typography>
            <View style={styles.searchContainer}>
              <SearchField
                placeholder="Search"
                value={query}
                onChangeText={onQueryChange}
                onSearch={handleSearch}
              />
            </View>
          </ShadowTopWrapper>
          <CaseList
            cases={searchResult}
            listRef={listRef}
            selectedCase={selectedCase}
            setSelectedCase={setSelectedCase}
          />
          <ShadowBottomWrapper>
            <BottomButtons
              cancelOnPress={handleCancelPress}
              submitOnPress={handleOkPress}
              isValid={!isLoading && !!selectedCase}
              isLoading={isLoading}
              submitText="OK"
            />
          </ShadowBottomWrapper>
        </ScrollProvider>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: V_PADDING,
    paddingBottom: 0,
    backgroundColor: LingoColors.common.white,
  },
  title: {
    fontSize: fontDefinitions.headlineLarge.fontSize,
    fontWeight: '500',
    paddingVertical: V_PADDING / 2.5,
    marginBottom: V_PADDING,
  },
  searchContainer: {
    flexDirection: 'column',
    gap: V_PADDING,
  },
  productItem: {
    padding: V_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: LingoColors.grey[300],
  },
  selectedProductItem: {
    padding: V_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: LingoColors.grey[300],
    backgroundColor: LingoColors.primary.selected,
  },
  button: {
    flex: 1,
  },
})

export default CaseCartsSelectCaseTemplate

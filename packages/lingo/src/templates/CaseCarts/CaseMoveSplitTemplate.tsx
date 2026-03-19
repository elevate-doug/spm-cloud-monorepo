import { FC } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { CaseFlatPoco } from '../../../../api/src/service/case/CaseTypes'
import { CaseSetFlatPoco } from '../../../../api/src/service/case-cart-build/CaseCartBuildTypes'
import { Typography } from '../../components'
import {
  ConfirmDialog,
  ConfirmDialogProps,
  SearchField,
} from '../../components/inputs'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values'

export type CaseMoveSplitProps = {
  query: string
  onQueryChange: (text: string) => void
  item: CaseSetFlatPoco & Partial<CaseFlatPoco>
  errorMessage?: string
  onSearch: (text: string) => void
  onCancel: () => void
  isLoading: boolean
  dialog: ConfirmDialogProps
  title: string
  description: string
}
export const CaseMoveSplitTemplate: FC<CaseMoveSplitProps> = ({
  query,
  onQueryChange,
  errorMessage,
  onSearch,
  onCancel,
  isLoading,
  dialog,
  title,
  description,
}) => {
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={LingoColors.primary.main} />
    </View>
  )
  if (isLoading) return renderLoading()
  return (
    <View style={styles.container}>
      <ConfirmDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        confirmText="OK"
        hideCancelButton={true}
      />
      <View style={styles.content}>
        <Typography variant="h5" style={styles.title}>
          {title}
        </Typography>
        <Typography variant="body1" style={styles.secondary}>
          {description}
        </Typography>
        <SearchField
          placeholder="Search for case cart"
          value={query}
          onChangeText={onQueryChange}
          searchButtonVisible={false}
        />
        {errorMessage && (
          <Typography variant="caption" style={styles.error}>
            {errorMessage}
          </Typography>
        )}
      </View>
      <BottomButtons
        cancelOnPress={onCancel}
        submitOnPress={() => onSearch(query)}
        isValid={!errorMessage && !!query}
        isLoading={isLoading}
        submitText="SEARCH"
        cancelText="CANCEL"
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: LingoColors.background.paper,
    padding: V_PADDING,
  },
  content: {
    flexGrow: 1,
    gap: V_PADDING,
  },
  secondary: {
    color: LingoColors.text.secondary,
  },
  title: {
    fontWeight: 'bold',
    color: LingoColors.text.primary,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: LingoColors.text.secondary,
    marginLeft: H_PADDING,
  },
})

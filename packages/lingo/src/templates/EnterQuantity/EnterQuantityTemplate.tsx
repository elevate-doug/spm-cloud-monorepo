import { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import { QuantityField, Typography } from '../../components'
import { ScrollProvider } from '../../components/containers/ScrollContext/ScrollContext'
import { ShadowBottomWrapper } from '../../components/containers/ShadowBottomWrapper'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { V_PADDING } from '../../values'

export type EnterQuantityTemplateProps = {
  quantity: number | ''
  setQuantity: (value: number | '') => void
  error: string
  onCancel: () => void
  onContinue: () => void
  title: string
  subtitle: string
  cancelText?: string
  continueText?: string
  minValue?: number
  maxValue?: number
  hideButtons?: boolean
  loading?: boolean
}

export const EnterQuantityTemplate: FC<EnterQuantityTemplateProps> = ({
  quantity,
  setQuantity,
  error,
  onCancel,
  onContinue,
  title,
  subtitle,
  cancelText = 'Cancel',
  continueText = 'Continue',
  minValue = 1,
  maxValue = 100,
  hideButtons = false,
  loading = false,
}) => {
  return (
    <View style={styles.container}>
      <ScrollProvider>
        <View style={styles.content}>
          <Typography variant="h5">{title}</Typography>
          <View style={styles.form}>
            <Typography variant="h6">{subtitle}</Typography>
            <View style={styles.field}>
              <QuantityField
                value={quantity}
                minValue={minValue}
                maxValue={maxValue}
                hideButtons={hideButtons}
                error={error}
                disabled={loading}
                onChangeValue={(value: number | '') => {
                  if (typeof value === 'number' || value === '') {
                    setQuantity(value)
                  }
                }}
              />
            </View>
          </View>
        </View>
        <ShadowBottomWrapper>
          <BottomButtons
            cancelOnPress={onCancel}
            submitOnPress={onContinue}
            submitText={continueText}
            cancelText={cancelText}
            isValid={true}
            isLoading={false}
          />
        </ShadowBottomWrapper>
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
  content: {
    flex: 1,
    gap: V_PADDING * 3,
  },
  form: {
    alignItems: 'center',
    gap: V_PADDING,
  },
  field: {
    width: '60%',
    alignSelf: 'center',
  },
})

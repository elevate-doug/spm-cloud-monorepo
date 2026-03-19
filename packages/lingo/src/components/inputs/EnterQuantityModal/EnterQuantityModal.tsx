import { FC } from 'react'
import { Modal } from 'react-native'

import { EnterQuantityTemplate } from '../../../templates/EnterQuantity/EnterQuantityTemplate'

export type EnterQuantityModalProps = {
  visible: boolean
  title: string
  subtitle: string
  quantity: number | ''
  setQuantity: (value: number | '') => void
  error: string
  onCancel: () => void
  onContinue: () => void
  cancelText?: string
  continueText?: string
  minValue?: number
  maxValue?: number
}

export const EnterQuantityModal: FC<EnterQuantityModalProps> = ({
  visible,
  title,
  subtitle,
  quantity,
  setQuantity,
  error,
  onCancel,
  onContinue,
  cancelText,
  continueText,
  minValue = 1,
  maxValue = Infinity,
}) => {
  return (
    <Modal visible={visible}>
      <EnterQuantityTemplate
        title={title}
        subtitle={subtitle}
        quantity={quantity}
        setQuantity={setQuantity}
        minValue={minValue}
        maxValue={maxValue}
        error={error}
        onCancel={onCancel}
        onContinue={onContinue}
        cancelText={cancelText}
        continueText={continueText}
      />
    </Modal>
  )
}

export default EnterQuantityModal

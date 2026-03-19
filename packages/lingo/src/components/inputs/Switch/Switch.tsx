import { FC } from 'react'
import { Switch as PaperSwitch } from 'react-native-paper'

import { LingoColors } from '../../../theme'

export type SwitchProps = {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}
export const Switch: FC<SwitchProps> = ({ value, onChange, disabled }) => {
  return (
    <PaperSwitch
      onValueChange={onChange}
      value={value}
      color={LingoColors.primary.main}
      disabled={disabled}
    />
  )
}

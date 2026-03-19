import { useState } from 'react'

export type DialogState = {
  visible: boolean
  title: string
  message: string
  loading?: boolean
  primaryCta?: {
    text: string
    onPress: () => void
  }
  secondaryCta?: {
    text: string
    onPress: () => void
  }
}

export const useDialog = (props: DialogState) => {
  const [state, setState] = useState<DialogState>(props)

  return {
    state,
    setState,
  }
}

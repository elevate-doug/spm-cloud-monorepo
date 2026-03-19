import React, { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'

export type ButtonGroupProps = {
  buttons: { label: string; onPress: () => void }[]
  mode?: 'contained' | 'outlined' | 'text'
}

export const ButtonGroup: FC<ButtonGroupProps> = ({
  buttons,
  mode = 'contained',
}) => {
  return (
    <View style={styles.container}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          mode={mode}
          onPress={button.onPress}
          style={styles.button}
        >
          {button.label}
        </Button>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  button: {
    margin: 4,
  },
})

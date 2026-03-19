import RNCSlider from '@react-native-community/slider'
import React, { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import { useTheme } from 'react-native-paper'

export type SliderProps = {
  value: number
  onValueChange?: (value: number) => void
  minimumValue: number
  maximumValue: number
  step?: number
  disabled?: boolean
}

export const Slider: FC<SliderProps> = ({
  value,
  onValueChange = () => {
    // do nothing
  },
  minimumValue,
  maximumValue,
  step = 1,
  disabled = false,
}) => {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <RNCSlider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        disabled={disabled}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={`${theme.colors.primary}61`} // 38% opacity
        thumbTintColor={theme.colors.primary}
        style={styles.slider}
        testID="paper-slider"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignSelf: 'center',
  },
  slider: {
    width: '100%',
  },
})

import { View } from 'react-native'

import { LingoColors } from '../../../theme'
import { H_PADDING, V_PADDING } from '../../../values'
import { Button } from '../../inputs/Button'

export const BottomCtaButtons = ({
  onSecondaryCtaPress,
  onPrimaryCtaPress,
  secondaryCtaText,
  primaryCtaText,
  primaryCtaDisabled = false,
  hideBorder = false,
  primaryCtaTestID,
  secondaryCtaTestID,
}: {
  onSecondaryCtaPress: () => void
  onPrimaryCtaPress: () => void
  secondaryCtaText: string
  primaryCtaText: string
  primaryCtaDisabled?: boolean
  hideBorder?: boolean
  primaryCtaTestID?: string
  secondaryCtaTestID?: string
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: H_PADDING * 2,
        padding: V_PADDING,
        backgroundColor: LingoColors.background.default,
        borderTopWidth: hideBorder ? 0 : 1,
        borderTopColor: LingoColors.borderShadow,
      }}
    >
      <View style={{ flex: 1 }}>
        <Button
          mode="outlined"
          onPress={onSecondaryCtaPress}
          testID={secondaryCtaTestID}
        >
          {secondaryCtaText}
        </Button>
      </View>
      <View style={{ flex: 1 }}>
        <Button
          mode="contained"
          onPress={onPrimaryCtaPress}
          disabled={primaryCtaDisabled}
          testID={primaryCtaTestID}
        >
          {primaryCtaText}
        </Button>
      </View>
    </View>
  )
}

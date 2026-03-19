import { FC, useState } from 'react'
import { FlatList, SafeAreaView, View } from 'react-native'
import { ActivityIndicator, Banner, Divider } from 'react-native-paper'

import { Button, Text, Typography } from '../../components'
import { Touchable } from '../../components/buttons/Touchable/Touchable'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values'
export type BasicSiteRowProps = {
  id: number
  name: string
  selected?: boolean
  index?: number
  count?: number
  onPress?: (index: number) => void
}
export const BasicSiteRow: FC<BasicSiteRowProps> = ({
  name,
  id,
  selected,
  index,
  count,
  onPress,
}) => {
  return (
    <View key={id}>
      <Touchable
        selected={selected}
        onPress={() => onPress?.(index!)}
        style={{
          paddingHorizontal: H_PADDING,
          paddingVertical: V_PADDING,
        }}
      >
        <Typography
          variant="body1"
          style={{ color: LingoColors.highlightText }}
        >
          {name ?? ''}
        </Typography>
      </Touchable>
      {index! !== count! - 1 ? <Divider /> : null}
    </View>
  )
}
export type SelectSiteTemplateProps = {
  sites?: BasicSiteRowProps[]
  onPress?: (site: BasicSiteRowProps) => void
  primaryCtaDisabled?: boolean
  loading?: boolean
  error?: string
  retry?: () => void
  retryLabel?: string
  noSitesLabel?: string
  primaryCtaLabel?: string
}
export const SelectSiteTemplate: FC<SelectSiteTemplateProps> = ({
  sites = [],
  onPress,
  primaryCtaDisabled = false,
  loading = false,
  error,
  retry,
  retryLabel = 'Retry',
  noSitesLabel = 'No sites available',
  primaryCtaLabel = 'Continue',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const _onRowPress = (index: number) => {
    sites && sites?.length > 0 && sites[index]?.onPress?.(index)
    setSelectedIndex(index)
  }
  const _onPress = () => {
    if (sites && sites?.length > 0) {
      onPress?.(sites[selectedIndex])
    }
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: V_PADDING,
          gap: V_PADDING,
        }}
      >
        <Typography
          variant="h6"
          style={{
            paddingHorizontal: H_PADDING,
          }}
        >
          Select a Site
        </Typography>
        {error && (
          <Banner
            style={{ marginHorizontal: H_PADDING }}
            visible={!!error}
            actions={[
              {
                label: retryLabel,
                onPress: retry,
              },
            ]}
            icon="alert"
          >
            {error}
          </Banner>
        )}
        {loading ? (
          <ActivityIndicator />
        ) : sites?.length > 0 ? (
          <FlatList
            contentContainerStyle={{
              paddingBottom: V_PADDING * 6,
            }}
            data={sites}
            renderItem={({ item, index }) => (
              <BasicSiteRow
                {...item}
                index={index}
                count={sites?.length || 0}
                onPress={_onRowPress}
                selected={index === selectedIndex}
              />
            )}
          />
        ) : (
          <View style={{ paddingHorizontal: H_PADDING }}>
            <Text variant={'body2'}>{noSitesLabel}</Text>
          </View>
        )}
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: LingoColors.grey['300'],
          backgroundColor: LingoColors.background.default,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: {
            width: 0,
            height: -5,
          },
          elevation: 1,
          padding: H_PADDING,
        }}
      >
        <Button
          mode={'contained'}
          onPress={_onPress}
          disabled={primaryCtaDisabled || loading || sites?.length === 0}
        >
          {primaryCtaLabel}
        </Button>
      </View>
    </SafeAreaView>
  )
}

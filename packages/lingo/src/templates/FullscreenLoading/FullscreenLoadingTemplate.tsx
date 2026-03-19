import { FC } from 'react'
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import { Button, Typography } from '../../components'
import { DebugView } from '../../debug'
import { LingoColors } from '../../theme'
import { V_PADDING, VH } from '../../values'
export type FullscreenLoadingTemplateProps = {
  loading?: boolean
  message?: string
  primaryBtnText: string
  primaryBtnOnPress: () => void
  secondaryBtnText: string
  secondaryBtnOnPress: () => void
  error?: Error | null
  DebugContent?: FC<any>
  debugContentProps?: any
  initialDebugViewStateIsOpen?: boolean
  toggleDebugView?: () => void
  onCancel?: () => void
}
export const FullscreenLoadingTemplate: FC<FullscreenLoadingTemplateProps> = ({
  loading = true,
  message = 'Loading...',
  primaryBtnText,
  primaryBtnOnPress,
  secondaryBtnText,
  secondaryBtnOnPress,
  error,
  DebugContent,
  debugContentProps,
  initialDebugViewStateIsOpen = false,
  toggleDebugView,
  onCancel,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const imageSource: ImageSourcePropType = require('../../assets/images/spm_256a.png')
  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.logo} />
      {loading && (
        <ActivityIndicator
          animating={true}
          color={LingoColors.primary.dark}
          size={'large'}
          hidesWhenStopped={true}
        />
      )}
      <Typography variant="h6" style={styles.msg}>
        {message}
      </Typography>
      {__DEV__ && DebugContent && (
        <DebugView
          initialStateVisible={initialDebugViewStateIsOpen}
          toggleDebugView={toggleDebugView}
          onCancel={onCancel}
        >
          <DebugContent {...debugContentProps} />
        </DebugView>
      )}
      {!loading && error && (
        <View style={styles.btnGroup}>
          <Button
            mode="outlined"
            onPress={secondaryBtnOnPress}
            customStyle={styles.btn}
          >
            {secondaryBtnText || 'Secondary'}
          </Button>
          <Button
            mode="contained"
            onPress={primaryBtnOnPress}
            customStyle={styles.btn}
          >
            {primaryBtnText || 'Primary'}
          </Button>
        </View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: V_PADDING,
    width: '100%',
    gap: V_PADDING,
  },
  logo: {
    height: VH / 5,
    aspectRatio: 1,
  },
  msg: { fontWeight: 'bold', textAlign: 'center' },
  btnGroup: {
    flexDirection: 'row',
    marginTop: V_PADDING,
    gap: V_PADDING,
  },
  btn: {
    flex: 1,
    paddingVertical: V_PADDING / 2,
  },
  debugView: {
    flexDirection: 'row',
    gap: V_PADDING / 3,
  },
})

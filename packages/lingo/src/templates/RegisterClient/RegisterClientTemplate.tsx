import { FormikErrors } from 'formik'
import { FC } from 'react'
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Switch } from 'react-native-paper'

import { TextField, Typography } from '../../components'
import { BottomButtons } from '../../core/bottom-buttons.tsx/BottomButtons'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING, VH } from '../../values'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const imageSource: ImageSourcePropType = require('../../assets/images/spm_256a.png')
export type RegisterClientTemplateProps<T> = {
  title: string
  host: string
  hostOnChange?: (text: string) => void
  portSOAP: string
  portSOAPOnChange?: (text: string) => void
  portREST: string
  portRESTOnChange?: (text: string) => void
  ssl?: boolean
  sslSwitchOnChange?: (val: boolean) => void
  switchDisabled?: boolean
  cancelOnPress: () => void
  submitOnPress: () => void
  errors: FormikErrors<T>
  showCancelButton?: boolean
  isValid?: boolean
  isLoading?: boolean
}
export type RegisterClientFormValues = {
  hostAddress: string
  portSOAP: string
  portREST: string
  useSsl: boolean
}
export const RegisterClientTemplate: FC<
  RegisterClientTemplateProps<RegisterClientFormValues>
> = ({
  title,
  host,
  hostOnChange,
  portSOAP,
  portSOAPOnChange,
  portREST,
  portRESTOnChange,
  ssl = false,
  sslSwitchOnChange,
  switchDisabled = false,
  cancelOnPress,
  submitOnPress,
  errors,
  showCancelButton = false,
  isValid = false,
  isLoading = false,
}) => {
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={imageSource} style={styles.logo} />
          <Typography variant="h6" style={{ padding: 20 }}>
            {title}
          </Typography>
        </View>
        <View style={styles.form}>
          <TextField
            label="Server Address"
            value={host}
            onChangeText={(val) => hostOnChange?.(val)}
            placeholder={'192.168.0.1'}
            style={styles.input}
            error={!!errors.hostAddress}
            helperText={errors.hostAddress}
            keyboardType={'default'}
          />
          <TextField
            label="SOAP Port"
            value={`${portSOAP}`}
            onChangeText={(val) => portSOAPOnChange?.(val)}
            style={styles.input}
            error={!!errors.portSOAP}
            helperText={errors.portSOAP}
            keyboardType={'numeric'}
          />
          <TextField
            label="REST Port"
            value={`${portREST}`}
            onChangeText={(val) => portRESTOnChange?.(val)}
            style={styles.input}
            error={!!errors.portREST}
            helperText={errors.portREST}
            keyboardType={'numeric'}
          />
          <Pressable
            style={styles.sslView}
            onPress={() => sslSwitchOnChange?.(!ssl)}
          >
            <Typography variant={'body1'}>Use SSL?</Typography>
            <Switch
              value={ssl}
              onValueChange={!switchDisabled ? sslSwitchOnChange : undefined}
              color={LingoColors.primary.main}
              disabled={switchDisabled}
            />
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.bottomButtons}>
        <BottomButtons
          showCancelButton={showCancelButton}
          cancelOnPress={cancelOnPress}
          submitOnPress={submitOnPress}
          isValid={isValid}
          isLoading={isLoading}
        />
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    gap: V_PADDING,
    justifyContent: 'flex-end',
    flex: 1,
  },
  form: {
    flex: 3,
    justifyContent: 'center',
    gap: V_PADDING / 2,
  },
  bottomButtons: {
    width: '100%',
    paddingBottom: V_PADDING,
    paddingHorizontal: H_PADDING,
  },
  logo: {
    height: VH / 5,
    aspectRatio: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginBottom: V_PADDING,
  },
  sslView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: V_PADDING,
    gap: H_PADDING * 2,
  },
  btnGroup: {
    flexDirection: 'row',
    marginTop: V_PADDING,
    gap: V_PADDING,
  },
  btn: {
    flex: 1,
  },
})

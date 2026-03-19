import { FormikErrors } from 'formik'
import { FC, useEffect, useRef, useState } from 'react'
import {
  Image,
  ImageSourcePropType,
  Keyboard,
  KeyboardEvent,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

import {
  Button,
  SafeAreaContainer,
  TextField,
  Typography,
} from '../../components'
import { V_PADDING, VH } from '../../values'

export type LockSessionTemplateProps = {
  fullName: string
  passwordLabel: string
  password: string
  loading: boolean
  onPasswordChange: (text: string) => void
  onSubmit: () => void
  errors?: FormikErrors<{ password: string }>
  isValid?: boolean
  onPressSwitchUser?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const imageSource: ImageSourcePropType = require('../../assets/images/spm_256a.png')

export const LockSessionTemplate: FC<LockSessionTemplateProps> = ({
  fullName,
  passwordLabel,
  password,
  onPasswordChange,
  onSubmit,
  errors,
  loading = false,
  isValid = false,
  onPressSwitchUser,
}) => {
  const formDisabled = !loading && !isValid
  const passwordRef = useRef<TextInput>(null)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event: KeyboardEvent) => {
        setKeyboardVisible(true)
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
      }
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  const _onPressSwitchUser = () => {
    onPressSwitchUser?.()
  }

  return (
    <SafeAreaContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'always'}
        overScrollMode="always"
      >
        <View style={styles.header}>
          <Image source={imageSource} style={styles.logo} />
          <Typography variant="h6">Unlock Session</Typography>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.nameContainer}>
            <Typography variant="body1">{fullName}</Typography>
          </View>
          <TextField
            ref={passwordRef}
            placeholder={passwordLabel}
            label={passwordLabel}
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry
            error={!!errors?.password}
            helperText={errors?.password}
            autoCapitalize={'none'}
            enterKeyHint={'go'}
            onSubmitEditing={onSubmit}
          />
        </View>
        {!isKeyboardVisible && (
          <View style={styles.buttons}>
            <Button
              loading={loading}
              disabled={formDisabled}
              mode="contained"
              onPress={onSubmit}
              customStyle={styles.button}
            >
              Unlock
            </Button>
            <Button
              disabled={loading}
              mode="outlined"
              onPress={_onPressSwitchUser}
              customStyle={styles.button}
            >
              Switch User
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: V_PADDING,
    width: '100%',
    gap: V_PADDING * 3,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: V_PADDING,
  },
  logo: {
    height: VH / 8,
    aspectRatio: 1,
  },
  inputContainer: {
    flex: 1,
    width: '100%',
    gap: V_PADDING,
  },
  nameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    width: '100%',
    gap: V_PADDING,
  },
  button: {
    width: '100%',
    paddingVertical: V_PADDING / 2,
  },
})

import { FormikErrors } from 'formik'
import { FC, useRef } from 'react'
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text as RNText,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

import {
  Button,
  Dropdown,
  FloatingVersionText,
  TextField,
  Typography,
} from '../../components'
import { LingoColors } from '../../theme'
import { DEFAULT_BORDER_RADIUS, H_PADDING, V_PADDING } from '../../values'

const DEFAULT_OPTIONS = [{ label: '(none)', value: '' }]
export type LoginTemplateProps = {
  title: string
  versionString: string
  username: string
  usernameLabel: string
  onUsernameChange: (text: string) => void
  passwordLabel: string
  password: string
  loading: boolean
  onPasswordChange: (text: string) => void
  domainLabel: string
  domain: string
  onDomainChange: (text: string) => void
  domainsMiniErrorLabel: string
  domainsMiniSuccessLabel: string
  onSubmit: () => void
  errors: FormikErrors<{ username: string; password: string; domain: string }>
  responseMessage?: string
  registerClientLinkText: string
  onRegisterClientPress: () => void
  domainsLoadingLabel: string
  domainsLoading: boolean
  domainsErrorMessage?: string
  getDomainsSuccess?: boolean
  options?: { label: string; value: string }[]
  loginBtnTitle: string
  showRegisterClientLink?: boolean
  isValid?: boolean
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const imageSource: ImageSourcePropType = require('../../assets/images/spm_256a.png')
export const LoginTemplate: FC<LoginTemplateProps> = ({
  title,
  versionString,
  username,
  usernameLabel,
  onUsernameChange,
  passwordLabel,
  password,
  onPasswordChange,
  domainLabel,
  domain,
  onDomainChange,
  domainsMiniErrorLabel,
  domainsMiniSuccessLabel,
  onSubmit,
  errors,
  responseMessage,
  showRegisterClientLink = false,
  registerClientLinkText,
  onRegisterClientPress,
  loading = false,
  domainsLoadingLabel,
  domainsLoading = false,
  domainsErrorMessage,
  getDomainsSuccess = false,
  options = DEFAULT_OPTIONS,
  loginBtnTitle,
  isValid = false,
}) => {
  const formDisabled = !loading && !domainsLoading && !isValid
  const passwordRef = useRef<TextInput>(null)
  const focusPassword = () => {
    passwordRef.current?.focus()
  }

  const domainOptions = options.map((option, index) => ({
    id: `${option.value}-${index}`, // Create unique ID by combining value and index
    value: option.label,
  }))

  // Create a mapping from unique ID back to the original domain value
  const domainIdToValueMap = options.reduce(
    (map, option, index) => {
      const uniqueId = `${option.value}-${index}`
      map[uniqueId] = option.value
      return map
    },
    {} as Record<string, string>
  )

  // Find the unique ID for the current domain value
  const currentDomainId =
    Object.keys(domainIdToValueMap).find(
      (id) => domainIdToValueMap[id] === domain
    ) || domain

  const handleDomainChange = (selectedId: string) => {
    const actualDomainValue = domainIdToValueMap[selectedId] || selectedId
    onDomainChange(actualDomainValue)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        overScrollMode="always"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image
            source={imageSource}
            style={styles.logo}
            resizeMode={'contain'}
          />
          <Typography variant="h6" bold>
            {title}
          </Typography>
        </View>
        <View style={styles.form}>
          <TextField
            label={usernameLabel}
            value={username}
            onChangeText={onUsernameChange}
            style={styles.input}
            error={!!errors.username}
            helperText={errors.username}
            autoCapitalize={'none'}
            enterKeyHint={'next'}
            onSubmitEditing={focusPassword}
          />
          <TextField
            ref={passwordRef}
            label={passwordLabel}
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry
            style={styles.input}
            error={!!errors.password}
            helperText={errors.password}
            autoCapitalize={'none'}
            enterKeyHint={'go'}
            onSubmitEditing={onSubmit}
          />
          {domainsLoading ? (
            <View style={styles.domainActivityIndicator}>
              <ActivityIndicator
                animating={true}
                color={LingoColors.primary.dark}
                size={'small'}
                hidesWhenStopped={true}
              />
              <Typography variant="caption" color={LingoColors.primary.main}>
                {domainsLoadingLabel}
              </Typography>
            </View>
          ) : (
            <Dropdown
              label="Domain"
              options={domainOptions}
              value={currentDomainId}
              onChangeValue={handleDomainChange}
              placeholder={'(none)'}
            />
          )}
        </View>

        <View style={styles.footer}>
          <Button
            disabled={formDisabled || loading}
            mode="contained"
            onPress={onSubmit}
            customStyle={styles.button}
            loading={loading}
          >
            {loginBtnTitle}
          </Button>
          {showRegisterClientLink && (
            <Pressable onPress={onRegisterClientPress}>
              <RNText style={styles.registerClientLink}>
                {registerClientLinkText}
              </RNText>
            </Pressable>
          )}
        </View>
        <FloatingVersionText versionString={versionString} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: LingoColors.background.default,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: H_PADDING,
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
  footer: {
    flex: 3,
    gap: V_PADDING,
    justifyContent: 'center',
  },
  logo: {
    height: 94.8,
    aspectRatio: 1,
  },
  input: {
    width: '100%',
  },
  button: {
    width: '100%',
    paddingVertical: V_PADDING / 2,
  },
  responseMessage: {
    color: 'green',
    textAlign: 'center',
  },
  registerClientLink: {
    color: LingoColors.highlightText,
    textDecorationLine: 'underline',
  },
  domainRow: {
    flexDirection: 'row',
  },
  domain: {
    flex: 2,
  },
  domainActivityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainActivityIndicator: {
    borderWidth: 1,
    borderRadius: DEFAULT_BORDER_RADIUS,
    borderColor: LingoColors.border,
    backgroundColor: LingoColors.background.paper,
    height: 50,
    gap: H_PADDING / 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: H_PADDING,
  },
  domainLoadingText: {
    textAlign: 'center',
  },
  domainsErrorText: {
    color: LingoColors.error.main,
  },
  domainsSuccessText: {
    color: LingoColors.success.main,
  },
})

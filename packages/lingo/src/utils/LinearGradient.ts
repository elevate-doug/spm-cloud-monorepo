import { Platform } from 'react-native'

// Conditionally import LinearGradient based on platform
// This utility centralizes the web/native import logic
let LinearGradient: any

if (Platform.OS === 'web') {
  // For web, use the web-compatible shim from the client package
  /* eslint-disable @typescript-eslint/no-var-requires */
  LinearGradient =
    require('../../../../client/app/utils/web-icons/LinearGradient.web').default
  /* eslint-enable @typescript-eslint/no-var-requires */
} else {
  // For native platforms, use the original module
  // Using string concatenation to prevent babel from transforming this require
  const moduleName = 'react-native' + '-linear-gradient'
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LinearGradient = require(moduleName).default
}

export default LinearGradient

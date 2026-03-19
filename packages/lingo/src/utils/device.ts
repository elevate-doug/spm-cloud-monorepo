import { Platform, StatusBar, Dimensions } from 'react-native'

// **Dev Note**
// The Android StatusBar is currently configured with `translucent={false}` in `app.config.js` and `App.tsx`
// which means that the status bar pushes all content down, so we don't need to account for the status bar height.
export const STATUSBAR_HEIGHT = 0

export const NAVBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56
export const HEADER_HEIGHT = STATUSBAR_HEIGHT + NAVBAR_HEIGHT

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Dimensions.get('window').height

// Import React Native
import 'react-native'

// Polyfill for setImmediate
global.setImmediate = (callback) => {
  return setTimeout(callback, 0)
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

// Mock react-native
jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native')
  rn.NativeModules.StatusBarManager = {
    getHeight: jest.fn(),
    setStyle: jest.fn(),
    setHidden: jest.fn(),
    setNetworkActivityIndicatorVisible: jest.fn(),
    setBackgroundColor: jest.fn(),
    setTranslucent: jest.fn(),
  }
  return rn
})

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon')

// Mock InteractionManager
jest.mock('react-native/Libraries/Interaction/InteractionManager', () => ({
  createInteractionHandle: jest.fn(),
  clearInteractionHandle: jest.fn(),
  runAfterInteractions: jest.fn((callback) => callback()),
}))

// Silence warnings
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

// Mock Animated
jest.mock('react-native/Libraries/Animated/Animated', () => {
  const Animated = jest.requireActual(
    'react-native/Libraries/Animated/Animated'
  )
  Animated.timing = () => ({
    start: jest.fn(),
  })
  return Animated
})

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() =>
        Promise.resolve({
          sound: {
            unloadAsync: jest.fn(),
            playAsync: jest.fn(),
            pauseAsync: jest.fn(),
            stopAsync: jest.fn(),
            replayAsync: jest.fn(),
            setPositionAsync: jest.fn(),
            setRateAsync: jest.fn(),
            setVolumeAsync: jest.fn(),
            setIsMutedAsync: jest.fn(),
            setIsLoopingAsync: jest.fn(),
            setOnPlaybackStatusUpdate: jest.fn(),
          },
        })
      ),
    },
    setAudioModeAsync: jest.fn(),
  },
}))

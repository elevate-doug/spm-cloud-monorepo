import React from 'react'

const noInsets = { top: 0, right: 0, bottom: 0, left: 0 }

export const SafeAreaProvider = ({ children }: { children: React.ReactNode }) => children
export const SafeAreaView = ({ children }: { children: React.ReactNode }) => children
export const SafeAreaInsetsContext = React.createContext(noInsets)
export const useSafeAreaInsets = () => noInsets
export const initialWindowMetrics = { frame: { x: 0, y: 0, width: 0, height: 0 }, insets: noInsets }

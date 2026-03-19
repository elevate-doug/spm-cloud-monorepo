import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react'
import { NativeScrollEvent } from 'react-native'

interface ScrollContextType {
  scrollY: number
  isAtBottom: boolean
  contentHeight: number
  layoutHeight: number
  handleScroll: (event: { nativeEvent: NativeScrollEvent }) => void
  onLayout: (height: number) => void
  onContentChange: (height: number) => void
}

const ScrollContext = createContext<ScrollContextType>({
  scrollY: 0,
  isAtBottom: false,
  contentHeight: 0,
  layoutHeight: 0,
  handleScroll: () => {},
  onLayout: () => {},
  onContentChange: () => {},
})

export const useScroll = () => useContext(ScrollContext)

export const ScrollProvider: FC<PropsWithChildren> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const [layoutHeight, setLayoutHeight] = useState(0)

  const handleScroll = useCallback(
    (event: { nativeEvent: NativeScrollEvent }) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent

      setScrollY(contentOffset.y)
      setScrollY(contentOffset.y)
      setContentHeight(contentSize.height)
      setLayoutHeight(layoutMeasurement.height)

      // Check if scrolled to bottom with a small threshold
      const threshold = 20
      const currentPosition = contentOffset.y + layoutMeasurement.height
      const isCloseToBottom = currentPosition >= contentSize.height - threshold

      setIsAtBottom(isCloseToBottom)
    },
    []
  )

  const onLayout = useCallback((height: number) => {
    setLayoutHeight(height)
  }, [])

  const onContentChange = useCallback(
    (height: number) => {
      setContentHeight(height)

      // Manually trigger a scroll event to update isAtBottom state
      if (layoutHeight > 0) {
        handleScroll({
          nativeEvent: {
            contentOffset: { x: 0, y: scrollY },
            contentSize: { width: 0, height },
            layoutMeasurement: { width: 0, height: layoutHeight },
            zoomScale: 1,
            contentInset: { top: 0, left: 0, bottom: 0, right: 0 },
            velocity: { x: 0, y: 0 },
            targetContentOffset: { x: 0, y: 0 },
          },
        })
      }
    },
    [handleScroll, layoutHeight, scrollY]
  )

  return (
    <ScrollContext.Provider
      value={{
        scrollY,
        isAtBottom,
        contentHeight,
        layoutHeight,
        handleScroll,
        onLayout,
        onContentChange,
      }}
    >
      {children}
    </ScrollContext.Provider>
  )
}

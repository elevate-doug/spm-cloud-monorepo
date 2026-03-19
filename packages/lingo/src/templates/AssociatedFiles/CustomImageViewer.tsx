import React from 'react'
import { Modal, View, StyleSheet, Dimensions, Image } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'

import { IconButton } from '../../components/inputs'
import { Typography } from '../../components/typography'
import { LingoColors } from '../../theme'
import { V_PADDING } from '../../values'

interface CustomImageViewerProps {
  visible: boolean
  uri: string
  extension: string
  name?: string
  onClose: () => void
}

const screen = Dimensions.get('window')

export const CustomImageViewer: React.FC<CustomImageViewerProps> = ({
  visible,
  uri,
  extension,
  name,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            color={LingoColors.common.white}
            icon="close"
            size={32}
            onPress={onClose}
          />
          <Typography variant="h6" color={LingoColors.common.white}>
            {name ?? ''}
          </Typography>
        </View>
        <View style={styles.imageZoomContainer}>
          {/* @ts-ignore - ImageZoom does support children according to docs but has incorrect types */}
          <ImageZoom
            cropWidth={screen.width}
            cropHeight={320}
            imageWidth={screen.width}
            imageHeight={320}
            enableCenterFocus={false}
            enableDoubleClickZoom={true}
            minScale={1}
            maxScale={3}
            panToMove={true}
            pinchToZoom={true}
            doubleClickInterval={250}
            style={{ backgroundColor: 'black' }}
          >
            <Image
              source={{ uri: `data:image/${extension};base64,${uri}` }}
              style={styles.image}
              resizeMode="contain"
              accessibilityLabel={name ?? ''}
            />
          </ImageZoom>
          <View style={styles.instructionContainer}>
            <Typography variant="subtitle2" color={LingoColors.text.disabled}>
              Stretch or double tap to enlarge
            </Typography>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: V_PADDING,
    backgroundColor: LingoColors.overlayBackground,
    paddingVertical: V_PADDING / 2,
    paddingHorizontal: V_PADDING,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  imageZoomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  instructionContainer: {
    alignItems: 'center',
    marginTop: V_PADDING,
  },
})

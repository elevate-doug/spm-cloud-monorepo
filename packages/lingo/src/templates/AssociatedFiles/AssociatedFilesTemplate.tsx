import { FC, useState } from 'react'
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-paper'

import { CustomImageViewer } from './CustomImageViewer'
import { File } from '../../../../api'
import { Typography } from '../../components/typography'
import { LingoColors } from '../../theme'
import { V_PADDING } from '../../values'
import { DetailsTitleTemplate } from '../DetailsTitle'

export interface AssociatedFilesTemplateProps {
  files: File[]
  onClose: () => void
}

const FileItem: FC<{
  file: File
  onPressImage: ({
    uri,
    extension,
    name,
  }: {
    uri: string
    extension: string
    name?: string
  }) => void
}> = ({ file, onPressImage }) => {
  const fileIsAnImage = (file: File) => {
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp']
    const fileHasImageExtension = imageExtensions.includes(
      file.type.toLowerCase()
    )
    const result = fileHasImageExtension && file.uri
    return !!result
  }

  return (
    <View style={styles.fileItem}>
      {fileIsAnImage(file) ? (
        <Pressable
          style={styles.item}
          onPress={() =>
            onPressImage({
              uri: file.uri,
              extension: file.type,
              name: file.name,
            })
          }
        >
          <Image
            source={{ uri: `data:image/${file.type};base64,${file.uri}` }}
            style={styles.imagePreview}
          />
        </Pressable>
      ) : (
        <View style={styles.item}>
          <Icon
            color={LingoColors.primary.main}
            source="file-document-multiple-outline"
            size={80}
          />
        </View>
      )}
      <Typography
        variant="body1"
        style={styles.fileName}
        color={LingoColors.primary.main}
      >
        {file.name}.{file.type}
      </Typography>
    </View>
  )
}

export const AssociatedFilesTemplate: FC<AssociatedFilesTemplateProps> = ({
  files,
  onClose,
}) => {
  const [isViewerVisible, setIsViewerVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    uri: string
    extension: string
    name?: string
  } | null>(null)

  const onPressImage = ({
    uri,
    extension,
    name,
  }: {
    uri: string
    extension: string
    name?: string
  }) => {
    setIsViewerVisible(true)
    setSelectedImage({ uri, extension, name })
  }

  return (
    <DetailsTitleTemplate
      title={`Associated files (${files.length})`}
      onClose={onClose}
    >
      <View style={styles.container}>
        <CustomImageViewer
          visible={isViewerVisible}
          uri={selectedImage?.uri || ''}
          extension={selectedImage?.extension || ''}
          name={selectedImage?.name}
          onClose={() => setIsViewerVisible(false)}
        />

        <FlatList
          data={files}
          renderItem={({ item }) => (
            <FileItem file={item} onPressImage={onPressImage} />
          )}
          keyExtractor={(item, index) => `${item.name}-${index}`}
        />
      </View>
    </DetailsTitleTemplate>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fileItem: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginBottom: V_PADDING,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  fileName: {
    color: LingoColors.primary.main,
    marginTop: V_PADDING / 4,
    textAlign: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: LingoColors.border,
    height: 200,
    width: '100%',
  },
})

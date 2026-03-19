import { FC, Fragment } from 'react'
import {
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native'
import { Divider } from 'react-native-paper'

import { MenuItem, MenuItemProps } from './MenuItem'
import { LingoColors } from '../../theme'
import { V_PADDING, H_PADDING } from '../../values'
import { SafeAreaContainer } from '../containers'
import { Typography } from '../typography'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const imageSource: ImageSourcePropType = require('../../assets/images/spm_256a.png')

export type MenuProps = {
  items: MenuItemProps[]
  appVersion: string
  style?: StyleProp<ViewStyle> | undefined
}

/**
 * Menu
 *
 * - Displays a list of menu items
 *
 * @param items - The list of menu items
 */
export const Menu: FC<MenuProps> = ({ items = [], appVersion, style }) => {
  const { width } = useWindowDimensions()

  if (items.length === 0) {
    return <Typography>No menu items were found.</Typography>
  }

  return (
    <SafeAreaContainer style={[styles.safeContainer, style]}>
      <View style={styles.footer}>
        <Typography variant="overline">{appVersion}</Typography>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        overScrollMode="always"
      >
        <View style={[styles.logoContainer]}>
          <Image
            source={imageSource}
            style={[styles.logo, { height: width / 6 }]}
            resizeMode={Platform.OS === 'web' ? 'contain' : undefined}
          />
        </View>
        {items.map((item) => (
          <Fragment key={item.title}>
            <MenuItem {...item} />
            <Divider />
          </Fragment>
        ))}
      </ScrollView>
    </SafeAreaContainer>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: LingoColors.background.dimmed,
  },
  container: {
    paddingBottom: V_PADDING * 4,
  },
  logoContainer: {
    backgroundColor: LingoColors.background.paper,
  },
  logo: {
    marginHorizontal: V_PADDING,
    marginTop: V_PADDING * 2,
    marginBottom: V_PADDING,
    aspectRatio: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'flex-end',
    padding: H_PADDING,
  },
})

import { FC } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'

import { HomeButton } from './HomeButton'
import CaseCartsIcon from '../../assets/icons/CaseCartsIcon'
import QualityEventIcon from '../../assets/icons/QualityEventIcon'
import ScanningIcon from '../../assets/icons/ScanningIcon'
import FindItemIcon from '../../assets/icons/SearchIcon'
import SterilizationIcon from '../../assets/icons/SterilizationIcon'
import TasksIcon from '../../assets/icons/TasksIcon'
import { LingoColors } from '../../theme'
import { H_PADDING } from '../../values'

export type HomeTemplateProps = {
  onNavigateCaseCarts?: () => void
  onNavigateFindItem?: () => void
  onNavigateScanning?: () => void
  onNavigateSterilization?: () => void
  onNavigateTasks?: () => void
  onNavigateQualityEvents?: () => void
}

const ICON_SIZE = 50

export const HomeTemplate: FC<HomeTemplateProps> = ({
  onNavigateCaseCarts,
  onNavigateFindItem,
  onNavigateScanning,
  onNavigateSterilization,
  onNavigateTasks,
  onNavigateQualityEvents,
}) => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      overScrollMode="always"
    >
      {onNavigateCaseCarts && (
        <>
          <HomeButton
            icon={<CaseCartsIcon width={ICON_SIZE} height={ICON_SIZE} />}
            label="Case Carts"
            onPress={onNavigateCaseCarts}
          />
          <Divider />
        </>
      )}
      {onNavigateFindItem && (
        <>
          <HomeButton
            icon={<FindItemIcon width={ICON_SIZE} height={ICON_SIZE} />}
            label="Find Item"
            onPress={onNavigateFindItem}
          />
          <Divider />
        </>
      )}
      {onNavigateScanning && (
        <>
          <HomeButton
            icon={<ScanningIcon width={ICON_SIZE} height={ICON_SIZE} />}
            label="Scanning"
            onPress={onNavigateScanning}
          />
          <Divider />
        </>
      )}
      {onNavigateQualityEvents && (
        <>
          <HomeButton
            icon={<QualityEventIcon width={ICON_SIZE} height={ICON_SIZE} />}
            label="Quality Event"
            onPress={onNavigateQualityEvents}
          />
          <Divider />
        </>
      )}
      {onNavigateSterilization && (
        <>
          <HomeButton
            icon={<SterilizationIcon width={ICON_SIZE} height={ICON_SIZE} />}
            label="Sterilization"
            onPress={onNavigateSterilization}
          />
          <Divider />
        </>
      )}
      {onNavigateTasks && (
        <>
          <HomeButton
            icon={<TasksIcon width={ICON_SIZE} height={ICON_SIZE} />}
            label="Tasks"
            onPress={onNavigateTasks}
          />
          <Divider />
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: LingoColors.background.paper,
  },
  container: {},
})

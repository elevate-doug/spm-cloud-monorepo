import React from 'react'
import { ViewStyle } from 'react-native'
import { Icon } from 'react-native-paper'
import { SvgProps } from 'react-native-svg'

import BuildCircleIcon from './BuildCircleIcon'
import CaseCartsIcon from './CaseCartsIcon'
import CaseSplitIcon from './CaseSplitIcon'
import ChangeCycleIcon from './ChangeCycleIcon'
import ChangeQuantityIcon from './ChangeQuantityIcon'
import CrossIcon from './CrossIcon'
import ExclamationMarkIcon from './ExclamationMarkIcon'
import MoveUpIcon from './MoveUpIcon'
import QualityEventIcon from './QualityEventIcon'
import ScanningIcon from './ScanningIcon'
import SearchFieldIcon from './SearchFieldIcon'
import SearchIcon from './SearchIcon'
import SterilizationIcon from './SterilizationIcon'
import SwapVerticalCircleIcon from './SwapVerticalCircleIcon'
import TasksIcon from './TasksIcon'
import { LingoColors } from '../../theme'

// Define a mapping from icon names to components
const iconMap: Record<string, React.FC<SvgProps>> = {
  'build-circle': BuildCircleIcon,
  'case-carts': CaseCartsIcon,
  'case-split': CaseSplitIcon,
  'change-cycle': ChangeCycleIcon,
  'change-quantity': ChangeQuantityIcon,
  cross: CrossIcon,
  'exclamation-mark': ExclamationMarkIcon,
  'move-up': MoveUpIcon,
  'quality-event': QualityEventIcon,
  scanning: ScanningIcon,
  'search-field': SearchFieldIcon,
  search: SearchIcon,
  sterilization: SterilizationIcon,
  'swap-vertical-circle': SwapVerticalCircleIcon,
  tasks: TasksIcon,
}

type SVGIconProps = {
  name: string
  size?: number
  color?: string
  style?: ViewStyle
}

const SVGIcon: React.FC<SVGIconProps> = ({
  name,
  size = 24,
  color = LingoColors.primary.main,
  style,
}) => {
  const IconComponent = iconMap[name]

  if (!IconComponent) {
    return <Icon color={color} source={name} size={size} />
  }

  return <IconComponent width={size} height={size} fill={color} style={style} />
}

export { SVGIcon }

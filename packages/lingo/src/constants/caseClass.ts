import _ from 'lodash'

export enum CaseClassEnum {
  Unknown = 0,
  Standard = 1,
  Addon = 2,
  Standby = 3,
}

export const CaseClassEnumLabel = {
  [CaseClassEnum.Unknown]: 'Unknown',
  [CaseClassEnum.Standard]: 'Standard',
  [CaseClassEnum.Addon]: 'Addon',
  [CaseClassEnum.Standby]: 'Standby',
}

// get only the values not the keys
export const CaseClassEnumValues = _.values(CaseClassEnum).filter(
  (value) => typeof value === 'number'
)

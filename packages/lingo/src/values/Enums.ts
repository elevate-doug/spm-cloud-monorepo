export enum SearchArea {
  Products = 'products',
  Instruments = 'instruments',
  Both = 'both',
}

export enum LoadStatusEnum {
  Building = 0,
  Built = 1,
  Unloaded = 2,
  Complete = 3,
  Failed = 4,
  All = 5, // not a real status but used for filtering
}

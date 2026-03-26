import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import BuildScreenTemplate from '../../../spm-web-react/src/components/templates/BuildScreenTemplate'
import type { BuildScreenTemplateProps } from '../../../spm-web-react/src/components/templates/BuildScreenTemplate'
import type { BuildItem, InstrumentItem } from '../../../spm-web-react/src/hooks/useBuildScreen'

const MOCK_INSTRUMENTS: InstrumentItem[] = [
  {
    id: 'inst-1',
    barcode: 'INST-001',
    manufacturer: 'Stryker',
    productNumber: 'INST-001',
    instrumentComment: 'Curved Mayo Scissors 6.75"',
    required: 2,
    included: 2,
    missing: 0,
    group: 'Scissors',
  },
  {
    id: 'inst-2',
    barcode: 'INST-002',
    manufacturer: 'Stryker',
    productNumber: 'INST-002',
    instrumentComment: 'Metzenbaum Scissors 7"',
    required: 1,
    included: 0,
    missing: 0,
    group: 'Scissors',
  },
  {
    id: 'inst-3',
    barcode: 'INST-003',
    manufacturer: 'Aesculap',
    productNumber: 'INST-003',
    instrumentComment: 'Kelly Hemostat 5.5"',
    required: 4,
    included: 3,
    missing: 0,
    group: 'Hemostats',
  },
  {
    id: 'inst-4',
    barcode: 'INST-004',
    manufacturer: 'Aesculap',
    productNumber: 'INST-004',
    instrumentComment: 'Crile Hemostat 6.25"',
    required: 4,
    included: 4,
    missing: 0,
    group: 'Hemostats',
  },
  {
    id: 'inst-5',
    barcode: 'INST-005',
    manufacturer: 'Codman',
    productNumber: 'INST-005',
    instrumentComment: 'Adson Tissue Forceps',
    required: 2,
    included: 1,
    missing: 1,
    group: 'Forceps',
  },
  {
    id: 'inst-6',
    barcode: 'INST-006',
    manufacturer: 'Codman',
    productNumber: 'INST-006',
    instrumentComment: 'DeBakey Forceps 7.75"',
    required: 2,
    included: 0,
    missing: 0,
    group: 'Forceps',
  },
]

const MOCK_BUILD: BuildItem = {
  id: 'build-1',
  instrumentSetJourneyId: 'journey-1',
  items: MOCK_INSTRUMENTS,
  isComplete: false,
  name: 'Orthopedic Basic Set',
  buildDate: new Date('2026-03-25T08:15:00'),
  barcode: 'STER-2024-0451',
  user: 'jsmith',
  location: 'SPD Room A',
  currentStage: 0,
}

const MOCK_COMPLETED_BUILD: BuildItem = {
  ...MOCK_BUILD,
  id: 'build-2',
  isComplete: true,
  items: MOCK_INSTRUMENTS.map((i) => ({
    ...i,
    included: i.required,
    missing: 0,
  })),
}

function groupItems(items: InstrumentItem[]): Record<string, InstrumentItem[]> {
  const groups: Record<string, InstrumentItem[]> = {}
  items.forEach((item) => {
    if (!groups[item.group]) groups[item.group] = []
    groups[item.group].push(item)
  })
  return groups
}

function BuildScreenStoryWrapper(props: Partial<BuildScreenTemplateProps> & {
  build?: BuildItem | null
}) {
  const build = props.build ?? MOCK_BUILD
  const [assemblyComments, setAssemblyComments] = useState('')
  const [barcodeValue, setBarcodeValue] = useState('')
  const [lastScannedId, setLastScannedId] = useState<string | null>(props.lastScannedId ?? null)

  return (
    <BuildScreenTemplate
      assemblyBuild={build}
      isLoading={props.isLoading ?? false}
      error={props.error ?? null}
      assemblyComments={assemblyComments}
      onAssemblyCommentsChange={setAssemblyComments}
      barcodeValue={barcodeValue}
      onBarcodeChange={setBarcodeValue}
      inputHighlight={false}
      lastScannedId={lastScannedId}
      canComplete={props.canComplete ?? false}
      isSaving={props.isSaving ?? false}
      groupedInstruments={build ? groupItems(build.items) : {}}
      setInputRefs={() => {}}
      onFormSubmit={(e) => {
        e.preventDefault()
        console.log('Barcode submitted:', barcodeValue)
      }}
      onCountUpdate={(data) => {
        console.log('Count update:', data)
        setLastScannedId(data.instrumentId)
        setTimeout(() => setLastScannedId(null), 1500)
      }}
      onPause={() => console.log('Pause clicked')}
      onComplete={() => console.log('Complete clicked')}
      onExit={() => console.log('Exit clicked')}
    />
  )
}

const meta: Meta<typeof BuildScreenTemplate> = {
  title: 'SPM Web/Build Screen',
  component: BuildScreenTemplate,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    isLoading: { control: 'boolean' },
    isSaving: { control: 'boolean' },
    canComplete: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof BuildScreenTemplate>

export const Default: Story = {
  render: (args) => <BuildScreenStoryWrapper {...args} />,
  args: {
    isLoading: false,
    isSaving: false,
    canComplete: false,
  },
}

export const Loading: Story = {
  render: (args) => <BuildScreenStoryWrapper {...args} build={null} />,
  args: {
    isLoading: true,
  } as Partial<BuildScreenTemplateProps>,
}

export const Saving: Story = {
  render: (args) => <BuildScreenStoryWrapper {...args} />,
  args: {
    isSaving: true,
  },
}

export const ReadyToComplete: Story = {
  render: (args) => (
    <BuildScreenStoryWrapper
      {...args}
      build={{
        ...MOCK_BUILD,
        items: MOCK_INSTRUMENTS.map((i) => ({ ...i, included: i.required, missing: 0 })),
      }}
    />
  ),
  args: {
    canComplete: true,
  },
}

export const CompletedBuild: Story = {
  render: (args) => <BuildScreenStoryWrapper {...args} build={MOCK_COMPLETED_BUILD} />,
  args: {
    isLoading: false,
  },
}

export const WithMissingItems: Story = {
  render: (args) => (
    <BuildScreenStoryWrapper
      {...args}
      build={{
        ...MOCK_BUILD,
        items: MOCK_INSTRUMENTS.map((i, idx) =>
          idx === 4 ? { ...i, included: 0, missing: 2 } : i
        ),
      }}
    />
  ),
  args: {},
}

export const RecentlyScannnedHighlight: Story = {
  render: (args) => <BuildScreenStoryWrapper {...args} lastScannedId="inst-3" />,
  args: {},
}

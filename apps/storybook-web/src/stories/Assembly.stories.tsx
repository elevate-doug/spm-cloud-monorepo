import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import AssemblyTemplate from '../../../spm-web-react/src/components/templates/AssemblyTemplate'
import type { AssemblyTemplateProps } from '../../../spm-web-react/src/components/templates/AssemblyTemplate'
import type { BuildTableItem } from '../../../spm-web-react/src/hooks/useAssembly'

const MOCK_INCOMPLETE_BUILDS: BuildTableItem[] = [
  {
    id: '1',
    barcode: 'STER-2024-0451',
    description: 'Orthopedic Basic Set',
    whenScanned: '03/25/2026, 08:15 AM',
    location: 'SPD Room A',
    scannedBy: 'jsmith',
    processAction: 'Assembling',
  },
  {
    id: '2',
    barcode: 'STER-2024-0449',
    description: 'Cardiovascular Instrument Tray',
    whenScanned: '03/24/2026, 03:42 PM',
    location: 'SPD Room B',
    scannedBy: 'mjohnson',
    processAction: 'Assembled',
  },
  {
    id: '3',
    barcode: 'STER-2024-0447',
    description: 'Neurosurgery Micro Set',
    whenScanned: '03/24/2026, 11:20 AM',
    location: 'SPD Room A',
    scannedBy: 'klee',
    processAction: 'Assembling',
  },
]

const MOCK_COMPLETED_BUILDS: BuildTableItem[] = [
  {
    id: '4',
    barcode: 'STER-2024-0445',
    description: 'General Surgery Basic Pack',
    whenScanned: '03/23/2026, 04:30 PM',
    location: 'SPD Room C',
    scannedBy: 'agarcia',
    processAction: 'Sterilized',
  },
  {
    id: '5',
    barcode: 'STER-2024-0442',
    description: 'Laparoscopic Instrument Set',
    whenScanned: '03/23/2026, 01:15 PM',
    location: 'SPD Room A',
    scannedBy: 'jsmith',
    processAction: 'InStorage',
  },
  {
    id: '6',
    barcode: 'STER-2024-0440',
    description: 'ENT Instrument Tray',
    whenScanned: '03/22/2026, 09:50 AM',
    location: 'SPD Room B',
    scannedBy: 'mjohnson',
    processAction: 'Received',
  },
  {
    id: '7',
    barcode: 'STER-2024-0438',
    description: 'Ophthalmology Micro Set',
    whenScanned: '03/21/2026, 02:10 PM',
    location: 'SPD Room A',
    scannedBy: 'klee',
    processAction: 'Sterilized',
  },
]

function AssemblyStoryWrapper(props: Partial<AssemblyTemplateProps> & {
  completedBuilds?: BuildTableItem[]
  nonCompletedBuilds?: BuildTableItem[]
}) {
  const [barcodeValue, setBarcodeValue] = useState('')
  const [pausedSearchValue, setPausedSearchValue] = useState('')
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([])
  const [pausedSorting, setPausedSorting] = useState<Array<{ id: string; desc: boolean }>>([])

  return (
    <AssemblyTemplate
      barcodeValue={barcodeValue}
      onBarcodeChange={setBarcodeValue}
      pausedSearchValue={pausedSearchValue}
      onPausedSearchChange={setPausedSearchValue}
      sorting={sorting}
      onSortingChange={setSorting}
      pausedSorting={pausedSorting}
      onPausedSortingChange={setPausedSorting}
      inputHighlight={false}
      setInputRefs={() => {}}
      isLoading={props.isLoading ?? false}
      error={props.error ?? null}
      completedBuilds={props.completedBuilds ?? MOCK_COMPLETED_BUILDS}
      nonCompletedBuilds={props.nonCompletedBuilds ?? MOCK_INCOMPLETE_BUILDS}
      onFormSubmit={(e) => {
        e.preventDefault()
        console.log('Barcode submitted:', barcodeValue)
      }}
      onRowClick={(id) => console.log('Row clicked:', id)}
    />
  )
}

const meta: Meta<typeof AssemblyTemplate> = {
  title: 'SPM Web/Assembly',
  component: AssemblyTemplate,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    isLoading: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof AssemblyTemplate>

export const Default: Story = {
  render: (args) => <AssemblyStoryWrapper {...args} />,
  args: {
    isLoading: false,
  },
}

export const Loading: Story = {
  render: (args) => <AssemblyStoryWrapper {...args} />,
  args: {
    isLoading: true,
    completedBuilds: [],
    nonCompletedBuilds: [],
  } as Partial<AssemblyTemplateProps>,
}

export const Empty: Story = {
  render: (args) => <AssemblyStoryWrapper {...args} />,
  args: {
    isLoading: false,
    completedBuilds: [],
    nonCompletedBuilds: [],
  } as Partial<AssemblyTemplateProps>,
}

export const ErrorState: Story = {
  render: (args) => <AssemblyStoryWrapper {...args} />,
  args: {
    isLoading: false,
    error: new Error('Failed to fetch recent scans — network timeout'),
    completedBuilds: [],
    nonCompletedBuilds: [],
  } as Partial<AssemblyTemplateProps>,
}

export const OnlyIncompleteBuilds: Story = {
  render: (args) => <AssemblyStoryWrapper {...args} />,
  args: {
    isLoading: false,
    completedBuilds: [],
    nonCompletedBuilds: MOCK_INCOMPLETE_BUILDS,
  } as Partial<AssemblyTemplateProps>,
}

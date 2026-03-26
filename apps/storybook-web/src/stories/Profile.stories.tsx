import type { Meta, StoryObj } from '@storybook/react'
import ProfileTemplate from '../../../spm-web-react/src/components/templates/ProfileTemplate'
import type { ProfileTemplateProps } from '../../../spm-web-react/src/components/templates/ProfileTemplate'
import type { ProfileUser } from '../../../spm-web-react/src/hooks/useProfile'

const MOCK_USER: ProfileUser = {
  userName: 'jsmith',
  name: 'John Smith',
  initials: 'JS',
  email: 'john.smith@memorial-general.org',
  location: 'Sterile Processing Dept',
  tenant: 'Memorial General Hospital',
  assignment: 'Lead Technician',
  shift: 'Day Shift (7am - 3pm)',
}

const meta: Meta<typeof ProfileTemplate> = {
  title: 'SPM Web/Profile',
  component: ProfileTemplate,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    laborStandard: { control: { type: 'number', min: 0, max: 200, step: 0.1 } },
  },
}

export default meta
type Story = StoryObj<typeof ProfileTemplate>

export const Default: Story = {
  args: {
    currentUser: MOCK_USER,
    laborStandard: 42.5,
    onEdit: () => console.log('Edit profile clicked'),
  },
}

export const HighLaborStandard: Story = {
  args: {
    currentUser: MOCK_USER,
    laborStandard: 156.8,
    onEdit: () => console.log('Edit profile clicked'),
  },
}

export const NoUser: Story = {
  args: {
    currentUser: null,
    laborStandard: 0,
    onEdit: () => console.log('Edit profile clicked'),
  },
}

export const DifferentUser: Story = {
  args: {
    currentUser: {
      userName: 'mjohnson',
      name: 'Maria Johnson',
      initials: 'MJ',
      email: 'maria.johnson@stlukes.org',
      location: 'Operating Room',
      tenant: "St. Luke's Medical Center",
      assignment: 'Surgical Technologist',
      shift: 'Night Shift (11pm - 7am)',
    } satisfies ProfileUser,
    laborStandard: 88.2,
    onEdit: () => console.log('Edit profile clicked'),
  },
}

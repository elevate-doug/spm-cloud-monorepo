import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import LoginTemplate from '../../../spm-web-react/src/components/templates/LoginTemplate'
import type { LoginTemplateProps } from '../../../spm-web-react/src/components/templates/LoginTemplate'

const STERIS_LOGO_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="48" viewBox="0 0 180 48">' +
      '<rect width="180" height="48" rx="8" fill="#1E293B"/>' +
      '<text x="90" y="31" font-family="sans-serif" font-size="20" font-weight="700" fill="#4A90D9" text-anchor="middle">SPM Cloud</text>' +
      '</svg>'
  )

const MOCK_TENANTS = [
  { value: '1', label: 'Memorial General Hospital' },
  { value: '2', label: 'St. Luke\'s Medical Center' },
  { value: '3', label: 'City Regional Health' },
]

function LoginStoryWrapper(props: Partial<LoginTemplateProps>) {
  const [username, setUsername] = useState(props.username ?? '')
  const [password, setPassword] = useState(props.password ?? '')
  const [selectedTenantId, setSelectedTenantId] = useState(props.selectedTenantId ?? '')
  const [showDbDialog, setShowDbDialog] = useState(props.showDbDialog ?? false)

  return (
    <LoginTemplate
      logoSrc={props.logoSrc ?? STERIS_LOGO_PLACEHOLDER}
      username={username}
      onUsernameChange={setUsername}
      password={password}
      onPasswordChange={setPassword}
      selectedTenantId={selectedTenantId}
      onTenantChange={setSelectedTenantId}
      tenantOptions={props.tenantOptions ?? MOCK_TENANTS}
      isLoadingTenants={props.isLoadingTenants ?? false}
      isSubmitting={props.isSubmitting ?? false}
      showDbDialog={showDbDialog}
      onCloseDbDialog={() => setShowDbDialog(false)}
      dbDown={props.dbDown ?? false}
      onSubmit={(e) => {
        e.preventDefault()
        console.log('Login submitted', { username, password, selectedTenantId })
      }}
      onForgotPassword={() => console.log('Forgot password clicked')}
    />
  )
}

const meta: Meta<typeof LoginTemplate> = {
  title: 'SPM Web/Login',
  component: LoginTemplate,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isLoadingTenants: { control: 'boolean' },
    isSubmitting: { control: 'boolean' },
    showDbDialog: { control: 'boolean' },
    dbDown: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof LoginTemplate>

export const Default: Story = {
  render: (args) => <LoginStoryWrapper {...args} />,
  args: {
    isLoadingTenants: true,
    isSubmitting: false,
    showDbDialog: false,
    dbDown: false,
  },
}

export const LoadingTenants: Story = {
  render: (args) => <LoginStoryWrapper {...args} />,
  args: {
    isLoadingTenants: true,
    isSubmitting: false,
    tenantOptions: [],
  },
}

export const Submitting: Story = {
  render: (args) => <LoginStoryWrapper {...args} />,
  args: {
    isSubmitting: true,
  },
}

export const DatabaseDown: Story = {
  render: (args) => <LoginStoryWrapper {...args} />,
  args: {
    showDbDialog: true,
    dbDown: true,
  },
}

export const DatabaseRestored: Story = {
  render: (args) => <LoginStoryWrapper {...args} />,
  args: {
    showDbDialog: true,
    dbDown: false,
  },
}

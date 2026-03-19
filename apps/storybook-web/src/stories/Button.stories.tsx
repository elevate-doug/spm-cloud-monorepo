import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@steris-spm/lingo'

const meta: Meta<typeof Button> = {
  title: 'Lingo/Button',
  component: Button,
  argTypes: {
    mode: {
      control: 'select',
      options: ['text', 'outlined', 'contained', 'elevated', 'contained-tonal', 'contained-warning'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Contained: Story = {
  args: {
    mode: 'contained',
    children: 'Button',
    onPress: () => console.log('pressed'),
  },
}

export const Outlined: Story = {
  args: {
    mode: 'outlined',
    children: 'Outlined',
  },
}

export const TextMode: Story = {
  args: {
    mode: 'text',
    children: 'Text Button',
  },
}

export const Disabled: Story = {
  args: {
    mode: 'contained',
    children: 'Disabled',
    disabled: true,
  },
}

export const Loading: Story = {
  args: {
    mode: 'contained',
    children: 'Loading',
    loading: true,
  },
}

export const Warning: Story = {
  args: {
    mode: 'contained-warning',
    children: 'Delete',
  },
}

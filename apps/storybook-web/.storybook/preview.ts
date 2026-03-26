import type { Preview } from '@storybook/react'
import { useEffect } from 'react'
import { themes } from '@storybook/theming'
import './fonts.css'

const preview: Preview = {
  parameters: {
    docs: {
      theme: themes.dark,
    },
    backgrounds: {
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        // Force dark class onto the iframe's <html> and <body>
        document.documentElement.classList.add('dark')
        document.body.style.backgroundColor = '#0F172A'
        document.body.style.color = '#E2E8F0'
      }, [])

      return Story()
    },
  ],
}

export default preview

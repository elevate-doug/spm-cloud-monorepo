import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 700 }}>SPM Cloud Documentation</span>,
  project: {
    link: 'https://github.com/steris/spm-cloud-monorepo',
  },
  docsRepositoryBase: 'https://github.com/steris/spm-cloud-monorepo/tree/main/apps/docs',
  footer: {
    text: 'SPM Cloud Documentation',
  },
}

export default config

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const apiUrl = env.VITE_API_BASE_URL || 'http://localhost:5361'

    return {
        plugins: [react()],
        server: {
            proxy: {
                '/api': {
                    target: apiUrl,
                    changeOrigin: true,
                    secure: false,
                },
                '/ws': {
                    target: apiUrl,
                    ws: true,
                    changeOrigin: true,
                },
            },
        },
    }
})

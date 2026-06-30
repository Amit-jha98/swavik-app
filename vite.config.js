import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      {
        name: 'api-middleware',
        configureServer(server) {
          server.middlewares.use('/api/gemini', async (req, res) => {
            console.log(`[api-middleware] Received ${req.method} request to ${req.url}`);
            process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
            try {
              // Add a cache buster query to ensure fresh module loading during dev if needed, 
              // but standard dynamic import is fine.
              const handler = await import('./api/gemini.js');
              await handler.default(req, res);
            } catch (error) {
              console.error('API Error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: error.message }));
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
  }
})

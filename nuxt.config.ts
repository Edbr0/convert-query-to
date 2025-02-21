import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'



// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  components: true, // Para auto-importação de componentes
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      API_BASE_URL: '/api' // Ou sua URL absoluta
    }
  },
  build: {
    transpile: ['naive-ui'], // Caso esteja usando Naive UI
  },
  nitro: {
    preset: 'netlify',
    output: {
      dir: '.output'
    },
    hooks: {
      'nitro:build:done': async (ctx) => {
        const fs = await import('fs/promises')
        const path = await import('path')

        const serverDir = path.join(ctx.options.output.dir, 'server')
        const oldFile = path.join(serverDir, 'client.manifest.mjs')
        const newFile = path.join(serverDir, 'client_manifest.mjs')

        try {
          await fs.rename(oldFile, newFile)
          console.log('✅ Renamed client.manifest.mjs to client_manifest.mjs')
        } catch (error) {
          console.warn('⚠️ Could not rename client.manifest.mjs, skipping.')
        }
      }
    },
  },
  plugins:['~/plugins/prism.js'],
  modules: [
    'nuxtjs-naive-ui',
    '@pinia/nuxt',
    '@unocss/nuxt',
    'unplugin-auto-import',
    'unplugin-vue-components'    ],
  vite: {
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar',
              'NSpace',
              'NInput',
              'NButton',
              'NLayout',
              'NLayoutHeader',
              'NLayoutContent',
              'NLayoutFooter',
              'NH1',
              'NIcon'

            ]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ]
  }
})
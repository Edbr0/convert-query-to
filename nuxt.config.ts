import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'





// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  components: true, // Para auto-importação de componentes
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  build: {
    transpile: ['naive-ui'], // Caso esteja usando Naive UI
  },
  nitro: {
    preset: 'vercel',
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
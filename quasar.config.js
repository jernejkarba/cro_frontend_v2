import { configure } from 'quasar/wrappers'
import path from 'path'

export default configure(function (/* ctx */) {
  return {
    eslint: {
      warnings: true,
      errors: true,
    },

    boot: ['main', 'i18n', 'vue-tel-input'],

    css: ['app.scss'],

    extras: ['roboto-font', 'material-icons', 'mdi-v4', 'fontawesome-v5'],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },
      vueRouterMode: 'history',
      extendViteConf(viteConf) {
        viteConf.resolve.alias = {
          ...viteConf.resolve.alias,
          '@': path.resolve(__dirname, './src'),
        }
      },
    },

    devServer: {
      https: false,
      port: 8081,
      open: true,
    },

    framework: {
      config: {},
      lang: 'sl',
      all: 'auto',
      plugins: ['Loading', 'LocalStorage', 'SessionStorage', 'Meta', 'Notify'],
    },

    animations: [],

    pwa: {
      workboxMode: 'GenerateSW',
      manifest: {
        name: 'CRO',
        short_name: 'CRO',
        description: 'Centralni register oseb',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          { src: 'statics/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: 'statics/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'statics/icons/icon-256x256.png', sizes: '256x256', type: 'image/png' },
          { src: 'statics/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: 'statics/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    },

    cordova: {},
    capacitor: {},
    electron: {},
  }
})

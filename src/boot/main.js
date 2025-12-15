import { boot } from 'quasar/wrappers'
import { reactive } from 'vue'
import api from 'src/api'
import jwtSimple from 'jwt-simple'
import { jwtDecode } from 'jwt-decode'
import { Notify } from 'quasar'
import 'noty/lib/noty.css'
import 'noty/lib/themes/mint.css'
import VTooltip from 'v-tooltip'
import moment from 'moment'
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import FileSelector from 'vue-file-selector'
import Slide from 'vue3-burger-menu'

export default boot(({ app }) => {
  function mapNotyToQuasar(options = {}) {
    const mapped = { ...options }

    // --- TEXT → MESSAGE ---
    if (options.text && !options.message) {
      mapped.message = options.text
      delete mapped.text
    }

    // --- LAYOUT (Noty) → POSITION (Quasar) ---
    if (options.layout) {
      const layoutMap = {
        top: 'top',
        topLeft: 'top-left',
        topRight: 'top-right',
        bottom: 'bottom',
        bottomLeft: 'bottom-left',
        bottomRight: 'bottom-right',
        bottomCenter: 'bottom',
      }
      mapped.position = layoutMap[options.layout] || 'bottom'
      delete mapped.layout
    }

    // --- KILLER (Noty) → GROUP (Quasar) ---
    // killer = true → avtomatsko zapre prejšnje
    if (options.killer) {
      mapped.group = false // unique instance, zapre stare
      delete mapped.killer
    }

    // --- closeWith (Noty) → actions / closeOnClick ---
    if (options.closeWith) {
      if (options.closeWith.includes('click')) {
        mapped.closeOnClick = true
      }
      delete mapped.closeWith
    }

    // --- THEME (Noty) (ni v Quasar, odstranimo) ---
    if (options.theme) delete mapped.theme

    return mapped
  }

  // Global properties
  app.config.globalProperties.api = api
  app.config.globalProperties.jwt = jwtSimple
  app.config.globalProperties.moment = moment
  app.config.globalProperties.token = ''
  app.config.globalProperties.$user_data = reactive({ pravice: {} })

  // Noty
  app.config.globalProperties.$noty = {
    success: (text, options = {}) =>
      Notify.create({
        type: 'positive',
        message: text,
        ...mapNotyToQuasar(options),
      }),

    error: (text, options = {}) =>
      Notify.create({
        type: 'negative',
        message: text,
        ...mapNotyToQuasar(options),
      }),

    info: (text, options = {}) =>
      Notify.create({
        type: 'info',
        message: text,
        ...mapNotyToQuasar(options),
      }),

    warning: (text, options = {}) =>
      Notify.create({
        type: 'warning',
        message: text,
        ...mapNotyToQuasar(options),
      }),
  }

  // Plugins
  app.use(VTooltip)
  app.use(FileSelector)
  app.use(Slide)
  app.use(VCalendar)

  // Components
  app.component('VueTelInput', VueTelInput)

  // Global helper functions
  app.config.globalProperties.$refreshToken = function (token) {
    localStorage.setItem('jwt', token)
    this.token = token

    try {
      const decoded = jwtDecode(token)
      Object.assign(this.$user_data, decoded)
    } catch (e) {
      console.error('Napaka pri dekodiranju JWT:', e)
      this.$noty.error('Napaka pri dekodiranju tokena.')
    }
  }

  app.config.globalProperties.$getFloat = function (value) {
    if (!isNaN(parseFloat(value))) {
      value = parseFloat(value)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&_')
      return value.replace('.', ',').replace('_', '.')
    } else {
      return null
    }
  }

  app.config.globalProperties.$stringToDate = function (value) {
    if (value && value.length === 8) {
      return value.substring(6, 8) + '.' + value.substring(4, 6) + '.' + value.substring(0, 4)
    }
    return null
  }
})

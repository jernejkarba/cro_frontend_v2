import { boot } from 'quasar/wrappers'
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

export default boot(({ app }) => {
  app.use(VueTelInput, {
    mode: 'international',
    autoFormat: true,
    dropdownOptions: {
      showDialCodeInList: true,
    },
    inputOptions: {
      showDialCode: true,
    },
  })
})

import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default ({ app }) => {
  const i18n = createI18n({
    legacy: false, // omogoči Composition API
    locale: 'sl',
    fallbackLocale: 'sl',
    messages
  })

  app.use(i18n)
}

import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'

const axiosInstance = axios.create({ 
  baseURL: 'https://api.example.com' 
})

export default boot(({ app, router }) => {
  // Inject into Vue
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api

  // Response interceptor
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        Notify.create({
          type: 'negative',
          message: 'Seja je potekla. Potrebna je ponovna prijava.'
        })

        // Redirect to login or wherever
        router.push('/login')
      }

      return Promise.reject(error)
    }
  )
})

export { api }
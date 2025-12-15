import axios from 'axios'

export default {
  post: (path, payload) => {
    const token = localStorage.getItem('jwt')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    // FormData endpoints
    const formEndpoints = ['PrivolitevAdd', 'PrivolitevCancel', 'DeaktivacijaKontaktnihPodatkov']

    if (formEndpoints.includes(path)) {
      // Pusti axiosu, da nastavi Content-Type
      return axios.post(process.env.VUE_APP_API_URL + path, payload, config)
    } else {
      // JSON endpoints
      return axios.post(process.env.VUE_APP_API_URL + path, { app: 'cro', ...payload }, config)
    }
  },
}

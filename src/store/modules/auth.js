import api from '@/api'

// State
const state = {
  token: null,
  ezso: null,
  firstName: null,
  lastName: null,
  email: null
}

// Getters
const getters = {
  getToken: state => state.token
}

// Actions
const actions = {
  authenticateUser ({ commit }, payload) {
    return api.post('UserLoginWithSCID', {
      url: 'NO_SSO_COOKIE'
    }).then(resp => {
      if (resp.success) {
        commit('setUserData', resp.token)
      }
    })
  }
}

// Mutations
const mutations = {
  setUserData (state, token) {
    const userData = {} // decode(token).userData

    state.token = token
    state.email = userData.email
    state.firstName = userData.first_name
    state.lastName = userData.last_name
  }
}

// Export
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

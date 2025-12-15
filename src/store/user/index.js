// import state from './state'
// import * as getters from './getters'
// import * as mutations from './mutations'
// import * as actions from './actions'
import api from 'src/api'

// State
const state = {
  userData: {
    ezso: '',
    firstname: '',
    lastname: '',
    email: '',
    token: null
  }
}

// Getters
const getters = {
  userData: state => state.userData
}

// Actions
const actions = {
  fetchUser ({ commit }, payload) {
    return api.post('UserGet', {
      id: payload.id
    }).then(resp => {
      if (resp.success) {
        commit('setUserData', resp.user)
      } else {
        throw new Error('404')
      }
    })
  },

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
  setUserData (state, payload) {
    state.userData = {
      ...state.userData,
      ...payload
    }
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

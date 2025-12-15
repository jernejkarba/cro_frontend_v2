import api from 'src/api'

export function fetchUser ({ commit }, payload) {
  return api.post('UserGet', {
    id: payload.id
  }).then(resp => {
    if (resp.success) {
      commit('setUserData', resp.user)
    } else {
      throw new Error('404')
    }
  })
}

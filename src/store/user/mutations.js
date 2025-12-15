export function setUserData (state, payload) {
  state.userData = {
    ...state.userData,
    ...payload
  }
}

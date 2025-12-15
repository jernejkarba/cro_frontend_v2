import Vue from 'vue'
import Vuex from 'vuex'

// we first import the module
import user from './user'
import auth from './auth'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // then we reference it
      user,
      auth,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: import.meta.env.DEV,
  })

  /*
    if we want some HMR magic for it, we handle
    the hot update like below. Notice we guard this
    code with "import.meta.env.DEV" -- so this doesn't
    get into our production build (and it shouldn't).
  */

  if (import.meta.env.DEV && module.hot) {
    module.hot.accept(['./user'], () => {
      const newUsers = require('./user').default
      Store.hotUpdate({ modules: { user: newUsers } })
    })
  }

  return Store
}

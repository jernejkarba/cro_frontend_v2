<template>
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title>
        <q-img id="logo_head" src="logo-sava-cro.png" style="width: 48px; height: 48px" />
        {{ $t('fk_title') }}
      </q-toolbar-title>
      <q-btn id="logout-btn" flat round dense icon="logout" @click="logout">
        <q-tooltip> Odjava </q-tooltip>
      </q-btn>
      <div></div>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  name: 'FKHeader',

  data() {
    return {
      leftDrawerOpen: false,
    }
  },

  methods: {
    logout() {
      this.api
        .post('Logout', {})
        .then((result) => {
          localStorage.setItem('jwt', '')
          window.location.href = process.env.VUE_APP_KEYCLOAK_LOGOUT + '/financna-kartica'
        })
        .catch((err) => {
          console.error('Logout failed:', err)
          alert('Prišlo je do napake pri odjavi')
        })
    },
  },
}
</script>
<style lang="scss" sscoped>
#logo_head {
  margin-left: 20px;
}

#logo_head .q-img__image {
  background-size: initial !important;
}

.q-header {
  background-color: #00ad8d;
}
</style>

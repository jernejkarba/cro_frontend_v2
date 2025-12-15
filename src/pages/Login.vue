<template>
  <q-page id="login-bg" class="window-height window-width row justify-center items-center">
    <div class="column">
      <div id="logo-row" class="row">
        <q-img id="logo_head" src="app-logo-128x128.png" />
        <h5 id="login-title" class="text-h5">Centralni register oseb</h5>
      </div>
      <div class="row">
        <q-card id="login-card" square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                filled
                clearable
                color="cro"
                v-model="username"
                type="email"
                label="Uporabniško ime"
              />
              <q-input
                square
                filled
                clearable
                color="cro"
                v-model="password"
                type="password"
                label="Geslo"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="cro-green"
              size="md"
              class="full-width"
              label="Prijava"
              @click="login()"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    }
  },

  methods: {
    login() {
      this.$q.loading.show()

      this.api
        .post('Login', {
          username: this.username,
          password: this.password,
        })
        .then((result) => {
          this.$q.loading.hide()

          if (result.data.success === true) {
            this.$refreshToken(result.data.token)
            this.$router.push('/', () => {})
          } else {
            window.location.replace(
              'https://webauth.zav-sava.si/?back=' + import.meta.env.VUE_APP_URL
            )
          }
        })
        .catch((e) => {
          window.location.replace(import.meta.env.VUE_APP_API_URL + 'LogoutBack.php')
        })
    },
  },

  mounted() {
    this.login()
  },
}
</script>

<style>
#login-card {
  width: 400px;
}

#logo-row {
  align-self: center;
  /* margin-bottom: 15px; */
}

#logo_head {
  width: 50px;
  height: 50px;
}

#logo_head .q-img__image {
  background-size: contain !important;
}

#login-title {
  color: #888888;
  font-size: 1.2em;
  margin-top: 10px;
}
</style>

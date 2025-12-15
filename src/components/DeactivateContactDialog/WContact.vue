<template>
  <div class="q-pa-md deaktivacija-dialog">
    <WFilters
      @filter="getFilters($event)"
      @openKarantenaDialog="openKarantenaDialog()"
      :filterValues="filterValues"
    >
    </WFilters>

    <WTable
      v-if="renderComponent"
      @filterContacts="filterContacts"
      @setResponse="setResponse($event)"
      @filterEZSO="filterEZSO($event)"
      @setEZSONew="setEZSONew($event)"
      @filterKDST="filterKDST"
      @setKDSTNew="setKDSTNew"
      :data="wData"
      :KDST="KDST"
      :loading="wLoading"
    >
    </WTable>

    <KTable v-if="renderComponent" :data="karantenaData"> </KTable>
  </div>
</template>

<script>
import WFilters from 'components/DeactivateContactDialog/WFilters.vue'
import WTable from 'components/DeactivateContactDialog/WTable.vue'
import KTable from 'components/DeactivateContactDialog/KTable.vue'

export default {
  name: 'WContacts',
  components: {
    WFilters,
    WTable,
    KTable,
  },

  data() {
    return {
      wData: [],
      karantenaData: [],

      filterValues: {
        telefonskaStevilka: null,
        email: '',
      },

      newVisibleColumns: ['EZSO', 'Tip', 'Kontakt', 'Action'],

      wLoading: false,

      renderComponent: true,
    }
  },

  methods: {
    filterContacts() {
      this.wLoading = true
      this.api
        .post('KontaktniPodatkiDe', {
          ...this.filterValues,
        })
        .then((result) => {
          // this.refreshToken(result.data.token)
          this.wLoading = false

          if (result.data.success === true) {
            this.wData = result.data.podatki.map((v) => ({ ...v, file: null }))

            if (result.data.konsolidacijska) {
              this.newVisibleColumns = ['KonsolidacijskaDavcnaStevilka', 'Tip', 'Kontakt', 'Action']
              // this.newVisibleColumns = ['EZSO', 'Tip', 'Kontakt', 'Action']
            } else {
              this.newVisibleColumns = ['EZSO', 'Tip', 'Kontakt', 'Action']
            }

            this.forceRerender()
          } else {
            this.$noty.error(this.$t(result.data.message_key), {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.$noty.error('Seja je potekla. Potrebna je ponovna prijava.', {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
            setTimeout(() => this.$router.push('/login'), 3000)
          } else if (error.response && error.response.status === 403) {
            this.$noty.error('Nimate pravic za izvedbo te akcije.', {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          } else {
            this.$noty.error('Napaka pri komunikaciji s strežnikom.', {
              killer: false,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
            setTimeout(() => this.$router.push('/login'), 3000)
          }
        })
      this.filterKarantenaContacts()
    },

    filterKarantenaContacts() {
      this.wLoading = true
      this.api
        .post('Karantena', {
          ...this.filterValues,
        })
        .then((result) => {
          // this.refreshToken(result.data.token)
          this.wLoading = false

          if (result.data.success === true) {
            this.karantenaData = result.data.podatki

            this.forceRerender()
          } else {
            this.$noty.error(this.$t(result.data.message_key), {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.$noty.error('Seja je potekla. Potrebna je ponovna prijava.', {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
            setTimeout(() => this.$router.push('/login'), 3000)
          } else if (error.response && error.response.status === 403) {
            this.$noty.error('Nimate pravic za izvedbo te akcije.', {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          } else {
            this.$noty.error('Napaka pri komunikaciji s strežnikom.', {
              killer: false,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
            setTimeout(() => this.$router.push('/login'), 3000)
          }
        })
    },

    getFilters(filters) {
      this.filterValues = filters
      this.filterContacts()
    },

    checkContact(kontakt) {
      this.api
        .post('Preveritelefonsko', {
          TelefonskaStevilka: kontakt,
        })
        .then((result) => {
          this.setResponse(result.data)

          if (result.data.success === false && result.data.vrsta_sporocila !== 0) {
            return result.data.sporocilo
          } else {
            return ''
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.$noty.error('Seja je potekla. Potrebna je ponovna prijava.', {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
            setTimeout(() => this.$router.push('/login'), 3000)
          } else if (error.response && error.response.status === 403) {
            this.$noty.error('Nimate pravic za izvedbo te akcije.', {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          } else {
            this.$noty.error('Napaka pri komunikaciji s strežnikom.', {
              killer: false,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
            setTimeout(() => this.$router.push('/login'), 3000)
          }
        })
    },

    forceRerender() {
      this.renderComponent = false

      this.$nextTick(() => {
        this.renderComponent = true
      })
    },

    setResponse(response) {
      this.$emit('setResponse', response)
    },
  },

  computed: {
    envHelper() {
      return env
    },
  },
}
</script>

<style>
.q-pa-md {
  padding: 10px 16px;
}

.q-field--dense .q-field__before,
.q-field--dense .q-field__prepend {
  padding-right: 0px;
}

.q-field--dense .q-field__after,
.q-field--dense .q-field__append {
  padding-left: 0px;
}

.q-checkbox__label {
  font-size: 12px !important;
}

.q-dialog .q-menu scroll {
  margin-left: 5px;
}

.q-dialog .q-menu scroll .q-banner {
  padding-left: 0px;
}

#logo-row {
  align-self: center;
  /* margin-bottom: 15px; */
}

#logo_head {
  width: 120px;
  height: 120px;
}

#logo_head .q-img__image {
  background-size: contain !important;
}

#login-title {
  color: #888888;
  font-size: 2.2em;
  margin-top: 40px;
}

.noty_body {
  text-align: center;
}

.alert {
  padding: 20px;
  margin-top: 30px;
  background-color: #ff9800;
  color: white;
}

.alert span {
  margin-left: 5px;
}

.dots-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.country-selector__toggle__arrow {
  width: 16px;
  height: 16px;
}

.deaktivacija-dialog .de-table-title {
  margin-bottom: 5px;
  font-size: 1.2rem;
}
</style>

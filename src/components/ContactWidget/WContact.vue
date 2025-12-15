<template>
  <div class="q-pa-md" v-if="this.$user_data.pravice.branje === 'T'">
    <WFilters
      @filter="getFilters($event)"
      @update:filterValues="updateFilters"
      :filterValues="localFilters"
      :vsiEzsoji="vsiEzsoji"
      :EZSO="EZSO"
      :KDST="KDST"
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

    <WNewContact
      @addContact="addContact"
      @setResponse="setResponse($event)"
      :data="wNewData"
      :vsiEzsoji="vsiEzsoji"
      :visibleColumns="newVisibleColumns"
      v-if="this.$user_data.pravice['kac_kontakti'] === 'T'"
    >
    </WNewContact>
  </div>
  <div id="login-bg" class="row justify-center items-center" v-else></div>
</template>

<script>
import WFilters from 'components/ContactWidget/WFilters.vue'
import WTable from 'components/ContactWidget/WTable.vue'
import WNewContact from 'components/ContactWidget/WNewContact.vue'

export default {
  name: 'WContacts',
  components: {
    WFilters,
    WTable,
    WNewContact,
  },

  props: {
    filterValues: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      wData: [],
      wNewData: [
        {
          EZSO: '',
          Tip: '1',
          TelefonskaStevilka: null,
          Email: '',
          Action: '',
          KonsolidacijskaDavcnaStevilka: '',
        },
      ],
      localFilters: JSON.parse(JSON.stringify(this.filterValues)),
      vsiEzsoji: [],
      KDST: '',
      EZSO: '',

      newVisibleColumns: ['EZSO', 'Tip', 'Kontakt', 'Action'],

      wLoading: false,

      renderComponent: true,
    }
  },

  methods: {
    filterContacts() {
      this.wLoading = true

      if (
        this.localFilters.KonsolidacijskaDavcnaStevilka !== '' &&
        this.localFilters.KonsolidacijskaDavcnaStevilka !== this.localFilters.KDST
      ) {
        this.$noty.error(
          'Iskana konsolidacijska davčna številka ne pripada osebi za katero ste odprli iskalno okno kontaktov!',
          {
            killer: true,
            timeout: 5000,
            closeWith: ['click'],
            layout: 'bottomCenter',
            theme: 'metroui',
          }
        )
        this.wLoading = false
        return
      }
      this.api
        .post('KontaktniPodatki', {
          ...this.localFilters,
        })
        .then((result) => {
          this.$refreshToken(result.data.token)
          this.wLoading = false

          if (result.data.success === true) {
            this.wData = result.data.podatki

            this.wNewData[0].EZSO = this.localFilters.EZSO
            this.wNewData[0].KonsolidacijskaDavcnaStevilka =
              this.localFilters.KonsolidacijskaDavcnaStevilka
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
    },

    updateFilters(newVal) {
      this.localFilters = newVal
      this.$emit('update:filterValues', newVal)
    },

    getFilters(filters) {
      this.localFilters = filters
      this.filterContacts()
    },

    addContact() {
      if (this.wNewData[0].Tip === '1') {
        this.addTelefonska()
      } else if (this.wNewData[0].Tip === '2') {
        this.addEmail()
      }
    },

    addTelefonska() {
      if (this.wNewData[0].TelefonskaStevilkaFormat === null) {
        this.$noty.error(
          'Vhodni niz podatkov ne vsebuje pravilno vnešene telefonske številke glede na veljavna pravila.',
          {
            killer: true,
            timeout: 5000,
            closeWith: ['click'],
            layout: 'bottomCenter',
            theme: 'metroui',
          }
        )
      } else if (
        this.wNewData[0].KonsolidacijskaDavcnaStevilka !== '' &&
        this.wNewData[0].KonsolidacijskaDavcnaStevilka !== this.KDST
      ) {
        this.$noty.error(
          'Konsolidacijska davčna številka ne pripada osebi za katero ste odprli iskalno okno kontaktov!',
          {
            killer: true,
            timeout: 5000,
            closeWith: ['click'],
            layout: 'bottomCenter',
            theme: 'metroui',
          }
        )
      } else if (this.kacExist()) {
        this.$noty.error(
          'Za dani vir kontakta oseba že ima vnešeno telefonsko številko, dovoljena pa je zgolj ena telefonska številka.',
          {
            killer: true,
            timeout: 5000,
            closeWith: ['click'],
            layout: 'bottomCenter',
            theme: 'metroui',
          }
        )
      } else {
        this.api
          .post('Preveritelefonsko', {
            TelefonskaStevilka: this.wNewData[0].TelefonskaStevilkaFormat,
          })
          .then((result) => {
            this.setResponse(result.data)

            if (result.data.success === true) {
              this.api
                .post('KontaktniPodatkiAdd', {
                  TelefonskaStevilka: this.wNewData[0].TelefonskaStevilkaFormat,
                  EZSO: this.wNewData[0].EZSO,
                  KonsolidacijskaDavcnaStevilka: this.wNewData[0].KonsolidacijskaDavcnaStevilka,
                  IDTipa: result.data.telefonska_tip,
                })
                .then((result) => {
                  this.setResponse(result.data)

                  if (result.data.success === true) {
                    this.filterContacts()
                    this.wNewData = [
                      {
                        EZSO: '',
                        Tip: '1',
                        TelefonskaStevilka: null,
                        TelefonskaStevilkaFormat: null,
                        Email: '',
                        Action: '',
                        KonsolidacijskaDavcnaStevilka: '',
                      },
                    ]
                  } else {
                    this.$noty.error(this.$t(result.data.sporocilo), {
                      killer: true,
                      timeout: 5000,
                      closeWith: ['click'],
                      layout: 'bottomCenter',
                      theme: 'metroui',
                    })
                  }
                })
            } else {
              this.$noty.error(this.$t(result.data.sporocilo), {
                killer: true,
                timeout: 5000,
                closeWith: ['click'],
                layout: 'bottomCenter',
                theme: 'metroui',
              })
            }
          })
          .catch((error) => {
            this.$q.loading.hide()
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
            }
          })
      }
    },

    addEmail() {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (!re.test(this.wNewData[0].Email)) {
        this.$noty.error('Vhodni niz podatkov ne vsebuje pravilno vnešenega e-mail naslova.', {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
      } else if (
        this.wNewData[0].KonsolidacijskaDavcnaStevilka !== '' &&
        this.wNewData[0].KonsolidacijskaDavcnaStevilka !== this.KDST
      ) {
        this.$noty.error(
          'Konsolidacijska davčna številka ne pripada osebi za katero ste odprli iskalno okno kontaktov!',
          {
            killer: true,
            timeout: 5000,
            closeWith: ['click'],
            layout: 'bottomCenter',
            theme: 'metroui',
          }
        )
      } else {
        this.api
          .post('KontaktniPodatkiAdd', {
            Email: this.wNewData[0].Email,
            EZSO: this.wNewData[0].EZSO,
            KonsolidacijskaDavcnaStevilka: this.wNewData[0].KonsolidacijskaDavcnaStevilka,
            IDTipa: 300,
          })
          .then((result) => {
            this.setResponse(result.data)

            if (result.data.success === true) {
              this.filterContacts()
              this.wNewData = [
                {
                  EZSO: '',
                  Tip: '1',
                  TelefonskaStevilka: null,
                  TelefonskaStevilkaFormat: null,
                  Email: '',
                  Action: '',
                  KonsolidacijskaDavcnaStevilka: '',
                },
              ]
            } else {
              this.$noty.error(this.$t(result.data.sporocilo), {
                killer: true,
                timeout: 5000,
                closeWith: ['click'],
                layout: 'bottomCenter',
                theme: 'metroui',
              })
            }
          })
          .catch((error) => {
            this.$q.loading.hide()
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
            }
          })
      }
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

    kacExist() {
      return this.wData.some(function (el) {
        return (
          el.Vir === '10' && (el.IDTipa === '100' || el.IDTipa === '101' || el.IDTipa === '102')
        )
      })
    },

    auth() {
      this.$q.loading.show()

      this.api
        .post('Login', {
          username: '',
          password: '',
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

    logout() {
      localStorage.setItem('jwt', '')
      window.location.replace(import.meta.env.VUE_APP_API_URL + 'Logout.php')
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

    getEzsoData(ezso, KDST) {
      this.api
        .post('VsiEzsoji', {
          EZSO: ezso,
          KonsolidacijskaDavcnaStevilka: KDST,
        })
        .then((result) => {
          if (result.data.success === true) {
            this.vsiEzsoji = result.data.podatki.EZSOList
            this.KDST = result.data.podatki.KDST
            this.EZSO = result.data.podatki.EZSO
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
    setEZSONew(EZSO) {
      this.wNewData[0].EZSO = EZSO
    },
    filterEZSO(ezso) {
      this.localFilters['EZSO'] = ezso
    },
    setKDSTNew() {
      this.wNewData[0].KonsolidacijskaDavcnaStevilka = this.KDST
    },
    filterKDST() {
      this.localFilters['KonsolidacijskaDavcnaStevilka'] = this.KDST
    },
  },

  mounted() {
    if (
      this.filterValues['EZSO'] !== '' ||
      this.filterValues['KonsolidacijskaDavcnaStevilka'] !== ''
    ) {
      this.getEzsoData(
        this.filterValues['EZSO'],
        this.filterValues['KonsolidacijskaDavcnaStevilka']
      )
    }
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

.alert font {
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
</style>

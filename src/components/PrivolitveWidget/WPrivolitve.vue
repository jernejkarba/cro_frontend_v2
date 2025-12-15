<template>
  <div class="q-pa-md" style="margin-top: 10px" v-if="this.$user_data.pravice.branje === 'T'">
    <WFilters
      @filter="getFilters($event)"
      @openAuditTrailDialog="openAuditTrailDialog()"
      @update:filterValues="updateFilters"
      :filterValues="localFilters"
      :vsiEzsoji="vsiEzsoji"
      :EZSO="EZSO"
      :KDST="KDST"
    >
    </WFilters>

    <WTable v-if="renderComponent" :data="wData" :loading="wLoading"> </WTable>

    <div class="row">
      <div class="col">
        <WPrivolitevAction
          @filterPrivolitve="filterPrivolitve"
          @setResponse="setResponse($event)"
          actionType="add"
          :EZSO="EZSO"
          :KDST="KDST"
          v-if="
            this.$user_data.pravice.skrbnik_privolitev === 'T' &&
            !(
              wData.length > 0 &&
              (wData[0].EZSOPrivolitve === '0' || wData[0].EZSOPrivolitve === '-2')
            )
          "
        >
        </WPrivolitevAction>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <WPrivolitevAction
          @filterPrivolitve="filterPrivolitve"
          @setResponse="setResponse($event)"
          actionType="cancel"
          :EZSO="EZSO"
          :KDST="KDST"
          v-if="
            this.$user_data.pravice.skrbnik_privolitev === 'T' &&
            wData.length > 0 &&
            wData[0].EZSOPrivolitve.length > 2
          "
        >
        </WPrivolitevAction>
      </div>
    </div>

    <div
      class="row"
      v-if="
        this.$user_data.pravice.skrbnik_privolitev === 'T' &&
        wData.length > 0 &&
        (wData[0].EZSOPrivolitve === '0' || wData[0].EZSOPrivolitve === '-2')
      "
    >
      <div class="col">
        <q-btn
          class="konflikt-btn"
          size="12px"
          color="white"
          text-color="cro"
          @click="razresiKonflikt"
        >
          <q-icon name="verified_user" />
          <q-icon name="mdi-exclamation" />
          {{ $t('razresi_konflikt') }}
        </q-btn>
      </div>
    </div>

    <q-dialog v-model="auditTrailDialog" transition-show="slide-up" transition-hide="slide-up">
      <q-card class="bg-white" style="width: 90%; max-width: 1200px; min-width: 800px">
        <q-bar class="bg-cro-green">
          <q-icon style="margin-right: 5px" name="history" />
          {{ $t('audit_trail') }}
          <q-space />
          <q-btn flat icon="close" @click="closeAuditTrailDialog()">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <AuditTrailDialog :ezso="EZSO" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
  <div id="login-bg" class="row justify-center items-center" v-else></div>
</template>

<script>
import WFilters from 'components/PrivolitveWidget/WFilters.vue'
import WTable from 'components/PrivolitveWidget/WTable.vue'
import AuditTrailDialog from 'components/PrivolitveWidget/AuditTrailDialog/Dialog.vue'
import WPrivolitevAction from 'components/PrivolitveWidget/WPrivolitevAction.vue'

export default {
  name: 'WPrivolitve',
  components: {
    WFilters,
    WTable,
    AuditTrailDialog,
    WPrivolitevAction,
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
      mainEZSO: '',

      vsiEzsoji: [],
      KDST: '',
      EZSO: '',

      localFilters: JSON.parse(JSON.stringify(this.filterValues)),

      wLoading: false,

      auditTrailDialog: false,

      renderComponent: true,
    }
  },

  methods: {
    filterPrivolitve() {
      this.wLoading = true
      if (
        this.localFilters.KonsolidacijskaDavcnaStevilka !== '' &&
        this.localFilters.KonsolidacijskaDavcnaStevilka !== this.localFilters.KDST
      ) {
        this.$noty.error(
          'Iskana konsolidacijska davčna številka ne pripada osebi za katero ste odprli iskalno okno privolitev!',
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
        .post('Privolitve', {
          ...this.localFilters,
        })
        .then((result) => {
          this.$refreshToken(result.data.token)
          this.wLoading = false

          if (result.data.success === true) {
            this.wData = result.data.podatki
            if (this.wData.length > 0) {
              this.mainEZSO = this.wData[0].ID_Osebe
            } else {
              this.mainEZSO = this.EZSO
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

    razresiKonflikt() {
      this.wLoading = true

      this.api
        .post('PrivolitveKonflikt', {
          EZSO: this.EZSO,
        })
        .then((result) => {
          this.$refreshToken(result.data.token)
          this.wLoading = false

          if (result.data.success === true) {
            this.filterPrivolitve()
            this.$emit('refreshUser', this.vsiEzsoji)
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
      this.filterPrivolitve()
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

    openAuditTrailDialog() {
      this.auditTrailDialog = true
    },

    closeAuditTrailDialog() {
      this.auditTrailDialog = false
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

.alert span {
  margin-left: 5px;
}

.dots-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.konflikt-btn {
  color: #c10013 !important;
  background-color: rgba(193, 0, 19, 0.1) !important;
  box-shadow: none !important;
  border: 1px solid #c2c2c2;
  padding: 0px 10px;
  text-transform: none;
  cursor: initial;
  min-height: 2.2em !important;
  float: right;
  margin-top: 15px;
  cursor: pointer;
}

.konflikt-btn .q-icon {
  font-size: 16px;
}

.konflikt-btn .q-icon:nth-child(2) {
  margin-left: -5px;
}
</style>

<template>
  <div
    class="q-pa-md"
    id="main-div"
    style="background-color: #ffffff"
    v-if="
      this.$user_data.pravice.fk_complete === 'T' ||
      this.$user_data.pravice.fk_except_comments === 'T'
    "
  >
    <Header v-if="paramData.show_header !== 'false'" />
    <Slide
      :class="paramData.show_header === 'false' ? 'no-header' : ''"
      width="260"
      :noOverlay="true"
      :disableOutsideClick="true"
      :crossIcon="false"
      :isOpen="openMenu"
      @state="openMenu = $event"
    >
      <div class="close-menu-icon">
        <q-icon name="arrow_back" @click="openMenu = false" />
      </div>
      <span :class="selectedOption === '1' ? 'selected-option' : ''" @click="selectedOption = '1'">
        Vse police (KNE generalne pogodbe)
      </span>
      <span :class="selectedOption === '2' ? 'selected-option' : ''" @click="selectedOption = '2'">
        Za sodišča
      </span>
      <span :class="selectedOption === '3' ? 'selected-option' : ''" @click="selectedOption = '3'">
        Vse police podrobno
      </span>
      <span :class="selectedOption === '4' ? 'selected-option' : ''" @click="selectedOption = '4'">
        Police KNE
      </span>
      <span :class="selectedOption === '5' ? 'selected-option' : ''" @click="selectedOption = '5'">
        Individualni sektor (brez KNE)
      </span>
      <span :class="selectedOption === '6' ? 'selected-option' : ''" @click="selectedOption = '6'">
        Za poslovni sektor - po fakturah
      </span>
      <span :class="selectedOption === '7' ? 'selected-option' : ''" @click="selectedOption = '7'">
        Po fakturah
      </span>
      <span :class="selectedOption === '8' ? 'selected-option' : ''" @click="selectedOption = '8'">
        Po fakturah in datumih sklenitve
      </span>
      <span :class="selectedOption === '9' ? 'selected-option' : ''" @click="selectedOption = '9'">
        Po fakturah in policah
      </span>
      <span
        :class="selectedOption === '10' ? 'selected-option' : ''"
        @click="selectedOption = '10'"
      >
        Strnjeno - vse police
      </span>
      <span
        :class="selectedOption === '11' ? 'selected-option' : ''"
        @click="selectedOption = '11'"
      >
        Strnjeno vse fakture
      </span>
    </Slide>

    <div
      class="q-pa-md"
      id="tables-field"
      :style="openMenu ? 'margin-left: 250px' : 'margin-left: 40px'"
    >
      <DataCanvas
        @sendMessage="sendMessage($event)"
        @pageLoading="pageLoading($event)"
        :loading="loading"
        :data="canvasData"
        :title="title"
        :userStatus="userStatus"
        :dataStore="dataStore"
        :tableName="tableName"
        :tableFilters="tableFilters"
        :tableFiltersPDF="tableFiltersPDF"
        :tableFiltersSodisce="tableFiltersSodisce"
        :connectionStatus="connectionStatus"
        :dataType="dataType"
      >
      </DataCanvas>
    </div>

    <Footer />
  </div>
  <div id="login-bg" class="window-height window-width row justify-center items-center" v-else>
    <div class="column">
      <div id="logo-row" class="row">
        <q-img id="logo_head" src="icons/ms-icon-310x310.png" />
        <h5 id="login-title" class="text-h5" style="margin-left: 15px">Finančna kartica</h5>
      </div>
      <div
        v-if="
          this.$user_data.pravice.fk_complete === 'F' &&
          this.$user_data.pravice.fk_except_comments === 'F'
        "
      >
        <div class="alert">
          <q-icon name="warning" size="md" />
          <span>
            Uporabnik <b>{{ this.$user_data.name }}</b> nima ustreznih pravic za dostop do
            aplikacije
          </span>
          <q-btn id="logout-btn" flat round dense icon="logout" @click="logout">
            <q-tooltip> Odjava </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from 'components/FinancnaKartica/Header.vue'
import Footer from 'components/Footer.vue'
import DataCanvas from 'components/FinancnaKartica/Data/Canvas.vue'
import { Slide } from 'vue3-burger-menu'

export default {
  name: 'Financna kartica prikaz',
  components: {
    Header,
    Footer,
    Slide,
    DataCanvas,
  },

  meta: {
    title: 'Finančna kartica',
  },

  data() {
    return {
      loading: false,

      token: '',
      paramData: {},
      openMenu: true,
      selectedOption: '1',
      tableName: 'Finančna kartica - Vse police (KNE generalne pogodbe)',
      tableFilters: '()',
      tableFiltersPDF: '',
      tableFiltersSodisce: '',
      data: {},
      title: '',
      userStatus: '',
      dataStore: null,
      canvasData: {},
      fk: null,
      connectionStatus: null,
      connectionDataType: null,
      lastPingReceivedTimestamp: null,
      uuid: null,
      dataType: null,
      source: null,
      msg: null,
    }
  },

  methods: {
    getData() {
      this.loading = true
      this.$q.loading.show()

      this.api
        .post('FinancnaKartica', {
          ...this.paramData,
          tab: this.selectedOption,
        })
        .then((result) => {
          this.$q.loading.hide()
          if (result.status === 200) {
            this.my_fk_data = result.data

            this.data.data_store = result.data_store
            this.data.success = result.success
            this.data.token = result.token

            this.title = 'Skupno stanje zapadlih terjatev in plačil'
            this.title += Object.keys(
              result.data.data.financna_kartica_vse_police_kni_generalne_police
            ).includes('osebe')
              ? result.data.data.financna_kartica_vse_police_kni_generalne_police.osebe.length > 0
                ? ' - ' +
                  result.data.data.financna_kartica_vse_police_kni_generalne_police.osebe[0].Naziv +
                  ' (' +
                  result.data.data.financna_kartica_vse_police_kni_generalne_police.osebe[0][
                    'Davčna št.'
                  ] +
                  ')'
                : ''
              : null

            this.userStatus = Object.keys(
              result.data.data.financna_kartica_vse_police_kni_generalne_police
            ).includes('saldo_razlicnih_zvrsti_terjatev')
              ? result.data.data.financna_kartica_vse_police_kni_generalne_police
                  .saldo_razlicnih_zvrsti_terjatev.status_osebe
              : ''

            this.dataStore = result.data.data_store
            this.switchOption(this.selectedOption)
          }
          /*
        this.refreshToken(result.data.token)

        this.loading = false
        this.$q.loading.hide()

        if (result.data.success === true) {
          this.data = result.data.data
        }
        */
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
            setTimeout(() => this.$router.push('/financna-kartica'), 3000)
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
            setTimeout(() => this.$router.push('/financna-kartica'), 3000)
          }
        })
    },

    switchOption(option) {
      // this.$q.loading.show()

      switch (option) {
        case '1':
          this.canvasData = this.my_fk_data.data.financna_kartica_vse_police_kni_generalne_police
          this.tableName = 'Finančna kartica - Vse police (KNE generalne pogodbe)'
          break
        case '2':
          this.canvasData = this.my_fk_data.data.financna_kartica_za_sodisca
          this.tableName = 'Finančna kartica - Za sodišča'
          break
        case '3':
          this.canvasData = this.my_fk_data.data.financna_kartica_vse_police_podrobno
          this.tableName = 'Finančna kartica - Vse police podrobno'
          break
        case '4':
          this.canvasData = this.my_fk_data.data.financna_kartica_police_kne
          this.tableName = 'Finančna kartica - Police KNE'
          break
        case '5':
          this.canvasData = this.my_fk_data.data.financna_kartica_police_individualni_sektor
          this.tableName = 'Finančna kartica - Individualni sektor (brez KNE)'
          break
        case '6':
          this.canvasData = this.my_fk_data.data.financna_kartica_poslovni_sektor_po_fakturah
          this.tableName = 'Finančna kartica - Za poslovni sektor - po fakturah'
          break
        case '7':
          this.canvasData = this.my_fk_data.data.financna_kartica_po_fakturah
          this.tableName = 'Finančna kartica - Po fakturah'
          break
        case '8':
          this.canvasData = this.my_fk_data.data.financna_kartica_po_fakturah_in_datumih
          this.tableName = 'Finančna kartica - Po fakturah in datumih sklenitve'
          break
        case '9':
          this.canvasData = this.my_fk_data.data.financna_kartica_po_fakturah_in_policah
          this.tableName = 'Finančna kartica - Po fakturah in policah'
          break
        case '10':
          this.canvasData = this.my_fk_data.data.financna_kartica_strnjeno_vse_police
          this.tableName = 'Finančna kartica - Strnjeno - vse police'
          break
        case '11':
          this.canvasData = this.my_fk_data.data.financna_kartica_strnjeno_vse_fakture
          this.tableName = 'Finančna kartica - Strnjeno vse fakture'
          break
      }
    },

    auth() {
      this.$q.loading.show()

      this.api
        .post('Login', {
          username: '',
          password: '',
        })
        .then((result) => {
          // this.$q.loading.hide()

          if (result.data.success === true) {
            this.$refreshToken(result.data.token)
            // this.$router.push('/financna-kartica-prikaz', () => {})

            if (
              this.$user_data.pravice.fk_complete === 'T' ||
              this.$user_data.pravice.fk_except_comments === 'T'
            ) {
              this.getData()
            }
          } else {
            window.location.replace(
              'https://webauth.zav-sava.si/?back=' + import.meta.env.VUE_APP_FK_URL
            )
          }
        })
        .catch((e) => {
          window.location.replace(import.meta.env.VUE_APP_API_URL + 'LogoutBack.php')
        })
    },

    setTableFilters(type) {
      var filters = 'Vloga osebe: '

      switch (this.paramData['vloga_osebe']) {
        case 'VSE':
          filters += 'Vse vloge'
          break
        case '220':
          filters += 'Plačnik'
          break
        case '001':
          filters += 'Zavarovanec'
          break
        case '002':
          filters += 'Sklenitelj'
          break
      }

      if (type !== 'sodisce') {
        switch (this.paramData['vrsta_osebe']) {
          case '1,2':
            filters += '; VSE police'
            break
          case '1':
            filters += '; Zgolj PRAVNE osebe'
            break
          case '2':
            filters += '; Zgolj FIZIČNE osebe'
            break
        }
      }

      filters += '; Vključene police KNE: '
      filters += this.paramData['obravnavanje_kne'] === 'true' ? 'Da' : 'Ne'

      if (type !== 'sodisce') {
        filters += '; Ugotavljanje fakturnih št.: '
        filters += this.paramData['ugotavljanje_fakturnih_st'] === 'true' ? 'Da' : 'Ne'

        filters += '; Izpis vseh polic: '
        filters += this.paramData['izpis_vseh_polic'] === 'true' ? 'Da' : 'Ne'

        filters += '; Izpis vseh terjatev: '
        filters += this.paramData['izpis_vseh_terjatev'] === 'true' ? 'Da' : 'Ne'
      }

      filters +=
        this.paramData['dt_zapadlosti_salda'] !== '' &&
        this.paramData['dt_zapadlosti_salda'] !== null
          ? '; Dt zapadlosti salda: ' + this.paramData['dt_zapadlosti_salda']
          : ''
      filters +=
        this.paramData['dt_zapadlosti_terjatev'] !== '' &&
        this.paramData['dt_zapadlosti_terjatev'] !== null
          ? '; Dt zapadlosti terjatev: ' + this.paramData['dt_zapadlosti_terjatev']
          : ''

      if (type === 'sodisce') {
        filters += '; Valuta: EUR'
      }

      if (type === 'pdf') {
        // filters = filters.replaceAll('Č', 'C').replaceAll('č', 'c')
      }

      return filters
    },

    sendMessage(msg) {
      if (!this.source || !this.uuid || this.connectionStatus === 'disconnected') {
        this.msg = 'Napaka!!'
        return
      }

      msg.uuid = this.uuid
      this.msg = JSON.stringify(msg)
      this.source.postMessage(JSON.stringify(msg), import.meta.env.VUE_APP_UT_URL)
    },

    logout() {
      localStorage.setItem('jwt', '')
      window.location.replace(import.meta.env.VUE_APP_API_URL + 'Logout.php?fk')
    },

    forceRerender() {
      this.renderComponent = false

      this.$nextTick(() => {
        this.renderComponent = true
      })
    },

    pageLoading(status) {
      if (status === 'show') {
        this.$q.loading.show()
      } else {
        this.$q.loading.hide()
      }
    },
  },

  watch: {
    selectedOption: function (newVal) {
      // this.$q.loading.show()
      this.switchOption(newVal)
    },

    dataType: function (newVal) {
      if (newVal === 'UT_KOMP_PRAVNA') {
        this.selectedOption = '7'
      }
    },

    canvasData: function (newVal) {
      if (newVal && Object.keys(newVal).length > 0) {
        this.openMenu = true
      }
    },
  },

  mounted() {
    window.addEventListener('message', (e) => {
      if (!e.isTrusted) {
        return
      }

      try {
        var eventData = JSON.parse(e.data)
        if (eventData.msgType === 'ping') {
          if (this.connectionStatus === 'disconnected') {
            this.connectionStatus = 'connected'
            this.connectionDataType = eventData.dataType
          }
          this.lastPingReceivedTimestamp = Date.now()
          this.uuid = eventData.uuid
          this.dataType = eventData.dataType
          this.connectionStatus = 'connected'
          this.source = e.source

          e.source.postMessage(JSON.stringify({ uuid: this.uuid, msgType: 'pong' }), e.origin)
        } else if (eventData.msgType === 'disconnect') {
          this.initValues()
          this.connectionStatus = 'disconnected'
        }
      } catch (error) {}
    })

    this.paramData = this.$route.query
    this.tableFilters = this.setTableFilters()
    this.tableFiltersPDF = this.setTableFilters('pdf')
    this.tableFiltersSodisce = this.setTableFilters('sodisce')
    this.auth()
    this.$q.loading.hide()
  },

  computed: {
    envHelper() {
      return env
    },
  },
}
</script>

<style>
.bm-menu {
  top: 48px;
  width: 260px;
  background-color: #f6f6f6;
  color: #979797;
  padding-top: 30px;
}

.no-header .bm-menu {
  top: 0px;
}

.bm-menu .close-menu-icon {
  font-size: 26px;
  float: right;
}

.bm-item-list {
  margin-left: 10px;
}

.bm-item-list > * {
  padding: 0.4em;
  color: #979797;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-left: 5px;
  clear: both;
}

.bm-item-list > *:hover {
  color: rgba(0, 0, 0, 0.7);
}

.bm-cross {
  background: #979797;
}

.bm-burger-button {
  top: 75px;
  left: 10px;
  width: 30px;
  position: fixed !important;
}

.no-header .bm-burger-button {
  top: 36px;
}

.bm-burger-bars {
  background: #979797;
}

.bm-burger-bars:nth-of-type(2) {
  top: 30%;
}

.bm-burger-bars:nth-of-type(3) {
  top: 60%;
}

#tables-field {
  transition: 0.5s;
}

#tables-field .table-title {
  margin-top: 0px;
}

.line-style {
  height: 15%;
}

.selected-option {
  color: rgba(0, 0, 0, 0.7);
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

.alert {
  padding: 20px;
  margin-top: 30px;
  background-color: #ff9800;
  color: white;
}

.alert font {
  margin-left: 5px;
}
</style>

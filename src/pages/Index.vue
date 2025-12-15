<template>
  <div class="q-pa-md" id="main-div" v-if="this.$user_data.pravice.branje === 'T'">
    <Header @toggleDeveloper="toggleDeveloper" :developer="developer" />
    <Filters
      @filter="getFilters($event)"
      @reset_filters="resetFilters"
      @clear="clearFilter"
      @clear_all="clearAll"
      @add_next_person="addNextPerson"
      @add_next_fictive_person="addNextFictivePerson"
      @openNewUserDialog="openNewUserDialog()"
      @openDeactivateContactDialog="openDeactivateContactDialog()"
      :filterValues="filterValues"
    />
    <UsersTable
      @selectUsers="selectUsers($event)"
      @selectUser="selectUser($event)"
      @moveFilter="moveFilterValue($event)"
      @setResponse="setResponse($event)"
      @filterData="filterUsers($event)"
      @selectKonsolidacija="selectKonsolidacija($event)"
      @refreshUser="refreshUser($event)"
      @openContactWidget="openContactWidget($event)"
      @openPrivolitveWidget="openPrivolitveWidget($event)"
      @openSifrantNaslovovDialog="openSifrantNaslovovDialog($event)"
      @closeSifrantNaslovovDialog="closeSifrantNaslovovDialog($event)"
      @sendMessage="sendMessage($event)"
      :data="tableData"
      :total="total"
      :config="tableConfig"
      :loading="loading"
      v-model:selectedUsers="selectedUsers"
      :spolOptions="spolOptions"
      :vrstaOsebeOptions="vrstaOsebeOptions"
      :posebnaVrstaOsebeOptions="posebnaVrstaOsebeOptions"
      :vrstaOsebnegaDokumentaOptions="vrstaOsebnegaDokumentaOptions"
      :sifrantPost="sifrantPost"
      :sifrantDrzav="sifrantDrzav"
      :sifrantObcin="sifrantObcin"
      :sifrantNaselij="sifrantNaselij"
      :distributor="distributor"
      :ecrpAuto="ecrpAuto"
      :ecrpReference="ecrpReference"
      :ecrpFields="ecrpFields"
      :ecrpReason="ecrpReason"
      :program="program"
    />

    <UsersTable
      @clearUsers="clearUsers($event)"
      @clearUser="clearUser($event)"
      @selectKonsolidacija="selectKonsolidacija($event)"
      @unselectKonsolidacija="unselectKonsolidacija($event)"
      @moveFilter="moveFilterValue($event)"
      @setResponse="setResponse($event)"
      @filterData="filterUsers($event)"
      @refreshSelectedUsers="refreshSelectedUsers"
      @refreshUser="refreshUser($event)"
      @checkEdit="checkEdit"
      @openContactWidget="openContactWidget($event)"
      @openPrivolitveWidget="openPrivolitveWidget($event)"
      @openSifrantNaslovovDialog="openSifrantNaslovovDialog($event)"
      @closeSifrantNaslovovDialog="closeSifrantNaslovovDialog($event)"
      @sendMessage="sendMessage($event)"
      @setEditable="setEditable($event)"
      :data="selectedTableData.slice(0, 100)"
      :fullData="selectedTableData"
      :config="tableSelectedConfig"
      :loading="loadingSelected"
      v-model:selectedUsers="selectedSelectedUsers"
      :editable="editable"
      :editOK="editOK"
      :spolOptions="spolOptions"
      :vrstaOsebeOptions="vrstaOsebeOptions"
      :posebnaVrstaOsebeOptions="posebnaVrstaOsebeOptions"
      :vrstaOsebnegaDokumentaOptions="vrstaOsebnegaDokumentaOptions"
      :sifrantPost="sifrantPost"
      :sifrantDrzav="sifrantDrzav"
      :sifrantObcin="sifrantObcin"
      :sifrantNaselij="sifrantNaselij"
      :distributor="distributor"
      :ecrpAuto="ecrpAuto"
      :ecrpReference="ecrpReference"
      :ecrpFields="ecrpFields"
      :ecrpReason="ecrpReason"
      :program="program"
    />

    <DevelopmentView
      @closeView="closeDevView($event)"
      :apiResponse="apiResponse"
      v-if="developer"
    />

    <q-dialog
      v-model="contactDialog"
      transition-show="slide-up"
      transition-hide="slide-up"
      full-height
    >
      <q-card class="bg-white" style="width: 800px; max-width: 90vw; min-width: 605px">
        <q-bar class="bg-cro-green">
          Kontaktni podatki osebe
          <q-space />
          <q-btn flat icon="close" @click="closeContactWidget()">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <ContactWidget @setResponse="setResponse($event)" :filterValues="contacFilterValues">
          </ContactWidget>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="deactivateContactDialog"
      transition-show="slide-up"
      transition-hide="slide-up"
      full-height
    >
      <q-card class="bg-white" style="width: 1200px; max-width: 90vw; min-width: 1100px">
        <q-bar class="bg-cro-green">
          Deaktivacija kontaktnih podatkov osebe
          <q-space />
          <q-btn flat icon="close" @click="closeDeactivateContactDialog()">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <DeactivateContactDialog />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="privolitveDialog"
      transition-show="slide-up"
      transition-hide="slide-up"
      full-height
    >
      <q-card
        class="bg-white"
        style="width: 1100px; max-width: 95vw; min-width: 800px; padding-bottom: 25px"
      >
        <q-bar class="bg-cro-green">
          Privolitve stranke
          <q-space />
          <q-btn flat icon="close" class="close-btn" @click="closePrivolitveWidget()">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <PrivolitveWidget
            @setResponse="setResponse($event)"
            @refreshUser="refreshUser($event)"
            :filterValues="privolitveFilterValues"
            @update:filterValues="privolitveFilterValues = $event"
          >
          </PrivolitveWidget>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="newUserDialog"
      transition-show="slide-up"
      transition-hide="slide-up"
      @hide="
        (evt) => {
          clearNewUserValues()
        }
      "
    >
      <q-card
        class="bg-gray"
        style="width: 750px; max-width: 90vw; min-width: 710px; padding-bottom: 25px"
      >
        <q-bar class="bg-cro-green">
          Dodajanje osebe
          <q-space />
          <q-btn flat icon="close" class="close-btn" @click="closeNewUserDialog()">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <NewUser
            @setResponse="setResponse($event)"
            @closeDialog="closeNewUserDialog"
            @openSifrantNaslovovDialog="openSifrantNaslovovDialog($event)"
            @closeSifrantNaslovovDialog="closeSifrantNaslovovDialog($event)"
            @showNewUser="showNewUser($event)"
            @setNewUserEcrpData="setNewUserEcrpData($event)"
            :user="newUserValues"
            :spolOptions="spolOptions"
            :vrstaOsebeOptions="vrstaOsebeOptions"
            :posebnaVrstaOsebeOptions="posebnaVrstaOsebeOptions"
            :vrstaOsebnegaDokumentaOptions="vrstaOsebnegaDokumentaOptions"
            :sifrantPost="sifrantPost"
            :sifrantDrzav="sifrantDrzav"
            :sifrantObcin="sifrantObcin"
            :sifrantNaselij="sifrantNaselij"
            :program="program"
          >
          </NewUser>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="sifrantNaslovovDialog"
      transition-show="slide-up"
      transition-hide="slide-up"
      @hide="
        (evt) => {
          clearSifrantNaslovovValues()
        }
      "
    >
      <q-card
        class="bg-white"
        style="width: 750px; max-width: 90vw; min-width: 710px; padding-bottom: 25px"
      >
        <q-bar class="bg-cro-green">
          Šifrant ulic, naselij in pošt
          <q-space />
          <q-btn flat icon="close" class="close-btn" @click="closeSifrantNaslovovDialog()">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <SifrantNaslovov
            @useDataFromSifrant="useDataFromSifrant($event)"
            @closeSifrantNaslovovDialog="closeSifrantNaslovovDialog($event)"
          >
          </SifrantNaslovov>
        </q-card-section>
      </q-card>
    </q-dialog>
    <Footer />
  </div>
  <div id="login-bg" class="window-height window-width row justify-center items-center" v-else>
    <div class="column">
      <div id="logo-row" class="row">
        <q-img id="logo_head" src="icons/ms-icon-310x310.png" />
        <h5 id="login-title" class="text-h5" style="margin-left: 15px">Centralni register oseb</h5>
      </div>
      <div v-if="$user_data.pravice.branje === 'F'">
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
import Header from 'components/Header.vue'
import Footer from 'components/Footer.vue'
import Filters from 'components/Filters.vue'
import UsersTable from 'components/UsersTable.vue'
import DevelopmentView from 'components/DevelopmentView.vue'
import ContactWidget from 'components/ContactWidget/WContact.vue'
import DeactivateContactDialog from 'components/DeactivateContactDialog/WContact.vue'
import PrivolitveWidget from 'components/PrivolitveWidget/WPrivolitve.vue'
import NewUser from 'components/NewUser.vue'
import SifrantNaslovov from 'components/SifrantNaslovovDialog/Dialog.vue'

export default {
  name: 'CRO',
  components: {
    Header,
    Footer,
    Filters,
    UsersTable,
    DevelopmentView,
    ContactWidget,
    DeactivateContactDialog,
    PrivolitveWidget,
    NewUser,
    SifrantNaslovov,
  },

  data() {
    return {
      loading: false,
      loadingSelected: false,
      program: 'CRO',

      contactDialog: false,
      contacFilterValues: {
        EZSO: '',
        KonsolidacijskaDavcnaStevilka: '',
        avtomatski_ezso: false,
      },

      deactivateContactDialog: false,

      privolitveDialog: false,
      privolitveFilterValues: {
        EZSO: '',
        KonsolidacijskaDavcnaStevilka: '',
        avtomatski_ezso: false,
      },

      newUserDialog: false,
      newUserValues: {
        VrstaOsebe: 'FIZ',
        TipOsebe: '2',
        DavcnaStevilka: '',
        TujaDavcnaStevilka: '',
        Drzava: 'SLOVENIJA',
        IDDrzave: '37',
        DrzavaNaziv: {
          label: 'SLOVENIJA',
          value: '37',
        },
        Ulica: '',
        HisnaSt: '',
        HisnaStOznaka: '',
        Naselje: '',
        NaseljeTujina: '',
        Posta: '',
        PostaSt: '',
        PostaStNaziv: '',
        Obcina: '',
        IDObcine: '',
      },

      sifrantNaslovovDialog: false,
      ezsoInSifrant: null,
      tableInSifrant: '',

      tableData: [],
      selectedTableData: [],

      selectedUsers: [],
      selectedSelectedUsers: [],

      editable: false,
      editOK: true,

      sifrantPost: [],
      sifrantDrzav: [],
      sifrantObcin: [],
      sifrantNaselij: [],

      prevPagination: {},
      total: 0,
      developer: false,
      apiResponse: {},
      filterValues: {
        EZSO: '',
        EMSO: '',
        NazivOsebe: '',
        DavcnaStevilka: '',
        KonsolidacijskaDavcnaStevilka: '',
        DtRojstva: '',
        Ulica: '',
        HisnaSt: '',
        HisnaStOznaka: '',
        Posta: '',
        Vir: '',
        TelefonskaStevilka: null,
        avtomatski_joker: true,
        avtomatski_ezso: true,
        avtomatski_clear: true,
        avtomatski_filter_clear: true,
        avtomatski_and_or: true,
        avtomatski_case_sensitive: true,
      },
      distributor: 0,
      spolOptions: [
        {
          label: 'M',
          value: '1',
        },
        {
          label: 'Ž',
          value: '2',
        },
        {
          label: '#',
          value: '#',
        },
      ],
      vrstaOsebeOptions: [
        {
          label: 'FIZ',
          value: 'FIZ',
        },
        {
          label: 'SP',
          value: 'SP',
        },
        {
          label: 'DOO',
          value: 'DOO',
        },
        {
          label: 'DD',
          value: 'DD',
        },
        {
          label: 'DNO',
          value: 'DNO',
        },
        {
          label: 'SO',
          value: 'SO',
        },
        {
          label: 'OST',
          value: 'OST',
        },
        {
          label: 'DRU - Društvo',
          value: 'DRU',
        },
        {
          label: 'ZVE - Zveza',
          value: 'ZVE',
        },
        {
          label: 'ODV - Odvetnik',
          value: 'ODV',
        },
        {
          label: 'NOT - Notar',
          value: 'NOT',
        },
        {
          label: 'ZDR - Zdravniki, ki opravljajo dejavnost',
          value: 'ZDR',
        },
        {
          label: 'UNI - Univerza oz. fakulteta',
          value: 'UNI',
        },
        {
          label: 'SŠ - Srednja šola',
          value: 'SŠ',
        },
        {
          label: 'OŠ - Osnovna šola',
          value: 'OŠ',
        },
        {
          label: 'VRT - Vrtec',
          value: 'VRT',
        },
        {
          label: 'BOL - Bolnišnica in ambulante',
          value: 'BOL',
        },
        {
          label: 'OBČ - Občina',
          value: 'OBC',
        },
        {
          label: 'UE - Upravna enota',
          value: 'UE',
        },
        {
          label: 'Testne osebe',
          value: 'TEST',
        },
        {
          label: 'FOS',
          value: 'FOS',
        },
        {
          label: 'Etažni lastniki',
          value: 'ETAZE',
        },
        {
          label: 'Seznam – osebe po seznamu, potniki',
          value: 'LISTA',
        },
        {
          label: 'Izvršitelj',
          value: 'IZVR',
        },
        {
          label: 'Dopol. dej.- dopolnilna dejavnost',
          value: 'DOPOL',
        },
        {
          label: 'Državna uprava - ministrstva',
          value: 'DU',
        },
        {
          label: 'Krajevni uradi',
          value: 'KS',
        },
      ],
      posebnaVrstaOsebeOptions: ['TEST', 'FOS', 'ETAZE', 'LISTA', 'DOPOL', 'SP'],
      vrstaOsebnegaDokumentaOptions: [
        {
          label: 'Osebna izkaznica',
          value: 'osebna_izkaznica',
        },
        {
          label: 'Potni list',
          value: 'potni_list',
        },
        {
          label: 'Vozniško dovoljenje',
          value: 'voznisko_dovoljenje',
        },
      ],
      tableConfig: {
        type: 'basic',
        visibleColumns: [
          'arrow',
          'KonsolidacijskaDavcnaStevilka',
          'StopnjaZaupanja',
          'EZSO',
          'NazivOsebe',
          'DavcnaStevilka',
          'StopnjaPravilnosti',
          'EMSO',
          'DtRojstva',
          'Naslov',
          'Spol',
          'VrstaOsebe',
          'Vir',
          'actions',
        ],
      },
      tableSelectedConfig: {
        type: 'selected',
        visibleColumns: [
          'arrow',
          'KonsolidacijskaDavcnaStevilka',
          'StopnjaZaupanja',
          'EZSO',
          'NazivOsebe',
          'DavcnaStevilka',
          'StopnjaPravilnosti',
          'EMSO',
          'DtRojstva',
          'Naslov',
          'Spol',
          'VrstaOsebe',
          'Vir',
          'actions',
        ],
      },

      connectionStatus: null,
      connectionDataType: null,
      lastPingReceivedTimestamp: null,
      uuid: null,
      dataType: null,
      source: null,
      origin: null,
      msg: null,
      ecrpAuto: false,
    }
  },

  methods: {
    filterUsers(data) {
      if (typeof data !== 'undefined') {
        this.prevPagination = data.filters
      }

      let tableType = typeof data !== 'undefined' && 'tableType' in data ? data.tableType : 'basic'

      if (this.sifrantPost.length === 0) {
        this.getSifrant()
      }

      let izbor = []
      let rowsPerPage = 10
      if (tableType === 'basic') {
        this.loading = true
        rowsPerPage = this.prevPagination.hasOwnProperty('rowsPerPage')
          ? this.prevPagination.rowsPerPage === 0
            ? rowsPerPage
            : this.prevPagination.rowsPerPage
          : rowsPerPage
        izbor = this.selectedTableData.map(function (data) {
          return data.EZSO
        })
      } else {
        this.loadingSelected = true
        rowsPerPage = 500
      }

      this.api
        .post('Osebe', {
          ...this.filterValues,
          izbor: izbor,
          sort: this.prevPagination.hasOwnProperty('sortBy')
            ? this.prevPagination.sortBy
            : 'KonsolidacijskaDavcnaStevilka',
          descending: this.prevPagination.hasOwnProperty('descending')
            ? this.prevPagination.descending
            : false,
          page: this.prevPagination.hasOwnProperty('page') ? this.prevPagination.page : 1,
          rowsPerPage: rowsPerPage,
          multisort: this.prevPagination.hasOwnProperty('multisort')
            ? this.prevPagination.multisort
            : false,
          multisortOpt: this.prevPagination.hasOwnProperty('multisortOpt')
            ? this.prevPagination.multisortOpt
            : '',
        })
        .then((result) => {
          this.$refreshToken(result.data.token)

          this.loading = false
          this.loadingSelected = false
          this.$q.loading.hide()
          this.program = 'CRO'

          if (result.data.success === true) {
            if (tableType === 'selected') {
              this.selectedTableData = result.data.osebe
            } else {
              this.tableData = result.data.osebe
              this.total = result.data.total
            }
            this.apiResponse = result.data
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

    showNewUser(ezso) {
      this.clearFilter()
      this.filterValues['EZSO'] = ezso
      this.loading = true
      this.distributor = 0

      this.api
        .post('Osebe', {
          ...this.filterValues,
          izbor: [],
          sort: 'KonsolidacijskaDavcnaStevilka',
          descending: false,
          page: 1,
          rowsPerPage: this.prevPagination.hasOwnProperty('rowsPerPage')
            ? this.prevPagination.rowsPerPage === 0
              ? 10
              : this.prevPagination.rowsPerPage
            : 10,
          multisort: false,
          multisortOpt: '',
        })
        .then((result) => {
          this.$refreshToken(result.data.token)
          this.program = 'CRO'
          if (result.data.success === true) {
            this.tableData = result.data.osebe
            this.total = result.data.total
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
        .finally(() => {
          this.loading = false
        })
    },

    selectKonsolidacija(data) {
      // this.$q.loading.show()
      this.loadingSelected = true
      this.api
        .post('Osebekonsolidacija', {
          konsolidacijska: data.KonsolidacijskaDavcnaStevilka,
          izbor: this.selectedTableData.map(function (data) {
            return data.EZSO
          }),
        })
        .then((result) => {
          this.$refreshToken(result.data.token)
          this.program = 'CRO'
          if (result.data.success === true) {
            this.selectedTableData = [...this.selectedTableData, ...result.data.osebe]

            if (result.data.osebe.length > 100) {
              this.$noty.warning(this.$t('big_data_message') + result.data.osebe.length, {
                killer: true,
                timeout: 7000,
                closeWith: ['click'],
                layout: 'bottomCenter',
                theme: 'metroui',
              })
            }
            this.filterUsers({ filters: data.pagination, selectedUsers: [] })
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
        .finally(() => {
          this.loadingSelected = false
        })
    },

    unselectKonsolidacija(data) {
      for (var i = 0, len = this.selectedTableData.length; i < len; i++) {
        this.removeByKey(this.selectedTableData, {
          key: 'KonsolidacijskaDavcnaStevilka',
          value: data.konsDst,
        })
      }

      this.filterUsers()
    },

    getFilters(filters) {
      this.distributor = 0
      this.filterValues = filters
      this.filterUsers()
    },

    selectUsers(data) {
      this.selectedUsers = data.users
      this.selectedTableData = [...this.selectedTableData, ...this.selectedUsers]

      this.filterUsers({ filters: data.pagination, selectedUsers: [] })
      this.selectedUsers = []
    },

    selectUser(data) {
      const index = this.selectedTableData.findIndex((object) => object.EZSO === data.user.EZSO)

      if (index === -1) {
        this.selectedTableData = [...this.selectedTableData, data.user]
      }

      this.filterUsers({ filters: data.pagination, selectedUsers: [] })
    },

    clearUsers(users) {
      this.selectedSelectedUsers = users
      // this.tableData = [...this.tableData, ...this.selectedSelectedUsers]
      this.selectedSelectedUsers.forEach((item) => {
        this.removeByKey(this.selectedTableData, {
          key: 'EZSO',
          value: item.EZSO,
        })
      })
      this.filterUsers()
      this.selectedSelectedUsers = []
    },

    clearUser(user) {
      // this.tableData = [...this.tableData, data.user]
      this.removeByKey(this.selectedTableData, {
        key: 'EZSO',
        value: user.EZSO,
      })

      this.removeByKey(this.selectedSelectedUsers, {
        key: 'EZSO',
        value: user.EZSO,
      })

      this.filterUsers()
    },

    moveFilterValue(data) {
      if (this.filterValues['avtomatski_filter_clear']) {
        this.clearFilter()
      }

      if (data.filter === 'Naslov') {
        this.filterValues['Ulica'] = data.value['Ulica']
        this.filterValues['HisnaSt'] = data.value['HisnaSt']
        this.filterValues['HisnaStOznaka'] = data.value['HisnaStOznaka']
        this.filterValues['Posta'] = data.value['PostaSt']
      } else {
        this.filterValues[data.filter] = data.value
      }
    },

    resetFilters() {
      this.filterValues.avtomatski_joker = true
      this.filterValues.avtomatski_ezso = true
      this.filterValues.avtomatski_clear = true
      this.filterValues.avtomatski_filter_clear = true
      this.filterValues.avtomatski_and_or = true
      this.filterValues.avtomatski_case_sensitive = true
    },

    clearFilter() {
      if (this.filterValues.EZSO !== '') {
        this.filterValues.EZSO = ''
      }
      if (this.filterValues.EMSO !== '') {
        this.filterValues.EMSO = ''
      }
      if (this.filterValues.NazivOsebe !== '') {
        this.filterValues.NazivOsebe = ''
      }
      if (this.filterValues.DavcnaStevilka !== '') {
        this.filterValues.DavcnaStevilka = ''
      }
      if (this.filterValues.KonsolidacijskaDavcnaStevilka !== '') {
        this.filterValues.KonsolidacijskaDavcnaStevilka = ''
      }
      if (this.filterValues.DtRojstva !== '') {
        this.filterValues.DtRojstva = ''
      }
      if (this.filterValues.Ulica !== '') {
        this.filterValues.Ulica = ''
      }
      if (this.filterValues.HisnaSt !== '') {
        this.filterValues.HisnaSt = ''
      }
      if (this.filterValues.HisnaStOznaka !== '') {
        this.filterValues.HisnaStOznaka = ''
      }
      if (this.filterValues.Posta !== '') {
        this.filterValues.Posta = ''
      }
      if (this.filterValues.Vir !== '') {
        this.filterValues.Vir = ''
      }
      if (this.filterValues.TelefonskaStevilka !== '') {
        this.filterValues.TelefonskaStevilka = null
      }
      if (this.filterValues.Email !== '') {
        this.filterValues.Email = null
      }
    },

    addNextPerson() {
      this.$q.loading.show()
      this.clearAll()
      let sqlDev = ''
      let sqlDevParam = {}
      let tempObj = {}
      let sqlDevOpt = 1
      this.distributor = 1

      this.api
        .post('Razdelilnik')
        .then((result) => {
          this.$refreshToken(result.data.token)

          this.apiResponse = result.data
          sqlDev += '--break--Operacija ' + sqlDevOpt + '--break--'
          sqlDev += result.data.sql
          tempObj = { ['operacija' + sqlDevOpt]: 'operacija' }
          sqlDevParam = { ...sqlDevParam, ...tempObj }
          sqlDevParam = { ...sqlDevParam, ...result.data.sql_parameters }
          sqlDevOpt++

          if (result.data.success === true) {
            if (result.data.result_type === '0') {
              this.filterValues['EZSO'] = result.data.ezso
              this.loadingSelected = true
              let ezsoSeznam = []

              this.api
                .post('Osebe', {
                  ...this.filterValues,
                  izbor: [],
                  sort: 'KonsolidacijskaDavcnaStevilka',
                  descending: false,
                  page: 1,
                  rowsPerPage: 500,
                  multisort: false,
                  multisortOpt: '',
                })
                .then((result) => {
                  this.$refreshToken(result.data.token)
                  this.program = 'CRO'

                  sqlDev += '--break--Operacija ' + sqlDevOpt + '--break--'
                  sqlDev += result.data.sql
                  tempObj = { ['operacija' + sqlDevOpt]: 'operacija' }
                  sqlDevParam = { ...sqlDevParam, ...tempObj }
                  sqlDevParam = { ...sqlDevParam, ...result.data.sql_parameters }
                  sqlDevOpt++

                  if (result.data.success === true) {
                    this.selectedTableData = result.data.osebe
                    // this.selectedSelectedUsers = this.selectedTableData

                    // add distributor data
                    this.selectedTableData.forEach((object) => {
                      object.distributor = this.distributor
                      ezsoSeznam.push(object.EZSO)
                    })
                  }
                })
                .finally(() => {
                  this.loadingSelected = false
                })

              this.clearFilter()
              this.filterValues['NazivOsebe'] = result.data.naziv_osebe
              this.loading = true

              this.api
                .post('Osebe', {
                  ...this.filterValues,
                  // izbor: ezsoSeznam,
                  izbor: [result.data.ezso],
                  sort: 'KonsolidacijskaDavcnaStevilka',
                  descending: false,
                  page: 1,
                  rowsPerPage: this.prevPagination.hasOwnProperty('rowsPerPage')
                    ? this.prevPagination.rowsPerPage === 0
                      ? 10
                      : this.prevPagination.rowsPerPage
                    : 10,
                  multisort: false,
                  multisortOpt: '',
                })
                .then((result) => {
                  this.$refreshToken(result.data.token)

                  sqlDev += '--break--Operacija ' + sqlDevOpt + '--break--'
                  sqlDev += result.data.sql
                  tempObj = { ['operacija' + sqlDevOpt]: 'operacija' }
                  sqlDevParam = { ...sqlDevParam, ...tempObj }
                  sqlDevParam = { ...sqlDevParam, ...result.data.sql_parameters }
                  sqlDevOpt++

                  if (result.data.success === true) {
                    this.tableData = result.data.osebe
                    this.total = result.data.total
                    this.apiResponse = result.data
                    this.apiResponse.sql = sqlDev
                    this.apiResponse.sql_parameters = sqlDevParam
                  }
                })
                .finally(() => {
                  this.loading = false
                })
            }
          } else {
            this.$q.loading.hide()
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
        .finally(() => {
          this.$q.loading.hide()
        })
    },

    addNextFictivePerson() {
      this.$q.loading.show()
      this.clearAll()
      let sqlDev = ''
      let sqlDevParam = {}
      let tempObj = {}
      let sqlDevOpt = 1
      let ezsoDq = ''
      this.distributor = 2

      this.api
        .post('RazdelilnikDq')
        .then((result) => {
          this.$refreshToken(result.data.token)
          this.program = 'CRO'

          this.apiResponse = result.data
          sqlDev += '--break--Operacija ' + sqlDevOpt + '--break--'
          sqlDev += result.data.sql
          tempObj = { ['operacija' + sqlDevOpt]: 'operacija' }
          sqlDevParam = { ...sqlDevParam, ...tempObj }
          sqlDevParam = { ...sqlDevParam, ...result.data.sql_parameters }
          sqlDevOpt++

          if (result.data.success === true) {
            ezsoDq = result.data.ezso
            this.clearFilter()
            this.filterValues['EZSO'] = ezsoDq
            this.loadingSelected = true

            this.api
              .post('Osebe', {
                ...this.filterValues,
                izbor: [],
                sort: 'KonsolidacijskaDavcnaStevilka',
                descending: false,
                page: 1,
                rowsPerPage: this.prevPagination.hasOwnProperty('rowsPerPage')
                  ? this.prevPagination.rowsPerPage === 0
                    ? 10
                    : this.prevPagination.rowsPerPage
                  : 10,
                multisort: false,
                multisortOpt: '',
              })
              .then((result) => {
                this.$refreshToken(result.data.token)

                sqlDev += '--break--Operacija ' + sqlDevOpt + '--break--'
                sqlDev += result.data.sql
                tempObj = { ['operacija' + sqlDevOpt]: 'operacija' }
                sqlDevParam = { ...sqlDevParam, ...tempObj }
                sqlDevParam = { ...sqlDevParam, ...result.data.sql_parameters }
                sqlDevOpt++

                if (result.data.success === true) {
                  let ezsoSeznam = []
                  this.selectedTableData = result.data.osebe
                  // this.selectedSelectedUsers = this.selectedTableData

                  // add distributor data
                  this.selectedTableData.forEach((object) => {
                    object.distributor = this.distributor
                    ezsoSeznam.push(object.EZSO)
                  })

                  this.apiResponse = result.data
                  this.apiResponse.sql = sqlDev
                  this.apiResponse.sql_parameters = sqlDevParam

                  if (result.data.osebe.length > 0) {
                    this.clearFilter()
                    this.filterValues['NazivOsebe'] = result.data.osebe[0].NazivOsebe
                    this.loading = true

                    this.api
                      .post('Osebe', {
                        ...this.filterValues,
                        izbor: ezsoSeznam,
                        sort: 'KonsolidacijskaDavcnaStevilka',
                        descending: false,
                        page: 1,
                        rowsPerPage: this.prevPagination.hasOwnProperty('rowsPerPage')
                          ? this.prevPagination.rowsPerPage === 0
                            ? 10
                            : this.prevPagination.rowsPerPage
                          : 10,
                        multisort: false,
                        multisortOpt: '',
                      })
                      .then((result) => {
                        this.$refreshToken(result.data.token)

                        sqlDev += '--break--Operacija ' + sqlDevOpt + '--break--'
                        sqlDev += result.data.sql
                        tempObj = { ['operacija' + sqlDevOpt]: 'operacija' }
                        sqlDevParam = { ...sqlDevParam, ...tempObj }
                        sqlDevParam = { ...sqlDevParam, ...result.data.sql_parameters }
                        sqlDevOpt++

                        if (result.data.success === true) {
                          this.tableData = result.data.osebe
                          this.total = result.data.total
                          this.apiResponse = result.data
                          this.apiResponse.sql = sqlDev
                          this.apiResponse.sql_parameters = sqlDevParam
                        }
                      })
                      .finally(() => {
                        this.loading = false
                      })
                  }
                }
              })
              .finally(() => {
                this.loadingSelected = false
              })
          } else {
            this.$q.loading.hide()
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
        .finally(() => {
          this.$q.loading.hide()
        })
    },

    refreshSelectedUsers() {
      let ezsoSeznam = []
      this.selectedTableData.forEach((item) => {
        ezsoSeznam.push(item.EZSO)
      })

      this.api
        .post('Oseberefresh', {
          Osebe: ezsoSeznam,
        })
        .then((result) => {
          this.$refreshToken(result.data.token)
          this.program = 'CRO'

          if (result.data.success === true) {
            for (var i = 0, len = result.data.osebe.length; i < len; i++) {
              for (var k = 0, lenk = this.selectedTableData.length; k < lenk; k++) {
                if (result.data.osebe[i].EZSO === this.selectedTableData[k].EZSO) {
                  this.selectedTableData[k].KonsolidacijskaDavcnaStevilka =
                    result.data.osebe[i].KonsolidacijskaDavcnaStevilka
                  this.selectedTableData[k].KD = result.data.osebe[i].KD
                  this.selectedTableData[k].StopnjaZaupanja = result.data.osebe[i].StopnjaZaupanja
                  this.selectedTableData[k].StopnjaPravilnosti =
                    result.data.osebe[i].StopnjaPravilnosti
                  this.selectedTableData[k].DavcnaStevilka = result.data.osebe[i].DavcnaStevilka
                  this.selectedTableData[k].VrstaOsebe = result.data.osebe[i].VrstaOsebe
                  this.selectedTableData[k].TipOsebe = result.data.osebe[i].TipOsebe
                  this.selectedTableData[k].Drzava = result.data.osebe[i].Drzava
                  this.selectedTableData[k].TipNaslova = result.data.osebe[i].TipNaslova
                  this.selectedTableData[k].TipNaslovaNaziv = result.data.osebe[i].TipNaslovaNaziv
                  this.selectedTableData[k].NaslovOd = result.data.osebe[i].NaslovOd
                  this.selectedTableData[k].NaslovDo = result.data.osebe[i].NaslovDo
                  break
                }
              }
            }
            this.checkEdit()
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

    refreshUser(ids) {
      this.api
        .post('Oseberefresh', {
          Osebe: ids,
        })
        .then((result) => {
          this.$refreshToken(result.data.token)
          this.program = 'CRO'

          if (result.data.success === true) {
            for (var i = 0, len = result.data.osebe.length; i < len; i++) {
              for (var j = 0, lenj = this.selectedTableData.length; j < lenj; j++) {
                if (result.data.osebe[i].EZSO === this.selectedTableData[j].EZSO) {
                  this.selectedTableData[j].DavcnaStevilka = result.data.osebe[i].DavcnaStevilka
                  this.selectedTableData[j].Drzava = result.data.osebe[i].Drzava
                  this.selectedTableData[j].DtRojstva = result.data.osebe[i].DtRojstva
                  this.selectedTableData[j].DtSmrti = result.data.osebe[i].DtSmrti
                  this.selectedTableData[j].EMSO = result.data.osebe[i].EMSO
                  this.selectedTableData[j].EZSO = result.data.osebe[i].EZSO
                  this.selectedTableData[j].HisnaStevilka = result.data.osebe[i].HisnaStevilka
                  this.selectedTableData[j].KD = result.data.osebe[i].KD
                  this.selectedTableData[j].KonsolidacijskaDavcnaStevilka =
                    result.data.osebe[i].KonsolidacijskaDavcnaStevilka
                  this.selectedTableData[j].Naselje = result.data.osebe[i].Naselje
                  this.selectedTableData[j].NaseljeTujina = result.data.osebe[i].NaseljeTujina
                  this.selectedTableData[j].Naslov = result.data.osebe[i].Naslov
                  this.selectedTableData[j].NazivOsebe = result.data.osebe[i].NazivOsebe
                  this.selectedTableData[j].Posta = result.data.osebe[i].Posta
                  this.selectedTableData[j].PostaSt = result.data.osebe[i].PostaSt
                  this.selectedTableData[j].PostaStNaziv = result.data.osebe[i].PostaStNaziv
                  this.selectedTableData[j].Spol = result.data.osebe[i].Spol
                  this.selectedTableData[j].StopnjaPravilnosti =
                    result.data.osebe[i].StopnjaPravilnosti
                  this.selectedTableData[j].StopnjaZaupanja = result.data.osebe[i].StopnjaZaupanja
                  this.selectedTableData[j].TRR = result.data.osebe[i].TRR
                  this.selectedTableData[j].Ulica = result.data.osebe[i].Ulica
                  this.selectedTableData[j].Vir = result.data.osebe[i].Vir
                  this.selectedTableData[j].VrstaOsebe = result.data.osebe[i].VrstaOsebe
                  this.selectedTableData[j].TipOsebe = result.data.osebe[i].TipOsebe
                  this.selectedTableData[j].Obcina = result.data.osebe[i].Obcina
                  this.selectedTableData[j].IDObcine = result.data.osebe[i].IDObcine
                  this.selectedTableData[j].IDDrzave = result.data.osebe[i].IDDrzave
                  this.selectedTableData[j].DrzavaNaziv = result.data.osebe[i].DrzavaNaziv
                  this.selectedTableData[j].HisnaSt = result.data.osebe[i].HisnaSt
                  this.selectedTableData[j].HisnaStOznaka = result.data.osebe[i].HisnaStOznaka
                  this.selectedTableData[j].EZSOPrivolitve = result.data.osebe[i].EZSOPrivolitve
                  this.selectedTableData[j].Drzavljanstvo = result.data.osebe[i].Drzavljanstvo
                  this.selectedTableData[j].DrzavaRojstva = result.data.osebe[i].DrzavaRojstva
                  this.selectedTableData[j].TipNaslova = result.data.osebe[i].TipNaslova
                  this.selectedTableData[j].TipNaslovaNaziv = result.data.osebe[i].TipNaslovaNaziv
                  this.selectedTableData[j].NaslovOd = result.data.osebe[i].NaslovOd
                  this.selectedTableData[j].NaslovDo = result.data.osebe[i].NaslovDo
                }
              }
              for (var k = 0, lenk = this.tableData.length; k < lenk; k++) {
                if (result.data.osebe[i].EZSO === this.tableData[k].EZSO) {
                  this.tableData[k].DavcnaStevilka = result.data.osebe[i].DavcnaStevilka
                  this.tableData[k].Drzava = result.data.osebe[i].Drzava
                  this.tableData[k].DtRojstva = result.data.osebe[i].DtRojstva
                  this.tableData[k].DtSmrti = result.data.osebe[i].DtSmrti
                  this.tableData[k].EMSO = result.data.osebe[i].EMSO
                  this.tableData[k].EZSO = result.data.osebe[i].EZSO
                  this.tableData[k].HisnaStevilka = result.data.osebe[i].HisnaStevilka
                  this.tableData[k].KD = result.data.osebe[i].KD
                  this.tableData[k].KonsolidacijskaDavcnaStevilka =
                    result.data.osebe[i].KonsolidacijskaDavcnaStevilka
                  this.tableData[k].Naselje = result.data.osebe[i].Naselje
                  this.tableData[k].NaseljeTujina = result.data.osebe[i].NaseljeTujina
                  this.tableData[k].Naslov = result.data.osebe[i].Naslov
                  this.tableData[k].NazivOsebe = result.data.osebe[i].NazivOsebe
                  this.tableData[k].Posta = result.data.osebe[i].Posta
                  this.tableData[k].PostaSt = result.data.osebe[i].PostaSt
                  this.tableData[k].PostaStNaziv = result.data.osebe[i].PostaStNaziv
                  this.tableData[k].Spol = result.data.osebe[i].Spol
                  this.tableData[k].StopnjaPravilnosti = result.data.osebe[i].StopnjaPravilnosti
                  this.tableData[k].StopnjaZaupanja = result.data.osebe[i].StopnjaZaupanja
                  this.tableData[k].TRR = result.data.osebe[i].TRR
                  this.tableData[k].Ulica = result.data.osebe[i].Ulica
                  this.tableData[k].Vir = result.data.osebe[i].Vir
                  this.tableData[k].VrstaOsebe = result.data.osebe[i].VrstaOsebe
                  this.tableData[k].TipOsebe = result.data.osebe[i].TipOsebe
                  this.tableData[k].Obcina = result.data.osebe[i].Obcina
                  this.tableData[k].IDObcine = result.data.osebe[i].IDObcine
                  this.tableData[k].IDDrzave = result.data.osebe[i].IDDrzave
                  this.tableData[k].DrzavaNaziv = result.data.osebe[i].DrzavaNaziv
                  this.tableData[k].HisnaSt = result.data.osebe[i].HisnaSt
                  this.tableData[k].HisnaStOznaka = result.data.osebe[i].HisnaStOznaka
                  this.tableData[k].EZSOPrivolitve = result.data.osebe[i].EZSOPrivolitve
                  this.tableData[k].Drzavljanstvo = result.data.osebe[i].Drzavljanstvo
                  this.tableData[k].DrzavaRojstva = result.data.osebe[i].DrzavaRojstva
                  this.tableData[k].TipNaslova = result.data.osebe[i].TipNaslova
                  this.tableData[k].TipNaslovaNaziv = result.data.osebe[i].TipNaslovaNaziv
                  this.tableData[k].NaslovOd = result.data.osebe[i].NaslovOd
                  this.tableData[k].NaslovDo = result.data.osebe[i].NaslovDo
                }
              }
            }
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

    checkEdit() {
      this.editOK = true
      let currentEdit = '-1'
      this.selectedSelectedUsers.forEach((item) => {
        if (item.KD === null || (item.KD !== currentEdit && currentEdit !== '-1')) {
          this.editOK = false
        }
        currentEdit = item.KD
      })
    },

    clearAll() {
      this.clearFilter()
      this.tableData = []
      this.selectedTableData = []
      this.selectedUsers = []
      this.selectedSelectedUsers = []
      this.total = 0
      this.distributor = 0
    },

    removeByKey(array, params) {
      array.some(function (item, index) {
        return array[index][params.key] === params.value ? !!array.splice(index, 1) : false
      })
      return array
    },

    toggleDeveloper() {
      this.developer = !this.developer
    },

    setResponse(response) {
      this.apiResponse = response
    },

    auth() {
      this.$q.loading.show()

      this.api
        .post('Login', {
          username: 'l',
          password: 'l',
        })
        .then((result) => {
          this.$q.loading.hide()

          if (result.data.success === true) {
            this.$refreshToken(result.data.token)
            // this.$router.push('/', () => {})
          } else {
            // window.location.replace('https://webauth.zav-sava.si/?back=' + import.meta.env.VUE_APP_URL)
          }
        })
        .catch((e) => {
          // window.location.replace(import.meta.env.VUE_APP_API_URL + 'LogoutBack.php')
        })
    },

    logout() {
      localStorage.setItem('jwt', '')
      window.location.replace(import.meta.env.VUE_APP_API_URL + 'Logout.php')
    },

    getSifrant() {
      this.api
        .post('Sifranti')
        .then((result) => {
          if (result.data.success === true) {
            this.sifrantPost = result.data.sifrant_post
            this.sifrantDrzav = result.data.sifrant_drzav
            this.sifrantObcin = result.data.sifrant_obcin
            this.sifrantNaselij = result.data.sifrant_naselij
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

    openContactWidget(ezso) {
      this.contactDialog = true
      this.contacFilterValues['EZSO'] = ezso
    },

    closeContactWidget() {
      this.contactDialog = false
    },

    openDeactivateContactDialog(ezso) {
      this.deactivateContactDialog = true
    },

    closeDeactivateContactDialog() {
      this.deactivateContactDialog = false
    },

    openPrivolitveWidget(ezso) {
      this.privolitveDialog = true
      this.privolitveFilterValues['EZSO'] = ezso
    },

    closePrivolitveWidget() {
      this.privolitveDialog = false
    },

    openNewUserDialog() {
      if (this.sifrantPost.length === 0) {
        this.getSifrant()
      }

      this.newUserDialog = true
    },

    closeNewUserDialog() {
      this.newUserDialog = false
    },

    clearNewUserValues() {
      this.newUserValues = {
        VrstaOsebe: 'FIZ',
        TipOsebe: '2',
        DavcnaStevilka: '',
        TujaDavcnaStevilka: '',
        Drzava: 'SLOVENIJA',
        IDDrzave: '37',
        DrzavaNaziv: {
          label: 'SLOVENIJA',
          value: '37',
        },
        Ulica: '',
        HisnaSt: '',
        HisnaStOznaka: '',
        Naselje: '',
        NaseljeTujina: '',
        Posta: '',
        PostaSt: '',
        PostaStNaziv: '',
        Obcina: '',
        IDObcine: '',
      }
    },

    setNewUserEcrpData(data) {
      this.program = 'CRO/eCRP'
      this.newUserValues = {
        VrstaOsebe: 'FIZ',
        TipOsebe: '2',
        Spol: data.Spol,
        DavcnaStevilka: data.DavcnaStevilka,
        NazivOsebe: data.NazivOsebe,
        DtRojstva: data.DtRojstva,
        DtSmrti: data.DtSmrti,
        EMSO: data.EMSO,
        Ulica: data.Ulica,
        HisnaSt: data.HisnaSt,
        HisnaStOznaka: data.HisnaStOznaka,
        Naselje: data.Naselje,
        NaseljeTujina: '',
        Posta: data.Posta,
        PostaSt: data.PostaSt,
        PostaStNaziv: data.Posta,
        Obcina: data.Obcina,
        IDObcine: data.IDObcine,
        Drzavljanstvo: data.Drzavljanstvo,
        Drzava: 'SLOVENIJA',
        IDDrzave: '37',
        DrzavaNaziv: {
          label: 'SLOVENIJA',
          value: '37',
        },
      }
    },

    openSifrantNaslovovDialog(data) {
      this.ezsoInSifrant = data.ezso
      this.tableInSifrant = data.table
      this.sifrantNaslovovDialog = true
    },

    closeSifrantNaslovovDialog() {
      this.sifrantNaslovovDialog = false
    },

    useDataFromSifrant(data) {
      if (data.length > 0) {
        if (this.ezsoInSifrant === null) {
          this.newUserValues.PostaSt = data[0].PostnaSt
          this.newUserValues.Posta = data[0].Posta
          this.newUserValues.PostaStNaziv = data[0].PostnaSt + ' - ' + data[0].Posta
          this.newUserValues.Ulica = data[0].Ulica
          this.newUserValues.Naselje = data[0].Naselje
        } else if (this.tableInSifrant === 'basic') {
          for (var j = 0, lenj = this.tableData.length; j < lenj; j++) {
            if (this.tableData[j].EZSO === this.ezsoInSifrant) {
              this.tableData[j].PostaSt = data[0].PostnaSt
              this.tableData[j].Posta = data[0].Posta
              this.tableData[j].PostaStNaziv = data[0].PostnaSt + ' - ' + data[0].Posta
              this.tableData[j].Ulica = data[0].Ulica
              this.tableData[j].HisnaSt = ''
              this.tableData[j].HisnaStOznaka = ''
              this.tableData[j].Naselje = data[0].Naselje
              this.tableData[j].Obcina = ''
              this.tableData[j].IDObcine = '#'
            }
          }
        } else if (this.tableInSifrant === 'selected') {
          for (var k = 0, lenk = this.selectedTableData.length; k < lenk; k++) {
            if (this.selectedTableData[k].EZSO === this.ezsoInSifrant) {
              this.selectedTableData[k].PostaSt = data[0].PostnaSt
              this.selectedTableData[k].Posta = data[0].Posta
              this.selectedTableData[k].PostaStNaziv = data[0].PostnaSt + ' - ' + data[0].Posta
              this.selectedTableData[k].Ulica = data[0].Ulica
              this.selectedTableData[k].HisnaSt = ''
              this.selectedTableData[k].HisnaStOznaka = ''
              this.selectedTableData[k].Naselje = data[0].Naselje
              this.selectedTableData[k].Obcina = ''
              this.selectedTableData[k].IDObcine = '#'
            }
          }
        }

        this.closeSifrantNaslovovDialog()
      } else {
        this.$noty.error(this.$t('sn_select_empty'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
      }
    },

    clearSifrantNaslovovValues() {
      this.sifrantNaslovovValues = {}
    },

    setEditable(value) {
      this.editable = value
    },

    sendMessage(data) {
      let response = {}
      response.uuid = this.uuid
      response.code = data.msg ? data.msg : null
      response.data = data.fields ? data.fields : null
      response.response = data.response ? data.response : null

      switch (data.msg) {
        case 'res_identical':
          response.msg = 'Podatki so identični'
          break
        case 'res_updated':
          response.msg = 'Podatki so se spremenili'
          break
        case 'res_not_found':
          response.msg = 'Nismo našli osebe'
          break
        case 'err_canceled':
          response.msg = 'Preklicano'
          break
        case 'res_api_error':
          response.msg = 'Napaka eCRP'
          break
        default:
          response.msg = ''
      }

      this.msg = JSON.stringify(response)
      if (this.uuid) {
        /*
        this.$noty.warning('Okno se bo avtomatsko zaprlo', {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui'
        })

        setTimeout(() => {
          window.opener.postMessage(response, '*')
          window.close()
        }, '5000')
        */
        window.opener.postMessage(response, '*')
        window.close()
      }
    },

    forceRerender() {
      this.renderComponent = false

      this.$nextTick(() => {
        this.renderComponent = true
      })
    },
  },

  mounted() {
    this.uuid = this.$route.query.uuid

    this.filterValues['EZSO'] = this.$route.query.ezso
    this.filterValues['EMSO'] = this.$route.query.emso
    this.filterValues['NazivOsebe'] = this.$route.query.naziv
    this.filterValues['DavcnaStevilka'] = this.$route.query.davcnaSt
    this.filterValues['KonsolidacijskaDavcnaStevilka'] = this.$route.query.konsDavcnaSt
    this.ecrpAuto = this.$route.query.ecrp === 'true'
    this.ecrpReference = this.$route.query.reference
    this.ecrpFields = this.$route.query.fields
    this.ecrpReason = this.$route.query.reason
    this.filterValues['avtomatski_ezso'] = !this.ecrpAuto

    // console.log(this.$route.query.integracija)
    // this.program = this.integracija ? this.integracija : this.program

    this.auth()
  },

  computed: {
    envHelper() {
      return env
    },
  },
}
</script>

<style>
body {
  line-height: 1;
  min-width: 1000px;
}

.q-table__top {
  padding: 5px !important;
  padding-bottom: 0px !important;
}

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

.q-field__control {
  padding-right: 6px !important;
}

.q-table th,
.q-table td {
  padding: 0px 5px;
}

.q-table.loading th,
.q-table.loading td {
  padding: 0px !important;
}

.q-table tbody td {
  font-size: 12px;
}

.q-table thead tr,
.q-table tbody td {
  height: 40px;
}

.q-checkbox__label {
  font-size: 12px !important;
}

#main-div {
  padding-left: 40px;
  padding-right: 40px;
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

.q-bar {
  padding-right: 0px;
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

.q-bar--standard {
  color: #ffffff;
  font-size: 14px;
}

#kac-icon {
  margin: 0px 10px;
  border: 1px solid #ffffff;
  border-radius: 5px;
  padding: 2px 5px;
  font-size: 12px;
}

.q-dialog .q-card__section {
  padding: 0px !important;
}

.q-dialog__inner > div {
  border-radius: 0px !important;
}

.deactivate-confirm-dialog .q-card__section {
  padding: 16px !important;
}

.deactivate-confirm-dialog .q-card__actions {
  padding: 8px 8px 16px 8px !important;
}

.popover {
  z-index: 10;
}

.tooltip-inner .resize-observer {
  display: none;
}

.bg-gray {
  background-color: #eeeeee;
}
</style>

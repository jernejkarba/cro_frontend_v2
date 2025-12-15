<template>
  <div
    class="q-pa-md"
    id="main-div"
    v-if="
      this.$user_data.pravice.fk_complete === 'T' ||
      this.$user_data.pravice.fk_except_comments === 'T'
    "
  >
    <Header />

    <Filters
      @filter="getFilters($event)"
      @clear="clearFilter"
      @clear_all="clearAll"
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
      :data="tableData"
      :total="total"
      :config="tableConfig"
      :loading="loading"
      :selectedUsers="selectedUsers"
    />

    <UsersTable
      @clearUsers="clearUsers($event)"
      @clearUser="clearUser($event)"
      @checkUser="checkUser($event)"
      @selectKonsolidacija="selectKonsolidacija($event)"
      @unselectKonsolidacija="unselectKonsolidacija($event)"
      @moveFilter="moveFilterValue($event)"
      @setResponse="setResponse($event)"
      :data="selectedTableData.slice(0, 100)"
      :fullData="selectedTableData"
      :config="tableSelectedConfig"
      :loading="loadingSelected"
      :selectedUsers="selectedSelectedUsers"
    />

    <ActionRow
      v-if="selectedSelectedUsers.length > 0"
      @action="getActionValues($event)"
      :actionValues="actionValues"
    />

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
import Filters from 'components/FinancnaKartica/Filters.vue'
import UsersTable from 'components/FinancnaKartica/UsersTable.vue'
import ActionRow from 'components/FinancnaKartica/ActionRow.vue'

export default {
  name: 'Financna kartica',
  components: {
    Header,
    Filters,
    UsersTable,
    ActionRow,
    Footer,
  },

  meta: {
    title: 'Finančna kartica',
  },

  data() {
    return {
      loading: false,
      loadingSelected: false,
      isFiltering: false,

      token: '',

      filterValues: {
        EZSO: '',
        NazivOsebe: '',
        DavcnaStevilka: '',
        avtomatski_joker: true,
        avtomatski_ezso: true,
        avtomatski_clear: true,
        avtomatski_filter_clear: true,
        avtomatski_and_or: true,
        avtomatski_case_sensitive: true,
      },

      actionValues: {
        dt_zapadlosti_salda: this.formatDate(new Date(), 'dd.mm.yyyy'),
        dt_zapadlosti_terjatev: this.formatDate(new Date(), 'dd.mm.yyyy'),
        dt_sklenitve_od: this.formatDate(new Date('1990-01-01'), 'dd.mm.yyyy'),
        dt_sklenitve_do: this.formatDate(new Date('2050-12-31'), 'dd.mm.yyyy'),
        dt_placil_od: this.formatDate(new Date('1990-01-01'), 'dd.mm.yyyy'),
        dt_placil_do: this.formatDate(new Date('2050-12-31'), 'dd.mm.yyyy'),
        obdobje_sklenitve: null,
        obdobje_placil: null,
        vse_terjatve_disable: false,
        ugotavljanje_fakturnih_st: true,
        obravnavanje_kne: true,
        izpis_vseh_polic: false,
        izpis_vseh_terjatev: true,
        vrsta_osebe: '1,2',
        vloga_osebe: '220',
        fakture_saldo_ni_nic: false,
        fakture_saldo_ni_nic_obdobje: '3',
      },

      tableData: [],
      selectedTableData: [],

      selectedUsers: [],
      selectedSelectedUsers: [],

      prevPagination: {},
      total: 0,

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
          'DtRojstva',
          'Naslov',
          'VrstaOsebe',
          'Sts',
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
          'DtRojstva',
          'Naslov',
          'VrstaOsebe',
          'Sts',
        ],
      },
    }
  },

  methods: {
    async filterUsers(data) {
      // Prepreči zanko
      if (this.isFiltering) return

      this.isFiltering = true
      this.loading = true

      if (data?.pagination) {
        this.prevPagination = data.pagination
      }

      this.api
        .post('Osebe', {
          ...this.filterValues,
          izbor: this.selectedTableData.map(function (data) {
            return data.EZSO
          }),
          sort: this.prevPagination.hasOwnProperty('sortBy')
            ? this.prevPagination.sortBy
            : 'KonsolidacijskaDavcnaStevilka',
          descending: this.prevPagination.hasOwnProperty('descending')
            ? this.prevPagination.descending
            : false,
          page: this.prevPagination.hasOwnProperty('page') ? this.prevPagination.page : 1,
          rowsPerPage: this.prevPagination.hasOwnProperty('rowsPerPage')
            ? this.prevPagination.rowsPerPage
            : 10,
          multisort: this.prevPagination.hasOwnProperty('multisort')
            ? this.prevPagination.multisort
            : false,
          multisortOpt: this.prevPagination.hasOwnProperty('multisortOpt')
            ? this.prevPagination.multisortOpt
            : '',
        })
        .then((result) => {
          this.$refreshToken(result.data.token)

          this.isFiltering = false
          this.loading = false
          this.$q.loading.hide()

          if (result.data.success === true) {
            this.tableData = result.data.osebe
            this.total = result.data.total
            // this.apiResponse = result.data
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
      this.filterUsers()
    },

    selectUsers(data) {
      this.selectedUsers = data.users
      this.selectedTableData = [...this.selectedTableData, ...this.selectedUsers]
      this.selectedSelectedUsers = [...this.selectedSelectedUsers, ...this.selectedUsers]
      this.filterUsers({ filters: data.pagination, selectedUsers: [] })
      this.selectedUsers = []
    },

    selectUser(data) {
      const index = this.selectedTableData.findIndex((object) => object.EZSO === data.user.EZSO)

      if (index === -1) {
        this.selectedTableData = [...this.selectedTableData, data.user]
        this.selectedSelectedUsers = this.selectedSelectedUsers.concat(data.user)
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

    checkUser(users) {
      this.selectedSelectedUsers = users
    },

    clearAll() {
      this.clearFilter()
      this.tableData = []
      this.selectedTableData = []
      this.selectedUsers = []
      this.selectedSelectedUsers = []
      this.total = 0
      this.actionValues = {
        dt_zapadlosti_salda: this.formatDate(new Date(), 'dd.mm.yyyy'),
        dt_zapadlosti_terjatev: this.formatDate(new Date(), 'dd.mm.yyyy'),
        dt_sklenitve_od: this.formatDate(new Date('1990-01-01'), 'dd.mm.yyyy'),
        dt_sklenitve_do: this.formatDate(new Date('2050-12-31'), 'dd.mm.yyyy'),
        dt_placil_od: this.formatDate(new Date('1990-01-01'), 'dd.mm.yyyy'),
        dt_placil_do: this.formatDate(new Date('2050-12-31'), 'dd.mm.yyyy'),
        ugotavljanje_fakturnih_st: true,
        obravnavanje_kne: true,
        izpis_vseh_polic: false,
        izpis_vseh_terjatev: true,
        vrsta_osebe: '1,2',
        vloga_osebe: '220',
        fakture_saldo_ni_nic: false,
        fakture_saldo_ni_nic_obdobje: '3',
      }
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

          if (result.data.success === true) {
            this.selectedTableData = [...this.selectedTableData, ...result.data.osebe]
            this.selectedSelectedUsers = [...this.selectedSelectedUsers, ...result.data.osebe]
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

        this.removeByKey(this.selectedSelectedUsers, {
          key: 'KonsolidacijskaDavcnaStevilka',
          value: data.konsDst,
        })
      }
      this.filterUsers()
    },

    moveFilterValue(data) {
      this.clearFilter()
      this.filterValues[data.filter] = data.value
    },

    clearFilter() {
      if (this.filterValues.EZSO !== '') {
        this.filterValues.EZSO = ''
      }
      if (this.filterValues.NazivOsebe !== '') {
        this.filterValues.NazivOsebe = ''
      }
      if (this.filterValues.DavcnaStevilka !== '') {
        this.filterValues.DavcnaStevilka = ''
      }
    },

    removeByKey(array, params) {
      array.some(function (item, index) {
        return array[index][params.key] === params.value ? !!array.splice(index, 1) : false
      })
      return array
    },

    getActionValues(data) {
      // let routeData = this.$router.resolve({ path: '/financna-kartica-prikaz', query: { data: Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&') } })
      let routeData = this.$router.resolve({
        path: '/financna-kartica-prikaz',
        query: {
          ezso_list: this.selectedSelectedUsers.map((x) => x.EZSO).join(','),
          dt_zapadlosti_salda: this.actionValues.dt_zapadlosti_salda,
          dt_zapadlosti_terjatev: this.actionValues.dt_zapadlosti_terjatev,
          obdobje_sklenitve:
            this.actionValues.dt_sklenitve_od + ' - ' + this.actionValues.dt_sklenitve_do,
          obdobje_placil: this.actionValues.dt_placil_od + ' - ' + this.actionValues.dt_placil_do,
          ugotavljanje_fakturnih_st: this.actionValues.ugotavljanje_fakturnih_st,
          obravnavanje_kne: this.actionValues.obravnavanje_kne,
          izpis_vseh_polic: this.actionValues.izpis_vseh_polic,
          izpis_vseh_terjatev: this.actionValues.izpis_vseh_terjatev,
          vrsta_osebe: this.actionValues.vrsta_osebe,
          vloga_osebe: this.actionValues.vloga_osebe,
          fakture_saldo_ni_nic: this.actionValues.fakture_saldo_ni_nic,
          fakture_saldo_ni_nic_obdobje: this.actionValues.fakture_saldo_ni_nic_obdobje,
        },
      })
      if (data.new_tab) {
        window.open(routeData.href, '_blank')
      }
    },

    formatDate(date, format) {
      return format
        .replace('mm', (date.getMonth() + 1).toString().padStart(2, '0'))
        .replace('yyyy', date.getFullYear())
        .replace('yy', date.getFullYear().toString().slice(-2))
        .replace('dd', date.getDate().toString().padStart(2, '0'))
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
            this.$router.push('/financna-kartica', () => {})
          } else {
            window.location.replace(
              'https://webauth.zav-sava.si/?back=' + import.meta.env.VUE_APP_FK_URL
            )
          }
        })
        .finally(() => {
          this.$q.loading.hide()
        })
        .catch((e) => {
          window.location.replace(import.meta.env.VUE_APP_API_URL + 'LogoutBack.php')
        })
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
  },

  mounted() {
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
  min-width: 138px;
  padding-top: 5px;
}

#fk-action-container {
  padding-top: 25px;
}

#fk-action-container .q-checkbox__inner {
  width: 30px !important;
  min-width: 30px !important;
  height: 30px !important;
}

.q-radio__label {
  font-size: 12px !important;
  min-width: 84px;
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

.alert span {
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

#rmvDateBtn,
#currentDateBtn {
  text-transform: inherit !important;
  display: inline-flex;
}

#rmvDateBtn .q-icon.on-left {
  margin-right: 5px !important;
}

.action-checkbox.single .q-checkbox__bg {
  top: 0 !important;
}
</style>

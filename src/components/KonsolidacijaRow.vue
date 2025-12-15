<template>
  <q-tr id="kons-tr">
    <q-td colspan="100%">
      <div class="kons-field-div">
        <q-select
          color="cro"
          bg-color="white"
          outlined
          stack-label
          :dense="true"
          v-model="konsValues['Nacin']"
          :disable="disabled ? true : false"
          :label="$t('kons_nacin')"
          :options="typeOptions"
        >
        </q-select>
      </div>
      <div
        class="kons-field-div"
        v-if="
          konsValues['Nacin']['value'] == '1' ||
          konsValues['Nacin']['value'] == '5' ||
          konsValues['Nacin']['value'] == '7' ||
          konsValues['Nacin']['value'] == '8'
        "
        style="display: inline-flex"
      >
        <q-select
          color="cro"
          bg-color="white"
          outlined
          stack-label
          :dense="true"
          v-model="konsValues['StopnjaZaupanja']"
          @update:model-value="spremembaStopnje()"
          :label="$t('stopnja_zaupanja')"
          :options="stopnjaZaupanjaOptions"
        >
        </q-select>
      </div>
      <div
        class="kons-field-div"
        v-if="
          ((konsValues['Nacin']['value'] == '1' || konsValues['Nacin']['value'] == '7') &&
            konsValues['StopnjaZaupanja']['value'] != '0') ||
          konsValues['Nacin']['value'] == '3' ||
          konsValues['Nacin']['value'] == '5' ||
          konsValues['Nacin']['value'] == '8'
        "
      >
        <q-input
          color="cro"
          bg-color="white"
          outlined
          stack-label
          :dense="true"
          v-model="konsValues['DavcnaStevilka']"
          :placeholder="$t('davcna_full')"
          :label="$t('davcna')"
        >
        </q-input>
      </div>
      <div
        class="kons-field-div"
        v-if="konsValues['Nacin']['value'] == '3'"
        style="display: inline-flex"
      >
        <q-input
          color="cro"
          bg-color="white"
          outlined
          stack-label
          :dense="true"
          v-model="konsValues['NovaDavcnaStevilka']"
          :placeholder="$t('nova_davcna_full')"
          :label="$t('nova_davcna')"
        >
        </q-input>
      </div>
      <div
        class="kons-field-div"
        v-if="
          konsValues['Nacin']['value'] == '1' ||
          konsValues['Nacin']['value'] == '7' ||
          konsValues['Nacin']['value'] == '8'
        "
      >
        <q-select
          color="cro"
          bg-color="white"
          outlined
          stack-label
          :dense="true"
          style="min-width: 120px"
          v-model="konsValues['VrstaOsebe']"
          :label="$t('vrsta_osebe')"
          :options="vrstaOsebeOptions"
        >
        </q-select>
      </div>
      <div
        class="kons-field-div"
        v-if="
          konsValues['Nacin']['value'] == '1' ||
          konsValues['Nacin']['value'] == '7' ||
          konsValues['Nacin']['value'] == '8'
        "
      >
        <q-select
          color="cro"
          bg-color="white"
          outlined
          stack-label
          :dense="true"
          v-model="konsValues['Neskladnost']"
          :label="$t('kons_neskladnost_izbira')"
          :options="neskladnostOptions"
        >
        </q-select>
      </div>
      <div
        class="kons-field-div"
        v-if="
          konsValues['Nacin']['value'] == '1' ||
          konsValues['Nacin']['value'] == '7' ||
          konsValues['Nacin']['value'] == '8'
        "
      >
        <q-input
          color="cro"
          bg-color="white"
          outlined
          stack-label
          :dense="true"
          v-model="konsValues['Opis']"
          :placeholder="$t('konsolidacija_komentar')"
          :label="$t('kons_opis')"
        >
        </q-input>
      </div>
      <div class="kons-field-div-btns" v-if="konsValues.Nacin.value !== '0'">
        <q-btn
          round
          color="negative"
          icon="clear"
          size="sm"
          style="margin-right: 5px"
          @click="$emit('clearKonsRow')"
        />
        <q-btn
          round
          color="cro-green"
          icon="done"
          size="sm"
          v-if="konsOK === 0"
          @click="konsDone()"
        />
        <q-btn round color="warning" icon="priority_high" size="sm" v-else>
          <q-tooltip>
            {{ this.konsOK === -1 ? $t('kons_warning_1') : $t('kons_warning_2') }}
          </q-tooltip>
        </q-btn>
      </div>
    </q-td>
  </q-tr>
</template>

<script>
export default {
  name: 'konsolidacijaRow',

  props: {
    konsValues: {
      type: Object,
      required: true,
    },
    selectedUsers: {
      type: [Object, Array],
      required: true,
    },
    visibleColumns: {
      type: [Object, Array],
      required: true,
    },
    neskladnostOptions: {
      type: Array,
      required: true,
    },
    stopnjaZaupanjaOptions: {
      type: Array,
      required: true,
    },
    vrstaOsebeOptions: {
      type: Array,
      required: true,
    },
    konsOK: {
      type: Number,
      required: true,
      default: 0,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    distributor: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      sqlDev: '',
      sqlDevParam: {},
      tempObj: {},
      sqlDevOpt: 1,

      typeOptions: [
        {
          label: 'Izberite način',
          value: '0',
        },
        {
          label: 'Konsolidacija',
          value: '1',
        },
        {
          label: 'Konsolidiraj in spremeni stopnjo zaupanja',
          value: '8',
        },
        {
          label: 'Nova davčna št.',
          value: '3',
        },
        {
          label: 'Odstrani šifre',
          value: '4',
        },
        {
          label: 'Sprememba stopnje zaupanja',
          value: '5',
        },
        {
          label: 'Razdruži',
          value: '6',
        },
        {
          label: 'Razdruži in konsolidiraj',
          value: '7',
        },
      ],
    }
  },

  methods: {
    konsDone() {
      this.loading = true

      if (this.selectedUsers.length > 0) {
        let nacin = this.konsValues.Nacin.value

        this.sqlDev = ''
        this.sqlDevParam = {}
        this.sqlDevOpt = 1

        this.$emit('pageLoading', 'show')

        if (nacin === '1' || nacin === '8') {
          this.konsolidacija(nacin)
        } else if (nacin === '3') {
          this.novaDavcna()
        } else if (nacin === '4') {
          this.odstaniSifre()
        } else if (nacin === '5') {
          this.stopnjaZaupanja()
        } else if (nacin === '6' || nacin === '7') {
          this.razdruzi(nacin)
        } else {
          this.$emit('pageLoading', 'hide')
        }
      } else {
        this.$noty.error(this.$t('osebe_empty'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
      }
    },

    async konsolidacija(nacin) {
      try {
        this.loading = true
        this.$emit('pageLoading', 'show')

        // Priprava parametrov
        const ezsoSeznam = []
        const distributorSeznam = []
        let distributor = 0

        this.selectedUsers.forEach((item) => {
          ezsoSeznam.push(item.EZSO)
          distributor = item.distributor > distributor ? item.distributor : distributor
          if (item.distributor > 0) {
            distributorSeznam.push(item.EZSO)
          }
        })

        // API klic
        const response = await this.api.post('Konsolidacija', {
          Osebe: ezsoSeznam,
          DavcnaStevilka: this.konsValues.DavcnaStevilka,
          StopnjaZaupanja: this.konsValues.StopnjaZaupanja.value,
          VrstaOsebe: this.konsValues.VrstaOsebe.value,
          SifraNeskladnosti: this.konsValues.Neskladnost.value,
          Opis: this.konsValues.Opis,
          Razdelilnik: distributor,
          RazdelilnikOsebe: distributorSeznam,
        })

        const result = response.data

        // Osveži JWT (če backend vrača nov token)
        if (result.token) {
          this.$emit('refresh_token', result.token)
        }

        // SQL debug informacije
        this.sqlDev += '--break--Operacija ' + this.sqlDevOpt + '--break--' + result.sql
        this.tempObj = { ['operacija' + this.sqlDevOpt]: 'operacija' }
        this.sqlDevParam = { ...this.sqlDevParam, ...this.tempObj, ...result.sql_parameters }
        this.sqlDevOpt++

        this.setResponse(result)
        this.$emit('pageLoading', 'hide')

        if (result.success === true) {
          let sporocilo = result.sporocilo || this.$t(result.message_key)
          let vrstaSporocila = 'success'
          let notyTimeout = 2000

          if (result.vrsta_sporocila === 1) {
            vrstaSporocila = 'error'
            notyTimeout = 5000
          } else if (result.vrsta_sporocila === 2) {
            vrstaSporocila = 'warning'
            notyTimeout = 5000
          }

          if (nacin === '8') {
            this.stopnjaZaupanja(nacin)
          } else {
            const apiResponse = { ...result, sql: this.sqlDev, sql_parameters: this.sqlDevParam }
            this.setResponse(apiResponse)

            if (vrstaSporocila === 'success') {
              setTimeout(() => {
                this.$emit('selectedUsersKons', result.sql_parameters[':davcna_k'])
              }, 2000)
            }
          }

          this.refreshSelectedUsers()

          this.$noty[vrstaSporocila](sporocilo, {
            killer: false,
            timeout: notyTimeout,
            closeWith: ['click'],
            layout: 'bottomCenter',
            theme: 'metroui',
          })
        } else {
          this.refreshSelectedUsers()
          this.$noty.error(this.$t(result.message_key), {
            killer: false,
            timeout: 5000,
            closeWith: ['click'],
            layout: 'bottomCenter',
            theme: 'metroui',
          })
        }
      } catch (error) {
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
      } finally {
        setTimeout(() => {
          this.loading = false
          this.$emit('pageLoading', 'hide')
        }, 300)
      }
    },

    novaDavcna() {
      let ezsoSeznam = []
      this.selectedUsers.forEach((item) => {
        ezsoSeznam.push(item.EZSO)
      })
      this.api
        .post('Novadavcna', {
          Osebe: ezsoSeznam,
          DavcnaStevilka: this.konsValues.NovaDavcnaStevilka,
          DavcnaStevilkaStara: this.konsValues.DavcnaStevilka,
        })
        .then((result) => {
          this.$emit('refresh_token', result.data.token)

          this.setResponse(result.data)
          this.$emit('pageLoading', 'hide')
          if (result.data.success === true) {
            let sporocilo = result.data.sporocilo
            if (sporocilo === '') {
              sporocilo = this.$t(result.data.message_key)
            }

            let vrstaSporocila = 'success'
            let notyTimeout = 2000
            if (result.data.vrsta_sporocila === 1) {
              vrstaSporocila = 'error'
              notyTimeout = 5000
            } else if (result.data.vrsta_sporocila === 2) {
              vrstaSporocila = 'warning'
              notyTimeout = 5000
            }

            this.refreshSelectedUsers()

            this.$noty[vrstaSporocila](sporocilo, {
              killer: false,
              timeout: notyTimeout,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          } else {
            this.$noty.error(this.$t(result.data.message_key), {
              killer: false,
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
          setTimeout(() => {
            this.loading = false
            this.$emit('pageLoading', 'hide')
          }, 300)
        })
    },

    odstaniSifre() {
      let ids = []
      this.selectedUsers.forEach((item) => {
        ids.push(item.EZSO)
      })
      this.api
        .post('Odstranisifre', {
          Osebe: ids,
        })
        .then((result) => {
          this.$emit('refresh_token', result.data.token)

          this.setResponse(result.data)
          this.$emit('pageLoading', 'hide')
          if (result.data.success === true) {
            // TODO: odstrani sifre iz Izbora

            let sporocilo = result.data.sporocilo
            if (sporocilo === '') {
              sporocilo = this.$t(result.data.message_key)
            }

            let vrstaSporocila = 'success'
            let notyTimeout = 2000
            if (result.data.vrsta_sporocila === 1) {
              vrstaSporocila = 'error'
              notyTimeout = 5000
            } else if (result.data.vrsta_sporocila === 2) {
              vrstaSporocila = 'warning'
              notyTimeout = 5000
            }

            this.refreshSelectedUsers()

            this.$noty[vrstaSporocila](sporocilo, {
              killer: false,
              timeout: notyTimeout,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          } else {
            this.$noty.error(this.$t(result.data.message_key), {
              killer: false,
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
          setTimeout(() => {
            this.loading = false
            this.$emit('pageLoading', 'hide')
          }, 300)
        })
    },

    stopnjaZaupanja(nacin = '0') {
      let ezsoSeznam = []
      this.selectedUsers.forEach((item) => {
        ezsoSeznam.push(item.EZSO)
      })
      this.api
        .post('Stopnjazaupanja', {
          Osebe: ezsoSeznam,
          DavcnaStevilka: this.konsValues.DavcnaStevilka,
          StopnjaZaupanja: this.konsValues.StopnjaZaupanja.value,
        })
        .then((result) => {
          this.$emit('refresh_token', result.data.token)

          if (nacin === '8') {
            this.sqlDev += '--break--Operacija ' + this.sqlDevOpt + '--break--'
            this.sqlDev += result.data.sql
            this.tempObj = { ['operacija' + this.sqlDevOpt]: 'operacija' }
            this.sqlDevParam = { ...this.sqlDevParam, ...this.tempObj }
            this.sqlDevParam = { ...this.sqlDevParam, ...result.data.sql_parameters }
            this.sqlDevOpt++

            let apiResponse = result.data
            apiResponse.sql = this.sqlDev
            apiResponse.sql_parameters = this.sqlDevParam
            this.setResponse(apiResponse)
          } else {
            this.setResponse(result.data)
          }
          this.$emit('pageLoading', 'hide')
          if (result.data.success === true) {
            let sporocilo = result.data.sporocilo
            if (sporocilo === '') {
              sporocilo = this.$t(result.data.message_key)
            }

            let vrstaSporocila = 'success'
            let notyTimeout = 2000
            if (result.data.vrsta_sporocila === 1) {
              vrstaSporocila = 'error'
              notyTimeout = 5000
            } else if (result.data.vrsta_sporocila === 2) {
              vrstaSporocila = 'warning'
              notyTimeout = 5000
            }

            this.refreshSelectedUsers()

            this.$noty[vrstaSporocila](sporocilo, {
              killer: false,
              timeout: notyTimeout,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          } else {
            this.$noty.error(this.$t(result.data.message_key), {
              killer: false,
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
          setTimeout(() => {
            this.loading = false
            this.$emit('pageLoading', 'hide')
          }, 300)
        })
    },

    razdruzi(nacin) {
      let ids = []
      this.selectedUsers.forEach((item) => {
        if (
          ids.includes(item.KonsolidacijskaDavcnaStevilka) === false &&
          item.KonsolidacijskaDavcnaStevilka !== '' &&
          item.KonsolidacijskaDavcnaStevilka !== null
        ) {
          ids.push(item.KonsolidacijskaDavcnaStevilka)
        }
      })
      this.api
        .post('Razdruzisifre', {
          Osebe: ids,
        })
        .then((result) => {
          this.$emit('refresh_token', result.data.token)

          this.sqlDevOpt = 1
          this.sqlDev = '--break--Operacija ' + this.sqlDevOpt + '--break--'
          this.sqlDev += result.data.sql
          this.tempObj = { ['operacija' + this.sqlDevOpt]: 'operacija' }
          this.sqlDevParam = { ...this.tempObj, ...result.data.sql_parameters }
          this.sqlDevOpt++

          this.setResponse(result.data)
          this.$emit('pageLoading', 'hide')
          if (result.data.success === true) {
            let sporocilo = result.data.sporocilo
            if (sporocilo === '') {
              sporocilo = this.$t(result.data.message_key)
            }

            let vrstaSporocila = 'success'
            let notyTimeout = 2000
            if (result.data.vrsta_sporocila === 1) {
              vrstaSporocila = 'error'
              notyTimeout = 5000
            } else if (result.data.vrsta_sporocila === 2) {
              vrstaSporocila = 'warning'
              notyTimeout = 5000
            }

            if (nacin === '7') {
              this.konsolidacija(nacin)

              setTimeout(() => {
                let apiResponse = result.data
                apiResponse.sql = this.sqlDev
                apiResponse.sql_parameters = this.sqlDevParam
                this.setResponse(apiResponse)
              }, 1000)
            } else {
              this.refreshSelectedUsers()
            }

            this.$noty[vrstaSporocila](sporocilo, {
              killer: false,
              timeout: notyTimeout,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          } else {
            this.$noty.error(this.$t(result.data.message_key), {
              killer: false,
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
          setTimeout(() => {
            this.loading = false
            this.$emit('pageLoading', 'hide')
          }, 300)
        })
    },

    refreshSelectedUsers() {
      this.$emit('refreshSelectedUsers')
    },

    spremembaStopnje() {
      if (this.konsValues.DavcnaStevilka === '') {
        this.konsValues.DavcnaStevilka = this.selectedUsers[0].DavcnaStevilka
      }
    },

    setResponse(response) {
      this.$emit('setResponse', response)
    },
  },
}
</script>

<style lang="scss" scoped>
.kons-field-div {
  display: inline-flex;
  margin-top: 0px;
  margin-right: 5px;
}

.kons-field-div label {
  margin-top: 0px;
}

.kons-field-div-btns {
  display: inline-flex;
  margin-top: 0px;
  float: right;
  padding-top: 5px;
  padding-right: 5px;
}

#kons-tr {
  height: 50px;
  padding-top: 3px;
}

#kons-tr td {
  padding-left: 0px;
}
</style>

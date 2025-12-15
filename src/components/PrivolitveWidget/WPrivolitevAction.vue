<template>
  <div>
    <div class="col table-title">
      <q-icon
        class="title-status-icon"
        name="check"
        style="color: #3da183"
        v-if="actionType === 'add'"
      />
      <q-icon class="title-status-icon" name="close" style="color: #c10013" v-else />
      <div class="title-div">
        {{ this.actionType === 'add' ? $t('add_privolitev_title') : $t('cancel_privolitev_title') }}
      </div>
    </div>

    <q-table
      :class="visibleColumns.includes('GDPRKanali') ? 'large-table' : 'small-table'"
      id="new-privolitev-widget-table"
      table-header-class="cro-bg"
      :rows="actionData"
      :columns="columns"
      :visibleColumns="visibleColumns"
      :virtual-scroll="true"
      hide-bottom
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="VrstaSoglasja" :props="props" style="width: 120px">
            <q-select
              :dense="true"
              :options-dense="true"
              outlined
              v-model="props.row.vrstaSoglasja"
              :options="vrsteSoglasij"
              option-value="id"
              option-label="desc"
              emit-value
              map-options
            />
          </q-td>
          <q-td key="GDPRKanali" :props="props">
            <div>
              <q-checkbox color="cro-green" size="xs" v-model="addNT" label="Neposredno trženje" />
              <q-checkbox
                color="cro-green"
                size="xs"
                v-model="addPOSPAR"
                label="Poslovni partnerji"
              />
            </div>
          </q-td>
          <q-td key="Dokazilo" :props="props" class="contact_td" style="width: 109px">
            <q-file
              :dense="true"
              :options-dense="true"
              outlined
              v-model="actionData[0].file"
              :label="$t('prebrskaj')"
              accept=".png, .jpeg, .jpg, .pdf, .docx"
              :disable="props.row.vrstaSoglasja === null"
              style="max-width: 115px"
            />
          </q-td>
          <q-td key="Action" style="width: 60px">
            <q-btn
              class="add-soglasje-btn"
              color="cro-green"
              text-color="white"
              :label="$t('nalozi')"
              no-caps
              :disable="
                actionData[0].file === null
                  ? props.row.vrstaSoglasja === '2'
                    ? false
                    : true
                  : false
              "
              @click="actionType === 'add' ? (privolitveKontaktDialog = true) : privolitevAction()"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog
      v-model="privolitveKontaktDialog"
      transition-show="slide-up"
      transition-hide="slide-up"
      @hide="
        (evt) => {
          closeKontaktDialog()
        }
      "
    >
      <q-card
        class="bg-white"
        style="width: 750px; max-width: 90vw; min-width: 750px; padding-bottom: 25px"
      >
        <q-bar class="bg-cro-green">
          Vpiši kontakt privolitve
          <q-space />
          <q-btn flat icon="close" class="close-btn" @click="closeKontaktDialog">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div class="q-pa-md row" v-if="actionData[0].vrstaSoglasja !== '2'">
            <div class="kontakt-field col-6" v-if="actionData[0].vrstaSoglasja !== '2'">
              <div class="kontakt-title">Telefonska številka</div>
              <div class="kontakt-value phone">
                <VueTelInput
                  v-model="telefonskaStevilka"
                  defaultCountry="SI"
                  :inputOptions="{ showDialCode: true }"
                  @input="updateTelefonska"
                />
              </div>
            </div>
          </div>
          <div class="q-pa-md row">
            <div class="kontakt-field left col-5">
              <div class="kontakt-title">E-mail</div>
              <div class="kontakt-value">
                <q-input
                  :class="{ blur: emailBlur, unchecked: emailUnchecked, checked: emailChecked }"
                  :dense="true"
                  outlined
                  type="email"
                  @focus="(input) => (emailBlur = false)"
                  @change="(input) => changeEmail(input)"
                  @cut.prevent
                  @copy.prevent
                  @paste.prevent
                  v-model="email"
                />
              </div>
            </div>
            <div class="kontakt-field center col-5">
              <div class="kontakt-title">Potrdi e-mail</div>
              <div class="kontakt-value">
                <q-input
                  :class="{ unchecked: emailConfirmUnchecked, checked: emailConfirmChecked }"
                  :dense="true"
                  outlined
                  type="email"
                  :disable="email === ''"
                  @focus="(input) => (emailBlur = true)"
                  @change="(input) => changeEmailConfirm(input)"
                  @cut.prevent
                  @copy.prevent
                  @paste.prevent
                  v-model="emailConfirm"
                />
              </div>
            </div>
            <div class="kontakt-field right col-2">
              <div class="kontakt-title"></div>
              <div class="kontakt-value">
                <q-btn
                  v-if="!emailOk"
                  :class="emailUnchecked && emailConfirmUnchecked ? 'active' : ''"
                  id="check-btn"
                  size="12px"
                  :color="emailUnchecked && emailConfirmUnchecked ? '#FFF0F2' : 'white'"
                  :disable="!emailUnchecked || !emailConfirmUnchecked"
                  @click="preveriEmail"
                  text-color="cro"
                >
                  {{ $t('preveri') }}
                </q-btn>
                <q-icon class="status-icon" name="check" v-else />
              </div>
            </div>
          </div>
          <div class="q-pa-md row justify-end">
            <q-btn
              id="save-kontakt-btn"
              size="12px"
              color="cro-green"
              text-color="white"
              :disable="!emailOk && !telefonskaOk"
              @click="privolitevAction"
            >
              {{ $t('shrani') }}
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

export default {
  name: 'WPrivolitveAction',
  components: {
    VueTelInput,
  },

  props: {
    actionType: {
      type: String,
      required: true,
    },
    KDST: {
      type: String,
      required: true,
    },
    EZSO: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      pagination: {
        rowsPerPage: 0,
      },

      vrsteSoglasij: [
        {
          desc: 'GDPR',
          id: '1',
        },
        {
          desc: 'E-soglasje',
          id: '2',
        },
      ],

      gdprKanali: [
        {
          desc: 'Neposredno trženje',
          id: '1',
        },
        {
          desc: 'Poslovni partnerji',
          id: '2',
        },
      ],

      actionData: [
        {
          vrstaSoglasja: null,
          file: null,
        },
      ],

      acceptExtensions: '*',
      privolitveKontaktDialog: false,
      telefonskaStevilka: null,
      telefonskaStevilkaFormat: null,
      telefonskaOk: false,
      email: '',
      emailConfirm: '',
      emailBlur: false,
      emailUnchecked: false,
      emailChecked: false,
      emailConfirmUnchecked: false,
      emailConfirmChecked: false,
      emailOk: false,
      translations: {
        phoneNumberLabel: 'Telefonska številka',
      },

      columns: [
        {
          name: 'VrstaSoglasja',
          required: false,
          label: 'Privolitev',
          tooltip: '',
          align: 'left',
          sortable: false,
          style: 'width: 120px',
        },
        {
          name: 'GDPRKanali',
          required: false,
          label: 'Vrsta privolitve',
          tooltip: '',
          align: 'left',
          sortable: false,
          style: 'width: 150px',
        },
        {
          name: 'Dokazilo',
          required: false,
          label: 'Dokazilo',
          tooltip: '',
          align: 'left',
          sortable: false,
          style: 'width: 109px',
        },
        {
          name: 'Action',
          required: false,
          label: '',
          tooltip: '',
          align: 'left',
          sortable: false,
          style: 'width: 60px',
        },
      ],

      visibleColumns: ['VrstaSoglasja', 'Dokazilo', 'Action'],

      addNT: false,
      addPOSPAR: false,
    }
  },

  methods: {
    updateTelefonska(value) {
      this.telefonskaStevilka = value
      this.telefonskaOk = !!value
    },

    privolitevAction() {
      // Data validation
      if (this.actionData[0].vrstaSoglasja === null) {
        this.$noty.error(this.$t('vrsta_soglasja_null'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      if (this.actionData[0].file === null && this.actionData[0].vrstaSoglasja !== '2') {
        this.$noty.error(this.$t('file_null'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      var telefonska = ''
      var email = ''

      if (this.actionType === 'add') {
        if (
          this.telefonskaStevilkaFormat !== null &&
          this.telefonskaStevilkaFormat.hasOwnProperty('phoneNumber')
        ) {
          if (!this.telefonskaStevilkaFormat.isValid) {
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
            return false
          }
        }

        if (!this.telefonskaOk && !this.emailOk) {
          this.$noty.error('Kontaktni podatek je obvezen podatek pri dodajanju privolitve!.', {
            killer: true,
            timeout: 5000,
            closeWith: ['click'],
            layout: 'bottomCenter',
            theme: 'metroui',
          })
          return false
        }

        if (!this.emailOk && (this.email !== '' || this.emailConfirm !== '')) {
          this.$noty.error('Vhodni niz podatkov ne vsebuje pravilno vnešenega e-mail naslova.', {
            killer: true,
            timeout: 5000,
            closeWith: ['click'],
            layout: 'bottomCenter',
            theme: 'metroui',
          })
          return false
        }

        if (this.telefonskaOk) {
          telefonska = this.telefonskaStevilkaFormat.phoneNumber
        }

        if (this.emailOk) {
          email = this.email
        }
      }

      let apiFunction = this.actionType === 'add' ? 'PrivolitevAdd' : 'PrivolitevCancel'
      let formData = new FormData()

      formData.append('EZSO', this.EZSO)
      formData.append('Telefonska', telefonska)
      formData.append('Email', email)
      formData.append('KonsolidacijskaDavcnaStevilka', this.KDST)
      formData.append('VrstaSoglasja', this.actionData[0].vrstaSoglasja)
      formData.append('NT', this.addNT)
      formData.append('POSPAR', this.addPOSPAR)
      formData.append('VrstaSoglasja', this.actionData[0].vrstaSoglasja)
      formData.append('File', !this.actionData[0].file ? [] : this.actionData[0].file[0])

      this.$q.loading.show()
      this.api
        .post(apiFunction, formData)
        .then((result) => {
          this.$q.loading.hide()
          this.refreshToken(result.data.token)
          this.$emit('setResponse', result.data)

          if (result.data.success === true) {
            this.closeKontaktDialog()
            this.$emit('filterPrivolitve')

            this.actionData = [
              {
                vrstaSoglasja: null,
                file: null,
              },
            ]

            this.$noty.success(this.$t(this.actionType + '_privolitev_success'), {
              killer: true,
              timeout: 2000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
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
    refreshToken(token) {
      localStorage.setItem('jwt', token)
      this.token = token
      // this.userData = this.jwt.decode(token, process.env.VUE_APP_JWT_TOKEN)
    },
    changeEmailConfirm(input) {
      this.emailChecked = false
      this.emailConfirmChecked = false
      this.emailOk = false
      this.emailBlur = false
      if (input !== '') {
        this.emailConfirmUnchecked = true
      } else {
        this.emailConfirmUnchecked = false
      }
    },
    changeEmail(input) {
      this.emailChecked = false
      this.emailConfirmChecked = false
      this.emailOk = false
      if (input !== '') {
        this.emailUnchecked = true
      } else {
        this.emailUnchecked = false
      }
    },
    preveriEmail() {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (this.email !== this.emailConfirm) {
        this.$noty.error('Vnešena e-mail naslova se ne ujemata.', {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
      } else if (!re.test(this.email)) {
        this.$noty.error('E-mail naslov ima neveljavno obliko.', {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
      } else {
        this.emailOk = true
        this.emailChecked = true
        this.emailConfirmChecked = true
      }
    },
    updateTelefonska(event) {
      this.telefonskaStevilkaFormat = event
      this.telefonskaOk = this.telefonskaStevilkaFormat.isValid
    },

    closeKontaktDialog() {
      this.privolitveKontaktDialog = false
      this.telefonskaStevilka = null
      this.telefonskaStevilkaFormat = null
      this.telefonskaOk = false
      this.email = ''
      this.emailConfirm = ''
      this.emailBlur = false
      this.emailUnchecked = false
      this.emailChecked = false
      this.emailConfirmUnchecked = false
      this.emailConfirmChecked = false
      this.emailOk = false
    },
  },

  watch: {
    'actionData.0.vrstaSoglasja': function (newVal) {
      if (newVal === '1') {
        this.visibleColumns.push('GDPRKanali')
      } else {
        this.visibleColumns = this.visibleColumns.filter((e) => e !== 'GDPRKanali')
      }
    },
  },
}
</script>

<style>
.table-title {
  margin: 25px 0px 15px 0px;
  margin-bottom: 10px !important;
  font-weight: bold;
}

.table-title .title-status-icon {
  font-size: 18px;
  display: inline-flex;
  vertical-align: middle;
}

.table-title .title-div {
  display: inline-flex;
  padding: 0px 0px 0px 5px;
}

#new-privolitev-widget-table .q-table {
  position: absolute;
}

#new-privolitev-widget-table {
  height: 80px;
}

#new-privolitev-widget-table td label {
  margin-top: 0px;
}

#new-privolitev-widget-table .q-field,
#new-privolitev-widget-table .q-btn {
  font-size: 12px !important;
  height: 30px;
}

#new-privolitev-widget-table .q-field--dense .q-field__control,
#new-privolitev-widget-table .q-field--dense .q-field__marginal,
#new-privolitev-widget-table .q-field--auto-height.q-field--dense .q-field__control,
#new-privolitev-widget-table .q-field--auto-height.q-field--dense .q-field__native {
  min-height: 30px;
  height: 30px;
  line-height: 18px;
}

.small-table {
  width: 360px;
}

.large-table {
  width: 620px;
}

.fs-file-selector,
.fs-droppable {
  display: initial !important;
}

.update-btn.q-btn,
.add-soglasje-btn.q-btn {
  font-size: 12px !important;
  box-shadow: none !important;
  border: 1px solid #c2c2c2;
  padding: 0px 15px;
  text-transform: none;
  min-height: 2.2em !important;
  cursor: pointer;
}

.update-btn.q-btn .q-icon {
  font-size: 1.2em !important;
  margin-right: 5px !important;
}

.filename-text {
  cursor: pointer;
}

.kontakt-field {
  margin-top: 15px;
  border: 1px solid rgba(0, 0, 0, 0.24);
}

.kontakt-field.left {
  border-right: none;
}

.kontakt-field.right {
  border-left: none;
}

.kontakt-field.center {
  border-right: none;
  border-left: none;
}

.kontakt-field .kontakt-title {
  height: 35px;
  background-color: #f5f5f5;
  color: #616161;
  padding: 10px;
}

.kontakt-field .kontakt-value {
  height: 40px;
}

.kontakt-field .kontakt-value.phone {
  height: 48px;
}

.kontakt-field .kontakt-value .vue-phone-number-input {
  border: 1px solid rgba(0, 0, 0, 0.24);
  height: 28.74px !important;
  -webkit-box-sizing: content-box;
  margin: 8px 10px;
}

.kontakt-field .kontakt-value .vue-phone-number-input .country-selector__toggle__arrow {
  width: 16px;
  height: 16px;
}

.kontakt-field .kontakt-value .q-field--dense .q-field__control {
  height: 30px;
  border-radius: 0px;
}

.kontakt-field .kontakt-value .q-input {
  margin: 8px 10px 0px 10px;
}

.kontakt-field .kontakt-value .q-input.blur {
  -webkit-filter: blur(5px);
  filter: blur(5px);
}

.kontakt-field .kontakt-value .q-input.unchecked {
  background-color: #fff0f2;
}

.kontakt-field .kontakt-value .q-input.checked {
  background-color: #ecf1f0;
}

.kontakt-field .kontakt-value #check-btn {
  min-height: 28px;
  margin-top: 8px;
  margin-left: 25px;
  text-transform: initial;
}

.kontakt-field .kontakt-value #check-btn.active {
  background-color: #fff0f2;
  color: #c10013;
}

.kontakt-field .kontakt-value .status-icon {
  margin-top: 13px;
  margin-left: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #3da183;
}

#save-kontakt-btn {
  text-transform: initial;
}
</style>

<style lang="sass">
.sticky-header-table
  max height is important
  .q-table__middle
    max-height: 100%

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
    z-index: unset

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>

<style lang="sass">
.sticky-header-table
  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #f5f5f5

  div.q-table__middle.scroll.cro-bg table.q-table thead tr.cro-bg th.text-left.sortable.sorted i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left,
  div.q-table__middle.scroll.cro-bg table.q-table thead tr.cro-bg th.text-left.sortable i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left
    color: #3CA082

.sticky-header-table.selected
  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #d5e5e1

  div.q-table__middle.scroll table.q-table thead tr th.text-left.sortable.sorted i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left
  div.q-table__middle.scroll table.q-table thead tr th.text-left.sortable i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left
    color: #3CA082
</style>

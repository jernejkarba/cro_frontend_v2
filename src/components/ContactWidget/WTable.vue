<template>
  <div>
    <div class="col" id="table-title" v-if="data.length > 0">
      {{ this.data[0].NazivOsebe }}
    </div>
    <div class="empty-div" v-else />
    <div class="col" id="table-subtitle" v-if="KDST !== ''">
      Kon. dav. št.: <span style="cursor: pointer">{{ this.KDST }}</span>
      <q-popup-proxy>
        <q-banner>
          <div style="padding: 5px 5px 0px 0px; cursor: pointer" @click="$emit('filterKDST')">
            Kopiraj v filter
          </div>
          <div style="padding: 5px 5px 5px 0px; cursor: pointer" @click="$emit('setKDSTNew')">
            Kopiraj v okno za dodajanje kontaktov
          </div>
        </q-banner>
      </q-popup-proxy>
    </div>

    <q-table
      class="sticky-header-table"
      id="contact-widget-table"
      table-header-class="cro-bg"
      title=""
      :virtual-scroll="true"
      :table-style="'height: ' + (data.length + 1) * 41 + 'px'"
      :rows="data"
      :columns="columns"
      :loading="loading"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      hide-bottom
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr
          :props="props"
          :id="props.row.ID"
          :class="editableContacts.some((e) => e.ID === props.row.ID) ? 'editable' : ''"
        >
          <q-td key="EZSO" :props="props" style="cursor: pointer">
            {{ props.row.EZSO }}
            <q-popup-proxy>
              <q-banner>
                <div
                  style="padding: 5px 5px 0px 0px; cursor: pointer"
                  @click="$emit('filterEZSO', props.row.EZSO)"
                >
                  Kopiraj v filter
                </div>
                <div
                  style="padding: 5px 5px 5px 0px; cursor: pointer"
                  @click="$emit('setEZSONew', props.row.EZSO)"
                >
                  Kopiraj v okno za dodajanje kontaktov
                </div>
              </q-banner>
            </q-popup-proxy>
          </q-td>
          <q-td key="Tip" class="link_filter" :props="props">
            <q-icon
              class="contact_type_icon"
              name="call"
              size="15px"
              style="color: #a5a5a5; margin-right: 5px"
              v-if="props.row.IDTipa === '100' || props.row.IDTipa === '102'"
            />
            <q-icon
              class="contact_type_icon"
              name="smartphone"
              size="15px"
              style="color: #a5a5a5; margin-right: 5px"
              v-if="props.row.IDTipa === '101'"
            />
            <q-icon
              class="contact_type_icon"
              name="mail_outline"
              size="15px"
              style="color: #a5a5a5; margin-right: 5px"
              v-if="props.row.IDTipa === '300' || props.row.IDTipa === '301'"
            />
            <q-tooltip>
              {{ props.row.TipNaziv }}
            </q-tooltip>
          </q-td>
          <q-td key="Kontakt" class="contact_td" :props="props">
            <VueTelInput
              v-model="props.row.Kontakt"
              :default-country="
                props.row.TrenutniKontakt.charAt(0) === '+' &&
                props.row.TrenutniKontakt.substring(0, 4) != '+386'
                  ? ''
                  : 'SI'
              "
              :disabled="editableContacts.some((e) => e.ID === props.row.ID) ? false : true"
              autofocus="true"
              validCharactersOnly="true"
              :inputOptions="telInputOptions"
              v-if="
                props.row.IDTipa === '100' ||
                props.row.IDTipa === '101' ||
                props.row.IDTipa === '102'
              "
            />
            <q-input
              v-else
              class="email-input"
              :dense="true"
              style="color: #000000"
              :disable="editableContacts.some((e) => e.ID === props.row.ID) ? false : true"
              v-model="props.row.Kontakt"
            />

            <!-- icon for cancel contact -->
            <q-icon
              class="edit_icon"
              name="cancel"
              size="20px"
              style="color: #a5a5a5; margin-right: 5px; cursor: pointer"
              @click="closeContact(props.row.ID)"
              v-if="
                props.row.Vir === '10' &&
                editableContacts.some((e) => e.ID === props.row.ID) &&
                this.$user_data.pravice['kac_kontakti'] === 'T'
              "
            />

            <!-- icon for save contact -->
            <q-icon
              class="edit_icon"
              name="check_circle"
              size="20px"
              style="margin-right: 5px; cursor: pointer"
              @click="editContact(props.row)"
              v-if="
                props.row.Vir === '10' &&
                editableContacts.some((e) => e.ID === props.row.ID) &&
                this.$user_data.pravice['kac_kontakti'] === 'T'
              "
            />
            <!-- icon for edit contact -->
            <q-icon
              class="edit_icon"
              name="edit"
              size="15px"
              style="color: #000000; margin-right: 5px; cursor: pointer"
              @click="openContact(props.row)"
              v-if="
                props.row.Vir === '10' &&
                !editableContacts.some((e) => e.ID === props.row.ID) &&
                this.$user_data.pravice['kac_kontakti'] === 'T'
              "
            />
            <!-- icon for lock contact -->
            <q-icon
              class="edit_icon"
              name="lock"
              size="15px"
              style="color: #a5a5a5; margin-right: 5px"
              v-if="props.row.Vir !== '10'"
            />

            <!-- icon for contact warning -->
            <q-icon
              class="edit_icon"
              name="error_outline"
              size="20px"
              style="color: #c10013; margin-right: 5px"
              v-if="
                props.row.KontaktOK !== '1' && !editableContacts.some((e) => e.ID === props.row.ID)
              "
            >
              <q-tooltip>
                Vhodni niz ne vsebuje pravilno vnešene telefonske številke glede na veljavna
                pravila.
              </q-tooltip>
            </q-icon>

            <q-icon
              class="edit_icon"
              name="error_outline"
              size="20px"
              style="color: #c10013; margin-right: 5px"
              v-else-if="
                (props.row.IDTipa === '100' ||
                  props.row.IDTipa === '101' ||
                  props.row.IDTipa === '102') &&
                props.row.TipTelStKontrola === null
              "
            >
              <q-tooltip>
                Vhodni niz ne vsebuje veljavno vnešene telefonske številke za Slovenijo.
              </q-tooltip>
            </q-icon>

            <q-icon
              class="edit_icon"
              name="error_outline"
              size="20px"
              style="color: #c10013; margin-right: 5px"
              v-else-if="
                (props.row.IDTipa === '100' ||
                  props.row.IDTipa === '101' ||
                  props.row.IDTipa === '102') &&
                props.row.TelStKodaDrzave === null
              "
            >
              <q-tooltip>
                Vhodni niz ne vsebuje telefonsko številko z mednarodno kodno števlko države.
              </q-tooltip>
            </q-icon>
          </q-td>
          <q-td key="Vir" class="link_filter" :props="props">
            <span
              id="kac-icon"
              style="margin-left: 0px; border-color: #000000"
              v-if="props.row.Vir === '10'"
            >
              KAC
            </span>

            <span v-else>
              {{ props.row.VirNaziv }}
            </span>

            <!-- icon for delete contact -->
            <q-icon
              class="delete-icon far fa-trash-alt"
              size="16px"
              :style="
                props.row.Vir !== '12' && props.row.Vir !== '5' ? 'color:#000000;' : 'color:#A5A5A5'
              "
              v-if="this.$user_data.pravice['kac_kontakti'] === 'T'"
              @click="
                props.row.Vir !== '12' && props.row.Vir !== '5'
                  ? (props.row.Confirm = true)
                  : (props.row.confirm = false)
              "
            />

            <q-dialog v-model="props.row.Confirm" persistent>
              <q-card style="padding: 15px">
                <q-card-section class="row items-center">
                  <q-avatar icon="priority_high" color="cro-green" text-color="white" />
                  <span class="q-ml-sm"
                    >Ste prepričani, da želite izbrisati kontaktni podatek za EZŠO
                    <b>{{ props.row.EZSO }}</b></span
                  >
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Prekliči" color="cro" v-close-popup />
                  <q-btn label="Izbriši" color="cro-green" @click="deleteContact(props.row)" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

export default {
  name: 'WTable',
  components: {
    VueTelInput,
  },

  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    KDST: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      pagination: {
        rowsPerPage: 10,
      },
      editableContacts: [],
      columns: [
        {
          name: 'EZSO',
          required: false,
          label: 'EZŠO',
          tooltip: '',
          align: 'left',
          field: 'EZSO',
          sortable: true,
          style: 'width: 40px',
        },
        {
          name: 'Tip',
          required: false,
          label: 'Tip',
          tooltip: '',
          align: 'center',
          field: 'TIP',
          sortable: true,
          style: 'width: 40px',
        },
        {
          name: 'Kontakt',
          required: false,
          label: 'Kontakt',
          tooltip: '',
          align: 'left',
          field: 'KONTAKT',
          sortable: true,
          style: 'width: 180px',
        },
        {
          name: 'Vir',
          required: false,
          label: 'Vir',
          tooltip: '',
          align: 'left',
          field: 'VIR',
          sortable: true,
          style: 'width: 60px',
        },
      ],

      telInputOptions: {
        placeholder: 'Telefonska številka',
      },
    }
  },

  methods: {
    updateTelefonska(value) {
      this.telefonskaStevilka = value
      this.telefonskaOk = !!value
    },

    openContact(row) {
      this.editableContacts = []
      this.editableContacts.push(row)
    },

    saveContact(row) {
      this.$q.loading.show()

      if (row.IDTipa === '100' || row.IDTipa === '101' || row.IDTipa === '102') {
        this.api
          .post('Preveritelefonsko', {
            TelefonskaStevilka: row.Kontakt,
          })
          .then((result) => {
            this.setResponse(result.data)
            this.$q.loading.hide()

            if (result.data.success === true) {
              this.editContact(row)
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
      } else {
        this.editContact(row)
      }

      this.editableContacts.push(row)
    },

    editContact(row) {
      this.api
        .post('KontaktniPodatkiEdit', {
          ...row,
          TelefonskaStevilka: row.Kontakt,
        })
        .then((result) => {
          this.$q.loading.hide()
          this.$emit('setResponse', result.data)

          if (result.data.success === true) {
            this.closeContact(row.ID)
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

    deleteContact(row) {
      row.confirm = false
      this.api
        .post('KontaktniPodatkiRemove', {
          ...row,
          Kontakt: row.TrenutniKontakt,
        })
        .then((result) => {
          this.$q.loading.hide()
          this.$emit('setResponse', result.data)

          if (result.data.success === true) {
            this.closeContact(row.ID)
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

    closeContact(id) {
      this.editableContacts = this.editableContacts.filter(function (el) {
        return el.ID !== id
      })
      this.$emit('filterContacts')
    },
  },
}
</script>

<style>
#table-title {
  margin-bottom: 0px !important;
  font-weight: bold;
}

#table-subtitle {
  font-size: 13px;
  margin-bottom: 15px;
}

#contact-widget-table .q-table {
  position: absolute;
}

#contact-widget-table tr td label {
  margin-top: 0px;
}

#contact-widget-table tr td .vue-tel-input {
  border: none;
  display: inline-flex;
}

.edit_icon {
  float: right;
  margin-top: 10px;
}

.delete-icon {
  float: right;
  margin-right: 5px;
  cursor: pointer;
}

.vue-phone-number-input {
  display: inline-flex !important;
}

.editable .contact_td,
.editable .vue-phone-number-input .select-country-container,
.editable
  .vue-phone-number-input
  .select-country-container
  .country-selector
  .country-selector__input,
.editable .vue-phone-number-input div .input-phone-number,
.editable .vue-phone-number-input div .input-phone-number .input-tel__input {
  background-color: #eaf2f0 !important;
}

.input-tel.is-disabled .input-tel__input,
.country-selector.is-disabled .country-selector__input {
  background-color: #ffffff !important;
}
.country-selector__input {
  width: 0px !important;
  height: 30px !important;
  min-height: 30px !important;
  padding-right: 0px !important;
  border: none !important;
  padding-left: 8px;
  box-shadow: none !important;
}

/*
  .country-selector__list {
    display: none;
  }
  */

.country-selector__input:hover,
.input-tel__input:hover,
.input-tel__input::before {
  background-color: #ffffff !important;
}

.q-table tbody td::before {
  background: rgba(0, 0, 0, 0);
}

.country-selector__country-flag {
  top: 14px !important;
  left: 0px !important;
}

.country-selector {
  height: 28px !important;
  min-height: 28px !important;
}

.country-selector__toggle {
  top: calc(50% - 5px) !important;
}

.input-tel__input {
  color: #000000;
  font-size: 12px !important;
  border: none !important;
  padding-top: 10px !important;
  padding-left: 0px !important;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell,
    Fira Sans, Droid Sans, Helvetica Neue, sans-serif !important;
  box-shadow: none !important;
  height: 30px !important;
  min-height: 30px !important;
}

#contact-widget-table .input-country-selector {
  margin-top: 6px;
}

#contact-widget-table .input-phone-number {
  max-height: 40px;
  padding-top: 6px;
}

.is-valid .input-tel__input {
  color: #3ca082;
}

.input-tel.is-disabled .input-tel__input {
  cursor: not-allowed;
  color: #000000 !important;
}

.country-selector__label,
.input-tel__label {
  display: none;
}

.vue-phone-number-input .select-country-container {
  width: 45px !important;
  min-width: 45px !important;
  max-width: 45px !important;
}

.disabled,
[disabled],
.q-field--disabled .q-field__control > div {
  opacity: 1 !important;
}

.email-input {
  font-size: 12px;
  display: inline-flex;
  width: 170px;
}

.email-input .q-field__control-container {
  height: unset !important;
}

.q-field--standard .q-field__control::before {
  border-bottom: none !important;
}

.contact_td .q-field__native {
  padding: 0px !important;
}

.q-field__control {
  color: #3ca082;
}

.text-body2 {
  font-size: 12px;
}

.empty-div {
  margin-top: 15px;
}

#new-contact-widget-table table tbody tr td label {
  margin-top: 0px;
}
</style>

<style lang="sass">
.sticky-header-table
  .q-table__middle
    max-height: 100%

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

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

  div.q-table__middle.scroll table.q-table thead tr th.text-left.sortable.sorted i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left,
  div.q-table__middle.scroll table.q-table thead tr th.text-left.sortable i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left
    color: #3CA082
</style>

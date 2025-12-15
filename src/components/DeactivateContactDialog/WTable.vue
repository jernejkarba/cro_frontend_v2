<template>
  <div>
    <h5 class="de-table-title">{{ this.$t('kontaktni_podatki') }}</h5>
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
          <q-td key="Kontakt" :props="props">
            {{ props.row.Kontakt }}
          </q-td>
          <q-td key="KDST" :props="props">
            {{ props.row.KDST_OSEBE }}
          </q-td>
          <q-td key="EZSO" :props="props">
            {{ props.row.EZSO }}
          </q-td>
          <q-td key="NazivOsebe" class="contact_td" :props="props">
            {{ props.row.NazivOsebe }}
          </q-td>
          <q-td key="DavcnaStevilka" :props="props">
            {{ props.row.DavcnaStevilka }}
          </q-td>
          <q-td key="Naslov" :props="props">
            {{ props.row.Naslov }}
          </q-td>
          <q-td key="File" :props="props">
            <file-selector
              accept-extensions="*"
              @validated="handleFilesValidated"
              @changed="handleFilesChanged"
            >
              <q-btn
                class="update-btn"
                color="white"
                text-color="black"
                icon="mdi-upload"
                :label="$t('prebrskaj')"
                @click="setRowData(props.row.ID, props.row.Kontakt)"
                no-caps
                v-if="props.row.file === null"
              />
              <div class="filename-text" v-else>
                {{ showFilename(props.row.file) }}
              </div>
            </file-selector>
          </q-td>
          <q-td key="Deaktivate" :props="props">
            <q-btn
              size="12px"
              :color="props.row.file === null ? 'white' : 'cro-red'"
              :text-color="props.row.file === null ? 'cro' : 'white'"
              no-caps
              :disable="props.row.file === null"
              :label="$t('deactivate')"
              @click="confirm = true"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="confirm" persistent>
      <q-card class="deactivate-confirm-dialog">
        <q-card-section class="row">
          <q-icon name="mdi-alert-circle" color="cro-red" size="2.5em" />
          <div class="q-ml-sm">
            <div class="deactivation-warning">
              {{ $t('confirm_deactivation') }}
            </div>
            <div class="kontakt-details-div" style="margin-top: 15px">
              <div>
                Kontakt:
                <b>{{
                  fileRowId !== null
                    ? this.data.filter((v) => v.ID === this.fileRowId)[0].Kontakt
                    : ''
                }}</b>
              </div>
              <div>
                KDŠT:
                {{
                  fileRowId !== null
                    ? this.data.filter((v) => v.ID === this.fileRowId)[0].KDST_OSEBE
                    : ''
                }}
              </div>
              <div>
                EZŠO:
                {{
                  fileRowId !== null ? this.data.filter((v) => v.ID === this.fileRowId)[0].EZSO : ''
                }}
              </div>
              <div>
                Naziv:
                {{
                  fileRowId !== null
                    ? this.data.filter((v) => v.ID === this.fileRowId)[0].NazivOsebe
                    : ''
                }}
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn size="12px" color="white" text-color="cro" :label="$t('cancel')" v-close-popup>
          </q-btn>

          <q-btn
            size="12px"
            color="cro-red"
            text-color="white"
            :label="$t('deactivate')"
            @click="deaktivate()"
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'WTable',

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
      phoneResults: null,

      fileRowId: null,
      fileRowContact: '',
      confirm: false,

      columns: [
        {
          name: 'Kontakt',
          required: false,
          label: 'Kontakt',
          tooltip: '',
          align: 'left',
          sortable: true,
        },
        {
          name: 'KDST',
          required: false,
          label: 'Kons. dav. št.',
          tooltip: '',
          align: 'left',
          sortable: true,
        },
        {
          name: 'EZSO',
          required: false,
          label: 'EZŠO',
          tooltip: '',
          align: 'left',
          sortable: true,
        },
        {
          name: 'NazivOsebe',
          required: false,
          label: 'Naziv',
          tooltip: '',
          align: 'left',
          sortable: true,
        },
        {
          name: 'DavcnaStevilka',
          required: false,
          label: 'Davčna št.',
          tooltip: '',
          align: 'left',
          sortable: true,
        },
        {
          name: 'Naslov',
          required: false,
          label: 'Naslov',
          tooltip: '',
          align: 'left',
          sortable: true,
        },
        {
          name: 'File',
          required: false,
          label: 'Dokazilo',
          tooltip: '',
          align: 'left',
          sortable: true,
        },
        {
          name: 'Deaktivate',
          required: false,
          label: 'Deaktiviraj',
          tooltip: '',
          align: 'center',
          sortable: true,
        },
      ],

      translations: {
        countrySelectorLabel: 'Country code',
        countrySelectorError: 'Choose country',
        phoneNumberLabel: 'Telefonska številka',
        example: 'Example:',
      },
    }
  },

  methods: {
    setRowData(id, contact) {
      this.fileRowId = id
      this.fileRowContact = contact
    },

    handleFilesValidated(result, files) {
      if (result === 'EXTENSION_ERROR') {
        this.handleFilesChanged(files)
      } else if (result !== true) {
        this.$noty.error(this.$t(result), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
      }
    },

    handleFilesChanged(files) {
      const fileArray = [...files]

      this.data.forEach((el) => {
        el.file = el.ID === this.fileRowId ? fileArray : null
        el.file = el.ID === this.fileRowId ? fileArray : null
      })
    },

    showFilename(file) {
      let filename = file[0].name

      if (filename.length > 15) {
        let extension = filename.split('.').pop()
        filename = filename.substr(0, 14) + '...' + extension
      }

      return filename
    },

    deaktivate() {
      const deactivateData = this.data.find((e) => e.ID === this.fileRowId)
      let formData = new FormData()

      formData.append('ID', deactivateData.ID)
      formData.append('EZSO', deactivateData.EZSO)
      formData.append('DavcnaSt', deactivateData.DavcnaStevilka)
      formData.append('IDTipa', deactivateData.IDTipa)
      formData.append('Kontakt', deactivateData.Kontakt)
      formData.append('Vir', deactivateData.Vir)
      formData.append('File', deactivateData.file[0])

      this.api
        .post('DeaktivacijaKontaktnihPodatkov', formData)
        .then((result) => {
          this.$q.loading.hide()
          this.confirm = false

          if (result.data.success === true) {
            this.$emit('filterContacts')

            this.$noty.success(this.$t('deaktivacija_success'), {
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

.edit_icon {
  float: right;
  margin-top: 12px;
}

.delete-icon {
  float: right;
  margin-right: 5px;
  cursor: pointer;
}

.country-selector__input:hover,
.input-tel__input:hover,
.input-tel__input::before {
  background-color: #ffffff !important;
}

.q-table tbody td::before {
  background: rgba(0, 0, 0, 0);
}

.is-valid .input-tel__input {
  color: #3ca082;
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

.kontakt-details-div div {
  padding: 2px 0px;
}

.deactivation-warning {
  padding: 10px;
  color: #d92531;
  font-weight: bold;
  background-color: #f9ebeb;
  border-radius: 10px;
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

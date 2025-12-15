<template>
  <div>
    <div class="col" id="table-title">Dodaj nov kontakt</div>

    <q-table
      class="sticky-header-table"
      id="new-contact-widget-table"
      table-header-class="cro-bg"
      :columns="columns"
      :rows="data"
      table-style="height: 82px"
      :virtual-scroll="true"
      hide-bottom
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="KonsolidacijskaDavcnaStevilka" :props="props" style="width: 120px">
            <q-input :dense="true" outlined v-model="props.row.KonsolidacijskaDavcnaStevilka" />
          </q-td>

          <q-td key="EZSO" :props="props" style="width: 120px">
            <q-input v-if="vsiEzsoji.length === 0" :dense="true" outlined v-model="props.row.EZSO">
            </q-input>
            <q-select v-else :dense="true" outlined v-model="props.row.EZSO" :options="vsiEzsoji">
              <template v-if="props.row.EZSO !== ''" v-slot:append>
                <q-icon
                  name="cancel"
                  @click.stop="props.row.EZSO = ''"
                  style="font-size: 16px"
                  class="cursor-pointer"
                />
              </template>
            </q-select>
          </q-td>

          <q-td key="Tip" :props="props" style="width: 150px">
            <q-select
              :dense="true"
              :options-dense="true"
              outlined
              v-model="props.row.Tip"
              :options="tipOptions"
              option-value="id"
              option-label="desc"
              emit-value
              map-options
            />
          </q-td>

          <q-td key="Kontakt" :props="props" class="contact_td" style="width: 250px">
            <VueTelInput
              v-if="props.row.Tip === '1'"
              v-model="props.row.TelefonskaStevilka"
              defaultCountry="SI"
              :inputOptions="{ showDialCode: true }"
              @update:model-value="props.row.TelefonskaStevilkaFormat = $event"
            />

            <q-input v-else :dense="true" outlined v-model="props.row.Email" />
          </q-td>
          <q-td key="Action">
            <!-- icon for warning -->
            <q-icon
              name="error_outline"
              size="20px"
              style="color: #c10013; margin-right: 5px"
              v-if="props.row.EZSO === ''"
            >
              <q-tooltip>
                Polje EZŠO je prazno. Dodajanje kontakta poteka prek Kon. dav. št.
              </q-tooltip>
            </q-icon>
            <q-btn
              color="white"
              text-color="black"
              label="+ Dodaj"
              no-caps
              @click="$emit('addContact')"
            />
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
  name: 'WNewContact',
  components: {
    VueTelInput,
  },

  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    vsiEzsoji: {
      type: Array,
      required: true,
    },
    visibleColumns: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      pagination: {
        rowsPerPage: 10,
      },

      tipOptions: [
        {
          desc: 'Telefonska številka',
          id: '1',
        },
        {
          desc: 'E-mail naslov',
          id: '2',
        },
      ],

      editableContacts: [],
      phoneResults: null,

      columns: [
        {
          name: 'KonsolidacijskaDavcnaStevilka',
          required: false,
          label: 'Kons. dav. št.',
          tooltip: '',
          align: 'left',
          field: 'KonsolidacijskaDavcnaStevilka',
          sortable: false,
          style: 'width: 40px',
        },
        {
          name: 'EZSO',
          required: false,
          label: 'EZŠO',
          tooltip: '',
          align: 'left',
          field: 'EZSO',
          sortable: false,
          style: 'width: 40px',
        },
        {
          name: 'Tip',
          required: false,
          label: 'Tip',
          tooltip: '',
          align: 'left',
          field: 'TIP',
          sortable: false,
          style: 'width: 40px',
        },
        {
          name: 'Kontakt',
          required: false,
          label: 'Kontakt',
          tooltip: '',
          align: 'left',
          field: 'KONTAKT',
          sortable: false,
          style: 'width: 180px',
        },
        {
          name: 'Action',
          required: false,
          label: '',
          tooltip: '',
          align: 'left',
          field: 'Action',
          sortable: false,
        },
      ],

      translations: {
        phoneNumberLabel: 'Telefonska številka',
      },
    }
  },

  methods: {
    updateTelefonska(value) {
      this.telefonskaStevilka = value
      this.telefonskaOk = !!value
    },
  },

  watch: {
    'data.Tip': function (newVal) {
      this.data.Kontakt = ''
    },
  },
}
</script>

<style>
#table-title {
  margin: 15px 0px;
  margin-bottom: 10px !important;
  font-weight: bold;
}

#new-contact-widget-table .q-table {
  position: absolute;
}

#new-contact-widget-table .q-field,
#new-contact-widget-table .q-btn {
  font-size: 12px !important;
  height: 30px;
}

#new-contact-widget-table .q-field--dense .q-field__control,
#new-contact-widget-table .q-field--dense .q-field__marginal,
#new-contact-widget-table .q-field--auto-height.q-field--dense .q-field__control,
#new-contact-widget-table .q-field--auto-height.q-field--dense .q-field__native {
  min-height: 30px;
  height: 30px;
  line-height: 18px;
}

.edit_icon {
  float: right;
  margin-top: 12px;
}

.edit_icon_email {
  float: right;
  margin-top: 3px;
}

.vue-phone-number-input {
  display: inline-flex !important;
}

#new-contact-widget-table .vue-phone-number-input {
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 5px;
  height: 28.74px !important;
  -webkit-box-sizing: content-box;
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
  width: 70px !important;
  height: 28px !important;
  min-height: 28px !important;
  padding-right: 0px !important;
  border: none !important;
  padding-left: 25px !important;
  padding-top: 0px !important;
  box-shadow: none !important;
  font-size: 12px !important;
}

.country-selector__input:hover,
.input-tel__input:hover,
.input-tel__input::before {
  background-color: #ffffff !important;
}

.q-table tbody td::before {
  background: rgba(0, 0, 0, 0);
}

.country-selector__country-flag {
  top: 9px !important;
  left: 0px !important;
}

.country-selector {
  height: 30px !important;
  min-height: 30px !important;
}

.country-selector__toggle {
  top: calc(50% - 9px) !important;
}

.country-selector.is-disabled .country-selector__input {
  color: #000000 !important;
}

.input-tel__input {
  color: #000000;
  font-size: 12px !important;
  border: none !important;
  padding-top: 0px !important;
  padding-left: 0px !important;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell,
    Fira Sans, Droid Sans, Helvetica Neue, sans-serif !important;
  box-shadow: none !important;
  height: 28px !important;
  min-height: 28px !important;
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
  width: 85px !important;
  min-width: 85px !important;
  max-width: 85px !important;
  padding-left: 12px;
}

.disabled,
[disabled] {
  opacity: 1 !important;
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

  div.q-table__middle.scroll table.q-table thead tr th.text-left.sortable.sorted i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left,
  div.q-table__middle.scroll table.q-table thead tr th.text-left.sortable i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left
    color: #3CA082
</style>

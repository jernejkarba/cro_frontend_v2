<template>
  <div class="q-pa-md">
    <div class="display-icon row justify-between">
      <div class="col-5 self-center">
        <div style="display: inline-block; margin: 25px 0px 10px 0px">
          <span class="table-title" v-if="config.type === 'basic'">
            {{ $t('fk_zadetki') }}
          </span>
          <span class="table-title" v-else>
            {{ $t('fk_izbrane_osebe') }}
          </span>
        </div>
      </div>
    </div>

    <q-table
      :class="
        loading
          ? 'sticky-header-table loading ' + config.type
          : 'sticky-header-table ' + config.type
      "
      :table-class="config.type === 'basic' ? 'cro-bg' : ''"
      :table-header-class="config.type === 'basic' ? 'cro-bg' : ''"
      :card-class="config.type === 'basic' ? 'cro-bg' : ''"
      title=""
      row-key="EZSO"
      selection="multiple"
      :table-style="
        config.type === 'basic'
          ? pagination.rowsPerPage === total
            ? 'max-height: 100%'
            : 'max-height: ' + pagination.rowsPerPage * 46 + expanded.length * 491 + 'px'
          : 'max-height: 100%'
      "
      :rows="data"
      :config="config"
      :loading="loading"
      :columns="columns"
      v-model:selected="selectedUsersLocal"
      v-model:pagination="pagination"
      v-model:expanded="expanded"
      :rows-per-page-options="[6]"
      :visible-columns="config.visibleColumns"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:header-cell="props">
        <q-th :key="props.col.name" :props="props">
          {{ props.col.label }}
          <q-tooltip
            anchor="bottom middle"
            self="center middle"
            :offset="[10, 10]"
            v-if="props.col.tooltip !== ''"
          >
            {{ props.col.tooltip }}
          </q-tooltip>
        </q-th>
      </template>

      <template v-slot:body="props">
        <q-tr
          :class="[
            visible ? 'show-table' : 'hide-table',
            highlighted.includes(props.row.EZSO) ? 'highlighted' : '',
            props.selected && config.type == 'selected' ? 'highlighted' : '',
            props.row.DtSmrti !== null && props.row.DtSmrti !== '' ? 'death' : '',
          ]"
          :props="props"
          :key="props.row.EZSO"
          :id="props.row.EZSO"
        >
          <q-td>
            <q-checkbox
              color="cro-green"
              :model-value="props.selected"
              @update:model-value="val => props.selected = val"
            />
          </q-td>
          <q-td key="arrow" :props="props">
            <q-icon
              class="move-arrow"
              name="arrow_downward"
              v-if="config.type === 'basic'"
              @click="
                $emit('selectUser', {
                  user: props.row,
                  pagination: { ...pagination },
                  selectedUsers: [...selectedUsers],
                })
              "
            />
            <q-icon
              class="move-arrow"
              name="arrow_upward"
              v-else
              @click="$emit('clearUser', props.row)"
            />
          </q-td>
          <q-td key="KonsolidacijskaDavcnaStevilka" class="link_filter" :props="props">
            <div
              class="inline"
              @click="
                moveFilter(
                  config.type,
                  'KonsolidacijskaDavcnaStevilka',
                  props.row.KonsolidacijskaDavcnaStevilka
                )
              "
            >
              {{ props.row.KonsolidacijskaDavcnaStevilka }}
            </div>
            <div class="inline" v-if="props.row.KonsolidacijskaDavcnaStevilka !== null">
              <q-icon
                class="move-arrow cons-arrow"
                :name="
                  props.row.DtSmrti !== null && props.row.DtSmrti !== ''
                    ? 'img:kons_arrow_down_gray.svg'
                    : 'img:kons_arrow_down.svg'
                "
                v-if="config.type === 'basic' && props.row.KonsolidacijskaDavcnaStevilka != ''"
                @click="selectedUsersKons(props.row.KonsolidacijskaDavcnaStevilka)"
              />
              <q-icon
                class="move-arrow cons-arrow"
                :name="
                  props.row.DtSmrti !== null && props.row.DtSmrti !== ''
                    ? 'img:kons_arrow_up_gray.svg'
                    : 'img:kons_arrow_up.svg'
                "
                v-if="config.type === 'selected' && props.row.KonsolidacijskaDavcnaStevilka != ''"
                @click="clearSelectedUsersKons(props.row.KonsolidacijskaDavcnaStevilka)"
              />
            </div>
          </q-td>
          <q-td
            key="StopnjaZaupanja"
            class="link_filter"
            :props="props"
            @click="moveFilter(config.type, 'StopnjaZaupanja', props.row.StopnjaZaupanja)"
          >
            {{ props.row.StopnjaZaupanja }}
          </q-td>
          <q-td key="EZSO" class="link_filter" :props="props">
            <span
              style="padding-right: 20px"
              @click="moveFilter(config.type, 'EZSO', props.row.EZSO)"
            >
              {{ props.row.EZSO }}
            </span>
          </q-td>
          <q-td key="NazivOsebe" class="link_filter" :props="props">
            <span
              @click="moveFilter(config.type, 'NazivOsebe', props.row.NazivOsebe)"
              style="margin-right: 25px"
            >
              {{ props.row.NazivOsebe }}
            </span>
          </q-td>
          <q-td
            key="DavcnaStevilka"
            class="link_filter"
            :props="props"
            @click="moveFilter(config.type, 'DavcnaStevilka', props.row.DavcnaStevilka)"
          >
            {{ props.row.DavcnaStevilka }}
          </q-td>
          <q-td key="StopnjaPravilnosti" :props="props">
            {{ props.row.StopnjaPravilnosti }}
          </q-td>
          <q-td
            key="EMSO"
            class="link_filter"
            :props="props"
            @click="moveFilter(config.type, 'EMSO', props.row.EMSO)"
          >
            {{ props.row.EMSO }}
          </q-td>
          <q-td key="DtRojstva" class="link_filter" :props="props">
            {{ props.row.DtRojstva }}
            <q-icon
              class="death-icon"
              name="img:cross_gray.svg"
              v-if="props.row.DtSmrti !== null && props.row.DtSmrti !== ''"
            >
            </q-icon>
            <q-tooltip v-if="props.row.DtSmrti !== null && props.row.DtSmrti !== ''">
              Datum smrti: <br />
              {{ props.row.DtSmrti }}
            </q-tooltip>
          </q-td>
          <q-td key="Naslov" class="link_filter" :props="props">
            {{
              props.row.Drzava.toUpperCase() === 'SLOVENIJA' ||
              props.row.Drzava === '' ||
              props.row.Drzava === null
                ? props.row.Naslov + '; ' + props.row.PostaSt + ' ' + props.row.Posta
                : props.row.Naslov + '; 0000 ' + props.row.Posta
            }}

            <q-icon name="done" v-if="props.row.UradniStalniNaslov !== null">
              <q-tooltip>
                Uradni stalni naslov: <br />
                {{ props.row.UradniStalniNaslov }}
              </q-tooltip>
            </q-icon>
          </q-td>
          <q-td key="VrstaOsebe" class="link_filter" :props="props">
            {{ props.row.VrstaOsebe }}
          </q-td>
          <q-td key="Sts" class="link_filter" :props="props">
            {{ props.row.StatusKratko }}
          </q-td>
        </q-tr>
        <q-tr class="details" v-show="props.expand" :props="props">
          <q-td colspan="100%" class="user-details-td"> </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom>
        <div class="full-width row items-center">
          <div class="col">
            <span class="table-footer-text" style="display: inline-block">
              <span v-if="config.type === 'basic'">
                {{ $t('ut_izbranih') }} {{ `${selectedUsers.length}/${total}` }}
              </span>
              <span v-else>
                {{ $t('ut_izbranih') }} {{ `${selectedUsers.length}/${data.length}` }}
              </span>
            </span>
            <div v-if="config.type === 'basic'" style="display: inline-block">
              <q-btn
                no-caps
                color="white"
                text-color="cro"
                icon="arrow_downward"
                :label="$t('ut_move_to')"
                size="12px"
                v-if="selectedUsers.length > 0"
                @click="moveSelectedUsers"
              />
            </div>
            <div v-else style="display: inline-block">
              <q-btn
                no-caps
                color="white"
                text-color="cro"
                icon="arrow_upward"
                :label="$t('ut_remove_from')"
                size="12px"
                v-if="selectedUsers.length > 0"
                @click="clearSelectedUsers"
              />
            </div>
          </div>

          <div class="col">
            <q-pagination
              class="flex flex-center"
              color="cro"
              v-model="pagination.page"
              v-if="config.type === 'basic'"
              :max="total != null ? Math.ceil(total / pagination.rowsPerPage) : 0"
              :max-pages="6"
              :boundary-numbers="true"
              :direction-links="true"
              @update:model-value="onPageSwitch"
            >
            </q-pagination>
          </div>

          <div class="col"></div>
        </div>
      </template>

      <template v-slot:no-data>
        <div class="full-width row">
          <span> {{ $t('ut_izbranih') }}: 0/0 </span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'usersTable',

  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    fullData: {
      type: Array,
      required: false,
      default: () => [],
    },
    total: {
      type: Number,
      required: false,
      default: 0,
    },
    config: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectedUsers: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      visible: true,
      expanded: [],
      selectedUsersLocal: Array.isArray(this.selectedUsers) ? [...this.selectedUsers] : [],

      filter: '',
      highlighted: [],

      columns: [
        {
          name: 'arrow',
          required: false,
          label: '',
          tooltip: '',
          align: 'middle',
          field: 'arrow',
          sortable: false,
          style: 'width: 56px',
        },
        {
          name: 'KonsolidacijskaDavcnaStevilka',
          required: false,
          label: this.$t('fk_davcna_kon'),
          tooltip: '',
          align: 'left',
          field: 'KonsolidacijskaDavcnaStevilka',
          sortable: true,
          style: 'width: 110px',
        },
        {
          name: 'StopnjaZaupanja',
          required: false,
          label: this.$t('fk_stopnja_zaupanja_short'),
          tooltip: this.$t('stopnja_zaupanja_hint'),
          align: 'left',
          field: 'StopnjaZaupanja',
          sortable: true,
          style: 'width: 30px',
        },
        {
          name: 'EZSO',
          required: false,
          label: this.$t('id'),
          tooltip: '',
          align: 'left',
          field: 'EZSO',
          sortable: true,
          style: 'width: 90px',
        },
        {
          name: 'NazivOsebe',
          required: false,
          label: this.$t('fk_naziv_osebe'),
          tooltip: '',
          align: 'left',
          field: 'NazivOsebe',
          sortable: true,
          style: 'width: 250px',
        },
        {
          name: 'DavcnaStevilka',
          required: false,
          label: this.$t('davcna'),
          tooltip: '',
          align: 'left',
          field: 'DavcnaStevilka',
          sortable: true,
          style: 'width: 80px',
        },
        {
          name: 'StopnjaPravilnosti',
          required: false,
          label: this.$t('fk_stopnja_pravilnosti_short'),
          tooltip: this.$t('stopnja_pravilnosti_hint'),
          align: 'left',
          field: 'StopnjaPravilnosti',
          sortable: true,
          style: 'width: 30px',
        },
        {
          name: 'DtRojstva',
          required: false,
          label: this.$t('fk_dt_rojstva'),
          tooltip: '',
          align: 'left',
          field: 'DtRojstva',
          sortable: true,
          style: 'width: 100px',
        },
        {
          name: 'Naslov',
          required: false,
          label: this.$t('fk_naslov_posta'),
          tooltip: '',
          align: 'left',
          field: 'Naslov',
          sortable: true,
        },
        {
          name: 'VrstaOsebe',
          required: false,
          label: this.$t('vrsta_osebe_short'),
          tooltip: this.$t('vrsta_osebe'),
          align: 'left',
          field: 'VrstaOsebe',
          sortable: true,
          style: 'width: 30px',
        },
        {
          name: 'Sts',
          required: false,
          label: this.$t('fk_sts'),
          tooltip: '',
          align: 'left',
          field: 'StatusKratko',
          sortable: false,
          style: 'width: 100px',
        },
      ],
      pagination: {
        sortBy: 'KonsolidacijskaDavcnaStevilka',
        descending: false,
        page: 1,
        rowsPerPage: this.config.type === 'basic' ? 10 : this.total > 0 ? this.total : 10,
        rowsNumber: this.total || 1,
        maxPages: Math.ceil((this.total || 1) / 10),
        izbor: this.selectedUsers,
        multisort: false,
      },
    }
  },

  methods: {
    moveSelectedUsers() {
      this.$emit('selectUsers', { users: this.selectedUsers, pagination: this.pagination })
    },
    clearSelectedUsers() {
      this.$emit('clearUsers', this.selectedUsers)
    },
    selectedUsersKons(konsDst) {
      this.$emit('selectKonsolidacija', {
        KonsolidacijskaDavcnaStevilka: konsDst,
        pagination: this.pagination,
      })
    },
    clearSelectedUsersKons(konsDst) {
      this.$emit('unselectKonsolidacija', { konsDst: konsDst, allUsers: this.data })
    },

    toggleExpanded(val) {
      if (this.expanded.includes(val)) {
        this.expanded = this.expanded.filter((exp) => exp !== val)
        this.updateAfterEdit([val])
      } else {
        this.expanded.push(val)
      }
    },

    refreshSelectedUsers() {
      this.$emit('refreshSelectedUsers')
    },

    moveFilter(tableType, filter, filterValue) {
      if (tableType === 'basic') {
        this.$emit('moveFilter', {
          filter: filter,
          value: filterValue,
        })
      }
    },

    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination

      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
      this.pagination.maxPages = Math.ceil(this.total / this.rowsPerPage)
      this.pagination.multisort = false

      this.$emit('filterData', {
        filters: { ...this.pagination },
        selectedUsers: [...this.selectedUsers]
      })
    },

    onPageSwitch(page) {
      this.pagination.page = page
      this.$emit('filterData', {
        filters: { ...this.pagination },
        selectedUsers: [...this.selectedUsers]
      })
    },

    highlightRow(id, expand) {
      if (expand) {
        this.highlighted.push(id)
      } else {
        this.highlighted = this.highlighted.filter((item) => item !== id)
      }
    },

    setResponse(response) {
      this.$emit('setResponse', response)
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
    selectedUsers(newVal) {
      this.selectedUsersLocal = Array.isArray(newVal) ? [...newVal] : []
    },
    selectedUsersLocal (val) {
      this.$emit('update:selectedUsers', Array.isArray(val) ? val : [])
    }
  },

  mounted() {
    this.selectedUsersLocal = Array.isArray(this.selectedUsers) ? [...this.selectedUsers] : []
  },
}
</script>

<style>
.table-footer-text {
  height: 30px;
  margin-right: 30px;
}

.table-footer-text span {
  line-height: 30px;
  display: inline-block;
  vertical-align: middle;
}

.q-table
  thead
  tr
  th
  .q-checkbox
  .q-checkbox__inner.relative-position.q-checkbox__inner--active.text-grey-8
  .q-checkbox__bg.absolute {
  background-color: #3ca082;
}

.text-grey-8 {
  color: #3ca082 !important;
}

.cro-bg {
  background-color: #f5f5f5;
}

.btn-table-action {
  padding: 0px 5px 0px 5px !important;
  margin-right: 5px;
  min-height: 2.2em !important;
}

.move-arrow {
  cursor: pointer;
  font-size: 15px !important;
}

.link_filter {
  cursor: pointer;
}

.display-icon {
  cursor: pointer;
}

.hide-table {
  display: none;
}

#table-options div {
  float: right;
}

#edit-div {
  background-color: #c0ddd5;
  height: 60px;
}

#edit-div td label {
  margin-top: 0px;
}

.selected-actions .q-btn {
  float: right;
}

.user-details-td {
  background: rgba(0, 0, 0, 0.03);
}

.highlighted {
  background-color: #fff7eb !important;
}

.highlighted-green {
  background-color: #d5e5e2 !important;
}

.death {
  color: grey;
}

tbody tr.selected td {
  background-color: #fff7eb;
}

tbody tr.selected.details td {
  background-color: rgba(0, 0, 0, 0.03);
}

.cons-arrow {
  float: right;
  right: 15px;
}

.inline {
  display: inline;
}

#multiple-sort-col {
  margin: 0px 10px;
}

#multiple-sort-col .q-btn {
  background: transparent;
}

#multiple-sort-col .q-item.q-router-link--active,
.q-item {
  color: #939393 !important;
}

.multisort_arrow {
  cursor: pointer;
  margin-left: 5px;
  font-size: 18px;
}

.q-menu .row .column .col {
  margin: 5px 0px;
}

#sort-btns {
  margin-top: 15px;
  float: right;
}

.q-field--auto-height .q-field__native,
.q-field--auto-height .q-field__prefix,
.q-field--auto-height .q-field__suffix {
  line-height: 26px;
}

.contact-icon {
  right: 0px;
}

.gdpr-icon {
  right: 0px;
  top: -1px;
}

.material-icons.gdpr-icon {
  padding-left: 5px;
}

.death-icon {
  margin-top: -15px;
}

.q-banner {
  min-height: 30px;
  padding: 0px 10px;
}
</style>

<style lang="sass">
.sticky-header-table
  .q-table__middle
    max-height: 200px

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
.sticky-header-table.basic
  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #DEDEDE

  tbody tr td
    color: rgba(0, 0, 0, .5)

  div.q-table__middle.scroll.cro-bg table.q-table thead tr.cro-bg th.text-left.sortable.sorted i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left,
  div.q-table__middle.scroll.cro-bg table.q-table thead tr.cro-bg th.text-left.sortable i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left
    color: #3CA082

.sticky-header-table.selected
  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    /* background-color: #DFEBE7 */
    background-color: #DEDEDE
  div.q-table__middle.scroll table.q-table thead tr th.text-left.sortable.sorted i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left,
  div.q-table__middle.scroll table.q-table thead tr th.text-left.sortable i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left
    color: #3CA082
</style>

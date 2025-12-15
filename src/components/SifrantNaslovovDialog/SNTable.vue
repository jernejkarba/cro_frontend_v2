<template>
  <div>
    <div id="sn-table-title">
      {{ this.$t('SN_table_title') }}
    </div>
    <q-table
      class="my-sticky-header-table"
      id="sifrant-naslovov-table"
      table-header-class="cro-bg"
      title=""
      table-style="max-height: 325px"
      :rows="data"
      :columns="columns"
      row-key="ID"
      square
      selection="single"
      v-model:selected="selected"
      v-model:pagination="pagination"
      hide-pagination
      hide-bottom
    >
      <template v-slot:body="props">
        <q-tr :props="props" :key="props.row.ID" :id="props.row.ID">
          <q-td>
            <q-checkbox v-model="props.selected" color="cro-green" />
          </q-td>
          <q-td key="PostnaSt" :props="props">
            {{ props.row.PostnaSt }}
          </q-td>
          <q-td key="Posta" :props="props">
            {{ props.row.Posta }}
          </q-td>
          <q-td key="Naselje" :props="props">
            {{ props.row.Naselje }}
          </q-td>
          <q-td key="Ulica" :props="props">
            {{ props.row.Ulica }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'SNTable',

  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      selected: [],
      pagination: {
        sortBy: 'ID',
        descending: false,
        page: 1,
        rowsPerPage: 1000,
      },

      columns: [
        {
          name: 'PostnaSt',
          required: false,
          label: 'Št. pošte',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
        {
          name: 'Posta',
          required: false,
          label: 'Pošta',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
        {
          name: 'Naselje',
          required: false,
          label: 'Naselje',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
        {
          name: 'Ulica',
          required: false,
          label: 'Ulica',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
      ],
    }
  },

  computed: {
    pagesNumber() {
      return Math.ceil(this.data.length / this.pagination.rowsPerPage)
    },
  },

  watch: {
    selected: function (newVal) {
      this.$emit('selectRow', newVal)
    },
  },
}
</script>

<style>
#sn-table-title {
  margin-top: 30px;
  font-weight: bold;
}

#sifrant-naslovov-table {
  margin-top: 15px;
}

#sifrant-naslovov-table table tbody tr:nth-child(even) {
  background-color: #f5f5f5 !important;
}

#sifrant-naslovov-table table thead tr th:first-child,
#sifrant-naslovov-table table tbody tr td:first-child {
  padding-left: 10px !important;
}
</style>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  max-height: 325px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    /* background-color: #c1f4cd */

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

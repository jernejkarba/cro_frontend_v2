<template>
  <div>
    <q-table
      id="audit-trail-table"
      table-header-class="cro-bg"
      title=""
      :table-style="'height: ' + (data.length + 1) * 40 + 'px'"
      :rows="data"
      :columns="columns"
      row-key="name"
      square
      :pagination="pagination"
      hide-bottom
    >
      <template v-slot:body="props">
        <q-tr :props="props" :id="props.row.ID">
          <q-td key="DtSpremembe" :props="props">
            {{ props.row.DtSpremembe }}
          </q-td>
          <q-td key="AvtorSpremembe" :props="props">
            {{ props.row.AvtorSpremembe }}
          </q-td>
          <q-td key="CO" :props="props">
            {{ props.row.CO }}
          </q-td>
          <q-td key="OP" :props="props">
            {{ props.row.OP }}
          </q-td>
          <q-td key="PRG" :props="props">
            {{ props.row.PRG }}
          </q-td>
          <q-td key="Akcija" :props="props">
            {{ props.row.Akcija }}
          </q-td>
          <q-td key="VrstaPodatka" :props="props">
            {{ props.row.VrstaPodatka }}
          </q-td>
          <q-td key="SpremenjenoIz" :props="props">
            {{ props.row.SpremenjenoIz }}
          </q-td>
          <q-td key="SpremenjenoV" :props="props">
            {{ props.row.SpremenjenoV }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'ATTable',

  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      pagination: {
        sortBy: 'name',
        descending: false,
        page: 0,
        rowsPerPage: this.data.length,
      },

      columns: [
        {
          name: 'DtSpremembe',
          required: false,
          label: 'Dt. spremembe',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
        {
          name: 'AvtorSpremembe',
          required: false,
          label: 'Avtor spremembe',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
        {
          name: 'CO',
          required: false,
          label: 'CO',
          tooltip: '',
          align: 'center',
          sortable: false,
        },
        {
          name: 'OP',
          required: false,
          label: 'OP',
          tooltip: '',
          align: 'center',
          sortable: false,
        },
        {
          name: 'PRG',
          required: false,
          label: 'Program',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
        {
          name: 'Akcija',
          required: false,
          label: 'Akcija',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
        {
          name: 'VrstaPodatka',
          required: false,
          label: 'Vrsta podatka',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
        {
          name: 'SpremenjenoIz',
          required: false,
          label: 'Spremenjeno iz',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
        {
          name: 'SpremenjenoV',
          required: false,
          label: 'Spremenjeno v',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
      ],
    }
  },
}
</script>

<style>
#audit-trail-table {
  margin-top: 15px;
}

#audit-trail-table .q-table {
  position: absolute;
}

#audit-trail-table table tbody tr:nth-child(even) {
  background-color: #f5f5f5 !important;
}

#audit-trail-table table thead tr th:first-child,
#audit-trail-table table tbody tr td:first-child {
  padding-left: 10px !important;
}
</style>

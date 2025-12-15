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
        <q-tr :props="props" :key="props.row.ID" :id="props.row.ID">
          <q-td key="DtSpremembe" :props="props">
            {{ props.row.DtSpremembe }}
          </q-td>
          <q-td key="AvtorSpremembe" :props="props">
            {{ props.row.AvtorSpremembe }}
          </q-td>
          <q-td key="Akcija" :props="props">
            {{ props.row.Akcija }}
          </q-td>
          <q-td key="VrstaPodatka" :props="props">
            {{ props.row.VrstaPodatka }}
          </q-td>
          <q-td key="SpremenjenoIz" :props="props">
            <div
              class="td-link"
              @click="downloadDocument(props.row.SpremenjenoIz)"
              v-if="props.row.VrstaPodatka.includes('DKM0010') && props.row.SpremenjenoIz > 0"
            >
              {{ props.row.SpremenjenoIz }}
            </div>
            <div v-else>
              {{ props.row.SpremenjenoIz }}
            </div>
          </q-td>
          <q-td key="SpremenjenoV" :props="props">
            <div
              class="td-link"
              @click="downloadDocument(props.row.SpremenjenoV)"
              v-if="props.row.VrstaPodatka.includes('DKM0010') && props.row.SpremenjenoV > 0"
            >
              {{ props.row.SpremenjenoV }}
            </div>
            <div v-else>
              {{ props.row.SpremenjenoV }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'ATTableSeparate',

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
        rowsPerPage: 10,
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

  methods: {
    downloadDocument(dkm001Id) {
      this.$q.loading.show()
      this.api
        .post('Dokument', {
          DKM01_ID: dkm001Id,
        })
        .then((result) => {
          this.$q.loading.hide()

          if (result.data.success === true) {
            const linkSource = 'data:' + result.data.mimetype + ';base64,' + result.data.content
            const downloadLink = document.createElement('a')

            downloadLink.href = linkSource
            downloadLink.download = result.data.filename
            downloadLink.click()
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

#audit-trail-table .td-link {
  cursor: pointer;
  color: #3ca082;
}
</style>

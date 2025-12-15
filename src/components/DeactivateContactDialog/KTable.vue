<template>
  <div>
    <h5 class="de-table-title">{{ this.$t('karantena') }}</h5>
    <q-table
      class="sticky-header-table karantena-table"
      id="privolitve-widget-table"
      table-header-class="cro-bg"
      title=""
      :virtual-scroll="true"
      :rows="data"
      :columns="columns"
      :loading="loading"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :sort-method="customSort"
      hide-bottom
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props" :id="props.row.ID">
          <q-td key="KDST" :props="props">
            {{ props.row.KDST }}
          </q-td>
          <q-td key="EZSO" :props="props">
            {{ props.row.EZSO }}
          </q-td>
          <q-td key="NazivOsebe" class="contact_td" :props="props">
            {{ props.row.NazivOsebe }}
          </q-td>
          <q-td key="Kontakt" :props="props">
            {{ props.row.Kontakt }}
          </q-td>
          <q-td key="DtVnosa" :props="props">
            {{ props.row.DtVnosa }}
          </q-td>
          <q-td key="DtPopravka" :props="props">
            {{ props.row.DtPopravka }}
          </q-td>
          <q-td key="Uporabnik" :props="props">
            {{ props.row.Uporabnik }}
          </q-td>
          <q-td key="Izvor" :props="props">
            {{ props.row.Izvor }}
          </q-td>
          <q-td key="Dokazilo" :props="props">
            <q-btn
              class="file-btn"
              size="12px"
              color="white"
              text-color="cro"
              icon="mdi-download"
              v-if="parseInt(props.row.DKM001) > 0"
              @click="downloadDocument(props.row.DKM001)"
            >
              {{ $t('prenesi') }}
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'KTable',

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
  },

  data() {
    return {
      GDPRCheckbox: true,
      ESoglasjeCheckbox: true,

      showNT: true,
      showPOSPAR: true,
      showESoglasja: true,

      NTDetails: false,
      PosParDetails: false,
      ESoglasjaDetails: false,

      privolitveDetails: [],

      pagination: {
        rowsPerPage: 10,
        sortBy: 'DtAkcije',
        descending: true,
      },

      editableContacts: [],

      columns: [
        {
          name: 'KDST',
          required: false,
          label: 'KDŠT',
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
          label: 'Oseba',
          tooltip: '',
          align: 'left',
          sortable: true,
        },
        {
          name: 'Kontakt',
          required: false,
          label: 'Kontakt',
          align: 'left',
          sortable: true,
        },
        {
          name: 'DtVnosa',
          required: false,
          label: 'Datum vnosa',
          tooltip: '',
          align: 'left',
          field: 'Vir',
          sortable: true,
        },
        {
          name: 'DtPopravka',
          required: false,
          label: 'Datum popravka',
          tooltip: '',
          align: 'left',
          sortable: true,
        },
        {
          name: 'Uporabnik',
          required: false,
          label: 'Uporabnik',
          tooltip: '',
          align: 'left',
          sortable: true,
        },
        {
          name: 'Izvor',
          required: false,
          label: 'Izvor',
          tooltip: '',
          align: 'left',
          sortable: true,
        },
        {
          name: 'Dokazilo',
          required: false,
          label: 'Dokazilo',
          tooltip: '',
          align: 'center',
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

    customSort(rows, sortBy, descending) {
      const data = [...rows]

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a
          const y = descending ? a : b

          if (sortBy === 'DtVnosa' || sortBy === 'DtPopravka') {
            // Date sort
            let xDay = x[sortBy].split('.')[0]
            let xMonth = x[sortBy].split('.')[1]
            let xYear = x[sortBy].split('.')[2]

            let yDay = y[sortBy].split('.')[0]
            let yMonth = y[sortBy].split('.')[1]
            let yYear = y[sortBy].split('.')[2]

            const xDate = new Date(xYear + '-' + xMonth + '-' + xDay)
            const yDate = new Date(yYear + '-' + yMonth + '-' + yDay)

            return xDate > yDate ? 1 : xDate < yDate ? -1 : 0
          } else {
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
          }
        })
      }
      return data
    },
  },
}
</script>

<style>
.karantena-table tbody tr {
  color: #b7b6b6;
}
</style>

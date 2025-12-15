<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">
      Kratkoročne terjatve iz blaga in storitev (najemnine, prodaja osnovnih sredstev in ostalo),
      terjatve iz naslova neunovčenih čekov sklepalcev (konto 167014) in fizičnih oseb (konto
      167015) ter terjatve iz naslova prisilnih poravnav in stečajev
    </div>
    <div
      id="kratkorocne-terjatve-table"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col">Konto ID</th>
              <th scope="col">Opis konta</th>
              <th scope="col">Opis knjižbe</th>
              <th class="right" scope="col">DEBET</th>
              <th class="right" scope="col">KREDIT</th>
              <th class="right" scope="col">SALDO</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in tableData" :key="row['Konto ID']">
              <tr>
                <td :rowspan="getPolicaRows(row.data)">
                  {{ row['Konto ID'] }}
                </td>
              </tr>
              <template v-for="row2 in row.data" :key="row2.Dokument">
                <tr>
                  <td>
                    {{ row2['Opis konta'] }}
                  </td>
                  <td>
                    {{ row2['Opis knjižbe'] }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row2['DEBET']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row2['KREDIT']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row2['SALDO']) }}
                  </td>
                </tr>
              </template>
              <tr>
                <td class="sum-cell">{{ row['Konto ID'] }}</td>
                <td class="sum-cell"></td>
                <td class="sum-cell"></td>
                <td class="sum-cell right">
                  {{ $getFloat(row['sum']['DEBET']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['sum']['KREDIT']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['sum']['SALDO']) }}
                </td>
              </tr>
            </template>

            <tr>
              <td class="total-sum-cell">Skupaj</td>
              <td class="total-sum-cell"></td>
              <td class="total-sum-cell"></td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['DEBET']) }}
              </td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['KREDIT']) }}
              </td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['SALDO']) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OdprteTerjatve',

  props: {
    data: {
      type: Object,
      required: true,
      default: Object,
    },
    sum: {
      type: Object,
      required: true,
      default: Object,
    },
  },

  data() {
    return {
      tableData: [],
      tableDataSum: [],
    }
  },

  methods: {
    getPolicaRows(polica) {
      let allRows = 0

      if (typeof polica !== 'undefined') {
        for (let v of Object.values(polica)) {
          if (typeof v.data === 'object') {
            allRows += Object.keys(v.data).length
          }
        }
        allRows += Object.values(polica).length
      }

      return allRows + 1
    },
  },

  mounted() {
    let v
    for (v of Object.values(this.data)) {
      this.tableData.push(v)
    }
  },
}
</script>

<style></style>

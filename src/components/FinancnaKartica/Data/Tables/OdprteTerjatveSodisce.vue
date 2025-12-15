<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">
      Seznam ODPRTIH TERJATEV v saldakontih premij premoženjskih zavarovanj
    </div>
    <div
      id="odprte-terjatve-table"
      data-cols-width="20,23,11,11,9,9,9,5,25,12"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col" data-f-bold="true">Police</th>
              <th scope="col" data-f-bold="true">Dokument</th>
              <th scope="col" data-f-bold="true" style="min-width: 55px">Dt. Zapadlosti/plačila</th>
              <th scope="col" data-f-bold="true" style="min-width: 55px">Dt. Sklenitve police</th>
              <th class="right" scope="col" data-f-bold="true">Terjano</th>
              <th class="right" scope="col" data-f-bold="true">Plačano</th>
              <th class="right" scope="col" data-f-bold="true">Zapadli saldo na polici</th>
              <th scope="col" data-f-bold="true">Npl</th>
              <th scope="col" data-f-bold="true" style="min-width: 110px">Opis knjižbe-faktura</th>
              <th scope="col" data-f-bold="true">Način zapiranja terjatve</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in data" :key="row.Polica">
              <tr>
                <td :rowspan="getPolicaRows(row.data)" data-a-v="middle">
                  {{ row['Polica'] }}
                </td>
              </tr>

              <template v-for="row2 in row.data" :key="row2.Dokument">
                <tr>
                  <td :rowspan="getPolicaRows(row2.data)" data-a-v="middle">
                    {{ row2['Dokument'] }}
                  </td>
                </tr>

                <template v-for="row3 in row2.data" :key="row3['Plačano']">
                  <tr>
                    <td>
                      {{ $stringToDate(row3['Dt. zapadlosti/plačila']) }}
                    </td>

                    <td>
                      {{ $stringToDate(row3['Dt. sklenitve police']) }}
                    </td>
                    <td class="right" data-t="n" data-num-fmt="0.00">
                      {{ $getFloat(row3['Terjano']) }}
                    </td>
                    <td class="right" data-t="n" data-num-fmt="0.00">
                      {{ $getFloat(row3['Plačano']) }}
                    </td>
                    <td class="right" data-t="n" data-num-fmt="0.00">
                      {{ $getFloat(row3['Zapadli saldo na polici']) }}
                    </td>
                    <td>
                      {{ row3['Npl'] }}
                    </td>
                    <td>
                      {{ row3['Opis knjižbe-faktura'] }}
                    </td>
                    <td>
                      {{ row3['Način zapiranja terjatve'] }}
                    </td>
                  </tr>
                </template>
              </template>
              <tr>
                <td class="sum-cell" data-f-bold="true" data-fill-color="F7ECF3">
                  {{ row['sum']['Polica'] }}
                </td>
                <td class="sum-cell" data-fill-color="F7ECF3"></td>
                <td class="sum-cell" data-fill-color="F7ECF3"></td>
                <td class="sum-cell" data-fill-color="F7ECF3"></td>
                <td
                  class="sum-cell right"
                  data-t="n"
                  data-num-fmt="0.00"
                  data-f-bold="true"
                  data-fill-color="F7ECF3"
                >
                  {{ $getFloat(row['sum']['Terjano']) }}
                </td>
                <td
                  class="sum-cell right"
                  data-t="n"
                  data-num-fmt="0.00"
                  data-f-bold="true"
                  data-fill-color="F7ECF3"
                >
                  {{ $getFloat(row['sum']['Plačano']) }}
                </td>
                <td
                  class="sum-cell right"
                  data-t="n"
                  data-num-fmt="0.00"
                  data-f-bold="true"
                  data-fill-color="F7ECF3"
                >
                  {{ $getFloat(row['sum']['Zapadli saldo na polici']) }}
                </td>
                <td class="sum-cell" data-fill-color="F7ECF3"></td>
                <td class="sum-cell" data-fill-color="F7ECF3"></td>
                <td class="sum-cell" data-fill-color="F7ECF3"></td>
              </tr>
            </template>
            <tr>
              <td class="total-sum-cell" data-f-bold="true" data-fill-color="F7D6EA">Skupaj</td>
              <td class="total-sum-cell" data-fill-color="F7D6EA"></td>
              <td class="total-sum-cell" data-fill-color="F7D6EA"></td>
              <td class="total-sum-cell" data-f-bold="true" data-fill-color="F7D6EA">Sum</td>
              <td
                class="total-sum-cell right"
                data-num-fmt="0.00"
                data-f-bold="true"
                data-fill-color="F7D6EA"
              >
                {{ $getFloat(this.sum['Terjano']) }}
              </td>
              <td
                class="total-sum-cell right"
                data-num-fmt="0.00"
                data-f-bold="true"
                data-fill-color="F7D6EA"
              >
                {{ $getFloat(this.sum['Plačano']) }}
              </td>
              <td
                class="total-sum-cell right"
                data-num-fmt="0.00"
                data-f-bold="true"
                data-fill-color="F7D6EA"
              >
                {{ $getFloat(this.sum['Zapadli saldo na polici']) }}
              </td>
              <td class="total-sum-cell" data-fill-color="F7D6EA"></td>
              <td class="total-sum-cell" data-fill-color="F7D6EA"></td>
              <td class="total-sum-cell" data-fill-color="F7D6EA"></td>
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
    tableName: {
      type: String,
      required: true,
    },
    connectionStatus: {
      type: String,
      required: true,
    },
    dataType: {
      type: String,
      required: true,
    },
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
}
</script>

<style>
.export .terjatve-posrednik {
  width: 100px;
}
</style>

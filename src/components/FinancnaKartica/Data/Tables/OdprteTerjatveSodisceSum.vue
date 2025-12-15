<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">
      Seznam ODPRTIH TERJATEV v saldakontih premij premoženjskih zavarovanj <br />
      <small
        >* Zaradi obsežnosti podatkov je prikazana samo sumarna tabela. Za podrobno tabelo prosim
        uporabite izvoz.</small
      >
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
  name: 'OdprteTerjatveSodisceSum',

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

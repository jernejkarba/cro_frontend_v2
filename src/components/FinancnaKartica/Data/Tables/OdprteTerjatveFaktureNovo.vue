<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">
      Seznam ODPRTIH TERJATEV v saldakontih premij premoženjskih zavarovanj po fakturah
    </div>
    <div
      id="odprte-terjatve-table"
      data-cols-width="20,20,12,12,9,9,9,5,6"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col" data-f-bold="true">Številka fakture</th>
              <th scope="col" data-f-bold="true" style="max-width: 160px">Naziv sklepalca</th>
              <th scope="col" data-f-bold="true" style="min-width: 55px">Dt. knjižbe</th>
              <th scope="col" data-f-bold="true" style="min-width: 55px">Dt. izpisa terjatve</th>
              <th class="right" scope="col" data-f-bold="true">Terjano</th>
              <th class="right" scope="col" data-f-bold="true">Plačano</th>
              <th class="right" scope="col" data-f-bold="true">Zapadli saldo na polici</th>
              <th scope="col" data-f-bold="true">Npl</th>
              <th scope="col" data-f-bold="true" style="min-width: 110px">Opis knjižbe-faktura</th>
              <th scope="col" data-f-bold="true">Način zapiranja terjatve</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in data" :key="row['Številka fakture']">
              <tr>
                <td :rowspan="getPolicaRows(row.data)" data-a-v="middle">
                  {{
                    tableName.includes('Za poslovni sektor')
                      ? row['Opis knjižbe - faktura']
                      : row['Številka fakture']
                  }}
                </td>
                <td :rowspan="getPolicaRows(row.data)" data-a-v="middle">
                  {{ row['Naziv posrednika'] }}
                </td>
              </tr>
              <template v-for="row2 in row.data" :key="row2['Številka fakture']">
                <tr
                  :class="
                    row2['Opis knjižbe - faktura'] &&
                    row2['Opis knjižbe - faktura'].substring(0, 4) == '137-' &&
                    row['Številka fakture'] != row2['Opis knjižbe - faktura']
                      ? 'highlight-row'
                      : ''
                  "
                >
                  <td>
                    {{ $stringToDate(row2['Dt. knjižbe']) }}
                  </td>
                  <td>
                    {{ $stringToDate(row2['Dt. izpisa terjatve']) }}
                  </td>
                  <td
                    data-t="n"
                    data-num-fmt="0.00"
                    class="right ut-link"
                    v-if="
                      connectionStatus === 'connected' &&
                      (dataType === 'UT_KOMP_PRAVNA' || dataType === 'UT_KOMP_FIZICNA') &&
                      (tableName === 'Finančna kartica - Po fakturah' ||
                        tableName.includes('Vse police (KNE generalne pogodbe)'))
                    "
                    @click="
                      sendMessage(
                        row2,
                        'Terjano',
                        tableName.includes('Za poslovni sektor')
                          ? row['Opis knjižbe - faktura']
                          : row['Številka fakture']
                      )
                    "
                  >
                    {{ $getFloat(row2['Terjano']) }}
                  </td>
                  <td class="right" data-t="n" data-num-fmt="0.00" v-else>
                    {{ $getFloat(row2['Terjano']) }}
                  </td>
                  <td class="right" data-t="n" data-num-fmt="0.00">
                    {{ $getFloat(row2['Plačano']) }}
                  </td>
                  <td
                    data-t="n"
                    data-num-fmt="0.00"
                    class="right ut-link"
                    v-if="
                      connectionStatus === 'connected' &&
                      (dataType === 'UT_KOMP_PRAVNA' || dataType === 'UT_KOMP_FIZICNA') &&
                      (tableName === 'Finančna kartica - Po fakturah' ||
                        tableName.includes('Vse police (KNE generalne pogodbe)'))
                    "
                    @click="
                      sendMessage(
                        row2,
                        'Zapadli saldo na polici',
                        tableName.includes('Za poslovni sektor')
                          ? row['Opis knjižbe - faktura']
                          : row['Številka fakture']
                      )
                    "
                  >
                    {{ $getFloat(row2['Zapadli saldo na polici']) }}
                  </td>
                  <td class="right" data-t="n" data-num-fmt="0.00" v-else>
                    {{ $getFloat(row2['Zapadli saldo na polici']) }}
                  </td>
                  <td>
                    {{ row2['Npl'] }}
                  </td>
                  <td>
                    {{ row2['Opis knjižbe - faktura'] }}
                  </td>
                  <td>
                    {{ row2['Način zapiranja terjatve'] }}
                  </td>
                </tr>
              </template>
              <tr>
                <td class="sum-cell" data-fill-color="F7ECF3"></td>
                <td class="sum-cell" data-fill-color="F7ECF3"></td>
                <td class="sum-cell" data-fill-color="F7ECF3"></td>
                <td class="sum-cell" data-fill-color="F7ECF3"></td>
                <td
                  class="sum-cell right"
                  data-f-bold="true"
                  data-t="n"
                  data-num-fmt="0.00"
                  data-fill-color="F7ECF3"
                >
                  {{ $getFloat(row['sum']['Terjano']) }}
                </td>
                <td
                  class="sum-cell right"
                  data-f-bold="true"
                  data-t="n"
                  data-num-fmt="0.00"
                  data-fill-color="F7ECF3"
                >
                  {{ $getFloat(row['sum']['Plačano']) }}
                </td>
                <td
                  class="sum-cell right"
                  data-f-bold="true"
                  data-t="n"
                  data-num-fmt="0.00"
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
              <td class="total-sum-cell" data-fill-color="F7D6EA"></td>
              <td
                class="total-sum-cell right"
                data-f-bold="true"
                data-t="n"
                data-num-fmt="0.00"
                data-fill-color="F7D6EA"
              >
                {{ $getFloat(this.sum['Terjano']) }}
              </td>
              <td
                class="total-sum-cell right"
                data-f-bold="true"
                data-t="n"
                data-num-fmt="0.00"
                data-fill-color="F7D6EA"
              >
                {{ $getFloat(this.sum['Plačano']) }}
              </td>
              <td
                class="total-sum-cell right"
                data-f-bold="true"
                data-t="n"
                data-num-fmt="0.00"
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
  name: 'OdprteTerjatveFaktureNovo',

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

      for (let v of Object.values(polica)) {
        if (typeof v.data === 'object') {
          allRows += Object.keys(v.data).length
        }
      }
      allRows += Object.values(polica).length

      return allRows + 1
    },

    sendMessage(row, field, sklic) {
      let msg = {}
      msg.msgType = 'data'
      msg.datum = field === 'Terjano' ? this.$stringToDate(row['Dt. knjižbe']) : ''
      msg.sklic = sklic
      msg.znesek = this.$getFloat(row[field])
      msg.opis_postavke = this.tableName.includes('Vse police (KNE generalne pogodbe)')
        ? 'zavarovalna_polica'
        : 'racun'

      this.$emit('sendMessage', msg)
    },
  },
}
</script>

<style>
.export .terjatve-posrednik {
  width: 100px;
}
</style>

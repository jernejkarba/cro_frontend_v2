<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">
      Seznam ODPRTIH TERJATEV v saldakontih premij premoženjskih zavarovanj po fakturah
    </div>
    <div
      id="odprte-terjatve-table"
      data-cols-width="25,18,23,11,11,9,9,9,5,12"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col" data-f-bold="true">Številka fakture</th>
              <th scope="col" data-f-bold="true">Tip in pogodbe police z generalno KNE</th>
              <th scope="col" data-f-bold="true" style="max-width: 160px">Naziv sklepalca</th>
              <th scope="col" data-f-bold="true" style="min-width: 55px">Dt. knjižbe</th>
              <th scope="col" data-f-bold="true" style="min-width: 55px">Dt. izpisa terjatve</th>
              <th class="right" scope="col" data-f-bold="true">Terjano</th>
              <th class="right" scope="col" data-f-bold="true">Plačano</th>
              <th class="right" scope="col" data-f-bold="true">Zapadli saldo na polici</th>
              <th scope="col" data-f-bold="true">Npl</th>
              <th scope="col" data-f-bold="true">Način zapiranja terjatve</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in data" :key="row['Številka fakture']">
              <tr>
                <td :rowspan="getPolicaRows(row.data)" data-a-v="middle">
                  {{ row['Številka fakture'] }}
                </td>
              </tr>
              <template v-for="row2 in row.data" :key="row2['Številka fakture']">
                <tr>
                  <td :rowspan="getPolicaRows(row2.data)" data-a-v="middle">
                    {{ row2['Tip in pogodbe police z generalno KNE'] }}
                  </td>
                  <td :rowspan="getPolicaRows(row2.data)" data-a-v="middle">
                    {{ row2['Naziv posrednika'] }}
                  </td>
                </tr>
                <template v-for="row3 in row2.data" :key="row3['Številka fakture']">
                  <tr>
                    <td>
                      {{ $stringToDate(row3['Dt. knjižbe']) }}
                    </td>

                    <td>
                      {{ $stringToDate(row3['Dt. izpisa terjatve']) }}
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
                      @click="sendMessage(row3, 'Terjano', row['Številka fakture'])"
                    >
                      {{ $getFloat(row3['Terjano']) }}
                    </td>
                    <td class="right" data-t="n" data-num-fmt="0.00" v-else>
                      {{ $getFloat(row3['Terjano']) }}
                    </td>
                    <td class="right" data-t="n" data-num-fmt="0.00">
                      {{ $getFloat(row3['Plačano']) }}
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
                      @click="sendMessage(row3, 'Zapadli saldo na polici', row['Številka fakture'])"
                    >
                      {{ $getFloat(row3['Zapadli saldo na polici']) }}
                    </td>
                    <td class="right" data-t="n" data-num-fmt="0.00" v-else>
                      {{ $getFloat(row3['Zapadli saldo na polici']) }}
                    </td>
                    <td>
                      {{ row3['Npl'] }}
                    </td>
                    <td>
                      {{ row3['Način zapiranja terjatve'] }}
                    </td>
                  </tr>
                </template>
                <tr>
                  <td class="sub-sum-cell" data-f-bold="true" data-fill-color="D2D2FF">
                    {{ row2['Tip in pogodbe police z generalno KNE'] }}
                  </td>
                  <td class="sub-sum-cell" data-fill-color="D2D2FF"></td>
                  <td class="sub-sum-cell" data-fill-color="D2D2FF"></td>
                  <td class="sub-sum-cell" data-fill-color="D2D2FF"></td>
                  <td
                    class="sub-sum-cell right"
                    data-t="n"
                    data-num-fmt="0.00"
                    data-fill-color="D2D2FF"
                    data-f-bold="true"
                  >
                    {{ $getFloat(row2.sum['Terjano']) }}
                  </td>
                  <td
                    class="sub-sum-cell right"
                    data-t="n"
                    data-num-fmt="0.00"
                    data-fill-color="D2D2FF"
                    data-f-bold="true"
                  >
                    {{ $getFloat(row2.sum['Plačano']) }}
                  </td>
                  <td
                    class="sub-sum-cell right"
                    data-t="n"
                    data-num-fmt="0.00"
                    data-fill-color="D2D2FF"
                    data-f-bold="true"
                  >
                    {{ $getFloat(row2.sum['Zapadli saldo na polici']) }}
                  </td>
                  <td class="sub-sum-cell" data-fill-color="D2D2FF"></td>
                  <td class="sub-sum-cell" data-fill-color="D2D2FF"></td>
                </tr>
              </template>
              <tr>
                <td class="sum-cell" data-f-bold="true" data-fill-color="F7ECF3">
                  {{ row['Številka fakture'] }}
                </td>
                <td class="sum-cell" data-fill-color="F7ECF3"></td>
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
              </tr>
            </template>
            <tr>
              <td class="total-sum-cell" data-f-bold="true" data-fill-color="F7D6EA">Skupaj</td>
              <td class="total-sum-cell" data-fill-color="F7D6EA"></td>
              <td class="total-sum-cell" data-fill-color="F7D6EA"></td>
              <td class="total-sum-cell" data-fill-color="F7D6EA"></td>
              <td class="total-sum-cell" data-fill-color="F7D6EA"></td>
              <td
                class="total-sum-cell right"
                data-t="n"
                data-num-fmt="0.00"
                data-f-bold="true"
                data-fill-color="F7D6EA"
              >
                {{ $getFloat(this.sum['Terjano']) }}
              </td>
              <td
                class="total-sum-cell right"
                data-t="n"
                data-num-fmt="0.00"
                data-f-bold="true"
                data-fill-color="F7D6EA"
              >
                {{ $getFloat(this.sum['Plačano']) }}
              </td>
              <td
                class="total-sum-cell right"
                data-t="n"
                data-num-fmt="0.00"
                data-f-bold="true"
                data-fill-color="F7D6EA"
              >
                {{ $getFloat(this.sum['Zapadli saldo na polici']) }}
              </td>
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
  name: 'OdprteTerjatveFakturePolice',

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
          allRows += Object.keys(v.data).length + 1
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

<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">
      Seznam ODPRTIH TERJATEV v saldakontih premij premoženjskih zavarovanj
    </div>
    <div
      id="odprte-terjatve-table"
      data-cols-width="18,25,11,11,11,11,11,11,5,22,15"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col" data-f-bold="true">Police</th>
              <th scope="col" data-f-bold="true" style="max-width: 160px">Naziv sklepalca</th>
              <th scope="col" data-f-bold="true" style="min-width: 55px">Dt. knjižbe</th>
              <th scope="col" data-f-bold="true" style="min-width: 55px">Dt. izpisa terjatve</th>
              <th class="right" scope="col" data-f-bold="true">Fakturirano vse</th>
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
                <td :rowspan="getPolicaRows(row.data)" class="terjatve-posrednik" data-a-v="middle">
                  {{ row['Posrednik'] }}
                </td>
              </tr>

              <template v-for="row2 in row.data" :key="row2.Polica">
                <template v-for="row3 in row2.data" :key="row3['Plačano']">
                  <tr>
                    <td>
                      {{ $stringToDate(row3['Dt. knjižbe']) }}
                    </td>

                    <td>
                      {{ $stringToDate(row3['Dt. izpisa terjatve']) }}
                    </td>
                    <td class="right" data-t="n" data-num-fmt="0.00">
                      {{
                        $getFloat(
                          Object.hasOwn(row3, 'Fakturirano vse')
                            ? row3['Fakturirano vse']
                            : row3['Fakturirana premija']
                        )
                      }}
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
                  {{
                    $getFloat(
                      Object.hasOwn(row['sum'], 'Fakturirano vse')
                        ? row['sum']['Fakturirano vse']
                        : row['sum']['Fakturirana premija']
                    )
                  }}
                </td>
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
                data-t="n"
                data-num-fmt="0.00"
                data-f-bold="true"
                data-fill-color="F7D6EA"
              >
                {{
                  $getFloat(
                    Object.hasOwn(this.sum, 'Fakturirano vse')
                      ? this.sum['Fakturirano vse']
                      : this.sum['Fakturirana premija']
                  )
                }}
              </td>
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
  name: 'OdprteTerjatveNovi',

  props: {
    data: {
      type: Object,
      required: true,
      default: Object,
    },
    sum: {
      type: Object,
      required: false,
      default: Object,
    },
    tableName: {
      type: String,
      required: true,
    },
  },

  methods: {
    getPolicaRows(polica) {
      let allRows = 0

      if (typeof polica !== 'undefined') {
        for (var v1 of Object.values(polica)) {
          for (let v2 of Object.values(v1.data)) {
            if (typeof v2 === 'object') {
              allRows += 1
            }
          }
        }
        allRows += Object.values(v1).length
      }

      return allRows
    },
  },
}
</script>

<style>
.export .terjatve-posrednik {
  width: 100px;
}
</style>

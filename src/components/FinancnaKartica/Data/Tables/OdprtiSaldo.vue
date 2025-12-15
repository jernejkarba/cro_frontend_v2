<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">Police z odprtim saldom (zapadlim in nezapadlim)</div>
    <div
      id="odprti-saldo-table"
      data-cols-width="30,20,20,20,25"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col" data-f-bold="true">
                {{
                  this.tableName.includes('Strnjeno vse fakture') ? 'Številka fakture' : 'Police'
                }}
              </th>
              <th class="right" data-f-bold="true" data-a-h="right" scope="col">Fakturirano vse</th>
              <th class="right" data-f-bold="true" data-a-h="right" scope="col">Terjatev</th>
              <th class="right" data-f-bold="true" data-a-h="right" scope="col">Plačilo</th>
              <th class="right" data-f-bold="true" data-a-h="right" scope="col">
                {{
                  this.tableName.includes('Strnjeno vse fakture')
                    ? 'Zapadli saldo na fakturi'
                    : 'Zapadli saldo na polici'
                }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in data['data']" :key="row['Polica']">
              <tr>
                <td>
                  {{
                    tableName.includes('Strnjeno vse fakture')
                      ? row['Številka fakture']
                      : row['Polica']
                  }}
                </td>
                <td class="right" data-t="n" data-num-fmt="0.00">
                  {{ $getFloat(row['Fakturirano vse']) }}
                </td>
                <td class="right" data-t="n" data-num-fmt="0.00">
                  {{ $getFloat(row['Terjatev']) }}
                </td>
                <td class="right" data-t="n" data-num-fmt="0.00">
                  {{ $getFloat(row['Plačilo']) }}
                </td>
                <td class="right" data-t="n" data-num-fmt="0.00">
                  {{
                    $getFloat(
                      tableName.includes('Strnjeno vse fakture')
                        ? row['Zapadli saldo na fakturi']
                        : row['Zapadli saldo na polici']
                    )
                  }}
                </td>
              </tr>
            </template>
            <tr>
              <td class="sum-cell" data-f-bold="true" data-fill-color="F7ECF3">Skupaj</td>
              <td
                class="sum-cell right"
                data-f-bold="true"
                data-t="n"
                data-num-fmt="0.00"
                data-fill-color="F7ECF3"
              >
                {{ $getFloat(data['sum']['Fakturirano vse']) }}
              </td>
              <td
                class="sum-cell right"
                data-f-bold="true"
                data-t="n"
                data-num-fmt="0.00"
                data-fill-color="F7ECF3"
              >
                {{ $getFloat(data['sum']['Terjatev']) }}
              </td>
              <td
                class="sum-cell right"
                data-f-bold="true"
                data-t="n"
                data-num-fmt="0.00"
                data-fill-color="F7ECF3"
              >
                {{ $getFloat(data['sum']['Plačilo']) }}
              </td>
              <td
                class="sum-cell right"
                data-f-bold="true"
                data-t="n"
                data-num-fmt="0.00"
                data-fill-color="F7ECF3"
              >
                {{
                  $getFloat(
                    tableName.includes('Strnjeno vse fakture')
                      ? data['sum']['Zapadli saldo na fakturi']
                      : data['sum']['Zapadli saldo na polici']
                  )
                }}
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
  name: 'OdprtiSaldo',

  props: {
    data: {
      type: Object,
      required: true,
      default: Object,
    },
    tableName: {
      type: String,
      required: true,
    },
  },
}
</script>

<style></style>

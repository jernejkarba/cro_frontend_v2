<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">Obračuni zamudnih obresti</div>
    <div
      id="obracun-zamudnih-obresti-table"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col">Registerska številka obračuna</th>
              <th scope="col">Datum registracije obračuna</th>
              <th scope="col">Časovno obdobje obračuna</th>
              <th scope="col">Dokument izterjave</th>
              <th class="right" scope="col">Obračunane obresti</th>
              <th class="right" scope="col">Terjane obresti</th>
              <th class="right" scope="col">Prenos terjatev</th>
              <th class="right" scope="col">Izterjane obresti</th>
              <th class="right" scope="col">Odpustek na obresti</th>
              <th class="right" scope="col">Odpisane obresti</th>
              <th class="right" scope="col">Saldo obračunanih obresti</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in tableData" :key="row.Polica">
              <template v-for="row2 in row['data']" :key="row2['Dokument izterjave']">
                <tr>
                  <td>
                    {{ row2['Registrska številka obračuna'] }}
                  </td>
                  <td>
                    {{ row2['Datum registracije obračuna'] }}
                  </td>
                  <td>
                    {{ row2['Časovno obdobje obračuna'] }}
                  </td>
                  <td>
                    {{ row2['Dokument izterjave'] }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row2['Obračunane obresti']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row2['Terjane obresti']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row2['Prenos terjatev']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row2['Izterjane obresti']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row2['Odpustek na obresti']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row2['Odpisane obresti']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row2['Saldo obračunanih obresti']) }}
                  </td>
                </tr>
              </template>
              <tr>
                <td class="sum-cell">
                  {{ row['OBR'] }}
                </td>
                <td class="sum-cell"></td>
                <td class="sum-cell"></td>
                <td class="sum-cell"></td>
                <td class="sum-cell right">
                  {{ $getFloat(row['sum']['Obračunane obresti']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['sum']['Terjane obresti']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['sum']['Prenos terjatev']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['sum']['Izterjane obresti']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['sum']['Odpustek na obresti']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['sum']['Odpisane obresti']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['sum']['Saldo obračunanih obresti']) }}
                </td>
              </tr>
              <tr v-if="this.$user_data.pravice.fk_complete === 'T'">
                <td class="sum-cell">Vse opombe</td>
                <td class="sum-cell not-bold" colspan="10">
                  {{ row['Vse opombe'] }}
                </td>
              </tr>
            </template>

            <tr>
              <td class="total-sum-cell">Vsi obračuni</td>
              <td class="total-sum-cell"></td>
              <td class="total-sum-cell"></td>
              <td class="total-sum-cell"></td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['Obračunane obresti']) }}
              </td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['Terjane obresti']) }}
              </td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['Prenos terjatev']) }}
              </td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['Izterjane obresti']) }}
              </td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['Odpustek na obresti']) }}
              </td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['Odpisane obresti']) }}
              </td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['Saldo obračunanih obresti']) }}
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

  mounted() {
    this.tableData = this.data
  },
}
</script>

<style></style>

<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">Neunovčeni čeki fizičnih oseb</div>
    <div
      id="neunovceni-ceki-table"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col">Registerska št. dokumenta</th>
              <th scope="col">Dt. registracije dokumenta</th>
              <th scope="col">Odgovorne osebe</th>
              <th scope="col"></th>
              <th class="right" scope="col">Terjano</th>
              <th class="right" scope="col">Plačano</th>
              <th class="right" scope="col">Odpustek</th>
              <th class="right" scope="col">Odpisano</th>
              <th class="right" scope="col">Saldo</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in data" :key="row['Št. police']">
              <tr>
                <td>
                  {{ row['REGISTRSKA_ST_DOKUMENTA'] }}
                </td>
                <td>
                  {{ row['DT_REGISTRACIJE'] }}
                </td>
                <td>
                  {{ row['OSEBA_PRIPRAVIL'] + ', ' + row['OSEBA_VODI'] }}
                </td>
                <td>Glavnica:</td>
                <td class="right">
                  {{ $getFloat(row['GLAVNICA_TERJANO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['GLAVNICA_PLACANO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['GLAVNICA_ODPUSCENO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['GLAVNICA_ODPISANO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['GLAVNICA_SALDO']) }}
                </td>
              </tr>
              <tr>
                <td>
                  {{ row['STARA_ST_DOKUMENTA'] }}
                </td>
                <td></td>
                <td></td>
                <td>Obresti:</td>
                <td class="right">
                  {{ $getFloat(row['OBRESTI_TERJANO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['OBRESTI_PLACANO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['OBRESTI_ODPUSCENO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['OBRESTI_ODPISANO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['OBRESTI_SALDO']) }}
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>Stroški:</td>
                <td class="right">
                  {{ $getFloat(row['STROŠKI_TERJANO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['STROŠKI_PLACANO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['STROŠKI_ODPUSCENO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['STROŠKI_ODPISANO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['STROŠKI_SALDO']) }}
                </td>
              </tr>
              <tr>
                <td class="sum-cell">
                  {{ row['REGISTRSKA_ST_DOKUMENTA'] }}
                </td>
                <td class="sum-cell"></td>
                <td class="sum-cell"></td>
                <td class="sum-cell"></td>
                <td class="sum-cell right">
                  {{ $getFloat(row['SUM_TERJANO']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['SUM_PLACANO']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['SUM_ODPUSCENO']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['SUM_ODPISANO']) }}
                </td>
                <td class="sum-cell right">
                  {{ $getFloat(row['SUM_SALDO']) }}
                </td>
              </tr>
              <tr v-if="this.$user_data.pravice.fk_complete === 'T'">
                <td class="sum-cell">Vse opombe:</td>
                <td class="sum-cell not-bold opombe-line" colspan="8">
                  {{ row['OPOMBE'] }}
                </td>
              </tr>
            </template>
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
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      tableData: [],
    }
  },
}
</script>

<style></style>

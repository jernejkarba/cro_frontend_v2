<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">Evidentirani postopki izterjave</div>
    <div v-for="(item, index) in data" :key="item.id">
      <div
        id="postopki-izterjave-table"
        class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
      >
        <div class="q-table__middle scroll">
          <table class="q-table">
            <thead>
              <tr class="title-row">
                <th class="header-title-row" colspan="10">{{ index }}</th>
              </tr>
              <tr class="q-tr">
                <th scope="col">Registerska št. in status dokumenta</th>
                <th scope="col">Dt. registracije dokumenta</th>
                <th scope="col">Odgovorne osebe</th>
                <th scope="col"></th>
                <th class="right" scope="col">Terjano</th>
                <th class="right" scope="col">Plačano</th>
                <th class="right" scope="col">Prenešeno</th>
                <th class="right" scope="col">Odpustek</th>
                <th class="right" scope="col">Odpisano</th>
                <th class="right" scope="col">Saldo</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="row in item" :key="row['Št. police']">
                <tr>
                  <td>
                    {{ row['REGISTRSKA_ST_DOKUMENTA'] }}
                  </td>
                  <td>
                    {{ row['DT_REGISTRACIJE'] }}
                  </td>
                  <td>
                    {{ row['OSEBA_PRIPRAVIL'] !== null ? row['OSEBA_PRIPRAVIL'] : '' }}
                  </td>
                  <td>Glavnica:</td>
                  <td class="right">
                    {{ $getFloat(row['GLAVNICA_TERJANO']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row['GLAVNICA_PLACANO']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row['GLAVNICA_PRENESENO']) }}
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
                  <td>
                    {{ row['DT_ZAPADLOSTI'] != '01.01.1970' ? row['DT_ZAPADLOSTI'] : '' }}
                  </td>
                  <td>
                    {{ row['OSEBA_VODI'] !== null ? row['OSEBA_VODI'] : '' }}
                  </td>
                  <td>Obresti:</td>
                  <td class="right">
                    {{ $getFloat(row['OBRESTI_TERJANO']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row['OBRESTI_PLACANO']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row['OBRESTI_PRENESENO']) }}
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
                  <td>
                    {{ row['TRENUTNI_STS_DOKUMENTA'] }}
                  </td>
                  <td>
                    {{ row['DT_STATUSA'] != '01.01.1970' ? row['DT_STATUSA'] : '' }}
                  </td>
                  <td></td>
                  <td>Stroški:</td>
                  <td class="right">
                    {{ $getFloat(row['STROSKI_TERJANO']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row['STROSKI_PLACANO']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row['STROSKI_PRENESENO']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row['STROSKI_ODPUSCENO']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row['STROSKI_ODPISANO']) }}
                  </td>
                  <td class="right">
                    {{ $getFloat(row['STROSKI_SALDO']) }}
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
                    {{ $getFloat(row['SUM_PRENESENO']) }}
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
                <tr
                  v-if="
                    index !== 'Izvršilni predlogi' && this.$user_data.pravice.fk_complete === 'T'
                  "
                >
                  <td class="sum-cell">Vse opombe:</td>
                  <td class="sum-cell not-bold opombe-line" colspan="9">
                    {{ row['OPOMBE'] }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostopkiIzterjave',

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

<style>
tr.title-row th {
  text-align: left;
  font-size: 14px;
}
</style>

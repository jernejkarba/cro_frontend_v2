<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">Saldo različnih zvrsti terjatev</div>
    <div
      id="regresni-zahtevki-table"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th class="right" scope="col">Police</th>
              <th class="right" scope="col">Regresi</th>
              <th class="right" scope="col">Glavna knjiga</th>
              <th class="right" scope="col">Zastopniška poročila</th>
              <th class="right" scope="col">Kompenzacije v teku</th>
              <th class="right" scope="col">Neunovčeni čeki</th>
              <th class="right" scope="col">Zamudne obresti</th>
              <th class="right" scope="col">Odpustki obresti</th>
              <th class="right" scope="col">Odpisi glavnice</th>
              <th scope="col">Status osebe</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in data" :key="row['Št. police']">
              <tr>
                <td class="right">
                  {{ $getFloat(row['police']) }}
                </td>
                <td :class="regresi ? 'right total-sum-cell' : 'right'">
                  {{ $getFloat(row['regresi']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['glavna_knjiga']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['zastopniska_porocila']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['kompenzacije_v_teku']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['neunovceni_ceki']) }}
                </td>
                <td :class="!zamudneObresti ? 'right total-sum-cell' : 'right'">
                  {{ $getFloat(row['zamudne_obresti']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['odpustki_obresti']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['odpisi_glavnice']) }}
                </td>
                <td
                  :class="
                    row['status_osebe'] != null && row['status_osebe'] != '' ? 'total-sum-cell' : ''
                  "
                >
                  {{ row['status_osebe'] }}
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
  name: 'ZvrstiTerjatev',

  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    regresi: {
      type: Boolean,
      required: true,
      default: false,
    },
    zamudneObresti: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
}
</script>

<style></style>

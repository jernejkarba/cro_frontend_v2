<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">Pregled oseb, zajetih na izpisu</div>
    <div
      id="osebe-table"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col">EZŠO</th>
              <th scope="col">Davčna št.</th>
              <th scope="col">EMŠO</th>
              <th scope="col">Naziv</th>
              <th scope="col">Naslov</th>
              <th scope="col">Pošt. št.</th>
              <th scope="col">Pošta</th>
              <th scope="col">Sts</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in data" :key="row['EZSO']">
              <tr>
                <td>
                  {{ row['EZŠO'] }}
                </td>
                <td>
                  {{ row['Davčna št.'] }}
                </td>
                <td>
                  {{ row['EMŠO'] }}
                </td>
                <td>
                  {{ row['Naziv'] }}
                </td>
                <td>
                  {{ row['Naslov'] }}
                </td>
                <td>
                  {{ row['Pošt. št.'] }}
                </td>
                <td>
                  {{ row['Pošta'] }}
                </td>
                <td :class="row['Sts'] != null && row['Sts'] != '' ? 'total-sum-cell' : ''">
                  {{ row['Sts'] }}
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
  name: 'Osebe',

  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
}
</script>

<style></style>

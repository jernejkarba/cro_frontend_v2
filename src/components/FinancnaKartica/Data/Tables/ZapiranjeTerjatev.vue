<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">Način zapiranja terjatev</div>
    <div
      id="regresni-zahtevki-table"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col">Način zapiranja terjatev</th>
              <th class="right" scope="col">Plačano</th>
              <th class="right" scope="col">Delež v celotnem plačilu</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in data" :key="row['Št. police']">
              <tr>
                <td>
                  {{ row['Način zapiranja terjatev'] }}
                </td>
                <td class="right">
                  {{ $getFloat(row['Plačano']) }}
                </td>
                <td class="right">{{ $getFloat(row['Delež v celotnem plačilu']) }} %</td>
              </tr>
            </template>
            <tr>
              <td class="sum-cell"></td>
              <td class="sum-cell right">
                {{ $getFloat(sum['Plačano']) }}
              </td>
              <td class="sum-cell right">{{ $getFloat(sum['Delež v celotnem plačilu']) }} %</td>
            </tr>
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
}
</script>

<style></style>

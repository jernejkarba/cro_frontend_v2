<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">Osebe z zavrnjenimi čeki</div>
    <q-table
      class="fk-table"
      id="osebe-zavrnjeni-ceki-table"
      :rows="data"
      :columns="columns"
      separator="cell"
      square
      hide-bottom
    >
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'OsebeZavrnjeniCeki',

  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      columns: [
        {
          field: 'EZŠO',
          required: false,
          label: 'EZŠO',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
        {
          field: 'Naziv',
          required: false,
          label: 'Naziv',
          tooltip: '',
          align: 'left',
          sortable: false,
        },
      ],
    }
  },
}
</script>

<style></style>

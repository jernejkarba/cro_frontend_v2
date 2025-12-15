<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">Seznam regresnih zahtevkov</div>
    <div
      id="regresni-zahtevki-table"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col">Tip regresa</th>
              <th scope="col">Št. regresa</th>
              <th scope="col">Tip police</th>
              <th scope="col">Št. police</th>
              <th scope="col">Registerska št. spisa</th>
              <th class="right" scope="col">Predvideni znesek glavnice regresa</th>
              <th class="right" scope="col">Terjano</th>
              <th class="right" scope="col">Plačano</th>
              <th class="right" scope="col">SALDO</th>
              <th class="right" scope="col">Odpisani znesek regresa</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in data['data']" :key="row['Št. police']">
              <tr>
                <td>
                  {{ row['Tip regresa'] }}
                </td>
                <td>
                  {{ row['Št. regresa'] }}
                </td>
                <td>
                  {{ row['Tip police'] }}
                </td>
                <td>
                  {{ row['Št. police'] }}
                </td>
                <td>
                  {{ row['Registrska št. spisa'] }}
                </td>
                <td class="right">
                  {{ $getFloat(row['Predvideni znesek glavnice regresa']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['Terjano']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['Plačano']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['SALDO']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['Odpisani znesek regresa']) }}
                </td>
              </tr>
            </template>
            <tr>
              <td class="sum-cell"></td>
              <td class="sum-cell"></td>
              <td class="sum-cell"></td>
              <td class="sum-cell"></td>
              <td class="sum-cell"></td>
              <td class="sum-cell right">
                {{ $getFloat(data['sum']['Predvideni znesek glavnice regresa']) }}
              </td>
              <td class="sum-cell right">
                {{ $getFloat(data['sum']['Terjano']) }}
              </td>
              <td class="sum-cell right">
                {{ $getFloat(data['sum']['Plačano']) }}
              </td>
              <td class="sum-cell right">
                {{ $getFloat(data['sum']['SALDO']) }}
              </td>
              <td class="sum-cell right">
                {{ $getFloat(data['sum']['Odpisani znesek regresa']) }}
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
  },

  data() {
    return {
      tableData: [],
    }
  },

  methods: {
    getPolicaRows(polica) {
      let allRows = 0
      for (let v of Object.values(polica)) {
        if (typeof v.data === 'object') {
          allRows += Object.keys(v.data).length
        }
      }

      return allRows + 2
    },
  },
}
</script>

<style></style>

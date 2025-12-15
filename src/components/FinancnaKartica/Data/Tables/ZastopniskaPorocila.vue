<template>
  <div class="table-wrapper">
    <div class="row fk-table-title">Odprta zastopniška poročila</div>
    <div
      id="zastopniska-porocila-table"
      class="q-table__container q-table--cell-separator q-table__card q-table--square q-table--no-wrap fk-table"
    >
      <div class="q-table__middle scroll">
        <table class="q-table">
          <thead>
            <tr class="q-tr">
              <th scope="col">Šifra zastopniškega poročila</th>
              <th scope="col">Dt. zastopniškega poročila</th>
              <th class="right" scope="col">Bruto terjatve do sklepalca</th>
              <th class="right" scope="col">Pokrite bruto terjatve do sklepalca</th>
              <th class="right" scope="col">Saldo zastopniškega poročila</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in tableData" :key="row['Šifra zastopniškega poročila']">
              <tr>
                <td>
                  {{ row['Šifra zastopniškega poročila'] }}
                </td>
                <td>
                  {{ row['Dt. zastopniškega poročila'] }}
                </td>
                <td class="right">
                  {{ $getFloat(row['Bruto terjatve do sklepalca']) }}
                </td>
                <td class="right">
                  {{ $getFloat(row['Pokrite bruto terjatve do sklepalca']) }}
                </td>
                <td
                  data-t="n"
                  data-num-fmt="0.00"
                  class="right ut-link"
                  v-if="
                    connectionStatus === 'connected' &&
                    (dataType === 'UT_KOMP_PRAVNA' || dataType === 'UT_KOMP_FIZICNA') &&
                    (tableName === 'Finančna kartica - Po fakturah' ||
                      tableName.includes('Vse police (KNE generalne pogodbe)'))
                  "
                  @click="
                    sendMessage(
                      row,
                      'Saldo zastopniškega poročila',
                      row['Šifra zastopniškega poročila']
                    )
                  "
                >
                  {{ $getFloat(row['Saldo zastopniškega poročila']) }}
                </td>
                <td class="right" v-else>
                  {{ $getFloat(row['Saldo zastopniškega poročila']) }}
                </td>
              </tr>
            </template>

            <tr>
              <td class="total-sum-cell">Skupaj</td>
              <td class="total-sum-cell"></td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['Bruto terjatve do sklepalca']) }}
              </td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['Pokrite bruto terjatve do sklepalca']) }}
              </td>
              <td class="total-sum-cell right">
                {{ $getFloat(this.sum['Saldo zastopniškega poročila']) }}
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
  name: 'ZastopniskaPorocila',

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
    tableName: {
      type: String,
      required: true,
    },
    connectionStatus: {
      type: String,
      required: false,
    },
    dataType: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      tableData: [],
      tableDataSum: [],
    }
  },

  methods: {
    sendMessage(row, field, sklic) {
      let msg = {}
      msg.msgType = 'data'
      msg.datum = row['Dt. zastopniškega poročila']
      msg.sklic = sklic
      msg.znesek = this.$getFloat(row[field])
      msg.opis_postavke = 'posrednisko_porocilo'

      this.$emit('sendMessage', msg)
    },
  },

  mounted() {
    let v
    for (v of Object.values(this.data)) {
      this.tableData.push(v)
    }
  },
}
</script>

<style></style>

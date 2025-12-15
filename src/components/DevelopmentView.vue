<template>
  <div
    id="dev-view"
    class="row q-pa-md">
    <span class="table-title">
      Developer View
    </span>
    <q-card-section v-if="apiResponse.hasOwnProperty('sql_parameters')">
      <h5>Parameters:</h5>
      <div
        class="sql-line"
        v-for="(parameter, index) in apiResponse.sql_parameters"
        :key="`parameter-${index}`">
        <b v-if="index.substring(0, 9) == 'operacija'">
          <br/>
          Operacija {{index.substring(9, 10)}}
        </b>
        <p v-else>
          {{index}}&nbsp;&nbsp;&nbsp;=>&nbsp;&nbsp;&nbsp;{{parameter}}
        </p>
      </div>
    </q-card-section>

    <q-card-section v-if="apiResponse.hasOwnProperty('sql')">
      <h5>SQL statement:</h5>
      <div
        class="sql-line"
        v-for="line in this.sqlFormat(apiResponse.sql)"
        :key="line">
        <b v-if="line.substring(0, 9) == 'Operacija'">
          <br/>
          {{line}}
        </b>
        <p v-else>
          {{line.replace(/--tab--/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')}}
        </p>
      </div>
    </q-card-section>
  </div>
</template>

<script>
export default {
  props: {
    apiResponse: {
      type: Object,
      required: false
    }
  },

  data () {
    return {

    }
  },

  methods: {
    sqlFormat (text) {
      let sql = text.split('--break--')
      return sql
    }
  }
}
</script>

<style lang="scss" scoped>
  .q-card__section {
    width: 100%;
  }

  #add-btn-container span {
    font-size: 16px;
    line-height: 30px;
  }

  #add-btn {
    margin-left: 15px;
    display: none;
  }

  .sql-line p {
    margin: 0px;
  }

  #dev-view h5 {
    margin-bottom: 0px;
  }
</style>

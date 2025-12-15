<template>
  <div
    class="q-pa-md row"
    id="ecrp-container">
    <div class="col-12">
      <div class="card-title top-padding">{{ $t('name_conflict_title') }}</div>
      <div class="row">
        <div class="col-6">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="firstname"
            :label="$t('firstname')"
            @change="(input) => $emit('changeFirstname', input)">
          </q-input>
        </div>
        <div class="col-6">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="lastname"
            :label="$t('lastname')"
            @change="(input) => $emit('changeLastname', input)">
          </q-input>
        </div>
      </div>
    </div>
    <div class="col-12 action-btns">
      <q-btn
        id="cancel-btn"
        size="12px"
        text-color="cro"
        no-caps
        :label="$t('cancel')"
        @click="$emit('closeNameDialog')"/>
      <q-btn
        class="add-user-btn"
        size="12px"
        color="cro-green"
        text-color="white"
        no-caps
        :disable="data.vzrok === '' || data.oznaka === ''"
        @click="$emit('confirmNameConflict')">
          Potrdi
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ecrpNameDialog',

  props: {
    data: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  #ecrp-container {
    padding-top: 20px;
  }
  #ecrp-container .card-title {
    padding-left: 15px;
  }

  #ecrp-container .card-title.top-padding {
    padding-top: 15px;
  }

  #ecrp-container #cancel-btn {
    margin: 15px;
  }

  #ecrp-container .add-user-btn {
    margin: 15px;
    float: right;
  }

  #ecrp-container .sifrant-btn {
    margin: 15px;
    width: -moz-available;
  }

  #ecrp-container .action-btns {
    padding-top: 25px;
  }

  .q-btn.selected {
    background-color: #d5e5e1 !important;
  }

  .q-btn.unselected {
    background-color: #ffffff !important;
  }

  .q-input, .q-select {
    margin: 10px 15px;
    margin-bottom: 0px;
    padding-bottom: 0px;
  }

</style>

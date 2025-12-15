<template>
  <div class="q-pa-md row" id="ecrp-container">
    <div class="col-12">
      <div class="card-title top-padding">{{ $t('reference_title') }}</div>
      <div class="row">
        <div class="col-12">
          <div class="q-pa-md">
            <q-option-group
              :options="this.$user_data.pravice_ecrp"
              type="radio"
              v-model="data.value"
              color="cro-green"
              v-if="this.$user_data.pravice_ecrp.length"
            />
            <span class="no_permissions" v-else> Nimate pravic za vpogled v sistem eCRP </span>
          </div>
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
        @click="$emit('closeNamenDialog', true)"
      />
      <q-btn
        class="add-user-btn"
        size="12px"
        color="cro-green"
        text-color="white"
        no-caps
        :disable="data.value === null"
        @click="confirm"
      >
        Potrdi
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ecrpNamenDialog',

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  methods: {
    confirm() {
      this.$emit('confirmEcrp')
    },
  },

  mounted() {
    if (this.$user_data.pravice_ecrp.length === 1) {
      this.data.value = this.$user_data.pravice_ecrp[0].value
    }
  },
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

#ecrp-container .no_permissions {
  display: flex;
  justify-content: center;
  margin-top: 25px;
  color: #d92531;
}

.q-btn.selected {
  background-color: #d5e5e1 !important;
}

.q-btn.unselected {
  background-color: #ffffff !important;
}

.q-input,
.q-select {
  margin: 10px 15px;
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>

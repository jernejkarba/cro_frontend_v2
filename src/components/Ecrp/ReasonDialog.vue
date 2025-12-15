<template>
  <div
    class="q-pa-md row"
    id="ecrp-container">
    <div class="col-12">
      <div class="card-title top-padding">{{ $t('reason_title') }}</div>
      <div class="row">
        <div class="col-6">
          <div class="q-pa-md">
            <q-option-group
              :options="vzrokOptions"
              type="radio"
              v-model="data.vzrok"
              color="cro-green"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6" v-if="data.vzrok === 'Drugo'">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="data.vzrokDrugo"
            :label="$t('reason')">
            <template v-slot:append>
              <q-icon name="help">
                <q-tooltip>
                  {{$t('reason_help')}}
                </q-tooltip>
              </q-icon>
            </template>
          </q-input>
        </div>

      </div>
    </div>
    <div class="col-12" v-if="!(data.vzrok === 'Konsolidacija' && data.oznaka !== '')">
      <div class="card-title top-padding">{{ $t('oznaka_title') }}</div>
      <div class="row">
        <div class="col-12">
          <div class="q-pa-md">
            <q-input
              color="cro"
              bg-color="white"
              outlined
              bottom-slots
              stack-label
              :dense="true"
              v-model="data.oznaka"
              :label="$t('oznaka')"
              :disable="data.vzrok === 'Konsolidacija' && data.oznaka !== ''"
              :rules="[ val => val.length <= (29 - (data.vzrok === 'Drugo' ? data.vzrokDrugo.length : data.vzrok.length)) || 'Vpišete lahko največ ' + (29 - (data.vzrok === 'Drugo' ? data.vzrokDrugo.length : data.vzrok.length)) + ' znakov']">
              <template v-slot:append>
                <q-icon name="help">
                  <q-tooltip>
                  {{$t('oznaka_help')}}
                </q-tooltip>
              </q-icon>
              </template>
            </q-input>
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
        @click="$emit('closeDialog', true)"/>
      <q-btn
        class="add-user-btn"
        size="12px"
        color="cro-green"
        text-color="white"
        no-caps
        :disable="data.vzrok === '' || (data.vzrok === 'Drugo' && data.vzrokDrugo === '') || data.oznaka === ''"
        @click="confirm">
          Potrdi
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ecrpDialog',

  props: {
    data: {
      type: Object,
      required: true
    },
    ecrpReference: {
      type: String,
      required: false,
      default: ''
    },
    vzrokOptions: {
      type: Array,
      required: true
    },
    namenOptions: {
      type: Array,
      required: true
    }
  },

  methods: {
    confirm () {
      this.$emit('confirmEcrp')
    }
  },

  mounted () {
    if (this.ecrpReference !== '') {
      this.confirm()
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

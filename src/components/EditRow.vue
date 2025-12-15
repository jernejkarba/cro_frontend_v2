<template>
  <q-tr class="full-width" id="edit-div">
    <q-td></q-td>
    <q-td></q-td>
    <q-td v-if="visibleColumns.includes('KonsolidacijskaDavcnaStevilka')"></q-td>
    <q-td v-if="visibleColumns.includes('StopnjaZaupanja')"></q-td>
    <q-td v-if="visibleColumns.includes('EZSO')"></q-td>
    <q-td v-if="visibleColumns.includes('NazivOsebe')">
      <q-input
        color="cro"
        bg-color="white"
        outlined
        stack-label
        :dense="true"
        v-model="editValues['NazivOsebe']"
        :label="$t('naziv')"
        @update:model-value="
          (val) => {
            editValues['NazivOsebe'] = val.toUpperCase()
          }
        "
      >
      </q-input>
    </q-td>
    <q-td v-if="visibleColumns.includes('DavcnaStevilka')">
      <q-input
        color="cro"
        bg-color="white"
        outlined
        stack-label
        :dense="true"
        v-model="editValues['DavcnaStevilka']"
        :label="$t('davcna')"
      >
      </q-input>
    </q-td>
    <q-td v-if="visibleColumns.includes('StopnjaPravilnosti')"></q-td>
    <q-td v-if="visibleColumns.includes('EMSO')">
      <q-input
        color="cro"
        bg-color="white"
        outlined
        stack-label
        :dense="true"
        v-model="editValues['EMSO']"
        maxlength="1"
        @update:model-value="
          (val) => {
            editValues['EMSO'] = val != '#' ? '' : '#'
          }
        "
        :label="$t('emso')"
      >
      </q-input>
    </q-td>
    <q-td v-if="visibleColumns.includes('DtRojstva')">
      <q-input
        color="cro"
        bg-color="white"
        outlined
        v-model="editValues['DtRojstva']"
        stack-label
        :dense="true"
        :label="$t('dt_rojstva')"
        style="width: 125px"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer" style="font-size: 15px; padding-top: 13px">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date
                color="cro-green"
                v-model="editValues['DtRojstva']"
                @update:model-value="() => $refs.qDateProxy.hide()"
                minimal
                mask="DD.MM.YYYY"
              >
                <q-btn
                  id="rmvDateBtn"
                  class="items-start"
                  label="Izbriši rojstne datume izbranih zadetkov"
                  icon="img:trash-can-outline.svg"
                  color="cro-green"
                  flat
                  @click="removeDtRojstva()"
                  v-close-popup
                />
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </q-td>
    <q-td v-if="visibleColumns.includes('Naslov')">
      <div class="row" style="min-width: 240px">
        <div class="col" style="min-width: 120px">
          <q-input
            name="naziv-uredi-izbrane"
            color="cro"
            bg-color="white"
            style="margin-right: 5px; cursor: pointer"
            readonly
            outlined
            stack-label
            :dense="true"
            v-model="editValues['NaslovZdruzen']"
            :label="$t('naslov')"
            @click="openSifrantNaslovovBatchDialog()"
          >
            <q-icon
              left
              style="margin-top: 18px; margin-right: 4px"
              name="mdi-file-search"
              color="cro-green"
            />
          </q-input>
        </div>
        <div class="col-2" style="min-width: 60px">
          <q-input
            color="cro"
            bg-color="white"
            style="margin-right: 5px"
            outlined
            stack-label
            :dense="true"
            v-model="editValues['HisnaSt']"
            :label="$t('hisna_st_short')"
            maxlength="4"
            @update:model-value="
              (val) => {
                editValues['HisnaSt'] = val.replace(/\D/g, '')
              }
            "
          >
          </q-input>
        </div>
        <div class="col-2" style="min-width: 60px">
          <q-input
            color="cro"
            bg-color="white"
            style="margin-right: 5px"
            outlined
            stack-label
            :dense="true"
            v-model="editValues['HisnaStOznaka']"
            :label="$t('hisna_st_oznaka_short')"
            maxlength="3"
            @update:model-value="
              (val) => {
                editValues['HisnaStOznaka'] = val.replace(/[0-9]/g, '').toUpperCase()
              }
            "
          >
          </q-input>
        </div>
      </div>
    </q-td>
    <q-td v-if="visibleColumns.includes('Spol')">
      <q-select
        color="cro"
        bg-color="white"
        outlined
        stack-label
        :dense="true"
        v-model="editValues['Spol']"
        :label="$t('spol')"
        :options="spolOptions"
      >
      </q-select>
    </q-td>
    <q-td v-if="visibleColumns.includes('VrstaOsebe')">
      <q-select
        color="cro"
        bg-color="white"
        outlined
        stack-label
        :dense="true"
        emit-value
        map-options
        v-model="editValues['VrstaOsebe']"
        :label="$t('vrsta_osebe')"
        :options="vrstaOsebeOptions"
      >
      </q-select>
    </q-td>
    <q-td></q-td>
    <q-td>
      <q-btn
        round
        color="negative"
        icon="clear"
        size="sm"
        style="margin-right: 5px"
        @click="$emit('closeEditRow')"
      />
      <q-btn
        round
        color="cro-green"
        icon="done"
        size="sm"
        closeEditRow
        v-if="editOK"
        @click="$emit('editSelectedUsers', { values: editValues, option: 'inline' })"
      />

      <q-btn round color="warning" icon="priority_high" size="sm" v-else>
        <q-tooltip>
          {{ $t('edit_warning') }}
        </q-tooltip>
      </q-btn>
    </q-td>

    <q-dialog v-model="sifrantNaslovovDialog" transition-show="slide-up" transition-hide="slide-up">
      <q-card
        class="bg-white"
        style="width: 750px; max-width: 90vw; min-width: 710px; padding-bottom: 25px"
      >
        <q-bar class="bg-cro-green">
          Šifrant ulic, naselij in pošt
          <q-space />
          <q-btn flat icon="close" class="close-btn" @click="closeSifrantNaslovovBatchDialog()">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <SifrantNaslovov
            @useDataFromSifrant="useDataFromSifrantBatch($event)"
            @closeSifrantNaslovovDialog="closeSifrantNaslovovBatchDialog($event)"
          >
          </SifrantNaslovov>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-tr>
</template>

<script>
import SifrantNaslovov from 'components/SifrantNaslovovDialog/Dialog.vue'
// import Vue from 'vue'

export default {
  name: 'editRow',
  components: {
    SifrantNaslovov,
  },

  props: {
    editValues: {
      type: Object,
      required: true,
    },
    visibleColumns: {
      type: [Object, Array],
      required: true,
    },
    vrstaOsebeOptions: {
      type: Array,
      required: true,
    },
    spolOptions: {
      type: Array,
      required: true,
    },
    editOK: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      sifrantNaslovovDialog: false,
    }
  },

  methods: {
    removeDtRojstva() {
      this.editValues.DtRojstva = '#'
    },

    openSifrantNaslovovBatchDialog() {
      this.sifrantNaslovovDialog = true
    },

    closeSifrantNaslovovBatchDialog() {
      this.sifrantNaslovovDialog = false
    },

    useDataFromSifrantBatch(data) {
      if (data.length > 0) {
        this.editValues['Ulica'] = data[0].Ulica
        this.editValues['Naselje'] = data[0].Naselje
        this.editValues['Posta'] = data[0].Posta
        this.editValues['PostaSt'] = data[0].PostnaSt
        this.closeSifrantNaslovovBatchDialog()
        this.setNaslovZdruzen()
      } else {
        this.$noty.error(this.$t('sn_select_empty'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
      }
    },

    setNaslovZdruzen() {
      if (this.editValues['Ulica'] !== '') {
        this.editValues['HisnaSt'] = this.editValues['HisnaSt'] || ''
        this.editValues['HisnaStOznaka'] = this.editValues['HisnaStOznaka'] || ''

        this.editValues['NaslovZdruzen'] = `${this.editValues['Ulica']} ${this.editValues[
          'HisnaSt'
        ].trim()}${this.editValues['HisnaStOznaka'].trim()}; ${this.editValues['PostaSt']} ${
          this.editValues['Posta']
        }`
      }
    },
  },

  watch: {
    'editValues.HisnaSt': function (newVal, oldVal) {
      this.setNaslovZdruzen()
    },
    'editValues.HisnaStOznaka': function (newVal, oldVal) {
      this.setNaslovZdruzen()
    },
    'editValues.EMSO': function (newVal, oldVal) {
      this.editValues['EMSO'] = newVal !== '#' ? '' : '#'
    },
  },
}
</script>

<style lang="scss" scoped>
#edit-row-div {
  margin-top: 0px;
}

#edit-row-div .q-input,
#edit-row-div .q-btn {
  margin: 5px;
}

#edit-title {
  font-size: 12px;
}
</style>
<style lang="scss">
input[name='naziv-uredi-izbrane'] {
  cursor: pointer !important;
}
</style>

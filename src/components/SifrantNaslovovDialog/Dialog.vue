<template>
  <div class="q-pa-md row" id="sifrant-naslovov-container">
    <div class="col-12">
      <div class="row">
        <div class="col-6 bg-gray">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="filterData.Ulica"
            @update:model-value="
              (val) => {
                filterData.Ulica = val.toUpperCase()
              }
            "
            @keydown.enter.prevent="search"
            :label="$t('ulica')"
          >
          </q-input>

          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="filterData.Naselje"
            @update:model-value="
              (val) => {
                filterData.Naselje = val.toUpperCase()
              }
            "
            @keydown.enter.prevent="search"
            :label="$t('naselje')"
          >
          </q-input>

          <q-input
            class="posta-field"
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="filterData.PostnaSt"
            @update:model-value="
              (val) => {
                filterData.PostnaSt = val.toUpperCase()
              }
            "
            @keydown.enter.prevent="search"
            :label="$t('postna_stevilka')"
          >
          </q-input>

          <q-btn
            id="search-btn"
            size="12px"
            color="cro-green"
            text-color="white"
            no-caps
            :label="$t('search')"
            @click="search"
          />
        </div>

        <div class="col-6">
          <div id="info-note">
            <q-icon id="icon" name="mdi-information-outline" />
            <p id="note">{{ $t('sifrant_info_note') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <SNTable @selectRow="selectRow($event)" :data="data"> </SNTable>
    </div>

    <div class="col-12">
      <div id="action-btn-wrapper">
        <q-btn
          size="12px"
          color="white"
          text-color="cro"
          style="margin-right: 15px"
          no-caps
          :label="$t('cancel')"
          @click="$emit('closeSifrantNaslovovDialog')"
        />

        <q-btn
          size="12px"
          color="cro-green"
          text-color="white"
          no-caps
          :label="$t('select')"
          @click="selectData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SNTable from 'components/SifrantNaslovovDialog/SNTable.vue'

export default {
  name: 'sifrantNaslovovDialog',
  components: {
    SNTable,
  },

  data() {
    return {
      data: [],
      filterData: {},
      selectedSifrant: [],
    }
  },

  methods: {
    search() {
      // Data validation
      if (Object.keys(this.filterData).length === 0) {
        this.$noty.error(this.$t('empty_sn_filters'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      this.$q.loading.show()
      this.api
        .post('SifrantNaslovov', {
          ...this.filterData,
        })
        .then((result) => {
          this.$emit('refresh_token', result.data.token)
          this.$q.loading.hide()

          if (result.data.success === true) {
            this.data = result.data.podatki
          } else {
            this.$noty.error(this.$t(result.data.message_key), {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.$noty.error('Seja je potekla. Potrebna je ponovna prijava.', {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
            setTimeout(() => this.$router.push('/login'), 3000)
          } else if (error.response && error.response.status === 403) {
            this.$noty.error('Nimate pravic za izvedbo te akcije.', {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          } else {
            this.$noty.error('Napaka pri komunikaciji s strežnikom.', {
              killer: false,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
            setTimeout(() => this.$router.push('/login'), 3000)
          }
        })
    },

    selectRow(row) {
      this.selectedSifrant = row
    },

    selectData() {
      this.$emit('useDataFromSifrant', this.selectedSifrant)
    },
  },
}
</script>

<style lang="scss" scoped>
#sifrant-naslovov-container .posta-field {
  max-width: 130px;
  display: inline-flex;
}

#sifrant-naslovov-container #search-btn {
  display: inline-flex;
  float: right;
  margin: 15px;
}

#sifrant-naslovov-container #info-note {
  margin-left: 15px;
  padding: 15px;
  background-color: #ecf2f0;
  border-radius: 4px;
  color: #838384;
}

#sifrant-naslovov-container #info-note #icon {
  display: inline-flex;
  font-size: 18px;
}

#sifrant-naslovov-container #info-note #note {
  display: inline-flex;
  width: calc(100% - 20px);
  padding-left: 5px;
  margin-bottom: 0px;
}

#sifrant-naslovov-container #action-btn-wrapper {
  float: right;
  margin-top: 25px;
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

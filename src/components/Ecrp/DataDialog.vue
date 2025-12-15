<template>
  <div class="q-pa-md row" id="ecrp-container">
    <div class="col-12" v-if="!onlyAddresses">
      <div class="row data-row">
        <template v-for="(value, index) in data" :key="index">
          <div
            :class="selected.includes(index) ? 'col-2 selected-row' : 'col-2'"
            v-if="typeof value.title != 'undefined' && value.ecrp !== null"
          >
            <q-item tag="label" v-ripple>
              <q-item-section avatar center>
                <q-checkbox
                  :model-value="selected"
                  :val="index"
                  color="cro-green"
                  :disable="value.ecrp === value.cro"
                  @update:model-value="
                    (val) => {
                      $emit('update:selected', val)
                      $emit('selectData', val)
                    }
                  "
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ value.title }}
                  <q-icon
                    class="ecrp_icon"
                    :name="
                      value.ecrp !== value.cro
                        ? 'mdi-alert-circle-outline'
                        : 'mdi-check-circle-outline'
                    "
                    :color="value.ecrp !== value.cro ? 'cro-red' : 'cro-green'"
                  >
                    <q-tooltip>
                      {{
                        value.cro === '/'
                          ? $t('ecrp_no_data')
                          : value.ecrp !== value.cro
                          ? $t('ecrp_difference')
                          : $t('ecrp_matching')
                      }}
                    </q-tooltip>
                  </q-icon>
                </q-item-label>
                <q-item-label class="main-value">{{ value.ecrp }}</q-item-label>
                <q-item-label :class="value.ecrp !== value.cro ? 'text-cro-red' : ''" caption>{{
                  value.cro
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </template>
      </div>
    </div>

    <div class="col-12" v-if="Object.keys(data.Naslovi).length > 1">
      <div class="row more-addresses">
        <q-icon class="ecrp_icon" name="mdi-alert-circle-outline" color="cro-red"> </q-icon>
        <span> Obstaja več naslovov </span>
      </div>
    </div>

    <!-- Stalni naslov -->
    <div class="col-12 address-row" v-if="'stalni' in data.Naslovi">
      <div class="row">
        <span class="address-title">Stalni naslov</span>
      </div>
      <div :class="selected.includes('stalni_naslov') ? 'row selected-address' : 'row'">
        <template v-for="(value, index) in data.Naslovi.stalni" :key="index">
          <div
            :class="
              index === 'Posta' ||
              index === 'PostaSt' ||
              index === 'HisnaStOznaka' ||
              index === 'HisnaSt'
                ? 'col-1 col-1'
                : 'col-2 col-2'
            "
            v-if="typeof value.title != 'undefined'"
          >
            <q-item tag="label" v-ripple>
              <q-item-section v-if="index === 'Ulica'" avatar center>
                <q-checkbox
                  :model-value="selected"
                  val="stalni_naslov"
                  color="cro-green"
                  :disable="disabledCheckboxAddress(data.Naslovi.stalni)"
                  @update:model-value="
                    (val) => {
                      $emit('update:selected', val)
                      $emit('selectData', val)
                    }
                  "
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ value.title }}
                  <q-icon
                    class="ecrp_icon"
                    :name="
                      index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                        ? 'mdi-alert-circle-outline'
                        : value.cro === null && value.ecrp === null
                        ? 'mdi-alert-circle-outline'
                        : 'mdi-check-circle-outline'
                    "
                    :color="
                      index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                        ? 'cro-red'
                        : value.cro === null && value.ecrp === null
                        ? 'cro-yellow'
                        : 'cro-green'
                    "
                  >
                    <q-tooltip>
                      {{
                        index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                          ? $t('ecrp_difference')
                          : value.cro === null && value.ecrp === null
                          ? $t('cro_ecrp_no_data')
                          : $t('ecrp_matching')
                      }}
                    </q-tooltip>
                  </q-icon>
                </q-item-label>
                <q-item-label class="main-value">{{ value.ecrp }}</q-item-label>
                <q-item-label
                  :class="
                    index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                      ? 'text-cro-red'
                      : ''
                  "
                  caption
                  >{{ value.cro }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </div>
        </template>
      </div>
    </div>
    <!-- Začasni naslov -->
    <div class="col-12 address-row" v-if="'zacasni' in data.Naslovi">
      <div class="row">
        <span class="address-title">Začasni naslov</span>
        <span
          class="address-duration"
          v-if="
            data.temporaryResidenceStartDate.ecrp !== null &&
            data.temporaryResidenceEndDate.ecrp !== null
          "
        >
          ({{ data.temporaryResidenceStartDate.ecrp }} - {{ data.temporaryResidenceEndDate.ecrp }})
        </span>
      </div>
      <div :class="selected.includes('zacasni_naslov') ? 'row selected-address' : 'row'">
        <template v-for="(value, index) in data.Naslovi.zacasni" :key="index">
          <div
            :class="
              index === 'Posta' ||
              index === 'PostaSt' ||
              index === 'HisnaStOznaka' ||
              index === 'HisnaSt'
                ? 'col-1 col-1'
                : 'col-2 col-2'
            "
            v-if="typeof value.title != 'undefined'"
          >
            <q-item tag="label" v-ripple>
              <q-item-section v-if="index === 'Ulica'" avatar center>
                <q-checkbox
                  :model-value="selected"
                  val="zacasni_naslov"
                  color="cro-green"
                  :disable="disabledCheckboxAddress(data.Naslovi.zacasni)"
                  @update:model-value="
                    (val) => {
                      $emit('update:selected', val)
                      $emit('selectData', val)
                    }
                  "
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ value.title }}
                  <q-icon
                    class="ecrp_icon"
                    :name="
                      index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                        ? 'mdi-alert-circle-outline'
                        : value.cro === null && value.ecrp === null
                        ? 'mdi-alert-circle-outline'
                        : 'mdi-check-circle-outline'
                    "
                    :color="
                      index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                        ? 'cro-red'
                        : value.cro === null && value.ecrp === null
                        ? 'cro-yellow'
                        : 'cro-green'
                    "
                  >
                    <q-tooltip>
                      {{
                        index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                          ? $t('ecrp_difference')
                          : value.cro === null && value.ecrp === null
                          ? $t('cro_ecrp_no_data')
                          : $t('ecrp_matching')
                      }}
                    </q-tooltip>
                  </q-icon>
                </q-item-label>
                <q-item-label class="main-value">{{ value.ecrp }}</q-item-label>
                <q-item-label
                  :class="
                    index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                      ? 'text-cro-red'
                      : ''
                  "
                  caption
                  >{{ value.cro }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </div>
        </template>
      </div>
    </div>
    <!-- Naslov za vročanje -->
    <div class="col-12 address-row" v-if="'vrocanje' in data.Naslovi">
      <div class="row">
        <span class="address-title">Naslov za vročanje</span>
      </div>
      <div :class="selected.includes('vrocanje_naslov') ? 'row selected-address' : 'row'">
        <template v-for="(value, index) in data.Naslovi.vrocanje" :key="index">
          <div
            :class="
              index === 'Posta' ||
              index === 'PostaSt' ||
              index === 'HisnaStOznaka' ||
              index === 'HisnaSt'
                ? 'col-1 col-1'
                : 'col-2 col-2'
            "
            v-if="typeof value.title != 'undefined'"
          >
            <q-item tag="label" v-ripple>
              <q-item-section v-if="index === 'Ulica'" avatar center>
                <q-checkbox
                  :model-value="selected"
                  val="vrocanje_naslov"
                  color="cro-green"
                  :disable="disabledCheckboxAddress(data.Naslovi.vrocanje)"
                  @update:model-value="
                    (val) => {
                      $emit('update:selected', val)
                      $emit('selectData', val)
                    }
                  "
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ value.title }}
                  <q-icon
                    class="ecrp_icon"
                    :name="
                      index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                        ? 'mdi-alert-circle-outline'
                        : value.cro === null && value.ecrp === null
                        ? 'mdi-alert-circle-outline'
                        : 'mdi-check-circle-outline'
                    "
                    :color="
                      index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                        ? 'cro-red'
                        : value.cro === null && value.ecrp === null
                        ? 'cro-yellow'
                        : 'cro-green'
                    "
                  >
                    <q-tooltip>
                      {{
                        index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                          ? $t('ecrp_difference')
                          : value.cro === null && value.ecrp === null
                          ? $t('cro_ecrp_no_data')
                          : $t('ecrp_matching')
                      }}
                    </q-tooltip>
                  </q-icon>
                </q-item-label>
                <q-item-label class="main-value">{{ value.ecrp }}</q-item-label>
                <q-item-label
                  :class="
                    index !== 'Posta' && value.ecrp !== value.cro && value.ecrp !== null
                      ? 'text-cro-red'
                      : ''
                  "
                  caption
                  >{{ value.cro }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </div>
        </template>
      </div>
    </div>
    <!-- Naslov v tujini -->
    <div class="col-12 address-row" v-if="'tujina' in data.Naslovi">
      <div class="row">
        <span class="address-title">Naslov v tujini</span>
      </div>
      <div :class="selected.includes('tujina_naslov') ? 'row selected-address' : 'row'">
        <template v-for="(value, index) in data.Naslovi.tujina" :key="index">
          <div
            :class="
              index === 'Posta' ||
              index === 'PostaSt' ||
              index === 'HisnaStOznaka' ||
              index === 'HisnaSt'
                ? 'col-1 col-1'
                : 'col-2 col-2'
            "
            v-if="typeof value.title != 'undefined'"
          >
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>
                  {{ value.title }}
                </q-item-label>
                <q-item-label class="main-value">{{ value.ecrp }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </template>
      </div>
    </div>
    <div
      class="col-12 address-row"
      v-if="data.residenceStatus && data.residenceStatus.ecrp !== null"
    >
      <div class="row">
        <span class="address-title">Status prebivališča</span>
      </div>
      <div class="row">
        <div class="col">
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label class="main-value">{{
                $t(data.residenceStatus.ecrp.toLowerCase())
              }}</q-item-label>
            </q-item-section>
          </q-item>
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
        @click="$emit('closeDataDialog', true)"
      />
      <q-btn
        class="add-user-btn"
        size="12px"
        color="cro-green"
        text-color="white"
        no-caps
        :disable="!selected.length"
        v-if="!onlyAddresses"
        @click="confirm"
      >
        Spremeni v izbrane podatke
      </q-btn>
      <q-btn
        class="add-user-btn"
        size="12px"
        color="cro-green"
        text-color="white"
        no-caps
        :disable="!selected.length"
        v-else
        @click="$emit('selectAddress')"
      >
        Izberi naslov
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ecrpDataDialog',

  props: {
    data: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    selected: {
      type: Array,
      required: true,
    },
    onlyAddresses: {
      type: Boolean,
      required: false,
      default: false,
    },
    program: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      davcnaOk: false,
      emsoOk: false,
      usn: false,
      test: '',
      postnaOptions: [],
      drzavaOptions: [],
      obcinaOptions: [],
      naseljeOptions: [],
      Options: [],
      addressFields: [
        'Naselje',
        'Ulica',
        'Posta',
        'PostaSt',
        'Obcina',
        'IDObcine',
        'HisnaSt',
        'HisnaStOznaka',
      ],
      sourceTipOsb: [
        {
          label: this.$t('pravna'),
          value: '1',
        },
        {
          label: this.$t('fizicna'),
          value: '2',
        },
      ],
    }
  },

  methods: {
    confirm() {
      // Vzrok validation
      if (this.selected.length === 0) {
        this.$noty.error(this.$t('invalid_selected'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      const program = this.$route.query.integracija ? this.$route.query.integracija : this.program
      this.$q.loading.show()
      this.api
        .post('EcrpEdit', {
          Data: this.data,
          User: this.user,
          Izbor: this.selected,
          Program: program,
        })
        .then((result) => {
          this.$emit('refresh_token', result.data.token)

          this.$q.loading.hide()
          // this.setResponse(result.data)

          if (result.data.success === true) {
            this.$emit('closeDataDialog')
            this.$emit('updateAfterEdit', [this.user.EZSO])
            this.$noty.success(this.$t(result.data.message_key), {
              killer: false,
              timeout: 2000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          } else {
            this.$noty.error(this.$t(result.data.message), {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
          }

          let fields = Object.keys(this.data)
            .filter((key) => this.selected.includes(key))
            .reduce((obj, key) => {
              obj[key] = this.data[key]
              return obj
            }, {})

          if (this.selected.includes('stalni_naslov')) {
            fields = Object.assign(fields, this.data.Naslovi.stalni)
          } else if (this.selected.includes('zacasni_naslov')) {
            fields = Object.assign(fields, this.data.Naslovi.zacasni)
          } else if (this.selected.includes('vrocanje_naslov')) {
            fields = Object.assign(fields, this.data.Naslovi.vrocanje)
          } else if (this.selected.includes('tujina_naslov')) {
            fields = Object.assign(fields, this.data.Naslovi.tujina)
          }

          this.$emit('sendMessage', { msg: result.data.message_key, fields: fields })
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

    disabledCheckboxAddress(value) {
      if (
        value.Ulica.cro === value.Ulica.ecrp &&
        value.HisnaSt.cro === value.HisnaSt.ecrp &&
        value.HisnaStOznaka.cro === value.HisnaStOznaka.ecrp &&
        value.Posta.cro === value.Posta.ecrp &&
        value.PostaSt.cro === value.PostaSt.ecrp &&
        value.Naselje.cro === value.Naselje.ecrp &&
        (value.IDObcine.cro === value.IDObcine.ecrp || value.Obcina.cro === value.Obcina.ecrp)
      ) {
        return true
      }

      return false
    },
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

#ecrp-container .col-2-3 {
  width: 20% !important;
}

#ecrp-container .data-row {
  background-color: #fff7eb;
}

#ecrp-container .more-addresses {
  padding: 10px 0px;
  color: #939393;
}

#ecrp-container .more-addresses i {
  margin-right: 5px;
}

#ecrp-container .action-btns {
  padding-top: 25px;
  border-top: 1px solid #d3d3d3;
}

#ecrp-container .address-row {
  border-top: 1px solid #d3d3d3;
  margin-bottom: 5px;
}

#ecrp-container .address-row .address-title,
#ecrp-container .address-row .address-duration {
  color: #525252;
  padding: 10px 0px 5px 0px;
}

#ecrp-container .address-row .address-duration {
  padding-left: 15px;
  font-size: 12px;
}

#ecrp-container .selected-row,
#ecrp-container .address-row .selected-address {
  background-color: #edf5f3;
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

.main-value {
  font-size: 16px;
  color: #000000;
}

.ecrp_icon {
  font-size: 18px;
  margin-top: -3px;
}
</style>

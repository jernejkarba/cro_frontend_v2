<template>
  <div id="fk-action-container" class="q-pa-md">
    <q-card>
      <div class="row">
        <q-input
          color="cro"
          bg-color="white"
          outlined
          bottom-slots
          stack-label
          v-model="actionValues['dt_zapadlosti_salda']"
          mask="##.##.####"
          :label="$t('fk_dt_zapadlosti_salda')"
          style="max-width: 170px"
          :disable="actionValues['izpis_vseh_polic']"
        >
          <template v-slot:append>
            <q-icon
              v-if="actionValues['dt_zapadlosti_salda'] === '#'"
              name="delete_outline"
              class="cursor-pointer"
              style="font-size: 15px; padding-top: 13px; color: #c10013"
            />
            <q-icon name="event" class="cursor-pointer" style="font-size: 15px; padding-top: 13px">
              <q-popup-proxy
                ref="qDateProxyS"
                transition-show="scale"
                transition-hide="scale"
                :offset="[200, 200]"
              >
                <q-date
                  color="cro-green"
                  v-model="actionValues['dt_zapadlosti_salda']"
                  @update:model-value="() => $refs.qDateProxyS.hide()"
                  minimal
                  mask="DD.MM.YYYY"
                >
                  <q-btn
                    id="rmvDateBtn"
                    class="items-start"
                    label="Izbriši datum"
                    icon="img:trash-can-outline.svg"
                    color="cro-green"
                    flat
                    @click="actionValues['dt_zapadlosti_salda'] = '#'"
                    v-close-popup
                  />
                  <q-btn
                    id="currentDateBtn"
                    class="items-start"
                    label="Današnji dan"
                    color="cro-green"
                    flat
                    @click="
                      actionValues['dt_zapadlosti_salda'] = formatDate(new Date(), 'dd.mm.yyyy')
                    "
                  />
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          color="cro"
          bg-color="white"
          outlined
          bottom-slots
          stack-label
          v-model="actionValues['dt_zapadlosti_terjatev']"
          mask="##.##.####"
          :label="$t('fk_dt_zapadlosti_terjatev')"
          style="max-width: 170px"
        >
          <template v-slot:append>
            <q-icon
              v-if="actionValues['dt_zapadlosti_terjatev'] === '#'"
              name="delete_outline"
              class="cursor-pointer"
              style="font-size: 15px; padding-top: 13px; color: #c10013"
            />
            <q-icon name="event" class="cursor-pointer" style="font-size: 15px; padding-top: 13px">
              <q-popup-proxy ref="qDateProxyT" transition-show="scale" transition-hide="scale">
                <q-date
                  color="cro-green"
                  v-model="actionValues['dt_zapadlosti_terjatev']"
                  @update:model-value="() => $refs.qDateProxyT.hide()"
                  minimal
                  mask="DD.MM.YYYY"
                >
                  <q-btn
                    id="rmvDateBtn"
                    class="items-start"
                    label="Izbriši datum"
                    icon="img:trash-can-outline.svg"
                    color="cro-green"
                    flat
                    @click="actionValues['dt_zapadlosti_terjatev'] = '#'"
                    v-close-popup
                  />
                  <q-btn
                    id="currentDateBtn"
                    class="items-start"
                    label="Današnji dan"
                    color="cro-green"
                    flat
                    @click="
                      actionValues['dt_zapadlosti_terjatev'] = formatDate(new Date(), 'dd.mm.yyyy')
                    "
                  />
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <div class="action-checkbox">
          <div>
            <q-checkbox
              v-model="actionValues['ugotavljanje_fakturnih_st']"
              :label="$t('fk_ugotavljanje_fakturnih_st')"
              color="cro-green"
            />
            <q-checkbox
              v-model="actionValues['izpis_vseh_polic']"
              :label="$t('fk_izpis_vseh_polic')"
              color="cro-green"
            />
          </div>
          <div>
            <q-checkbox
              v-model="actionValues['obravnavanje_kne']"
              :label="$t('fk_obravnjavanje_kne')"
              color="cro-green"
            />
            <q-checkbox
              v-model="actionValues['izpis_vseh_terjatev']"
              :label="$t('fk_izpis_vseh_terjatev')"
              color="cro-green"
              :disable="actionValues['vse_terjatve_disable']"
            />
          </div>
        </div>

        <q-input
          color="cro"
          bg-color="white"
          outlined
          bottom-slots
          stack-label
          v-model="actionValues['dt_sklenitve_od']"
          mask="##.##.####"
          :label="$t('fk_dt_sklenitve_od')"
          style="max-width: 135px"
        >
          <template v-slot:append>
            <q-icon
              v-if="actionValues['dt_sklenitve_od'] === '#'"
              name="delete_outline"
              class="cursor-pointer"
              style="font-size: 15px; padding-top: 13px; color: #c10013"
            />
            <q-icon name="event" class="cursor-pointer" style="font-size: 15px; padding-top: 13px">
              <q-popup-proxy ref="qDateProxyS" transition-show="scale" transition-hide="scale">
                <q-date
                  color="cro-green"
                  v-model="actionValues['dt_sklenitve_od']"
                  @update:model-value="() => $refs.qDateProxyS.hide()"
                  minimal
                  mask="DD.MM.YYYY"
                >
                  <q-btn
                    id="rmvDateBtn"
                    class="items-start"
                    label="Izbriši datum"
                    icon="img:trash-can-outline.svg"
                    color="cro-green"
                    flat
                    @click="actionValues['dt_sklenitve_od'] = '#'"
                    v-close-popup
                  />
                  <q-btn
                    id="currentDateBtn"
                    class="items-start"
                    label="Današnji dan"
                    color="cro-green"
                    flat
                    @click="actionValues['dt_sklenitve_od'] = formatDate(new Date(), 'dd.mm.yyyy')"
                  />
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          color="cro"
          bg-color="white"
          outlined
          bottom-slots
          stack-label
          v-model="actionValues['dt_sklenitve_do']"
          mask="##.##.####"
          :label="$t('fk_dt_sklenitve_do')"
          style="max-width: 135px"
        >
          <template v-slot:append>
            <q-icon
              v-if="actionValues['dt_sklenitve_do'] === '#'"
              name="delete_outline"
              class="cursor-pointer"
              style="font-size: 15px; padding-top: 13px; color: #c10013"
            />
            <q-icon name="event" class="cursor-pointer" style="font-size: 15px; padding-top: 13px">
              <q-popup-proxy ref="qDateProxyT" transition-show="scale" transition-hide="scale">
                <q-date
                  color="cro-green"
                  v-model="actionValues['dt_sklenitve_do']"
                  @update:model-value="() => $refs.qDateProxyT.hide()"
                  minimal
                  mask="DD.MM.YYYY"
                >
                  <q-btn
                    id="rmvDateBtn"
                    class="items-start"
                    label="Izbriši datum"
                    icon="img:trash-can-outline.svg"
                    color="cro-green"
                    flat
                    @click="actionValues['dt_sklenitve_do'] = '#'"
                    v-close-popup
                  />
                  <q-btn
                    id="currentDateBtn"
                    class="items-start"
                    label="Današnji dan"
                    color="cro-green"
                    flat
                    @click="actionValues['dt_sklenitve_do'] = formatDate(new Date(), 'dd.mm.yyyy')"
                  />
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          color="cro"
          bg-color="white"
          outlined
          bottom-slots
          stack-label
          v-model="actionValues['dt_placil_od']"
          mask="##.##.####"
          :label="$t('fk_dt_placil_od')"
          style="max-width: 135px"
        >
          <template v-slot:append>
            <q-icon
              v-if="actionValues['dt_placil_od'] === '#'"
              name="delete_outline"
              class="cursor-pointer"
              style="font-size: 15px; padding-top: 13px; color: #c10013"
            />
            <q-icon name="event" class="cursor-pointer" style="font-size: 15px; padding-top: 13px">
              <q-popup-proxy ref="qDateProxyS" transition-show="scale" transition-hide="scale">
                <q-date
                  color="cro-green"
                  v-model="actionValues['dt_placil_od']"
                  @update:model-value="() => $refs.qDateProxyS.hide()"
                  minimal
                  mask="DD.MM.YYYY"
                >
                  <q-btn
                    id="rmvDateBtn"
                    class="items-start"
                    label="Izbriši datum"
                    icon="img:trash-can-outline.svg"
                    color="cro-green"
                    flat
                    @click="actionValues['dt_placil_od'] = '#'"
                    v-close-popup
                  />
                  <q-btn
                    id="currentDateBtn"
                    class="items-start"
                    label="Današnji dan"
                    color="cro-green"
                    flat
                    @click="actionValues['dt_placil_od'] = formatDate(new Date(), 'dd.mm.yyyy')"
                  />
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          color="cro"
          bg-color="white"
          outlined
          bottom-slots
          stack-label
          v-model="actionValues['dt_placil_do']"
          mask="##.##.####"
          :label="$t('fk_dt_placil_do')"
          style="max-width: 135px"
        >
          <template v-slot:append>
            <q-icon
              v-if="actionValues['dt_placil_do'] === '#'"
              name="delete_outline"
              class="cursor-pointer"
              style="font-size: 15px; padding-top: 13px; color: #c10013"
            />
            <q-icon name="event" class="cursor-pointer" style="font-size: 15px; padding-top: 13px">
              <q-popup-proxy ref="qDateProxyT" transition-show="scale" transition-hide="scale">
                <q-date
                  color="cro-green"
                  v-model="actionValues['dt_placil_do']"
                  @update:model-value="() => $refs.qDateProxyT.hide()"
                  minimal
                  mask="DD.MM.YYYY"
                >
                  <q-btn
                    id="rmvDateBtn"
                    class="items-start"
                    label="Izbriši datum"
                    icon="img:trash-can-outline.svg"
                    color="cro-green"
                    flat
                    @click="actionValues['dt_placil_do'] = '#'"
                    v-close-popup
                  />
                  <q-btn
                    id="currentDateBtn"
                    class="items-start"
                    label="Današnji dan"
                    color="cro-green"
                    flat
                    @click="actionValues['dt_placil_do'] = formatDate(new Date(), 'dd.mm.yyyy')"
                  />
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-select
          color="cro"
          bg-color="white"
          outlined
          stack-label
          emit-value
          map-options
          v-model="actionValues['vrsta_osebe']"
          :label="$t('vrsta_osb')"
          :options="vrstaOsebeOptions"
          style="min-width: 170px; margin-right: 15px"
        >
        </q-select>

        <div class="action-option">
          <q-option-group
            v-model="actionValues['vloga_osebe']"
            :options="vlogaOsebeOptions1"
            color="cro-green"
            inline
            dense
          />
          <q-option-group
            v-model="actionValues['vloga_osebe']"
            :options="vlogaOsebeOptions2"
            color="cro-green"
            inline
            dense
          />
        </div>

        <div class="action-checkbox single">
          <div>
            <q-checkbox
              v-model="actionValues['fakture_saldo_ni_nic']"
              :label="$t('fk_fakture_saldo_ni_nic')"
              color="cro-green"
            />
          </div>
        </div>

        <q-select
          color="cro"
          bg-color="white"
          outlined
          stack-label
          emit-value
          map-options
          v-model="actionValues['fakture_saldo_ni_nic_obdobje']"
          :label="$t('fk_za_obdobje')"
          :options="faktureSaldoObdobjeOptions"
          style="min-width: 135px; margin-right: 15px"
          :disable="!actionValues['fakture_saldo_ni_nic']"
        >
        </q-select>

        <div class="self-center items-end">
          <q-btn
            class="action-btn"
            size="12px"
            style="width: 165px"
            color="cro-green"
            text-color="white"
            no-caps
            @click="action(true)"
          >
            {{ $t('fk_prikazi_kartico') }}
            <!--<q-icon name="mdi-application-export" style="margin-left:5px"/>-->
          </q-btn>

          <q-btn
            v-if="1 === 2"
            class="action-btn"
            size="12px"
            style="width: 160px"
            color="cro-green"
            text-color="white"
            no-caps
            @click="action(false)"
            :label="$t('fk_prikazi_kartico')"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'FKAction',

  props: {
    actionValues: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      vrstaOsebeOptions: [
        {
          label: 'Vse osebe',
          value: '1,2',
        },
        {
          label: 'Fizične osebe',
          value: '2',
        },
        {
          label: 'Pravne osebe',
          value: '1',
        },
      ],
      vlogaOsebeOptions1: [
        {
          label: 'Vse vloge',
          value: 'VSE',
        },
        {
          label: 'Plačnik',
          value: '220',
        },
      ],
      vlogaOsebeOptions2: [
        {
          label: 'Zavarovanec',
          value: '001',
        },
        {
          label: 'Sklenitelj',
          value: '002',
        },
      ],
      faktureSaldoObdobjeOptions: [
        {
          label: '3 leta',
          value: '3',
        },
        {
          label: '10 let',
          value: '10',
        },
        {
          label: 'Celotno obdobje',
          value: 'vso',
        },
      ],
      startDateSklenitve: '',
      endDateSklenitve: '',
      startDatePlacil: '',
      endDatePlacil: '',
      dateRangeSklenitve: {
        startDate: moment(),
        endDate: moment(),
      },
      dateRangePlacil: {
        startDate: moment(),
        endDate: moment(),
      },
      weekNumbers: false,
      locale: {
        direction: 'ltr',
        format: 'DD.MM.YYYY',
        separator: ' - ',
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        weekLabel: 'W',
        customRangeLabel: 'Custom Range',
        daysOfWeek: ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'],
        monthNames: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'Maj',
          'Jun',
          'Jul',
          'Avg',
          'Sep',
          'Okt',
          'Nov',
          'Dec',
        ],
        firstDay: 1, // ISO first day of week - see moment documenations for details
      },
    }
  },

  methods: {
    action(newTab = false) {
      this.actionValues['dt_sklenitve_od'] =
        this.actionValues['dt_sklenitve_od'] === ''
          ? this.formatDate(new Date('1990-01-01'), 'dd.mm.yyyy')
          : this.actionValues['dt_sklenitve_od']
      this.actionValues['dt_sklenitve_do'] =
        this.actionValues['dt_sklenitve_do'] === ''
          ? this.formatDate(new Date('2050-12-31'), 'dd.mm.yyyy')
          : this.actionValues['dt_sklenitve_do']
      this.actionValues['dt_placil_od'] =
        this.actionValues['dt_placil_od'] === ''
          ? this.formatDate(new Date('1990-01-01'), 'dd.mm.yyyy')
          : this.actionValues['dt_placil_od']
      this.actionValues['dt_placil_do'] =
        this.actionValues['dt_placil_do'] === ''
          ? this.formatDate(new Date('2050-12-31'), 'dd.mm.yyyy')
          : this.actionValues['dt_placil_do']

      // Obdobje sklenitve validation
      if (
        this.getDate(this.actionValues['dt_sklenitve_od']) >
        this.getDate(this.actionValues['dt_sklenitve_do'])
      ) {
        this.$noty.error(this.$t('fk_dt_sklenitve_error'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      // Obdobje plačil validation
      if (
        this.getDate(this.actionValues['dt_placil_od']) >
        this.getDate(this.actionValues['dt_placil_do'])
      ) {
        this.$noty.error(this.$t('fk_dt_placil_error'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      this.$emit('action', {
        ...this.actionValues,
        new_tab: newTab,
      })
    },

    formatDate(date, format) {
      return format
        .replace('mm', (date.getMonth() + 1).toString().padStart(2, '0'))
        .replace('yyyy', date.getFullYear())
        .replace('yy', date.getFullYear().toString().slice(-2))
        .replace('dd', date.getDate().toString().padStart(2, '0'))
    },

    getDate(date) {
      // Assumes s is "dd.mm.yyyy"
      if (!/^\d\d\.\d\d\.\d\d\d\d$/.test(date)) {
        return new Date('1990-01-01')
      }

      const parts = date.split('.').map((p) => parseInt(p, 10))
      parts[1] -= 1
      const d = new Date(parts[2], parts[1], parts[0])
      return d
    },
  },

  mounted() {
    if (
      typeof this.actionValues['EZSO'] !== 'undefined' ||
      typeof this.actionValues['EMSO'] !== 'undefined' ||
      typeof this.actionValues['NazivOsebe'] !== 'undefined' ||
      typeof this.actionValues['DavcnaStevilka'] !== 'undefined' ||
      typeof this.actionValues['KonsolidacijskaDavcnaStevilka'] !== 'undefined'
    ) {
      this.filterResults()
    }
  },

  watch: {
    'actionValues.izpis_vseh_polic': function (newVal) {
      this.actionValues['fakture_saldo_ni_nic'] = !newVal
        ? false
        : this.actionValues['fakture_saldo_ni_nic']
    },
    'actionValues.fakture_saldo_ni_nic': function (newVal) {
      this.actionValues['izpis_vseh_polic'] = newVal ? true : this.actionValues['izpis_vseh_polic']
    },
  },
}
</script>

<style lang="scss" scoped>
#fk-action-container {
  vertical-align: middle;
}

#fk-action-container .q-card {
  background-color: #d8e8e4;
  padding: 8px 12px;
}

#fk-action-container .q-checkbox__label {
  min-width: 138px;
}

.action-btn {
  float: right;
  height: 32px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin: 10px 10px;
}

.action-checkbox {
  margin-top: 12px;
}

.action-checkbox .q-checkbox {
  max-width: 170px;
}

.action-option {
  margin-top: 9px;
  margin-bottom: 15px;
  margin-left: 5px;
}

.action-option .q-option-group {
  margin-top: 10px;
}

.q-btn.selected {
  background-color: #d5e5e1 !important;
}

.q-btn.unselected {
  background-color: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.24);
}

.q-input,
.q-select {
  margin: 15px 5px;
  padding-bottom: 0px;
}

.remove-range {
  margin: 16px;
}

.daterangepicker::before {
  display: none !important;
}
</style>

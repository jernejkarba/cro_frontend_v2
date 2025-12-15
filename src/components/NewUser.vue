<template>
  <div class="q-pa-md row" id="new-user-container">
    <div class="col-12">
      <div class="card-title">Osnovni podatki</div>
      <div class="row">
        <div class="col-6">
          <q-select
            color="cro"
            bg-color="white"
            outlined
            stack-label
            emit-value
            map-options
            :dense="true"
            v-model="user.VrstaOsebe"
            :label="$t('vrsta_osb')"
            :options="vrstaOsebeOptions"
          >
          </q-select>
        </div>

        <div class="col-6">
          <q-select
            :options="sourceTipOsb"
            :label="$t('tip_osb')"
            color="cro"
            :bg-color="posebnaVrstaOsebeOptions.some((x) => x === user.VrstaOsebe) ? 'white' : ''"
            outlined
            v-model="user.TipOsebe"
            stack-label
            :dense="true"
            emit-value
            map-options
            :disable="!posebnaVrstaOsebeOptions.some((x) => x === user.VrstaOsebe)"
          >
          </q-select>
        </div>

        <div class="col-3">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.DavcnaStevilka"
            @change="checkDavcna"
            :label="$t('davcna_full')"
          >
            <template
              v-slot:append
              v-if="user.DavcnaStevilka != '' && typeof user.DavcnaStevilka != 'undefined'"
            >
              <q-icon
                :name="this.$user_data.pravice.ecrp === 'T' ? 'mdi-account-search' : 'check'"
                :style="this.$user_data.pravice.ecrp !== 'T' ? 'color:#3da183' : 'cursor:pointer'"
                :title="this.$user_data.pravice.ecrp !== 'T' ? $t('davcna_ok') : 'eCRP'"
                @click="openEcrpDialog()"
                v-if="davcnaOk && (user.TipOsebe === '2' || typeof user.VrstaOsebe === 'undefined')"
              />
              <q-icon
                name="error_outline"
                style="color: #c10013"
                :title="$t('davcna_error')"
                v-if="!davcnaOk"
              />
            </template>
          </q-input>
        </div>

        <div class="col-3">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.TujaDavcnaStevilka"
            :label="$t('tuja_davcna_full')"
          >
          </q-input>
        </div>

        <div class="col-3" v-if="user.TipOsebe === '2' || typeof user.VrstaOsebe === 'undefined'">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.DtRojstva"
            mask="##.##.####"
            :label="$t('dt_rojstva_full')"
          >
            <template
              v-slot:append
              v-if="user.TipOsebe === '2' || typeof user.VrstaOsebe === 'undefined'"
            >
              <q-icon
                name="event"
                class="cursor-pointer"
                style="font-size: 15px; padding-top: 13px"
              >
                <q-popup-proxy ref="qDateProxyR" transition-show="scale" transition-hide="scale">
                  <q-date
                    color="cro-green"
                    v-model="user.DtRojstva"
                    @update:model-value="() => $refs.qDateProxyR.hide()"
                    minimal
                    mask="DD.MM.YYYY"
                  >
                    <q-btn
                      id="rmvDateBtn"
                      class="items-start"
                      label="Izbriši datum rojstva"
                      icon="img:trash-can-outline.svg"
                      color="cro-green"
                      flat
                      @click="user.DtRojstva = ''"
                      v-close-popup
                    />
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-3" v-if="user.TipOsebe === '2' || typeof user.VrstaOsebe === 'undefined'">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.DtSmrti"
            mask="##.##.####"
            :label="$t('dt_smrti_full')"
          >
            <template
              v-slot:append
              v-if="user.TipOsebe === '2' || typeof user.VrstaOsebe === 'undefined'"
            >
              <q-icon
                name="event"
                class="cursor-pointer"
                style="font-size: 15px; padding-top: 13px"
              >
                <q-popup-proxy ref="qDateProxyS" transition-show="scale" transition-hide="scale">
                  <q-date
                    color="cro-green"
                    v-model="user.DtSmrti"
                    @update:model-value="() => $refs.qDateProxyS.hide()"
                    minimal
                    mask="DD.MM.YYYY"
                  >
                    <q-btn
                      id="rmvDateBtn"
                      class="items-start"
                      label="Izbriši datum smrti"
                      icon="img:trash-can-outline.svg"
                      color="cro-green"
                      flat
                      @click="user.DtSmrti = ''"
                      v-close-popup
                    />
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-8" v-if="user.TipOsebe === '2' || typeof user.VrstaOsebe === 'undefined'">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.EMSO"
            @change="checkEmso"
            :label="$t('emso')"
            disable
          >
          </q-input>
        </div>

        <div class="col-6" v-if="user.TipOsebe === '1' && typeof user.VrstaOsebe != 'undefined'">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.MaticnaSt"
            :label="$t('maticna_stevilka')"
          >
          </q-input>
        </div>

        <div class="col-4" v-if="user.TipOsebe === '2' || typeof user.VrstaOsebe === 'undefined'">
          <q-select
            color="cro"
            bg-color="white"
            outlined
            stack-label
            :dense="true"
            v-model="user.Spol"
            :label="$t('spol')"
            :options="spolOptions"
          >
          </q-select>
        </div>
        <!--
        <div
         class="col-6"
         v-if="user.TipOsebe === '2'">
          <q-select
            color="cro"
            bg-color="white"
            outlined
            stack-label
            :dense="true"
            v-model="user.Drzavljanstvo"
            :label="$t('drzavljanstvo')"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="drzavaOptions"
            @filter="filterDrzava">
          </q-select>
        </div>
        -->

        <div class="col-6" v-if="user.TipOsebe === '2'">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.Drzavljanstvo"
            :label="$t('drzavljanstvo')"
          >
          </q-input>
        </div>

        <div class="col-6" v-if="user.TipOsebe === '2'">
          <q-select
            color="cro"
            bg-color="white"
            outlined
            stack-label
            :dense="true"
            v-model="user.DrzavaRojstva"
            :label="$t('drzava_rojstva')"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="drzavaOptions"
            @filter="filterDrzava"
          >
          </q-select>
        </div>

        <div class="col-12">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.NazivOsebe"
            :label="$t('naziv')"
            @update:model-value="
              (val) => {
                user.NazivOsebe = val.toUpperCase()
              }
            "
          >
          </q-input>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card-title top-padding">Naslov</div>
      <div class="row">
        <div class="col-8">
          <q-select
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.DrzavaNaziv"
            :label="$t('drzava')"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="drzavaOptions"
            @filter="filterDrzava"
          >
          </q-select>
        </div>
        <div class="col-4 address-row">
          <div class="q-gutter-xs">
            <q-checkbox
              v-model="usn"
              label="Uradni stalni naslov"
              color="cro-green"
              disable
              :dense="true"
            >
              <q-tooltip v-if="usn">
                Datum zadnje spremembe: <br />
                {{ user.UradniStalniNaslov }}
              </q-tooltip>
            </q-checkbox>
          </div>
        </div>
        <div class="col-8">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.Ulica"
            :label="$t('ulica')"
            @update:model-value="
              (val) => {
                user.Ulica = val.toUpperCase()
              }
            "
            :rules="[(val) => val.length >= 2 || '']"
            reactive-rules="true"
          >
          </q-input>
        </div>
        <div class="col-2">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.HisnaSt"
            :label="$t('hisna_st_short')"
            maxlength="4"
            @update:model-value="
              (val) => {
                user.HisnaSt = val.replace(/\D/g, '')
              }
            "
          >
            <q-tooltip>
              {{ $t('hisna_st') }}
            </q-tooltip>
          </q-input>
        </div>
        <div class="col-2">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.HisnaStOznaka"
            :label="$t('hisna_st_oznaka_short')"
            maxlength="3"
            @update:model-value="
              (val) => {
                user.HisnaStOznaka = val.replace(/[0-9]/g, '').toUpperCase()
              }
            "
          >
            <q-tooltip>
              {{ $t('hisna_st_oznaka') }}
            </q-tooltip>
          </q-input>
        </div>
        <div class="col-6" v-if="user.Drzava.toUpperCase() === 'SLOVENIJA'">
          <q-select
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.Naselje"
            :label="$t('naselje')"
            emit-value
            map-options
            use-input
            option-value="label"
            option-label="label"
            hide-selected
            fill-input
            input-debounce="0"
            :options="naseljeOptions"
            @new-value="createNaseljeValue"
            @filter="filterNaselje"
          >
          </q-select>
        </div>
        <div class="col-6" v-else>
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.NaseljeTujina"
            :label="$t('naselje')"
            :rules="[(val) => !!val || '']"
            @update:model-value="
              (val) => {
                user.NaseljeTujina = val.toUpperCase()
              }
            "
          >
          </q-input>
        </div>
        <div class="col-6" v-if="user.Drzava.toUpperCase() != 'SLOVENIJA'">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.Posta"
            :label="$t('posta')"
            @update:model-value="
              (val) => {
                user.Posta = val.toUpperCase()
              }
            "
          >
          </q-input>
        </div>

        <div class="col-6" v-if="user.Drzava.toUpperCase() == 'SLOVENIJA'">
          <q-select
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.PostaStNaziv"
            :label="$t('postna')"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="postnaOptions"
            @filter="filterPosta"
          >
          </q-select>
        </div>

        <div class="col-8" v-if="user.Drzava.toUpperCase() == 'SLOVENIJA'">
          <q-select
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.Obcina"
            :label="$t('obcina')"
            emit-value
            map-options
            use-input
            option-value="value"
            option-label="label"
            hide-selected
            fill-input
            input-debounce="0"
            :options="obcinaOptions"
            @filter="filterObcina"
          >
          </q-select>
        </div>

        <div class="col-4" v-if="user.Drzava.toUpperCase() == 'SLOVENIJA'">
          <q-btn
            class="sifrant-btn"
            size="12px"
            text-color="cro"
            no-caps
            @click="$emit('openSifrantNaslovovDialog', { ezso: null, table: '' })"
          >
            <q-icon left name="mdi-file-search" color="cro-green" />
            {{ $t('sifrant_naslovov') }}
          </q-btn>
        </div>
      </div>
    </div>

    <div class="col-12" v-if="user.TipOsebe === '2' || typeof user.VrstaOsebe === 'undefined'">
      <div class="card-title top-padding">Osebni dokument</div>
      <div class="row">
        <div class="col-6">
          <q-select
            color="cro"
            bg-color="white"
            outlined
            stack-label
            emit-value
            map-options
            :dense="true"
            v-model="user.TipOsebnegaDokumenta"
            :label="$t('vrsta_osebnega_dokumenta')"
            :options="vrstaOsebnegaDokumentaOptions"
          >
          </q-select>
        </div>

        <div class="col-6">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.DtIzdajeOsebnegaDokumenta"
            :label="$t('dt_izdaje_osebnega_dokumenta')"
          >
            <template
              v-slot:append
              v-if="user.TipOsebe === '2' || typeof user.VrstaOsebe === 'undefined'"
            >
              <q-icon
                name="event"
                class="cursor-pointer"
                style="font-size: 15px; padding-top: 13px"
              >
                <q-popup-proxy ref="qDateProxyR" transition-show="scale" transition-hide="scale">
                  <q-date
                    color="cro-green"
                    v-model="user.DtIzdajeOsebnegaDokumenta"
                    @update:model-value="() => $refs.qDateProxyR.hide()"
                    minimal
                    mask="DD.MM.YYYY"
                  >
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-6">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.StOsebnegaDokumenta"
            :label="$t('st_osebnega_dokumenta')"
          >
          </q-input>
        </div>

        <div class="col-6">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.IzdajateljOsebnegaDokumenta"
            :label="$t('izdajatelj_osebnega_dovoljenja')"
          >
          </q-input>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card-title top-padding">TRR</div>
      <div class="row">
        <div class="col-6">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.TRR"
            :label="$t('trr')"
          >
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
        @click="$emit('closeDialog')"
      />
      <q-btn
        class="add-user-btn"
        size="12px"
        color="cro-green"
        text-color="white"
        no-caps
        @click="addUser"
      >
        <q-icon left name="mdi-plus-circle-outline" />
        {{ $t('add_new_person') }}
      </q-btn>
    </div>

    <q-dialog v-model="ecrpDialog" transition-show="slide-up" transition-hide="slide-up">
      <q-card class="bg-white" style="width: 500px">
        <q-bar class="bg-cro-green">
          Vpogled v eCRP
          <q-space />
          <q-btn flat icon="close" @click="closeEcrpDialog()">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <EcrpReasonDialog
            @closeDialog="closeEcrpDialog"
            @confirmEcrp="confirmEcrp()"
            :data="ecrpReasonData"
            :vzrokOptions="ecrpVzrokOptions"
            :namenOptions="ecrpNamenOptions"
          >
          </EcrpReasonDialog>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="ecrpDataDialog"
      transition-show="slide-up"
      transition-hide="slide-up"
      persistent
    >
      <q-card class="bg-white" style="max-width: 1600px; min-width: 800px; width: 80%">
        <q-bar class="bg-cro-green">
          Podatki iz eCRP
          <q-space />
          <q-btn flat icon="close" @click="closeEcrpDataDialog(true)">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <EcrpDataDialog
            @closeDataDialog="closeEcrpDataDialog($event)"
            @updateAfterEdit="updateAfterEdit($event)"
            @sendMessage="sendMessage($event)"
            @selectData="selectEcrpData($event)"
            @selectAddress="selectAddress()"
            :data="ecrpData"
            :user="ecrpReasonData.user"
            :selected="ecrpSelected"
            :onlyAddresses="true"
          >
          </EcrpDataDialog>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="ecrpNamenDialog"
      transition-show="slide-up"
      transition-hide="slide-up"
      persistent
    >
      <q-card class="bg-white" style="width: 600px; max-width: 90vw; min-width: 600px">
        <q-bar class="bg-cro-green">
          eCrp namen
          <q-space />
          <q-btn flat icon="close" @click="closeEcrpNamenDialog()">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <EcrpNamenDialog
            @closeNamenDialog="closeEcrpNamenDialog"
            @confirmEcrp="confirmEcrp()"
            :data="ecrpNamenData"
          >
          </EcrpNamenDialog>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import EcrpReasonDialog from 'components/Ecrp/ReasonDialog.vue'
import EcrpNamenDialog from 'components/Ecrp/NamenDialog.vue'
import EcrpDataDialog from 'components/Ecrp/DataDialog.vue'

export default {
  name: 'newUserDialog',
  components: { EcrpReasonDialog, EcrpNamenDialog, EcrpDataDialog },

  props: {
    user: {
      type: Object,
      required: true,
    },
    spolOptions: {
      type: Array,
      required: false,
      default: () => [],
    },
    vrstaOsebeOptions: {
      type: Array,
      required: true,
    },
    posebnaVrstaOsebeOptions: {
      type: Array,
      required: true,
    },
    vrstaOsebnegaDokumentaOptions: {
      type: Array,
      required: true,
    },
    sifrantPost: {
      type: Array,
      required: true,
    },
    sifrantDrzav: {
      type: Array,
      required: true,
    },
    sifrantObcin: {
      type: Array,
      required: true,
    },
    sifrantNaselij: {
      type: Array,
      required: true,
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
      ecrpData: {},
      ecrpDialog: false,
      ecrpNamenDialog: false,
      ecrpDataDialog: false,
      ecrpSelected: [],
      ecrpReasonData: {
        vzrok: '',
        vzrokDrugo: '',
        oznaka: '',
        user: {},
      },
      ecrpNamenData: {
        value: null,
      },
      ecrpVzrokOptions: [
        { label: 'Konsolidacija', value: 'Konsolidacija' },
        { label: 'Zavrnjena pošta', value: 'Zavrnjena pošta' },
        { label: 'Kontakt stranke', value: 'Kontakt stranke' },
        { label: 'Drugo', value: 'Drugo' },
      ],
      ecrpNamenOptions: [
        {
          label: 'Zaledna podpora (regresi, neodzivnost, obveščanje, …)',
          value: 'Zaledna podpora (regresi, neodzivnost, obveščanje, …)',
        },
        { label: 'Namen 1', value: 'Namen 1' },
        { label: 'Namen 2', value: 'Namen 2' },
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
    addUser() {
      // Date validation
      if (
        this.user.DtRojstva !== null &&
        this.user.DtRojstva !== '' &&
        this.user.DtRojstva !== ' ' &&
        this.user.DtRojstva !== '#' &&
        !this.isValidDate(this.user.DtRojstva) &&
        typeof this.user.DtRojstva !== 'undefined'
      ) {
        this.$noty.error(this.$t('invalid_dt_rojstva'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      if (
        this.user.DtSmrti !== null &&
        this.user.DtSmrti !== '' &&
        this.user.DtSmrti !== ' ' &&
        this.user.DtSmrti !== '#' &&
        !this.isValidDate(this.user.DtSmrti) &&
        typeof this.user.DtSmrti !== 'undefined'
      ) {
        this.$noty.error(this.$t('invalid_dt_smrti'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      if (
        this.user.TipOsebe === '1' &&
        !this.posebnaVrstaOsebeOptions.some((x) => x === this.user.VrstaOsebe) &&
        typeof this.user.VrstaOsebe !== 'undefined' &&
        this.user.Drzava.toUpperCase() === 'SLOVENIJA' &&
        (this.user.DavcnaStevilka === '' || this.user.DavcnaStevilka === null)
      ) {
        this.$noty.error(this.$t('davcna_st_required'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      if (
        (this.user.TipOsebe === '2' || typeof this.user.VrstaOsebe === 'undefined') &&
        (this.user.Spol === '' || typeof this.user.Spol === 'undefined')
      ) {
        this.$noty.error(this.$t('spol_required'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      // Address validation
      if (
        this.user.Drzava.toUpperCase() === 'SLOVENIJA' &&
        typeof this.user.Ulica !== 'undefined' &&
        typeof this.user.Naselje !== 'undefined' &&
        typeof this.user.HisnaSt !== 'undefined' &&
        typeof this.user.Drzava !== 'undefined' &&
        (this.user.Ulica.length < 2 ||
          this.user.Naselje.length === 0 ||
          this.user.Drzava.length === 0 ||
          this.user.HisnaSt.length === 0)
      ) {
        this.$noty.error(this.$t('invalid_address'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      if (
        typeof this.user.PostaSt !== 'undefined' &&
        this.user.Drzava.toUpperCase() === 'SLOVENIJA' &&
        this.user.PostaSt.length === 0
      ) {
        this.$noty.error(this.$t('postnaSt_required'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      // Remove EMŠO from eCRP
      this.user.EMSO = ''

      this.$q.loading.show()
      this.api
        .post('OsebeAdd', {
          ...this.user,
          Program: this.program,
        })
        .then((result) => {
          this.$emit('refresh_token', result.data.token)

          this.$q.loading.hide()
          this.setResponse(result.data)

          if (result.data.success === true) {
            this.$emit('closeDialog')
            this.$emit('showNewUser', result.data.result.ezso)

            if (result.data.hasOwnProperty('warnings')) {
              if (result.data.warnings.length > 0) {
                result.data.warnings.forEach((item) => {
                  this.$noty.warning(item, {
                    killer: false,
                    timeout: 5000,
                    closeWith: ['click'],
                    layout: 'bottomCenter',
                    theme: 'metroui',
                  })
                })
              }
            }

            this.$noty.success(this.$t(result.data.message_key), {
              killer: false,
              timeout: 2000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui',
            })
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

    checkDavcna() {
      this.api
        .post('Preveridavcno', {
          DavcnaStevilka: this.user.DavcnaStevilka,
        })
        .then((result) => {
          if (result.data.success === true) {
            this.davcnaOk = true
          } else {
            this.davcnaOk = false
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

    checkEmso() {
      this.api
        .post('Preveriemso', {
          EMSO: this.user.EMSO,
        })
        .then((result) => {
          if (result.data.success === true) {
            this.emsoOk = true
          } else {
            this.emsoOk = false
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

    setResponse(response) {
      this.$emit('setResponse', response)
    },

    kontrole() {
      this.davcnaOk = false
      this.emsoOk = false

      if (this.user.StopnjaPravilnosti === '1') {
        this.davcnaOk = true
      } else if (this.user.StopnjaPravilnosti === '2') {
        this.emsoOk = true
      } else if (this.user.StopnjaPravilnosti === '3') {
        this.davcnaOk = true
        this.emsoOk = true
      }
    },

    filterPosta(val, update, abort) {
      update(() => {
        this.postnaOptions = this.sifrantPost.filter(
          (v) => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1
        )
      })
    },

    filterDrzava(val, update, abort) {
      update(() => {
        this.drzavaOptions = this.sifrantDrzav.filter(
          (v) => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1
        )
      })
    },

    filterObcina(val, update, abort) {
      update(() => {
        this.obcinaOptions = this.sifrantObcin.filter(
          (v) => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1
        )
      })
    },

    filterNaselje(val, update, abort) {
      update(() => {
        this.naseljeOptions = this.sifrantNaselij.filter(
          (v) => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1
        )
      })
    },

    createNaseljeValue(val, done) {
      if (val.length > 0) {
        val = val.toUpperCase()
        if (!this.naseljeOptions.includes(val)) {
          this.naseljeOptions.push(val)
        }
        done(val, 'toggle')
      }
    },

    openEcrpDialog() {
      this.ecrpReasonData.vzrok = ''
      this.ecrpReasonData.vzrokDrugo = ''
      this.ecrpReasonData.oznaka = ''
      this.ecrpReasonData.user = this.user
      this.ecrpNamenData.value = null
      this.ecrpSelected = []

      this.ecrpDialog = true
    },

    closeEcrpDialog() {
      this.ecrpDialog = false
    },

    openEcrpDataDialog(data) {
      this.ecrpData = data
      this.ecrpDataDialog = true
    },

    closeEcrpDataDialog(isClicked = false) {
      this.ecrpDataDialog = false
    },

    openEcrpNamenDialog(data) {
      this.ecrpData = data
      this.ecrpNamenDialog = true
    },

    closeEcrpNamenDialog() {
      this.ecrpNamenDialog = false
    },

    selectEcrpData(input) {
      // let addresses = ['stalni_naslov', 'zacasni_naslov', 'vrocanje_naslov', 'tujina_naslov']
      let field = input[input.length - 1]

      this.ecrpSelected = [field]
      /*
      if (addresses.includes(field)) {
        this.ecrpSelected = this.ecrpSelected.filter(item => !addresses.includes(item))
        this.ecrpSelected.push(field)
      }
      */
    },

    selectAddress() {
      if (this.ecrpSelected.includes('stalni_naslov')) {
        this.ecrpData.Ulica = this.ecrpData.Naslovi.stalni.Ulica.ecrp
        this.ecrpData.HisnaSt = this.ecrpData.Naslovi.stalni.HisnaSt.ecrp
        this.ecrpData.HisnaStOznaka = this.ecrpData.Naslovi.stalni.HisnaStOznaka.ecrp
        this.ecrpData.Naselje = this.ecrpData.Naslovi.stalni.Naselje.ecrp
        this.ecrpData.Posta = this.ecrpData.Naslovi.stalni.Posta.ecrp
        this.ecrpData.PostaSt = this.ecrpData.Naslovi.stalni.PostaSt.ecrp
        this.ecrpData.IDObcine = this.ecrpData.Naslovi.stalni.IDObcine.ecrp
        this.ecrpData.Obcina = this.ecrpData.Naslovi.stalni.Obcina.ecrp
      } else if (this.ecrpSelected.includes('zacasni_naslov')) {
        this.ecrpData.Ulica = this.ecrpData.Naslovi.zacasni.Ulica.ecrp
        this.ecrpData.HisnaSt = this.ecrpData.Naslovi.zacasni.HisnaSt.ecrp
        this.ecrpData.HisnaStOznaka = this.ecrpData.Naslovi.zacasni.HisnaStOznaka.ecrp
        this.ecrpData.Naselje = this.ecrpData.Naslovi.zacasni.Naselje.ecrp
        this.ecrpData.Posta = this.ecrpData.Naslovi.zacasni.Posta.ecrp
        this.ecrpData.PostaSt = this.ecrpData.Naslovi.zacasni.PostaSt.ecrp
        this.ecrpData.IDObcine = this.ecrpData.Naslovi.zacasni.IDObcine.ecrp
        this.ecrpData.Obcina = this.ecrpData.Naslovi.zacasni.Obcina.ecrp
      } else if (this.ecrpSelected.includes('vrocanje_naslov')) {
        this.ecrpData.Ulica = this.ecrpData.Naslovi.vrocanje.Ulica.ecrp
        this.ecrpData.HisnaSt = this.ecrpData.Naslovi.vrocanje.HisnaSt.ecrp
        this.ecrpData.HisnaStOznaka = this.ecrpData.Naslovi.vrocanje.HisnaStOznaka.ecrp
        this.ecrpData.Naselje = this.ecrpData.Naslovi.vrocanje.Naselje.ecrp
        this.ecrpData.Posta = this.ecrpData.Naslovi.vrocanje.Posta.ecrp
        this.ecrpData.PostaSt = this.ecrpData.Naslovi.vrocanje.PostaSt.ecrp
        this.ecrpData.IDObcine = this.ecrpData.Naslovi.vrocanje.IDObcine.ecrp
        this.ecrpData.Obcina = this.ecrpData.Naslovi.vrocanje.Obcina.ecrp
      } else if (this.ecrpSelected.includes('tujina_naslov')) {
        this.ecrpData.Ulica = this.ecrpData.Naslovi.tujina.Ulica.ecrp
        this.ecrpData.HisnaSt = this.ecrpData.Naslovi.tujina.HisnaSt.ecrp
        this.ecrpData.HisnaStOznaka = this.ecrpData.Naslovi.tujina.HisnaStOznaka.ecrp
        this.ecrpData.Naselje = this.ecrpData.Naslovi.tujina.Naselje.ecrp
        this.ecrpData.Posta = this.ecrpData.Naslovi.tujina.Posta.ecrp
        this.ecrpData.PostaSt = this.ecrpData.Naslovi.tujina.PostaSt.ecrp
        this.ecrpData.IDObcine = this.ecrpData.Naslovi.tujina.IDObcine.ecrp
        this.ecrpData.Obcina = this.ecrpData.Naslovi.tujina.Obcina.ecrp
      }

      this.ecrpDataDialog = false

      this.$emit('setNewUserEcrpData', this.ecrpData)
      this.checkDavcna()
    },

    confirmEcrp() {
      if (
        this.ecrpReasonData.vzrok === '' ||
        (this.ecrpReasonData.vzrok === 'Drugo' && this.ecrpReasonData.vzrokDrugo === '')
      ) {
        this.ecrpDialog = true
        this.ecrpNamenDialog = false
        this.ecrpDataDialog = false
      } else if (this.ecrpNamenData.value === null || this.ecrpNamenData.value === '') {
        this.ecrpDialog = false
        this.ecrpNamenDialog = true
        this.ecrpDataDialog = false

        if (this.ecrpReasonData.vzrok === 'Konsolidacija') {
          this.ecrpNamenData.oznaka = this.ecrpReasonData.user.EZSO
        }
      } else {
        this.ecrpNamenDialog = false
        // this.ecrpDataDialog = true

        // Vzrok validation
        if (
          this.ecrpReasonData.vzrok === '' ||
          (this.ecrpReasonData.vzrok === 'Drugo' && this.ecrpReasonData.vzrokDrugo === '')
        ) {
          this.$noty.error(this.$t('invalid_vzrok'), {
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
          .post('EcrpDavcna', {
            Vzrok:
              this.ecrpReasonData.vzrok === 'Drugo'
                ? this.ecrpReasonData.vzrokDrugo
                : this.ecrpReasonData.vzrok,
            Oznaka: this.ecrpReasonData.oznaka,
            Namen: this.ecrpNamenData.value,
            DavcnaSt: this.user.DavcnaStevilka,
            User: this.ecrpReasonData.user,
          })
          .then((result) => {
            this.$emit('refresh_token', result.data.token)

            this.$q.loading.hide()

            if (result.data.success === true) {
              this.closeEcrpDialog()

              if (Object.keys(result.data.data.Naslovi).length <= 1) {
                this.$emit('setNewUserEcrpData', result.data.data)
                this.checkDavcna()
              } else {
                this.openEcrpDataDialog(result.data.data)
              }

              this.ecrpReasonData.vzrok = ''
              this.ecrpReasonData.vzrokDrugo = ''
              this.ecrpNamenData.value = null
              this.ecrpNamenData.oznaka = ''
            } else {
              this.closeEcrpDialog()
              var errorMessage =
                typeof result.data.message === 'object'
                  ? result.data.message[0].message
                  : result.data.message
              this.$noty.error(errorMessage, {
                killer: true,
                timeout: 5000,
                closeWith: ['click'],
                layout: 'bottomCenter',
                theme: 'metroui',
              })

              this.ecrpReasonData.vzrok = ''
              this.ecrpReasonData.vzrokDrugo = ''
              this.ecrpNamenData.value = null
              this.ecrpNamenData.oznaka = ''
            }
          })
          .catch((error) => {
            this.$q.loading.hide()
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
            }
          })
      }
    },

    /*
    confirmEcrp () {
      if ((this.ecrpReasonData.vzrok === '' || (this.ecrpReasonData.vzrok === 'Drugo' && this.ecrpReasonData.vzrokDrugo === '')) && this.ecrpReference === '') {
        this.ecrpDialog = true
        this.ecrpNamenDialog = false
      } else if (this.ecrpNamenData.value === null) {
        this.ecrpDialog = false
        this.ecrpNamenDialog = true
      } else {
        this.ecrpNamenDialog = false

        // Vzrok validation
        if (this.ecrpReasonData.vzrok === '' || (this.ecrpReasonData.vzrok === 'Drugo' && this.ecrpReasonData.vzrokDrugo === '')) {
          this.$noty.error(this.$t('invalid_vzrok'), {
            killer: true,
            timeout: 5000,
            closeWith: ['click'],
            layout: 'bottomCenter',
            theme: 'metroui'
          })
          return false
        }

        this.$q.loading.show()
        this.api.post('EcrpDavcna', {
          Vzrok: this.ecrpReasonData.vzrok === 'Drugo' ? this.ecrpReasonData.vzrokDrugo : this.ecrpReasonData.vzrok,
          Namen: this.ecrpNamenData.value,
          DavcnaSt: this.user.DavcnaStevilka
        }).then((result) => {
          this.$emit('refresh_token', result.data.token)

          this.$q.loading.hide()

          if (result.data.success === true) {
            this.closeEcrpDialog()
            this.$emit('setNewUserEcrpData', result.data.data)
            this.checkDavcna()
          } else {
            this.closeEcrpDialog()
            this.$noty.error(result.data.message, {
              killer: true,
              timeout: 5000,
              closeWith: ['click'],
              layout: 'bottomCenter',
              theme: 'metroui'
            })
          }
        })
      }
    },
    */
    isValidDate(s) {
      // Assumes s is "dd.mm.yyyy"
      if (!/^\d\d\.\d\d\.\d\d\d\d$/.test(s)) {
        return false
      }

      const parts = s.split('.').map((p) => parseInt(p, 10))
      parts[1] -= 1
      const d = new Date(parts[2], parts[1], parts[0])
      return d.getMonth() === parts[1] && d.getDate() === parts[0] && d.getFullYear() === parts[2]
    },
  },

  watch: {
    'user.EMSO': function (newVal) {
      this.kontrole()
    },
    'user.DavcnaStevilka': function (newVal) {
      this.kontrole()
    },
    'user.StopnjaPravilnosti': function (newVal) {
      this.kontrole()
    },
    'user.VrstaOsebe': function (newVal) {
      if (!this.posebnaVrstaOsebeOptions.some((x) => x === newVal)) {
        if (newVal === 'FIZ') {
          this.user.TipOsebe = '2'
        } else {
          this.user.TipOsebe = '1'
        }
      }
    },
    'user.PostaStNaziv': function (newVal) {
      if (newVal.hasOwnProperty('value')) {
        this.user.PostaSt = newVal.value
        this.user.Posta = newVal.naziv
      }
    },
    'user.Obcina': function (newVal) {
      if (!isNaN(newVal) || newVal === '#') {
        this.user.IDObcine = newVal
      }
    },
    'user.DrzavaNaziv': function (newVal) {
      if (newVal.hasOwnProperty('value')) {
        this.user.IDDrzave = newVal.value
        this.user.Drzava = newVal.label

        if (newVal.label !== 'SLOVENIJA') {
          this.user.PostaSt = '0000'
          this.user.PostaStNaziv = '0000 - NEZNANO'
        }
      }
    },
    'ecrpReasonData.vzrok': function (newVal) {
      if (newVal === 'Konsolidacija') {
        this.ecrpReasonData.oznaka = this.$user_data.ezso
      } else {
        this.ecrpReasonData.oznaka = ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#new-user-container {
  padding-top: 20px;
}
#new-user-container .card-title {
  padding-left: 15px;
}

#new-user-container .card-title.top-padding {
  padding-top: 15px;
}

#new-user-container .address-row {
  padding: 20px 15px 0px 15px;
}

#new-user-container #cancel-btn {
  margin: 15px;
}

#new-user-container .add-user-btn {
  margin: 15px;
  float: right;
}

#new-user-container .sifrant-btn {
  margin: 15px;
  width: -moz-available;
}

#new-user-container .action-btns {
  padding-top: 25px;
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

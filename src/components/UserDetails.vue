<template>
  <div id="details-container" class="q-pa-md row">
    <div class="col-12 col-lg-6 col-md-6 col-sm-12">
      <div class="card_title">Osnovni podatki</div>
      <q-card class="details-card row">
        <div class="col-6">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.EZSO"
            :label="$t('id')"
          >
          </q-input>
        </div>
        <div class="col-6">
          <q-select
            :options="sourceTipOsb"
            :label="$t('tip_osb')"
            color="cro"
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
        <div class="col-6">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.DavcnaStevilka"
            @change="checkDavcna"
            :label="$t('davcna_full')"
          >
            <template v-slot:append>
              <q-icon
                name="check"
                style="color: #3da183"
                :title="$t('davcna_ok')"
                v-if="davcnaOk"
              />
              <q-icon
                name="error_outline"
                style="color: #c10013"
                :title="$t('davcna_error')"
                v-else
              />
            </template>
          </q-input>
        </div>
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
        <div class="col-6" v-if="user.TipOsebe === '1'">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.MaticnaSt"
            :label="$t('maticna_stevilka')"
          >
          </q-input>
        </div>
        <div class="col-6" v-if="user.TipOsebe === '1' && user.PravnaNaziv !== ''">
          <v-popover placement="bottom-end">
            <div class="company_info_row">
              <div style="display: inline">
                <q-icon name="info_outline" size="sm" style="color: #3da183; display: initial" />
              </div>
              <div style="display: inline; vertical-align: middle">Podatki o podjetju</div>
            </div>

            <template v-slot:popover>
              <q-card class="my-card" id="company-data-card">
                <q-bar class="bg-cro-green company-info-header">
                  <q-icon
                    name="info_outline"
                    size="sm"
                    style="color: #ffffff; display: initial; margin-right: 5px"
                  />
                  {{ user.PravnaNaziv }}
                  <q-space />
                  <q-btn flat icon="close" v-close-popover="true">
                    <q-tooltip>Zapri</q-tooltip>
                  </q-btn>
                </q-bar>
                <q-card-section style="padding-top: 25px">
                  <div class="company-ddv">
                    <q-icon
                      name="check"
                      size="sm"
                      v-if="user.PravnaDDV === '*'"
                      style="color: #3da183"
                    />
                    <q-icon name="close" size="sm" v-else style="color: #c10013" />
                    Zavezanec za DDV
                  </div>
                  <div class="company-status">
                    <div v-if="user.PravnaStatus === 'A'">
                      <q-icon name="check" size="sm" style="color: #3da183" />
                      Status: aktiven
                    </div>
                    <div v-else>
                      <q-icon name="close" size="sm" style="color: #c10013" />
                      Status: neaktiven
                    </div>
                  </div>
                  <div class="company-details">
                    <div class="company-details-row">
                      Naziv osebe: <b>{{ user.NazivOsebe }}</b>
                    </div>
                    <div class="company-details-row">
                      Davčni urad: <b>{{ user.PravnaDU }}</b>
                    </div>
                    <div class="company-details-row">
                      Datum veljavnosti:
                      <b>od {{ user.PravnaVeljavnostOd }} do {{ user.PravnaVeljavnostDo }}</b>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </template>
          </v-popover>
        </div>
        <div class="col-6" v-if="user.TipOsebe === '2'">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.EMSO"
            @change="checkEmso"
            :label="$t('emso')"
            disable
          >
            <template v-slot:append v-if="user.TipOsebe === '2'">
              <q-btn
                id="remove-emso-btn"
                title="Odstrani EMŠO"
                icon="img:trash-can-gray-outline.svg"
                flat
                @click="user.EMSO = '#'"
                v-close-popup
              />
            </template>
          </q-input>
        </div>
        <div class="col-3" v-if="user.TipOsebe === '2'">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.DtRojstva"
            :mask="dtRojstvaMask"
            :label="$t('dt_rojstva_full')"
          >
            <template v-slot:append>
              <q-icon
                v-if="user.DtRojstva === '#'"
                name="delete_outline"
                class="cursor-pointer"
                style="font-size: 15px; padding-top: 13px; color: #c10013"
              />
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
                      @click="user.DtRojstva = '#'"
                      v-close-popup
                    />
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-3" v-if="user.TipOsebe === '2'">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.DtSmrti"
            :mask="dtSmrtiMask"
            :label="$t('dt_smrti_full')"
          >
            <template v-slot:append>
              <q-icon
                v-if="user.DtSmrti === '#'"
                name="delete_outline"
                class="cursor-pointer"
                style="font-size: 15px; padding-top: 13px; color: #c10013"
              />
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
                      @click="user.DtSmrti = '#'"
                      v-close-popup
                    />
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <!--
        <div
         class="col-6"
         v-if="user.TipOsebe === '2'">
          <q-select
            outlined
            bottom-slots
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
            @update:model-value="
              (val) => {
                user.Drzavljanstvo = val.toUpperCase()
              }
            "
            :label="$t('drzavljanstvo')"
          >
          </q-input>
        </div>
        <div class="col-6" v-if="user.TipOsebe === '2'">
          <q-select
            outlined
            bottom-slots
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
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.NazivOsebe"
            @update:model-value="
              (val) => {
                user.NazivOsebe = val.toUpperCase()
              }
            "
            :label="$t('naziv')"
          >
          </q-input>
        </div>
      </q-card>
    </div>

    <div class="col-12 col-lg-6 col-md-6 col-sm-12">
      <div class="card_title">Naslov</div>
      <q-card class="details-card row">
        <div class="col-6" v-if="user.TipNaslova !== null">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.TipNaslovaNaziv"
            :label="$t('tip_naslova')"
            disable
          >
          </q-input>
        </div>
        <div class="col-3" v-if="user.NaslovOd !== null">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.NaslovOd"
            :label="$t('naslov_od')"
            disable
          >
          </q-input>
        </div>
        <div class="col-3" v-if="user.NaslovDo !== null">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.NaslovDo"
            :label="$t('naslov_do')"
            disable
          >
          </q-input>
        </div>
        <div class="col-8">
          <q-select
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
        <div class="col-6" v-if="user.Drzava.toUpperCase() != 'SLOVENIJA' && user.Drzava !== ''">
          <q-input
            color="cro"
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
        <div class="col-6" v-if="user.Drzava.toUpperCase() == 'SLOVENIJA' || user.Drzava === ''">
          <q-select
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
        <div class="col-8" v-if="user.Drzava.toUpperCase() == 'SLOVENIJA' || user.Drzava === ''">
          <q-select
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
        <div class="col-4" v-if="user.Drzava.toUpperCase() == 'SLOVENIJA' || user.Drzava === ''">
          <q-btn
            id="sifrant-btn"
            size="12px"
            text-color="cro"
            no-caps
            @click="$emit('openSifrantNaslovovDialog', user.EZSO)"
          >
            <q-icon left name="mdi-file-search" color="cro-green" />
            {{ $t('sifrant_naslovov') }}
          </q-btn>
        </div>
      </q-card>
    </div>

    <div
      class="col-12 col-lg-6 col-md-6 col-sm-12"
      v-if="user.TipOsebe === '2' || typeof user.VrstaOsebe === 'undefined'"
    >
      <div class="card_title" style="padding-top: 10px">Osebni dokument</div>
      <q-card class="details-card row">
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
      </q-card>
    </div>

    <div class="col-12 col-lg-6 col-md-6 col-sm-12">
      <div class="card_title" style="padding-top: 10px">TRR</div>
      <q-card class="details-card row">
        <div class="col-12">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            :dense="true"
            v-model="user.TRR"
            :label="$t('trr')"
          >
          </q-input>
        </div>
      </q-card>
    </div>

    <div
      class="col-12 self-end"
      id="action_button"
      v-if="this.$user_data.pravice.popravljanje === 'T'"
    >
      <q-btn
        id="changes-btn"
        size="12px"
        color="white"
        text-color="cro"
        no-caps
        :label="$t('potrdi_spr')"
        @click="editUser"
      />
      <q-btn
        id="audit-trail-btn"
        flat
        size="12px"
        color="white"
        text-color="cro"
        no-caps
        @click="openAuditTrailDialog()"
      >
        <q-icon style="color: #3ca082; margin-right: 5px" name="history" />
        {{ $t('audit_trail') }}
      </q-btn>
    </div>

    <q-dialog v-model="auditTrailDialog" transition-show="slide-up" transition-hide="slide-up">
      <q-card class="bg-white" style="width: 90%; max-width: 1200px; min-width: 800px">
        <q-bar class="bg-cro-green">
          <q-icon style="margin-right: 5px" name="history" />
          {{ $t('audit_trail') }}
          <q-space />
          <q-btn flat icon="close" @click="closeAuditTrailDialog()">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <AuditTrailDialog @setResponse="setResponse($event)" :userData="user"> </AuditTrailDialog>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import AuditTrailDialog from 'components/AuditTrailDialog/Dialog.vue'

export default {
  name: 'userDetails',
  components: { AuditTrailDialog },

  props: {
    user: {
      type: Object,
      required: true,
    },
    selectedUsers: {
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
      showing_details_tooltip: true,
      auditTrailDialog: false,

      davcnaOk: false,
      emsoOk: false,
      usn: false,
      dtRojstvaMask: '',
      dtSmrtiMask: '',
      postnaOptions: [],
      drzavaOptions: [],
      obcinaOptions: [],
      naseljeOptions: [],
      Options: [],
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
    editUser() {
      // Date validation
      if (
        this.user.DtRojstva !== null &&
        this.user.DtRojstva !== '' &&
        this.user.DtRojstva !== ' ' &&
        this.user.DtRojstva !== '#' &&
        !this.isValidDate(this.user.DtRojstva)
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
        !this.isValidDate(this.user.DtSmrti)
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
        this.user.Ulica.length < 2 ||
        (this.user.Naselje.length === 0 && this.user.NaseljeTujina.length === 0) ||
        this.user.Drzava.length === 0
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

      if (this.user.Drzava.toUpperCase() === 'SLOVENIJA' && this.user.PostaSt.length === 0) {
        this.$noty.error(this.$t('postnaSt_required'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
        return false
      }

      // Remove eCRP address data
      this.user.TipNaslova = ''
      this.user.NaslovOd = ''
      this.user.NaslovDo = ''

      let ids = [this.user.EZSO]

      this.selectedUsers.forEach((item) => {
        ids.push(item.EZSO)
      })

      this.$q.loading.show()
      this.api
        .post('OsebeEdit', {
          ...this.user,
          VrstaOsebe: this.user.VrstaOsebe,
          Osebe: ids,
          HitriUpdate: false,
          Program: this.program,
        })
        .then((result) => {
          this.$emit('refresh_token', result.data.token)

          this.$q.loading.hide()
          this.setResponse(result.data)
          this.$emit('updateAfterEdit', ids)

          if (result.data.success === true) {
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

            this.kontrole()
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

    openAuditTrailDialog() {
      this.auditTrailDialog = true
    },

    closeAuditTrailDialog() {
      this.auditTrailDialog = false
    },
  },

  mounted() {
    this.kontrole()

    if (this.user.UradniStalniNaslov !== null) {
      this.usn = true
    }
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
    'user.DtRojstva': function (newVal) {
      if (newVal.length > 1) {
        this.dtRojstvaMask = '##.##.####'
      } else {
        this.dtRojstvaMask = ''
      }
    },
    'user.DtSmrti': function (newVal) {
      if (newVal && newVal.length > 1) {
        this.dtSmrtiMask = '##.##.####'
      } else {
        this.dtSmrtiMask = ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#details-container {
  vertical-align: middle;
  padding: 15px;
}

.details-card {
  padding: 10px 15px;
  padding-bottom: 20px;
}

.details-card .col-4,
.details-card .col-6,
.details-card .col-8,
.details-card .col-12 {
  height: 50px;
}

.q-table tbody td::after {
  background: red;
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

.q-card {
  margin: 5px 15px;
}

.card_title {
  margin-left: 15px;
}

#changes-btn,
#audit-trail-btn {
  float: right;
  margin: 15px;
  margin-bottom: 0px;
}

#audit-trail-btn {
  background: #f5f5f5 !important;
  border: 1px solid #dbdbdb;
  margin-right: 0px;
}

#close-btn {
  float: right;
  margin: 15px;
  margin-right: 0px;
}

.address-row {
  padding: 20px 15px 0px 15px;
}

#details-container #sifrant-btn {
  margin: 15px 0px 0px 15px;
}

#company-data-card .q-bar {
  padding: 5px 12px;
}

.company_info_row {
  margin: 10px 15px;
  margin-bottom: 0px;
  padding-top: 8px;
  padding-bottom: 0px;
  height: 40px;
  cursor: pointer;
}

.company-info-header {
  max-width: 550px;
  height: auto;
}

.company-info-header .q-icon {
  display: initial;
  margin-right: 5px;
}

.company-ddv,
.company-status {
  display: inline-block;
}

.company-status {
  padding-left: 50px;
}

.company-details {
  padding-top: 23px;
}

.company-details-row {
  padding: 2px 0px;
}

#remove-emso-btn {
  pointer-events: visible;
  padding-right: 0px;
}
</style>

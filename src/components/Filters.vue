<template>
  <div id="filter-container" class="q-pa-md">
    <q-card class="my-card">
      <div class="row">
        <!-- Levo – gumbi za filtre -->
        <div class="col-6" id="filter-actions">
          <q-btn
            size="12px"
            text-color="cro"
            no-caps
            label="%"
            :class="filterValues['avtomatski_joker'] ? 'selected' : 'unselected'"
            @click="filterValues['avtomatski_joker'] = !filterValues['avtomatski_joker']"
          >
            <q-tooltip>{{ $t('joker_tool') }}</q-tooltip>
          </q-btn>

          <q-btn
            size="12px"
            color="white"
            text-color="cro"
            :label="$t('ezso')"
            :class="filterValues['avtomatski_ezso'] ? 'selected' : 'unselected'"
            @click="filterValues['avtomatski_ezso'] = !filterValues['avtomatski_ezso']"
          >
            <q-tooltip>{{ $t('ezso_tool') }}</q-tooltip>
          </q-btn>

          <q-btn
            size="12px"
            color="white"
            text-color="cro"
            icon="delete_outline"
            :class="filterValues['avtomatski_clear'] ? 'selected' : 'unselected'"
            @click="filterValues['avtomatski_clear'] = !filterValues['avtomatski_clear']"
          >
            <q-tooltip>{{ $t('izbris_tool') }}</q-tooltip>
          </q-btn>

          <q-btn
            size="12px"
            color="white"
            text-color="cro"
            :icon="
              filterValues['avtomatski_filter_clear']
                ? 'img:filter-minus-outline.svg'
                : 'img:filter-minus-outline-light.svg'
            "
            :class="filterValues['avtomatski_filter_clear'] ? 'selected' : 'unselected'"
            @click="
              filterValues['avtomatski_filter_clear'] = !filterValues['avtomatski_filter_clear']
            "
          >
            <q-tooltip>{{ $t('izbris_filter_tool') }}</q-tooltip>
          </q-btn>

          <q-btn
            size="12px"
            color="white"
            text-color="cro"
            icon="code"
            :class="filterValues['avtomatski_and_or'] ? 'selected' : 'unselected'"
            @click="filterValues['avtomatski_and_or'] = !filterValues['avtomatski_and_or']"
          >
            <q-tooltip>
              {{ filterValues['avtomatski_and_or'] ? $t('and_tool') : $t('or_tool') }}
            </q-tooltip>
          </q-btn>

          <q-btn
            size="12px"
            color="white"
            text-color="cro"
            :class="filterValues['avtomatski_case_sensitive'] ? 'selected' : 'unselected'"
            @click="
              filterValues['avtomatski_case_sensitive'] = !filterValues['avtomatski_case_sensitive']
            "
          >
            <q-icon
              :name="
                filterValues['avtomatski_case_sensitive']
                  ? 'img:format-letter-case-upper.svg'
                  : 'img:format-letter-case-upper-gray.svg'
              "
            />
            <q-tooltip>
              {{
                filterValues['avtomatski_case_sensitive']
                  ? $t('case_sensitive_off')
                  : $t('case_sensitive_on')
              }}
            </q-tooltip>
          </q-btn>

          <q-btn
            id="reset-filters"
            size="12px"
            color="white"
            text-color="cro"
            no-caps
            :label="$t('reset_fil')"
            @click="$emit('reset_filters')"
          />
        </div>

        <!-- Desno – akcijski gumbi -->
        <div class="col-6" id="filter-btns">
          <div id="filetr-btn-wrapper">
            <q-btn
              id="search-btn"
              size="12px"
              color="cro-green"
              text-color="white"
              no-caps
              :label="$t('search')"
              @click="filterResults"
            />

            <q-btn
              class="person-add-btn"
              size="12px"
              color="cro-green"
              text-color="white"
              no-caps
              icon="mdi-account-arrow-right"
              v-if="this.$user_data.pravice.razdelilnik === 'T'"
              @click="$emit('add_next_person')"
            >
              <q-tooltip>{{ $t('person_add_btn') }}</q-tooltip>
            </q-btn>

            <q-btn
              class="person-add-btn"
              size="12px"
              color="cro-green"
              text-color="white"
              no-caps
              icon="mdi-account-alert"
              v-if="this.$user_data.pravice.razdelilnik === 'T'"
              @click="$emit('add_next_fictive_person')"
            >
              <q-tooltip>{{ $t('person_add_fictive_btn') }}</q-tooltip>
            </q-btn>

            <q-btn
              class="person-add-btn"
              size="12px"
              color="cro-green"
              text-color="white"
              no-caps
              icon="person_add"
              v-if="this.$user_data.pravice.insert_api === 'T'"
              @click="$emit('openNewUserDialog')"
            >
              <q-tooltip>{{ $t('add_new_person') }}</q-tooltip>
            </q-btn>

            <q-btn
              id="deactivate-btn"
              size="12px"
              color="cro-red"
              text-color="white"
              no-caps
              icon="mdi-phone-cancel"
              v-if="this.$user_data.pravice.kac_kontakti === 'T'"
              @click="$emit('openDeactivateContactDialog')"
            >
              <q-tooltip>{{ $t('contact_deactivate') }}</q-tooltip>
            </q-btn>

            <q-btn
              id="clear-btn"
              size="12px"
              color="white"
              text-color="cro"
              no-caps
              :label="$t('clear_fil')"
              @click="$emit('clear')"
            />

            <q-btn
              id="clear-all-btn"
              size="12px"
              color="white"
              text-color="cro"
              no-caps
              :label="$t('clear_all')"
              @click="$emit('clear_all')"
            />
          </div>
        </div>
      </div>

      <!-- Vnosna polja -->
      <div class="row" id="filters-inputs">
        <div class="col-12 col-lg-1 col-md-2 col-sm-3" style="max-width: 120px">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['EZSO']"
            @keydown.enter.prevent="filterResults"
            :label="$t('id')"
          >
          </q-input>
        </div>
        <div class="col-12 col-lg-2 col-md-4 col-sm-6" style="max-width: 150px">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['EMSO']"
            @keydown.enter.prevent="filterResults"
            :label="$t('emso')"
          >
          </q-input>
        </div>
        <div class="col-12 col-lg-2 col-md-4 col-sm-6" style="max-width: 220px">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['NazivOsebe']"
            @keydown.enter.prevent="filterResults"
            :label="$t('naziv')"
          >
          </q-input>
        </div>
        <div class="col-12 col-lg-1 col-md-2 col-sm-3" style="max-width: 110px">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['DavcnaStevilka']"
            @keydown.enter.prevent="filterResults"
            :label="$t('davcna')"
          >
          </q-input>
        </div>
        <div class="col-12 col-lg-1 col-md-2 col-sm-3" style="max-width: 130px">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['KonsolidacijskaDavcnaStevilka']"
            @keydown.enter.prevent="filterResults"
            :label="$t('k_davcna')"
          >
          </q-input>
        </div>

        <div class="col-12 col-lg-2 col-md-2 col-sm-3" style="max-width: 150px">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['DtRojstva']"
            @keydown.enter.prevent="filterResults"
            :label="$t('dt_rojstva_full')"
            mask="##.##.####"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
                style="font-size: 15px; padding-top: 13px"
              >
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date
                    color="cro-green"
                    v-model="filterValues['DtRojstva']"
                    @update:model-value="() => $refs.qDateProxy.hide()"
                    minimal
                    mask="DD.MM.YYYY"
                  >
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-lg-2 col-md-4 col-sm-6" style="max-width: 220px">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['Ulica']"
            @keydown.enter.prevent="filterResults"
            :label="$t('ulica')"
          >
          </q-input>
        </div>
        <div class="col-12 col-lg-1 col-md-2 col-sm-3" style="max-width: 70px">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['HisnaSt']"
            @keydown.enter.prevent="filterResults"
            :label="$t('hisna_st_short')"
            maxlength="4"
          >
            <q-tooltip>
              {{ $t('hisna_st') }}
            </q-tooltip>
          </q-input>
        </div>
        <div class="col-12 col-lg-1 col-md-2 col-sm-3" style="max-width: 70px">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['HisnaStOznaka']"
            @keydown.enter.prevent="filterResults"
            :label="$t('hisna_st_oznaka_short')"
            maxlength="3"
          >
            <q-tooltip>
              {{ $t('hisna_st_oznaka') }}
            </q-tooltip>
          </q-input>
        </div>
        <div class="col-12 col-lg-1 col-md-2 col-sm-3" style="max-width: 100px">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['Posta']"
            @keydown.enter.prevent="filterResults"
            :label="$t('postna')"
          >
          </q-input>
        </div>
        <div class="col-12 col-lg-1 col-md-2 col-sm-3" style="max-width: 100px">
          <q-select
            :options="sourceOptions"
            :label="$t('vir')"
            color="cro"
            outlined
            v-model="filterValues['Vir']"
            @keydown.enter.prevent="filterResults"
            stack-label
          >
            <!--
            <template v-slot:append>
              <q-icon v-if="filterValues['vir'] !== '' && filterValues.hasOwnProperty('vir')" name="close" @click.stop="filterValues['vir'] = ''" class="cursor-pointer" />
            </template>
            -->
          </q-select>
        </div>
        <div class="col-12 col-lg-2 col-md-4 col-sm-6" style="max-width: 220px">
          <vue-tel-input
            v-model="filterValues['TelefonskaStevilka']"
            :default-country="'SI'"
            autofocus="true"
            validCharactersOnly="true"
            :inputOptions="telInputOptions"
            @keydown.enter.prevent="filterResults"
          />
        </div>
        <div class="col-12 col-lg-2 col-md-4 col-sm-6" style="max-width: 220px">
          <q-input
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['Email']"
            @keydown.enter.prevent="filterResults"
            :label="$t('email')"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

export default {
  name: 'filters',

  components: {
    VueTelInput,
  },

  props: {
    filterValues: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      sourceOptions: ['ZM', 'TIL'],

      telInputOptions: {
        placeholder: 'Telefonska številka',
      },
    }
  },

  methods: {
    filterResults() {
      this.$emit('filter', {
        ...this.filterValues,
      })
    },
  },

  mounted() {
    if (
      typeof this.filterValues['EZSO'] !== 'undefined' ||
      typeof this.filterValues['EMSO'] !== 'undefined' ||
      typeof this.filterValues['NazivOsebe'] !== 'undefined' ||
      typeof this.filterValues['DavcnaStevilka'] !== 'undefined' ||
      typeof this.filterValues['KonsolidacijskaDavcnaStevilka'] !== 'undefined'
    ) {
      this.filterResults()
    }
  },
}
</script>

<style lang="scss" scoped>
#filter-container {
  /*max-width: 1280px;*/
  vertical-align: middle;
}

#filter-actions,
#filter-btns {
  padding: 15px;
}

#filters-inputs {
  padding: 10px;
  padding-top: 0px;
}

#filter-actions {
  padding-bottom: 0px;
}

#filter-actions .q-btn,
#filter-btns .q-btn {
  box-shadow: none;
  margin-right: 6px;
}

#reset-filters {
  border: 1px solid rgba(0, 0, 0, 0.24);
}

#filetr-btn-wrapper {
  float: right;
}

#search-btn,
.person-add-btn {
  border-color: none;
}

#clear-btn,
#clear-all-btn {
  border: 1px solid rgba(0, 0, 0, 0.24);
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
  margin-bottom: 0px;
  margin-left: 5px;
  padding-bottom: 0px;

  /* max-width: 200px; */
}
</style>

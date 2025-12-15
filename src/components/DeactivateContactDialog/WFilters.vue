<template>
  <div class="row">
    <div id="wfilter-deactivate-container">
      <div class="row">
        <div class="self-center">
          <vue-tel-input
            :class="filterValues['email'] !== '' ? 'disabled' : ''"
            v-model="filterValues['telefonskaStevilka']"
            :default-country="'SI'"
            autofocus="true"
            :disabled="filterValues['email'] !== ''"
            validCharactersOnly="true"
            :inputOptions="telInputOptions"
            @keydown.enter.prevent="filterResults"
          />
        </div>
        <div class="col self-center">
          <q-input
            class="filter-field"
            color="cro"
            outlined
            bottom-slots
            stack-label
            v-model="filterValues['email']"
            @keydown.enter.prevent="filterResults"
            :readonly="filterValues['telefonskaStevilka'] !== null"
            :label="$t('email')"
          >
            <template v-slot:append v-if="filterValues['telefonskaStevilka'] !== null">
              <q-icon name="lock" />
            </template>
          </q-input>
        </div>
        <div class="self-end">
          <q-btn
            id="wsearch-btn"
            size="12px"
            color="cro-green"
            text-color="white"
            no-caps
            :label="$t('search')"
            @click="filterResults"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

export default {
  name: 'WFiltersDeactivate',

  components: {
    VueTelInput,
  },

  props: {
    filterValues: {
      type: Object,
      required: true,
    },
    showKarantena: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data() {
    return {
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

  watch: {},
}
</script>

<style>
#wfilter-deactivate-container {
  vertical-align: middle;
  background-color: #f5f5f5;
  margin-bottom: 25px;
  padding: 15px;
}

#wfilter-deactivate-container .filter-field {
  width: 244px;
  padding-bottom: 0px;
  margin-left: 10px;
  background-color: #fff;
}

.filter-field .q-field__control-container {
  height: 58px;
}

.filter-field .q-field__append {
  padding-left: 0px;
}

.filter-field .q-field__append i {
  font-size: 18px;
}

.filter-field .q-field--outlined .q-field__control {
  padding-right: 5px;
}

.q-field--outlined.q-field--readonly .q-field__control::before {
  border-style: solid;
  background-color: transparent;
}

.q-field--readonly.q-field--float .q-field__native {
  cursor: not-allowed;
}

#filter-actions,
#filter-btns {
  padding: 15px;
}

#wfilters-inputs {
  padding: 10px;
  padding-top: 0px;
}

#wfilters-row {
  margin-left: 5px;
}

#filter-actions {
  padding-bottom: 0px;
}

#filter-actions .q-btn,
#filter-btns .q-btn {
  box-shadow: none;
  margin-right: 6px;
}

#wsearch-btn {
  float: right;
  margin-left: 15px;
  margin-right: 0px;
}

#wfilter-deactivate-container #wfilters-inputs .q-input {
  margin: 15px 5px 0px 10px;
  padding-bottom: 0px;
  background-color: #ffffff;
  border-radius: 4px;
}

.disabled .q-checkbox__inner,
.disabled .q-checkbox__label {
  color: #c9c9c9;
}

#wfilters-inputs .q-field--readonly {
  background-color: #c9c9c9 !important;
}

#wfilters-inputs .q-field__inner .q-field__control {
  height: 58px !important;
}
#wfilter-deactivate-container .q-field--readonly {
  background-color: #c9c9c9 !important;
}

/* VUE phone number */
#wfilter-deactivate-container .vue-phone-number-input {
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 5px;
  height: 54px !important;
  -webkit-box-sizing: content-box;
  background-color: #fff;
}

#wfilter-deactivate-container .vue-phone-number-input:hover {
  border: 1px solid rgba(0, 0, 0, 0.5);
}

#wfilter-deactivate-container .vue-phone-number-input.disabled,
#wfilter-deactivate-container .input-tel.is-disabled .input-tel__input,
#wfilter-deactivate-container .country-selector.is-disabled .country-selector__input {
  background-color: rgb(201, 201, 201) !important;
}

#wfilter-deactivate-container .input-tel.is-disabled .input-tel__input::placeholder {
  color: rgba(0, 0, 0, 0.87) !important;
}

#wfilter-deactivate-container .vue-phone-number-input .select-country-container {
  width: 85px !important;
  min-width: 85px !important;
  max-width: 85px !important;
  padding-left: 12px;
  margin-top: 10px;
}

#wfilter-deactivate-container .country-selector__input {
  width: 55px !important;
  height: 38px !important;
  min-height: 30px !important;
  padding-right: 0px !important;
  border: none !important;
  padding-left: 10px;
  box-shadow: none !important;
}

#wfilter-deactivate-container .country-selector__country-flag {
  top: 14px !important;
  left: 0px !important;
}

#wfilter-deactivate-container .country-selector {
  height: 28px !important;
  min-height: 28px !important;
}

#wfilter-deactivate-container .country-selector__toggle {
  top: calc(50% - 3px) !important;
}

#wfilter-deactivate-container .input-tel__input {
  color: #000000;
  font-size: 12px !important;
  border: none !important;
  padding-top: 10px !important;
  padding-left: 0px !important;
  margin-top: 10px;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell,
    Fira Sans, Droid Sans, Helvetica Neue, sans-serif !important;
  box-shadow: none !important;
  height: 30px !important;
  min-height: 30px !important;
}

#wfilter-deactivate-container .is-valid .input-tel__input {
  color: #3ca082;
}
</style>

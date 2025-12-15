<template>
  <div class="row">
    <div id="wfilter-container">
      <div class="row" id="wfilters-inputs">
        <q-input
          class="filter-field"
          color="cro"
          outlined
          bottom-slots
          stack-label
          :readonly="KDST === ''"
          v-model="local['KonsolidacijskaDavcnaStevilka']"
          @keydown.enter.prevent="filterResults"
          :label="$t('k_davcna')"
        >
          <template v-slot:append v-if="KDST === ''">
            <q-icon name="lock" />
          </template>
          <q-tooltip v-if="KDST === ''">
            EZŠO ni konsolidiran. Možnost za iskanje po Kon. dav. št. je onemogočena.
          </q-tooltip>
        </q-input>
        <q-input
          v-if="vsiEzsoji.length === 0"
          class="filter-field"
          color="cro"
          outlined
          bottom-slots
          stack-label
          v-model="local['EZSO']"
          @keydown.enter.prevent="filterResults"
          :label="$t('id')"
        >
        </q-input>
        <q-select
          v-else
          class="filter-field"
          color="cro"
          outlined
          bottom-slots
          stack-label
          v-model="local['EZSO']"
          @keydown.enter.prevent="filterResults"
          :options="vsiEzsoji"
          :label="$t('id')"
        />
        <div class="col self-end">
          <q-btn
            id="wpsearch-btn"
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
    <div class="col">
      <q-btn
        id="audit-trail-dialog-btn"
        flat
        size="12px"
        color="white"
        text-color="cro"
        no-caps
        @click="$emit('openAuditTrailDialog')"
      >
        <q-icon style="color: #3ca082; margin-right: 5px" name="history" />
        {{ $t('audit_trail') }}
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WFilters',

  props: {
    filterValues: {
      type: Object,
      required: true,
    },
    vsiEzsoji: {
      type: Array,
      required: true,
    },
    KDST: {
      type: String,
      required: true,
    },
    EZSO: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      local: JSON.parse(JSON.stringify(this.filterValues)),
    }
  },

  methods: {
    filterResults() {
      this.$emit('filter', {
        ...this.local,
        KDST: this.KDST,
      })
    },
  },

  watch: {
    'filterValues.EZSO': function (newVal) {
      if (newVal !== '') {
        this.local.KonsolidacijskaDavcnaStevilka = ''
      }
    },

    'filterValues.KonsolidacijskaDavcnaStevilka': function (newVal) {
      if (newVal !== '') {
        this.local.EZSO = ''
      }
    },
  },

  mounted() {
    if (
      this.filterValues['EZSO'] !== '' ||
      this.filterValues['KonsolidacijskaDavcnaStevilka'] !== ''
    ) {
      this.filterResults()
    }
  },
}
</script>

<style>
#wfilter-container {
  vertical-align: middle;
  background-color: #f5f5f5;
}

.filter-field {
  width: 120px;
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

#wpsearch-btn {
  float: right;
  margin-left: 25px;
}

#wfilters-inputs .q-input,
#wfilters-inputs .q-select {
  margin: 15px 5px;
  margin-bottom: 0px;
  margin-left: 5px;
  padding-bottom: 0px;
  background-color: #ffffff;
  /* max-width: 200px; */
}

.disabled .q-checkbox__inner,
.disabled .q-checkbox__label {
  color: #c9c9c9;
}

#wfilters-inputs .q-field--readonly {
  background-color: #c9c9c9 !important;
}

#audit-trail-dialog-btn {
  float: right;
  margin: 0px;
  padding: 0px 5px;
  border: 1px solid #dbdbdb;
  min-height: 2em;
  font-weight: initial !important;
  background: #f5f5f5 !important;
}
</style>

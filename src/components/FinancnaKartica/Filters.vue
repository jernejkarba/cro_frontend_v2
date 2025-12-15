<template>
  <div id="fk-filter-container" class="q-pa-md">
    <q-card class="my-card">
      <div class="row" id="filters-inputs">
        <div class="col-12 col-lg-2 col-md-4 col-sm-4">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            v-model="localFilters.NazivOsebe"
            @update:model-value="(val) => emitUpdate('NazivOsebe', val.toUpperCase())"
            @keydown.enter.prevent="filterResults"
            :label="$t('fk_naziv_osebe')"
          />
        </div>

        <div class="col-12 col-lg-2 col-md-2 col-sm-2">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            v-model="localFilters.DavcnaStevilka"
            @keydown.enter.prevent="filterResults"
            :label="$t('davcna_full')"
          />
        </div>

        <div class="col-12 col-lg-1 col-md-2 col-sm-2">
          <q-input
            color="cro"
            bg-color="white"
            outlined
            bottom-slots
            stack-label
            v-model="localFilters.EZSO"
            @keydown.enter.prevent="filterResults"
            :label="$t('id')"
          />
        </div>

        <div class="col-12 col-lg-7 col-md-4 col-sm-4 self-end items-end">
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
            id="clear-all-btn"
            size="12px"
            text-color="cro"
            no-caps
            :label="$t('clear_all')"
            @click="emit('clear_all')"
          />

          <q-btn
            id="clear-btn"
            size="12px"
            text-color="cro"
            no-caps
            :label="$t('clear_fil')"
            @click="emit('clear')"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'

const props = defineProps({
  filterValues: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['filter', 'clear', 'clear_all'])

// local copy so we don't mutate props directly
const localFilters = reactive({
  ...props.filterValues,
})

// if parent changes filterValues, sync them
watch(
  () => props.filterValues,
  (val) => {
    Object.assign(localFilters, val || {})
  },
  { deep: true }
)

const emitUpdate = (key, value) => {
  localFilters[key] = value
}

const filterResults = () => {
  emit('filter', { ...localFilters })
}

onMounted(() => {
  const f = localFilters
  if (
    f.EZSO !== undefined ||
    f.EMSO !== undefined ||
    f.NazivOsebe !== undefined ||
    f.DavcnaStevilka !== undefined ||
    f.KonsolidacijskaDavcnaStevilka !== undefined
  ) {
    filterResults()
  }
})
</script>

<style lang="scss" scoped>
#fk-filter-container {
  vertical-align: middle;
}

#fk-filter-container .q-card {
  background-color: #dfebe7;
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
#clear-btn,
#clear-all-btn {
  float: right;
  width: 120px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-right: 10px;
}

.person-add-btn {
  border-color: none;
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
}
</style>

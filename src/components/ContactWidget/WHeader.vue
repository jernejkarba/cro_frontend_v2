<template>
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title>
        <q-img id="logo_head" src="logo-sava-cro.png" style="width: 48px; height: 48px" />
        CRO - Kontaktni podatki
      </q-toolbar-title>
      <q-btn flat round dense icon="close" @click="$emit('closeDialog')">
        <q-tooltip> Zapri </q-tooltip>
      </q-btn>
      <div></div>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  name: 'Header',
}
</script>
<style lang="scss" sscoped>
#logo_head {
  margin-left: 20px;
}

#logo_head .q-img__image {
  background-size: initial !important;
}

#dev-btn {
  margin-right: 10px;
}

#dev-btn.selected {
  background-color: #00ad8d !important;
  color: rgba(255, 255, 255, 1);
}

#dev-btn.unselected {
  background-color: #00ad8d !important;
  color: rgba(255, 255, 255, 0.5);
}

.q-header {
  background-color: #00ad8d;
}
</style>

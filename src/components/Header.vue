<template>
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title>
        <q-img id="logo_head" src="logo-sava-cro.png" style="width: 48px; height: 48px" />
        {{ $t('title') }}
      </q-toolbar-title>
      <q-btn
        id="report-btn"
        size="12px"
        color="white"
        text-color="cro"
        icon="img:table-account.svg"
        @click="openReport(3)"
      >
        Poročila
        <q-menu auto-close v-if="1 === 2">
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section @click="openReport(1)">Delovni čas</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section @click="openReport(2)">Obračun izplačil</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section @click="openReport(3)">Opravljeno delo</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn
        id="dev-btn"
        flat
        round
        dense
        icon="developer_mode"
        :class="{
          unselected: !developer,
          selected: developer,
        }"
        v-if="this.$user_data.pravice.razvijalec === 'T' && isDevelopment"
        @click="$emit('toggleDeveloper')"
      >
        <q-tooltip> Developer mode </q-tooltip>
      </q-btn>
      <q-btn id="logout-btn" flat round dense icon="logout" @click="logout">
        <q-tooltip> Odjava </q-tooltip>
      </q-btn>
      <div></div>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  name: 'Header',

  props: {
    developer: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      leftDrawerOpen: false,
    }
  },

  methods: {
    logout() {
      localStorage.setItem('jwt', '')
      window.location.replace(import.meta.env.VUE_APP_API_URL + 'Logout.php')
    },
    isDevelopment() {
      return import.meta.env.MODE === 'development'
    },
    openReport(type) {
      switch (type) {
        case 1:
          window.open(
            'https://mimo.zav-sava.si/MicroStrategy/asp/Main.aspx?evt=4001&src=Main.aspx.4001&visMode=0&reportViewMode=1&reportID=0119A2C44009E59851B8E781564802AB&Server=SRV-MICROS-APP&Project=Konsolidacija%20oseb&Port=0&share=1',
            '_blank'
          )
          break
        case 2:
          window.open(
            'https://mimo.zav-sava.si/MicroStrategy/asp/Main.aspx?evt=4001&src=Main.aspx.4001&visMode=0&reportViewMode=1&reportID=EBE4FB3B4037FFA99B8BB38648421A96&Server=SRV-MICROS-APP&Project=Konsolidacija%20oseb&Port=0&share=1',
            '_blank'
          )
          break
        case 3:
          // window.open('https://mimo.zav-sava.si/MicroStrategy/servlet/mstrWeb?evt=4001&src=mstrWeb.4001&visMode=0&reportViewMode=1&reportID=2C3335F6478881289DEDA1AF31828219&Server=SRV-MSTRAT-INT.ZAV-MB.LOC&Project=Konsolidacija%20oseb&Port=0&share=1', '_blank')
          window.open(
            'https://mimo.zav-sava.si/MicroStrategy/servlet/mstrWeb?evt=4001&src=mstrWeb.4001&visMode=0&reportViewMode=1&reportID=2C3335F6478881289DEDA1AF31828219&Server=S-MSTRAT-INT.ZAV-MB.LOC&Project=Konsolidacija%20oseb&Port=0&share=1',
            '_blank'
          )
          break
      }
    },
  },
}
</script>
<style lang="scss" scoped>
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

#report-btn {
  background-color: #57bfa7 !important;
  color: #fff;
  text-transform: none;
  margin-right: 15px;
  box-shadow: none;
}

#report-btn .q-icon {
  margin-right: 8px;
}

.q-header {
  background-color: #00ad8d;
}
</style>

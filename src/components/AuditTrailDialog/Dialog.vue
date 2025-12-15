<template>
  <div class="q-pa-md">
    <UserDataRow :userData="userData" />
    <ATTable v-if="renderComponent" :data="auditTrailData"> </ATTable>
  </div>
</template>

<script>
import UserDataRow from 'components/AuditTrailDialog/UserDataRow.vue'
import ATTable from 'components/AuditTrailDialog/ATTable.vue'

export default {
  name: 'DAuditTrail',
  components: {
    UserDataRow,
    ATTable,
  },

  props: {
    userData: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      auditTrailData: [],
      renderComponent: true,
    }
  },

  methods: {
    getAuditTrailData(ezso) {
      this.$q.loading.show()
      this.api
        .post('RevizijskaSled', {
          EZSO: ezso,
        })
        .then((result) => {
          this.$q.loading.hide()

          if (result.data.success === true) {
            this.auditTrailData = result.data.podatki
            // this.forceRerender()
          } else {
            this.$noty.error(this.$t('e_napaka_auth_trail'), {
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

    forceRerender() {
      this.renderComponent = false

      this.$nextTick(() => {
        this.renderComponent = true
      })
    },
  },

  mounted() {
    if (this.userData['EZSO'] !== '') {
      this.getAuditTrailData(this.userData['EZSO'])
    }
  },

  computed: {
    envHelper() {
      return env
    },
  },
}
</script>

<style>
.q-pa-md {
  padding: 10px 16px;
}

.q-field--dense .q-field__before,
.q-field--dense .q-field__prepend {
  padding-right: 0px;
}

.q-field--dense .q-field__after,
.q-field--dense .q-field__append {
  padding-left: 0px;
}
</style>

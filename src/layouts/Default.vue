<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: false
    }
  },

  mounted () {
    // this.$router.push('/', () => {})
    /*
    this.token = localStorage.getItem('jwt')

    if (this.token === null || this.token === '') {
      this.$router.push('/login')
    } else {
      this.$router.push('')
    }
    */
  },

  methods: {
    logout () {
      this.api.post('Logout').then((result) => {
        /* if (result.data.success === true) {
          this.tableData = result.data.osebe
        } */
      })
    }
  }
}
</script>
<style lang="scss" sscoped>
  body {
    min-width: 600px;
    background-color: #EEEEEE;
  }

  main {
    background-color: #F1F1F1;
  }

  .text-cro {
    color: #616161;
  }
  .bg-cro {
    background: #616161;
  }

  .text-cro-green {
    color: #3CA082;
  }
  .bg-cro-green {
    background: #3CA082;
  }

  .text-cro-gray {
    color: #F5F5F5;
  }
  .bg-cro-gray {
    background: #F5F5F5;
  }

  .text-cro-light-gray {
    color: rgba(0, 0, 0, 0.3);
  }
  .bg-cro-light-gray {
    background: rgba(0, 0, 0, 0.3);
  }

  .text-cro-red {
    color: #D92531;
  }
  .bg-cro-red {
    background: #D92531;
  }

  .text-cro-yellow {
    color: #fede00;
  }
  .bg-cro-yellow {
    background: #fede00;
  }

  .q-item.q-router-link--active, .q-item {
    color: #939393;
  }

  .q-item.q-router-link--active, .q-item--active {
    // color: #00AD8D !important;
    color: #000000 !important;
  }

  .q-field__label {
    color: rgba(0, 0, 0, 0.5);
  }

  #filter-container .q-field {
    background-color: #F5F5F5;
    border-radius: 4px;
  }

  #filter-container .q-field--outlined .q-field__control::before {
    border: none;
  }

  .text-grey-8 {
    color: #3CA082 !important;
  }

  .q-menu {
    min-width: 100px !important;
  }

  .q-toolbar__title {
    font-size: 16px;
    font-weight: 500;
  }

  .q-table th {
    font-weight: revert;
  }

  .q-btn.selected {
    color: #616161;
  }

  .q-btn.unselected {
    color: #dadada;
  }

  .q-table__bottom {
    padding: 0px;
  }

  .q-table__bottom .full-width {
     padding: 4px 15px 4px 15px;
  }

  #phone-field #MazPhoneNumberInput {
    margin: 15px 5px 0px 5px;
    background-color: #F5F5F5;
    height: 56px;
    padding-top: 15px;
    border-radius: 4px;
  }

  #phone-field .country-selector__input,
  #phone-field .input-tel__input {
    background-color: #F5F5F5 !important;
  }

</style>

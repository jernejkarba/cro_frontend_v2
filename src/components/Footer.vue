<template>
  <q-footer class="vertical-middle">
    <div class="footer-text">
      &copy; Zavarovalnica Sava, d.d.
    </div>
  </q-footer>
</template>

<script>
export default {
  name: 'Header',

  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>

<style lang="scss" sscoped>
  .q-footer {
    background-color: transparent;
    height: 50px;
    position: absolute;
  }

  .footer-text {
    text-align: center;
    font-size: 12px;
    padding-top: 19px;
    color: rgba(0, 0, 0, 0.5);
  }
</style>

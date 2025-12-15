<template>
  <div class="row">
    <div class="col-7 data-col">
      <div class="row">
        <div class="col-6" style="background-color: #f5f5f5">
          <div class="title-div">
            {{ this.userData.NazivOsebe }}
          </div>
          <div class="subtitle-div">Dat. nastanka: {{ this.userData.DtNastanka }}</div>
        </div>
        <div class="col-6" style="background-color: #f5f5f5; max-width: 230px">
          <div class="user-data-col">
            <div class="data-col-title">Kon. dav. št</div>
            <div class="data-col-value">
              {{ this.userData.KonsolidacijskaDavcnaStevilka }}
            </div>
          </div>
          <div class="user-data-col">
            <div class="data-col-title">EZŠO</div>
            <div class="data-col-value">
              {{ this.userData.EZSO }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserData',

  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style>
.data-col {
  vertical-align: middle;
  /* background-color: #F5F5F5 !important; */
}
.title-div {
  padding: 15px 0px 5px 15px;
  font-weight: 600;
}
.subtitle-div {
  padding: 0px 0px 15px 15px;
}
.user-data-col {
  padding: 15px 8px 15px 8px;
  display: inline-grid;
}
.data-col-value {
  margin-top: 2px;
  border: 1px solid #c2c2c2;
  border-radius: 4px;
  padding: 2px 10px 2px 10px;
  font-weight: 600;
  min-height: 21px;
}
</style>

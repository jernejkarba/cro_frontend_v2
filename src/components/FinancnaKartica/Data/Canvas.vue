<template>
  <div id="tables" :class="this.export ? 'export' : ''">
    <div class="row justify-end" v-if="!this.export">
      <q-btn flat dense @click="back">
        <q-icon left name="reply" />
        <div>Nazaj</div>
      </q-btn>
    </div>
    <div class="row justify-end table-desc table-title" v-if="Object.keys(this.data).length > 0">
      <div class="col-12" id="fk-title-col">
        <span>{{ this.title }}</span
        ><span class="status-text" v-if="this.userStatus !== ''">{{ this.userStatus }}</span>
      </div>
      <div class="col-12" id="fk-subtitle-col">
        <span id="fk-subtitle">{{
          'Iskalni pogoji (' +
          (this.tableName.includes('Za sodišča') ? this.tableFiltersSodisce : this.tableFilters) +
          ')'
        }}</span>
      </div>
    </div>
    <div
      class="row justify-end table-desc"
      v-if="Object.keys(this.data).length > 0 && !this.export"
    >
      <div class="col-4">
        <q-btn
          id="fk-download-btn"
          size="12px"
          no-caps
          label="Izvozi PDF (vse)"
          @click="download(false)"
        />
        <span
          class="vertical-line"
          v-if="
            !this.export &&
            Object.keys(this.data).includes('seznam_odprtih_terjatev') &&
            Object.keys(this.data.seznam_odprtih_terjatev).includes('data') &&
            Object.keys(this.data.seznam_odprtih_terjatev.data).length > 0
          "
        >
        </span>
        <q-btn
          id="fk-download-excel-btn"
          size="12px"
          no-caps
          label="Izvozi XLSX"
          v-if="
            !this.export &&
            Object.keys(this.data).includes('seznam_odprtih_terjatev') &&
            Object.keys(this.data.seznam_odprtih_terjatev).includes('data') &&
            Object.keys(this.data.seznam_odprtih_terjatev.data).length > 0
          "
          @click="downloadExcel()"
        />

        <span
          class="vertical-line"
          v-if="
            !this.export &&
            Object.keys(this.data).includes('police_z_odprtim_saldom') &&
            Object.keys(this.data.police_z_odprtim_saldom).includes('data') &&
            Object.keys(this.data.police_z_odprtim_saldom.data).length > 0
          "
        >
        </span>
        <q-btn
          id="fk-download-excel-btn"
          size="12px"
          no-caps
          label="Izvozi XLSX"
          v-if="
            !this.export &&
            Object.keys(this.data).includes('police_z_odprtim_saldom') &&
            Object.keys(this.data.police_z_odprtim_saldom).includes('data') &&
            Object.keys(this.data.police_z_odprtim_saldom.data).length > 0
          "
          @click="downloadExcelStrnjeno()"
        />

        <q-btn
          id="fk-download-2-btn"
          size="12px"
          no-caps
          label="Izvozi PDF"
          v-if="
            !this.export &&
            Object.keys(this.data).includes('seznam_odprtih_terjatev') &&
            Object.keys(this.data.seznam_odprtih_terjatev).includes('data') &&
            Object.keys(this.data.seznam_odprtih_terjatev.data).length > 0
          "
          @click="download(true)"
        />
      </div>
    </div>
    <div>
      <ZvrstiTerjatev
        id="zvrsti-terjatev"
        v-if="Object.keys(this.data).includes('saldo_razlicnih_zvrsti_terjatev')"
        :data="[this.data.saldo_razlicnih_zvrsti_terjatev]"
        :regresi="
          Object.keys(this.data).includes('seznam_regresnih_zahtevkov') &&
          Object.keys(this.data.seznam_regresnih_zahtevkov).includes('data') &&
          Object.keys(this.data.seznam_regresnih_zahtevkov.data).length > 0
            ? true
            : false
        "
        :zamudneObresti="
          Object.keys(this.data).includes('obracuni_zamudnih_obresti') &&
          Object.keys(this.data.obracuni_zamudnih_obresti).includes('data') &&
          Object.keys(this.data.obracuni_zamudnih_obresti.data).length > 0
            ? true
            : false
        "
      >
      </ZvrstiTerjatev>
      <span
        id="seznam-odprtih-terjatev"
        v-if="
          Object.keys(this.data).includes('seznam_odprtih_terjatev') &&
          Object.keys(this.data.seznam_odprtih_terjatev).includes('data') &&
          Object.keys(this.data.seznam_odprtih_terjatev.data).length > 0
        "
      >
        <template v-for="component in components" :key="component">
          <component
            :is="component"
            :data="prepareData(data.seznam_odprtih_terjatev.data)"
            :sum="data.seznam_odprtih_terjatev.sum"
            :count="
              Object.keys(data.seznam_odprtih_terjatev).includes('count')
                ? data.seznam_odprtih_terjatev.count
                : 0
            "
            :tableName="tableName"
            :connectionStatus="connectionStatus"
            :dataType="dataType"
            @sendMessage="sendMessage($event)"
          >
          </component>
        </template>
      </span>

      <span id="other-tables">
        <ZapiranjeTerjatev
          v-if="
            Object.keys(this.data).includes('nacin_zapiranja_terjatev') &&
            Object.keys(this.data.nacin_zapiranja_terjatev).includes('data') &&
            Object.keys(this.data.nacin_zapiranja_terjatev.data).length > 0
          "
          :data="this.data.nacin_zapiranja_terjatev.data"
          :sum="this.data.nacin_zapiranja_terjatev.sum"
        >
        </ZapiranjeTerjatev>

        <RegresniZahtevki
          v-if="
            Object.keys(this.data).includes('seznam_regresnih_zahtevkov') &&
            Object.keys(this.data.seznam_regresnih_zahtevkov).includes('data') &&
            Object.keys(this.data.seznam_regresnih_zahtevkov.data).length > 0
          "
          :data="this.data.seznam_regresnih_zahtevkov"
        >
        </RegresniZahtevki>

        <KratkorocneTerjatve
          v-if="
            Object.keys(this.data).includes('kratkorocne_terjatve') &&
            Object.keys(this.data.kratkorocne_terjatve).includes('data') &&
            Object.keys(this.data.kratkorocne_terjatve.data).length > 0
          "
          :data="this.data.kratkorocne_terjatve.data"
          :sum="this.data.kratkorocne_terjatve.sum"
        >
        </KratkorocneTerjatve>

        <NeunovceniCeki
          v-if="
            Object.keys(this.data).includes('neunovceni_ceki_fizicnih_oseb') &&
            Object.keys(this.data.neunovceni_ceki_fizicnih_oseb).length > 0
          "
          :data="this.data.neunovceni_ceki_fizicnih_oseb"
        >
        </NeunovceniCeki>

        <ZastopniskaPorocila
          v-if="
            Object.keys(this.data).includes('odprta_zastopniska_porocila') &&
            Object.keys(this.data.odprta_zastopniska_porocila).includes('data') &&
            Object.keys(this.data.odprta_zastopniska_porocila.data).length > 0
          "
          :data="this.data.odprta_zastopniska_porocila.data"
          :sum="this.data.odprta_zastopniska_porocila.sum"
          :tableName="this.tableName"
          :connectionStatus="this.connectionStatus"
          :dataType="this.dataType"
          @sendMessage="sendMessage($event)"
        >
        </ZastopniskaPorocila>

        <ObracunZamudnihObresti
          v-if="
            Object.keys(this.data).includes('obracuni_zamudnih_obresti') &&
            Object.keys(this.data.obracuni_zamudnih_obresti).includes('data') &&
            Object.keys(this.data.obracuni_zamudnih_obresti.data).length > 0
          "
          :data="this.data.obracuni_zamudnih_obresti.data"
          :sum="this.data.obracuni_zamudnih_obresti.total_sum"
        >
        </ObracunZamudnihObresti>

        <PostopkiIzterjave
          v-if="Object.keys(this.data).includes('evidentirani_postopki_izterjave')"
          :data="this.data.evidentirani_postopki_izterjave"
        >
        </PostopkiIzterjave>

        <OdprtiSaldo
          v-if="
            Object.keys(this.data).includes('police_z_odprtim_saldom') &&
            Object.keys(this.data.police_z_odprtim_saldom).includes('data') &&
            Object.keys(this.data.police_z_odprtim_saldom.data).length > 0
          "
          :data="this.data.police_z_odprtim_saldom"
          :tableName="this.tableName"
        >
        </OdprtiSaldo>

        <OsebeZavrnejniCeki
          v-if="
            Object.keys(this.data).includes('osebe_z_zavrnjenimi_ceki') &&
            this.data.osebe_z_zavrnjenimi_ceki.isArray
          "
          :data="this.data.osebe_z_zavrnjenimi_ceki"
        >
        </OsebeZavrnejniCeki>

        <Osebe v-if="Object.keys(this.data).includes('osebe')" :data="this.data.osebe"> </Osebe>
      </span>
    </div>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
import * as XLSX from 'xlsx'

import ZvrstiTerjatev from 'components/FinancnaKartica/Data/Tables/ZvrstiTerjatev.vue'
import OdprteTerjatve from 'components/FinancnaKartica/Data/Tables/OdprteTerjatve.vue'
import OdprteTerjatveSum from 'components/FinancnaKartica/Data/Tables/OdprteTerjatveSum.vue'
import OdprteTerjatveNovi from 'components/FinancnaKartica/Data/Tables/OdprteTerjatveNovi.vue'
import OdprteTerjatveNoviSum from 'components/FinancnaKartica/Data/Tables/OdprteTerjatveNoviSum.vue'
import OdprteTerjatveIS from 'components/FinancnaKartica/Data/Tables/OdprteTerjatveIS.vue'
import OdprteTerjatveSodisce from 'components/FinancnaKartica/Data/Tables/OdprteTerjatveSodisce.vue'
import OdprteTerjatveSodisceSum from 'components/FinancnaKartica/Data/Tables/OdprteTerjatveSodisceSum.vue'
import OdprteTerjatveFakture from 'components/FinancnaKartica/Data/Tables/OdprteTerjatveFakture.vue'
import OdprteTerjatveFaktureNovo from 'components/FinancnaKartica/Data/Tables/OdprteTerjatveFaktureNovo.vue'
import OdprteTerjatveFaktureNovoSum from 'components/FinancnaKartica/Data/Tables/OdprteTerjatveFaktureNovoSum.vue'
import OdprteTerjatveFakturePolice from 'components/FinancnaKartica/Data/Tables/OdprteTerjatveFakturePolice.vue'
import OdprteTerjatveFakturePoliceSum from 'components/FinancnaKartica/Data/Tables/OdprteTerjatveFakturePoliceSum.vue'

import ZapiranjeTerjatev from 'components/FinancnaKartica/Data/Tables/ZapiranjeTerjatev.vue'
import RegresniZahtevki from 'components/FinancnaKartica/Data/Tables/RegresniZahtevki.vue'
import KratkorocneTerjatve from 'components/FinancnaKartica/Data/Tables/KratkorocneTerjatve.vue'
import NeunovceniCeki from 'components/FinancnaKartica/Data/Tables/NeunovceniCeki.vue'
import ObracunZamudnihObresti from 'components/FinancnaKartica/Data/Tables/ObracunZamudnihObresti.vue'
import Osebe from 'components/FinancnaKartica/Data/Tables/Osebe.vue'
import OsebeZavrnejniCeki from 'components/FinancnaKartica/Data/Tables/OsebeZavrnejniCeki.vue'
import ZastopniskaPorocila from 'components/FinancnaKartica/Data/Tables/ZastopniskaPorocila.vue'
import PostopkiIzterjave from 'components/FinancnaKartica/Data/Tables/PostopkiIzterjave.vue'
import OdprtiSaldo from 'components/FinancnaKartica/Data/Tables/OdprtiSaldo.vue'

export default {
  name: 'Canvas',

  components: {
    ZvrstiTerjatev,
    OdprteTerjatve,
    OdprteTerjatveSum,
    OdprteTerjatveNovi,
    OdprteTerjatveNoviSum,
    OdprteTerjatveIS,
    OdprteTerjatveSodisce,
    OdprteTerjatveSodisceSum,
    OdprteTerjatveFakture,
    OdprteTerjatveFaktureNovo,
    OdprteTerjatveFaktureNovoSum,
    OdprteTerjatveFakturePolice,
    OdprteTerjatveFakturePoliceSum,
    ZapiranjeTerjatev,
    RegresniZahtevki,
    KratkorocneTerjatve,
    NeunovceniCeki,
    ObracunZamudnihObresti,
    Osebe,
    OsebeZavrnejniCeki,
    ZastopniskaPorocila,
    PostopkiIzterjave,
    OdprtiSaldo,
  },

  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    data: {
      type: [Object, Array],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    userStatus: {
      type: String,
      required: true,
    },
    dataStore: {
      type: String,
      required: false,
    },
    tableName: {
      type: String,
      required: true,
    },
    tableFilters: {
      type: String,
      required: true,
    },
    tableFiltersPDF: {
      type: String,
      required: true,
    },
    tableFiltersSodisce: {
      type: String,
      required: true,
    },
    connectionStatus: {
      type: [String, null],
      required: true,
    },
    dataType: {
      type: [String, null],
      required: true,
    },
  },

  data() {
    return {
      components: [],
      leftDrawerOpen: false,
      export: false,
      exportOpt: {
        margin: [10, 8, 22, 8],
        filename: this.tableName,
        // pagebreak: { mode: 'avoid-all' },
        // pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      },
    }
  },

  beforeUpdate: function (data) {
    if (!this.export) {
      // this.$q.loading.hide()
    }
  },

  methods: {
    prepareData(data) {
      let preparedData = []
      let v
      for (v of Object.values(data)) {
        preparedData.push(v)
      }

      return preparedData
    },

    countRows(data) {
      let rows = 0
      if (data) {
        for (let v of Object.values(data)) {
          for (let vv of Object.values(v)) {
            vv = vv + 1
            rows++
          }
        }
      }

      return rows
    },

    downloadExcel() {
      if (
        this.dataStore === '' ||
        this.tableName === 'Finančna kartica - Individualni sektor (brez KNE) ' ||
        this.tableName === 'Finančna kartica - Po fakturah'
      ) {
        let dateNow = new Date()
        let dateString =
          ('0' + dateNow.getDate()).slice(-2) +
          '-' +
          ('0' + (dateNow.getMonth() + 1)).slice(-2) +
          '-' +
          dateNow.getFullYear() +
          ' ' +
          ('0' + dateNow.getHours()).slice(-2) +
          ':' +
          ('0' + dateNow.getMinutes()).slice(-2)

        let tableTitle =
          '<tr>' +
          '<td colspan="18" data-f-bold="true">' +
          '<b><span>' +
          this.title +
          '</span><span class="status-text">' +
          this.userStatus +
          '</span></b>' +
          '</td>' +
          '</tr>' +
          '<tr>' +
          '<td colspan="18">' +
          '<span id="fk-subtitle">Iskalni pogoji (' +
          (this.tableName.includes('Za sodišča') ? this.tableFiltersSodisce : this.tableFilters) +
          ')</span>' +
          '</td>' +
          '</tr>' +
          '<tr></tr>'

        let table = document.getElementById('odprte-terjatve-table')?.cloneNode(true)

        if (!table) {
          console.warn('Tabela "odprte-terjatve-table" ni najdena')
          return
        }

        let thead = table.getElementsByTagName('thead')[0]
        if (thead) {
          thead.innerHTML = tableTitle + thead.innerHTML
        }

        // pretvorimo DOM tabelo v worksheet
        const ws = XLSX.utils.table_to_sheet(table)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Seznam odprtih terjatev')

        XLSX.writeFile(wb, this.tableName.replace(/ /g, '_') + '_' + dateString + '.xlsx')
      } else {
        this.$q.loading.show()
        this.api
          .post('FinancnaKarticaExcel', {
            data_store: this.dataStore,
            table: this.tableName,
          })
          .then((result) => {
            this.$q.loading.hide()
            this.$emit('pageLoading', 'hide')

            if (result.data.success === true) {
              var url = import.meta.env.VUE_APP_API_URL + 'tmpFile/' + result.data.filename
              window.open(url, '_blank')
            } else {
              // window.location.replace('https://webauth.zav-sava.si/?back=' + import.meta.env.VUE_APP_FK_URL)
            }
          })
          .catch((error) => {
            this.$q.loading.hide()
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
            }
          })
      }
    },

    downloadExcelStrnjeno() {
      if (
        this.tableName === 'Finančna kartica - Strnjeno - vse police' ||
        this.tableName === 'Finančna kartica - Strnjeno vse fakture'
      ) {
        let dateNow = new Date()
        let dateString =
          ('0' + dateNow.getDate()).slice(-2) +
          '-' +
          ('0' + (dateNow.getMonth() + 1)).slice(-2) +
          '-' +
          dateNow.getFullYear() +
          ' ' +
          ('0' + dateNow.getHours()).slice(-2) +
          ':' +
          ('0' + dateNow.getMinutes()).slice(-2)

        let tableTitle =
          '<tr>' +
          '<td colspan="18" data-f-bold="true">' +
          '<b><span>' +
          this.title +
          '</span><span class="status-text">' +
          this.userStatus +
          '</span></b>' +
          '</td>' +
          '</tr>' +
          '<tr>' +
          '<td colspan="18">' +
          '<span id="fk-subtitle">Iskalni pogoji (' +
          (this.tableName.includes('Za sodišča') ? this.tableFiltersSodisce : this.tableFilters) +
          ')</span>' +
          '</td>' +
          '</tr>' +
          '<tr></tr>'

        let table = document.getElementById('odprti-saldo-table')?.cloneNode(true)

        if (!table) {
          console.warn('Tabela "odprti-saldo-table" ni najdena')
          return
        }

        let thead = table.getElementsByTagName('thead')[0]
        if (thead) {
          thead.innerHTML = tableTitle + thead.innerHTML
        }

        const ws = XLSX.utils.table_to_sheet(table)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Police z odprtim saldom')

        XLSX.writeFile(wb, this.tableName.replace(/ /g, '_') + '_' + dateString + '.xlsx')
      }
    },

    download(onlyTerjatve = false) {
      this.export = true

      this.$q.loading.show()
      this.$emit('pageLoading', 'show')

      // let myHeader = this.title
      // let filtersString = this.tableFiltersPDF
      let filename = this.tableName

      if (onlyTerjatve) {
        var othersElement = document.getElementById('other-tables')
        if (othersElement) {
          othersElement.style.display = 'none'
        }
        var zvrstElement = document.getElementById('zvrsti-terjatev')
        if (zvrstElement) {
          zvrstElement.style.display = 'none'
        }
      }

      html2pdf()
        .from(document.getElementById('tables'))
        .set(this.exportOpt)
        .toPdf()
        .get('pdf')
        .then(function (pdf) {
          var totalPages = pdf.internal.getNumberOfPages()

          for (var i = 1; i <= totalPages; i++) {
            pdf.setPage(i)

            pdf.setFontSize(8)
            pdf.setTextColor(150)

            var myFooter = 'Stran ' + i + ' od ' + totalPages
            // var myFilters = 'Iskalni pogoji (' + filtersString + ')'

            // Header
            /*
            pdf.text(myHeader, 7, 9)
            pdf.line(7, 11, 150, 11)
            pdf.setFontSize(5)
            pdf.text(myFilters, 7, 15)
            pdf.setFontSize(9)
            */
            // Footer
            pdf.text('Zavarovalnica Sava, d.d.;', 10, 283)
            pdf.text('Ulica Eve Lovše 7, 2000 Maribor', 10, 287)
            pdf.text('Zaupno!', 98, 287)
            pdf.text(myFooter, 178, 287)
          }
        })
        .save(filename)

      setTimeout(() => {
        this.export = false
        this.$q.loading.hide()

        if (onlyTerjatve) {
          if (othersElement) {
            othersElement.style.display = 'block'
          }
          if (zvrstElement) {
            zvrstElement.style.display = 'block'
          }
        }
      }, '5000')
    },

    setDynamicComponents() {
      this.components = []

      if (
        Object.keys(this.data).includes('seznam_odprtih_terjatev') &&
        this.data.seznam_odprtih_terjatev.count <= 10000
      ) {
        if (
          this.tableName.includes('generalne pogodbe') &&
          !this.tableName.includes('fakturah') &&
          !this.tableName.includes('sodišča')
        ) {
          this.components.push('OdprteTerjatve')
        }
        if (this.tableName.includes('sodišča')) {
          this.components.push('OdprteTerjatveSodisce')
        }
        if (
          !this.tableName.includes('Individualni sektor') &&
          !this.tableName.includes('generalne pogodbe') &&
          !this.tableName.includes('fakturah') &&
          !this.tableName.includes('sodišča')
        ) {
          this.components.push('OdprteTerjatveNovi')
        }
        if (this.tableName.includes('fakturah in policah')) {
          this.components.push('OdprteTerjatveFakturePolice')
        }
        if (this.tableName.includes('fakturah - novo')) {
          this.components.push('OdprteTerjatveFaktureNovo')
        }
      } else {
        if (
          this.tableName.includes('generalne pogodbe') &&
          !this.tableName.includes('fakturah') &&
          !this.tableName.includes('sodišča')
        ) {
          this.components.push('OdprteTerjatveSum')
        }
        if (this.tableName.includes('sodišča')) {
          this.components.push('OdprteTerjatveSodisceSum')
        }
        if (
          !this.tableName.includes('Individualni sektor') &&
          !this.tableName.includes('generalne pogodbe') &&
          !this.tableName.includes('fakturah') &&
          !this.tableName.includes('sodišča')
        ) {
          this.components.push('OdprteTerjatveNoviSum')
        }
        if (this.tableName.includes('fakturah in policah')) {
          this.components.push('OdprteTerjatveFakturePoliceSum')
        }
        if (this.tableName.includes('fakturah - novo')) {
          this.components.push('OdprteTerjatveFaktureNovoSum')
        }
      }

      if (
        this.tableName.includes('Individualni sektor') &&
        !this.tableName.includes('fakturah') &&
        !this.tableName.includes('sodišča')
      ) {
        this.components.push('OdprteTerjatveIS')
      }
      if (
        this.tableName.includes('fakturah') &&
        !this.tableName.includes('fakturah - novo') &&
        !this.tableName.includes('fakturah in policah')
      ) {
        this.components.push('OdprteTerjatveFakture')
      }
    },

    sendMessage(msg) {
      this.$emit('sendMessage', msg)
    },

    back() {
      window.location.replace(import.meta.env.VUE_APP_FK_URL)
    },

    logout() {
      localStorage.setItem('jwt', '')
      window.location.replace(import.meta.env.VUE_APP_API_URL + 'Logout.php')
    },
  },

  watch: {
    data: function () {
      this.setDynamicComponents()
    },
  },
}
</script>
<style lang="scss" sscoped>
.fk-table-title {
  /* color: #6F6F6F; */
  color: #000000;
  font-size: 14px;
  margin-bottom: 10px;
}

.fk-table-title small {
  display: contents;
  color: #c10015;
}

.export .fk-table-title {
  font-size: 10px;
}

.q-table__middle {
  margin-bottom: 35px;
}

#fk-download-btn,
#fk-download-2-btn,
#fk-download-excel-btn {
  float: right;
}

#fk-download-2-btn,
#fk-download-excel-btn {
  margin-right: 10px;
}

.fk-table {
  box-shadow: 0px 3px 6px #00000029;
}

.fk-table tr {
  height: auto !important;
}

.fk-table thead tr th {
  background: #f5f5f5 0% 0% no-repeat padding-box;
  height: 47px;
}

.fk-table th,
.fk-table td {
  white-space: initial !important;
  padding: 2px 10px;
  font-size: 11px !important;
  height: auto !important;
}

.export .fk-table th,
.export .fk-table td {
  padding: 2px 2px;
  font-size: 8.2px !important;
}

.fk-table th {
  padding: 4px 10px;
  text-align: left;
}

.fk-table th.right,
.fk-table td.right {
  text-align: right;
}

.fk-table td.ut-link {
  color: #3ca082;
  cursor: pointer;
}

.fk-table tbody tr td.sum-cell {
  background-color: #f7ecf3;
  font-weight: 600;
}

.fk-table tbody tr td.total-sum-cell {
  background-color: #f7d6ea;
  font-weight: 600;
}

.fk-table tbody tr td.sub-sum-cell {
  background-color: #d2d2ff;
  font-weight: 600;
}

.fk-table tbody tr.highlight-row td {
  background-color: #f7d6ea;
  font-weight: 600;
}

.fk-table tbody tr td.not-bold {
  font-weight: normal;
}

.fk-table tbody tr td.opombe-line {
  white-space: pre-line !important;
}

.table-desc {
  margin-bottom: 25px;
}

.table-desc #fk-title-col {
  border-bottom: 1px solid #000000;
}

.table-desc #fk-title-col span {
  font-size: 16px;
  font-weight: bold;
}

.export .table-desc #fk-title-col span {
  font-size: 12px;
}

.table-desc #fk-subtitle-col span {
  text-align: left;
  font-size: 10px;
}

.export .table-desc #fk-subtitle-col span {
  font-size: 8px;
}

.q-table--cell-separator th {
  border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.q-table--cell-separator td:first-child,
.q-table--cell-separator th:first-child {
  border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.q-table--cell-separator td:last-child,
.q-table--cell-separator th:last-child {
  border-right: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.q-table--cell-separator tr:last-child td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

span.vertical-line {
  float: right;
  height: 40px;
  margin-top: -5px;
  margin-right: 10px;
  border-left: 2px solid #979797;
}

span.status-text {
  color: #c74187;
  background-color: #fbe0e7;
  margin-left: 15px;
  padding: 0px 5px;
}
</style>

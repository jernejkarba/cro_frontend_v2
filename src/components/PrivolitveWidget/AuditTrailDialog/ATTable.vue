<template>
  <div>
    <div class="row justify-between items-center" id="table-before-row">
      <div class="col-4"></div>
      <div class="col-8">
        <div id="table-show-rows">
          <span id="show-rows-label">
            {{ $t('pri_prikazi') }}
          </span>
          <div id="show-rows-options">
            <q-checkbox color="cro-green" size="xs" v-model="showNT" label="Neposredno trženje" />
            <q-checkbox
              color="cro-green"
              size="xs"
              v-model="showPOSPAR"
              label="Poslovni partnerji"
            />
            <q-checkbox color="cro-green" size="xs" v-model="showESoglasja" label="E-soglasja" />
          </div>
        </div>
      </div>
    </div>
    <q-table
      class="sticky-header-table"
      id="privolitve-widget-table"
      table-header-class="cro-bg"
      title=""
      :virtual-scroll="true"
      :rows="data"
      :columns="columns"
      :loading="loading"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :sort-method="customSort"
      hide-bottom
      binary-state-sort
    >
      <template v-slot:body="props">
        <!-- NEPOSREDNO TRŽENJE -->
        <q-tr
          class="main-row"
          :props="props"
          :key="props.row.ID"
          :id="props.row.ID"
          v-if="props.row.Privolitev === 'NT' && showNT"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer"> Neposredno trženje </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.NTProf === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtAkcije }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.NTProf === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props">
            <q-btn
              class="file-btn"
              size="12px"
              color="white"
              text-color="cro"
              icon="mdi-download"
              v-if="parseInt(props.row.DKM001ID) > 0"
              @click="downloadDocument(props.row.DKM001ID)"
            >
              {{ $t('prenesi') }}
            </q-btn>
            <q-btn
              class="no-file-btn"
              size="12px"
              color="white"
              text-color="cro"
              v-else-if="props.row.NTProf === '1'"
            >
              {{ $t('ne_obstaja') }}
            </q-btn>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              class="btn-table-action"
              size="12px"
              color="cro-gray"
              text-color="black"
              :icon="
                privolitveDetails.includes(props.row.ID)
                  ? 'keyboard_arrow_up'
                  : 'keyboard_arrow_down'
              "
              @click="toggleDetails(props.row.ID)"
              v-if="data.length > 0 && data[0].EZSOPrivolitve.length > 2"
            />
          </q-td>
        </q-tr>

        <!-- TRŽENJE Z NAVADNO POŠTO -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'NT' && showNT"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer"> Trženje z navadno pošto </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.NavPos === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtNavPos }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.NavPos === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE Z ELEKTRONSKO POŠTO -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'NT' && showNT"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer">
            Trženje z elektronsko pošto
            <q-tooltip
              anchor="bottom middle"
              self="center middle"
              :offset="[10, 10]"
              v-if="props.row.GDPRENaslov !== null"
            >
              {{ props.row.GDPRENaslov }}
            </q-tooltip>
          </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.EPos === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtEPos }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.EPos === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE S TELEFONSKIMI KLICI -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'NT' && showNT"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer">
            Trženje s telefonskimi klici
            <q-tooltip
              anchor="bottom middle"
              self="center middle"
              :offset="[10, 10]"
              v-if="props.row.GDPRTelefon !== null"
            >
              {{ props.row.GDPRTelefon }}
            </q-tooltip>
          </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.TelKlici === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtTelKlici }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.TelKlici === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE S SMS -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'NT' && showNT"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer"> Trženje s SMS </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.SMS === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtSMS }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.SMS === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE Z MMS -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'NT' && showNT"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer"> Trženje z MMS </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.MMS === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtMMS }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.MMS === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE PREKO MOBILNIH APLIKACIJ -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'NT' && showNT"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer">
            Trženje preko mobilnih aplikacij
          </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.MobApl === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtMobApl }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.MobApl === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE PREKO SPLETNIH APLIKACIJ -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'NT' && showNT"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer">
            Trženje preko spletnih aplikacij
          </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.SplApl === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtSplApl }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.SplApl === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- POSLOVNI PARTNERJI -->
        <q-tr
          class="main-row"
          :props="props"
          :key="props.row.ID"
          :id="props.row.ID"
          v-if="props.row.Privolitev === 'POSPAR' && showPOSPAR"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer"> Poslovni partnerji </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.NTPosPar === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtAkcije }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.NTPosPar === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props">
            <q-btn
              class="file-btn"
              size="12px"
              color="white"
              text-color="cro"
              icon="mdi-download"
              v-if="parseInt(props.row.DKM001ID) > 0"
              @click="downloadDocument(props.row.DKM001ID)"
            >
              {{ $t('prenesi') }}
            </q-btn>
            <q-btn
              class="no-file-btn"
              size="12px"
              color="white"
              text-color="cro"
              v-else-if="props.row.NTPosPar === '1'"
            >
              {{ $t('ne_obstaja') }}
            </q-btn>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              class="btn-table-action"
              size="12px"
              color="cro-gray"
              text-color="black"
              :icon="
                privolitveDetails.includes(props.row.ID)
                  ? 'keyboard_arrow_up'
                  : 'keyboard_arrow_down'
              "
              @click="toggleDetails(props.row.ID)"
              v-if="data.length > 0 && data[0].EZSOPrivolitve.length > 2"
            />
          </q-td>
        </q-tr>

        <!-- TRŽENJE Z NAVADNO POŠTO -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'POSPAR' && showPOSPAR"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer"> Trženje z navadno pošto </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.NavPos === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtNavPos }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.NavPos === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE Z ELEKTRONSKO POŠTO -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'POSPAR' && showPOSPAR"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer">
            Trženje z elektronsko pošto
            <q-tooltip
              anchor="bottom middle"
              self="center middle"
              :offset="[10, 10]"
              v-if="props.row.GDPRENaslov !== null"
            >
              {{ props.row.GDPRENaslov }}
            </q-tooltip>
          </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.EPos === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtEPos }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.EPos === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE S TELEFONSKIMI KLICI -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'POSPAR' && showPOSPAR"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer">
            Trženje s telefonskimi klici
            <q-tooltip
              anchor="bottom middle"
              self="center middle"
              :offset="[10, 10]"
              v-if="props.row.GDPRTelefon !== null"
            >
              {{ props.row.GDPRTelefon }}
            </q-tooltip>
          </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.TelKlici === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtTelKlici }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.TelKlici === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE S SMS -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'POSPAR' && showPOSPAR"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer"> Trženje s SMS </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.SMS === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtSMS }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.SMS === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE Z MMS -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'POSPAR' && showPOSPAR"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer"> Trženje z MMS </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.MMS === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtSMS }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.SMS === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE PREKO MOBILNIH APLIKACIJ -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'POSPAR' && showPOSPAR"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer">
            Trženje preko mobilnih aplikacij
          </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.MobApl === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtMobApl }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.MobApl === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- TRŽENJE PREKO SPLETNIH APLIKACIJ -->
        <q-tr
          class="details"
          v-show="privolitveDetails.includes(props.row.ID)"
          :props="props"
          :key="props.row.ID"
          v-if="props.row.Privolitev === 'POSPAR' && showPOSPAR"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer">
            Trženje preko spletnih aplikacij
          </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="check"
              style="color: #3da183"
              v-if="props.row.SplApl === '1'"
            />
            <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtSplApl }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.SplApl === '1'">Privolitev</span>
            <span v-else>Preklic</span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props"> </q-td>
          <q-td key="actions" :props="props"> </q-td>
        </q-tr>

        <!-- E-soglasja -->
        <q-tr
          class="main-row"
          :props="props"
          :key="props.row.ID"
          :id="props.row.ID"
          v-if="props.row.Privolitev === 'soglasje' && showESoglasja"
        >
          <q-td key="Naziv" :props="props" style="cursor: pointer">
            E-soglasje
            <q-tooltip
              anchor="bottom middle"
              self="center middle"
              :offset="[10, 10]"
              v-if="props.row.ESoglasjeKontakt.length > 5"
            >
              {{ props.row.ESoglasjeKontakt }}
            </q-tooltip>
          </q-td>
          <q-td key="Privolitev" :props="props">
            <q-icon
              class="status-icon"
              name="mdi-alert-circle"
              color="warning"
              v-if="props.row.ESoglasjeVerifikacijaCode === '1'"
            />
            <span v-else>
              <q-icon
                class="status-icon"
                name="check"
                style="color: #3da183"
                v-if="props.row.ESoglasja === '1'"
              />
              <q-icon class="status-icon" name="close" style="color: #c10013" v-else />
            </span>
          </q-td>
          <q-td key="DtAkcije" :props="props">
            {{ props.row.DtAkcije }}
          </q-td>
          <q-td key="Akcija" :props="props">
            <span v-if="props.row.ESoglasjeVerifikacijaCode === '1'">Verifikacija</span>
            <span v-else>
              <span v-if="props.row.ESoglasja === '1'">Privolitev</span>
              <span v-else>Preklic</span>
            </span>
          </q-td>
          <q-td key="Vir" :props="props">
            {{ props.row.Vir }}
          </q-td>
          <q-td key="Dodal" :props="props">
            {{ props.row.Username }}
          </q-td>
          <q-td key="Dokazilo" :props="props">
            <q-btn
              class="file-btn"
              size="12px"
              color="white"
              text-color="cro"
              icon="mdi-download"
              v-if="parseInt(props.row.DKM001IDESoglasja) > 0"
              @click="downloadDocument(props.row.DKM001IDESoglasja)"
            >
              {{ $t('prenesi') }}
            </q-btn>
            <q-btn
              class="no-file-btn"
              size="12px"
              color="white"
              text-color="cro"
              v-else-if="props.row.ESoglasja === '1'"
            >
              {{ $t('ne_obstaja') }}
            </q-btn>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              class="btn-table-action"
              size="12px"
              color="cro-gray"
              :icon="
                privolitveDetails.includes(props.row.ID)
                  ? 'keyboard_arrow_up'
                  : 'keyboard_arrow_down'
              "
              text-color="black"
              v-if="1 === 2"
              @click="toggleDetails(props.row.ID)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'ATTable',

  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      GDPRCheckbox: true,
      ESoglasjeCheckbox: true,

      showNT: true,
      showPOSPAR: true,
      showESoglasja: true,

      NTDetails: false,
      PosParDetails: false,
      ESoglasjaDetails: false,

      privolitveDetails: [],

      pagination: {
        rowsPerPage: 10,
        sortBy: 'DtAkcije',
        descending: true,
      },

      editableContacts: [],

      columns: [
        {
          name: 'Naziv',
          required: false,
          label: 'Naziv',
          tooltip: '',
          align: 'left',
          sortable: false,
          style: 'width: 150px',
        },
        {
          name: 'Privolitev',
          required: false,
          label: 'Privolitev',
          tooltip: '',
          align: 'center',
          sortable: false,
          style: 'width: 80px',
        },
        {
          name: 'DtAkcije',
          required: false,
          label: 'Datum akcije',
          tooltip: '',
          align: 'left',
          sortable: true,
          style: 'width: 100px',
        },
        {
          name: 'Akcija',
          required: false,
          label: 'Akcija',
          align: 'left',
          sortable: false,
          style: 'width: 100px',
        },
        {
          name: 'Vir',
          required: false,
          label: 'Avtor akcije',
          tooltip: '',
          align: 'left',
          field: 'Vir',
          sortable: false,
          style: 'width: 100px',
        },
        {
          name: 'Dodal',
          required: false,
          label: 'EZŠO avtorja',
          tooltip: '',
          align: 'left',
          sortable: false,
          style: 'width: 120px',
        },
        {
          name: 'Dokazilo',
          required: false,
          label: 'Dokazilo',
          tooltip: '',
          align: 'left',
          sortable: false,
          style: 'width: 120px',
        },
        {
          name: 'actions',
          required: false,
          label: '',
          tooltip: '',
          align: 'middle',
          sortable: false,
          style: 'width: 50px',
        },
      ],
    }
  },

  methods: {
    toggleDetails(id) {
      if (this.privolitveDetails.includes(id)) {
        this.privolitveDetails = this.privolitveDetails.filter((e) => e !== id)
      } else {
        this.privolitveDetails.push(id)
      }
    },

    downloadDocument(dkm001Id) {
      this.$q.loading.show()
      this.api
        .post('Dokument', {
          DKM01_ID: dkm001Id,
        })
        .then((result) => {
          this.$q.loading.hide()

          if (result.data.success === true) {
            const linkSource = 'data:' + result.data.mimetype + ';base64,' + result.data.content
            const downloadLink = document.createElement('a')

            downloadLink.href = linkSource
            downloadLink.download = result.data.filename
            downloadLink.click()
          } else {
            this.$noty.error(this.$t(result.data.message_key), {
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

    customSort(rows, sortBy, descending) {
      const data = [...rows]

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a
          const y = descending ? a : b

          if (sortBy === 'DtAkcije') {
            // Date sort
            let xDay = x[sortBy].split('.')[0]
            let xMonth = x[sortBy].split('.')[1]
            let xYear = x[sortBy].split('.')[2]

            let yDay = y[sortBy].split('.')[0]
            let yMonth = y[sortBy].split('.')[1]
            let yYear = y[sortBy].split('.')[2]

            const xDate = new Date(xYear + '-' + xMonth + '-' + xDay)
            const yDate = new Date(yYear + '-' + yMonth + '-' + yDay)

            return xDate > yDate ? 1 : xDate < yDate ? -1 : 0
          } else {
            return x['Privolitev'] > y['Privolitev']
              ? 1
              : x['Privolitev'] < y['Privolitev']
              ? -1
              : 0
          }
        })
      }
      return data
    },
  },
}
</script>

<style>
#privolitve-widget-table #table-title,
.new-privolitev-widget-table #table-title {
  margin-bottom: 0px !important;
  font-weight: bold;
}

#table-before-row {
  margin: 10px 0px 10px 0px;
}

#table-subtitle {
  font-size: 13px;
  margin-bottom: 15px;
}

#table-show-rows {
  float: right;
}

#show-rows-label {
  color: #acacac;
}

#show-rows-label,
#show-rows-options {
  display: inline;
  font-size: 12px !important;
}

#show-rows-options .q-checkbox__label {
  padding-left: 0px !important;
  margin-left: -5px;
  margin-right: 5px;
}

.status-icon {
  color: rgb(61, 161, 131);
  font-size: 18px;
}

.q-field__control {
  color: #3ca082;
}

.text-body2 {
  font-size: 12px;
}

#privolitve-widget-table .q-table thead tr,
#privolitve-widget-table .q-table tbody td,
.new-privolitev-widget-table .q-table thead tr,
.new-privolitev-widget-table .q-table tbody td {
  height: 35px;
}

.main-row td {
  font-weight: bold;
  background-color: #ecf2f0;
}

.details td {
  background-color: #f5f8f7;
  color: #747474;
}

#privolitve-widget-table .file-btn,
#privolitve-widget-table .btn-table-action {
  background-color: #ecf2f0 !important;
  box-shadow: none !important;
  border: 1px solid #c2c2c2;
}

#privolitve-widget-table .file-btn {
  color: #000;
  padding: 0px 10px;
  text-transform: none;
  min-height: 2.2em !important;
}

#privolitve-widget-table .file-btn i.mdi {
  margin-right: 3px;
  font-size: 1.2em;
}

#privolitve-widget-table .no-file-btn {
  color: #c10013 !important;
  background-color: rgba(193, 0, 19, 0.1) !important;
  box-shadow: none !important;
  border: 1px solid #c2c2c2;
  padding: 0px 5px;
  text-transform: none;
  cursor: initial;
  min-height: 2.2em !important;
}
</style>

<style lang="sass">
.sticky-header-table
  .q-table__middle
    max-height: 100%

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>

<style lang="sass">
.sticky-header-table
  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #f5f5f5

  div.q-table__middle.scroll.cro-bg table.q-table thead tr.cro-bg th.text-left.sortable.sorted i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left,
  div.q-table__middle.scroll.cro-bg table.q-table thead tr.cro-bg th.text-left.sortable i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left
    color: #3CA082

.sticky-header-table.selected
  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #d5e5e1

  div.q-table__middle.scroll table.q-table thead tr th.text-left.sortable.sorted i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left,
  div.q-table__middle.scroll table.q-table thead tr th.text-left.sortable i.material-icons.q-icon.q-table__sort-icon.q-table__sort-icon--left
    color: #3CA082
</style>

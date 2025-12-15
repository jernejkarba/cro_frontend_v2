<template>
  <div class="q-pa-md">
    <div class="display-icon row justify-between">
      <div class="col-5 self-center">
        <div style="display: inline-block" @click="visible = !visible">
          <q-icon :name="visible ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" size="sm" />
          <span class="table-title" v-if="config.type === 'basic'">
            {{ total + ' ' + zadetek_format() }}
          </span>
          <span class="table-title" v-else>
            {{ $t('izbor') }}
          </span>
        </div>
      </div>

      <div class="col-7 items-right" id="table-options">
        <div class="row" :style="config.type === 'basic' ? 'width: 280px;' : 'width: 30px;'">
          <div class="col self-center" style="min-width: 110px" v-if="config.type === 'basic'">
            {{ $t('show_rows') }}
          </div>
          <div class="col" v-if="config.type === 'basic'">
            <q-select
              class="items-end"
              v-model="pagination.rowsPerPage"
              borderless
              dense
              options-dense
              emit-value
              map-options
              style="width: 45px"
              :options="usersPerPage"
              @update:model-value="onRowsNumSwitch"
            />
          </div>

          <div class="col" style="max-width: 30px">
            <q-select
              v-model="config.visibleColumns"
              multiple
              borderless
              dense
              options-dense
              option-value="name"
              emit-value
              map-options
              hide-dropdown-icon
              :options="editableColumns"
              display-value=""
              style="width: 0px"
            >
              <template #prepend>
                <q-icon name="img:table-eye.svg" color="cro" />
              </template>
            </q-select>
          </div>

          <div class="col" id="multiple-sort-col" v-if="config.type === 'basic'">
            <q-btn
              :icon="
                pagination.multisort
                  ? 'img:sort-bool-ascending-variant-green.svg'
                  : 'img:sort-bool-ascending-variant.svg'
              "
              flat
            >
              <q-menu max-width="400px" v-model="multisortMenuShowing">
                <div class="row no-wrap q-pa-md">
                  <div class="column" style="width: 250px !important">
                    <div class="col">Razvrsti po vrstnem redu</div>
                    <div class="col row items-center">
                      <q-select
                        :options="sortColumns"
                        style="width: 180px"
                        label="1."
                        color="cro"
                        dense
                        options-dense
                        outlined
                        v-model="pagination.multisortOpt.first.field"
                      />
                      <div class="multisortArrows" style="width: 50px">
                        <q-icon
                          class="multisort_arrow"
                          name="arrow_upward"
                          :color="
                            pagination.multisortOpt.first.value === 'asc' ? 'cro' : 'cro-light-gray'
                          "
                          @click="pagination.multisortOpt.first.value = 'asc'"
                        />
                        <q-icon
                          class="multisort_arrow"
                          name="arrow_downward"
                          :color="
                            pagination.multisortOpt.first.value === 'desc'
                              ? 'cro'
                              : 'cro-light-gray'
                          "
                          @click="pagination.multisortOpt.first.value = 'desc'"
                        />
                      </div>
                    </div>
                    <div
                      class="col row items-center"
                      v-if="pagination.multisortOpt.first.field !== ''"
                    >
                      <q-select
                        :options="sortColumns"
                        style="width: 180px"
                        label="2."
                        color="cro"
                        dense
                        options-dense
                        outlined
                        v-model="pagination.multisortOpt.second.field"
                        stack-label
                      />
                      <div class="multisortArrows" style="width: 50px">
                        <q-icon
                          class="multisort_arrow"
                          name="arrow_upward"
                          :color="
                            pagination.multisortOpt.second.value === 'asc'
                              ? 'cro'
                              : 'cro-light-gray'
                          "
                          @click="pagination.multisortOpt.second.value = 'asc'"
                        />
                        <q-icon
                          class="multisort_arrow"
                          name="arrow_downward"
                          :color="
                            pagination.multisortOpt.second.value === 'desc'
                              ? 'cro'
                              : 'cro-light-gray'
                          "
                          @click="pagination.multisortOpt.second.value = 'desc'"
                        />
                      </div>
                    </div>
                    <div
                      class="col row items-center"
                      v-if="pagination.multisortOpt.second.field !== ''"
                    >
                      <q-select
                        :options="sortColumns"
                        style="width: 180px"
                        label="3."
                        color="cro"
                        dense
                        options-dense
                        outlined
                        v-model="pagination.multisortOpt.third.field"
                        stack-label
                      />
                      <div class="multisortArrows" style="width: 50px">
                        <q-icon
                          class="multisort_arrow"
                          name="arrow_upward"
                          :color="
                            pagination.multisortOpt.third.value === 'asc' ? 'cro' : 'cro-light-gray'
                          "
                          @click="pagination.multisortOpt.third.value = 'asc'"
                        />
                        <q-icon
                          class="multisort_arrow"
                          name="arrow_downward"
                          :color="
                            pagination.multisortOpt.third.value === 'desc'
                              ? 'cro'
                              : 'cro-light-gray'
                          "
                          @click="pagination.multisortOpt.third.value = 'desc'"
                        />
                      </div>
                    </div>

                    <div class="col">
                      <div id="multi-btns">
                        <q-btn
                          id="multi-1"
                          size="12px"
                          color="white"
                          text-color="cro"
                          icon="filter_1"
                          @click="setMultisort1()"
                        />

                        <q-btn
                          id="multi-2"
                          size="12px"
                          color="white"
                          text-color="cro"
                          icon="filter_2"
                          @click="setMultisort2()"
                        />
                      </div>
                    </div>

                    <div class="col">
                      <div id="sort-btns">
                        <q-btn
                          id="clear-btn"
                          size="12px"
                          color="white"
                          text-color="cro"
                          no-caps
                          :label="$t('cancel')"
                          @click="clearSort()"
                        />

                        <q-btn
                          id="search-btn"
                          size="12px"
                          color="cro-green"
                          text-color="white"
                          no-caps
                          :label="$t('sort')"
                          @click="multisort()"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <q-table
      :class="
        loading
          ? 'sticky-header-table loading ' + config.type
          : 'sticky-header-table ' + config.type
      "
      :table-class="config.type === 'basic' ? 'cro-bg' : ''"
      :table-header-class="config.type === 'basic' ? 'cro-bg' : ''"
      :card-class="config.type === 'basic' ? 'cro-bg' : ''"
      row-key="EZSO"
      selection="multiple"
      :loading="loading"
      :rows="Array.isArray(data) ? data : []"
      :columns="columns"
      :visible-columns="config.visibleColumns"
      :selected="selectedUsersLocal"
      @update:selected="
        (val) => {
          selectedUsersLocal = val
          $emit('update:selectedUsers', Array.isArray(val) ? val : [])
        }
      "
      v-model:pagination="pagination"
      v-model:expanded="expanded"
      :rows-per-page-options="[6]"
      binary-state-sort
      @request="onRequest"
    >
      <template
        v-if="
          config.type === 'selected' &&
          selectedUsers.length > 0 &&
          editable &&
          $user_data.pravice.popravljanje === 'T'
        "
        #top-row
      >
        <EditRow
          @closeEditRow="closeEditRow()"
          @editSelectedUsers="editSelectedUsers($event)"
          @setResponse="setResponse($event)"
          :editOK="editOK"
          :editValues="editValues"
          :visibleColumns="config.visibleColumns"
          :vrstaOsebeOptions="vrstaOsebeOptions"
          :spolOptions="spolOptions"
        />
      </template>

      <template v-slot:header-cell="props">
        <q-th :key="props.col.name" :props="props">
          {{ props.col.label }}
          <q-tooltip
            v-if="props.col.tooltip"
            anchor="bottom middle"
            self="center middle"
            :offset="[10, 10]"
          >
            {{ props.col.tooltip }}
          </q-tooltip>
        </q-th>
      </template>

      <template v-slot:body="props">
        <q-tr
          :class="[
            visible ? 'show-table' : 'hide-table',
            highlighted.includes(props.row.EZSO) ? 'highlighted' : '',
            props.selected && editable && config.type == 'selected' ? 'highlighted' : '',
            props.row.DtSmrti !== null && props.row.DtSmrti !== '' ? 'death' : '',
          ]"
          :props="props"
          :key="props.row.EZSO"
          :id="props.row.EZSO"
        >
          <q-td>
            <q-checkbox v-model="props.selected" color="cro-green" v-if="editable === 12" disable />
            <q-checkbox v-model="props.selected" color="cro-green" v-else />
          </q-td>
          <q-td key="arrow" :props="props">
            <q-icon
              class="move-arrow"
              name="arrow_downward"
              v-if="config.type === 'basic'"
              @click="
                $emit('selectUser', {
                  user: props.row,
                  pagination: pagination,
                  selectedUsers: selectedUsers,
                })
              "
            />
            <q-icon
              class="move-arrow"
              name="arrow_upward"
              v-else
              @click="$emit('clearUser', props.row)"
            />
          </q-td>
          <q-td key="KonsolidacijskaDavcnaStevilka" class="link_filter" :props="props">
            <div
              class="inline"
              @click="
                moveFilter(
                  config.type,
                  'KonsolidacijskaDavcnaStevilka',
                  props.row.KonsolidacijskaDavcnaStevilka
                )
              "
            >
              {{ props.row.KonsolidacijskaDavcnaStevilka }}
            </div>
            <div class="inline" v-if="props.row.KonsolidacijskaDavcnaStevilka !== null">
              <q-icon
                class="move-arrow cons-arrow"
                :name="
                  props.row.DtSmrti !== null && props.row.DtSmrti !== ''
                    ? 'img:kons_arrow_down_gray.svg'
                    : 'img:kons_arrow_down.svg'
                "
                v-if="config.type === 'basic' && props.row.KonsolidacijskaDavcnaStevilka != ''"
                @click="selectedUsersKons(props.row.KonsolidacijskaDavcnaStevilka)"
              />
              <q-icon
                class="move-arrow cons-arrow"
                :name="
                  props.row.DtSmrti !== null && props.row.DtSmrti !== ''
                    ? 'img:kons_arrow_up_gray.svg'
                    : 'img:kons_arrow_up.svg'
                "
                v-if="config.type === 'selected' && props.row.KonsolidacijskaDavcnaStevilka != ''"
                @click="clearSelectedUsersKons(props.row.KonsolidacijskaDavcnaStevilka)"
              />
            </div>
          </q-td>
          <q-td
            key="StopnjaZaupanja"
            class="link_filter"
            :props="props"
            @click="moveFilter(config.type, 'StopnjaZaupanja', props.row.StopnjaZaupanja)"
          >
            {{ props.row.StopnjaZaupanja }}
          </q-td>
          <q-td key="EZSO" class="link_filter" :props="props">
            <div>
              <q-icon
                class="gdpr-icon"
                name="verified_user"
                style="float: right"
                v-if="props.row.EZSOPrivolitve.length > 2"
                @click="$emit('openPrivolitveWidget', props.row.EZSO)"
              >
                <q-tooltip>
                  {{ $t('privolitve') }}
                </q-tooltip>
              </q-icon>
              <q-icon
                v-if="props.row.EZSOPrivolitve === '0'"
                class="gdpr-icon"
                name="verified_user"
                style="color: #c9c9c9; float: right"
                @click="$emit('openPrivolitveWidget', props.row.EZSO)"
              >
                <q-tooltip>
                  {{ $t('privolitve') }}
                </q-tooltip>
              </q-icon>
              <q-icon
                v-if="props.row.EZSOPrivolitve === '-2'"
                class="gdpr-icon"
                name="mdi-exclamation"
                style="color: #c10013; float: right; font-size: 14px"
                @click="$emit('openPrivolitveWidget', props.row.EZSO)"
              >
                <q-tooltip>
                  {{ $t('privolitev_conflict') }}
                </q-tooltip>
              </q-icon>
              <q-icon
                v-if="props.row.EZSOPrivolitve === '-2'"
                class="gdpr-icon"
                name="verified_user"
                style="float: right"
                @click="$emit('openPrivolitveWidget', props.row.EZSO)"
              >
                <q-tooltip>
                  {{ $t('privolitve') }}
                </q-tooltip>
              </q-icon>
            </div>
            <span
              style="padding-right: 20px"
              @click="moveFilter(config.type, 'EZSO', props.row.EZSO)"
            >
              {{ props.row.EZSO }}
            </span>
          </q-td>
          <q-td key="NazivOsebe" class="link_filter" :props="props">
            <div>
              <q-icon
                class="contact-icon"
                name="mdi-tooltip-account"
                style="float: right"
                v-if="props.row.KontaktiTel > 0 || props.row.KontaktiEmail > 0"
                @click="$emit('openContactWidget', props.row.EZSO)"
              >
                <q-tooltip content-style="{ background-color: '#ffffff', color: '#000000' }">
                  <q-icon name="call" size="15px" style="color: #ffffff; margin-right: 0px" />
                  {{ props.row.KontaktiTel }}
                  <q-icon
                    name="mail_outline"
                    size="15px"
                    style="color: #ffffff; margin-left: 5px; margin-right: 0px"
                  />
                  {{ props.row.KontaktiEmail }}

                  <span id="kac-icon" v-if="props.row.KontaktiKAC > 0"> KAC </span>

                  <q-icon
                    name="edit"
                    size="15px"
                    style="color: #1aad8d; margin-left: 10px; cursor: pointer; display: none"
                    @click="$emit('openContactWidget', props.row.EZSO)"
                  />
                </q-tooltip>
              </q-icon>
              <q-icon
                v-else
                class="contact-icon"
                name="mdi-tooltip-account"
                style="color: #c9c9c9; float: right"
                @click="$emit('openContactWidget', props.row.EZSO)"
              >
              </q-icon>
            </div>
            <span
              @click="moveFilter(config.type, 'NazivOsebe', props.row.NazivOsebe)"
              style="margin-right: 25px"
            >
              {{ props.row.NazivOsebe }}
            </span>
          </q-td>
          <q-td
            key="DavcnaStevilka"
            class="link_filter"
            :props="props"
            @click="moveFilter(config.type, 'DavcnaStevilka', props.row.DavcnaStevilka)"
          >
            {{ props.row.DavcnaStevilka }}
          </q-td>
          <q-td key="StopnjaPravilnosti" :props="props">
            {{ props.row.StopnjaPravilnosti }}
          </q-td>
          <q-td
            key="EMSO"
            class="link_filter"
            :props="props"
            @click="moveFilter(config.type, 'EMSO', props.row.EMSO)"
          >
            {{ props.row.EMSO === '#' ? '' : props.row.EMSO }}
          </q-td>
          <q-td
            key="DtRojstva"
            class="link_filter"
            :props="props"
            @click="moveFilter(config.type, 'DtRojstva', props.row.DtRojstva)"
          >
            {{ props.row.DtRojstva !== '#' ? props.row.DtRojstva : '' }}
            <q-icon
              class="death-icon"
              name="img:cross_gray.svg"
              v-if="props.row.DtSmrti !== null && props.row.DtSmrti !== ''"
            >
            </q-icon>
            <q-tooltip v-if="props.row.DtSmrti !== null && props.row.DtSmrti !== ''">
              Datum smrti: <br />
              {{ props.row.DtSmrti }}
            </q-tooltip>
          </q-td>
          <q-td
            key="Naslov"
            class="link_filter"
            :props="props"
            @click="moveFilter(config.type, 'Naslov', props.row)"
            style="/*width: calc(100% - 356px)*/"
          >
            {{
              props.row.Drzava.toUpperCase() === 'SLOVENIJA' ||
              props.row.Drzava === '' ||
              props.row.Drzava === null
                ? props.row.Naslov +
                  '; ' +
                  props.row.PostaSt +
                  ' ' +
                  props.row.Posta +
                  '; ' +
                  props.row.Drzava
                : props.row.Naslov + '; 0000 ' + props.row.Posta + '; ' + props.row.Drzava
            }}

            <q-icon name="done" v-if="props.row.UradniStalniNaslov !== null">
              <q-tooltip>
                Uradni stalni naslov: <br />
                {{ props.row.UradniStalniNaslov }}
              </q-tooltip>
            </q-icon>
          </q-td>
          <q-td
            key="Spol"
            class="link_filter"
            :props="props"
            @click="moveFilter(config.type, 'Spol', props.row.Spol)"
          >
            {{ props.row.Spol }}
          </q-td>
          <q-td
            key="VrstaOsebe"
            class="link_filter"
            :props="props"
            @click="moveFilter(config.type, 'VrstaOsebe', props.row.VrstaOsebe)"
          >
            {{ props.row.VrstaOsebe }}
          </q-td>
          <q-td
            key="Vir"
            class="link_filter"
            :props="props"
            @click="moveFilter(config.type, 'Vir', props.row.Vir)"
          >
            {{ props.row.Vir }}
          </q-td>
          <q-td
            key="actions"
            class="text-right"
            :props="props"
            v-if="config.type === 'basic' || config.type === 'selected'"
          >
            <q-btn
              class="btn-table-action"
              size="12px"
              :color="config.type === 'basic' ? 'cro-gray' : 'white'"
              text-color="cro"
              v-if="this.$user_data.pravice.ecrp === 'T' && props.row.TipOsebe !== '1'"
              icon="mdi-account-search"
              @click="openEcrpDialog(props.row)"
            >
              <q-tooltip> eCRP </q-tooltip>
            </q-btn>

            <q-btn
              class="btn-table-action"
              size="12px"
              :color="config.type === 'basic' ? 'cro-gray' : 'white'"
              text-color="cro"
              v-if="config.type === 'basic' || config.type === 'selected'"
              :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="
                () => {
                  props.expand = !props.expand
                  highlightRow(props.row.EZSO, props.expand)
                  toggleExpanded(props.row.EZSO)
                }
              "
            />
            <q-btn
              class="btn-table-action"
              size="12px"
              color="white"
              text-color="cro"
              icon="edit"
              v-if="config.type === 'selected2'"
            />
          </q-td>
        </q-tr>

        <q-tr v-if="props.expand" :key="props.key + '-details'" :props="props" class="details-row">
          <q-td :colspan="props.cols.length" class="user-details-td">
            <UserDetails
              @updateAfterEdit="updateAfterEdit($event)"
              @setResponse="setResponse($event)"
              @closeDetailsRow="toggleExpanded($event)"
              @openPrivolitveWidget="openPrivolitveWidget($event)"
              @openSifrantNaslovovDialog="openSifrantNaslovovDialog($event)"
              @closeSifrantNaslovovDialog="closeSifrantNaslovovDialog($event)"
              :user="props.row"
              :selectedUsers="selectedUsers"
              :vrstaOsebeOptions="vrstaOsebeOptions"
              :posebnaVrstaOsebeOptions="posebnaVrstaOsebeOptions"
              :vrstaOsebnegaDokumentaOptions="vrstaOsebnegaDokumentaOptions"
              :sifrantPost="sifrantPost"
              :sifrantDrzav="sifrantDrzav"
              :sifrantObcin="sifrantObcin"
              :sifrantNaselij="sifrantNaselij"
              :program="program"
            />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom>
        <div class="full-width row items-center">
          <div class="col">
            <span class="table-footer-text" style="display: inline-block">
              <span v-if="config.type === 'basic'">
                {{ $t('ut_izbranih') }} {{ `${selectedUsers.length}/${total}` }}
              </span>
              <span v-else>
                {{ $t('ut_izbranih') }} {{ `${selectedUsers.length}/${data.length}` }}
              </span>
            </span>
            <div v-if="config.type === 'basic'" style="display: inline-block">
              <q-btn
                no-caps
                color="white"
                text-color="cro"
                icon="arrow_downward"
                :label="$t('ut_move_to')"
                size="12px"
                v-if="selectedUsers.length > 0"
                @click="moveSelectedUsers"
              />
            </div>
            <div v-else style="display: inline-block">
              <q-btn
                no-caps
                color="white"
                text-color="cro"
                icon="arrow_upward"
                :label="$t('ut_remove_from')"
                size="12px"
                v-if="selectedUsers.length > 0"
                @click="clearSelectedUsers"
              />
            </div>
          </div>

          <div class="col">
            <q-pagination
              class="flex flex-center"
              color="cro"
              v-model="pagination.page"
              v-if="config.type === 'basic'"
              :max="total != null ? Math.ceil(total / pagination.rowsPerPage) : 0"
              :max-pages="6"
              :boundary-numbers="true"
              :direction-links="true"
              @update:model-value="onPageSwitch"
            >
            </q-pagination>
          </div>

          <div class="col selected-actions">
            <!--
            <q-btn
              no-caps
              :color="editType === 'cons' && editable ? 'cro-green' : 'white'"
              :text-color="editType === 'cons' && editable ? 'white' : 'cro'"
              icon="dynamic_feed"
              :label="$t('ut_konsolidacija')"
              size="12px"
              v-if="config.type === 'selected' /* && selectedUsers.length > 0 */"
              @click="openEditRow('cons')"/>
            -->
            <q-btn
              class="scroll-el-bottom"
              no-caps
              :color="editable ? 'cro-green' : 'white'"
              :text-color="editable ? 'white' : 'cro'"
              icon="edit"
              :label="$t('ut_edit_sel')"
              size="12px"
              style="margin-right: 10px"
              v-if="
                config.type === 'selected' &&
                selectedUsers.length > 0 &&
                this.$user_data.pravice.popravljanje === 'T'
              "
              @click="openEditRow('edit')"
            />
          </div>
        </div>
        <div
          class="full-width row items-center"
          style="background-color: #d5e5e1; padding-top: 6px"
          v-if="config.type === 'selected' && this.$user_data.pravice.konsolidacija === 'T'"
        >
          <KonsolidacijaRow
            @clearKonsRow="clearKonsRow()"
            @editSelectedUsers="editSelectedUsers($event)"
            @setResponse="setResponse($event)"
            @pageLoading="pageLoading($event)"
            @refreshSelectedUsers="refreshSelectedUsers()"
            @selectedUsersKons="selectedUsersKons($event)"
            :konsValues="konsValues"
            :selectedUsers="fullData"
            :visibleColumns="config.visibleColumns"
            :stopnjaZaupanjaOptions="stopnjaZaupanjaOptions"
            :neskladnostOptions="neskladnostOptions"
            :vrstaOsebeOptions="vrstaOsebeOptions"
            :konsOK="konsOK"
            :disabled="konsDisabled"
            :distributor="distributor"
            style="display: inline-block"
          />
        </div>
      </template>
      <template v-slot:no-data>
        <div class="full-width row">
          <span> {{ $t('ut_izbranih') }}: 0/0 </span>
        </div>
      </template>
    </q-table>

    <q-dialog
      v-model="ecrpDialog"
      transition-show="slide-up"
      transition-hide="slide-up"
      persistent
      :maximized="ecrpAuto"
    >
      <q-card class="bg-white" :style="!ecrpAuto ? 'width: 500px' : ''">
        <q-bar class="bg-cro-green">
          Vpogled v eCRP
          <q-space />
          <q-btn flat icon="close" @click="closeEcrpDialog(true)">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <EcrpReasonDialog
            @closeDialog="closeEcrpDialog($event)"
            @openDataDialog="openEcrpDataDialog($event)"
            @confirmEcrp="confirmEcrp()"
            :data="ecrpReasonData"
            :ecrpReference="ecrpReference"
            :vzrokOptions="ecrpVzrokOptions"
            :namenOptions="ecrpNamenOptions"
          >
          </EcrpReasonDialog>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="ecrpDataDialog"
      transition-show="slide-up"
      transition-hide="slide-up"
      persistent
      :position="ecrpDataDialogPosition"
      :maximized="ecrpAuto"
    >
      <q-card
        class="bg-white"
        :style="
          !ecrpAuto
            ? ecrpDataDialogPosition === 'bottom'
              ? 'max-width: 1600px; min-width: 800px; width: 80%; height: 50px'
              : 'max-width: 1600px; min-width: 800px; width: 80%;'
            : ''
        "
      >
        <q-bar class="bg-cro-green">
          Podatki iz eCRP
          <q-space />
          <q-btn
            flat
            :icon="
              ecrpDataDialogPosition === 'standard' ? 'keyboard_arrow_down' : 'keyboard_arrow_up'
            "
            @click="
              changeDialogPosition(ecrpDataDialogPosition === 'standard' ? 'bottom' : 'standard')
            "
            v-if="!ecrpAuto"
          >
            <q-tooltip>Prestavi okno</q-tooltip>
          </q-btn>
          <q-btn flat icon="close" @click="closeEcrpDataDialog(true)">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <EcrpDataDialog
            @closeDataDialog="closeEcrpDataDialog($event)"
            @updateAfterEdit="updateAfterEdit($event)"
            @sendMessage="sendMessage($event)"
            @selectData="selectEcrpData($event)"
            :data="ecrpData"
            :user="ecrpReasonData.user"
            :selected="ecrpSelected"
            :program="program"
          >
          </EcrpDataDialog>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="ecrpNamenDialog"
      transition-show="slide-up"
      transition-hide="slide-up"
      persistent
    >
      <q-card class="bg-white" style="width: 600px; max-width: 90vw; min-width: 600px">
        <q-bar class="bg-cro-green">
          eCrp namen
          <q-space />
          <q-btn flat icon="close" @click="closeEcrpNamenDialog()">
            <q-tooltip>Zapri</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <EcrpNamenDialog
            @closeNamenDialog="closeEcrpNamenDialog"
            @confirmEcrp="confirmEcrp()"
            :data="ecrpNamenData"
          >
          </EcrpNamenDialog>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import UserDetails from 'components/UserDetails.vue'
import EditRow from 'components/EditRow.vue'
import KonsolidacijaRow from 'components/KonsolidacijaRow.vue'
import EcrpReasonDialog from 'components/Ecrp/ReasonDialog.vue'
import EcrpDataDialog from 'components/Ecrp/DataDialog.vue'
import EcrpNamenDialog from 'components/Ecrp/NamenDialog.vue'

export default {
  name: 'usersTable',
  components: {
    UserDetails,
    EditRow,
    KonsolidacijaRow,
    EcrpReasonDialog,
    EcrpDataDialog,
    EcrpNamenDialog,
  },

  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    fullData: {
      type: Array,
      required: false,
      default: () => [],
    },
    total: {
      type: Number,
      required: false,
      default: 0,
    },
    config: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectedUsers: {
      type: Array,
      required: false,
      default: () => [],
    },
    editable: {
      type: Boolean,
      required: false,
      default: false,
    },
    editOK: {
      type: Boolean,
      required: false,
      default: true,
    },
    spolOptions: {
      type: Array,
      required: false,
      default: () => [],
    },
    vrstaOsebeOptions: {
      type: Array,
      required: false,
      default: () => [],
    },
    posebnaVrstaOsebeOptions: {
      type: Array,
      required: true,
    },
    vrstaOsebnegaDokumentaOptions: {
      type: Array,
      required: true,
    },
    sifrantPost: {
      type: Array,
      required: false,
      default: () => [],
    },
    sifrantDrzav: {
      type: Array,
      required: false,
      default: () => [],
    },
    sifrantObcin: {
      type: Array,
      required: false,
      default: () => [],
    },
    sifrantNaselij: {
      type: Array,
      required: false,
      default: () => [],
    },
    distributor: {
      type: Number,
      required: true,
    },
    ecrpAuto: {
      type: Boolean,
      required: false,
      default: false,
    },
    ecrpReference: {
      type: String,
      required: false,
      default: '',
    },
    ecrpReason: {
      type: String,
      required: false,
      default: '',
    },
    ecrpFields: {
      type: String,
      required: false,
      default: '',
    },
    program: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      visible: true,
      konsOK: 0,
      konsDisabled: false,
      expanded: [],

      selectedUsersLocal: Array.isArray(this.selectedUsers) ? [...this.selectedUsers] : [],

      filter: '',
      highlighted: [],
      multisortMenuShowing: false,
      usersPerPage: [
        {
          label: 10,
          value: 10,
        },
        {
          label: 15,
          value: 15,
        },
        {
          label: 20,
          value: 20,
        },
        {
          label: 25,
          value: 25,
        },
        {
          label: 50,
          value: 50,
        },
        {
          label: 100,
          value: 100,
        },
        {
          label: this.$t('vse'),
          value: 'all',
        },
      ],
      editableColumns: [
        {
          name: 'KonsolidacijskaDavcnaStevilka',
          label: this.$t('k_davcna'),
        },
        {
          name: 'StopnjaZaupanja',
          label: this.$t('stopnja_zaupanja'),
        },
        {
          name: 'EZSO',
          label: this.$t('id'),
        },
        {
          name: 'NazivOsebe',
          label: this.$t('naziv'),
        },
        {
          name: 'DavcnaStevilka',
          label: this.$t('davcna'),
        },
        {
          name: 'StopnjaPravilnosti',
          label: this.$t('stopnja_pravilnosti'),
        },
        {
          name: 'EMSO',
          label: this.$t('emso'),
        },
        {
          name: 'DtRojstva',
          label: this.$t('dt_rojstva'),
        },
        {
          name: 'Naslov',
          label: this.$t('naslov_posta_drzava'),
        },
        {
          name: 'Spol',
          label: this.$t('spol'),
        },
        {
          name: 'VrstaOsebe',
          label: this.$t('vrsta_osebe'),
        },
        {
          name: 'Vir',
          label: this.$t('vir'),
        },
      ],
      stopnjaZaupanjaOptions: [
        {
          label: '0: Fiktivna davčna',
          value: '0',
        },
        {
          label: '1: Ni potrjena',
          value: '1',
        },
        {
          label: '2: Potrdil skrbnik',
          value: '2',
        },
        {
          label: '3: Podatki UE',
          value: '3',
        },
        {
          label: '4: Potrdila stranka',
          value: '4',
        },
      ],
      neskladnostOptions: [
        {
          label: 'Ni neskladnosti',
          value: '-1',
        },
        {
          label: 'Neskladnost ni standardizirana',
          value: '0',
        },
        {
          label: 'Podvajanje davčne',
          value: '1',
        },
        {
          label: 'Več davčnih',
          value: '2',
        },
        {
          label: 'Potencialni dvojniki',
          value: '3',
        },
      ],
      sortColumns: [
        this.$t('k_davcna'),
        this.$t('stopnja_zaupanja'),
        this.$t('id'),
        this.$t('naziv'),
        this.$t('davcna'),
        this.$t('stopnja_pravilnosti'),
        this.$t('emso'),
        this.$t('dt_rojstva'),
        this.$t('naslov_posta_drzava'),
        this.$t('spol'),
        this.$t('vrsta_osebe'),
        this.$t('vir'),
      ],
      sortOptions: [
        {
          label: 'Naraščajoče',
          value: 'ASC',
        },
        {
          label: 'Padajoče',
          value: 'DESC',
        },
      ],
      columns: [
        {
          name: 'arrow',
          required: false,
          label: '',
          tooltip: '',
          align: 'middle',
          field: (row) => row.EZSO,
          sortable: false,
          style: 'width: 56px',
        },
        {
          name: 'KonsolidacijskaDavcnaStevilka',
          required: false,
          label: this.$t('k_davcna'),
          tooltip: '',
          align: 'left',
          field: 'KonsolidacijskaDavcnaStevilka',
          sortable: true,
          style: 'width: 110px',
        },
        {
          name: 'StopnjaZaupanja',
          required: false,
          label: this.$t('stopnja_zaupanja_short'),
          tooltip: this.$t('stopnja_zaupanja_hint'),
          align: 'left',
          field: 'StopnjaZaupanja',
          sortable: true,
          style: 'width: 30px',
        },
        {
          name: 'EZSO',
          required: false,
          label: this.$t('id'),
          tooltip: '',
          align: 'left',
          field: 'EZSO',
          sortable: true,
          style: 'width: 90px',
        },
        {
          name: 'NazivOsebe',
          required: false,
          label: this.$t('naziv'),
          tooltip: '',
          align: 'left',
          field: 'NazivOsebe',
          sortable: true,
          style: 'width: 250px',
        },
        {
          name: 'DavcnaStevilka',
          required: false,
          label: this.$t('davcna'),
          tooltip: '',
          align: 'left',
          field: 'DavcnaStevilka',
          sortable: true,
          style: 'width: 80px',
        },
        {
          name: 'StopnjaPravilnosti',
          required: false,
          label: this.$t('stopnja_pravilnosti_short'),
          tooltip: this.$t('stopnja_pravilnosti_hint'),
          align: 'left',
          field: 'StopnjaPravilnosti',
          sortable: true,
          style: 'width: 30px',
        },
        {
          name: 'EMSO',
          required: false,
          label: this.$t('emso'),
          tooltip: '',
          align: 'left',
          field: 'EMSO',
          sortable: true,
          style: 'width: 110px',
        },
        {
          name: 'DtRojstva',
          required: false,
          label: this.$t('dt_rojstva'),
          tooltip: '',
          align: 'left',
          field: 'DtRojstva',
          sortable: true,
          style: 'width: 100px',
        },
        {
          name: 'Naslov',
          required: false,
          label: this.$t('naslov_posta_drzava'),
          tooltip: '',
          align: 'left',
          field: 'Naslov',
          sortable: true,
        },
        {
          name: 'Spol',
          required: false,
          label: this.$t('spol_short'),
          tooltip: this.$t('spol'),
          align: 'left',
          field: 'Spol',
          sortable: true,
          style: 'width: 30px',
        },
        {
          name: 'VrstaOsebe',
          required: false,
          label: this.$t('vrsta_osebe_short'),
          tooltip: this.$t('vrsta_osebe'),
          align: 'left',
          field: 'VrstaOsebe',
          sortable: true,
          style: 'width: 30px',
        },
        {
          name: 'Vir',
          required: false,
          label: this.$t('vir'),
          tooltip: '',
          align: 'left',
          field: 'Vir',
          sortable: true,
          style: 'width: 30px',
        },
        {
          name: 'actions',
          required: false,
          label: '',
          tooltip: '',
          align: 'middle',
          field: (row) => row.EZSO,
          sortable: false,
          style: 'width: 50px',
        },
      ],
      editValues: {
        EZSO: '',
        EMSO: '',
        NazivOsebe: '',
        DavcnaStevilka: '',
        KonsolidacijskaDavcnaStevilka: '',
        DtRojstva: '',
        Spol: '',
        VrstaOsebe: '',
        Vir: '',
        NaslovZdruzen: '',
        Naselje: '',
        Ulica: '',
        HisnaSt: '',
        HisnaStOznaka: '',
        Posta: '',
        PostaSt: '',
        TipNaslova: '',
        NaslovOd: '',
        NaslovDo: '',
      },
      konsValues: {
        Nacin: {
          label: 'Izberite način',
          value: '0',
        },
        DavcnaStevilka: '',
        NovaDavcnaStevilka: '',
        StopnjaZaupanja: {
          label: '0: Fiktivna davčna',
          value: '0',
        },
        Neskladnost: {
          label: 'Ni neskladnosti',
          value: '-1',
        },
        VrstaOsebe: {
          label: 'FIZ',
          value: 'FIZ',
        },
        Opis: '',
      },
      paginationNew: {
        sortBy: 'KonsolidacijskaDavcnaStevilka',
        descending: false,
        page: 1,
        rowsPerPage: this.config.type === 'basic' ? 10 : this.total > 0 ? this.total : 10,
        rowsNumber: this.total || 1,
      },
      pagination: {
        sortBy: 'KonsolidacijskaDavcnaStevilka',
        descending: false,
        page: 1,
        rowsPerPage: this.config.type === 'basic' ? 10 : this.total > 0 ? this.total : 10,
        rowsNumber: this.total || 1,
        maxPages: Math.ceil((this.total || 1) / 10),
        izbor: this.selectedUsers,
        multisort: false,
        multisortOpt: {
          first: {
            field: '',
            value: 'asc',
          },
          second: {
            field: '',
            value: 'asc',
          },
          third: {
            field: '',
            value: 'asc',
          },
        },
      },

      errorMessage: '',
      ecrpDialog: false,
      ecrpDataDialog: false,
      ecrpNamenDialog: false,
      ecrpResponse: null,
      ecrpSelected: [],
      ecrpReasonData: {
        vzrok: '',
        vzrokDrugo: '',
        oznaka: '',
        user: {},
      },
      ecrpNamenData: {
        value: null,
      },
      ecrpUserFirstname: '',
      ecrpUserLastname: '',
      ecrpData: {},
      ecrpDataDialogPosition: 'standard',
      ecrpVzrokOptions: [
        { label: 'Konsolidacija', value: 'Konsolidacija' },
        { label: 'Zavrnjena pošta', value: 'Zavrnjena pošta' },
        { label: 'Kontakt stranke', value: 'Kontakt stranke' },
        { label: 'Drugo', value: 'Drugo' },
      ],
      ecrpNamenOptions: [
        {
          label: 'Sklenitev in obnovitev zavarovalne pogodbe neživljenjska zavarovanja',
          value: 'NonLifeInsurancePolicyPurchase',
        },
        {
          label: 'Sklenitev in obnovitev zavarovalne pogodbe življenjska zavarovanja',
          value: 'LifeInsurancePolicyPurchase',
        },
        {
          label: 'Reševanje zahtevkov neživljenjska zavarovaja',
          value: 'NonLifeInsuranceClaimSolving',
        },
        {
          label: 'Reševanje zahtevkov življenjska zavarovanja',
          value: 'LifeInsuranceClaimSolving',
        },
        { label: 'Preiskovanje sumljivih primerov (prevare)', value: 'PossibleFraudInvestigation' },
        {
          label: 'Zaledna podpora (izvršba, regresi, neodzivnost, obveščanje, ...)',
          value: 'BackOfficeSupportActivity',
        },
        { label: 'Izplačevanje rente', value: 'AnnuityPayments' },
        {
          label: 'Davki (izpolnjevanje obveznosti po davčnih zakonih)',
          value: 'TaxLawsObligations',
        },
        { label: 'Register motornih vozil (MRVL)', value: 'Emrvl' },
        {
          label:
            'Prost. pokoj. zav. - zaledna podpora (obveščanje), izplačevanje pokojninske rente',
          value: 'PensionFundBackOfficeActivity',
        },
        { label: 'Izvršba', value: 'Enforcement' },
        { label: 'Reševanje zahtevkov AO zavarovanj', value: 'AoClaimsSolving' },
        { label: 'Dopolnilno zdravstveno zavarovanje', value: 'ComplementaryHealthInsurance' },
      ],
    }
  },

  methods: {
    moveSelectedUsers() {
      this.$emit('selectUsers', { users: this.selectedUsers, pagination: this.pagination })
    },
    clearSelectedUsers() {
      this.$emit('clearUsers', this.selectedUsers)
    },
    selectedUsersKons(konsDst) {
      this.$emit('selectKonsolidacija', {
        KonsolidacijskaDavcnaStevilka: konsDst,
        pagination: this.pagination,
      })
    },
    clearSelectedUsersKons(konsDst) {
      this.$emit('unselectKonsolidacija', { konsDst: konsDst, allUsers: this.data })
    },
    zadetek_format() {
      if (this.data.length.toString().slice(-1) === '1') {
        return this.$t('ut_zadetek')
      } else if (this.data.length.toString().slice(-1) === '2') {
        return this.$t('ut_zadetka')
      } else if (
        this.data.length.toString().slice(-1) === '3' ||
        this.data.length.toString().slice(-1) === '4'
      ) {
        return this.$t('ut_zadetki')
      } else {
        return this.$t('ut_zadetkov')
      }
    },
    moveFilter(tableType, filter, filterValue) {
      if (filter === 'Posta') {
        filterValue = filterValue.substring(0, 4)
      } /* else if (filter === 'DtRojstva') {
        let parts = filterValue.split('.')
        console.log(parts)
        filterValue = parts[2] + '-' + parts[1] + '-' + parts[0]
      } */

      if (tableType === 'basic' || (!this.editable && this.konsValues['Nacin'].value === '0')) {
        this.$emit('moveFilter', {
          filter: filter,
          value: filterValue,
        })
      } else {
        this.editValues[filter] = filterValue

        if (filter === 'StopnjaZaupanja') {
          // this.konsValues[filter] = filterValue
        } else if (filter === 'DavcnaStevilka') {
          this.konsValues[filter] = filterValue
          this.konsValues['NovaDavcnaStevilka'] = filterValue
        } else if (filter === 'Naslov') {
          if (!filterValue.Naslov) {
            filterValue.Naslov = ''
          }
          this.editValues['NaslovZdruzen'] = `${filterValue.Naslov.trim()}; ${
            filterValue.PostaSt
          } ${filterValue.Posta}`
          this.editValues['Ulica'] = filterValue.Ulica
          this.editValues['Naselje'] = filterValue.Naselje
          this.editValues['Posta'] = filterValue.Posta
          this.editValues['PostaSt'] = filterValue.PostaSt
          this.editValues['HisnaSt'] = filterValue.HisnaSt
          this.editValues['HisnaStOznaka'] = filterValue.HisnaStOznaka
          this.editValues['TipNaslova'] = filterValue.TipNaslova
          this.editValues['NaslovOd'] = filterValue.NaslovOd
          this.editValues['NaslovDo'] = filterValue.NaslovDo
        } else {
          this.konsValues[filter] = filterValue
        }
      }
    },
    openEditRow() {
      // this.editable = true
      this.$emit('setEditable', true)
      // this.clearEdit()
    },
    closeEditRow() {
      // this.editable = false
      this.$emit('setEditable', false)
      this.clearEdit()
    },
    clearKonsRow() {
      this.clearKons()
    },

    toggleExpanded(val) {
      if (!this.expanded.includes(val)) {
        this.updateAfterEdit([val])
      }
    },

    updateAfterEdit(ezsoSeznam, option) {
      this.$emit('refreshUser', ezsoSeznam)
    },

    editSelectedUsers(data) {
      this.pageLoading('show')
      let ids = []
      let allIds = []
      let editableOK = true
      let editKons = -1

      this.data.forEach((item) => {
        allIds.push(item.EZSO)
      })

      this.selectedUsers.forEach((item) => {
        ids.push(item.EZSO)

        if (editKons !== item.KD && editKons !== -1) {
          editableOK = false
        }

        editKons = item.KD
      })

      if (!editableOK) {
        this.pageLoading('false')

        this.$noty.error(this.$t('editable_false'), {
          killer: true,
          timeout: 5000,
          closeWith: ['click'],
          layout: 'bottomCenter',
          theme: 'metroui',
        })
      } else {
        this.api
          .post('OsebeEdit', {
            ...data.values,
            Osebe: ids,
            HitriUpdate: true,
            Program: this.program,
          })
          .then((result) => {
            this.$emit('refresh_token', result.data.token)

            if (result.data.success === true) {
              this.closeEditRow()
              // this.updateAfterEdit(result.data.parameters)
              this.updateAfterEdit(allIds, data.option)
              this.setResponse(result.data)
              this.$noty.success(this.$t(result.data.message_key), {
                killer: true,
                timeout: 2000,
                closeWith: ['click'],
                layout: 'bottomCenter',
                theme: 'metroui',
              })
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
          .finally(() => {
            this.pageLoading('hide')
          })
      }
    },

    refreshSelectedUsers() {
      this.$emit('refreshSelectedUsers')
    },

    refreshDetailsUsers(user) {
      for (var k = 0, len = this.data.length; k < len; k++) {
        if (user.EZSO === this.data[k].EZSO) {
          this.data[k] = user
        }
      }
    },

    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination

      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage === 0 ? 10 : rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
      // this.pagination.maxPages = Math.ceil(this.total / this.rowsPerPage)
      // this.pagination.multisort = false

      this.$emit('filterData', {
        filters: this.pagination,
        selectedUsers: this.selectedUsers,
        tableType: this.config.type,
      })
    },
    onPageSwitch(page) {
      this.pagination.page = page
      this.$emit('filterData', { filters: this.pagination, selectedUsers: this.selectedUsers })
    },
    onRowsNumSwitch(rows) {
      this.pagination.rowsPerPage = rows
      this.$emit('filterData', { filters: this.pagination, selectedUsers: this.selectedUsers })
    },
    highlightRow(id, expand) {
      if (expand) {
        this.highlighted = this.highlighted.filter((item) => item !== id)
      } else {
        this.highlighted.push(id)
      }
    },
    multisort() {
      // this.pagination.multisort = true
      this.multisortMenuShowing = false
      this.$emit('filterData', { filters: this.pagination, selectedUsers: this.selectedUsers })
    },
    setMultisort1() {
      this.pagination.multisortOpt = {
        first: {
          field: this.$t('k_davcna'),
          value: 'asc',
        },
        second: {
          field: this.$t('id'),
          value: 'desc',
        },
        third: {
          field: '',
          value: 'asc',
        },
      }
    },
    setMultisort2() {
      this.pagination.multisortOpt = {
        first: {
          field: this.$t('k_davcna'),
          value: 'asc',
        },
        second: {
          field: this.$t('vrsta_osebe'),
          value: 'asc',
        },
        third: {
          field: this.$t('id'),
          value: 'desc',
        },
      }
    },
    clearSort() {
      this.pagination.multisort = false
      this.multisortMenuShowing = false
      this.pagination.multisortOpt = {
        first: {
          field: '',
          value: 'asc',
        },
        second: {
          field: '',
          value: 'asc',
        },
        third: {
          field: '',
          value: 'asc',
        },
      }
    },

    clearEdit() {
      this.editValues = {
        EZSO: '',
        EMSO: '',
        NazivOsebe: '',
        DavcnaStevilka: '',
        KonsolidacijskaDavcnaStevilka: '',
        DtRojstva: '',
        Naslov: '',
        Vir: '',
        Spol: '',
        VrstaOsebe: '',
        NaslovZdruzen: '',
        Ulica: '',
        Naselje: '',
        Posta: '',
        PostaSt: '',
        HisnaSt: '',
        HisnaStOznaka: '',
        TipNaslova: '',
        NaslovOd: '',
        NaslovDo: '',
      }
    },

    clearKons() {
      this.konsValues = {
        Nacin: {
          label: 'Izberite način',
          value: '0',
        },
        DavcnaStevilka: '',
        NovaDavcnaStevilka: '',
        StopnjaZaupanja: {
          label: 'Fiktivna davčna',
          value: '0',
        },
        Neskladnost: {
          label: 'Ni neskladnosti',
          value: '-1',
        },
        VrstaOsebe: {
          label: 'FIZ',
          value: 'FIZ',
        },
        Opis: '',
      }
    },

    setResponse(response) {
      this.$emit('setResponse', response)
    },

    pageLoading(status) {
      if (status === 'show') {
        this.$q.loading.show()
      } else {
        this.$q.loading.hide()
      }
    },

    checkCons() {
      this.konsOK = 0
      let currentKons = ''
      if (this.konsValues.Nacin.value !== '6' && this.konsValues.Nacin.value !== '7') {
        this.data.forEach((item) => {
          if (
            item.KD !== '' &&
            item.KD !== null &&
            currentKons !== '' &&
            currentKons !== null &&
            item.KD !== currentKons
          ) {
            this.konsOK = -1
          }
          currentKons = item.KD
        })
      }
      if (this.konsValues.Nacin.value === '1' || this.konsValues.Nacin.value === '8') {
        this.data.forEach((item) => {
          if (
            this.konsValues.StopnjaZaupanja.value === '0' &&
            item.DavcnaStevilka !== '' &&
            item.DavcnaStevilka !== null
          ) {
            this.konsOK = -2
          }
        })
      }
    },

    checkEdit() {
      this.$emit('checkEdit')
    },

    konsPreData() {
      for (var k = 0, len = this.data.length; k < len; k++) {
        if (this.data[k].KD !== null && this.data[k].StopnjaZaupanja !== '0') {
          this.konsValues.DavcnaStevilka = this.data[k].DavcnaStevilka

          for (var z = 0, lenz = this.stopnjaZaupanjaOptions.length; z < lenz; z++) {
            if (this.stopnjaZaupanjaOptions[z].value === this.data[k].StopnjaZaupanja.toString()) {
              this.konsValues.StopnjaZaupanja.label = this.stopnjaZaupanjaOptions[z].label
              this.konsValues.StopnjaZaupanja.value = this.stopnjaZaupanjaOptions[z].value
              break
            }
          }
        }
      }
    },

    openSifrantNaslovovDialog(ezso) {
      this.$emit('openSifrantNaslovovDialog', { ezso: ezso, table: this.config.type })
    },

    closeSifrantNaslovovDialog() {
      this.$emit('closeSifrantNaslovovDialog')
    },

    openEcrpDialog(user) {
      this.ecrpReasonData.vzrok = ''
      this.ecrpReasonData.vzrokDrugo = ''
      this.ecrpReasonData.oznaka = ''
      this.ecrpReasonData.user = user
      this.ecrpReasonData.user.firstname = ''
      this.ecrpReasonData.user.lastname = ''
      this.ecrpUserFirstname = ''
      this.ecrpUserLastname = ''
      this.ecrpNamenData.value = null
      this.ecrpSelected = []

      this.ecrpDialog = true
    },

    closeEcrpDialog(isClicked = false) {
      if (isClicked && this.ecrpAuto) {
        this.sendMessage({ msg: 'err_canceled', fields: null })
      }

      this.ecrpDialog = false
    },

    openEcrpDataDialog(data) {
      this.ecrpData = data
      this.ecrpDataDialog = true
    },

    closeEcrpDataDialog(isClicked = false) {
      if (isClicked && this.ecrpAuto) {
        this.sendMessage({ msg: 'err_canceled', fields: null })
      }
      this.ecrpDataDialog = false
    },

    openEcrpNamenDialog(data) {
      this.ecrpData = data
      this.ecrpNamenDialog = true
    },

    closeEcrpNamenDialog() {
      this.ecrpNamenDialog = false
    },

    changeFirstName(input) {
      this.ecrpReasonData.user.firstname = input.target.value
      this.ecrpUserFirstname = input.target.value
    },

    changeLastName(input) {
      this.ecrpReasonData.user.lastname = input.target.value
      this.ecrpUserLastname = input.target.value
    },

    selectEcrpData(input) {
      let addresses = ['stalni_naslov', 'zacasni_naslov', 'vrocanje_naslov', 'tujina_naslov']
      let field = input[input.length - 1]

      this.ecrpSelected = input

      if (addresses.includes(field)) {
        this.ecrpSelected = this.ecrpSelected.filter((item) => !addresses.includes(item))
        this.ecrpSelected.push(field)
      }
    },

    sendMessage(data) {
      this.$emit('sendMessage', { msg: data.msg, fields: data.fields, response: this.ecrpResponse })
    },

    changeDialogPosition(position) {
      this.ecrpDataDialogPosition = position
    },

    confirmEcrp() {
      if (
        (this.ecrpReasonData.vzrok === '' ||
          (this.ecrpReasonData.vzrok === 'Drugo' && this.ecrpReasonData.vzrokDrugo === '')) &&
        this.ecrpReference === ''
      ) {
        this.ecrpDialog = true
        this.ecrpNamenDialog = false
        this.ecrpDataDialog = false
      } else if (this.ecrpNamenData.value === null && this.ecrpReason === '') {
        this.ecrpDialog = false
        this.ecrpNamenDialog = true
        this.ecrpDataDialog = false
      } else {
        this.ecrpNamenDialog = false
        // this.ecrpDataDialog = true

        // Vzrok validation
        if (
          (this.ecrpReasonData.vzrok === '' ||
            (this.ecrpReasonData.vzrok === 'Drugo' && this.ecrpReasonData.vzrokDrugo === '')) &&
          this.ecrpReference === ''
        ) {
          this.$noty.error(this.$t('invalid_vzrok'), {
            killer: true,
            timeout: 5000,
            closeWith: ['click'],
            layout: 'bottomCenter',
            theme: 'metroui',
          })
          return false
        }

        this.$q.loading.show()
        this.api
          .post('Ecrp', {
            Vzrok:
              this.ecrpReasonData.vzrok === 'Drugo'
                ? this.ecrpReasonData.vzrokDrugo
                : this.ecrpReasonData.vzrok,
            Oznaka: this.ecrpReasonData.oznaka,
            Namen: this.ecrpNamenData.value,
            Reason: this.ecrpReason,
            Reference: this.ecrpReference,
            Polja: this.ecrpFields,
            User: this.ecrpReasonData.user,
          })
          .then((result) => {
            this.$emit('refresh_token', result.data.token)

            this.$q.loading.hide()

            if (result.data.success === true) {
              this.closeEcrpDialog()
              this.ecrpResponse = result.data.response_ecrp
              this.openEcrpDataDialog(result.data.data)

              this.ecrpReasonData.vzrok = ''
              this.ecrpReasonData.vzrokDrugo = ''
              this.ecrpReasonData.oznaka = ''
              this.ecrpNamenData.value = null
              this.ecrpReason = ''

              if (this.ecrpFields !== '' && !result.data.changes) {
                this.sendMessage({ msg: 'res_identical', fields: null })
              }
            } else {
              this.closeEcrpDialog()
              var errorMessage =
                typeof result.data.message === 'object'
                  ? result.data.message[0].message
                  : result.data.message
              this.$noty.error(errorMessage, {
                killer: true,
                timeout: 5000,
                closeWith: ['click'],
                layout: 'bottomCenter',
                theme: 'metroui',
              })

              this.ecrpReasonData.vzrok = ''
              this.ecrpReasonData.vzrokDrugo = ''
              this.ecrpReasonData.oznaka = ''
              this.ecrpNamenData.value = null
              this.ecrpReason = ''

              this.sendMessage({ msg: result.data.message_key, fields: null })
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
  },

  mounted() {
    this.selectedUsersLocal = { ...this.selectedUsers }
  },

  watch: {
    data: function (newVal) {
      this.selectedUsersLocal = []
      if (this.config.type === 'selected') {
        if (this.data.length === 0) {
          this.clearEdit()
          this.clearKons()
          this.konsDisabled = true
        } else {
          this.checkCons()

          if (!this.editable) {
            this.konsDisabled = false
          }
        }
      }
      if (this.ecrpAuto) {
        if (newVal.length === 1) {
          this.openEcrpDialog(newVal[0])
        }
      }
    },
    selectedUsers: function (newVal) {
      this.selectedUsersLocal = Array.isArray(newVal) ? [...newVal] : []
      if (this.config.type === 'selected') {
        this.checkEdit()

        if (this.selectedUsers.length !== this.data.length) {
          this.clearKons()
        }

        if (this.selectedUsers.length === 0) {
          // this.editable = false
          this.$emit('setEditable', false)
        }
      }
    },
    editable: function (newVal) {
      if (!newVal) {
        this.closeEditRow()
        this.konsDisabled = false
      } else {
        this.clearKons()
        this.konsDisabled = true
      }
    },
    'konsValues.Nacin.value': function (newVal) {
      this.checkCons()
      if (newVal !== '0') {
        // this.selectedUsers = this.data
        this.$emit('update:selectedUsers', Array.isArray(this.data) ? this.data : [])
      }

      if ((newVal === '1' || newVal === '8') && this.konsOK === 0) {
        this.konsPreData()
      }
    },
    'konsValues.StopnjaZaupanja.value': function (newVal) {
      this.checkCons()
    },
    'pagination.multisort': function (newVal) {
      if (newVal) {
        this.pagination.sortBy = ''
      } else {
        this.clearSort()
      }
    },
    'ecrpReasonData.vzrok': function (newVal) {
      if (newVal === 'Konsolidacija') {
        this.ecrpReasonData.oznaka = this.$user_data.ezso
      } else {
        this.ecrpReasonData.oznaka = ''
      }
    },
  },
}
</script>

<style>
.table-footer-text {
  height: 30px;
  margin-right: 30px;
}

.table-footer-text span {
  line-height: 30px;
  display: inline-block;
  vertical-align: middle;
}

.q-table
  thead
  tr
  th
  .q-checkbox
  .q-checkbox__inner.relative-position.q-checkbox__inner--active.text-grey-8
  .q-checkbox__bg.absolute {
  background-color: #3ca082;
}

.text-grey-8 {
  color: #3ca082 !important;
}

.cro-bg {
  background-color: #f5f5f5;
}

.btn-table-action {
  padding: 0px 5px 0px 5px !important;
  margin-right: 5px;
  min-height: 2.2em !important;
}

.move-arrow {
  cursor: pointer;
  font-size: 15px !important;
}

.link_filter {
  cursor: pointer;
}

.display-icon {
  cursor: pointer;
}

.hide-table {
  display: none;
}

#table-options div {
  float: right;
}

#table-options .items-start {
  margin-top: 0px !important;
}

#edit-div td {
  background-color: #c0ddd5;
  height: 60px;
  padding-top: 10px;
}

#edit-div td label {
  margin-top: 0px;
}

.selected-actions .q-btn {
  float: right;
}

.user-details-td {
  background: rgba(0, 0, 0, 0.03);
}

.highlighted {
  background-color: #fff7eb !important;
}

.highlighted-green {
  background-color: #d5e5e2 !important;
}

.death {
  color: grey;
}

tbody tr.selected td {
  background-color: #fff7eb;
}

tbody tr.selected.details td {
  background-color: rgba(0, 0, 0, 0.03);
}

.cons-arrow {
  float: right;
  right: 15px;
}

.inline {
  display: inline;
}

#multiple-sort-col {
  margin: 0px 10px;
}

#multiple-sort-col .q-btn {
  background: transparent;
}

#multiple-sort-col .q-item.q-router-link--active,
.q-item {
  color: #939393 !important;
}

.multisort_arrow {
  cursor: pointer;
  margin-left: 5px;
  font-size: 18px;
}

.q-menu .row .column .col {
  margin: 5px 0px;
}

#sort-btns {
  margin-top: 15px;
  float: right;
}

.q-field--auto-height .q-field__native,
.q-field--auto-height .q-field__prefix,
.q-field--auto-height .q-field__suffix {
  line-height: 26px;
}

.contact-icon {
  right: 0px;
}

.gdpr-icon {
  right: 0px;
  top: -1px;
}

.material-icons.gdpr-icon {
  padding-left: 5px;
}

.death-icon {
  margin-top: -15px;
}

.q-banner {
  min-height: 30px;
  padding: 0px 10px;
}
</style>

<style lang="sass">
.sticky-header-table
  .q-table__middle
    max-height: 200px

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
.sticky-header-table.basic
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

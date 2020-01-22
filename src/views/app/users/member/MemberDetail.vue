<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.content')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12" xs="6" lg="6" class="mb-3">
            <b-modal id="modalMandate" ref="modalMandate" title="My Mandate" class="modal-right">
                <h4 class="display-5 mb-3">Instructions</h4>
                <p class="display-5 text-muted mb-1">Minimum mandate allowed is {{ mandatePolicy.minimumMandate | formatMoney }}</p>
                <p class="display-5 text-muted mb-1">Maximum mandate allowed is {{ mandatePolicy.maximumMandate | formatMoney }}</p>
                <p class="display-5 text-muted mb-3" v-if="mandatePolicy.isMultiple">Mandate must be in multiple of {{ mandatePolicy.minimumMandate | formatMoney }}</p>
                
                <b-form>
                    <b-form-group :label="$t('mandate.amount')">
                        <b-form-input type="text" v-model="mandate.amount"  />
                    </b-form-group>
                    <b-form-group :label="$t('mandate.start-date')">
                        <v-date-picker
                            mode="single"
                            class="is-expanded"
                            v-model="mandate.startDate"
                            :is-inline="true"
                            :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"
                        ></v-date-picker>
                    </b-form-group>
                </b-form>

                <template slot="modal-footer">
                <b-button variant="outline-secondary" @click="hideModal('modalMandate')">{{ $t('mandate.cancel') }}</b-button>
                <b-button :disabled="processing" variant="primary" @click="addMandate(loadMember())" class="mr-1">{{ $t('mandate.submit') }}</b-button>
              </template>
            </b-modal>
            <b-card class="mb-4" no-body>
                <b-tabs card no-fade>
                    <b-tab title="Mandates" :active="mandateActive" title-item-class="w-40 text-center">
                        <h5 class="mb-4 card-title">Mandate</h5>
                        <b-table responsive
                            ref="custom-table"
                            class="vuetable"
                            sort-by="amount" sort-desc.sync="false"
                            @row-selected="mandateSelected"
                            selectable
                            :select-mode="mandateTable.selectMode"
                            current-page="1"
                            selectedVariant="primary"
                            :fields="mandateTable.fields"
                            :items="mandates"
                        >
                        <template slot="amount" slot-scope="data">
                            <span>{{ data.item.amount | formatMoney }}</span>
                        </template>
                        <template slot="startDate" slot-scope="data">
                            <span>{{ data.item.startDate | formatDate }}</span>
                        </template>
                        <template slot="active" slot-scope="data">
                            <b-badge v-if="data.item.active" class="mb-1" variant="success">ACTIVED</b-badge>
                            <b-badge v-else class="mb-1" variant="danger">DEACTIVED</b-badge>
                        </template>
                        <template slot="id" slot-scope="data">
                            <span><b-button size="sm" variant="outline-primary" 
                            @click="toggleStatus(data.item, fetchMember)">Toggle</b-button></span>
                        </template>
                        </b-table>
                        <b-button size="sm" @click="showModal('modalMandate')" variant="outline-primary">{{ $t('mandate.add-new') }}</b-button>
                    </b-tab>
                    <b-tab title="Mode of payment" title-item-class="w-30 text-center">
                        <h5 class="mb-4 card-title">Mode of payment</h5>
                        <b-button size="sm" variant="outline-primary">Edit</b-button>
                    </b-tab>
                    <b-tab title="Next of kin" title-item-class="w-30 text-center">
                        <h5 class="mb-4 card-title">Next of kin</h5>
                        <b-button size="sm" variant="outline-primary">Edit</b-button>
                    </b-tab>
                </b-tabs>
            </b-card>
        </b-colxx>
        <b-colxx xxs="12" xs="6" lg="6" class="mb-3">
            <b-card class="mb-4" no-body>
                <b-tabs card no-fade>
                    <b-tab title="Contributions" :active="contributionActive" title-item-class="w-50 text-center">
                        <div class="top-right-button-container">
                          <b-button size="sm" v-b-modal.modalContribution variant="outline-primary">{{ $t('contribution.add-new') }}</b-button>
                          <b-modal id="modalContribution" ref="modalContribution" title="Make a new Contribution" class="modal-right">
                            <h4 class="display-5 mb-3">Instructions</h4>
                            <b-form>                                
                                <b-row>
                                    <b-colxx xxs="12">
                                        <b-form-group :label="$t('contribution.contribution-date')">
                                            <v-date-picker
                                                mode="single"
                                                class="is-expanded"
                                                v-model="contribution.contributionDate"
                                                :is-inline="true"
                                                :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"
                                            ></v-date-picker>
                                        </b-form-group>
                                    </b-colxx>
                                    <b-colxx xxs="12">
                                        <img :src="contribution.evidenceOfPaymentImageUrl" alt="Evidence of payment" class="img-thumbnail list-thumbnail  rounded-circle align-self-center m-4"/>
                                        <div><vue-dropzone ref="usersDropzone" id="usersDropzone" :options="imageUploadOptions"
                                            @vdropzone-success="afterImageUploadProcessed" style="width: 150px;"></vue-dropzone></div>
                                    </b-colxx>
                                </b-row>
                            </b-form>

                            <template slot="modal-footer">
                                <b-button variant="outline-secondary" @click="hideModal('modalContribution')">{{ $t('contribution.cancel') }}</b-button>
                                <b-button :disabled="processing" variant="primary" @click="addContribution(loadContributions())" class="mr-1">{{ $t('contribution.submit') }}</b-button>
                            </template>
                        </b-modal>
                        </div>
                        <br/><br/>
                        <b-collapse id="displayOptions" class="d-md-block">
                            <div class="d-block d-md-inline-block pt-1">
                              <b-dropdown id="ddown1" :text="`${$t('user.orderby')} ${sortContrib.label}`" variant="outline-dark" class="mr-1 float-md-left btn-group " size="xs">
                                  <b-dropdown-item v-for="(order,index) in sortContribOptions" :key="`order${index}`" @click="changeContribOrderBy(order)" >{{ order.label }}</b-dropdown-item>
                              </b-dropdown>
                              <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                                <b-input :placeholder="$t('menu.search')" v-model="contribSearch"/>
                              </div>
                            </div>
                            <div class="float-md-right pt-1">
                                <span class="text-muted text-small mr-1 mb-2">{{contribFrom}}-{{contribTo}} of {{ contribTotal }}</span>
                                <b-dropdown id="ddown2" right :text="`${contribPerPage}`" variant="outline-dark" class="d-inline-block" size="xs">
                                    <b-dropdown-item v-for="(size,index) in contribPageSizes" :key="index" @click="changeContribPageSize(size)">{{ size }}</b-dropdown-item>
                                </b-dropdown>
                            </div>
                          </b-collapse>
                        <b-table responsive
                            ref="custom-table"
                            class="vuetable"
                            sort-by="title" sort-desc.sync="false"
                            :select-mode="contributionTable.selectMode"
                            :current-page="contribCurrentPage"
                            selectedVariant="primary"
                            :fields="contributionTable.fields"
                            :items="contributions"
                        >
                        <template slot="amountContributed" slot-scope="data">
                            <span>{{ data.item.amountContributed | formatMoney }}</span>
                        </template>
                        <template slot="contributionDate" slot-scope="data">
                            <span>{{ data.item.contributionDate | formatDate }}</span>
                        </template>
                        <template slot="amountInvested" slot-scope="data">
                            <span>{{ data.item.amountInvested | formatMoney }}</span>
                            <br/>
                            <span>{{ data.item.amountSaved | formatMoney }}</span>
                        </template>
                        <template slot="confirmed" slot-scope="data">
                            <b-badge v-if="data.item.confirmed" variant="success" class="mb-1" >{{ data.item.contributionStatus }}</b-badge>
                            <b-badge v-else variant="danger" class="mb-1" >{{ data.item.contributionStatus }}</b-badge>
                        </template>
                        </b-table>
                        <b-row v-if="contribLastPage>1">
                          <b-colxx xxs="12">
                              <b-pagination-nav :number-of-pages="contribLastPage" :link-gen="contribLinkGen" v-model="contribPage" :per-page="contribPerPage" align="center">
                                <template v-slot:next-text>
                                    <i class="simple-icon-arrow-right" />
                                </template>
                                <template v-slot:prev-text>
                                    <i class="simple-icon-arrow-left" />
                                </template>
                                <template v-slot:first-text>
                                    <i class="simple-icon-control-start" />
                                </template>
                                <template v-slot:last-text>
                                    <i class="simple-icon-control-end" />
                                </template>
                            </b-pagination-nav>
                          </b-colxx>
                        </b-row>
                    </b-tab>
                    <b-tab title="Loans" title-item-class="w-50 text-center">
                        <div class="top-right-button-container">
                          <b-button size="sm" v-b-modal.modalLoan variant="outline-primary">{{ $t('contribution.add-new') }}</b-button>
                          <b-modal id="modalLoan" ref="modalLoan" title="Make a new Loan Request" class="modal-right">
                            <h4 class="display-5 mb-3">Instructions</h4>
                            <b-form>                               
                                <b-row>
                                    <b-colxx xxs="12">
                                        <b-form-group label="Amount">
                                            <b-form-input type="text" v-model="loanRequest.requestAmount"  />
                                        </b-form-group>
                                    </b-colxx>
                                </b-row>
                                <b-row>
                                    <b-colxx xxs="12">
                                        <b-form-group label="Comment">
                                            <b-form-input type="text" v-model="loanRequest.comment"  />
                                        </b-form-group>
                                    </b-colxx>
                                </b-row>
                                <b-row>
                                  <b-colxx xxs="6">
                                    <b-row>
                                      <b-colxx xxs="12">
                                        <b-form-group label="Priority">
                                          <b-form-radio-group stacked class="pt-2" :options="priorities" v-model="loanRequest.priority" />
                                        </b-form-group>
                                      </b-colxx>
                                    </b-row>
                                  </b-colxx>
                                  <b-colxx xxs="6">
                                    <b-row>
                                      <b-colxx xxs="12">
                                        <b-form-group label="Repayment Option">
                                          <b-form-radio-group stacked class="pt-2" :options="repaymentOptions" v-model="loanRequest.repaymentOption" />
                                        </b-form-group>
                                      </b-colxx>
                                    </b-row>
                                  </b-colxx>
                                </b-row>
                            </b-form>

                            <template slot="modal-footer">
                                <b-button variant="outline-secondary" @click="hideModal('modalLoan')">{{ $t('contribution.cancel') }}</b-button>
                                <b-button :disabled="processing" variant="primary" @click="addLoan(loadLoans())" class="mr-1">{{ $t('contribution.submit') }}</b-button>
                            </template>
                        </b-modal>
                        </div>
                        <br/><br/>
                        <b-collapse id="displayOptions" class="d-md-block">
                            <div class="d-block d-md-inline-block pt-1">
                              <b-dropdown id="ddown1" :text="`${$t('user.orderby')} ${sortLoan.label}`" variant="outline-dark" class="mr-1 float-md-left btn-group " size="xs">
                                  <b-dropdown-item v-for="(order,index) in sortLoanOptions" :key="`order${index}`" @click="changeLoanOrderBy(order)" >{{ order.label }}</b-dropdown-item>
                              </b-dropdown>
                              <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                                <b-input :placeholder="$t('menu.search')" v-model="loanSearch"/>
                              </div>
                            </div>
                          </b-collapse>
                        <b-table responsive
                            ref="custom-table"
                            class="vuetable"
                            sort-by="title" sort-desc.sync="false"
                            :select-mode="loanTable.selectMode"
                            :current-page="loanCurrentPage"
                            selectedVariant="primary"
                            :fields="loanTable.fields"
                            :items="loans"
                        >
                        <template slot="requestAmount" slot-scope="data">
                            <span>{{ data.item.requestAmount | formatMoney }}</span>
                        </template>
                        <template slot="approvedLoanAmount" slot-scope="data">
                            <span>{{ data.item.approvedLoanAmount | formatMoney }}</span>
                        </template>
                        <template slot="installmentAmount" slot-scope="data">
                            <span>{{ data.item.installmentAmount | formatMoney }}</span>
                        </template>
                        <template slot="requestDate" slot-scope="data">
                            <span>{{ data.item.requestDate | formatDate }}</span>
                        </template>
                        <template slot="requestStatus" slot-scope="data">
                            <b-badge :variant="data.item.requestStatusColour" class="mb-1" >{{ data.item.requestStatus }}</b-badge>
                        </template>
                        </b-table>
                    </b-tab>
                </b-tabs>
            </b-card>
        </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from 'axios';
import VueDropzone from "vue2-dropzone";
import moment from 'moment'

import { apiBaseUrl } from "../../../../constants/config";

export default {
  components: {
    "vue-dropzone": VueDropzone
  },
  data() {
    return {
      date: '2018-12-24 04:19:23',
      mandateActive: true,
      isNewMandate: false,
      processing: false,
      contributionActive: true,
      memberId: this.$route.params.code,
      contribApiBase: apiBaseUrl + '/contributions/pagination/search/',
      loanApiBase: apiBaseUrl + '/loans/member/',
      mandatePolicy: {},
      loanPolicy: {},
      mandateTable: {
        selected: [],
        selectMode: 'multi',
        fields: [
          { key: 'amount', label: 'Amount', sortable: true, sortDirection: 'desc', tdClass: 'list-item-heading' },
          { key: 'startDate', label: 'Start Date', sortable: true, tdClass: 'text-muted' },
          { key: 'active', label: 'Status', sortable: true, tdClass: 'text-muted' },
          { key: 'id', label: 'Action'}
        ]
      },
      sortContrib: { column: 'referenceNumber', label: 'Reference' },
      sortContribOptions: [
        { column: 'referenceNumber', label: 'Reference' },
        { column: 'contributionStatus', label: 'Status' }
      ],
      searchContrib: '',
      contributionTable: {
        selected: [],
        selectMode: 'multi',
        fields: [
          { key: 'amountContributed', label: 'Amount', sortable: true, sortDirection: 'desc', tdClass: 'text-muted' },
          { key: 'contributionDate', label: 'Date of contribution', sortable: true, tdClass: 'list-item-heading' },
          { key: 'amountInvested', label: 'Invests|Savings', tdClass: 'text-muted' },
          { key: 'confirmed', label: 'Status', sortable: true, tdClass: 'text-muted' }
        ]
      },
      mandates: [],
      contribSearch: '',
      contribPage: 1,
      contribCurrentPage: 0,
      contribPerPage: 6,
      contribFrom: 0,
      contribTo: 0,
      contribTotal: 0,
      contribLastPage: 0,
      contribPageSizes: [2, 6, 8, 12, 24],
      contributions: [],
      sortLoan: { column: 'PENDING', label: 'Pending' },
      sortLoanOptions: [
        { column: 'PENDING', label: 'Pending' },
        { column: 'APPROVED', label: 'Approved' }
      ],
      loanTable: {
        selected: [],
        selectMode: 'multi',
        fields: [
          { key: 'requestAmount', label: 'Amount Applied for', sortable: true, sortDirection: 'desc', tdClass: 'text-muted' },
          { key: 'approvedLoanAmount', label: 'Approved Amount', sortable: true, tdClass: 'list-item-heading' },
          { key: 'requestDate', label: 'Request Date', tdClass: 'text-muted' },
          { key: 'requestStatus', label: 'Status', tdClass: 'text-muted' },
          { key: 'installmentAmount', label: 'Repayment Amount', sortable: true, tdClass: 'text-muted' }
        ]
      },
      loanSearch: '',
      loanPage: 1,
      loanCurrentPage: 0,
      loans: [],
      imageUploadOptions: {
        url: apiBaseUrl + '/uploads/image',
        thumbnailHeight: 50,
        maxFilesize: 1,
        previewTemplate: this.dropzoneTemplate()
      },
      token: null,
      member: {},
      mandate: {
          startDate: new Date(),
          amount: 0,
          membershipCode: null
      },
      contribution: {
          contributionDate: new Date(),
          evidenceOfPaymentImageUrl: null,
          membershipCode: null
      },
      loanRequest: {
          requestAmount: 0,
          repaymentOption: 'MONTHLY',
          priority: 'MEDIUM',
          membershipCode: null,
          comment: null
      },
      priorities: [
        { text: 'LOW', value: 'LOW' },
        { text: 'MEDIUM', value: 'MEDIUM' },
        { text: 'HIGH', value: 'HIGH' }
      ],
      repaymentOptions: [
        { text: 'MONTHLY', value: 'MONTHLY' },
        { text: 'QUARTERLY', value: 'QUARTERLY' },
        { text: 'BIANNUAL', value: 'BIANNUAL' },
        { text: 'ANNUALLY', value: 'ANNUALLY' }
      ],
    };
  },
  methods: {
    contribLinkGen(pageNum) {
      return '#page-' + pageNum
    },
    changeContribPageSize(perPage) {
      this.contribPerPage = perPage
    },
    changeContribOrderBy(sort) {
      this.sortContrib = sort
    },
    loanLinkGen(pageNum) {
      return '#page-' + pageNum
    },
    changeLoanPageSize(perPage) {
      this.loanPerPage = perPage
    },
    changeLoanOrderBy(sort) {
      this.sortLoan = sort
    },
    afterImageUploadProcessed (file, response) {
        if (response.data !== null && response.data.length > 0) {
            this.contribution.evidenceOfPaymentImageUrl = response.data
        }
    },
    dropzoneTemplate () {
        return `<div class="dz-file-preview mb-2">
                <div class="d-flex flex-row "> <div class="p-0 w-5 position-relative">
                    <div class="dz-error-mark"><span><i></i>  </span></div>
                    <div class="dz-success-mark"><span><i></i></span></div>
                </div>
            </div>
    `
    },
    loadContributions() {
      axios
        .get(this.contribApiUrl, {
          headers: {
            'Authorization': 'Bearer ' + this.currentUser.token
          }
        })
        .then(r => r.data)
        .then(res => {
          this.contribTotal = res.data.total
          this.contribFrom = res.data.from
          this.contribTo = res.data.to
          this.contributions = res.data.data
          this.contribPerPage = res.data.per_page
          this.contribLastPage = res.data.last_page
          this.hideModal('modalContribution')
        })
        .catch(err => {
        if (err.response.status === 401) {
          this.$notify('info', 'Token Expired', 'Please login again', { duration: 3000, permanent: false })
          this.$router.push('/user/login')
        } else {
          console.log(err.response.data)
        }})
    },
    loadLoans() {
      axios
        .get(this.loanApiUrl, {
          headers: {
            'Authorization': 'Bearer ' + this.currentUser.token
          }
        })
        .then(r => r.data)
        .then(res => {
          this.loans = res.data
          this.hideModal('modalLoan')
        })
        .catch(err => {
        if (err.response.status === 401) {
          this.$notify('info', 'Token Expired', 'Please login again', { duration: 3000, permanent: false })
          this.$router.push('/user/login')
        } else {
          console.log(err.response.data)
        }})
    },
    addMandate (callback) {
        var list = []
        const amount = this.mandate.amount
        const startDate = moment.utc(String(this.mandate.startDate)).format('DD-MM-YYYY')
        const newMandate = {}
        this.mandate.startDate = startDate
        newMandate.amount = amount
        newMandate.startDate = startDate
        newMandate.membershipCode = this.mandate.membershipCode
        list.push(newMandate)
        this.processing = true
        axios
        .post(`${apiBaseUrl}/mandates`, list, {
            headers: {
                'Authorization': 'Bearer ' + this.currentUser.token 
            }
        })
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            this.processing = false
            this.addNotification('success', 'Success', 'Mandate added successfully')
            if (callback) {
                callback()
            }
          }
        })
        .catch(err => {
          console.log(err.response.data)
          this.processing = false
        })
    },
    addContribution (callback) {
        var list = []
        const amount = this.mandate.amount
        const contributionDate = moment.utc(String(this.contribution.contributionDate)).format('DD-MM-YYYY')
        const newContribution = {}
        this.contribution.startDate = contributionDate
        if (this.contribution.evidenceOfPaymentImageUrl) {
          newContribution.evidenceOfPaymentImageUrl = this.contribution.evidenceOfPaymentImageUrl
        }
        newContribution.contributionDate = contributionDate
        newContribution.membershipCode = this.mandate.membershipCode
        list.push(newContribution)
        this.processing = true
        axios
        .post(`${apiBaseUrl}/contributions`, list, {
            headers: {
                'Authorization': 'Bearer ' + this.currentUser.token 
            }
        })
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            this.processing = false
            this.addNotification('success', 'Success', 'Contribution added successfully')
            if (callback) {
                callback()
            }
          }
        })
        .catch(err => {
          console.log(err.response.data)
          this.addNotification('error', 'Error', err.response.data.message)
          this.processing = false
        })
    },
    hideModal (refname) {
      this.$refs[refname].hide()
      if(refname === 'modalMandate') {
        this.fetchMember()
      }
    },
    showModal (refname) {
       this.$refs[refname].show()
    },  
    mandateSelected (items) {
      this.mandateTable.selected = items
    },
    toggleStatus (item, callback) {
        axios
        .post(`${apiBaseUrl}/mandates/` + item.id, {
            'memberId': item.memberId,
            'active': !item.active,
            'startDay': item.startDay,
            'startMonth': item.startMonth,
            'startYear': item.startYear,
            'amount': item.amount
        }, {
            headers: {
                'Authorization': 'Bearer ' + this.currentUser.token 
            }
        })
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            if (callback) {
                callback()
            }
            // console.log(JSON.stringify(this.member))
          }
        })
        .catch(err => {
          console.log(err.response.data)
        })
    },
    fetchMember (callback) {
        axios
        .get(`${apiBaseUrl}/members/search/` + this.memberId, {
            headers: {
                'Authorization': 'Bearer ' + this.currentUser.token 
            }
        })
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            this.member = res.data[0]
            this.mandate.membershipCode = this.member.membershipCode
            this.mandates = this.member.mandates
            if (callback) {
              callback()
            }
          }
        })
        .catch(err => {
          console.log(err.response.data)
        })
    },
    setMebershipCode () {
      if (this.member) {
        this.contribApiBase = this.contribApiBase + this.member.membershipCode
      }
    },
    loadMember () {
        axios
        .get(`${apiBaseUrl}/members/search/` + this.memberId, {
            headers: {
                'Authorization': 'Bearer ' + this.currentUser.token 
            }
        })
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            this.member = res.data[0]
            this.mandate.membershipCode = this.member.membershipCode
            this.mandates = []
            this.mandates = this.member.mandates.length
            this.hideModal('modalMandate')
          }
        })
        .catch(err => {
          console.log(err.response.data)
        })
    },
    addNotification (
      type = 'info',
      title = 'Message',
      message = 'This is Notify Message,<br>with html.'
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false })
    },
    dropzoneTemplate() {
      return `<div class="dz-file-preview mb-2">
                  <div class="d-flex flex-row "> <div class="p-0 w-5 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                  </div>
                </div>
        `;
    }
  },
  computed: {
    ...mapGetters(["currentUser"]),
    contribApiUrl() {
        const membershipCode = this.member.membershipCode
        return `${this.contribApiBase}${membershipCode}?sort=${this.sortContrib.column}&page=${
        this.contribPage
      }&per_page=${this.contribPerPage}&search=${this.contribSearch}`
    },
    loanApiUrl() {
        const membershipCode = this.member.membershipCode
        if (this.loanSearch) {
          return `${this.loanApiBase}${membershipCode}/${this.loanSearch}`
        } else {
          return `${this.loanApiBase}${membershipCode}`
        }
    }
  },
  watch: {
      contribSearch() {
          this.contribPage = 1
      },
      contribApiUrl() {
          this.loadContributions()
      },
      loanApiUrl() {
          this.loadLoans()
      }
  },
  mounted() {
    this.token = "Bearer " + this.currentUser.token
    if (this.currentUser.user.members) {
      this.members = this.currentUser.user.members
    }
    if (this.currentUser.user.imageUrl) {
      this.imageSrc = this.currentUser.user.imageUrl
    }
    this.fetchMember()
    this.mandatePolicy = this.currentUser.user.configuration.mandateConfig
    this.loanPolicy = this.currentUser.user.configuration.loanPoilcy
  }
};
</script>
<style>
.float-right {
  float: right;
}
</style>

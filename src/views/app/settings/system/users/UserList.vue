<template>
  <div class="disable-text-selection">
    <b-row class="app-row survey-app" >
      <b-colxx xxs="12">
        <div class="mb-2">
          <h1>{{ $t('menu.user') }}</h1>
          <div class="top-right-button-container">
            <b-button v-b-modal.modalUser variant="primary" size="lg" class="top-right-button">{{ $t('user.add-new') }}</b-button>
            <b-button-group v-if="isLoad">
              <b-dropdown  split right @click="selectAll(true)" class="check-button" variant="primary">
                  <label class="custom-control custom-checkbox pl-4 mb-0 d-inline-block" slot="button-content">
                    <input class="custom-control-input" type="checkbox"
                    :checked="isSelectedAll()"
                    v-shortkey="{select: ['ctrl','a'], undo: ['ctrl','d']}" @shortkey="keymap"
                    />
                    <span :class="{
                      'custom-control-label' :true,
                      'indeterminate' : isAnyItemSelected()
                    }">&nbsp;</span>
                  </label>
                <b-dropdown-item>{{$t('user.delete')}}</b-dropdown-item>
                <b-dropdown-item>{{$t('user.another-action')}}</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
            <b-modal id="modalUser" ref="modalUser" :title="$t('user.add-new-title')" class="modal-right">
              <b-form>
                <b-row>
                  <b-colxx xxs="6">
                    <b-row>
                      <b-colxx xxs="12">
                        <b-form-group :label="$t('user.firstName')">
                          <b-form-input v-model="newItem.firstName"  />
                        </b-form-group>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
                  <b-colxx xxs="6">
                    <b-row>
                      <b-colxx xxs="12">
                        <b-form-group :label="$t('user.lastName')">
                          <b-form-input v-model="newItem.lastName"  />
                        </b-form-group>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
                </b-row>
                <b-form-group :label="$t('user.email')">
                  <b-form-input :disabled="status ? true : false" v-model="newItem.emailAddress"  />
                </b-form-group>
                <b-form-group :label="$t('user.phone')">
                  <b-form-input :disabled="status ? true : false" v-model="newItem.phoneNumber"  />
                </b-form-group>
                <b-row>
                  <b-colxx xxs="6">
                    <b-row>
                      <b-colxx xxs="12">
                        <b-form-group :label="$t('user.username')">
                          <b-form-input :disabled="status ? true : false" v-model="newItem.username"  />
                        </b-form-group>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
                  <b-colxx xxs="6" v-if="!status">
                    <b-row>
                      <b-colxx xxs="12">
                        <b-form-group :label="$t('user.password')">
                          <b-form-input v-model="newItem.password"  />
                        </b-form-group>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
                </b-row>
                <b-row>
                  <b-colxx xxs="6">
                    <b-row>
                      <b-colxx xxs="12">
                        <b-form-group :label="$t('user.roles')">
                          <b-form-radio-group stacked class="pt-2" :options="roles" v-model="role" />
                        </b-form-group>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
                  <b-colxx xxs="6">
                    <b-row>
                      <b-colxx xxs="12" v-if="status">
                        <b-form-group :label="$t('user.status')">
                          <b-form-radio-group stacked class="pt-2" :options="statuses" v-model="status" />
                        </b-form-group>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
                </b-row>
              </b-form>
              <template slot="modal-footer">
                <b-button variant="outline-secondary" @click="hideModal('modalUser')">{{ $t('user.cancel') }}</b-button>
                <b-button :disabled="processing" variant="primary" @click="addNewUser()" class="mr-1">{{ $t('user.submit') }}</b-button>
              </template>
            </b-modal>
            
          </div>
          <piaf-breadcrumb/>
        </div>
        <div class="mb-2">
          <b-button variant="empty" class="pt-0 pl-0 d-inline-block d-md-none" v-b-toggle.displayOptions>
            {{ $t('user.display-options') }} <i class="simple-icon-arrow-down align-middle" />
          </b-button>
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="d-block d-md-inline-block pt-1">
              <b-dropdown id="ddown1" :text="`${$t('user.orderby')} ${sort.label}`" variant="outline-dark" class="mr-1 float-md-left btn-group " size="xs">
                  <b-dropdown-item v-for="(order,index) in sortOptions" :key="`order${index}`" @click="changeOrderBy(order)" >{{ order.label }}</b-dropdown-item>
              </b-dropdown>
              <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                <b-input :placeholder="$t('menu.search')" v-model="search"/>
              </div>
            </div>
            <div class="float-md-right pt-1">
                <span class="text-muted text-small mr-1 mb-2">{{from}}-{{to}} of {{ total }}</span>
                <b-dropdown id="ddown2" right :text="`${perPage}`" variant="outline-dark" class="d-inline-block" size="xs">
                    <b-dropdown-item v-for="(size,index) in pageSizes" :key="index" @click="changePageSize(size)">{{ size }}</b-dropdown-item>
                </b-dropdown>
            </div>
          </b-collapse>
        </div>
        <div class="separator mb-5"/>

        <b-row v-if="isLoad" key="itemList">
            <b-colxx xxs="12" v-for="(item,index) in userItems" :key="`item${index}`">
              <user-list-item
                  :key="item.id"
                  :data="item"
                  :selected-item="item"
                  :selected-items="selectedItems"
                  @toggle-item="toggleItem"
                  v-contextmenu:contextmenu
                />
            </b-colxx>
        </b-row>
        <div v-else class="loading" key="itemLoading"></div>
      </b-colxx>
    </b-row>
    <template v-if="isLoad">
            <b-row v-if="lastPage>1">
                <b-colxx xxs="12">
                    <b-pagination-nav :number-of-pages="lastPage" :link-gen="linkGen" v-model="page" :per-page="perPage" align="center">
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
        </template>
        <template v-else>
            <div class="loading"></div>
        </template>
    <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu">
      <v-contextmenu-item @click="onContextCopy()"><i class="simple-icon-docs" /> <span>Copy</span></v-contextmenu-item>
      <v-contextmenu-item @click="onContextArchive()"><i class="simple-icon-drawer" /> <span>Move to archive</span></v-contextmenu-item>
      <v-contextmenu-item @click="onContextDelete()"><i class="simple-icon-trash" /> <span>Delete</span></v-contextmenu-item>
    </v-contextmenu>

    <application-menu>
      <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }"  >
        <div class="p-4">
          <p class="text-muted text-small mb-3">{{$t('user.status')}}</p>
          <ul class="list-unstyled mb-4">
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-reload" /><span class="d-inline-block">{{$t('user.all-users')}}</span> <span class="float-right">{{userItems.length}}</span>
              </a></li>
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-refresh" />{{$t('user.suspend-users')}} <span class="float-right">{{userItems.filter(x => x.active === false).length}}</span>
              </a></li>
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-check" /><span class="d-inline-block">{{$t('user.active-users')}}</span> <span class="float-right">{{userItems.filter(x => x.active === true).length}}</span>
              </a></li>
          </ul>
        </div>

      </vue-perfect-scrollbar>
    </application-menu>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { apiBaseUrl } from '../../../../../constants/config'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import UserListItem from '../users/UserListItems'
import ApplicationMenu from '../../../../../components/Common/ApplicationMenu'

export default {
  components: {
    'v-select' : vSelect,
    'user-list-item' : UserListItem,
    'application-menu' :ApplicationMenu
  },
  data () {
    return {
      role: '',
      processing: false,
      status: false,
      isLoad: false,
      apiBase: apiBaseUrl + '/users/pagination/search',
      sort: { column: 'username', label: 'User' },
      sortOptions: [
        { column: 'username', label: 'Username' },
        { column: 'emailAddress', label: 'Email Address' },
        { column: 'active', label: 'Status' }
      ],
      search: '',
      selectedItems: [],
      selectedItem: {},
      page: 1,
      perPage: 4,
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      userItems: [],
      pageSizes: [2, 4, 8, 12],
      statuses: [
        { text: 'ACTIVE', value: true },
        { text: 'SUSPENDED', value: false }
      ],
      roles: [
        { text: 'MEMBER', value: 'member' },
        { text: 'ADMIN', value: 'admin' }
      ],
      newItem: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        emailAddress: '',
        username: '',
        password: '',
        roleNames: []
      }
    }
  },
  computed: {
    ...mapGetters (['currentUser']),
    apiUrl() {
        return `${this.apiBase}?sort=${this.sort.column}&page=${
        this.page
      }&per_page=${this.perPage}&search=${this.search}`
    }
  },
  methods: {
    ...mapMutations(['addPermissionItem']),
    loadItems() {
      this.isLoad = false
      axios
        .get(this.apiUrl, {
          headers: {
            'Authorization': 'Bearer ' + this.currentUser.token
          }
        })
        .then(r => r.data)
        .then(res => {
          this.total = res.data.total
          this.from = res.data.from
          this.to = res.data.to
          this.userItems = res.data.data
          this.perPage = res.data.per_page
          this.selectedItems = []
          this.lastPage = res.data.last_page
          this.isLoad = true
        })
        .catch(err => {
        if (err.response.status === 401) {
          this.$notify('info', 'Token Expired', 'Please login again', { duration: 3000, permanent: false })
          this.$router.push('/user/login')
        } else {
          console.log(err.response.data)
        }})
    },
    addNewUser () {
      if (this.role) {
        this.newItem.roleNames.push(this.role)
        this.role = ''
      }
      this.processing = true
      axios
        .post(`${apiBaseUrl}/registeruser/withrole`, this.newItem, {
          headers: {
            'Authorization': 'Bearer ' + this.currentUser.token
          }
        })
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            this.hideModal('modalUser')
            this.processing = false
            this.newItem = {}
            this.loadItems()
          }
        })
        .catch(err => {
        if (err.response.status === 401) {
          this.$notify('info', 'Token Expired', 'Please login again', { duration: 3000, permanent: false })
          this.$router.push('/user/login')
        } else {
          console.log(err.response.data)
          this.addNotification('error', 'Error', err.response.data.message)
          this.processing = false
        }})
    },
    isSelectedAll () {
      return this.selectedItems.length >= this.userItems.length
    },
    isAnyItemSelected () {
      return this.selectedItems.length > 0 && this.selectedItems.length < this.userItems.length
    },
    hideModal (refname) {
      this.newItem = {}
      this.selectedItem = {}
      this.role = ''
      this.status = ''
      this.$refs[refname].hide()
    },
    showModal (refname) {
      if (this.selectedItem) {
        this.$refs[refname].show()
      }
    },
    changeDisplayMode(displayType) {
      this.displayMode = displayType
    },
    changePageSize(perPage) {
      this.perPage = perPage
    },
    changeOrderBy(sort) {
      this.sort = sort
    },
    addNotification (
      type = 'info',
      title = 'Message',
      message = 'This is Notify Message,<br>with html.'
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false })
    },
    selectAll (isToggle) {
      if (this.selectedItems.length >= this.userItems.length) {
        if (isToggle) { this.selectedItems = [] }
      } else {
        this.selectedItems = this.userItems.map(x => x.id)
      }
    },
    keymap (event) {
      switch (event.srcKey) {
        case 'select':
          this.selectAll(false)
          break
        case 'undo':
          this.selectedItems = []
          break
      }
    },
    getIndex (value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i
        }
      }
      return -1
    },
    setItem (itemId) {
      console.log('Selected ID: ' + itemId)
    },
    toggleItem (event, itemId) {
      var selectedItem = this.userItems.filter(x => x.id === itemId)[0]
      this.role = selectedItem.roles[0].name
      this.status = selectedItem.active
      this.newItem = selectedItem
      this.newItem.password = ''
      this.showModal('modalUser')
      if (event.shiftKey && this.selectedItems.length > 0) {
        let itemsForToggle = this.userItems
        var start = this.getIndex(itemId, itemsForToggle, 'id')
        var end = this.getIndex(this.selectedItems[this.selectedItems.length - 1], itemsForToggle, 'id')
        itemsForToggle = itemsForToggle.slice(Math.min(start, end), Math.max(start, end) + 1)
        this.selectedItems.push(
          ...itemsForToggle.map(item => {
            return item.id
          })
        )
      } else {
        if (this.selectedItems.includes(itemId)) {
          this.selectedItems = this.selectedItems.filter(x => x !== itemId)
        } else { this.selectedItems.push(itemId) }
      }
    },
    handleContextmenu (vnode) {
      if (!this.selectedItems.includes(vnode.key)) {
        this.selectedItems = [vnode.key]
      }
    },
    onContextCopy () {
      console.log('context menu item clicked - Copy Items: ', this.selectedItems)
    },
    onContextArchive () {
      console.log('context menu item clicked - Move to Archive Items: ', this.selectedItems)
    },
    onContextDelete () {
      console.log('context menu item clicked - Delete Items: ', this.selectedItems)
    },
    linkGen(pageNum) {
      return '#page-' + pageNum
    }
  },
  watch: {
      search() {
          this.page = 1
      },
      apiUrl() {
          this.loadItems()
      }
  },
  mounted () {
    this.loadItems()
  }
}
</script>

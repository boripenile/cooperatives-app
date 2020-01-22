<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <piaf-breadcrumb :heading="$t('menu.content')" />
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xxs="12" md="6" xl="6" lg="6">
            <b-card class="mb-4 d-flex flex-row" :title="$t('user.basic-info')">
                <b-row>
                   <b-colxx xxs="12" md="4" xl="4" lg="4">
                       <img :src="imageSrc" alt="Card image cap" class="img-thumbnail list-thumbnail  rounded-circle align-self-center m-4"/>
                        <div><vue-dropzone ref="usersDropzone" id="usersDropzone" :options="imageUploadOptions"
                            @vdropzone-success="afterImageUploadProcessed" style="width: 150px;"></vue-dropzone></div>
                   </b-colxx>
                   <b-colxx xxs="12" md="8" xl="8" lg="8">
                        <div class="float-right">
                            <b-badge v-if="currentUser.user.active === true" class="mb-1" pill variant="success">ACTIVE</b-badge>
                            <b-badge v-else class="mb-1" pill variant="danger">SUSPENDED</b-badge>
                        </div>
                        <div>
                            <p class="display-8 mb-1 card-subtitle">First Name</p><h4 class="display-5 text-muted mb-1">{{ currentUser.user.firstName }}</h4>
                            <div class="separator mb-5"></div>
                        </div>
                        <div>
                            <p class="display-8 mb-1 card-subtitle">Last Name</p><h4 class="display-5 text-muted mb-1">{{ currentUser.user.lastName }}</h4>
                            <div class="separator mb-5"></div>
                        </div>
                        <div>
                            <p class="display-8 mb-1 card-subtitle">Username</p><h4 class="display-5 text-muted mb-1">{{ currentUser.user.username }}</h4>
                            <div class="separator mb-5"></div>
                        </div>
                        <div>
                            <p class="display-8 mb-1 card-subtitle">Email Address</p><h4 class="display-5 text-muted mb-1">{{ currentUser.user.emailAddress }}</h4>
                            <div class="separator mb-5"></div>
                        </div>
                   </b-colxx>
                </b-row>
                
            </b-card>
        </b-colxx>
        <b-colxx xxs="12" md="6" xl="6" lg="6">
            <b-colxx xxs="12" v-for="(item,index) in members" :key="`item${index}`">
                <b-card :title="`Member    ` + item.membershipCode">
                    <div>
                        <b-row>
                            <b-colxx>
                              <div class="float-right">
                                  <b-badge v-if="item.approvedMembership === true" class="mb-1" pill variant="success">APPROVED</b-badge>
                                  <b-badge v-else class="mb-1" pill variant="danger">SUSPENDED</b-badge>
                              </div>  
                            </b-colxx>
                        </b-row>
                        <b-row>
                            <b-colxx>
                                <p class="display-8 mb-1 card-subtitle">First Name</p>
                                <h5 class="display-5 text-muted mb-1">{{ item.firstName }}</h5>
                            </b-colxx>
                            <b-colxx>
                                <p class="display-8 mb-1 card-subtitle">Last Name</p>
                                <h5 class="display-5 text-muted mb-1">{{ item.lastName }}</h5>
                            </b-colxx>
                        </b-row>
                        <div class="separator mb-3"></div>
                        <b-row>
                            <b-colxx>
                                <p class="display-8 mb-1 card-subtitle">Email Address</p>
                                <h5 class="display-5 text-muted mb-1">{{ item.emailAddress }}</h5>
                            </b-colxx>
                            <b-colxx>
                                <p class="display-8 mb-1 card-subtitle">Code</p>
                                <h5 class="display-5 text-muted mb-1">{{ item.membershipCode }}</h5>
                            </b-colxx>
                        </b-row>
                        <div class="separator mb-3"></div>
                        <b-row>
                            <b-colxx>
                                <div  class="float-right">
                                    <a :href="`/app/users/members/${item.id}`"  class="primary">VIEW</a>
                                </div>
                            </b-colxx>
                        </b-row>
                    </div>
                    
                </b-card>   
            </b-colxx>
            
        </b-colxx>
    </b-row>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import GlideComponent from '../../../components/Carousel/GlideComponent'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../components/Common/VuetablePaginationBootstrap'

import IconCard from '../../../components/Cards/IconCard'
import GradientWithRadialProgressCard from '../../../components/Cards/GradientWithRadialProgressCard'
import AreaShadowChart from '../../../components/Charts/AreaShadow'
import TwoColumnList from '../../../components/Listing/TwoColumnList'
import ListWithUserItem from '../../../components/Listing/ListWithUserItem'
import VueDropzone from 'vue2-dropzone'
import {
    areaChartData,
    conversionChartData
} from '../../../data/charts'
import cakes from '../../../data/cakes'
import {
    comments
} from '../../../data/comments'
import {
    getDirection
} from '../../../utils'
import {
    apiUrl,
    apiBaseUrl
} from '../../../constants/config'

export default {
    components: {
        'vue-dropzone' : VueDropzone,
        'icon-card': IconCard,
        'v-select': vSelect
    },
    data() {
        return {
            imageSrc: '/assets/img/person.png',
            token: null,
            members: [],
            imageUploadOptions: {
                url: apiBaseUrl + '/uploads/image',
                thumbnailHeight: 50,
                maxFilesize: 1,
                previewTemplate: this.dropzoneTemplate()
            }
        }
    },
    methods: {
        afterImageUploadProcessed (file, response) {
            if (response.data !== null && response.data.length > 0) {
                console.log('Path: ' + response.data)
                this.imageSrc = response.data
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
        }
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    mounted () {
        this.token = 'Bearer ' + this.currentUser.token
        if (this.currentUser.user.members) {
            this.members = this.currentUser.user.members
        }
        if (this.currentUser.user.imageUrl) {
            this.imageSrc = this.currentUser.user.imageUrl
        }
    }
}
</script>
<style>
  .float-right {
      float: right;
  }
</style>

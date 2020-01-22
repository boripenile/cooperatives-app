<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
          <div class="position-relative image-side ">
            <p class=" text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
              <p class="white mb-0">  Please use this form to register. <br />If you are a member, please
                <router-link tag="a" to="/user/login" class="white">login</router-link>.
              </p>
          </div>
          <div class="form-side">
            <router-link tag="a" to="/"><span class="logo-single"/></router-link>
            <h6 class="mb-4">{{ $t('user.register')}}</h6>
            <b-form @submit.prevent="formSubmit">
              <b-row>
                  <b-colxx xxs="6">
                    <b-row>
                      <b-colxx xxs="12">
                        <label class="form-group has-float-label mb-4">
                          <input type="text" class="form-control" v-model="newUser.firstName">
                          <span>{{ $t('user.firstName') }}</span>
                        </label>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
                  <b-colxx xxs="6">
                    <b-row>
                      <b-colxx xxs="12">
                        <label class="form-group has-float-label mb-4">
                          <input type="text" class="form-control" v-model="newUser.lastName">
                          <span>{{ $t('user.lastName') }}</span>
                        </label>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
              </b-row>
              <b-row>
                  <b-colxx xxs="6">
                    <b-row>
                      <b-colxx xxs="12">
                        <label class="form-group has-float-label mb-4">
                          <input type="email" class="form-control" v-model="newUser.emailAddress">
                          <span>{{ $t('user.email') }}</span>
                        </label>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
                  <b-colxx xxs="6">
                    <b-row>
                      <b-colxx xxs="12">
                        <label class="form-group has-float-label mb-4">
                          <input type="phone" class="form-control" v-model="newUser.phoneNumber">
                          <span>{{ $t('user.phone') }}</span>
                        </label>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
              </b-row>
              <b-row>
                  <b-colxx xxs="6">
                    <b-row>
                      <b-colxx xxs="12">
                        <label class="form-group has-float-label mb-4">
                          <input type="text" class="form-control" v-model="newUser.username">
                          <span>{{ $t('user.username') }}</span>
                        </label>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
                  <b-colxx xxs="6">
                    <b-row>
                      <b-colxx xxs="12">
                        <label class="form-group has-float-label mb-4">
                          <input type="password" class="form-control" v-model="newUser.password">
                          <span>{{ $t('user.password') }}</span>
                        </label>
                      </b-colxx>
                    </b-row>
                  </b-colxx>
              </b-row>
              <label class="form-group has-float-label mb-4">
                <input type="text" class="form-control" v-model="newUser.referralCode">
                <span>{{ $t('user.referral-code') }}</span>
              </label>
              <div class="d-flex justify-content-end align-items-center">
                  <b-button type="submit" :disabled="processing" variant="primary" size="lg" class="btn-shadow">{{ $t('user.register-button')}}</b-button>
              </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import axios from 'axios'
import { apiBaseUrl } from '../../constants/config'
export default {
  data () {
    return {
      processing: false,
      newUser: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        emailAddress: '',
        username: '',
        password: '',
        referralCode: ''
      }
    }
  },
  methods: {
    formSubmit () {
      if (this.newUser.phoneNumber && this.newUser.emailAddress 
            && this.newUser.username && this.newUser.password) {
         this.processing = true
          axios
            .post(`${apiBaseUrl}/register`, this.newUser)
            .then(r => r.data)
            .then(res => {
              if (res.status === 200) {
                this.addNotification('success', 'User Creation', res.data)
                this.processing = false
                this.newUser = {}
              }
            })
            .catch(err => {
              console.log(err.response.data)
              this.addNotification('error', 'Error - User Creation', err.response.data.message)
              this.processing = false
            })
       }
    },
    addNotification (
      type = 'info',
      title = 'Message',
      message = 'This is Notify Message,<br>with html.'
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false })
    }
  }
}
</script>

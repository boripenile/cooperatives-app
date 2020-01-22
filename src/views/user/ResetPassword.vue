<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
          <div class="position-relative image-side ">
            <p class=" text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
              <p class="white mb-0">Please reset your password using any of your email address, username or 
                phone number with a new password.<br>Or proceed to login
                <router-link tag="a" to="/user/login" class="white">Login</router-link>.
              </p>
          </div>
          <div class="form-side">
            <router-link tag="a" to="/"><span class="logo-single"/></router-link>
            <h6 class="mb-4">{{ $t('user.password-reset-title')}}</h6>
            <b-form  @submit.prevent="formSubmit">
              <label class="form-group has-float-label mb-4">
                <input type="text" class="form-control" v-model="uniqueParameter">
                <span>{{ $t('user.unique-identifier') }}</span>
              </label>
              <label class="form-group has-float-label mb-4">
                <input type="password" class="form-control" v-model="newPassword">
                <span>{{ $t('user.new-password') }}</span>
              </label>
              <div class="d-flex justify-content-between align-items-center">
                  <b-button type="submit" variant="primary" size="lg" class="btn-shadow"
                    :disabled="processing">{{ $t('user.reset-button')}}</b-button>
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
      uniqueParameter: '',
      newPassword: '',
      verificationCode: this.$route.params.code,
      processing: false
    }
  },
  methods: {
    formSubmit () {
      if (this.newPassword && this.uniqueParameter && this.verificationCode) {
         console.log('Code: ' + this.verificationCode)
         console.log('Unique parameter: ' + this.uniqueParameter)
         console.log('New password: ' + this.newPassword)
         this.processing = true
          axios
            .post(`${apiBaseUrl}/resetpassword`, {
              'verificationCode': this.verificationCode,
              'newPassword': this.newPassword,
              'uniqueParameter': this.uniqueParameter
            })
            .then(r => r.data)
            .then(res => {
              if (res.status === 200) {
                this.addNotification('success', 'Password Reset', res.data)
                this.processing = false
              }
            })
            .catch(err => {
              console.log(err.response.data)
              this.addNotification('error', 'Error', err.response.data.message)
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
  },
  mounted () {
    document.body.classList.add('background')
  },
  beforeDestroy () {
    document.body.classList.remove('background')
  }
}
</script>

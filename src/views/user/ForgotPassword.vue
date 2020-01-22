<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
          <div class="position-relative image-side ">
            <p class=" text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
              <p class="white mb-0">Please use your e-mail to reset your password. <br>If you are not a member, please
                <router-link tag="a" to="/user/register" class="white">register</router-link>.
              </p>
          </div>
          <div class="form-side">
            <router-link tag="a" to="/"><span class="logo-single"/></router-link>
            <h6 class="mb-4">{{ $t('user.forgot-password')}}</h6>
            <b-form @submit.prevent="formSubmit">
              <label class="form-group has-float-label mb-4">
                <input type="email" class="form-control" v-model="email">
                <span>{{ $t('user.email') }}</span>
              </label>
              <div class="d-flex justify-content-end align-items-center">
                  <b-button type="submit" :disabled="processing" variant="primary" size="lg" class="btn-shadow">{{ $t('user.reset-password-button')}}</b-button>
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
      email: '',
      password: ''
    }
  },
  methods: {
    formSubmit () {
      if (this.email) {
        this.processing = true
        axios
          .get(`${apiBaseUrl}/resetpassword/email/` + this.email, null)
          .then(r => r.data)
          .then(res => {
            if (res.status === 200) {
              this.addNotification('success', 'Password reset', res.data)
              this.processing = false
            }
          })
          .catch(err => {
            console.log(err.response.data)
            this.addNotification('error', "Error", err.response.data.message)
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

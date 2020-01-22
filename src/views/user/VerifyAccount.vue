<template>
    <div class="container">
      <b-row class="center-page">
        <b-colxx md="6" sm="6" lg="4" xxs="12">
        </b-colxx>
        <b-colxx md="6" sm="6" lg="4" xxs="12">
            <b-card class="mb-4 text-center">
                <router-link to="?">
                    <p><i v-if="verified" class="simple-icon-check display-4 success font-weight-bold mb-5" ></i>
                    <i v-else class="simple-icon-close display-4 font-weight-bold mb-5" ></i>
                    </p>
                    <h6 class="display-6 mb-1 card-subtitle">Account Verification</h6>
                    <p class="display-8 text-muted mb-4">{{ verifyMessage }}</p>
                </router-link>
                <b-button size="sm" variant="outline-primary" class="btn-shadow" @click="goLogin">{{ $t('pages.go-login')}}</b-button>
            </b-card>
        </b-colxx>
        <b-colxx md="6" sm="6" lg="4" xxs="12">
        </b-colxx>
      </b-row>
    </div>
</template>
<script>
import axios from 'axios'
import { apiBaseUrl } from '../../constants/config'
export default {
  data () {
    return {
      verificationCode: this.$route.params.code,
      verified: false,
      verifyMessage: 'Verifying your account. Please hold on'
    }
  },
  methods: {
    goLogin() {
      this.$router.push('/user/login')
    },
    verifyCode () {
      axios
        .get(`${apiBaseUrl}/verify/` + this.verificationCode, null)
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            this.addNotification('success', 'Verification', 'Your account was verified successfully.')
            this.verifyMessage = res.data
            this.verified = true
          }
        })
        .catch(err => {
          console.log(err.response.data)
          this.verifyMessage = err.response.data.message
          this.addNotification('error', 'Error', err.response.data.message)
        })
    },
    addNotification (
      type = 'info',
      title = 'Message',
      message = 'This is Notify Message,<br>with html.'
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false })
    },
    formSubmit () {
      console.log('register')
    }
  },
  mounted () {
    document.body.classList.add('background')
    this.verifyCode()
  },
  beforeDestroy () {
    document.body.classList.remove('background')
  }
}
</script>
<style>
  .center-page{
    margin: 70px auto;
  }
</style>

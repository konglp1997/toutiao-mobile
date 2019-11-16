<template>
  <div class="container">
    <van-nav-bar left-arrow title="登录"></van-nav-bar>

      <van-cell-group>
        <van-field @blur="validmobile" :error-message="errMsg.mobile" v-model="loginForm.mobile" label="手机号" placeholder="请输入手机号" />
        <van-field @blur="validCode" :error-message="errMsg.code" v-model.trim="loginForm.code" label="验证码" placeholder="请输入验证码">
          <van-button class="p5" slot="button" size="mini" type="primary">发送验证码</van-button>
        </van-field>
      </van-cell-group>

    <div class="btn_box">
      <van-button type="info" @click="login" block round>登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        mobile: '13333333333',
        code: '246810'
      },
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    // 手机号验证
    validmobile () {
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '请输入手机号'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '请输入正确的手机号'
        return false
      }
      this.errMsg.mobile = ''
    },
    // 验证码验证
    validCode () {
      if (!this.loginForm.code) {
        this.errMsg.code = '请输入验证码'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '请输入正确的验证码'
        return false
      }
      this.errMsg.code = ''
    },
    async login () {
      this.validmobile()
      this.validCode()
      if (this.errMsg.mobile || this.errMsg.code) {
        return false
      }
      try {
        // 请求
        const data = await login(this.loginForm)

        this.setUser(data)

        const redirectUrl = this.$route.query.redirectUrl
        this.$router.push(redirectUrl || '/user')
      } catch (e) {
        this.$toast.fail('手机号或验证码错误')
      }
    },
    ...mapMutations(['setUser'])
  }
}
</script>

<style scoped lang='less'>
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>

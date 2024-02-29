<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <p style="font-size: 20px">智慧园区-登录</p>
      <el-card shadow="never" class="login-card">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="账号" prop="username">
            <el-input v-model.trim="form.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model.trim="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item prop="isAgree">
            <el-checkbox v-model="form.isAgree"> 记住我 </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        isAgree: false
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        isAgree: [
          {
            validator: (rule, value, callback) => {
              value ? callback() : callback(new Error('请记住我'))
            }
          }
        ]
      }
    }
  },
  methods: {
    submit() {
      console.log(111)
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          await this.$store.dispatch('user/login', this.form)
          this.$router.push('/')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;

  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/login-bg-e4ea539c.svg)
      no-repeat center / cover;
    display: flex;
    border-top-right-radius: 60px;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
  }

  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 100px;
  }

  .el-button {
    width: 100%;
    margin-top: 20px;
  }
}
</style>

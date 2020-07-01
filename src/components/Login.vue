<template>
  <div class="login_page">
    <div class="login_box">
      <div class="login_msg">
        <el-form :model="loginForm" ref="loginFormRef" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="loginForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="loginForm.password" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="login_btn">
        <button @click="LoginUser">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        name: 'luo',
        password: '123456'
      }
    }
  },
  methods: {
    LoginUser() {
      if (this.loginForm.name === 'luo' && this.loginForm.password === '123456') {
        window.sessionStorage.setItem('token', 'kjhxcuiohvnjaklkkxupzvckjahsldhfzxiuhjkwbnmebuigzkjxdbfjbi')
        this.$router.push('/home')
      } else {
        this.$message.error('用户名或密码错误请重新输入')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login_page {
  background: url('../assets/img/LoginRoad.jpg');
  // background-size: cover;
  // 用下面这个也行，但是下面这个会根据浏览器
  background-size: 100% 100%;
  height: 100%;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 530px;
  height: 300px;
  background-color: rgba(118, 169, 235, 0.3);
  border: 1px solid #638dc7;
  border-radius: 10px;
  box-shadow: 0 0 10px #638dc7;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_msg {
  display: flex;
  width: 300px;
  flex-direction: column;
  align-content: center;
  flex-grow: 2;
}
.login_btn {
  flex-grow: 1;
  border-left: 1px solid #b7def3;
  margin: 0 0 0 30px;
  padding: 30px;
  height: 150px;
  line-height: 150px;
  button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    padding: 12px;
    background-color: #67c23a;
    color: #fff;
    border: 0;
    cursor: pointer;
  }
}
</style>

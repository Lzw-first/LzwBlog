<template>
  <el-container>
    <el-header>
      <span>每个人都有属于自己的星空</span>
      <button @click="logout">退出</button>
    </el-header>
    <el-main>欢迎进入主页面</el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {},
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  position: relative;
}
.el-container::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/img/LoginRoadHome.jpg');
  filter: blur(5px);
  background-size: 100% 100%;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  color: #fff;
  button {
    background-color: rgba(255, 255, 255, 0);
    border: 0;
    color: #fff;
  }
}
</style>

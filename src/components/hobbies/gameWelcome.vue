<template>
  <div class="main_content">
    <h1>选择要玩的游戏</h1>
    <ol class="gameLists">
      <!-- <li>
        <el-button type="primary" size="small" @click="goto('game2048')">2048</el-button>
      </li> -->
      <li>
        <el-button type="primary" size="small" @click="goto('gameTanchishe')">贪吃蛇</el-button>
      </li>
      <li>
        <el-button type="primary" size="small" @click="goto('gameChidouzi')">吃豆子</el-button>
      </li>
      <li>
        <el-button type="primary" size="small" @click="goto('game20482')">2048</el-button>
      </li>
    </ol>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goto(Name) {
      this.$router.push('/game/' + Name)
    }
  }
}
</script>

<style lang="less" scoped>
h1 {
  text-align: center;
  margin-bottom: 10px;
}
.gameLists {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  li {
    margin: 10px;
  }
}
</style>

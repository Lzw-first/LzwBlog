<template>
  <el-container>
    <el-header>
      <span>
        每个人都有属于自己的星空
        <i>{{time | dateFormat}}</i>
      </span>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">首页</el-menu-item>
        <el-submenu index="2">
          <template slot="title">兴趣</template>
          <el-menu-item index="2-1">音乐</el-menu-item>
          <el-menu-item index="2-2">电影</el-menu-item>
          <el-menu-item index="2-3">游戏</el-menu-item>
        </el-submenu>
        <el-menu-item index="3">日记</el-menu-item>
        <el-menu-item index="4" @click="$router.push('/todolist')">TodoList</el-menu-item>
        <el-submenu index="5">
          <template slot="title">天气</template>
          <el-menu-item index="5-1">
            <div>
              <ol class="ls_weather">
                <li v-for="(item, index) in weatherData1" :key="index">
                  <p class="txt_time">{{item.update_time | timeFormat}}</p>
                  <img :src="item.src" :title="item.weather" />
                  <p class="txt_degree">{{item.degree}}℃</p>
                </li>
              </ol>
            </div>
          </el-menu-item>
          <el-menu-item index="5-2">
            <div>
              <ol class="ls_weather">
                <li v-for="(item, index) in weatherData2" :key="index">
                  <p class="txt_time">{{item.update_time | timeFormat}}</p>
                  <img :src="item.src" :title="item.weather" />
                  <p class="txt_degree">{{item.degree}}℃</p>
                </li>
              </ol>
            </div>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-input placeholder="请输入内容" v-model="inputSerach">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <div class="user_msg">
        <i class="el-icon-user"></i>
        <button @click="logout">退出</button>
      </div>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import jsonp from '../assets/js/jsonp.js'
export default {
  data() {
    return {
      inputSerach: '',
      activeIndex: '1',
      time: '',
      weatherData1: [],
      weatherData2: []
    }
  },
  created() {
    this.getWeather()
    this.getTime()
  },
  mounted() {},
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    handleSelect() {},
    // 通过调用接口获取天气信息
    getWeather() {
      jsonp({
        url: 'https://wis.qq.com/weather/common',
        params: {
          source: 'pc',
          weather_type: 'forecast_1h',
          province: '广东省',
          city: '深圳市'
        },
        success: data => {
          if (data.status !== 200) return this.$message.error('获取天气信息失败')
          // for (let i = 0; i < 10; i++) {
          //   this.weatherData.push(data.data.forecast_1h[i])
          // }
          const weatherList = Object.values(data.data.forecast_1h)
          this.weatherData1 = weatherList.slice(0, 12)
          for (let i = 0; i < 12; i++) {
            this.weatherData1[i].src = this.weatherSrc(this.weatherData1[i])
          }
          this.weatherData2 = weatherList.slice(12, 24)
          for (let i = 0; i < 12; i++) {
            this.weatherData2[i].src = this.weatherSrc(this.weatherData1[i])
          }
          console.log(this.weatherData2)
        }
      })
    },
    getTime() {
      this.time = new Date() + 1000
      setInterval(() => {
        this.time = new Date() + 1000
      }, 1000)
    },
    weatherSrc(item) {
      let src = ''
      const time = item.update_time.substr(8, 2)
      switch (item.weather) {
        case '阴':
          src = 'src/assets/img/weather/02.png'
          break
        case '雷阵雨':
          src = '../assets/img/weather/04[7673].png'
          break
        case '大雨':
          src = 'src/assets/img/weather/09[6413].png'
          break
        case '暴雨':
          src = 'src/assets/img/weather/10.png'
          break
        case '中雨':
          src = '../assets/img/weather/08[9565].png'
          break
        case '小雨':
          src = '../assets/img/weather/08[9565].png'
          break
        case '多云':
          if (time < 19 && time >= 6) {
            src = '../assets/img/weather/01[0].png'
          } else {
            src = '../assets/img/weather/01[1322].png'
          }
          break
        case '阵雨':
          if (time < 19 && time >= 6) {
            src = '../assets/img/weather/03.png'
            break
          } else {
            src = '../assets/img/weather/003[900].png'
            break
          }
        case '晴':
          if (time < 19 && time >= 6) {
            src = '../assets/img/weather/00.png'
            break
          } else {
            src = '../assets/img/weather/00[227].png'
            break
          }
      }
      return src
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  // color: #fff;
  // height: 40px !important;
  // background-color: #3798ff;
  i {
    padding: 0 10px;
  }
  .user_msg {
    button {
      margin-left: 10px;
      background-color: rgba(255, 255, 255, 0);
      border: 0;
      // color: #eeeeee;
      cursor: pointer;
    }
  }
  .el-input {
    width: 300px;
    .el-input__inner {
      border-right: 0;
      height: 35px;
    }
    .el-button {
      border: 0;
    }
  }
}

.el-main {
  padding-top: 10px;
  height: 100%;
  background-color: #f6f6f6;
}
.el-menu {
  .el-submenu {
    /deep/.el-submenu__title {
      font-size: 16px;
    }
  }
  .el-menu-item {
    font-size: 16px;
  }
}
.ls_weather > li {
  float: left;
  margin: 10px;
  text-align: center;
  img {
    width: 48px !important;
    height: 48px !important;
  }
}
</style>

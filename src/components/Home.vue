<template>
  <el-container>
    <el-header>
      <span>
        每个人都有属于自己的星空
        <i>{{ time | dateFormat }}</i>
        <i class="el-icon-timer" :style="{ display: isVisible, cursor: 'pointer' }" @click="showClock"></i>
      </span>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" @open="getWeather">
        <el-menu-item index="/home">首页</el-menu-item>
        <el-submenu index="/interest">
          <template slot="title">兴趣</template>
          <el-menu-item index="/music">音乐</el-menu-item>
          <el-menu-item index="/movie">电影</el-menu-item>
          <el-menu-item index="/game">游戏</el-menu-item>
        </el-submenu>
        <el-menu-item index="/diary">日记</el-menu-item>
        <el-menu-item index="/todolist">TodoList</el-menu-item>
        <!-- ele中自己定义的类 要用 popper-class -->
        <el-submenu index="/weather" popper-class="weatherList">
          <template slot="title">
            <p @click="gotoWeatherIndex" :style="{ display: 'inline-block' }">天气</p>
          </template>
          <el-menu-item index="5-1">
            <div>
              <ol class="ls_weather">
                <li v-for="(item, index) in weatherData1" :key="index">
                  <p class="txt_time">{{ item.update_time | timeFormat }}</p>
                  <img :src="item.src" :title="item.weather" />
                  <p class="txt_degree">{{ item.degree }}℃</p>
                </li>
              </ol>
              <ol class="ls_weather">
                <li v-for="(item, index) in weatherData2" :key="index">
                  <p class="txt_time">{{ item.update_time | timeFormat }}</p>
                  <img :src="item.src" :title="item.weather" />
                  <p class="txt_degree">{{ item.degree }}℃</p>
                </li>
              </ol>
            </div>
          </el-menu-item>
          <!-- <el-menu-item index="5-2">
            <div>
              如果分两个 menu-item 第一行的图片就只能显示一半
              <ol class="ls_weather">
                <li v-for="(item, index) in weatherData2" :key="index">
                  <p class="txt_time">{{item.update_time | timeFormat}}</p>
                  <img :src="item.src" :title="item.weather" />
                  <p class="txt_degree">{{item.degree}}℃</p>
                </li>
              </ol>
            </div>
          </el-menu-item>-->
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
    <!-- 计时器 -->
    <div class="studyClock" :style="{ display: isClockVisible }">
      <h2>今日已学</h2>
      <div>
        <span>{{ (studyMsg.totalSecond / 3600) | studyTime }}</span>
        <span>:</span>
        <span>{{ (studyMsg.totalSecond / 60) % 60 | studyTime }}</span>
        <span>:</span>
        <span>{{ studyMsg.totalSecond % 60 | studyTime }}</span>
      </div>
      <i class="el-icon-circle-close" @click="closeClock"></i>
      <button class="study_btn" @click="accumTime()">{{ studyMsg.lebal }}</button>
      <ol>
        <li v-for="(item, index) in studyMsg.list" :key="index">{{ item }}</li>
      </ol>
    </div>
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
      activeIndex: '/home',
      time: '',
      weatherData1: [],
      weatherData2: [],
      studyMsg: {
        flag: 1,
        totalSecond: 0,
        lebal: '开始学习',
        list: []
      },
      timer: '',
      isClockVisible: 'none',
      isVisible: 'inline-block'
    }
  },
  created() {
    this.getWeather()
    this.getTime()
    this.getActiveIndex()
  },
  mounted() {},
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getActiveIndex() {
      var index = window.sessionStorage.getItem('activeIndex')
      if (index !== null) {
        this.activeIndex = index
      } else {
        this.activeIndex = '/home'
      }
    },
    handleSelect(index) {
      window.sessionStorage.setItem('activeIndex', index)
      this.$router.push(index)
    },
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
            this.weatherData2[i].src = this.weatherSrc(this.weatherData2[i])
          }
          // console.log(this.weatherData2)
        }
      })
    },
    getTime() {
      this.time = +new Date()
      setInterval(() => {
        this.time = +new Date()
      }, 1000)
    },
    weatherSrc(item) {
      let src = ''
      const time = item.update_time.substr(8, 2)
      switch (item.weather) {
        case '阴':
          src = require('../assets/img/weather/02.png')
          break
        case '雷阵雨':
          src = require('../assets/img/weather/04[7673].png')
          break
        case '大雨':
          src = require('../assets/img/weather/09[6413].png')
          break
        case '暴雨':
          src = require('../assets/img/weather/10.png')
          break
        case '中雨':
          src = require('../assets/img/weather/08[9565].png')
          break
        case '小雨':
          src = require('../assets/img/weather/08[9565].png')
          break
        case '多云':
          if (time < 19 && time >= 6) {
            src = require('../assets/img/weather/01[0].png')
          } else {
            src = require('../assets/img/weather/01[1322].png')
          }
          break
        case '阵雨':
          if (time < 19 && time >= 6) {
            src = require('../assets/img/weather/03.png')
            break
          } else {
            src = require('../assets/img/weather/03[900].png')
            break
          }
        case '晴':
          if (time < 19 && time >= 6) {
            src = require('../assets/img/weather/00.png')
            break
          } else {
            src = require('../assets/img/weather/00[227].png')
            break
          }
      }
      return src
    },
    // 计算学习时间
    accumTime() {
      const _this = this
      const time = new Date(_this.time)
      if (this.studyMsg.flag === 1) {
        _this.studyMsg.flag = 0
        _this.studyMsg.lebal = '停止学习'
        const li = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} 开始学习`
        _this.studyMsg.list.push(li)
        this.timer = setInterval(function() {
          // 想得太复杂了,直接一个变量++就行
          // const nowTime = +new Date()
          // const dirTime = (nowTime - startTime) / 1000
          // _this.studyMsg.hh += Math.floor(dirTime / 3600)
          // _this.studyMsg.mm += Math.floor((dirTime / 60) % 60)
          // _this.studyMsg.ss += Math.floor(dirTime % 60)
          _this.studyMsg.totalSecond++
        }, 1000)
      } else {
        clearInterval(this.timer)
        _this.studyMsg.flag = 1
        _this.studyMsg.lebal = '开始学习'
        const li = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} 结束学习`
        _this.studyMsg.list.push(li)
      }
    },
    // 关闭计时器
    closeClock(e) {
      this.isClockVisible = 'none'
      // 同时显示计时器图标
      this.isVisible = 'inline-block'
    },
    // 打开计时器
    showClock() {
      this.isClockVisible = 'flex'
      this.isVisible = 'none'
    },
    // 跳转至腾讯天气首页
    gotoWeatherIndex() {
      window.open('https://tianqi.qq.com/index.htm')
    }
  }
}
// 选择类
// var weatherList = document.querySelector('.weatherList');
// console.log(weatherList);
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
    a {
      align-content: center;
    }
  }
  .el-menu-item {
    font-size: 16px;
    height: auto;
  }
}
.ls_weather {
  display: flex;
  height: auto;
}
.ls_weather > li {
  height: auto;
  margin: 10px;
  text-align: center;
  img {
    height: 48px;
    width: 48px;
  }
}
.studyClock {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 100px;
  left: 40px;
  width: 200px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 #fff;
  h2 {
    margin: 10px;
  }
  span {
    display: block;
    float: left;
    width: 50px;
    height: 50px;
    margin: 5px;
    color: #ffffff;
    background-color: #000;
    font-size: 24px;
    line-height: 50px;
    text-align: center;
  }
  span:nth-child(2),
  span:nth-child(4) {
    width: 10px;
    margin: 0;
    font-weight: bold;
    line-height: 50px;
    background-color: #ffffff;
    color: #000;
  }
  .study_btn {
    padding: 5px;
    margin: 5px;
    border: none;
    margin-top: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  .el-icon-circle-close {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 999;
    cursor: pointer;
  }
}
</style>

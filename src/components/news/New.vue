<template>
  <div class="main_content">
    <h1>Welcome Home</h1>
    <h2>今日推荐</h2>
    <div class="newsContainer">
      <div v-for="(item, k) in newLists" :key="k" class="newsBox">
        <!-- <img :src="'../../assets/img/' + item.src[0]" alt="" /> -->
        <img :src="item.src" alt />
        <h3>{{ item.title }}</h3>
        <p>{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// newList 直接就是一个对象
import newList from '../../assets/src.json'
export default {
  data() {
    return {
      newLists: []
    }
  },
  created() {
    this.getNewsData()
  },
  methods: {
    getNewsData() {
      for (var k in newList) {
        this.newLists.push(newList[k])
      }
      for (var i = 0; i < this.newLists.length; i++) {
        this.newLists[i].src = this.getImgSrc(this.newLists[i])
      }
    },
    getImgSrc(item) {
      let src = ''
      src = require('../../assets/img/news/' + item.src)
      return src
    }
  }
}
</script>

<style lang="less" scoped>
h1 {
  text-align: center;
  font-size: 25px;
  padding: 10px;
}
h2 {
  margin-top: 15px;
  font-size: 20px;
  font-weight: bold;
}
.newsContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .newsBox {
    width: 400px;
    height: 400px;
    margin-top: 15px;
    margin-left: 40px;
    box-shadow: 0 0 5px 0 #eee;
    padding: 5px;
    img {
      width: 100%;
      margin-bottom: 10px;
    }
    p {
      margin-top: 10px;
      text-indent: 2em;
    }
  }
}
</style>

<template>
  <div>
    <header>
      <h2>贪吃蛇</h2>
      <el-button size="small" type="primary" @click="init()">重新开始</el-button>
      <p class="introduction">默认为普通难度，按空格开始/暂停游戏</p>
      <p>
        难度：
        <el-button size="mini" type="primary" @click="speed = 200">简单</el-button>
        <el-button size="mini" type="info" @click="speed = 100">普通</el-button>
        <el-button size="mini" type="danger" @click="speed = 50">困难</el-button>
      </p>
      <p>
        score:
        <span>{{snack.length - 4}}</span>
      </p>
    </header>
    <div class="board">
      <div v-for="(item1, k1) in 20" :key="k1">
        <div class="commondGird" v-for="(item2, k2) in 20" :key="k2" ref="gird"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      speed: 100, // 每次移动的时间间隔 单位： ms
      snack: [],
      egg: {},
      dir: 'right',
      pasue: true,
      moveTimer: null,
      score: 0
    }
  },
  created() {
    this.createSnack()
  },
  mounted() {
    this.$refs.gird.forEach(item => {
      item.setAttribute('class', 'commondGird')
    })
    this.mountSnack()
    this.createdEgg()
    document.addEventListener('keyup', e => {
      if (e.keyCode === 32) {
        e.preventDefault()
        if (this.pasue) {
          console.log('开始游戏')

          this.startGame()
        } else {
          console.log('停止游戏')

          this.pauseGame()
        }
      } else {
        switch (e.keyCode) {
          case 37:
            if (this.dir !== 'right') {
              this.dir = 'left'
            }
            break
          case 38:
            if (this.dir !== 'down') {
              this.dir = 'up'
            }
            break
          case 39:
            if (this.dir !== 'left') {
              this.dir = 'right'
            }
            break
          case 40:
            if (this.dir !== 'up') {
              this.dir = 'down'
            }
            break
        }
      }
    })
  },
  methods: {
    init() {
      location.reload()
    },
    createSnack() {
      console.log('创建了新的蛇')

      var startX = ~~(Math.random() * 10 + 4)
      var startY = ~~(Math.random() * 16 + 2)
      for (var i = 0; i < 4; i++) {
        this.snack.push({
          x: startX - i,
          y: startY
        })
      }
      console.log(this.snack)
    },
    createdEgg() {
      var randX = ~~(Math.random() * 20)
      var randY = ~~(Math.random() * 20)

      while (this.isHaveSnack({ x: randX, y: randY })) {
        randX = ~~(Math.random() * 20)
        randY = ~~(Math.random() * 20)
      }
      this.egg.x = randX
      this.egg.y = randY
      this.$refs.gird[randX * 20 + randY].setAttribute('class', 'commondGird eggGird')
    },
    isHaveSnack({ x, y }) {
      return this.snack.find(item => {
        return item.x === x && item.y === y
      })
    },
    /**
     * 将蛇渲染到游戏界面上
     */
    mountSnack() {
      if (this.snack[0].x > 19 || this.snack[0].y > 19 || this.snack[0].x < 0 || this.snack[0].y < 0) {
        this.snack.shift()
      }
      this.snack.forEach(item => {
        this.$refs.gird[`${item.x * 20 + item.y}`].setAttribute('class', 'commondGird snackGird')
      })
      this.$refs.gird[this.snack[0].x * 20 + this.snack[0].y].setAttribute('class', 'commondGird snackHead')
    },
    /**
     * 开始游戏
     */
    startGame() {
      this.pasue = false
      this.moveTimer = this.moveSnack()
    },
    /**
     * 停止游戏
     */
    pauseGame() {
      this.pasue = true
      clearInterval(this.moveTimer)
      this.moveTimer = null
      console.log('停止了游戏')
    },
    /**
     * 设置一个控制蛇移动的函数
     */
    moveSnack() {
      return setInterval(() => {
        var nextX = null
        var nextY = null
        switch (this.dir) {
          case 'right':
            nextX = this.snack[0].x + 1
            nextY = this.snack[0].y
            this.snack.unshift({
              x: nextX,
              y: nextY
            })
            break
          case 'left':
            nextX = this.snack[0].x - 1
            nextY = this.snack[0].y
            this.snack.unshift({
              x: nextX,
              y: nextY
            })
            break
          case 'up':
            nextX = this.snack[0].x
            nextY = this.snack[0].y - 1
            this.snack.unshift({
              x: nextX,
              y: nextY
            })
            break
          case 'down':
            nextX = this.snack[0].x
            nextY = this.snack[0].y + 1
            this.snack.unshift({
              x: nextX,
              y: nextY
            })
            break
        }
        this.isGameOver()
        if (!this.isEatEgg() && !this.isGameOver()) {
          const outGird = this.snack.pop()
          this.$refs.gird[outGird.x * 20 + outGird.y].setAttribute('class', 'commondGird')
        }
        this.mountSnack()
      }, this.speed)
    },
    /**
     * 判断是否吃到了蛋
     */
    isEatEgg() {
      if (this.snack[0].x === this.egg.x && this.snack[0].y === this.egg.y) {
        this.score++
        this.createdEgg()
        return true
      } else {
        return false
      }
    },
    /**
     * 判断是否结束游戏
     */
    isGameOver() {
      // 判断是否咬到自己
      var flag = false
      const headX = this.snack[0].x
      const headY = this.snack[0].y
      for (var i = 1; i < this.snack.length; i++) {
        if (this.snack[i].x === headX && this.snack[i].y === headY) {
          flag = true
          this.failGame()
          return
        }
      }
      if (this.snack[0].x > 19 || this.snack[0].y > 19 || this.snack[0].x < 0 || this.snack[0].y < 0) {
        console.log(this.snack)

        flag = true
        this.failGame()
      }
      return flag
    },
    failGame() {
      this.pauseGame()
      this.$confirm(`你撞到咯，本次获得了${this.score}`, 'GameOver', {
        confirmButtonText: '重新开始',
        cancelButtonText: '退出游戏',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '重新游戏!'
          })
          location.reload()
        })
        .catch(() => {
          this.$router.push('/game')
        })
    }
  }
}
</script>

<style lang="less" scoped>
header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    margin-bottom: 10px;
  }
  p {
    margin: 10px 0;
  }
}
.board {
  width: 400px;
  height: 400px;
  border: 2px solid red;
  display: flex;
  margin: 10px auto;

  .commondGird {
    width: 19px;
    height: 19px;
    border: 0.5px solid #000;
  }

  .snackGird {
    background-color: rgb(218, 101, 101);
  }
  .snackHead {
    background-color: rgb(255, 0, 0);
  }

  .eggGird {
    background-color: gold;
  }
}
</style>

<template>
  <div>
    <header>
      <h2>2048</h2>
      <el-button type="info" size="small" @click="init()">重新开始</el-button>
      <p>
        score:
        <span>{{score}}</span>
      </p>
    </header>
    <div class="allContainer">
      <div class="gbCell">
        <span v-for="item in 16" :key="item"></span>
      </div>
      <div class="numCell">
        <div
          v-for="item in rocks.filter(e => e)"
          :key="item.id"
          :id="`numCell${item.id}`"
          :style="{color: item.num > 4 ? '#fff' : '#776e65', backgroundColor: item.bgc, transform: `translate(${cssTransition(item)})`, zIndex: item.num}"
        >{{item.num}}</div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 根据数字块的属性值排序
 */
// function pointSort(prototype) {
//   return (firstRock, secondRock) => {
//     const firstValue = firstRock[prototype]
//     const secondValue = firstRock[prototype]
//     return firstValue > secondValue ? 1 : -1
//   }
// }
const pointSort = prototype => (firstRock, secondRock) => {
  const first = firstRock[prototype]
  const second = secondRock[prototype]
  return first > second ? 1 : -1
}
/**
 * 设置一个延迟函数
 */
const dely = ms => new Promise(resolve => setTimeout(resolve, ms))
export default {
  data() {
    return {
      score: 0,
      rocks: [],
      color: {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#0444BF',
        1024: '#A79674',
        2048: '#282726',
        4096: '#280b21',
        8192: '#281d04'
      }
    }
  },
  /**
   * 挂在完 dom元素 后执行
   */
  mounted() {
    this.init()
    document.addEventListener('keydown', e => {
      switch (e.key.toLocaleUpperCase()) {
        case 'ARROWRIGHT':
        case 'D':
          e.preventDefault()
          this.turn('right')
          break
        case 'ARROWLEFT':
        case 'A':
          e.preventDefault()
          this.turn('left')
          break
        case 'ARROWDOWN':
        case 'S':
          e.preventDefault()
          this.turn('down')
          break
        case 'ARROWUP':
        case 'W':
          e.preventDefault()
          this.turn('up')
          break
      }
    })
  },
  methods: {
    getRock({ x, y }) {
      return this.rocks.filter(e => e).find(e => e.x === x && e.y === y)
    },
    /**
     * 根据数字块 x, y 属性确定移动值
     */
    cssTransition(item) {
      return `${item.x * 120 + 20}px, ${item.y * 120 + 20}px`
    },
    /**
     * 根据数字块的 id 获取数字块在数组中的位置
     */
    getIndex(id) {
      return this.rocks.findIndex(rock => rock && rock.id === id)
    },
    init() {
      this.rocks = []
      this.score = 0
      this.add()
      this.add()
    },
    add() {
      if (this.noSpace()) {
        return false
      } else {
        var randX = ~~(Math.random() * 4)
        var randY = ~~(Math.random() * 4)
        var time = 0
        while (time < 50) {
          if (!this.getRock({ x: randX, y: randY })) {
            break
          } else {
            randX = ~~(Math.random() * 4)
            randY = ~~(Math.random() * 4)
            time++
          }
        }
        if (time === 50) {
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              if (!this.getRock({ x: randX, y: randY })) {
                randX = i
                randY = j
                break
              }
            }
          }
        }
        const num = Math.random() > 0.8 ? 4 : 2
        const rock = {
          x: randX,
          y: randY,
          num: num,
          bgc: this.color[num],
          id: this.rocks.length + 1
        }
        this.rocks.push(rock)
        console.log(this.rocks)
      }
    },
    noSpace() {
      return this.rocks.filter(e => e).length > 15
    },
    isGameOver() {
      if (this.noSpace()) {
        const resultX = this.rocks
          .filter(e => e && e.x < 3)
          .find(e => {
            const nextX = this.getRock({ x: e.x + 1, y: e.y })
            return e.num === nextX.num
          })
        const resultY = this.rocks
          .filter(e => e && e.y < 3)
          .find(e => {
            const nextY = this.getRock({ x: e.x, y: e.y + 1 })
            return e.num === nextY.num
          })
        return (resultX || resultY) === undefined
      }
      return false
    },
    /**
     * 判断是否胜利
     */
    isSuccess() {
      // 胜利的条件是有一个数字达到8192
      const result = this.rocks.filter(e => e).find(e => e.num === 8192)
      return result !== undefined
    },
    /**
     * 控制移动的函数
     */
    turn(direct) {
      // 给每个数字块添加 canCalc 属性， 因为每个元素都是对象所以可以添加
      this.rocks.forEach(e => e && (e.canCalc = true))

      Promise.all(
        this.handleDirect(direct)
          .handleArr(this.rocks)
          .map(async e => {
            var flag = this.calcAxis({ e, direct })
            return flag
          })
      ).then(async res => {
        if (res.indexOf(true) > -1) {
          if (this.isSuccess()) {
            this.$message.success('你真牛，这都能通关')
          } else {
            await dely(200)
            this.add()
          }
        } else {
          if (this.isGameOver()) {
            this.$message.error('游戏结束，请重新开始')
          } else if (this.isSuccess()) {
            this.$message.success('你真牛，这都能通关')
          }
        }
        setTimeout(() => {}, 10)
      })
    },
    handleDirect(direct) {
      if (direct === 'right') {
        return {
          handleArr: arr =>
            arr
              .filter(e => e && e.x !== 3)
              .sort(pointSort('x'))
              .reverse(),
          /**
           * 判断当前元素是否为最右边一列
           * @return boolean 如果为最边一列返回 false
           */
          handleCondition: e => e.x < 3,
          next: e => this.getRock({ x: e.x + 1, y: e.y }),
          handleMove: e => e.x++
        }
      } else if (direct === 'left') {
        return {
          handleArr: arr => arr.filter(e => e && e.x !== 0).sort(pointSort('x')),
          handleCondition: e => e.x > 0,
          next: e => this.getRock({ x: e.x - 1, y: e.y }),
          handleMove: e => e.x--
        }
      } else if (direct === 'down') {
        return {
          handleArr: arr =>
            arr
              .filter(e => e && e.y !== 3)
              .sort(pointSort('y'))
              .reverse(),
          handleCondition: e => e.y < 3,
          next: e => this.getRock({ x: e.x, y: e.y + 1 }),
          handleMove: e => e.y++
        }
      } else if (direct === 'up') {
        return {
          handleArr: arr => arr.filter(e => e && e.y !== 0).sort(pointSort('y')),
          handleCondition: e => e.y > 0,
          next: e => this.getRock({ x: e.x, y: e.y - 1 }),
          handleMove: e => e.y--
        }
      }
    },
    calcAxis({ e, direct }) {
      return new Promise((resolve, reject) => {
        const nextRock = this.handleDirect(direct).next(e)
        if (nextRock && nextRock.num !== e.num) {
          resolve(false)
        } else if (nextRock && nextRock.canCalc && nextRock.num === e.num) {
          this.handleDirect(direct).handleMove(e)
          nextRock.num *= 2
          nextRock.canCalc = false
          nextRock.bgc = this.color[nextRock.num]
          this.score += nextRock.num
          this.rocks.splice(this.getIndex(e.id), 1, null)
          resolve(true)
        } else if (nextRock === undefined) {
          if (this.handleDirect(direct).handleCondition(e)) {
            this.handleDirect(direct).handleMove(e)
            this.calcAxis({ e, direct })
          }
          resolve(true)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    font-size: 30px;
    margin-bottom: 15px;
  }
  p {
    margin-top: 15px;
    font-size: 15px;
  }
}
.allContainer {
  position: relative;
  width: 500px;
  height: 500px;
  background-color: #bbada0;
  margin: 15px auto;
  border-radius: 10px;
  .gbCell {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 100px;
      height: 100px;
      margin: 10px;
      background-color: #ccc0b3;
      border-radius: 10px;
    }
  }
  .numCell {
    position: absolute;
    top: 0;
    left: 0;
    > div {
      position: absolute;
      width: 100px;
      height: 100px;
      font-size: 50px;
      font-weight: bold;
      line-height: 100px;
      text-align: center;
      border-radius: 10px;
      transition-property: transform;
      transition: 100ms ease-in-out;
    }
  }
}
</style>

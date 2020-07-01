<template>
  <div>
    <header>
      <h2>2048</h2>
      <el-button type="info" size="small" @click="newGame">New Game</el-button>
      <p>
        score:
        <span class="scroe">{{score}}</span>
      </p>
    </header>
    <div class="all_container">
      <div class="gbCell">
        <span v-for="list in 16" :key="list"></span>
      </div>
      <div class="numCell">
        <!-- <span
          v-for="(item, index) in rocks"
          :key="index"
          :id="`r${item && item.id}`"
          :style="{ zIndex: item ? item.num : 0, transform: `translate(${cssTransiton(item)})`, backgroundColor: item ? item.color : '', color: item.num === 2 || item.num === 4 ? '#776e65' : '#fff' }"
          >{{ item ? item.num : '' }}</span
        >-->
        <span
          class="list"
          v-for="(e, index) in rocks"
          :key="index"
          :style="
            `
            zIndex: ${e ? e.num : 0};
            transform: translate(${cssTransition(e)});
          `
          "
        >
          <span
            class="inner"
            :id="`r${e && e.id}`"
            :style="{ backgroundColor: e ? e.color : '', color: e ? (e.num > 4 ? '#fff' : '#776e65') : '' }"
          >{{ e ? e.num : '' }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// 一个获取属性值后排序的函数
// function pointSort(prototype) {
//   ;(function(firstRock, secondRock) {
//     const firstPoint = firstRock[prototype]
//     const secondPoint = secondRock[prototype]
//     return firstPoint < secondPoint ? -1 : 1
//   })()
// }
const pointSort = property => (firstRocks, secondRocks) => {
  // 传入 x 和 y 然后在数组中查询，如果前一个比后一个小则不调换顺序
  const firstPoint = firstRocks[property]
  const secondPoint = secondRocks[property]
  return firstPoint < secondPoint ? -1 : 1
}
// 设置一个延迟函数
const dely = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))

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
      },
      // 用来判断手机模式下滑动操作的距离
      directX: 30
    }
  },
  mounted() {
    // 加载完成的时候添加事件
    this.init()
    // 添加事件监听
    document.addEventListener('keydown', e => {
      e.preventDefault()
      switch (e.key.toLocaleUpperCase()) {
        case 'ARROWRIGHT':
        case 'D':
          this.turn('right')
          break
        case 'ARROWLEFT':
        case 'A':
          this.turn('left')
          break
        case 'ARROWDOWN':
        case 'S':
          this.turn('down')
          break
        case 'ARROWUP':
        case 'W':
          this.turn('up')
          break
      }
    })
    document.addEventListener('touchstart', start => {
      // 设置一个移动计算函数
      const moveFunc = move => {
        // 有在移动，并且阻止移动的默认行为
        move && move.preventDefault()
        // move.touches[0] 移动到哪就显示哪的横纵坐标
        const dx = move.touches[0].clientX - start.touches[0].clientX
        const dy = move.touches[0].clientY - start.touches[0].clientY
        if (dx > this.directX) {
          this.turn('right')
          document.removeEventListener('touchmove', moveFunc)
        } else if (dx < -this.directX) {
          this.trun('left')
          document.removeEventListener('touchmove', moveFunc)
        } else if (dy > this.directX) {
          this.turn('down')
          document.removeEventListener('touchmove', moveFunc)
        } else if (dy < -this.directX) {
          this.turn('up')
          document.removeEventListener('touchmove', moveFunc)
        }
      }
      document.addEventListener('touchmove', moveFunc)
      document.addEventListener('touchend', () => {
        document.removeEventListener('touchmove', moveFunc)
      })
    })
  },
  methods: {
    // 判断是否为手机
    isMobile() {
      return window.navigator.userAgent.match(/Mobile/)
    },
    cssTransition(e) {
      if (this.isMobile()) {
        // vw 视口宽度的百分比
        return `${(e ? e.x : 0) * 23.5}vw, ${(e ? e.y : 0) * 23.5}vw`
      } else {
        return `${(e ? e.x : 0) * 120}px, ${(e ? e.y : 0) * 120}px`
      }
    },
    init() {
      this.score = 0
      this.initRocks()
    },
    // 初始化数字块
    initRocks() {
      this.rocks = []
      this.add()
      this.add()
    },
    // 初始化游戏
    newGame() {
      this.init()
      console.log(this.rocks)
    },
    // 通过 x , y 值查询是否存在该数字块 入参从 {x, y} 改成 x, y 才能正常查找
    getRock({ x, y }) {
      const rock = this.rocks.filter(rock => rock).find(rock => rock.x === x && rock.y === y)
      return rock
    },
    // 通过 id 查询对应 rock 的位置
    getIndex(id) {
      return this.rocks.findIndex(rock => rock && rock.id === id)
    },
    // 在随机位置创建一个新的数字
    add() {
      if (this.noSpace()) {
        return false
      } else {
        var randx = ~~(Math.random() * 4)
        var randy = ~~(Math.random() * 4)
        var times = 0
        while (times < 50) {
          if (!this.getRock({ x: randx, y: randy })) {
            break
          } else {
            randx = ~~(Math.random() * 4)
            randy = ~~(Math.random() * 4)
            times++
          }
        }
        if (times === 50) {
          for (var x = 0; x < 4; x++) {
            for (var y = 0; y < 4; y++) {
              if (!this.getRock({ x: x, y: y })) {
                randx = x
                randy = y
              }
            }
          }
        }
        const num = Math.random() > 0.8 ? 4 : 2
        const rock = {
          x: randx,
          y: randy,
          num: num,
          // 可能会出bug id会有重复的情况 不是删除数据的方式，而是把数据用null 来代换，所以才有各种filter(e => e)
          id: this.rocks.length + 1,
          color: this.color[num]
        }
        this.rocks.push(rock)
      }
    },
    noSpace() {
      if (this.rocks.filter(e => e).length > 15) {
        return true
      } else {
        return false
      }
    },
    // 控制移动的函数
    handleDirect(direct) {
      if (direct === 'right') {
        return {
          handleArr: arr =>
            // 这边最后反转了一下，是为了让最右边的格子先右移，然后再到左边
            arr
              .filter(e => e && e.x !== 3)
              .sort(pointSort('x'))
              .reverse(),
          handleCondition: e => e.x < 3,
          next: e => ({ x: e.x + 1, y: e.y }),
          handleMove: e => e.x++
        }
      } else if (direct === 'left') {
        return {
          handleArr: arr => arr.filter(e => e && e.x !== 0).sort(pointSort('x')),
          handleCondition: e => e.x > 0,
          next: e => ({ x: e.x - 1, y: e.y }),
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
          next: e => ({ x: e.x, y: e.y + 1 }),
          // 控制往下移动一格
          handleMove: e => e.y++
        }
      } else if (direct === 'up') {
        return {
          handleArr: arr => arr.filter(e => e && e.y !== 0).sort(pointSort('y')),
          handleCondition: e => e.y > 0,
          next: e => ({ x: e.x, y: e.y - 1 }),
          handleMove: e => e.y--
        }
      }
    },
    // 移动
    turn(direct) {
      // 先给每个 rock 添加 canCalc 属性, 因为每次移动之前都要重新刷新这个值
      this.rocks.forEach(e => e && (e.canCalc = true))
      console.log(this.rocks)

      Promise.all(
        this.handleDirect(direct)
          .handleArr(this.rocks)
          .filter(rock => rock)
          .map(async e => {
            var flag = this.calcAxis({ e, direct })
            return flag
          })
      ).then(res => {
        if (res.indexOf(true) > -1) {
          if (this.isSuccess()) {
            this.$message.success('恭喜你通关了')
            return
          } else {
            this.add()
          }
        } else {
          if (this.isGameOver()) {
            this.$message.error('游戏结束，请重新开始')
            return
          } else if (this.isSuccess()) {
            this.$message.success('恭喜你通关了')
            return
          }
        }
        setTimeout(() => {}, 10)
      })
    },
    /**
     * 是否游戏结束
     * @return boolean 失败，反之没有结束
     */
    isGameOver() {
      const result =
        this.noSpace() &&
        this.rocks
          .filter(e => e && (e.x !== 3 || e.y !== 3))
          .find(e => {
            const nextX = this.getRock({ x: e.x + 1, y: e.y })
            const nextY = this.getRock({ x: e.x, y: e.y + 1 })
            // 判断相邻的是否还能合并
            return e.num === (nextX && nextX.num) || e.num === (nextY && nextY.num)
          })
      return result === undefined
    },
    // 判断是否通关
    isSuccess() {
      const result = this.rocks.find(e => {
        // console.log(e && e.num === 8192)

        return e && e.num === 8192
      })
      return result
    },
    /**
     * 合并数字块时添加移动样式
     * @param next
     */
    mergeNumericBlockAddStyle(next) {
      const nextDom = document.querySelector(`#r${next.id}`)
      nextDom.animate([{ transform: 'scale(0.95)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], {
        duration: 200
      })
    },
    // 处理移动距离的函数
    calcAxis({ e, direct }) {
      return new Promise((resolve, reject) => {
        const next = this.getRock(this.handleDirect(direct).next(e))
        // console.log(next)
        if (next && next.num !== e.num) {
          // 返回 false 表示不能再移动，就进行是否结束判断
          resolve(false)
        } else if (next && next.canCalc && next.num === e.num) {
          console.log('可以合并了')
          // 进行数字块的移动
          // 这边直接向对应方向移动一格
          this.handleDirect(direct).handleMove(e)
          // 对应位置上的数值 * 2
          next.num *= 2
          this.score += e.num
          next.canCalc = false
          next.color = this.color[next.num]
          this.mergeNumericBlockAddStyle(next)
          dely(200)
          // 再清空原来那一个
          this.rocks.splice(this.getIndex(e.id), 1, null)
          resolve(true)
        } else if (next === undefined) {
          // 如果下一个是空，就进行下面的步骤
          // 先确认不是最边一个,if 里面判断的是 除了最边的是否还存在其他的
          if (this.handleDirect(direct).handleCondition(e)) {
            // 如果不是最边一个，那就可以移动，然后递归
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
}
.all_container {
  position: relative;
  width: 500px;
  height: 500px;
  margin: 20px auto;
  background-color: #bbada0;
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
      border-radius: 8px;
    }
  }
  .numCell {
    // position: absolute;
    // top: 0;
    // left: 0;
    // > span {
    //   position: absolute;
    //   width: 100px;
    //   height: 100px;
    //   border-radius: 8px;
    //   font-size: 50px;
    //   line-height: 100px;
    //   text-align: center;
    //   font-weight: bold;
    //   transition-property: transform;
    //   transition: 100ms ease-in-out;
    //   animation-fill-mode: backwards;
    //   animation: appear 200ms ease-in-out;
    z-index: 0;
    padding: 10px;
    width: 480px;
    height: 480px;
    display: inline-flex;
    position: absolute;
    top: 0;
    left: 0;
    justify-content: flex-start;
    align-items: flex-start;
    -webkit-touch-callout: none;
    -ms-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -ms-touch-action: none;
    touch-action: none;
    .list {
      margin: 10px;
      width: 100px;
      height: 100px;
      border-radius: 10px;
      position: absolute;
      font-size: 50px;
      font-weight: bold;
      transition-property: transform;
      border-radius: 10px;
      transition: 100ms ease-in-out;
      .inner {
        width: 100%;
        height: 100%;
        color: #fff;
        display: inline-flex;
        align-items: center;
        border-radius: 10px;
        justify-content: center;
        animation-fill-mode: backwards;
        animation: appear 200ms ease-in-out;
      }
    }
  }
}
</style>

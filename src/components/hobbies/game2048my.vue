<template>
  <div class="ganmeBox">
    <header>
      <h2>2048</h2>
      <el-button type="info" size="small" @click="newGame">New Game</el-button>
      <p>
        score:
        <span class="scroe">0</span>
      </p>
    </header>
    <div class="grid_container">
      <div
        v-for="(item, k) in gridCellList"
        :key="k"
        class="grid_cell"
        :id="'grid_cell_'+item.i+ '_' +item.j"
        :style="{top: getPosTop(item.i, item.j), left: getPosLeft(item.i, item.j)}"
      ></div>
      <!-- 先不加这一块的css width: getLength(item.num), height: getLength(item.num) -->
      <div
        class="number_cell"
        v-for="item in numberCellList"
        :key="`${item.i},${item.j}`"
        :id="'number_cell_'+item.i+ '_' +item.j"
        :style="{top: numGetPosTop(item.i, item.j, item.num), left: numGetPosLeft(item.i, item.j, item.num), background: getNumberCellBgc(item.num),  color: getNumberColor(item.num)}"
      >{{item.num === 0 ? '' : item.num}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gridCellList: [],
      // 装数字的框
      numberCellList: [],
      // 记录是否已经叠加了一次
      hasConflicted: [],
      // 分数
      score: 0
    }
  },
  created() {
    this.init()
  },
  mounted() {
    // this.init()
  },
  methods: {
    // 提供基础的算法支持
    getPosTop(i, j) {
      return j * 120 + 20 + 'px'
    },
    getPosLeft(i, j) {
      return i * 120 + 20 + 'px'
    },
    numGetPosTop(i, j, num) {
      if (num === 0) {
        return j * 120 + 70 + 'px'
      } else {
        return j * 120 + 20 + 'px'
      }
    },
    numGetPosLeft(i, j, num) {
      if (num === 0) {
        return i * 120 + 70 + 'px'
      } else {
        return i * 120 + 20 + 'px'
      }
    },
    getNumberCellBgc(num) {
      switch (num) {
        case 2:
          return '#eee4da'
        case 4:
          return '#ede078'
        case 8:
          return '#f2b179'
        case 16:
          return '#f59563'
        case 32:
          return '#f67c5f'
        case 64:
          return '#f65e3b'
        case 128:
          return '#edcf72'
        case 256:
          return '#edcc61'
        case 512:
          return '#9c0'
        case 1024:
          return '#33b5e5'
        case 2048:
          return '#09c'
        case 4096:
          return '#a6c'
        case 8192:
          return '#93c'
      }
      return 'black'
    },
    getLength(num) {
      if (num === 0) {
        return 0
      }
      return 100 + 'px'
    },
    getNumberColor(num) {
      if (num <= 4) {
        return '#776e65'
      }
      return 'white'
    },
    // 初始化
    init() {
      this.gridCellList = []
      this.numberCellList = []
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          // 初始化背景格子
          var obj = { i, j }
          this.gridCellList.push(obj)
          // console.log(obj)

          // 初始化数字
          var obj2 = { i, j, num: 0, hasConflicted: false }
          this.numberCellList.push(obj2)
        }
      }
      this.score = 0
      // console.log(this.numberCellList)
      this.generateOneNumber()
      this.generateOneNumber()
    },

    newGame() {
      this.init()
    },
    // 判断是否有空位
    nospace() {
      return this.numberCellList.every(item => item.num !== 0)
    },
    // 随机位置生成一个随机数
    generateOneNumber() {
      // 判断是否有空位
      if (!this.nospace()) {
        // 随机一个位置
        var index = Math.floor(Math.random() * 16)
        //  为了防止循环多次都得不到想要的空位,标记循环的次数
        var times = 0
        while (times < 50) {
          if (this.numberCellList[index].num === 0) break
          index = Math.ceil(Math.random() * 16)
          times++
        }
        if (times === 50) {
          for (var i = 0; i < 16; i++) {
            if (this.numberCellList[i].num === 0) {
              index = i
            }
          }
        }
        var numberCell = this.numberCellList[index]
        numberCell.num = Math.random() > 0.5 ? 4 : 2
        // console.log(index, this.numberCellList[index])
        this.showNumberCell(numberCell)
      }
    },
    // 提供  显示的动画
    showNumberCell(cell) {
      console.log(cell)
      // 没有这个animate 方法
      const numberCell = document.getElementById(`#number_cell_${cell.i}_${cell.j}`)
      numberCell.animate([{ width: '100px', height: '100px' }], { duration: 200 })
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
.grid_container {
  width: 500px;
  height: 500px;
  position: relative;
  margin: 20px auto;
  background-color: #bbada0;
  border-radius: 10px;
  .grid_cell {
    width: 100px;
    height: 100px;
    background-color: #ccc0b3;
    border-radius: 8px;
    position: absolute;
  }
  .number_cell {
    position: absolute;
    font-size: 60px;
    line-height: 100px;
    text-align: center;
    font-weight: bold;
    border-radius: 8px;
  }
}
</style>

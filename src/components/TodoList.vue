
<template>
  <div class="main_content">
    <h2>今日事今日毕</h2>
    <el-row type="flex" justify="center">
      <el-col :span="8">
        <el-input placeholder="今天打算做点什么提升自己" v-model="todoText" clearable>
          <el-button slot="append" icon="el-icon-right" @click="addTodoItem"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-card class="todolist">
      <div class="doingBox">
        <h3>正在进行</h3>
        <ol>
          <li v-for="(item, index) in doingList" :key="index">
            <input type="checkbox" :checked="item.done" />
            {{item.title}}
            <span>x</span>
          </li>
        </ol>
      </div>

      <div class="doneBox">
        <h3>已经完成</h3>
        <ol>
          <li v-for="(item, index) in doneList" :key="index">
            <input type="checkbox" :checked="item.done" />
            {{item.title}}
            <span>x</span>
          </li>
        </ol>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todoText: '',
      doingList: [],
      doneList: []
    }
  },
  created() {
    this.getTodoList()
  },
  methods: {
    // 获取保存在本地的列表数据
    getTodoList() {
      var data = window.localStorage.getItem('todoList')
      if (data === null) {
        this.doingList = []
        this.doneList = []
        data = []
      } else {
        data = JSON.parse(data)
        this.doingList = data.filter(item => item.done === false)
        this.doneList = data.filter(item => item.done === true)
      }
      return data
    },
    addTodoItem() {
      if (this.todoText.trim().length === 0) {
        return this.$message.info('请输入要完成的事后再提交')
      } else {
        var data = this.getTodoList()
        console.log(this.todoText)
        console.log(data)

        data.push({ title: this.todoText, done: false })
        this.saveList(data)
        this.getTodoList()
        this.todoText = ''
      }
    },
    saveList(data) {
      window.localStorage.setItem('todoList', JSON.stringify(data))
    }
  }
}
</script>

<style lang="less" scoped>
h2 {
  text-align: center;
  padding-top: 20px;
  margin-bottom: 20px;
}
.el-input {
  border-radius: 10px;
}
.todolist {
  margin-top: 20px;
  padding: 20px;
}
.doingBox,
.doneBox {
  margin: 20px;
}
</style>

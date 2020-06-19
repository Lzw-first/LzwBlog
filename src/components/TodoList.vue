<template>
  <div class="main_content">
    <h1>今日事今日毕</h1>
    <el-row type="flex" justify="center">
      <el-col :span="8">
        <el-input
          placeholder="今天打算做点什么提升自己"
          v-model="todoText"
          clearable
          @keyup.enter.native="addTodoItem"
        >
          <el-button slot="append" icon="el-icon-right" @click="addTodoItem"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-card class="todolist">
      <div class="doingBox" :style="{display: isShowDoingBox}">
        <h2>
          正在进行
          <span>{{doingList.length}}</span>
        </h2>

        <ol>
          <li v-for="item in doingList" :key="item.id">
            <input type="checkbox" :checked="item.done" @change="changeCheckBox(item.id)" />
            <p>{{ item.title }}</p>
            <span @click="removeTask(item.id)">
              <i class="el-icon-circle-close"></i>
            </span>
          </li>
        </ol>
      </div>

      <div class="doneBox" :style="{display: isShowDoneBox}">
        <h2>
          已经完成
          <span>{{doneList.length}}</span>
        </h2>

        <ol>
          <li v-for="item in doneList" :key="item.id">
            <input type="checkbox" :checked="item.done" @change="changeCheckBox(item.id)" />
            <p>{{ item.title }}</p>
            <span @click="removeTask(item.id)">
              <i class="el-icon-circle-close"></i>
            </span>
          </li>
        </ol>
      </div>
      <el-row class="btnList">
        <el-button type="info" plain size="mini" @click="showAll">查看全部任务</el-button>
        <el-button type="info" plain size="mini" @click="justShowDoing">只看正在进行的任务</el-button>
        <el-button type="info" plain size="mini" @click="justShowDone">只看已完成的任务</el-button>
        <el-button type="info" plain size="mini" @click="removeAll">清空所有任务</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todoText: '',
      doingList: [],
      doneList: [],
      isShowDoingBox: 'block',
      isShowDoneBox: 'block'
    };
  },
  created() {
    this.getTodoList();
  },
  methods: {
    // 获取保存在本地的列表数据
    getTodoList() {
      var data = window.localStorage.getItem('todoList');
      if (data === null) {
        this.doingList = [];
        this.doneList = [];
        data = [];
      } else {
        data = JSON.parse(data);
        this.doingList = [];
        this.doneList = [];
        data.forEach((item, index) => {
          item.id = index;
          if (item.done) {
            this.doneList.push(item);
          } else {
            this.doingList.push(item);
          }
        });
      }
      this.doneList.reverse();
      this.doingList.reverse();

      return data;
    },
    addTodoItem() {
      if (this.todoText.trim().length === 0) {
        return this.$message.info('请输入要完成的事后再提交');
      } else {
        var data = this.getTodoList();

        data.push({ title: this.todoText, done: false });
        this.saveList(data);

        this.getTodoList();
        this.todoText = '';
      }
    },
    saveList(data) {
      window.localStorage.setItem('todoList', JSON.stringify(data));
    },
    // keyAddTodoItem(e) {
    //   console.log(e.target)

    //   if (e.target.keycode === 13) {
    //     this.addTodoItem()
    //   }
    // },
    removeTask(index) {
      var data = this.getTodoList();
      data.splice(index, 1);
      this.saveList(data);
      this.getTodoList();
    },
    // 点击
    changeCheckBox(id) {
      var data = this.getTodoList();

      data[id].done = !data[id].done;
      console.log(data[id]);
      console.log(data);

      this.saveList(data);
      this.getTodoList();
    },
    // 显示所有任务
    showAll() {
      this.isShowDoneBox = 'block';
      this.isShowDoingBox = 'block';
    },
    // 只显示正在进行的
    justShowDoing() {
      this.isShowDoneBox = 'none';
      this.isShowDoingBox = 'block';
    },
    // 只显示完成的
    justShowDone() {
      this.isShowDoneBox = 'block';
      this.isShowDoingBox = 'none';
    },
    // 清空所有任务
    removeAll() {
      var data = [];
      this.saveList(data);
      this.getTodoList();
    }
  }
};
</script>

<style lang="less" scoped>
h1 {
  text-align: center;
  font-size: 25px;
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
  ol {
    margin-top: 10px;
  }
  li {
    display: flex;
    align-items: center;
    width: 100%;
    height: 25px;
    line-height: 25px;
    margin: 10px 0;
    > p {
      padding: 0 20px;
      font-size: 18px;
    }
    span {
      cursor: pointer;
    }
    input {
      border-radius: 50%;
    }
  }
}
h2 {
  position: relative;
  span {
    position: absolute;
    display: block;
    min-width: 15px;
    height: 15px;
    font-size: 10px;
    line-height: 15px;
    text-align: center;
    color: #fff;
    top: -5px;
    left: 80px;
    background-color: red;
    border-radius: 50% 50% 50% 0;
  }
}
.btnList {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15;
}
</style>

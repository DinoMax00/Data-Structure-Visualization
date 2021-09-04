<template>
  <el-row  style="height: 8%">
    <el-col :span='24'>
      <el-page-header icon="el-icon-arrow-left" @back="goBack" content="B-Tree"></el-page-header>
    </el-col>
  </el-row>
  <el-row style="height: 92%">
    <!-- 侧边栏 -->
    <el-col :span="6">
      <div class="subwindow menu-color">
        <div class="block" style="padding-bottom: 0px;padding-top: 15px;">
          <h1 class="title">🛫 B- Tree Visulation 🛫</h1>
          <p>A 3-order b-tree, which supports insert, delete and query operation.</p>
        </div>
        <div class="block" style="padding-top: 10px;">
          <div class="demonstration">Insert A Number:</div>
          <el-input v-model="insertVal" placeholder="Press Enter to confirm" @keydown.enter='insert()'></el-input>
        </div>
        <div class="block">
          <div class="demonstration">Delete A Number:</div>
          <el-input v-model="deleteVal" placeholder="Press Enter to confirm" @keydown.enter='del()'></el-input>
        </div>
        <div class="block">
          <div class="demonstration">Find A Number:</div>
          <el-input v-model="findVal" placeholder="Press Enter to confirm" @keydown.enter='find()'></el-input>
        </div>
          <div style="text-align: center;">
            <img :src="logoUrl"/>
            <footer>CS10016502. TongJi Univ</footer>
          </div>
      </div>
    </el-col>
    <!-- svg -->
    <el-col :span="18">
        <div class="subwindow" id = 'svg-here'>
          <!-- <svg id="svg" width="100%" height="100%"></svg> -->
        </div>
    </el-col>
  </el-row>
</template>

<script>
import { onMounted, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { Tree } from '../bTree'
import { ElNotification } from 'element-plus'
import * as d3 from 'd3'
export default {
  setup () {
    let tree
    const logoUrl = require('../assets/logo.png')

    const router = useRouter()

    const goBack = () => {
      router.push('/')
    }

    onMounted(() => {
      d3.select('svg').remove()
      d3.select('#svg-here').append('svg').attr('id', 'svg').attr('height', '100%').attr('width', '100%')
      tree = new Tree()
    })

    const val = ref(4)
    const insertVal = ref('')
    const deleteVal = ref('')
    const findVal = ref('')

    const judgeNum = (n) => {
      if (isNaN(n) || n < -99 || n > 99) {
        ElNotification.error({
          title: 'Invalid Input!',
          message: h(
            'i',
            { style: 'color: black' },
            'the number must in range [-99, 99]'
          )
        })
        return false
      }
      return true
    }

    const insert = () => {
      const n = parseInt(insertVal.value)
      insertVal.value = ''
      if (!judgeNum(n)) return
      tree.insert(n)
    }

    const del = () => {
      const n = parseInt(deleteVal.value)
      deleteVal.value = ''
      if (!judgeNum(n)) return
      tree.delete(n)
    }

    const find = () => {
      const n = parseInt(findVal.value)
      findVal.value = ''
      if (!judgeNum(n)) return
      tree.search(n, true)
    }

    return {
      insert,
      del,
      goBack,
      find,
      findVal,
      deleteVal,
      insertVal,
      logoUrl,
      val
    }
  }
}
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 20px;
}

.el-page-header{
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 400%;
    height: 100%;
}

.subwindow {
  box-sizing: border-box;
  height: 100%;
  border-left: 5px solid #DCDFE6;
  border-right: 5px solid #DCDFE6;
  border-top: 8px solid #DCDFE6;
}

.demonstration {
  padding-bottom: 15px;
}

.block {
  margin-left: 5%;
  padding-top: 23px;
  padding-bottom: 23px;
  width: 90%;
  border-bottom: 1px solid black;
}

img {
  margin: 0 auto;
  padding-top: 15px;
  height: 160px;
  width: 160px;
}

</style>

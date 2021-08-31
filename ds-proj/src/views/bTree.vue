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
        <div class="subwindow" >
          <svg id="svg" width="100%" height="100%"></svg>
        </div>
    </el-col>
  </el-row>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// import * as d3 from 'd3'
import { Tree } from '../bTree'

export default {
  setup () {
    let tree
    const logoUrl = require('../assets/logo.png')

    const router = useRouter()

    const goBack = () => {
      tree.insert(5)
      router.push('/')
    }

    onMounted(() => {
      // const svg = d3.selectAll('svg')
      // const zoomHandler = d3.zoom()
      //   .on('zoom', zoomActions)
      // zoomHandler(svg)
      // function zoomActions () {
      //   svg.attr('transform', d3.event.transform)
      // }
      tree = new Tree()
    })

    const val = ref(4)
    const insertVal = ref('')
    const deleteVal = ref('')
    const findVal = ref('')

    const insert = () => {
      tree.insert(parseInt(insertVal.value))
      insertVal.value = ''
    }

    const del = () => {
      tree.delete(parseInt(deleteVal.value))
      deleteVal.value = ''
    }

    const find = () => {
      tree.search(parseInt(findVal.value))
      findVal.value = ''
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

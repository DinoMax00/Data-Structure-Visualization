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
        <div class="block">
          <div class="demonstration">Max Depth:</div>
          <el-slider
            v-model="val"
            :step="1"
            :min = "3"
            :max = "7"
            show-stops
            show-input>
          </el-slider>
        </div>
        <div class="block">
          <div class="demonstration">Insert A Number:</div>
          <el-input v-model="input" placeholder="Press Enter to confirm"></el-input>
        </div>
        <div class="block">
          <div class="demonstration">Delete A Number:</div>
          <el-input v-model="input" placeholder="Press Enter to confirm"></el-input>
        </div>
        <div class="block">
          <div class="demonstration">Find A Number:</div>
          <el-input v-model="input" placeholder="Press Enter to confirm"></el-input>
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

import { Tree } from '../bTree'
export default {
  setup () {
    const logoUrl = require('../assets/logo.png')

    const router = useRouter()

    const goBack = () => {
      router.push('/')
    }

    onMounted(() => {
      console.log('ready')
      const tree = new Tree()
      const a = [1, 2, 3, 5, 6, 7, 8]
      for (const i of a) {
        tree.insert(i)
      }
      tree.delete(5)
      tree.delete(7)
      tree.delete(6)
      tree.delete(3)
      tree.delete(8)
      tree.delete(2)
      tree.delete(1)
      console.log('---del---')
      tree.print()
    })

    const val = ref(4)

    return {
      logoUrl,
      val,
      goBack
    }
  }
}
</script>

<style scoped>

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
  border-left: 2px solid #DCDFE6;
  border-right: 2px solid #DCDFE6;
  border-top: 4px solid #DCDFE6;
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
  height: 175px;
  width: 175px;
}
</style>

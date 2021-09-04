<template>
  <div class="home">
    <img src="../assets/logo.png" style="size:80%">
    <p> A Data Structure Visulization Exercise </p>
    <p style="font-size:20px">CS10016502. TongJi Univ</p>

    <el-button type='primary' round icon="el-icon-position" @click="gotoBT">&nbsp;&nbsp;B&nbsp;- 树&nbsp;&nbsp;</el-button>
    &nbsp;&nbsp;&nbsp;
    <el-button type='primary' round icon="el-icon-view" @click="gotoChain">文本编辑器</el-button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  setup () {
    const router = useRouter()

    const gotoBT = () => {
      router.push('/bTree')
    }

    const gotoChain = () => {
      router.push('/Editor')
    }

    return {
      gotoBT,
      gotoChain
    }
  }
}

</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 12%;
}

p {
  color: white;
  font-size: 30px;
}

img {
  size: 70px;
}
</style>

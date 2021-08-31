<template>
  <el-row  style="height: 8%">
    <el-col :span='24'>
      <el-page-header icon="el-icon-arrow-left" @back="goBack" content="Chain"></el-page-header>
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

import * as d3 from 'd3'
export default {
  setup () {
    const logoUrl = require('../assets/logo.png')

    const router = useRouter()

    const goBack = () => {
      router.push('/')
    }

    onMounted(() => {
      const svg = d3.select('svg').append('g')
      const width = document.getElementById('svg').getBoundingClientRect().width / 3 * 2
      const height = document.getElementById('svg').getBoundingClientRect().height / 3 * 2
      // 准备数据
      var nodes = [// 节点集
        { name: '湖南邵阳' },
        { name: '山东莱州' },
        { name: '广东阳江' },
        { name: '山东枣庄' },
        { name: '泽' },
        { name: '恒' },
        { name: '鑫' },
        { name: '明山' },
        { name: '班长' }
      ]

      var edges = [// 边集
        { source: 0, target: 4, relation: '籍贯', value: 1.3 },
        { source: 4, target: 5, relation: '舍友', value: 1 },
        { source: 4, target: 6, relation: '舍友', value: 1 },
        { source: 4, target: 7, relation: '舍友', value: 1 },
        { source: 1, target: 6, relation: '籍贯', value: 2 },
        { source: 2, target: 5, relation: '籍贯', value: 0.9 },
        { source: 3, target: 7, relation: '籍贯', value: 1 },
        { source: 5, target: 6, relation: '同学', value: 1.6 },
        { source: 6, target: 7, relation: '朋友', value: 0.7 },
        { source: 6, target: 8, relation: '职责', value: 2 }
      ]
      const colorScale = d3.scaleOrdinal().domain(nodes.length).range(d3.schemeCategory10)
      var forceSimulation = d3.forceSimulation()
        .force('link', d3.forceLink())
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter())

      forceSimulation.nodes(nodes)
        .on('tick', ticked)// 这个函数很重要，后面给出具体实现和说明
      // 生成边数据
      forceSimulation.force('link')
        .links(edges)
        .distance(function (d) { // 每一边的长度
          return d.value * 100
        })
      forceSimulation.force('center')
        .x(width / 2)
        .y(height / 2)

      const links = svg.append('g')
        .selectAll('line')
        .data(edges)
        .enter()
        .append('line')
        .attr('stroke', (d, i) => colorScale(i))
        .attr('stroke-width', 1)

      var gs = svg.selectAll('what')
        .data(nodes)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          var cirX = d.x
          var cirY = d.y
          return 'translate(' + cirX + ',' + cirY + ')'
        })
        .call(d3.drag()
          .on('start', (d) => {
            if (!d3.event.active) {
              forceSimulation.alphaTarget(1).restart()
            }
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (d) => {
            d.fx = d3.event.x
            d.fy = d3.event.y
          })
          .on('end', (d) => {
            if (!d3.event.active) {
              forceSimulation.alphaTarget(0)
            }
            d.fx = null
            d.fy = null
          }))

      gs.append('rect')
        .attr('x', -5)
        .attr('y', -5)
        .attr('width', 10)
        .attr('height', 30)
        .attr('color', (d, i) => colorScale(i))

      function ticked () {
        links
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)

        gs
          .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
      }
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
  background-color:aliceblue;
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

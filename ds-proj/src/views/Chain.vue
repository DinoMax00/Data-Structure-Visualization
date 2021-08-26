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
      // create somewhere to put the force directed graph
      const svg = d3.select('svg')
      const width = document.getElementById('svg').getBoundingClientRect().width
      const height = document.getElementById('svg').getBoundingClientRect().height
      const radius = 15
      const nodesData = [
        { name: 'Lillian', sex: 'F' },
        { name: 'Gordon', sex: 'M' },
        { name: 'Sylvester', sex: 'M' },
        { name: 'Mary', sex: 'F' },
        { name: 'Helen', sex: 'F' },
        { name: 'Jamie', sex: 'M' },
        { name: 'Jessie', sex: 'F' },
        { name: 'Ashton', sex: 'M' },
        { name: 'Duncan', sex: 'M' },
        { name: 'Evette', sex: 'F' },
        { name: 'Mauer', sex: 'M' },
        { name: 'Fray', sex: 'F' },
        { name: 'Duke', sex: 'M' },
        { name: 'Baron', sex: 'M' },
        { name: 'Infante', sex: 'M' },
        { name: 'Percy', sex: 'M' },
        { name: 'Cynthia', sex: 'F' },
        { name: 'Feyton', sex: 'M' },
        { name: 'Lesley', sex: 'F' },
        { name: 'Yvette', sex: 'F' },
        { name: 'Maria', sex: 'F' },
        { name: 'Lexy', sex: 'F' },
        { name: 'Peter', sex: 'M' },
        { name: 'Ashley', sex: 'F' },
        { name: 'Finkler', sex: 'M' },
        { name: 'Damo', sex: 'M' },
        { name: 'Imogen', sex: 'F' }
      ]
      // Sample links data
      // type: A for Ally, E for Enemy
      const linksData = [
        { source: 'Sylvester', target: 'Gordon', type: 'A' },
        { source: 'Sylvester', target: 'Lillian', type: 'A' },
        { source: 'Sylvester', target: 'Mary', type: 'A' },
        { source: 'Sylvester', target: 'Jamie', type: 'A' },
        { source: 'Sylvester', target: 'Jessie', type: 'A' },
        { source: 'Sylvester', target: 'Helen', type: 'A' },
        { source: 'Helen', target: 'Gordon', type: 'A' },
        { source: 'Mary', target: 'Lillian', type: 'A' },
        { source: 'Ashton', target: 'Mary', type: 'A' },
        { source: 'Duncan', target: 'Jamie', type: 'A' },
        { source: 'Gordon', target: 'Jessie', type: 'A' },
        { source: 'Sylvester', target: 'Fray', type: 'E' },
        { source: 'Fray', target: 'Mauer', type: 'A' },
        { source: 'Fray', target: 'Cynthia', type: 'A' },
        { source: 'Fray', target: 'Percy', type: 'A' },
        { source: 'Percy', target: 'Cynthia', type: 'A' },
        { source: 'Infante', target: 'Duke', type: 'A' },
        { source: 'Duke', target: 'Gordon', type: 'A' },
        { source: 'Duke', target: 'Sylvester', type: 'A' },
        { source: 'Baron', target: 'Duke', type: 'A' },
        { source: 'Baron', target: 'Sylvester', type: 'E' },
        { source: 'Evette', target: 'Sylvester', type: 'E' },
        { source: 'Cynthia', target: 'Sylvester', type: 'E' },
        { source: 'Cynthia', target: 'Jamie', type: 'E' },
        { source: 'Mauer', target: 'Jessie', type: 'E' },
        { source: 'Duke', target: 'Lexy', type: 'A' },
        { source: 'Feyton', target: 'Lexy', type: 'A' },
        { source: 'Maria', target: 'Feyton', type: 'A' },
        { source: 'Baron', target: 'Yvette', type: 'E' },
        { source: 'Evette', target: 'Maria', type: 'E' },
        { source: 'Cynthia', target: 'Yvette', type: 'E' },
        { source: 'Maria', target: 'Jamie', type: 'E' },
        { source: 'Maria', target: 'Lesley', type: 'E' },
        { source: 'Ashley', target: 'Damo', type: 'A' },
        { source: 'Damo', target: 'Lexy', type: 'A' },
        { source: 'Maria', target: 'Feyton', type: 'A' },
        { source: 'Finkler', target: 'Ashley', type: 'E' },
        { source: 'Sylvester', target: 'Maria', type: 'E' },
        { source: 'Peter', target: 'Finkler', type: 'E' },
        { source: 'Ashley', target: 'Gordon', type: 'E' },
        { source: 'Maria', target: 'Imogen', type: 'E' }
      ]
      // set up the simulation and add forces
      const simulation = d3.forceSimulation()
        .nodes(nodesData)
      const linkForce = d3.forceLink(linksData)
        .id(function (d) { return d.name })
      const chargeForce = d3.forceManyBody()
        .strength(-100)
      const centerForce = d3.forceCenter(width / 2, height / 2)
      simulation
        .force('chargeForce', chargeForce)
        .force('centerForce', centerForce)
        .force('links', linkForce)
      // add tick instructions:
      simulation.on('tick', tickActions)
      // add encompassing group for the zoom
      const g = svg.append('g')
        .attr('class', 'everything')
      // draw lines for the links
      const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(linksData)
        .enter().append('line')
        .attr('stroke-width', 2)
        .style('stroke', linkColour)
      // draw circles for the nodes
      const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(nodesData)
        .enter()
        .append('circle')
        .attr('r', radius)
        .attr('fill', circleColour)
      // add drag capabilities
      const dragHandler = d3.drag()
        .on('start', dragStart)
        .on('drag', dragDrag)
        .on('end', dragEnd)
      dragHandler(node)
      // add zoom capabilities
      const zoomHandler = d3.zoom()
        .on('zoom', zoomActions)
      zoomHandler(svg)
      /** Functions **/
      // Function to choose what color circle we have
      // Let's return blue for males and red for females
      function circleColour (d) {
        if (d.sex === 'M') {
          return 'blue'
        } else {
          return 'pink'
        }
      }
      // Function to choose the line colour and thickness
      // If the link type is 'A' return green
      // If the link type is 'E' return red
      function linkColour (d) {
        if (d.type === 'A') {
          return 'green'
        } else {
          return 'red'
        }
      }
      // Drag functions
      // d is the node
      function dragStart (d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }
      // make sure you can't drag the circle outside the box
      function dragDrag (d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }
      function dragEnd (d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }
      // Zoom functions
      function zoomActions () {
        g.attr('transform', d3.event.transform)
      }
      function tickActions () {
      // update circle positions each tick of the simulation
        node
          .attr('cx', function (d) { return d.x })
          .attr('cy', function (d) { return d.y })
        // update link positions
        link
          .attr('x1', function (d) { return d.source.x })
          .attr('y1', function (d) { return d.source.y })
          .attr('x2', function (d) { return d.target.x })
          .attr('y2', function (d) { return d.target.y })
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

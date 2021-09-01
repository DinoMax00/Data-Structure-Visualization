import * as d3 from 'd3'

const DIS_Y = 140
const DIS_X = 50
const RECT_W = 100
const RECT_H = 50
const DELAY = 1500

function getPos (depth, idx, tot) {
  const width = document.getElementById('svg').getBoundingClientRect().width
  // const height = document.getElementById('svg').getBoundingClientRect().height
  const len = RECT_W * tot + DIS_X * (tot - 1)
  const lft = (width - len) / 2
  return [lft + (idx - 1) * (RECT_W + DIS_X), (depth - 1) * DIS_Y + 90]
}

export class Visuer {
  static initNode (p, id) {
    const svg = d3.select('svg')
    const par = svg.select('#g' + p)
    svg
      .append('g')
      .attr('id', 'g' + id)
      .attr('transform', par.attr('transform'))
  }

  static drawLine (src, tgt, depth) {
    const id = 'e' + src.id + 'to' + tgt.id
    const svg = d3.select('svg')
    const [x1, y1] = getPos(depth, src.idx, src.tot)
    const [x2, y2] = getPos(depth + 1, tgt.idx, tgt.tot)
    svg.append('line')
      .attr('id', id)
      .attr('x1', x1 + RECT_W / 2)
      .attr('y1', y1 + RECT_H / 2)
      .attr('x2', x1 + RECT_W / 2)
      .attr('y2', y1 + RECT_H / 2)
      .transition().duration(DELAY)
      .attr('x1', x1 + RECT_W / 2)
      .attr('y1', y1 + RECT_H / 2)
      .attr('x2', x2 + RECT_W / 2)
      .attr('y2', y2 + RECT_H / 2)
      .attr('class', 'edge')
  }

  static removeLine (src, tgt) {
    const id = '#e' + src + 'to' + tgt
    if (!document.getElementById('e' + src + 'to' + tgt)) {
      return
    }
    const svg = d3.select('svg')
    const l = svg.select(id)
    l.transition()
      .duration(DELAY / 2)
      .attr('x2', l.attr('x1'))
      .attr('y2', l.attr('y1'))
      .remove()
  }

  static removeNode (id) {
    const svg = d3.select('svg')
    const g = svg.select('#g' + id)
    const ans = g.attr('transform')
    g.remove()
    return ans
  }

  static updateNode (id, depth, idx, tot, key) {
    const svg = d3.select('svg')
    const [X, Y] = getPos(depth, idx, tot)
    let prePos = 'translate(' + X + ',' + Y + ')'
    if (document.getElementById('g' + id)) {
      prePos = this.removeNode(id)
    }
    const g = svg
      .append('g')
      .attr('id', 'g' + id)
      .attr('transform', prePos)

    g.append('rect')
      .attr('width', RECT_W)
      .attr('height', RECT_H)
      .attr('class', 'block_border')

    g.append('rect')
      .attr('id', 'rect' + id)
      .attr('x', 6)
      .attr('y', 6)
      .attr('width', RECT_W - 12)
      .attr('height', RECT_H - 12)
      .attr('class', 'block_node')

    g.append('text')
      .attr('id', 'text' + id)
      .attr('y', 36)
      .attr('x', key.length === 1 ? 40 : key.length === 4 ? 18 : key.length >= 5 ? 5 : 26)
      .text(key)
    g.transition().duration(DELAY).attr('transform', 'translate(' + X + ',' + Y + ')')
    g.select('text').transition().duration(DELAY).text(key)
  }

  static updateLine (src, tgt, depth) {
    const id = '#' + 'e' + src.id + 'to' + tgt.id

    if (!document.getElementById('e' + src.id + 'to' + tgt.id)) {
      this.drawLine(src, tgt, depth)
      return
    }

    const svg = d3.select('svg')
    const [x1, y1] = getPos(depth, src.idx, src.tot)
    const [x2, y2] = getPos(depth + 1, tgt.idx, tgt.tot)
    const g = svg.select(id)
    g
      .transition().duration(DELAY)
      .attr('x1', x1 + RECT_W / 2)
      .attr('y1', y1 + RECT_H / 2)
      .attr('x2', x2 + RECT_W / 2)
      .attr('y2', y2 + RECT_H / 2)
  }

  static showTrace (arr) {
    const len = arr.length
    const svg = d3.select('svg')
    for (let i = 0; i < len - 1; ++i) {
      const id = '#rect' + arr[i].id
      svg.select(id)
        .transition()
        .delay(DELAY * i)
        .attr('class', 'block_node_trace')
        .transition()
        .delay(DELAY * 2 - 500)
        .attr('class', 'block_node')
    }

    for (let i = 0; i < len - 2; ++i) {
      const id = '#e' + arr[i].id + 'to' + arr[i + 1].id
      svg.select(id)
        .transition()
        .delay(DELAY * (i + 1))
        .attr('class', 'edge_trace')
        .transition()
        .delay(DELAY - 500)
        .attr('class', 'edge')
    }
    const id = '#rect' + arr[len - 2].id
    svg.select(id)
      .transition()
      .delay(DELAY * (len - 1))
      .attr('class', arr[len - 1] ? 'block_node_success' : 'block_node_fall')
      .transition()
      .delay(DELAY * 2)
      .attr('class', 'block_node')
  }

  delete (id) {
    const svg = d3.select('svg')
    svg.select('g' + id).remove()
  }
}

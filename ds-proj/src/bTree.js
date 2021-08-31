// 实现3阶b-树 附带可视化
import { Visuer } from './bTreeVisu'
const MIN_KEY = 1
const MAX_KEY = 2
let id = 0
const xNum = []
const nodeDepth = []
const nodeIdx = []
class BTnode {
  constructor () {
    this.keys = []
    this.childs = []
    this.par = null
    this.n = 0
    this.id = ++id
  }

  // 控制台输出
  printTree () {
    console.log('cur', this.keys)
    console.log('par', this.par.keys)
    console.log('???', this.par.childs)
    console.log('----')
    for (let i = 0; i < this.childs.length; ++i) this.childs[i].printTree()
  }

  // 查找
  // trace记录搜索过程，用于可视化
  search (trace, val) {
    trace.push(this)

    let i = 0
    while (i < this.n && this.keys[i] < val) { ++i }
    if (i < this.n && this.keys[i] === val) {
      trace.push(true)
      return
    }

    if (this.childs.length === 0) {
      trace.push(false)
      return
    }

    this.childs[i].search(trace, val)
  }

  // 插入
  // pos是当前节点在父节点childs中的索引
  insert (val) {
    let i = 0
    while (i < this.n && this.keys[i] < val) { ++i }
    if (i < this.n && this.keys[i] === val) { return }

    if (this.childs.length) {
      this.childs[i].insert(val)
      return
    }

    this.keys.push(val)
    this.keys.sort((a, b) => a - b)
    this.n++
    if (this.n <= MAX_KEY) { return }
    this.splitChild()
    this.printTree()
  }

  // 删除操作
  // 策略是使用目标值左侧最大的数将其替换
  delete (val) {
    let idx = 0
    for (let i = 0; i < this.n; ++i) {
      if (this.keys[i] === val) {
        idx = i
        break
      }
    }
    if (this.childs.length === 0) {
      this.n--
      this.keys.splice(idx, 1)
      this.reBalance()
      return
    }
    const trace = []
    this.childs[idx].search(trace, val)
    const maxNode = trace.slice(-2)[0]
    this.keys[idx] = maxNode.keys.slice(-1)[0]
    maxNode.keys.pop()
    maxNode.n--
    console.log(this, maxNode)
    if (val === 0) return
    maxNode.reBalance()
  }

  // 分裂节点
  // 自下向上
  splitChild () {
    const x = this.par
    const z = new BTnode()
    const mid = this.keys[MIN_KEY]
    const leaf = (this.childs.length === 0)

    let pos
    for (let i = 0; i < x.childs.length; ++i) {
      if (this === x.childs[i]) {
        pos = i
        break
      }
    }
    x.keys.splice(pos, 0, mid)
    x.n++

    for (let i = MIN_KEY + 1; i < this.n; ++i) {
      z.keys.push(this.keys[i])
      if (!leaf) {
        z.childs.push(this.childs[i])
        Visuer.removeLine(this.childs[i].par.id, this.childs[i].id)
        this.childs[i].par = z
      }
    }
    if (!leaf) {
      Visuer.removeLine(this.childs[this.n].par.id, this.childs[this.n].id)
      z.childs.push(this.childs[this.n])
      this.childs[this.n].par = z
    }
    z.n = MAX_KEY - MIN_KEY
    z.par = x
    console.log(x)
    Visuer.initNode(x.par === null ? this.id : x.id, z.id)
    x.childs.splice(pos + 1, 0, z)
    this.n = MIN_KEY
    this.keys.splice(MIN_KEY)
    this.childs.splice(MIN_KEY + 1)
    if (x.n > MAX_KEY) x.splitChild()
  }

  // 平衡节点
  reBalance () {
    if (this.n >= MIN_KEY) return
    if (this.par.keys.length === 0) {
      if (this.childs.length === 0) return
      const temp = this.childs[0]
      console.log(temp.id, temp.childs.length)
      for (const child of temp.childs) Visuer.removeLine(temp.id, child.id)
      Visuer.removeLine(this.id, this.childs[0].id)
      Visuer.removeNode(this.childs[0].id)
      this.childs = temp.childs
      this.keys = temp.keys
      this.n = temp.n
      return
    }
    const par = this.par
    const idx = par.findIdx(this)
    const bro = idx ? par.childs[idx - 1] : par.childs[idx + 1]
    if (idx === 0) {
      this.keys.push(par.keys[0])
      if (bro.n > MIN_KEY) {
        par.keys[0] = bro.keys[0]
        bro.keys.splice(0, 1)
        bro.n--
        // !!!!
        if (bro.childs.length > bro.n + 1) {
          Visuer.removeLine(bro.id, bro.childs[0].id)
          this.childs.push(bro.childs[0])
          bro.childs[0].par = this
          bro.childs.splice(0, 1)
        }
      } else {
        Visuer.removeLine(bro.par.id, bro.id)
        this.mergeRhs(bro)
        Visuer.removeNode(bro.id)
        par.childs.splice(1, 1)
        par.keys.splice(0, 1)
        par.n--
        if (par.n === 0) {
          par.reBalance()
        }
      }
    } else {
      const pn = idx
      const bn = bro.n
      this.keys.push(par.keys[pn - 1])
      if (bro.n > MIN_KEY) {
        par.keys[pn - 1] = bro.keys[bn - 1]
        bro.keys.splice(bn - 1, 1)
        bro.n--
        if (bro.childs.length > bro.n + 1) {
          const tmp = bro.n
          Visuer.removeLine(bro.id, bro.childs[tmp].id)
          this.childs.push(bro.childs[tmp])
          bro.childs[tmp].par = this
          bro.childs.splice(tmp, 1)
        }
      } else {
        Visuer.removeLine(bro.par.id, bro.id)
        this.mergeLhs(bro)
        Visuer.removeNode(bro.id)
        par.childs.splice(bn - 1, 1)
        par.keys.splice(pn - 1, 1)
        par.n--
        if (par.n === 0) {
          par.reBalance()
        }
      }
    }
  }

  // 与右结点合并
  mergeRhs (node) {
    for (const val of node.keys) this.keys.push(val)
    for (const val of node.childs) {
      val.par = this.par
      this.childs.push(val)
      Visuer.removeLine(node.id, val.id)
    }
    this.n = this.keys.length
  }

  // 与左结点合并
  mergeLhs (node) {
    for (const val of node.keys) this.keys.splice(0, 0, val)
    for (const val of node.childs) {
      val.par = this.par
      this.childs.splice(0, 0, val)
      Visuer.removeLine(node.id, val.id)
    }
    this.n = this.keys.length
  }

  // 寻找子节点的下标
  findIdx (node) {
    for (let i = 0; i < this.childs.length; ++i) {
      if (this.childs[i] === node) return i
    }
  }

  // dfs 获取每层元素个数
  dfs (depth) {
    xNum[depth]++
    nodeDepth[this.id] = depth
    nodeIdx[this.id] = xNum[depth]
    for (const child of this.childs) {
      child.dfs(depth + 1)
    }
  }

  updateLine (depth) {
    const src = {
      id: this.id,
      depth: depth,
      idx: nodeIdx[this.id],
      tot: xNum[depth]
    }
    for (const child of this.childs) {
      child.updateLine(depth + 1)
      const tgt = {
        id: child.id,
        depth: depth + 1,
        idx: nodeIdx[child.id],
        tot: xNum[depth + 1]
      }
      Visuer.updateLine(src, tgt, depth)
    }
  }

  // 更新各节点位置
  updatePos (depth) {
    const id = this.id
    Visuer.updateNode(id, depth, nodeIdx[id], xNum[depth], this.keys.toString())
    for (const child of this.childs) {
      child.updatePos(depth + 1)
    }
  }
}

export class Tree {
  constructor () {
    this.clear()
  }

  makeRT () {
    this.node.par = new BTnode()
    this.node.par.childs.push(this.node)
  }

  search (val) {
    const trace = []
    this.node.search(trace, val)
    return trace
  }

  insert (val) {
    this.node.insert(val)
    if (this.node.par.keys.length) {
      this.node = this.node.par
    }
    this.makeRT()
    this.update()
    this.print()
  }

  delete (val) {
    const trace = this.search(val)
    if (!trace.slice(-1)[0]) return false
    const tar = trace.slice(-2)[0]
    tar.delete(val)
    this.update()
    this.print()
  }

  clear () {
    id = 0
    this.node = new BTnode()
    this.makeRT()
    const a = [1, 2, 3, 4, 0, 5, -1, 6, 7]
    for (const i of a) {
      this.insert(i)
    }
    this.delete(2)
    this.delete(4)
    // 删0会出问题！！！！！
  }

  update () {
    for (let i = 0; i < 10; ++i) xNum[i] = 0
    this.node.dfs(1)
    this.node.updateLine(1)
    this.node.updatePos(1)
  }

  print () {
    console.log('look!---------------')
    this.node.printTree()
  }
}

// 实现3阶b-树
const MIN_KEY = 1
const MAX_KEY = 2

class BTnode {
  constructor () {
    this.keys = []
    this.childs = []
    this.par = null
    this.n = 0
  }

  // 控制台输出
  printTree () {
    console.log('cur', this.keys)
    console.log('par', this.par.keys)
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
        this.childs[i].par = z
      }
    }
    if (!leaf) {
      z.childs.push(this.childs[this.n])
      this.childs[this.n].par = z
    }
    z.n = MAX_KEY - MIN_KEY
    z.par = x
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
      } else {
        this.mergeRhs(bro)
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
      } else {
        this.mergeLhs(bro)
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
    }
    this.n = this.keys.length
  }

  // 与左结点合并
  mergeLhs (node) {
    for (const val of node.keys) this.keys.splice(0, 0, val)
    for (const val of node.childs) this.childs.splice(0, 0, val)
    this.n = this.keys.length
  }

  // 寻找子节点的下标
  findIdx (node) {
    for (let i = 0; i < this.childs.length; ++i) {
      if (this.childs[i] === node) return i
    }
  }
}

export class Tree {
  constructor () {
    this.node = new BTnode()
    this.makeRT()
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
  }

  delete (val) {
    console.log(this.node)
    const trace = this.search(val)
    if (!trace.slice(-1)[0]) return false
    const tar = trace.slice(-2)[0]
    tar.delete(val)
  }

  clear () {
    this.node = new BTnode()
    this.makeRT()
  }

  print () {
    this.node.printTree()
  }
}

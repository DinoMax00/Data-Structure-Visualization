<template>
  <el-row style="height: 7%">
    <el-col :span="24">
      <el-page-header
        icon="el-icon-arrow-left"
        @back="goBack"
        content="Editor"
      ></el-page-header>
    </el-col>
  </el-row>
  <el-row style="height: 90%">
    <!-- 侧边栏 -->
    <el-col :span="6">
      <div class="subwindow menu-color">
        <div class="block" style="padding-bottom: 0px; padding-top: 15px">
          <h1 class="title">🛫 Markdown Editor 🛫</h1>
          <p style="text-align: center;">A dead simple Markdown editor.</p>
        </div>
        <div class="block">
          <div class="demonstration">Find:</div>
          <el-input
            v-model="ask"
            placeholder="Press Enter to confirm"
            @keydown.enter="search()"
          ></el-input>
        </div>
        <div class="block">
          <div class="demonstration">Edit:</div>
          <div style="text-align: center">
            <el-button type="primary" icon="el-icon-arrow-left" @click="ctrlZ" style="margin-right:20px">Undo</el-button>
            <el-button type="primary" @click="ctrlY" style="margin-left:20px">Redo<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </div>
        </div>
        <div style="text-align: center">
          <img :src="logoUrl" />
          <footer>CS10016502. TongJi Univ</footer>
        </div>
      </div>
    </el-col>
    <!-- md渲染页面 -->
    <el-col :span="18">
      <div class="subwindow" style="background-color: white">
        <div class="container">
          <textarea
            id="text"
            wrap="hard"
            :value="mdInput"
            @input="update"
          ></textarea>
        </div>
        <div id="showWindow" v-html="compiledMarkdown"></div>
      </div>
    </el-col>
  </el-row>
  <!-- 底部字数统计 -->
  <el-row style="height: 3%">
    <div class="footer">
      <span>&nbsp;&nbsp;🐳&nbsp;Markdown-Editor&nbsp;&nbsp;|&nbsp;</span>
      <span>
        <span class="footer-tag">{{ tot }}</span>
        bytes
      </span>
      <span>
        <span class="footer-tag">{{ alpha }}</span>
        letters
      </span>
      <span>
        <span class="footer-tag">{{ number }}</span>
        numbers
      </span>
      <span>
        <span class="footer-tag">{{ space }}</span>
        spaces
      </span>
      <span>
        <span class="footer-tag">{{ line }}</span>
        lines
      </span>
    </div>
  </el-row>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as _ from 'lodash'
import { ElNotification } from 'element-plus'

require('../lib/jquery.highlight-within-textarea.js')
require('../lib/jquery.highlight-within-textarea.css')
const myMarked = require('marked')

export default {
  setup () {
    const logoUrl = require('../assets/logo.png')
    const router = useRouter()
    const goBack = () => {
      router.push('/')
    }
    onMounted(() => {
      count()
      myMarked.setOptions({
        renderer: new myMarked.Renderer(),
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
      })
    })
    let strPre = '## Hello World! ##'
    const mdInput = ref('## Hello World! ##')
    const tot = ref(0)
    const alpha = ref(0)
    const number = ref(0)
    const space = ref(0)
    const line = ref(0)
    const ask = ref('')
    const zStack = []
    const yStack = []
    const compiledMarkdown = computed({
      get () {
        return myMarked(mdInput.value)
      }
    })
    const update = _.debounce(function (e) {
      mdInput.value = e.target.value
      count()
      push()
      yStack.splice(0)
    }, 0)

    const count = () => {
      number.value = alpha.value = space.value = tot.value = 0
      line.value = 1
      for (const i in mdInput.value) {
        const ch = mdInput.value[i]
        if (ch === '\n') {
          line.value++
          continue
        } else if (ch >= '0' && ch <= '9') number.value++
        else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) { alpha.value++ } else if (ch === ' ') space.value++
        tot.value++
      }
    }

    const push = () => {
      let a = mdInput.value
      let b = strPre
      const info = {}
      if (a.length < b.length) {
        info.del = true
        const tmp = a
        a = b
        b = tmp
      } else info.del = false
      const len = a.length
      // O(n) check
      let pre = 0
      for (; pre < len; ++pre) {
        if (a[pre] !== b[pre]) {
          break
        }
      }
      for (let i = len; i >= 0; --i) {
        const x = len - i
        if (b.length - x <= pre) {
          info.pos = b.length - x
          info.ch = a.slice(info.pos, info.pos + a.length - b.length)
          break
        }
      }
      zStack.push(info)
      strPre = mdInput.value
    }

    const withdraw = (info) => {
      count()
      const a = mdInput.value
      if (info.del) {
        mdInput.value =
          a.slice(0, info.pos) + info.ch + a.slice(info.pos, a.length)
      } else {
        mdInput.value =
          a.slice(0, info.pos) + a.slice(info.pos + info.ch.length, a.length)
      }
      strPre = mdInput.value
    }

    const ctrlZ = () => {
      if (zStack.length === 0) return
      const info = zStack.slice(-1)[0]
      withdraw(info)
      info.del = !info.del
      yStack.push(info)
      zStack.pop()
    }

    const ctrlY = () => {
      if (yStack.length === 0) return
      const info = yStack.slice(-1)[0]
      withdraw(info)
      info.del = !info.del
      zStack.push(info)
      yStack.pop()
    }

    const search = () => {
      $('.my-textarea').highlightWithinTextarea('destroy')
      $('textarea').highlightWithinTextarea({
        highlight: ask.value
      })
      if (ask.value === '') return
      ElNotification({
        title: 'Done',
        message:
          'Found ' +
          (strPre.split(ask.value).length - 1) +
          " string '" +
          ask.value +
          "'."
      })
    }

    return {
      logoUrl,
      mdInput,
      compiledMarkdown,
      alpha,
      number,
      space,
      ask,
      line,
      tot,
      ctrlZ,
      ctrlY,
      update,
      search,
      goBack
    }
  }
}
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 20px;
}
.el-page-header {
  background-color: white;
  color: #333;
  text-align: center;
  line-height: 340%;
  height: 100%;
}
.subwindow {
  overflow-y: auto;
  resize: both;
  background-color: aliceblue;
  box-sizing: border-box;
  height: 100%;
  border-left: 2px solid #dcdfe6;
  border-right: 2px solid #dcdfe6;
  border-top: 4px solid #dcdfe6;
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
  padding-top: 60px;
  height: 175px;
  width: 175px;
}
#showWindow {
  overflow: auto;
  background-color: #f6f6f6;
}

#showWindow {
  display: inline-block;
  width: 50%;
  height: 640px;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

.container {
  display: inline-block;
  width: 50%;
  height: 640px;
  vertical-align: top;
  box-sizing: border-box;
}
textarea {
  width: 95%;
  height: 620px;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
  border: none;
  resize: none;
  outline: none;
  margin-top: 20px;
  margin-left: 20px;
  word-wrap: break-word;
}

.footer {
  font-size: 15px;
  width: 100%;
  color: white;
  height: 100%;
  background-color: #007acc;
}
.footer-tag {
  font-weight: 600;
  margin-left: 5px;
}
</style>

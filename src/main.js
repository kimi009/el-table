import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 设置默认溢出显示数量
var spillDataNum = 10

// 设置隐藏函数
var timeout = false
let setRowDisableNone = function(topNum, showRowNum, binding) {
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => {
    console.log(topNum, topNum + showRowNum + spillDataNum)
    binding.value.call(null, topNum, topNum + showRowNum + spillDataNum)
  })
}
Vue.directive('loadmore', {
  componentUpdated: function(el, binding, vnode, oldVnode) {
    setTimeout(() => {
      const dataSize = vnode.data.attrs['data-size']
      const oldDataSize = oldVnode.data.attrs['data-size']
      console.log(`dataSize=${dataSize}-------oldDataSize=${oldDataSize}`)
      if (dataSize === oldDataSize) {
        return
      }
      const selectWrap = el.querySelector('.el-table__body-wrapper')
      const selectTbody = selectWrap.querySelector('table tbody')
      const selectRow = selectWrap.querySelector('table tr')
      if (!selectRow) {
        return
      }
      const rowHeight = selectRow.clientHeight
      let showRowNum = Math.round(selectWrap.clientHeight / rowHeight)

      const createElementTR = document.createElement('tr')
      let createElementTRHeight =
        (dataSize - showRowNum - spillDataNum) * rowHeight
      createElementTR.setAttribute(
        'style',
        `height: ${createElementTRHeight}px;`
      )
      selectTbody.append(createElementTR)

      // 监听滚动后事件
      selectWrap.addEventListener('scroll', function() {
        let topPx = this.scrollTop - spillDataNum * rowHeight
        let topNum = Math.round(topPx / rowHeight)
        let minTopNum = dataSize - spillDataNum - showRowNum
        console.log(
          `topPx=${topPx}-----------topNum=${topNum}-----------minTopNum=${minTopNum}`
        )
        if (topNum > minTopNum) {
          topNum = minTopNum
        }
        if (topNum < 0) {
          topNum = 0
          topPx = 0
        }
        selectTbody.setAttribute('style', `transform: translateY(${topPx}px)`)
        createElementTR.setAttribute(
          'style',
          `height: ${
            createElementTRHeight - topPx > 0
              ? createElementTRHeight - topPx
              : 0
          }px;`
        )
        setRowDisableNone(topNum, showRowNum, binding)
      })
    })
  }
})

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  render: h => h(App)
}).$mount('#app')

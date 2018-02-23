import Vue from 'vue'
import './components'
import router from './router'
import store from './store'
import { getInitConfig } from './ipc'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

getInitConfig()

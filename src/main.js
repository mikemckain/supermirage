import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: .3,
  attempt: 1,
  observer: true,

  observerOptions: {
    rootMargin: '2000px',
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

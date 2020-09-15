import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 2,
  observer: true,

  observerOptions: {
    rootMargin: '2000px',
    threshold: 0.01
  }
})

Vue.prototype.$isMobile = window.innerWidth <= 650


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

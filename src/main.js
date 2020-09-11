import Vue from 'vue'
import App from './App.vue'
// import VueLazyload from 'vue-lazyload'

// Vue.use(VueLazyload)
// Vue.use(VueLazyload, {
//   preLoad: .3,
//   // error: 'dist/error.png',
//   // attempt: 1,
//   observer: true,

//   observerOptions: {
//     rootMargin: '1000px',
//     threshold: 0.0
//   }
// })

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

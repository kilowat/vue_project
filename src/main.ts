import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// ----------------------------
// Глобальный обработчик ошибок
// ----------------------------
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
    console.error('Global Promise error:', event.reason)
})

// ----------------------------
// Vue-ошибки (компоненты/setup/...)
// ----------------------------
app.config.errorHandler = (err, instance, info) => {
    console.error('Vue error:', err, info)
}


app.use(VueQueryPlugin)

app.use(createPinia())
app.use(router)

app.mount('#app')

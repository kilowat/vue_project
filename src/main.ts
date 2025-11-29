import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { QueryClient, VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import { AppError } from './errors/AppError'
import { logError } from './utils/errorLogger'

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



const vueQueryPluginOptions: VueQueryPluginOptions = {
    queryClient: new QueryClient({

        defaultOptions: {
            queries: {
                retry: false,
                throwOnError(error, query) {
                    logError(error);
                    if (error instanceof AppError) {
                        return false;
                    }
                    return true;
                },
            }
        },
    }),
}
app.use(VueQueryPlugin, vueQueryPluginOptions)

app.use(createPinia())
app.use(router)

app.mount('#app')

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

import {
	createApp
} from 'vue'
import App from './App.vue'
import {
	createPinia
} from 'pinia'

import Vant from 'vant';
import '@vant/touch-emulator';
import 'vant/lib/index.css';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

app.use(Vant)
app.use(ElementPlus, {
	locale: zhCn,
})
app.use(createPinia())
app.mount('#app')

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

import {
    createApp,
} from "vue";
import App from "./App.vue";
import {
    createPinia,
} from "pinia";

// import Vant from 'vant';
// import '@vant/touch-emulator';
// import 'vant/lib/index.css';

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import vueRightMenu from "vue-right-click-menu-next";

const app = createApp(App);
app.use(createPinia());

app.use(ElementPlus, {
    locale: zhCn,
});
app.use(vueRightMenu);
app.mount("#app");

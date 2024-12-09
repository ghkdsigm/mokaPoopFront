import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './index.css'
import Popup01 from '@/components/common/popup01.vue'

createApp(App).component('Popup01', Popup01).mount('#app')

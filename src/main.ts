import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { initDB } from './duckdb.ts'

const db = await initDB();
console.debug("DB: ", db)

createApp(App).mount('#app')

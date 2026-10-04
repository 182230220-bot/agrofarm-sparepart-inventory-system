import { createApp } from 'vue'
import './assets/main.css'
import App, { configureErrorHandler } from './App.vue'
import { initMobileSidebar } from './lib/mobileSidebar'
import * as supabaseJs from '@supabase/supabase-js'
import JsBarcode from 'jsbarcode'
import { Html5Qrcode } from 'html5-qrcode'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import { createIcons, icons } from 'lucide'

const w = window as any
w.supabase = supabaseJs
w.JsBarcode = JsBarcode
w.Html5Qrcode = Html5Qrcode
w.XLSX = XLSX
w.ExcelJS = ExcelJS
w.lucide = { createIcons: () => createIcons({ icons }) }

const app = createApp(App)
configureErrorHandler(app)
app.mount('#app')
initMobileSidebar()

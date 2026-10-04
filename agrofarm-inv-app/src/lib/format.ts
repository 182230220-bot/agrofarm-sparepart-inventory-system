/** Helper format & normalisasi tipe data inventory (fungsi murni, tanpa `this`). */

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function formatRupiah(value: unknown): string {
  const num = Number(value) || 0
  return num.toLocaleString('id-ID')
}

export function excelSerialFromDate(value: unknown): number | null {
  if (!(value instanceof Date) || isNaN(value.getTime())) return null
  const utc = Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
  const excelEpoch = Date.UTC(1899, 11, 30)
  return Math.round((utc - excelEpoch) / 86400000)
}

/** Nilai Date untuk Excel agar kolom tanggal tampil konsisten sebagai DD/MM/YYYY. */
export function excelDateValue(dateValue: unknown): Date | null {
  if (!dateValue) return null
  const s = String(dateValue).trim()
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0)
  m = s.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})/)
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 12, 0, 0)
  return null
}

export function strictQty(value: unknown, fallback = 0): number {
  if (value === null || value === undefined || value === '') return Math.max(0, Math.round(Number(fallback) || 0))
  if (value instanceof Date) return Math.max(0, Math.round(Number(fallback) || 0))
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0, Math.round(value)) : Math.max(0, Math.round(Number(fallback) || 0))
  const raw = String(value).trim()
  // String tanggal pada field Qty dianggap data tidak valid, bukan jumlah.
  // Jangan pernah mengubah tanggal menjadi timestamp/serial besar di stok.
  if (/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(raw) || /^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/.test(raw)) {
    return Math.max(0, Math.round(Number(fallback) || 0))
  }
  const cleaned = raw.replace(/,/g, '').replace(/[^0-9.-]/g, '')
  const n = Number(cleaned)
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : Math.max(0, Math.round(Number(fallback) || 0))
}

export function strictText(value: unknown, fallback = ''): string {
  if (value instanceof Date) return String(fallback || '').trim()
  return String(value ?? fallback ?? '').trim()
}

export function isDateLikeValue(value: unknown): boolean {
  if (value instanceof Date) return true
  const raw = String(value ?? '').trim()
  return /^\d{4}-\d{2}-\d{2}(?:T|$)/.test(raw) || /^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/.test(raw)
}

export function safeQty(primary: unknown, ...fallbacks: unknown[]): number {
  const candidates = [primary, ...fallbacks]
  for (const value of candidates) {
    if (isDateLikeValue(value)) continue
    if (value === null || value === undefined || value === '') continue
    const n = Number(value)
    if (Number.isFinite(n)) return Math.max(0, Math.round(n))
  }
  return 0
}

export function safeNumber(primary: unknown, ...fallbacks: unknown[]): number {
  const candidates = [primary, ...fallbacks]
  for (const value of candidates) {
    if (isDateLikeValue(value)) continue
    if (value === null || value === undefined || value === '') continue
    const n = Number(value)
    if (Number.isFinite(n)) return Math.max(0, n)
  }
  return 0
}

export function safeText(primary: unknown, ...fallbacks: unknown[]): string {
  const candidates = [primary, ...fallbacks]
  for (const value of candidates) {
    if (isDateLikeValue(value)) continue
    const text = String(value ?? '').trim()
    if (text) return text
  }
  return ''
}

export function strictDateOnly(value: unknown, fallback = ''): string {
  if (value instanceof Date && !isNaN(value.getTime())) return value.toISOString().slice(0, 10)
  // Pada Excel, tanggal tanpa cellDates=true dapat berupa serial number.
  // Konversi serial hanya di field tanggal; jangan dipakai untuk Qty/Satuan.
  if (typeof value === 'number' && Number.isFinite(value) && value > 0 && value < 100000) {
    const d = new Date(Date.UTC(1899, 11, 30) + Math.round(value) * 86400000)
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }
  const raw = String(value ?? '').trim()
  if (!raw) return fallback || getISODateOnly()
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  const dmy = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/)
  if (dmy) return `${dmy[3]}-${String(dmy[2]).padStart(2, '0')}-${String(dmy[1]).padStart(2, '0')}`
  return fallback || getISODateOnly()
}

export function getFormattedDateOnly(dateObj: Date = new Date()): string {
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()
  return `${day}/${month}/${year}`
}

export function getISODateOnly(dateObj: Date = new Date()): string {
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()
  return `${year}-${month}-${day}`
}

export function getDateFromInput(dateStr: string): Date {
  if (!dateStr) return new Date()
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0)
}

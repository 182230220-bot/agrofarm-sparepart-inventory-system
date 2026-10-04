/** Tipe entitas inti Sistem Inventory Spare Part Agrofarm. */

export interface MasterItem {
  kode?: string
  nama: string
  satuan?: string
  currentStock?: number
  stockAwal?: number
  minStock?: number
  leadTime?: number
  avgDailyUsage?: number
  harga?: number
  tanggal?: string
  lokasi?: string
  totalHarga?: number
  barcode?: string
  [key: string]: unknown
}

export interface SparepartItem {
  barcode?: string
  kode?: string
  nama: string
  qty?: number
  harga?: number
  totalHarga?: number
  minStock?: number
  lokasi?: string
  satuan?: string
  tanggal?: string
  [key: string]: unknown
}

export interface SisaProjectItem {
  barcode?: string
  kode?: string
  nama: string
  qty?: number
  harga?: number
  totalHarga?: number
  lokasi?: string
  satuan?: string
  project?: string
  tanggal?: string
  [key: string]: unknown
}

export type LogType = 'IN' | 'OUT'

export interface TransactionLog {
  id?: string | number
  type?: LogType | string
  gudang?: string
  nama?: string
  kode?: string
  barcode?: string
  satuan?: string
  qty?: number
  harga?: number
  tgl?: string
  tanggal?: string
  keperluan?: string
  supplier?: string
  approvalStatus?: string
  monitoringHistoryId?: string | number
  [key: string]: unknown
}

export interface MonitoringOrder {
  id?: string | number
  nama?: string
  qtyReceived?: number
  qtyRemaining?: number
  status?: string
  [key: string]: unknown
}

export interface PlanningEntry {
  id?: string | number
  nama?: string
  kode?: string
  qty?: number
  gudang?: string
  tanggal?: string
  [key: string]: unknown
}

export type UserRole = 'superadmin' | 'admin' | 'operator' | string

export interface UserAccount {
  username: string
  role?: UserRole
  active?: boolean
  [key: string]: unknown
}

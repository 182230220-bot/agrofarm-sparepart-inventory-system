<template>
        <div v-if="activeTab === 'opname_history'" class="space-y-6">
            <div class="portal-card p-5 rounded-xl border-l-4 border-teal-600 flex items-center gap-3">
                <div class="p-2.5 bg-teal-50 text-teal-700 rounded-lg border border-teal-100"><i data-lucide="history" class="w-5 h-5"></i></div>
                <div>
                    <h2 class="font-black text-slate-800 text-base tracking-tight">Riwayat Stock Opname</h2>
                    <p class="text-[11px] text-slate-500 mt-0.5">Semua record opname beserta detail selisih &amp; berita acara.</p>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl no-print">
                <div class="flex flex-wrap items-end gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Bulan</label>
                        <select :value="opnameHistoryMonth" @change="$emit('update:opname-history-month', $event.target.value)" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold">
                            <option value="">Semua Bulan</option>
                            <option v-for="(nama, idx) in opnameMonths" :key="idx" :value="String(idx + 1).padStart(2, '0')">{{ nama }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Tahun</label>
                        <select :value="opnameHistoryYear" @change="$emit('update:opname-history-year', $event.target.value)" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold">
                            <option value="">Semua Tahun</option>
                            <option v-for="tahun in opnameHistoryYears" :key="tahun" :value="String(tahun)">{{ tahun }}</option>
                        </select>
                    </div>
                    <button @click="pilihOpnamePeriode" class="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5">
                        <i data-lucide="check" class="w-3.5 h-3.5"></i> Pilih
                    </button>
                </div>
            </div>
            <div v-if="opnameHistoryFilterApplied || opnameHistorySearch || opnameHistoryGudang" class="space-y-3">
                <div v-for="op in filteredOpnameHistoryBySelectedDate" :key="op.id" class="portal-card rounded-xl overflow-hidden">
                    <div class="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/40">
                        <div class="flex items-center gap-3">
                            <div :class="op.gudang === 'Sisa Project' ? 'bg-teal-100 text-teal-700 border-teal-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="p-2 rounded-lg border">
                                <i data-lucide="clipboard-check" class="w-4 h-4"></i>
                            </div>
                            <div>
                                <p class="font-black text-slate-800 text-sm">{{ op.nomor }}</p>
                                <p class="text-[11px] text-slate-500">{{ op.tgl }} &middot; {{ op.gudang }} &middot; Petugas: <span class="font-bold uppercase text-slate-700">{{ op.petugas }}</span></p>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <select :value="opnameHistoryItemFilter" @change="$emit('update:opname-history-item-filter', $event.target.value)" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[9px] font-bold text-slate-600">
                                <option value="all">Semua Item</option>
                                <option value="selisih">Hanya Selisih</option>
                            </select>
                            <span class="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">{{ op.totalItem }} Item</span>
                            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Cocok: {{ op.totalMatch }}</span>
                            <span :class="op.totalSelisih > 0 ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-500'" class="text-[10px] font-bold px-2 py-0.5 rounded">Selisih: {{ op.totalSelisih }}</span>
                            <span :class="String(op.approvalStatus || 'approved').toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="text-[10px] font-bold px-2 py-0.5 rounded border">Status Approval: {{ String(op.approvalStatus || 'approved').toLowerCase() === 'pending' ? 'BELUM DISETUJUI' : 'SUDAH DISETUJUI' }}</span>
                            <button v-if="canEdit && String(op.approvalStatus || 'approved').toLowerCase() === 'pending'" @click="openOpnameHistoryEdit(op)" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                                <i data-lucide="pencil" class="w-3 h-3"></i> Edit
                            </button>
                            <button v-if="canPrint" @click="printBeritaAcara(op)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                                <i data-lucide="printer" class="w-3 h-3"></i> Berita Acara
                            </button>
                            <button v-if="canEdit" @click="exportOpnameHistoryExcel(op)" class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                                <i data-lucide="file-spreadsheet" class="w-3 h-3"></i> Excel
                            </button>
                        </div>
                    </div>
                    <div class="p-4">
                        <p v-if="op.keterangan" class="text-[11px] text-slate-500 mb-2 italic">Keterangan: {{ op.keterangan }}</p>
                        <div class="overflow-x-auto max-h-60">
                            <table class="w-full text-xs">
                                <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                                    <tr><th class="p-2 text-center">No</th><th class="p-2 text-center">Nomor SKU</th><th class="p-2 text-center">Rak/Lokasi</th><th class="p-2">Nama Barang</th><th class="p-2 text-center">Satuan</th><th class="p-2 text-center">Qty Sistem</th><th class="p-2 text-center">Qty Fisik</th><th class="p-2 text-center">Selisih</th><th class="p-2">Catatan</th></tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="(it, i) in filteredOpnameHistoryItems(op)" :key="i + '-' + (it.kode || it.nama || '')" :class="it.selisih === 0 ? 'bg-emerald-50/40' : 'bg-red-50/40'">
                                        <td class="p-2 text-center font-bold text-slate-400">{{ i + 1 }}</td>
                                        <td class="p-2 text-center font-mono font-bold text-slate-600">{{ it.kode || it.sku || '-' }}</td>
                                        <td class="p-2 text-center font-bold text-slate-600 uppercase">{{ it.lokasi || '-' }}</td>
                                        <td class="p-2 font-bold text-slate-800 uppercase">{{ it.nama }}</td>
                                        <td class="p-2 text-center text-slate-600 uppercase">{{ it.satuan || 'Pcs' }}</td>
                                        <td class="p-2 text-center font-bold text-slate-700">{{ it.qtySystem }}</td>
                                        <td class="p-2 text-center font-bold">{{ it.qtyFisik }}</td>
                                        <td class="p-2 text-center font-black" :class="it.selisih === 0 ? 'text-slate-500' : (it.selisih > 0 ? 'text-blue-700' : 'text-red-700')">
                                            <span v-if="it.selisih === 0" class="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px]">OK</span>
                                            <span v-else>{{ it.selisih > 0 ? '+' : '' }}{{ it.selisih }}</span>
                                        </td>
                                        <td class="p-2 text-slate-500 uppercase text-[10px]">{{ it.catatan || '-' }}</td>
                                    </tr>
                                    <tr v-if="filteredOpnameHistoryItems(op).length === 0"><td colspan="9" class="p-5 text-center text-slate-400 italic">Tidak ada item sesuai filter.</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div v-if="filteredOpnameHistory.length === 0" class="portal-card p-10 text-center text-slate-400 font-medium rounded-xl">
                    Belum ada riwayat stock opname.
                </div>
            </div>
        </div>
</template>

<script lang="ts">
export default {
    props: {
        activeTab: { default: null },
        canEdit: { default: null },
        canPrint: { default: null },
        filteredOpnameHistory: { type: Array, default: () => [] },
        filteredOpnameHistoryBySelectedDate: { type: Array, default: () => [] },
        opnameHistoryFilterApplied: { default: null },
        opnameHistoryGudang: { default: null },
        opnameHistoryItemFilter: { default: null },
        opnameHistoryMonth: { default: null },
        opnameHistorySearch: { default: null },
        opnameHistoryYear: { default: null },
        opnameHistoryYears: { type: Array, default: () => [] },
        opnameMonths: { type: Array, default: () => [] },
        exportOpnameHistoryExcel: { type: Function, required: true },
        filteredOpnameHistoryItems: { type: Function, required: true },
        openOpnameHistoryEdit: { type: Function, required: true },
        pilihOpnamePeriode: { type: Function, required: true },
        printBeritaAcara: { type: Function, required: true },
    },
    emits: ['update:opname-history-item-filter', 'update:opname-history-month', 'update:opname-history-year'],
};
</script>

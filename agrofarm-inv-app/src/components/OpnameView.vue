<template>
        <div v-if="activeTab === 'opname' && canEdit" class="space-y-6">
            <div class="portal-card p-5 rounded-xl border-l-4 border-emerald-600">
                <div class="flex items-center gap-3">
                    <div class="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                        <i data-lucide="clipboard-check" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h2 class="font-black text-slate-800 text-base tracking-tight">Input Stock Opname</h2>
                        <p class="text-[11px] text-slate-500 mt-0.5">Bandingkan stok fisik dengan stok sistem. Sistem akan otomatis mencatat penyesuaian &amp; update Master Data + Gudang.</p>
                    </div>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 no-print">
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Gudang</label>
                    <select v-model="opnameDraft.gudang" @change="setOpnameGudang(opnameDraft.gudang)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold">
                        <option value="Sparepart">Spare Part</option>
                        <option value="Sisa Project">Sisa Project</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Tanggal Stock Opname</label>
                    <input v-model="opnameDraft.tanggal" type="date" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Petugas Opname *</label>
                    <input :disabled="!canEdit" v-model="opnameDraft.petugas" type="text" placeholder="Nama petugas..." class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-medium">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Keterangan</label>
                    <input :disabled="!canEdit" v-model="opnameDraft.keterangan" type="text" placeholder="Catatan opname (opsional)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase">
                </div>
            </div>
            <!-- SIGNAL BANNER -->
            <div v-if="opnameDraftSelisihCount > 0" class="rounded-xl border-2 border-red-300 bg-red-50 p-4 flex items-start gap-3 no-print">
                <div class="p-2 bg-red-100 text-red-700 rounded-lg border border-red-200 flex-shrink-0">
                    <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                </div>
                <div class="flex-1">
                    <p class="font-black text-red-900 text-sm">Terdeteksi {{ opnameDraftSelisihCount }} item dengan SELISIH stok fisik vs sistem</p>
                    <p class="text-[11px] text-red-700 mt-0.5">Data ini akan masuk sebagai <span class="font-bold">penyesuaian otomatis</span> ke Gudang &amp; Master Data. Silakan review sebelum submit.</p>
                </div>
            </div>
            <div v-else-if="opnameDraftMatchCount > 0" class="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 flex items-start gap-3 no-print">
                <div class="p-2 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 flex-shrink-0">
                    <i data-lucide="check-circle" class="w-5 h-5"></i>
                </div>
                <div class="flex-1">
                    <p class="font-black text-emerald-900 text-sm">Semua {{ opnameDraftMatchCount }} item yang diisi COCOK dengan stok sistem</p>
                    <p class="text-[11px] text-emerald-700 mt-0.5">Tidak ada penyesuaian yang perlu dilakukan. Anda tetap dapat menyimpan hasil opname sebagai record.</p>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl flex flex-wrap items-center justify-between gap-2 no-print">
                <div class="flex flex-wrap gap-2 items-center">
                    <div class="relative">
                        <i data-lucide="search" class="w-4 h-4 absolute left-3 top-2.5 text-slate-400"></i>
                        <input :value="opnameSearch" @input="$emit('update:opname-search', $event.target.value); $emit('update:opname-page', 1)"   type="search" placeholder="Cari barang..." class="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase w-64">
                    </div>
                    <select :value="opnameFilterMode" @change="$emit('update:opname-filter-mode', $event.target.value); $emit('update:opname-page', 1)"   class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold">
                        <option value="all">Semua Barang</option>
                        <option value="selisih">Hanya Ada Selisih</option>
                        <option value="match">Hanya Cocok</option>
                        <option value="unfilled">Belum Diisi</option>
                    </select>
                    <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">Cocok: {{ opnameDraftMatchCount }}</span>
                    <span class="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-1 rounded">Selisih: {{ opnameDraftSelisihCount }}</span>
                    <span class="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded">Belum: {{ opnameDraftUnfilledCount }}</span>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button @click="fillOpnameEqualSystem" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <i data-lucide="equal" class="w-3.5 h-3.5"></i> Isi = Sistem
                    </button>
                    <button @click="resetOpnameDraft" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Reset
                    </button>
                    <button @click="downloadOpnameTemplate" class="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-blue-200">
                        <i data-lucide="download" class="w-3.5 h-3.5"></i> Template Excel
                    </button>
                    <label class="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-emerald-200 cursor-pointer">
                        <i data-lucide="upload" class="w-3.5 h-3.5"></i> Import Excel Opname
                        <input type="file" accept=".xlsx,.xls" @change="importOpnameExcel" class="hidden">
                    </label>
                    <button @click="openOpnameConfirm" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm">
                        <i data-lucide="save" class="w-3.5 h-3.5"></i> Submit &amp; Sesuaikan Stok
                    </button>
                </div>
            </div>
            <div class="portal-card rounded-xl overflow-hidden no-print">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                            <tr>
                                <th class="p-3 text-center">No</th>
                                <th class="p-3 text-center">Nomor SKU</th>
                                <th class="p-3 text-center">Rak/Lokasi</th>
                                <th class="p-3">Nama Barang</th>
                                <th class="p-3 text-center">Satuan</th>
                                <th class="p-3 text-center">Qty Sistem</th>
                                <th class="p-3 text-center">Qty Fisik</th>
                                <th class="p-3 text-center">Selisih</th>
                                <th class="p-3">Catatan</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(row, i) in paginatedOpnameDraftItems" :key="row.barcode || row.nama" :class="row.selisih === null ? '' : (row.selisih === 0 ? 'bg-emerald-50/40' : 'bg-red-50/40')">
                                <td class="p-3 text-center font-bold text-slate-400">{{ ((opnamePage - 1) * opnamePageSize) + i + 1 }}</td>
                                <td class="p-3 text-center font-mono font-bold text-slate-600">{{ row.kode || row.sku || '-' }}</td>
                                <td class="p-3 text-center font-bold text-slate-600 uppercase">{{ row.lokasi || '-' }}</td>
                                <td class="p-3 font-bold text-slate-800 uppercase">{{ row.nama }}</td>
                                <td class="p-3 text-center text-slate-600 uppercase">{{ row.satuan }}</td>
                                <td class="p-3 text-center font-bold text-slate-700">{{ row.qtySystem }}</td>
                                <td class="p-3 text-center">
                                    <input :disabled="!canEdit" type="number" v-model.number="opnameDraft.items[row.idx].qtyFisik" min="0" class="w-24 p-1.5 text-center bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200">
                                </td>
                                <td class="p-3 text-center">
                                    <span v-if="row.selisih === null" class="text-slate-300 text-[10px] italic">belum diisi</span>
                                    <span v-else-if="row.selisih === 0" class="px-2 py-0.5 rounded-lg font-black text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">COCOK</span>
                                    <span v-else :class="row.selisih > 0 ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-red-100 text-red-800 border-red-200'" class="px-2 py-0.5 rounded-lg font-black text-[10px] border">{{ row.selisih > 0 ? '+' : '' }}{{ row.selisih }}</span>
                                </td>
                                <td class="p-3">
                                    <input :disabled="!canEdit" type="text" v-model="opnameDraft.items[row.idx].catatan" placeholder="Catatan..." class="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs uppercase">
                                </td>
                            </tr>
                            <tr v-if="opnameDraftItemsFiltered.length === 0">
                                <td colspan="9" class="p-10 text-center text-slate-400 font-medium">Tidak ada item pada filter ini. Pilih gudang atau ubah filter.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="opnamePageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2 no-print">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ opnamePageStart }}–{{ opnamePageEnd }} dari {{ opnameDraftItemsFiltered.length }} item selisih</span>
                    <div class="flex items-center gap-1.5">
                        <button @click="$emit('update:opname-page', Math.max(1, opnamePage - 1))" :disabled="opnamePage <= 1" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">‹</button>
                        <span class="px-2 text-[10px] font-bold text-emerald-700">Halaman {{ Math.min(opnamePage, opnamePageCount) }} / {{ opnamePageCount }}</span>
                        <button @click="$emit('update:opname-page', Math.min(opnamePageCount, opnamePage + 1))" :disabled="opnamePage >= opnamePageCount" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">›</button>
                    </div>
                </div>
            </div>
        <OpnameConfirmModal :can-edit="canEdit" :opname-draft="opnameDraft" :opname-draft-match-count="opnameDraftMatchCount" :opname-draft-selisih-count="opnameDraftSelisihCount" :opname-draft-selisih-items="opnameDraftSelisihItems" :show-opname-confirm-modal="showOpnameConfirmModal" :submit-opname="submitOpname" @update:show-opname-confirm-modal="showOpnameConfirmModal = $event" />
        </div>
</template>

<script lang="ts">
export default {
    props: {
        activeTab: { default: null },
        canEdit: { default: null },
        opnameDraft: { default: null },
        opnameDraftItemsFiltered: { type: Array, default: () => [] },
        opnameDraftMatchCount: { default: null },
        opnameDraftSelisihCount: { default: null },
        opnameDraftUnfilledCount: { default: null },
        opnameFilterMode: { default: null },
        opnamePage: { default: null },
        opnamePageCount: { default: null },
        opnamePageEnd: { default: null },
        opnamePageSize: { default: null },
        opnamePageStart: { default: null },
        opnameSearch: { default: null },
        paginatedOpnameDraftItems: { type: Array, default: () => [] },
        downloadOpnameTemplate: { type: Function, required: true },
        fillOpnameEqualSystem: { type: Function, required: true },
        importOpnameExcel: { type: Function, required: true },
        openOpnameConfirm: { type: Function, required: true },
        resetOpnameDraft: { type: Function, required: true },
        setOpnameGudang: { type: Function, required: true },
    },
    emits: ['update:opname-filter-mode', 'update:opname-page', 'update:opname-search'],
};
</script>

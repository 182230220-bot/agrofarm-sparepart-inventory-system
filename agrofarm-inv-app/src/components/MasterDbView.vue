<template>
        <div v-if="activeTab === 'master_db'" class="space-y-6 no-print">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div v-if="canEdit" class="lg:col-span-7 portal-card p-6 rounded-xl space-y-4">
                    <div class="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
                        <i data-lucide="plus-circle" class="w-4 h-4 text-emerald-600"></i>
                        <span>Input Data Master Manual</span>
                    </div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nomor SKU</label>
                                <input v-model="formMasterManual.kode" type="text" placeholder="Contoh: SKU-001" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none uppercase">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nama Barang *</label>
                                <input v-model="formMasterManual.nama" type="text" placeholder="Masukkan Nama Barang / Sparepart" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none uppercase">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Tanggal Input *</label>
                                <input :value="getISODateOnly()" type="date" readonly class="w-full h-10 px-2.5 bg-slate-100 border border-slate-200 rounded-lg font-bold text-xs text-slate-600 outline-none cursor-not-allowed">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Qty / Stock Awal</label>
                                <input v-model.number="formMasterManual.currentStock" type="number" min="0" placeholder="0" class="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Harga Satuan (Rp)</label>
                                <input v-model.number="formMasterManual.harga" type="number" min="0" step="any" placeholder="0" class="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Lead Time (Hari)</label>
                                <input v-model.number="formMasterManual.leadTime" type="number" min="0" placeholder="0" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Buffer Stok</label>
                                <input v-model.number="formMasterManual.minStock" type="number" min="0" placeholder="0" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Satuan Barang</label>
                                <input v-model="formMasterManual.satuan" type="text" placeholder="Pcs/Unit" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none uppercase">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Keterangan Rak</label>
                                <input v-model="formMasterManual.lokasi" type="text" placeholder="RAK A1" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none uppercase">
                            </div>
                        </div>
                    </div>
                    <button v-if="canEdit" @click="tambahMasterManual" class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-sm">
                        Simpan Ke Database Master
                    </button>
                </div>
                <div v-if="canEdit" class="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                        <div class="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-1">
                            <i data-lucide="upload-cloud" class="w-4 h-4"></i>
                            <span>Import Master via Excel</span>
                        </div>
                        <p class="text-xs text-emerald-100/70 leading-relaxed">
                            Mendukung berbagai format kolom Excel (misal: <strong>Nama Barang / Nama / Item / Deskripsi</strong>, <strong>Qty / Stok</strong>, <strong>Lead Time</strong>, <strong>Buffer Stok</strong>, <strong>Pemakaian Harian</strong>, <strong>Satuan / Unit</strong>, <strong>Harga / Harga Satuan</strong>).
                        </p>
                    </div>
                    <label class="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-50 p-3 rounded-lg font-medium text-xs text-center cursor-pointer border border-emerald-600/50 block transition-all">
                        📂 Choose File (.xlsx / .xls)
                        <input type="file" @change="importMasterCatalog" accept=".xlsx, .xls" class="hidden"/>
                    </label>
                </div>
            </div>
            <div class="flex justify-between items-center gap-3">
                <div class="relative flex-1">
                    <i data-lucide="search" class="w-4 h-4 absolute left-3.5 top-3 text-slate-400"></i>
                    <input :value="searchMaster" @input="$emit('update:search-master', $event.target.value); $emit('update:master-page', 1)"   @focus="$emit('update:master-page', 1)" type="search" autocomplete="off" spellcheck="false" placeholder="Cari Nama Barang di Master..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-sm" style="pointer-events:auto !important; position:relative; z-index:100 !important;">
                </div>
            </div>
            <div class="portal-card rounded-xl overflow-hidden">
                <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <i data-lucide="book-open" class="w-4 h-4 text-emerald-600"></i>
                        <h3 class="font-bold text-slate-800 text-xs uppercase tracking-wider">Data Master</h3>
                    </div>
                    <div class="flex items-center gap-2">
                        <button v-if="canEdit" @click="exportMasterCatalogExcel" class="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Simpan Excel
                        </button>
                        <button
                            v-if="canDeleteMaster && selectedMasterItems.length > 0"
                            @click="deleteSelectedMaster"
                            class="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-sm"
                        >
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            Hapus Terpilih ({{ selectedMasterItems.length }})
                        </button>
                        <button
                            v-if="canDeleteMaster && masterCatalog.length > 0"
                            @click="deleteAllMaster"
                            title="Hapus Semua Data Master"
                            aria-label="Hapus Semua Data Master"
                            class="bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-sm border border-rose-300 transition-all"
                        >
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                            <span>Hapus Semua</span>
                        </button>
                        <span class="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200/60">{{ filteredMasterCatalog.length }} Item Master</span>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <!-- Hanya 100 row yang dipasang ke DOM per halaman; data Supabase tetap lengkap. -->
                    <table class="w-full text-left text-xs excel-print-table">
                        <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                            <tr>
                                <th class="p-3.5 text-center"><input type="checkbox" :checked="selectAllMaster" @change="$emit('toggle-select-all', $event.target.checked)" class="w-4 h-4 accent-emerald-600 cursor-pointer"></th>
                                <th class="p-3.5 text-center"><button type="button" @click="setMasterSort('no')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">No <span class="text-[9px]">{{ masterSortArrow('no') }}</span></button></th>
                                <th class="p-3.5 text-center"><button type="button" @click="setMasterSort('rak')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">Keterangan Rak <span class="text-[9px]">{{ masterSortArrow('rak') }}</span></button></th>
                                <th class="p-3.5">Nomor SKU</th>
                                <th class="p-3.5"><button type="button" @click="setMasterSort('nama')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">Nama Sparepart <span class="text-[9px]">{{ masterSortArrow('nama') }}</span></button></th>
                                <th class="p-3.5 text-center">Satuan</th>
                                <th class="p-3.5 text-center">Tanggal Input</th>
                                <th class="p-3.5 text-center"><button type="button" @click="setMasterSort('stock')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">Qty / Stock Awal <span class="text-[9px]">{{ masterSortArrow('stock') }}</span></button></th>
                                <th class="p-3.5 text-right"><button type="button" @click="setMasterSort('harga')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">Harga Satuan <span class="text-[9px]">{{ masterSortArrow('harga') }}</span></button></th>
                                <th class="p-3.5 text-center"><button type="button" @click="setMasterSort('buffer')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">Buffer Stok <span class="text-[9px]">{{ masterSortArrow('buffer') }}</span></button></th>
                                <th class="p-3.5 text-center min-w-[150px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(item, idx) in paginatedMasterCatalog" :key="item.kode" v-memo="[item.kode, item.nama, item.currentStock, item.minStock, item.satuan, item.harga, item.tanggal, item.lokasi]" class="hover:bg-slate-50">
                                <td class="p-3.5 text-center">
                                    <input
                                        type="checkbox"
                                        :value="item.kode"
                                        :checked="selectedMasterItems.includes(item.kode)" @change="$emit('update:selected-master-items', $event.target.checked ? [...selectedMasterItems, item.kode] : selectedMasterItems.filter(k => k !== item.kode))"
                                        @click.stop
                                        class="w-4 h-4 accent-emerald-600 cursor-pointer"
                                    >
                                </td>
                                <td class="p-3.5 text-center font-bold text-slate-500">{{ ((masterPage - 1) * masterPageSize) + idx + 1 }}</td>
                                <td class="p-3.5 text-center font-bold text-slate-600 uppercase">{{ item.lokasi || item.lokasiRak || item.rak || '-' }}</td>
                                <td class="p-3.5 font-mono font-bold text-emerald-700">{{ item.kode }}</td>
                                <td class="p-3.5 font-bold text-slate-800 uppercase">{{ item.nama }}</td>
                                <td class="p-3.5 text-center font-bold text-slate-700 uppercase">{{ item.satuan || 'Pcs' }}</td>
                                <td class="p-3.5 text-center font-mono text-slate-600">{{ item.tanggal || '-' }}</td>
                                <td class="p-3.5 text-center font-bold text-emerald-700 bg-emerald-50/50 rounded">{{ Math.max(0, Math.round(Number(item.currentStock ?? item.stockAwal ?? 0) || 0)) }}</td>
                                <td class="p-3.5 text-right font-bold text-slate-700 whitespace-nowrap">Rp {{ formatRupiah(item.harga || 0) }}</td>
                                <td class="p-3.5 text-center font-bold text-slate-700">{{ Math.max(0, Math.round(Number(item.minStock) || 0)) }}</td>
                                <td class="p-3.5 text-center">
                                    <div class="flex items-center justify-center gap-1.5 flex-nowrap">
                                        <button v-if="canEdit" @click="openMasterEdit(item)" class="bg-blue-100 hover:bg-blue-600 text-blue-700 hover:text-white px-2.5 py-1.5 rounded-lg border border-blue-300 transition-all font-bold text-[11px] inline-flex items-center gap-1 shadow-sm whitespace-nowrap">
                                            <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                                            <span>Edit</span>
                                        </button>
                                        <button v-if="canEdit" @click="printBarcode(item)" class="bg-emerald-100 hover:bg-emerald-600 text-emerald-700 hover:text-white px-2.5 py-1.5 rounded-lg border border-emerald-300 transition-all font-bold text-[11px] inline-flex items-center gap-1 shadow-sm whitespace-nowrap">
                                            <i data-lucide="barcode" class="w-3.5 h-3.5"></i>
                                            <span>Cetak Barcode</span>
                                        </button>
                                        <button v-if="canDeleteMaster" @click="deleteMaster(item.kode)" class="bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-lg border border-rose-300 transition-all font-bold text-[11px] inline-flex items-center gap-1 shadow-sm whitespace-nowrap">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                            <span>Hapus</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filteredMasterCatalog.length === 0">
                                <td colspan="10" class="p-12 text-center text-slate-400 font-medium">Database Master masih kosong. Silakan import atau tambah manual.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="masterPageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                    <span class="text-[10px] font-semibold text-slate-500">
                        Menampilkan {{ masterPageStart }}–{{ masterPageEnd }} dari {{ filteredMasterCatalog.length }} item
                    </span>
                    <div class="flex items-center gap-1.5">
                        <button @click="$emit('update:master-page', Math.max(1, masterPage - 1))" :disabled="masterPage <= 1" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
                        <span class="px-2 text-[10px] font-bold text-emerald-700">Halaman {{ Math.min(masterPage, masterPageCount) }} / {{ masterPageCount }}</span>
                        <button @click="$emit('update:master-page', Math.min(masterPageCount, masterPage + 1))" :disabled="masterPage >= masterPageCount" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
                    </div>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
export default {
    props: {
        activeTab: { default: null },
        canDeleteMaster: { default: null },
        canEdit: { default: null },
        filteredMasterCatalog: { type: Array, default: () => [] },
        formMasterManual: { default: null },
        masterCatalog: { type: Array, default: () => [] },
        masterPage: { default: null },
        masterPageCount: { default: null },
        masterPageEnd: { default: null },
        masterPageSize: { default: null },
        masterPageStart: { default: null },
        paginatedMasterCatalog: { type: Array, default: () => [] },
        searchMaster: { default: null },
        selectAllMaster: { default: null },
        selectedMasterItems: { type: Array, default: () => [] },
        deleteAllMaster: { type: Function, required: true },
        deleteMaster: { type: Function, required: true },
        deleteSelectedMaster: { type: Function, required: true },
        exportMasterCatalogExcel: { type: Function, required: true },
        formatRupiah: { type: Function, required: true },
        getISODateOnly: { type: Function, required: true },
        importMasterCatalog: { type: Function, required: true },
        masterSortArrow: { type: Function, required: true },
        openMasterEdit: { type: Function, required: true },
        printBarcode: { type: Function, required: true },
        setMasterSort: { type: Function, required: true },
        tambahMasterManual: { type: Function, required: true },
    },
    emits: ['update:master-page', 'update:search-master', 'toggle-select-all'],
};
</script>

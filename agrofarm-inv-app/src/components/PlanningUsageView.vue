<template>
        <div v-if="activeTab === 'planning_usage' && canPlanning && !planningViewReady" class="portal-card rounded-xl p-6 no-print border border-cyan-100">
            <div class="flex items-center gap-3 text-cyan-800">
                <div class="w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                <div><div class="font-black text-xs uppercase">Menyiapkan Planning Penggunaan</div><div class="text-[10px] text-slate-500 mt-1">Hanya data pada halaman aktif yang dirender.</div></div>
            </div>
        </div>
        <div v-if="activeTab === 'planning_usage' && planningError" class="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 no-print">{{ planningError }}</div>
        <div v-if="activeTab === 'planning_usage' && canPlanning && planningViewReady" class="space-y-6 no-print">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div class="flex flex-wrap items-center gap-2"><h2 class="text-lg font-black text-slate-800 uppercase tracking-wide">Planning Penggunaan</h2></div>
                    <p class="text-xs text-slate-500 mt-1">Perencanaan penggunaan barang tanpa memengaruhi stok atau transaksi gudang.</p>
                    <p class="text-[10px] mt-1" :class="planningCacheReady ? 'text-emerald-600' : 'text-amber-600'">{{ planningCacheReady ? 'Stok gudang siap · pencarian barang on-demand' : (planningCacheBuilding ? 'Menyiapkan cache stok ringan…' : 'Cache stok akan disiapkan setelah menu terbuka') }}<span v-if="planningAutocompleteStatus"> · {{ planningAutocompleteStatus }}</span></p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button @click="addPlanningUsage" class="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Tambah Planning Penggunaan</button>
                    <button @click="exportPlanningUsageExcel" :disabled="!planningUsages.length" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Export Excel</button>
                    <button @click="deleteAllPlanningUsages" :disabled="!planningUsages.length" class="px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Hapus Semua Data Planning Penggunaan</button>
                </div>
            </div>

            <div class="portal-card rounded-xl overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div><h3 class="font-black text-slate-800 text-xs uppercase tracking-wider">Planning Penggunaan</h3><p class="text-[10px] text-slate-500 mt-1">Estimasi penggunaan beberapa proyek dikurangi dari gabungan stok dua gudang.</p></div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs min-w-[1350px]">
                        <thead class="bg-slate-50 text-[9px] uppercase font-black text-slate-500"><tr><th class="p-2 text-center">No.</th><th class="p-2">Kode Barang</th><th class="p-2">Nama Barang</th><th class="p-2 text-center">Stok Gudang Spare Part</th><th class="p-2 text-center">Stok Gudang Sisa Project</th><th class="p-2">Estimasi Proyek</th><th class="p-2 text-center">Sisa Stok</th><th class="p-2 text-center">Jumlah Purchase Request</th><th class="p-2 text-center">Aksi</th></tr></thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="row in paginatedPlanningUsages" :key="row.id" class="align-top">
                                <td class="p-2 text-center font-bold">{{ row.nomor }}</td>
                                <td class="p-2"><input v-model="row.kode" @focus="openPlanningMasterDropdown('planning-usage-sku-' + row.id, row, 'sku', $event)" @click="openPlanningMasterDropdown('planning-usage-sku-' + row.id, row, 'sku', $event)" @input="updatePlanningMasterDropdown('planning-usage-sku-' + row.id, row, 'sku', $event)" @blur="scheduleCloseMasterDropdown('planning-usage-sku-' + row.id)" :data-master-dropdown-input="'planning-usage-sku-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik/pilih SKU..." class="w-32 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold"></td>
                                <td class="p-2"><input v-model="row.nama" @focus="openPlanningMasterDropdown('planning-usage-nama-' + row.id, row, 'nama', $event)" @click="openPlanningMasterDropdown('planning-usage-nama-' + row.id, row, 'nama', $event)" @input="updatePlanningMasterDropdown('planning-usage-nama-' + row.id, row, 'nama', $event)" @blur="scheduleCloseMasterDropdown('planning-usage-nama-' + row.id)" :data-master-dropdown-input="'planning-usage-nama-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik beberapa huruf..." class="w-52 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold uppercase"></td>
                                <td class="p-2 text-center font-black text-blue-700">{{ formatPlanningQty(row.stokSparepart, row.satuan) }}</td>
                                <td class="p-2 text-center font-black text-teal-700">{{ formatPlanningQty(row.stokSisaProject, row.satuan) }}</td>
                                <td class="p-2">
                                    <div class="space-y-2 min-w-[360px]">
                                        <div v-for="(proj,pi) in (Array.isArray(row.proyek) ? row.proyek : [])" :key="proj.id" class="grid grid-cols-[1fr_110px_28px] gap-1">
                                            <input v-model="proj.nama" @change="markPlanningDirty()" type="text" placeholder="Nama proyek" class="p-2 bg-white border border-slate-200 rounded-lg text-[10px] uppercase">
                                            <input v-model.number="proj.qty" @change="markPlanningDirty()" type="number" min="0" placeholder="Qty" class="p-2 bg-white border border-slate-200 rounded-lg text-[10px] text-center font-bold">
                                            <button @click="removePlanningProject(row,pi)" class="text-rose-600 font-black">×</button>
                                        </div>
                                        <button @click="addPlanningProject(row)" class="text-[10px] font-bold text-emerald-700 underline">+ Tambah proyek</button>
                                    </div>
                                </td>
                                <td class="p-2 text-center font-black" :class="planningUsageRemaining(row) < 0 ? 'text-red-700' : 'text-emerald-700'">{{ planningUsageRemaining(row) }} {{ row.satuan || '' }}</td>
                                <td class="p-2 text-center font-black" :class="planningUsagePurchase(row) > 0 ? 'text-red-700' : 'text-slate-500'">{{ planningUsagePurchase(row) > 0 ? planningUsagePurchase(row) + ' ' + (row.satuan || '') : '-' }}</td>
                                <td class="p-2 text-center"><button @click="removePlanningUsage(row.id)" class="text-rose-600 font-bold text-[10px] underline">Hapus</button></td>
                            </tr>
                            <tr v-if="planningUsages.length === 0"><td colspan="9" class="p-8 text-center text-slate-400 italic">Belum ada Planning Penggunaan. Tekan “Tambah Planning Penggunaan”.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="planningUsagePageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ planningUsagePageStart }}–{{ planningUsagePageEnd }} dari {{ planningUsages.length }} Planning Penggunaan</span>
                    <div class="flex items-center gap-1.5">
                        <button @click="$emit('update:planning-usage-page', Math.max(1, planningUsagePage - 1))" :disabled="planningUsagePage <= 1" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">‹</button>
                        <span class="px-2 text-[10px] font-bold text-cyan-700">Halaman {{ Math.min(planningUsagePage, planningUsagePageCount) }} / {{ planningUsagePageCount }}</span>
                        <button @click="$emit('update:planning-usage-page', Math.min(planningUsagePageCount, planningUsagePage + 1))" :disabled="planningUsagePage >= planningUsagePageCount" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">›</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="activeTab === 'planning_usage' && canPlanning && planningViewReady" class="space-y-6 no-print">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div class="flex flex-wrap items-center gap-2"><h2 class="text-lg font-black text-slate-800 uppercase tracking-wide">Planning Penggunaan</h2></div>
                    <p class="text-xs text-slate-500 mt-1">Perencanaan penggunaan barang tanpa memengaruhi stok atau transaksi gudang.</p>
                    <p class="text-[10px] mt-1" :class="planningCacheReady ? 'text-emerald-600' : 'text-amber-600'">{{ planningCacheReady ? 'Stok gudang siap · pencarian barang on-demand' : (planningCacheBuilding ? 'Menyiapkan cache stok ringan…' : 'Cache stok akan disiapkan setelah menu terbuka') }}<span v-if="planningAutocompleteStatus"> · {{ planningAutocompleteStatus }}</span></p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button @click="addPlanningUsage" class="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Tambah Planning Penggunaan</button>
                    <button @click="exportPlanningUsageExcel" :disabled="!planningUsages.length" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Export Excel</button>
                    <button @click="deleteAllPlanningUsages" :disabled="!planningUsages.length" class="px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Hapus Semua Data Planning Penggunaan</button>
                </div>
            </div>

            <div class="portal-card rounded-xl overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div><h3 class="font-black text-slate-800 text-xs uppercase tracking-wider">Planning Penggunaan</h3><p class="text-[10px] text-slate-500 mt-1">Estimasi penggunaan beberapa proyek dikurangi dari gabungan stok dua gudang.</p></div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs min-w-[1350px]">
                        <thead class="bg-slate-50 text-[9px] uppercase font-black text-slate-500"><tr><th class="p-2 text-center">No.</th><th class="p-2">Kode Barang</th><th class="p-2">Nama Barang</th><th class="p-2 text-center">Stok Gudang Spare Part</th><th class="p-2 text-center">Stok Gudang Sisa Project</th><th class="p-2">Estimasi Proyek</th><th class="p-2 text-center">Sisa Stok</th><th class="p-2 text-center">Jumlah Purchase Request</th><th class="p-2 text-center">Aksi</th></tr></thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="row in paginatedPlanningUsages" :key="row.id" class="align-top">
                                <td class="p-2 text-center font-bold">{{ row.nomor }}</td>
                                <td class="p-2"><input v-model="row.kode" @focus="openPlanningMasterDropdown('planning-usage-sku-' + row.id, row, 'sku', $event)" @click="openPlanningMasterDropdown('planning-usage-sku-' + row.id, row, 'sku', $event)" @input="updatePlanningMasterDropdown('planning-usage-sku-' + row.id, row, 'sku', $event)" @blur="scheduleCloseMasterDropdown('planning-usage-sku-' + row.id)" :data-master-dropdown-input="'planning-usage-sku-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik/pilih SKU..." class="w-32 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold"></td>
                                <td class="p-2"><input v-model="row.nama" @focus="openPlanningMasterDropdown('planning-usage-nama-' + row.id, row, 'nama', $event)" @click="openPlanningMasterDropdown('planning-usage-nama-' + row.id, row, 'nama', $event)" @input="updatePlanningMasterDropdown('planning-usage-nama-' + row.id, row, 'nama', $event)" @blur="scheduleCloseMasterDropdown('planning-usage-nama-' + row.id)" :data-master-dropdown-input="'planning-usage-nama-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik beberapa huruf..." class="w-52 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold uppercase"></td>
                                <td class="p-2 text-center font-black text-blue-700">{{ formatPlanningQty(row.stokSparepart, row.satuan) }}</td>
                                <td class="p-2 text-center font-black text-teal-700">{{ formatPlanningQty(row.stokSisaProject, row.satuan) }}</td>
                                <td class="p-2">
                                    <div class="space-y-2 min-w-[360px]">
                                        <div v-for="(proj,pi) in (Array.isArray(row.proyek) ? row.proyek : [])" :key="proj.id" class="grid grid-cols-[1fr_110px_28px] gap-1">
                                            <input v-model="proj.nama" @change="markPlanningDirty()" type="text" placeholder="Nama proyek" class="p-2 bg-white border border-slate-200 rounded-lg text-[10px] uppercase">
                                            <input v-model.number="proj.qty" @change="markPlanningDirty()" type="number" min="0" placeholder="Qty" class="p-2 bg-white border border-slate-200 rounded-lg text-[10px] text-center font-bold">
                                            <button @click="removePlanningProject(row,pi)" class="text-rose-600 font-black">×</button>
                                        </div>
                                        <button @click="addPlanningProject(row)" class="text-[10px] font-bold text-emerald-700 underline">+ Tambah proyek</button>
                                    </div>
                                </td>
                                <td class="p-2 text-center font-black" :class="planningUsageRemaining(row) < 0 ? 'text-red-700' : 'text-emerald-700'">{{ planningUsageRemaining(row) }} {{ row.satuan || '' }}</td>
                                <td class="p-2 text-center font-black" :class="planningUsagePurchase(row) > 0 ? 'text-red-700' : 'text-slate-500'">{{ planningUsagePurchase(row) > 0 ? planningUsagePurchase(row) + ' ' + (row.satuan || '') : '-' }}</td>
                                <td class="p-2 text-center"><button @click="removePlanningUsage(row.id)" class="text-rose-600 font-bold text-[10px] underline">Hapus</button></td>
                            </tr>
                            <tr v-if="planningUsages.length === 0"><td colspan="9" class="p-8 text-center text-slate-400 italic">Belum ada Planning Penggunaan. Tekan “Tambah Planning Penggunaan”.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="planningUsagePageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ planningUsagePageStart }}–{{ planningUsagePageEnd }} dari {{ planningUsages.length }} Planning Penggunaan</span>
                    <div class="flex items-center gap-1.5">
                        <button @click="$emit('update:planning-usage-page', Math.max(1, planningUsagePage - 1))" :disabled="planningUsagePage <= 1" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">‹</button>
                        <span class="px-2 text-[10px] font-bold text-cyan-700">Halaman {{ Math.min(planningUsagePage, planningUsagePageCount) }} / {{ planningUsagePageCount }}</span>
                        <button @click="$emit('update:planning-usage-page', Math.min(planningUsagePageCount, planningUsagePage + 1))" :disabled="planningUsagePage >= planningUsagePageCount" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">›</button>
                    </div>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
export default {
    props: {
        activeTab: { default: null },
        canPlanning: { default: null },
        paginatedPlanningUsages: { type: Array, default: () => [] },
        planningAutocompleteStatus: { default: null },
        planningCacheBuilding: { default: null },
        planningCacheReady: { default: null },
        planningError: { default: null },
        planningUsagePage: { default: null },
        planningUsagePageCount: { default: null },
        planningUsagePageEnd: { default: null },
        planningUsagePageStart: { default: null },
        planningUsages: { type: Array, default: () => [] },
        planningViewReady: { default: null },
        addPlanningProject: { type: Function, required: true },
        addPlanningUsage: { type: Function, required: true },
        deleteAllPlanningUsages: { type: Function, required: true },
        exportPlanningUsageExcel: { type: Function, required: true },
        formatPlanningQty: { type: Function, required: true },
        markPlanningDirty: { type: Function, required: true },
        openPlanningMasterDropdown: { type: Function, required: true },
        planningUsagePurchase: { type: Function, required: true },
        planningUsageRemaining: { type: Function, required: true },
        removePlanningProject: { type: Function, required: true },
        removePlanningUsage: { type: Function, required: true },
        scheduleCloseMasterDropdown: { type: Function, required: true },
        updatePlanningMasterDropdown: { type: Function, required: true },
    },
    emits: ['update:planning-usage-page'],
};
</script>

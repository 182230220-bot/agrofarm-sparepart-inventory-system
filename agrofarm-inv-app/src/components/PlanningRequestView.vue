<template>
        <div v-if="activeTab === 'planning_request' && canPlanning && !planningViewReady" class="portal-card rounded-xl p-6 no-print border border-cyan-100">
            <div class="flex items-center gap-3 text-cyan-800">
                <div class="w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                <div><div class="font-black text-xs uppercase">Menyiapkan Planning Request</div><div class="text-[10px] text-slate-500 mt-1">Memuat halaman aktif saja agar dataset besar tidak membekukan browser.</div></div>
            </div>
        </div>
        <div v-if="activeTab === 'planning_request' && planningError" class="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 no-print">{{ planningError }}</div>
        <div v-if="activeTab === 'planning_request' && canPlanning && planningViewReady" class="space-y-6 no-print">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div class="flex flex-wrap items-center gap-2"><h2 class="text-lg font-black text-slate-800 uppercase tracking-wide">Planning Request</h2></div>
                    <p class="text-xs text-slate-500 mt-1">Perencanaan kebutuhan tanpa memengaruhi stok atau transaksi gudang.</p>
                    <p class="text-[10px] mt-1" :class="planningCacheReady ? 'text-emerald-600' : 'text-amber-600'">{{ planningCacheReady ? 'Stok gudang siap · pencarian barang on-demand' : (planningCacheBuilding ? 'Menyiapkan cache stok ringan…' : 'Cache stok akan disiapkan setelah menu terbuka') }}<span v-if="planningAutocompleteStatus"> · {{ planningAutocompleteStatus }}</span></p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button @click="addPlanningRequest" class="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Tambah Planning Request</button>
                    <button @click="exportPlanningExcel" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Export Excel</button>
                    <button @click="deleteAllPlanningRequests" :disabled="!planningRequests.length" class="px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Hapus Semua Data Planning Request</button>
                    <button @click="$emit('update:show-planning-prices', !showPlanningPrices)" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-200"><i :data-lucide="showPlanningPrices ? 'eye-off' : 'eye'" class="w-3.5 h-3.5"></i> {{ showPlanningPrices ? 'Hide Harga' : 'Tampilkan Harga' }}</button>
                </div>
            </div>

            <div class="portal-card rounded-xl overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h3 class="font-black text-slate-800 text-xs uppercase tracking-wider">Planning Request</h3>
                        <p class="text-[10px] text-slate-500 mt-1">Stok hanya dibaca dari Data Master, Gudang Spare Part, dan Gudang Sisa Project. Input planning tidak mengubah stok.</p>
                    </div>
                    <div class="flex flex-wrap items-end gap-2 w-full lg:w-auto lg:max-w-[980px]">
                        <div class="min-w-[165px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Filter Stok</label>
                            <select :value="planningStockFilter" @change="$emit('update:planning-stock-filter', $event.target.value)" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold">
                            <option value="all">Semua Stok</option><option value="above">Stok &gt; Buffer</option><option value="below">Stok &lt; Buffer</option>
                            </select>
                        </div>
                        <div class="min-w-[145px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Tanggal Mulai</label>
                            <input :value="planningDateStart" @input="$emit('update:planning-date-start', $event.target.value)" type="date" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium">
                        </div>
                        <div class="min-w-[145px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Tanggal Akhir</label>
                            <input :value="planningDateEnd" @input="$emit('update:planning-date-end', $event.target.value)" type="date" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium">
                        </div>
                        <div class="min-w-[140px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Gudang</label>
                            <select :value="planningWarehouseFilter" @change="$emit('update:planning-warehouse-filter', $event.target.value)" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold">
                                <option value="">Semua Gudang</option><option value="Sparepart">Spare Part</option><option value="Sisa Project">Sisa Project</option>
                            </select>
                        </div>
                        <div class="min-w-[180px] flex-[1.2]">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Cari Barang</label>
                            <input :value="planningSearchInput" @input="$emit('update:planning-search-input', $event.target.value); schedulePlanningFilterSearch"   type="text" autocomplete="off" placeholder="Cari barang..." class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] uppercase">
                        </div>
                        <button @click="resetPlanningFilters" class="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold">Reset</button>
                        <div class="w-full text-[9px] text-slate-400">Filter rentang memakai tanggal planning yang tetap disimpan di data, tetapi tidak ditampilkan sebagai kolom tabel.</div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs min-w-[1380px]">
                        <thead class="bg-slate-50 text-[9px] uppercase font-black text-slate-500">
                            <tr>
                                <th class="p-2 text-center">No.</th><th class="p-2">Nomor SKU</th><th class="p-2">Nama Barang</th><th class="p-2 text-center">Stok Terpakai</th><th class="p-2 text-center">Stok</th><th class="p-2 text-center">Buffer Stok</th><th class="p-2 text-center">Planning Penambahan Stock</th><th class="p-2 text-center">Total Stock Setelah Penambahan</th><th v-if="showPlanningPrices" class="p-2 text-right">Harga Satuan</th><th v-if="showPlanningPrices" class="p-2 text-right">Harga Total Penambahan</th><th class="p-2 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="row in paginatedPlanningRequests" :key="row.id" class="hover:bg-slate-50/60">
                                <td class="p-2 text-center font-bold">{{ row.nomor }}</td>
                                <td class="p-2"><input v-model="row.sku" @focus="openPlanningMasterDropdown('planning-request-sku-' + row.id, row, 'sku', $event)" @click="openPlanningMasterDropdown('planning-request-sku-' + row.id, row, 'sku', $event)" @input="updatePlanningMasterDropdown('planning-request-sku-' + row.id, row, 'sku', $event)" @blur="scheduleCloseMasterDropdown('planning-request-sku-' + row.id)" :data-master-dropdown-input="'planning-request-sku-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik/pilih SKU..." class="w-32 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold"></td>
                                <td class="p-2"><input v-model="row.nama" @focus="openPlanningMasterDropdown('planning-request-nama-' + row.id, row, 'nama', $event)" @click="openPlanningMasterDropdown('planning-request-nama-' + row.id, row, 'nama', $event)" @input="updatePlanningMasterDropdown('planning-request-nama-' + row.id, row, 'nama', $event)" @blur="scheduleCloseMasterDropdown('planning-request-nama-' + row.id)" :data-master-dropdown-input="'planning-request-nama-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik beberapa huruf..." class="w-56 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold uppercase"></td>
                                <td class="p-2 text-center font-black text-blue-700">
                                    <span v-if="planningDateRangeReady">{{ formatPlanningQty(getPlanningUsedStock(row), row.satuan) }}</span>
                                    <span v-else class="text-[9px] text-slate-400 font-semibold">Isi tanggal dulu</span>
                                </td>
                                <td class="p-2 text-center font-black" :class="getPlanningRowStock(row) < Number(row.bufferStock || 0) ? 'text-red-600' : 'text-emerald-700'">
                                    <div>{{ formatPlanningQty(getPlanningRowStock(row), row.satuan) }}</div>
                                    <div class="mt-1.5 flex flex-col items-center gap-1">
                                        <label class="text-[9px] font-bold flex items-center gap-1"><input type="checkbox" :checked="(row.gudangPenggunaan || []).includes('Sparepart')" @change="togglePlanningWarehouse(row,'Sparepart')"> Spare Part</label>
                                        <label class="text-[9px] font-bold flex items-center gap-1"><input type="checkbox" :checked="(row.gudangPenggunaan || []).includes('Sisa Project')" @change="togglePlanningWarehouse(row,'Sisa Project')"> Sisa Project</label>
                                    </div>
                                </td>
                                <td class="p-2"><input v-model.number="row.bufferStock" @change="updatePlanningRequestAddition(row)" type="number" min="0" class="w-24 p-2 bg-white border border-slate-200 rounded-lg text-[10px] text-center font-bold"></td>
                                <td class="p-2"><input v-model.number="row.penambahanStock" @change="markPlanningDirty()" type="number" min="0" class="w-28 p-2 bg-white border border-slate-200 rounded-lg text-[10px] text-center font-bold"></td>
                                <td class="p-2 text-center font-black">{{ formatPlanningQty(getPlanningRowStock(row) + (Number(row.penambahanStock) || 0), row.satuan) }}</td>
                                <td v-if="showPlanningPrices" class="p-2 text-right font-bold">Rp {{ formatRupiah(row.hargaSatuan) }}</td>
                                <td v-if="showPlanningPrices" class="p-2 text-right font-black text-emerald-700">Rp {{ formatRupiah((Number(row.hargaSatuan)||0) * (Number(row.penambahanStock)||0)) }}</td>
                                <td class="p-2 text-center"><button @click="removePlanningRequest(row.id)" class="text-rose-600 font-bold text-[10px] underline">Hapus</button></td>
                            </tr>
                            <tr v-if="filteredPlanningRequests.length === 0"><td  :colspan="showPlanningPrices ? 11 : 9" class="p-8 text-center text-slate-400 italic">Belum ada Planning Request. Tekan “Tambah Planning Request”.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="planningRequestPageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ planningRequestPageStart }}–{{ planningRequestPageEnd }} dari {{ filteredPlanningRequests.length }} Planning Request</span>
                    <div class="flex items-center gap-1.5">
                        <button @click="$emit('update:planning-request-page', Math.max(1, planningRequestPage - 1))" :disabled="planningRequestPage <= 1" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">‹</button>
                        <span class="px-2 text-[10px] font-bold text-cyan-700">Halaman {{ Math.min(planningRequestPage, planningRequestPageCount) }} / {{ planningRequestPageCount }}</span>
                        <button @click="$emit('update:planning-request-page', Math.min(planningRequestPageCount, planningRequestPage + 1))" :disabled="planningRequestPage >= planningRequestPageCount" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">›</button>
                    </div>
                </div>
            </div>

        </div>
        <div v-if="activeTab === 'planning_request' && canPlanning && planningViewReady" class="space-y-6 no-print">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div class="flex flex-wrap items-center gap-2"><h2 class="text-lg font-black text-slate-800 uppercase tracking-wide">Planning Request</h2></div>
                    <p class="text-xs text-slate-500 mt-1">Perencanaan kebutuhan tanpa memengaruhi stok atau transaksi gudang.</p>
                    <p class="text-[10px] mt-1" :class="planningCacheReady ? 'text-emerald-600' : 'text-amber-600'">{{ planningCacheReady ? 'Stok gudang siap · pencarian barang on-demand' : (planningCacheBuilding ? 'Menyiapkan cache stok ringan…' : 'Cache stok akan disiapkan setelah menu terbuka') }}<span v-if="planningAutocompleteStatus"> · {{ planningAutocompleteStatus }}</span></p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button @click="addPlanningRequest" class="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Tambah Planning Request</button>
                    <button @click="exportPlanningExcel" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Export Excel</button>
                    <button @click="deleteAllPlanningRequests" :disabled="!planningRequests.length" class="px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Hapus Semua Data Planning Request</button>
                    <button @click="$emit('update:show-planning-prices', !showPlanningPrices)" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-200"><i :data-lucide="showPlanningPrices ? 'eye-off' : 'eye'" class="w-3.5 h-3.5"></i> {{ showPlanningPrices ? 'Hide Harga' : 'Tampilkan Harga' }}</button>
                </div>
            </div>

            <div class="portal-card rounded-xl overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h3 class="font-black text-slate-800 text-xs uppercase tracking-wider">Planning Request</h3>
                        <p class="text-[10px] text-slate-500 mt-1">Stok hanya dibaca dari Data Master, Gudang Spare Part, dan Gudang Sisa Project. Input planning tidak mengubah stok.</p>
                    </div>
                    <div class="flex flex-wrap items-end gap-2 w-full lg:w-auto lg:max-w-[980px]">
                        <div class="min-w-[165px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Filter Stok</label>
                            <select :value="planningStockFilter" @change="$emit('update:planning-stock-filter', $event.target.value)" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold">
                            <option value="all">Semua Stok</option><option value="above">Stok &gt; Buffer</option><option value="below">Stok &lt; Buffer</option>
                            </select>
                        </div>
                        <div class="min-w-[145px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Tanggal Mulai</label>
                            <input :value="planningDateStart" @input="$emit('update:planning-date-start', $event.target.value)" type="date" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium">
                        </div>
                        <div class="min-w-[145px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Tanggal Akhir</label>
                            <input :value="planningDateEnd" @input="$emit('update:planning-date-end', $event.target.value)" type="date" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium">
                        </div>
                        <div class="min-w-[140px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Gudang</label>
                            <select :value="planningWarehouseFilter" @change="$emit('update:planning-warehouse-filter', $event.target.value)" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold">
                                <option value="">Semua Gudang</option><option value="Sparepart">Spare Part</option><option value="Sisa Project">Sisa Project</option>
                            </select>
                        </div>
                        <div class="min-w-[180px] flex-[1.2]">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Cari Barang</label>
                            <input :value="planningSearchInput" @input="$emit('update:planning-search-input', $event.target.value); schedulePlanningFilterSearch"   type="text" autocomplete="off" placeholder="Cari barang..." class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] uppercase">
                        </div>
                        <button @click="resetPlanningFilters" class="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold">Reset</button>
                        <div class="w-full text-[9px] text-slate-400">Filter rentang memakai tanggal planning yang tetap disimpan di data, tetapi tidak ditampilkan sebagai kolom tabel.</div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs min-w-[1380px]">
                        <thead class="bg-slate-50 text-[9px] uppercase font-black text-slate-500">
                            <tr>
                                <th class="p-2 text-center">No.</th><th class="p-2">Nomor SKU</th><th class="p-2">Nama Barang</th><th class="p-2 text-center">Stok Terpakai</th><th class="p-2 text-center">Stok</th><th class="p-2 text-center">Buffer Stok</th><th class="p-2 text-center">Planning Penambahan Stock</th><th class="p-2 text-center">Total Stock Setelah Penambahan</th><th v-if="showPlanningPrices" class="p-2 text-right">Harga Satuan</th><th v-if="showPlanningPrices" class="p-2 text-right">Harga Total Penambahan</th><th class="p-2 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="row in paginatedPlanningRequests" :key="row.id" class="hover:bg-slate-50/60">
                                <td class="p-2 text-center font-bold">{{ row.nomor }}</td>
                                <td class="p-2"><input v-model="row.sku" @focus="openPlanningMasterDropdown('planning-request-sku-' + row.id, row, 'sku', $event)" @click="openPlanningMasterDropdown('planning-request-sku-' + row.id, row, 'sku', $event)" @input="updatePlanningMasterDropdown('planning-request-sku-' + row.id, row, 'sku', $event)" @blur="scheduleCloseMasterDropdown('planning-request-sku-' + row.id)" :data-master-dropdown-input="'planning-request-sku-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik/pilih SKU..." class="w-32 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold"></td>
                                <td class="p-2"><input v-model="row.nama" @focus="openPlanningMasterDropdown('planning-request-nama-' + row.id, row, 'nama', $event)" @click="openPlanningMasterDropdown('planning-request-nama-' + row.id, row, 'nama', $event)" @input="updatePlanningMasterDropdown('planning-request-nama-' + row.id, row, 'nama', $event)" @blur="scheduleCloseMasterDropdown('planning-request-nama-' + row.id)" :data-master-dropdown-input="'planning-request-nama-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik beberapa huruf..." class="w-56 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold uppercase"></td>
                                <td class="p-2 text-center font-black text-blue-700">
                                    <span v-if="planningDateRangeReady">{{ formatPlanningQty(getPlanningUsedStock(row), row.satuan) }}</span>
                                    <span v-else class="text-[9px] text-slate-400 font-semibold">Isi tanggal dulu</span>
                                </td>
                                <td class="p-2 text-center font-black" :class="getPlanningRowStock(row) < Number(row.bufferStock || 0) ? 'text-red-600' : 'text-emerald-700'">
                                    <div>{{ formatPlanningQty(getPlanningRowStock(row), row.satuan) }}</div>
                                    <div class="mt-1.5 flex flex-col items-center gap-1">
                                        <label class="text-[9px] font-bold flex items-center gap-1"><input type="checkbox" :checked="(row.gudangPenggunaan || []).includes('Sparepart')" @change="togglePlanningWarehouse(row,'Sparepart')"> Spare Part</label>
                                        <label class="text-[9px] font-bold flex items-center gap-1"><input type="checkbox" :checked="(row.gudangPenggunaan || []).includes('Sisa Project')" @change="togglePlanningWarehouse(row,'Sisa Project')"> Sisa Project</label>
                                    </div>
                                </td>
                                <td class="p-2"><input v-model.number="row.bufferStock" @change="updatePlanningRequestAddition(row)" type="number" min="0" class="w-24 p-2 bg-white border border-slate-200 rounded-lg text-[10px] text-center font-bold"></td>
                                <td class="p-2"><input v-model.number="row.penambahanStock" @change="markPlanningDirty()" type="number" min="0" class="w-28 p-2 bg-white border border-slate-200 rounded-lg text-[10px] text-center font-bold"></td>
                                <td class="p-2 text-center font-black">{{ formatPlanningQty(getPlanningRowStock(row) + (Number(row.penambahanStock) || 0), row.satuan) }}</td>
                                <td v-if="showPlanningPrices" class="p-2 text-right font-bold">Rp {{ formatRupiah(row.hargaSatuan) }}</td>
                                <td v-if="showPlanningPrices" class="p-2 text-right font-black text-emerald-700">Rp {{ formatRupiah((Number(row.hargaSatuan)||0) * (Number(row.penambahanStock)||0)) }}</td>
                                <td class="p-2 text-center"><button @click="removePlanningRequest(row.id)" class="text-rose-600 font-bold text-[10px] underline">Hapus</button></td>
                            </tr>
                            <tr v-if="filteredPlanningRequests.length === 0"><td  :colspan="showPlanningPrices ? 11 : 9" class="p-8 text-center text-slate-400 italic">Belum ada Planning Request. Tekan “Tambah Planning Request”.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="planningRequestPageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ planningRequestPageStart }}–{{ planningRequestPageEnd }} dari {{ filteredPlanningRequests.length }} Planning Request</span>
                    <div class="flex items-center gap-1.5">
                        <button @click="$emit('update:planning-request-page', Math.max(1, planningRequestPage - 1))" :disabled="planningRequestPage <= 1" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">‹</button>
                        <span class="px-2 text-[10px] font-bold text-cyan-700">Halaman {{ Math.min(planningRequestPage, planningRequestPageCount) }} / {{ planningRequestPageCount }}</span>
                        <button @click="$emit('update:planning-request-page', Math.min(planningRequestPageCount, planningRequestPage + 1))" :disabled="planningRequestPage >= planningRequestPageCount" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">›</button>
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
        filteredPlanningRequests: { type: Array, default: () => [] },
        paginatedPlanningRequests: { type: Array, default: () => [] },
        planningAutocompleteStatus: { default: null },
        planningCacheBuilding: { default: null },
        planningCacheReady: { default: null },
        planningDateEnd: { default: null },
        planningDateRangeReady: { default: null },
        planningDateStart: { default: null },
        planningError: { default: null },
        planningRequestPage: { default: null },
        planningRequestPageCount: { default: null },
        planningRequestPageEnd: { default: null },
        planningRequestPageStart: { default: null },
        planningRequests: { type: Array, default: () => [] },
        planningSearchInput: { default: null },
        planningStockFilter: { default: null },
        planningViewReady: { default: null },
        planningWarehouseFilter: { default: null },
        showPlanningPrices: { default: null },
        addPlanningRequest: { type: Function, required: true },
        deleteAllPlanningRequests: { type: Function, required: true },
        exportPlanningExcel: { type: Function, required: true },
        formatPlanningQty: { type: Function, required: true },
        formatRupiah: { type: Function, required: true },
        getPlanningRowStock: { type: Function, required: true },
        getPlanningUsedStock: { type: Function, required: true },
        markPlanningDirty: { type: Function, required: true },
        openPlanningMasterDropdown: { type: Function, required: true },
        removePlanningRequest: { type: Function, required: true },
        resetPlanningFilters: { type: Function, required: true },
        scheduleCloseMasterDropdown: { type: Function, required: true },
        schedulePlanningFilterSearch: { type: Function, required: true },
        togglePlanningWarehouse: { type: Function, required: true },
        updatePlanningMasterDropdown: { type: Function, required: true },
        updatePlanningRequestAddition: { type: Function, required: true },
    },
    emits: ['update:planning-date-end', 'update:planning-date-start', 'update:planning-request-page', 'update:planning-search-input', 'update:planning-stock-filter', 'update:planning-warehouse-filter', 'update:show-planning-prices'],
};
</script>

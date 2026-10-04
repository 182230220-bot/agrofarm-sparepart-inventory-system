<template>
        <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
                <div class="portal-card p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Data Master</p>
                        <h3 class="text-2xl font-black text-slate-800 mt-1">{{ masterCount }} <span class="text-xs font-normal text-slate-400">Item</span></h3>
                    </div>
                    <div class="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                        <i data-lucide="layers" class="w-6 h-6"></i>
                    </div>
                </div>
                <div class="portal-card p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Stok Sparepart</p>
                        <h3 class="text-2xl font-black text-slate-800 mt-1">{{ totalSparepartQty }} <span class="text-xs font-normal text-slate-400">Qty</span></h3>
                    </div>
                    <div class="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                        <i data-lucide="wrench" class="w-6 h-6"></i>
                    </div>
                </div>
                <div class="portal-card p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Stok Sisa Project</p>
                        <h3 class="text-2xl font-black text-slate-800 mt-1">{{ totalSisaProjectQty }} <span class="text-xs font-normal text-slate-400">Qty</span></h3>
                    </div>
                    <div class="p-3 bg-teal-50 text-teal-700 rounded-xl border border-teal-100">
                        <i data-lucide="package-check" class="w-6 h-6"></i>
                    </div>
                </div>
                <div class="portal-card p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Purchase Pending</p>
                        <h3 class="text-2xl font-black text-amber-600 mt-1">{{ purchasePendingCount }} <span class="text-xs font-normal text-amber-600/70">Antrean</span></h3>
                    </div>
                    <div class="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                        <i data-lucide="clock" class="w-6 h-6"></i>
                    </div>
                </div>
            </div>
            <!-- LOW STOCK ALERT WIDGET -->
            <div v-if="lowStockItems.length > 0" class="portal-card rounded-xl overflow-hidden border-l-4 border-red-500 no-print">
                <div class="p-4 border-b border-slate-100 bg-red-50/40 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i data-lucide="alert-triangle" class="w-4 h-4 text-red-600"></i>
                        <h3 class="font-black text-red-900 uppercase text-xs tracking-wider">Peringatan Stok Menipis / Habis</h3>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[11px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-200">{{ lowStockItems.length }} Item Perlu Restock</span>
                        <button v-if="canEdit" type="button" @click.stop.prevent="$emit('export-low-stock')" class="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-sm" style="pointer-events:auto !important; position:relative; z-index:30;">
                            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Export Excel
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto max-h-52">
                    <table class="w-full text-xs">
                        <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                            <tr>
                                <th class="p-2.5 text-left">Nama Barang</th>
                                <th class="p-2.5 text-center">No. PR</th>
                                <th class="p-2.5 text-center">Tgl. PR</th>
                                <th class="p-2.5 text-center">Gudang</th>
                                <th class="p-2.5 text-center">Lokasi</th>
                                <th class="p-2.5 text-center">Stok Saat Ini</th>
                                <th class="p-2.5 text-center">Min. Stok</th>
                                <th class="p-2.5 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(row, i) in lowStockItems" :key="i" :class="row.qty === 0 ? 'bg-red-50/60' : 'bg-amber-50/40'">
                                <td class="p-2.5 font-bold text-slate-800 uppercase">{{ row.nama }}</td>
                                <td class="p-2.5 text-center text-[10px] font-bold text-slate-700">{{ row.nomorPR || '-' }}</td>
                                <td class="p-2.5 text-center text-[10px] font-mono font-bold text-slate-600">{{ row.tglPR || '-' }}</td>
                                <td class="p-2.5 text-center text-slate-600 text-[10px] font-bold">{{ row.gudang }}</td>
                                <td class="p-2.5 text-center text-slate-500 text-[10px] uppercase">{{ row.lokasi }}</td>
                                <td class="p-2.5 text-center font-black" :class="row.qty === 0 ? 'text-red-700' : 'text-amber-700'">{{ row.qty }} {{ row.satuan }}</td>
                                <td class="p-2.5 text-center text-slate-600 font-semibold">{{ row.minStock }}</td>
                                <td class="p-2.5 text-center">
                                    <span v-if="row.qty === 0" class="px-2 py-0.5 rounded-lg text-[10px] font-black bg-red-100 text-red-800 border border-red-200">HABIS</span>
                                    <span v-else class="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">MENIPIS</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- FILTER DASHBOARD -->
            <div class="portal-card p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 no-print">
                <div class="flex items-center gap-2">
                    <i data-lucide="calendar-range" class="w-4 h-4 text-emerald-600"></i>
                    <span class="text-xs font-bold text-slate-700 uppercase">Filter Tanggal Inbound & Outbound:</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <input :value="dashFilterDateStart" @input="$emit('update:dash-filter-date-start', $event.target.value)" type="date" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500">
                    <span class="text-xs text-slate-400">s/d</span>
                    <input :value="dashFilterDateEnd" @input="$emit('update:dash-filter-date-end', $event.target.value)" type="date" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500">
                    <button @click="$emit('reset-dash-filter')" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold">Reset</button>
                    <button v-if="canPrint" @click="$emit('print-daily-report', 'all')" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak Laporan Per Tanggal
                    </button>
                    <button v-if="canEdit" @click="$emit('export-dashboard')" class="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <i data-lucide="download" class="w-3.5 h-3.5"></i> Export Excel Per Tanggal
                    </button>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl no-print">
                <div class="relative max-w-xl">
                    <i data-lucide="search" class="w-4 h-4 absolute left-3 top-3 text-slate-400"></i>
                    <input :value="dashSearchBarang" @input="$emit('update:dash-search-barang', $event.target.value)" type="text" autocomplete="off" spellcheck="false" placeholder="Cari nama barang di Dashboard..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium uppercase focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                </div>
            </div>
            <!-- SECTION 1: GUDANG SPAREPART (IN & OUT DASHBOARD) -->
            <div class="space-y-3">
                <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <i data-lucide="wrench" class="w-5 h-5 text-emerald-700"></i>
                    <h2 class="font-extrabold text-slate-800 uppercase text-xs tracking-wider">Pergerakan Stok: Gudang Spare Part (Inbound & Outbound)</h2><button @click="$emit('update:sparepart-show-prices', !sparepartShowPrices)" class="ml-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200">{{ sparepartShowPrices ? 'Hide Harga' : 'Tampilkan Harga' }}</button>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-emerald-600">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span class="font-bold text-xs uppercase text-emerald-900 flex items-center gap-1.5">
                                <i data-lucide="arrow-down-left" class="w-4 h-4 text-emerald-600"></i> Sparepart Masuk (Inbound)
                            </span>
                            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">{{ filteredSparepartLogsIn.length }} Records</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs excel-print-table">
                                <thead class="bg-emerald-50/70 font-bold text-emerald-900 uppercase text-[9px] sticky top-0 border-b border-emerald-200">
                                    <tr>
                                        <th class="p-2">Tgl</th>
                                        <th class="p-2">Nama Barang</th>
                                        <th class="p-2 text-center">Satuan</th>
                                        <th class="p-2 text-center">Qty</th>
                                        <th class="p-2 text-center">Qty Awal</th>
                                        <th class="p-2 text-center">Qty Akhir</th>
                                        <th class="p-2">No. PO / Supplier</th>
                                    <th class="p-2">Keterangan</th>
                                        <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Satuan</th>
                                        <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Total</th>
                                        <th class="p-2 text-center no-print">Status / Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="log in paginatedDashboardSparepartIn" :key="log.id" class="hover:bg-emerald-50/30" :class="isCancelledLog(log) ? 'bg-rose-50/70 opacity-80' : ''">
                                        <td class="p-2 text-slate-500 text-[10px] font-mono">
                                            {{ log.tgl }}
                                            <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                        </td>
                                        <td class="p-2 font-bold text-slate-800 uppercase">{{ log.nama }}</td>
                                        <td class="p-2 text-center font-bold text-slate-700">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                        <td class="p-2 text-center font-bold text-emerald-700 bg-emerald-50/50 rounded">+{{ getLogDisplayQty(log) }}</td>
                                        <td class="p-2 text-center">{{ log.qtyAwal ?? '-' }}</td>
                                        <td class="p-2 text-center font-bold">{{ log.qtyAkhir ?? '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase"><div>No. PO: {{ log.nomorPO || '-' }}</div><div class="mt-0.5">Supplier: {{ log.supplier || '-' }}</div></td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                        <td v-if="sparepartShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                        <td v-if="sparepartShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                        <td class="p-2 text-center no-print">
                                            <span :class="isCancelledLog(log) ? 'text-rose-600' : (isPendingLog(log) ? 'text-amber-600' : 'text-emerald-600')" class="text-[9px] font-bold block">{{ approvalLabel(log) }}</span>
                                            <button v-if="canApprove && isPendingLog(log)" @click="$emit('approve-transaction', log)" class="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold underline">Setujui</button>
                                            <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="$emit('edit-log', log)" class="text-amber-600 hover:text-amber-800 text-[10px] font-bold underline">Edit</button>
                                            <button v-if="canEdit && !isPendingLog(log) && !log.isCancelled" @click="$emit('cancel-transaction', log)" class="text-rose-600 hover:text-rose-800 text-[10px] font-bold underline">Cancel</button>
                                        </td>
                                    </tr>
                                    <tr v-if="filteredSparepartLogsIn.length === 0">
                                        <td colspan="6" class="p-6 text-center text-slate-400 italic text-[11px]">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        <div v-if="filteredSparepartLogsIn.length > 0" class="flex items-center justify-between gap-2 pt-2">
                            <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((dashboardSparepartInPage - 1) * dashboardPageSize) + 1 }}–{{ Math.min(dashboardSparepartInPage * dashboardPageSize, filteredSparepartLogsIn.length) }} dari {{ filteredSparepartLogsIn.length }} data</span>
                            <div class="flex items-center gap-1">
                                <button @click="$emit('update:dashboard-sparepart-in-page', Math.max(1, dashboardSparepartInPage - 1))" :disabled="dashboardSparepartInPage <= 1" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                                <span class="px-2 py-1 text-[9px] font-bold text-slate-700">{{ dashboardSparepartInPage }} / {{ dashboardSparepartInPageCount }}</span>
                                <button @click="$emit('update:dashboard-sparepart-in-page', Math.min(dashboardSparepartInPageCount, dashboardSparepartInPage + 1))" :disabled="dashboardSparepartInPage >= dashboardSparepartInPageCount" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                            </div>
                        </div>
                
                        </div>
                    </div>
                    <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-amber-600">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span class="font-bold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                                <i data-lucide="arrow-up-right" class="w-4 h-4 text-amber-600"></i> Sparepart Keluar (Outbound)
                            </span>
                            <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">{{ filteredSparepartLogsOut.length }} Records</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs excel-print-table">
                                <thead class="bg-amber-50/70 font-bold text-amber-900 uppercase text-[9px] sticky top-0 border-b border-amber-200">
                                    <tr>
                                        <th class="p-2">Tgl</th>
                                        <th class="p-2">Nama Barang</th>
                                        <th class="p-2 text-center">Satuan</th>
                                        <th class="p-2 text-center">Qty</th>
                                        <th class="p-2 text-center">Qty Awal</th>
                                        <th class="p-2 text-center">Qty Akhir</th>
                                        <th class="p-2">Penerima</th>
                                        <th class="p-2">Keterangan</th>
                                        <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Satuan</th>
                                        <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Total</th>
                                        <th class="p-2 text-center no-print">Status / Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="log in paginatedDashboardSparepartOut" :key="log.id" class="hover:bg-amber-50/30" :class="isCancelledLog(log) ? 'bg-rose-50/70 opacity-80' : ''">
                                        <td class="p-2 text-slate-500 text-[10px] font-mono">
                                            {{ log.tgl }}
                                            <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                        </td>
                                        <td class="p-2 font-bold text-slate-800 uppercase">{{ log.nama }}</td>
                                        <td class="p-2 text-center font-bold text-slate-700">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                        <td class="p-2 text-center font-bold text-amber-700 bg-amber-50/50 rounded">-{{ getLogDisplayQty(log) }}</td>
                                        <td class="p-2 text-center">{{ log.qtyAwal ?? '-' }}</td>
                                        <td class="p-2 text-center font-bold">{{ log.qtyAkhir ?? '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.penerima || log.user || '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                        <td v-if="sparepartShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                        <td v-if="sparepartShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                        <td class="p-2 text-center no-print">
                                            <span :class="isCancelledLog(log) ? 'text-rose-600' : (isPendingLog(log) ? 'text-amber-600' : 'text-emerald-600')" class="text-[9px] font-bold block">{{ approvalLabel(log) }}</span>
                                            <button v-if="canApprove && isPendingLog(log)" @click="$emit('approve-transaction', log)" class="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold underline">Setujui</button>
                                            <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="$emit('edit-log', log)" class="text-amber-600 hover:text-amber-800 text-[10px] font-bold underline">Edit</button>
                                            <button v-if="canEdit && !isPendingLog(log) && !log.isCancelled" @click="$emit('cancel-transaction', log)" class="text-rose-600 hover:text-rose-800 text-[10px] font-bold underline">Cancel</button>
                                        </td>
                                    </tr>
                                    <tr v-if="filteredSparepartLogsOut.length === 0">
                                        <td colspan="11" class="p-6 text-center text-slate-400 italic text-[11px]">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        <div v-if="filteredSparepartLogsOut.length > 0" class="flex items-center justify-between gap-2 pt-2">
                            <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((dashboardSparepartOutPage - 1) * dashboardPageSize) + 1 }}–{{ Math.min(dashboardSparepartOutPage * dashboardPageSize, filteredSparepartLogsOut.length) }} dari {{ filteredSparepartLogsOut.length }} data</span>
                            <div class="flex items-center gap-1">
                                <button @click="$emit('update:dashboard-sparepart-out-page', Math.max(1, dashboardSparepartOutPage - 1))" :disabled="dashboardSparepartOutPage <= 1" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                                <span class="px-2 py-1 text-[9px] font-bold text-slate-700">{{ dashboardSparepartOutPage }} / {{ dashboardSparepartOutPageCount }}</span>
                                <button @click="$emit('update:dashboard-sparepart-out-page', Math.min(dashboardSparepartOutPageCount, dashboardSparepartOutPage + 1))" :disabled="dashboardSparepartOutPage >= dashboardSparepartOutPageCount" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                            </div>
                        </div>
                
                        </div>
                    </div>
                </div>
            </div>
            <!-- SECTION 2: GUDANG SISA PROJECT (IN & OUT DASHBOARD) -->
            <div class="space-y-3 pt-4">
                <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <i data-lucide="boxes" class="w-5 h-5 text-teal-700"></i>
                    <h2 class="font-extrabold text-slate-800 uppercase text-xs tracking-wider">Pergerakan Stok: Gudang Sisa Project (Inbound & Outbound)</h2><button @click="$emit('update:sisa-project-show-prices', !sisaProjectShowPrices)" class="ml-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200">{{ sisaProjectShowPrices ? 'Hide Harga' : 'Tampilkan Harga' }}</button>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-emerald-600">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span class="font-bold text-xs uppercase text-emerald-900 flex items-center gap-1.5">
                                <i data-lucide="arrow-down-left" class="w-4 h-4 text-emerald-600"></i> Sisa Project Masuk (Inbound)
                            </span>
                            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">{{ filteredProjectLogsIn.length }} Records</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs excel-print-table">
                                <thead class="bg-emerald-50/70 font-bold text-emerald-900 uppercase text-[9px] sticky top-0 border-b border-emerald-200">
                                    <tr>
                                        <th class="p-2">Tgl</th>
                                        <th class="p-2">Nama Barang</th>
                                        <th class="p-2 text-center">Satuan</th>
                                        <th class="p-2 text-center">Qty</th>
                                        <th class="p-2 text-center">Qty Awal</th>
                                        <th class="p-2 text-center">Qty Akhir</th>
                                        <th class="p-2">Asal / Kepentingan</th>
                                        <th class="p-2">Keterangan</th>
                                        <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Satuan</th>
                                        <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Total</th>
                                        <th class="p-2 text-center no-print">Status / Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="log in paginatedDashboardSisaProjectIn" :key="log.id" class="hover:bg-emerald-50/30" :class="isCancelledLog(log) ? 'bg-rose-50/70 opacity-80' : ''">
                                        <td class="p-2 text-slate-500 text-[10px] font-mono">
                                            {{ log.tgl }}
                                            <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                        </td>
                                        <td class="p-2 font-bold text-slate-800 uppercase">{{ log.nama }}</td>
                                        <td class="p-2 text-center font-bold text-slate-700">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                        <td class="p-2 text-center font-bold text-emerald-700 bg-emerald-50/50 rounded">+{{ getLogDisplayQty(log) }}</td>
                                        <td class="p-2 text-center">{{ log.qtyAwal ?? '-' }}</td>
                                        <td class="p-2 text-center font-bold">{{ log.qtyAkhir ?? '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.supplier || log.keperluan || '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                        <td v-if="sisaProjectShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                        <td v-if="sisaProjectShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                        <td class="p-2 text-center no-print">
                                            <span :class="isCancelledLog(log) ? 'text-rose-600' : (isPendingLog(log) ? 'text-amber-600' : 'text-emerald-600')" class="text-[9px] font-bold block">{{ approvalLabel(log) }}</span>
                                            <button v-if="canApprove && isPendingLog(log)" @click="$emit('approve-transaction', log)" class="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold underline">Setujui</button>
                                            <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="$emit('edit-log', log)" class="text-amber-600 hover:text-amber-800 text-[10px] font-bold underline">Edit</button>
                                        </td>
                                    </tr>
                                    <tr v-if="filteredProjectLogsIn.length === 0">
                                        <td colspan="9" class="p-6 text-center text-slate-400 italic text-[11px]">Belum ada data barang masuk sisa project pada periode ini.</td>
                                    </tr>
                                </tbody>
                            </table>
                        <div v-if="filteredProjectLogsIn.length > 0" class="flex items-center justify-between gap-2 pt-2">
                            <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((dashboardSisaProjectInPage - 1) * dashboardPageSize) + 1 }}–{{ Math.min(dashboardSisaProjectInPage * dashboardPageSize, filteredProjectLogsIn.length) }} dari {{ filteredProjectLogsIn.length }} data</span>
                            <div class="flex items-center gap-1">
                                <button @click="$emit('update:dashboard-sisa-project-in-page', Math.max(1, dashboardSisaProjectInPage - 1))" :disabled="dashboardSisaProjectInPage <= 1" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                                <span class="px-2 py-1 text-[9px] font-bold text-slate-700">{{ dashboardSisaProjectInPage }} / {{ dashboardSisaProjectInPageCount }}</span>
                                <button @click="$emit('update:dashboard-sisa-project-in-page', Math.min(dashboardSisaProjectInPageCount, dashboardSisaProjectInPage + 1))" :disabled="dashboardSisaProjectInPage >= dashboardSisaProjectInPageCount" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                            </div>
                        </div>
                
                        </div>
                    </div>
                    <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-amber-600">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span class="font-bold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                                <i data-lucide="arrow-up-right" class="w-4 h-4 text-amber-600"></i> Sisa Project Keluar (Outbound)
                            </span>
                            <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">{{ filteredProjectLogsOut.length }} Records</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs excel-print-table">
                                <thead class="bg-amber-50/70 font-bold text-amber-900 uppercase text-[9px] sticky top-0 border-b border-amber-200">
                                    <tr>
                                        <th class="p-2">Tgl</th>
                                        <th class="p-2">Nama Barang</th>
                                        <th class="p-2 text-center">Satuan</th>
                                        <th class="p-2 text-center">Qty</th>
                                        <th class="p-2 text-center">Qty Awal</th>
                                        <th class="p-2 text-center">Qty Akhir</th>
                                        <th class="p-2">Penerima</th>
                                        <th class="p-2">Keterangan</th>
                                        <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Satuan</th>
                                        <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Total</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="log in paginatedDashboardSisaProjectOut" :key="log.id" class="hover:bg-amber-50/30" :class="isCancelledLog(log) ? 'bg-rose-50/70 opacity-80' : ''">
                                        <td class="p-2 text-slate-500 text-[10px] font-mono">
                                            {{ log.tgl }}
                                            <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                        </td>
                                        <td class="p-2 font-bold text-slate-800 uppercase">{{ log.nama }}</td>
                                        <td class="p-2 text-center font-bold text-slate-700">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                        <td class="p-2 text-center font-bold text-amber-700 bg-amber-50/50 rounded">-{{ getLogDisplayQty(log) }}</td>
                                        <td class="p-2 text-center">{{ log.qtyAwal ?? '-' }}</td>
                                        <td class="p-2 text-center font-bold">{{ log.qtyAkhir ?? '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.penerima || log.user || '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                        <td v-if="sisaProjectShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                        <td v-if="sisaProjectShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                        <td class="p-2 text-center no-print">
                                            <span :class="isCancelledLog(log) ? 'text-rose-600' : (isPendingLog(log) ? 'text-amber-600' : 'text-emerald-600')" class="text-[9px] font-bold block">{{ approvalLabel(log) }}</span>
                                            <button v-if="canApprove && isPendingLog(log)" @click="$emit('approve-transaction', log)" class="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold underline">Setujui</button>
                                            <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="$emit('edit-log', log)" class="text-amber-600 hover:text-amber-800 text-[10px] font-bold underline">Edit</button>
                                        </td>
                                    </tr>
                                    <tr v-if="filteredProjectLogsOut.length === 0">
                                        <td colspan="11" class="p-6 text-center text-slate-400 italic text-[11px]">Belum ada data barang keluar sisa project pada periode ini.</td>
                                    </tr>
                                </tbody>
                            </table>
                        <div v-if="filteredProjectLogsOut.length > 0" class="flex items-center justify-between gap-2 pt-2">
                            <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((dashboardSisaProjectOutPage - 1) * dashboardPageSize) + 1 }}–{{ Math.min(dashboardSisaProjectOutPage * dashboardPageSize, filteredProjectLogsOut.length) }} dari {{ filteredProjectLogsOut.length }} data</span>
                            <div class="flex items-center gap-1">
                                <button @click="$emit('update:dashboard-sisa-project-out-page', Math.max(1, dashboardSisaProjectOutPage - 1))" :disabled="dashboardSisaProjectOutPage <= 1" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                                <span class="px-2 py-1 text-[9px] font-bold text-slate-700">{{ dashboardSisaProjectOutPage }} / {{ dashboardSisaProjectOutPageCount }}</span>
                                <button @click="$emit('update:dashboard-sisa-project-out-page', Math.min(dashboardSisaProjectOutPageCount, dashboardSisaProjectOutPage + 1))" :disabled="dashboardSisaProjectOutPage >= dashboardSisaProjectOutPageCount" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                            </div>
                        </div>
                
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
import { formatRupiah } from '../lib/format';

export default {
    props: {
        masterCount: { type: Number, default: 0 },
        totalSparepartQty: { type: Number, default: 0 },
        totalSisaProjectQty: { type: Number, default: 0 },
        purchasePendingCount: { type: Number, default: 0 },
        lowStockItems: { type: Array, default: () => [] },
        canEdit: { type: Boolean, default: false },
        canPrint: { type: Boolean, default: false },
        canApprove: { type: Boolean, default: false },
        canInputTransaction: { type: Boolean, default: false },
        dashFilterDateStart: { type: String, default: '' },
        dashFilterDateEnd: { type: String, default: '' },
        dashSearchBarang: { type: String, default: '' },
        sparepartShowPrices: { type: Boolean, default: true },
        sisaProjectShowPrices: { type: Boolean, default: true },
        filteredSparepartLogsIn: { type: Array, default: () => [] },
        filteredSparepartLogsOut: { type: Array, default: () => [] },
        filteredProjectLogsIn: { type: Array, default: () => [] },
        filteredProjectLogsOut: { type: Array, default: () => [] },
        paginatedDashboardSparepartIn: { type: Array, default: () => [] },
        paginatedDashboardSparepartOut: { type: Array, default: () => [] },
        paginatedDashboardSisaProjectIn: { type: Array, default: () => [] },
        paginatedDashboardSisaProjectOut: { type: Array, default: () => [] },
        dashboardSparepartInPage: { type: Number, default: 1 },
        dashboardSparepartOutPage: { type: Number, default: 1 },
        dashboardSisaProjectInPage: { type: Number, default: 1 },
        dashboardSisaProjectOutPage: { type: Number, default: 1 },
        dashboardPageSize: { type: Number, default: 10 },
        dashboardSparepartInPageCount: { type: Number, default: 1 },
        dashboardSparepartOutPageCount: { type: Number, default: 1 },
        dashboardSisaProjectInPageCount: { type: Number, default: 1 },
        dashboardSisaProjectOutPageCount: { type: Number, default: 1 },
        getMasterSatuan: { type: Function, required: true },
        getLogDisplayQty: { type: Function, required: true },
        getMasterHarga: { type: Function, required: true },
        isCancelledLog: { type: Function, required: true },
        isPendingLog: { type: Function, required: true },
        approvalLabel: { type: Function, required: true },
    },
    emits: ['export-low-stock', 'reset-dash-filter', 'print-daily-report', 'export-dashboard', 'approve-transaction', 'edit-log', 'cancel-transaction', 'update:dash-filter-date-start', 'update:dash-filter-date-end', 'update:dash-search-barang', 'update:sparepart-show-prices', 'update:sisa-project-show-prices', 'update:dashboard-sparepart-in-page', 'update:dashboard-sparepart-out-page', 'update:dashboard-sisa-project-in-page', 'update:dashboard-sisa-project-out-page'],
    methods: { formatRupiah },
};
</script>

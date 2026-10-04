<template>
        <div v-if="activeTab === 'monitoring'" class="space-y-6">
            <div class="flex flex-wrap justify-between items-center gap-3 no-print">
                <button v-if="canInputTransaction" @click="openMonitoringInputModal" class="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase flex items-center gap-2 shadow-md transition-all">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i> + Input Purchase Request Baru
                </button>
                <label v-if="canInputTransaction" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase flex items-center gap-2 shadow-md cursor-pointer transition-all">
                    <i data-lucide="upload" class="w-4 h-4"></i> Import Purchase Request Excel
                    <input type="file" @change="importMonitoringExcel" accept=".xlsx, .xls" class="hidden"/>
                </label>
                <button v-if="canPrint" @click="printLogSection('monitoring-print-area')" class="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                    <i data-lucide="printer" class="w-4 h-4"></i> Cetak Purchase Request
                </button>
                <button v-if="canEdit" @click="exportPurchaseRequestExcel" class="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                    <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> Export Purchase Request
                </button>
            </div>
            <div class="portal-card p-4 rounded-xl space-y-3 no-print">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                    <i data-lucide="filter" class="w-4 h-4 text-emerald-600"></i> Filter Purchase Request:
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Dari Tanggal</label>
                        <input :value="monFilterDateStart" @input="$emit('update:mon-filter-date-start', $event.target.value)" type="date" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Sampai Tanggal</label>
                        <input :value="monFilterDateEnd" @input="$emit('update:mon-filter-date-end', $event.target.value)" type="date" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Filter Status</label>
                        <select :value="monFilterStatus" @change="$emit('update:mon-filter-status', $event.target.value)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase">
                            <option value="">-- SEMUA STATUS --</option>
                            <option value="Pending">Pending</option>
                            <option value="Diterima Sebagian">Diterima Sebagian</option>
                            <option value="Diterima Semua">Diterima Semua</option>
                            <option value="Cancel">Cancel Order</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Cari Nama Barang</label>
                        <input :value="monFilterBarang" @input="$emit('update:mon-filter-barang', $event.target.value)" @click.stop @mousedown.stop type="text" placeholder="Nama barang..." class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium uppercase">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Cari Keterangan / Project</label>
                        <input :value="monFilterProject" @input="$emit('update:mon-filter-project', $event.target.value)" @click.stop @mousedown.stop type="text" placeholder="Keterangan / project..." class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium uppercase">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Short Data</label>
                        <select :value="monSort" @change="$emit('update:mon-sort', $event.target.value)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase">
                            <option value="priority_desc">Prioritas: Angka Terkecil → Terbesar</option>
                            <option value="priority_asc">Prioritas: Angka Terbesar → Terkecil</option>
                            <option value="date_desc">Tanggal: Terbaru → Terlama</option>
                            <option value="date_asc">Tanggal: Terlama → Terbaru</option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- TABEL MONITORING (PRINTABLE AREA - EXCEL STYLE) -->
            <div id="monitoring-print-area" class="portal-card rounded-xl overflow-hidden print-area">
                <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center no-print">
                    <div class="flex items-center gap-2">
                        <i data-lucide="list-checks" class="w-4 h-4 text-emerald-600"></i>
                        <h3 class="font-bold text-slate-800 uppercase text-xs tracking-wider">Tabel Data Purchase Request</h3>
                    </div>
                    <span class="text-[11px] font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-200/60">{{ filteredMonitoringItems.length }} Record Order</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs excel-print-table">
                        <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                            <tr>
                                <th class="p-3 text-center">No</th>
                                <th class="p-3 text-center">Tgl Order</th>
                                <th class="p-3 text-center">No. PR</th>
                                <th class="p-3 sparepart-name">Nama Barang</th>
                                 <th class="p-3 text-center">Satuan</th>
                                <th class="p-3 text-center">Total Order</th>
                                <th class="p-3 text-center">Diterima</th>
                                <th class="p-3 text-center">Sisa Order</th>
                                <th class="p-3 text-left">Keterangan</th>
                                <th class="p-3 text-center">Skala Prioritas</th>
                                <th class="p-3 text-center no-print">Aksi</th>
                                <th class="p-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(order, idx) in filteredMonitoringItems.slice((purchaseRequestPage - 1) * purchaseRequestPageSize, purchaseRequestPage * purchaseRequestPageSize)" :key="order.id" class="hover:bg-slate-50">
                                <td class="p-3 text-center font-bold text-slate-400">{{ ((purchaseRequestPage - 1) * purchaseRequestPageSize) + idx + 1 }}</td>
                                <!-- REVISI 1 (MONITORING): Jam dihilangkan, hanya menampilkan tanggal -->
                                <td class="p-3 text-center font-mono text-slate-600 font-bold">{{ order.tgl }}</td>
                                <td class="p-3 text-center font-bold text-slate-700">{{ order.nomorPR || '-' }}</td>
                                <td class="p-3 font-bold text-slate-800 uppercase">
                                    {{ order.nama }}
                                </td>
                                 <td class="p-3 text-center font-bold text-slate-700 uppercase">{{ order.satuan || 'Pcs' }}</td>
                                <td class="p-3 text-center font-bold text-slate-700 uppercase">
                                    {{ order.qtyTotal }} {{ order.satuan }}
                                </td>
                                <td class="p-3 text-center font-bold text-emerald-600 uppercase">
                                    {{ order.qtyReceived }} {{ order.satuan }}
                                </td>
                                <td class="p-3 text-center font-bold text-amber-600 uppercase">
                                    {{ order.qtyRemaining }} {{ order.satuan }}
                                </td>
                                <td class="p-3 font-extrabold text-xs text-emerald-900 uppercase bg-emerald-50/40 rounded-lg">
                                    {{ order.keperluan || order.project || '-' }}
                                </td>
                                <td class="p-3 text-center">
                                    <span v-if="order.prioritas" class="px-2 py-0.5 text-[9px] font-bold rounded border bg-slate-100 text-slate-800 border-slate-200">{{ order.prioritas }}</span>
                                    <span v-else class="text-[9px] font-bold text-slate-400 uppercase">Belum diatur</span>
                                </td>
                                <td class="p-3 text-center no-print">
                                    <select @change="$emit('monitoring-row-action', $event, order)" :disabled="!canInputTransaction && !canEdit || order.status === 'Diterima Semua'" class="w-full min-w-[110px] px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-700 outline-none focus:border-emerald-500">
                                        <option value="">Pilih Aksi</option>
                                        <option v-if="canInputTransaction && order.status !== 'Diterima Semua'" value="edit">Edit</option>
                                        <option v-if="canInputTransaction && order.status !== 'Cancel' && order.status !== 'Diterima Semua'" value="terima">Terima</option>
                                        <option v-if="canEdit && order.status !== 'Cancel'" value="cancel">Cancel</option>
                                    </select>
                                </td>
                                <td class="p-3 text-center">
                                    <span v-if="order.status === 'Diterima Semua'" class="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-200 uppercase">Diterima Semua</span>
                                    <span v-else-if="order.status === 'Diterima Sebagian'" class="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded border border-blue-200 uppercase">Diterima Sebagian</span>
                                    <span v-else-if="order.status === 'Cancel'" class="bg-rose-100 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded border border-rose-200 uppercase">Canceled</span>
                                    <span v-else class="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-200 uppercase">Pending</span>
                                </td>
                            </tr>
                            <tr v-if="filteredMonitoringItems.length === 0"><td colspan="12" class="p-8 text-center text-slate-400 font-medium">Tidak ada data purchase request yang sesuai filter.</td></tr>
                        </tbody>
                        <tfoot v-if="filteredMonitoringItems.length > 0" class="bg-amber-50 border-t-2 border-amber-200">
                            <tr class="font-black text-amber-900">
                                <td colspan="10" class="p-3 text-right uppercase text-[11px] tracking-wider">Total Nilai Order (sesuai filter)</td>
                                <td class="p-3 text-right whitespace-nowrap">{{ formatRupiah(monitoringTotalHarga) }}</td>
                                <td colspan="4" class="p-3 no-print"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div v-if="filteredMonitoringItems.length > purchaseRequestPageSize" class="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3 no-print">
                    <p class="text-[10px] text-slate-500">Menampilkan {{ ((purchaseRequestPage - 1) * purchaseRequestPageSize) + 1 }}–{{ Math.min(purchaseRequestPage * purchaseRequestPageSize, filteredMonitoringItems.length) }} dari {{ filteredMonitoringItems.length }} data</p>
                    <div class="flex items-center gap-2">
                        <button type="button" @click="$emit('update:purchase-request-page', Math.max(1, purchaseRequestPage - 1))" :disabled="purchaseRequestPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Sebelumnya</button>
                        <span class="px-2 text-[10px] font-black text-slate-600">Halaman {{ Math.min(purchaseRequestPage, Math.ceil(filteredMonitoringItems.length / purchaseRequestPageSize)) }} / {{ Math.ceil(filteredMonitoringItems.length / purchaseRequestPageSize) }}</span>
                        <button type="button" @click="$emit('update:purchase-request-page', Math.min(Math.ceil(filteredMonitoringItems.length / purchaseRequestPageSize), purchaseRequestPage + 1))" :disabled="purchaseRequestPage >= Math.ceil(filteredMonitoringItems.length / 10)" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Berikutnya</button>
                    </div>
                </div>
            </div>
            <div class="space-y-4 pt-4 border-t border-slate-200 no-print">
                <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-emerald-600">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span class="font-extrabold text-xs uppercase text-emerald-900 flex items-center gap-2">
                            <i data-lucide="history" class="w-5 h-5 text-emerald-600"></i> History Penerimaan Purchase Request
                        </span>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">{{ monitoringHistoryIn.length }} Transaksi</span>
                    </div>
                    <div class="pr-history-scroll overflow-auto custom-scroll max-h-[430px] rounded-lg border border-slate-100">
                        <table class="w-full min-w-[1240px] text-left text-xs excel-print-table pr-history-table">
                            <thead class="bg-emerald-50/70 font-bold text-emerald-900 uppercase text-[9px] border-b border-emerald-200 sticky top-0">
                                <tr>
                                    <th class="p-2.5 text-center">No</th>
                                    <th class="p-2.5 text-center">Tgl Penerimaan</th>
                                    <th class="p-2.5 text-center">No. PO</th>
                                    <th class="p-2.5">Supplier</th>
                                    <th class="p-2.5">Nama Barang</th>
                                    <th class="p-2.5 text-center">Satuan</th>
                                    <th class="p-2.5 text-center">Total Order</th>
                                    <th class="p-2.5 text-center">Diterima</th>
                                    <th class="p-2.5 text-center">Sisa Order</th>
                                    <th class="p-2.5">Keterangan</th>
                                    <th class="p-2.5 text-center no-print w-[180px]">Aksi</th>
                                    <th class="p-2.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="(h, idx) in paginatedPurchaseRequestHistory" :key="h.id" :class="isCancelledLog(h) ? 'bg-rose-50/70' : 'hover:bg-emerald-50/30'">
                                    <td class="p-2.5 text-center font-bold text-slate-400">{{ purchaseRequestHistoryPageStart + idx }}</td>
                                    <td class="p-2.5 text-center font-mono text-slate-600 font-bold text-[10px]">
                                        <div>{{ h.tgl || '-' }}</div>
                                        <div class="text-[9px] text-emerald-700 font-black mt-1">No. PR: {{ h._nomorPR }}</div>
                                    </td>
                                    <td class="p-2.5 text-center font-bold text-slate-700">{{ h._nomorPO }}</td>
                                    <td class="p-2.5 font-bold text-slate-700 uppercase">{{ h._supplier }}</td>
                                    <td class="p-2.5 font-bold text-slate-800 uppercase">{{ h.nama }}</td>
                                    <td class="p-2.5 text-center font-bold text-slate-700 uppercase">{{ h._satuan }}</td>
                                    <td class="p-2.5 text-center font-bold text-slate-700">{{ h._qtyTotal }} {{ h._satuan }}</td>
                                    <td class="p-2.5 text-center font-bold text-emerald-700">{{ h._qtyReceived }} {{ h._satuan }}</td>
                                    <td class="p-2.5 text-center font-bold text-amber-600">{{ h._qtyRemaining }} {{ h._satuan }}</td>
                                    <td class="p-2.5 font-extrabold text-xs text-emerald-900 uppercase">{{ h.keperluan || h.project || '-' }}</td>
                                    <td class="p-2.5 text-center no-print align-middle">
                                        <div class="pr-history-actions flex flex-wrap justify-center items-center gap-1.5 max-w-[180px] mx-auto">
                                            <button v-if="h.qty > 0 && !isCancelledLog(h) && canPrint" @click="printBAST(h)" class="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg font-bold text-[9px] uppercase shadow-sm whitespace-nowrap">BAST</button>
                                            <button v-if="h.qty > 0 && !isCancelledLog(h) && canEdit" @click="cancelPurchaseReceipt(h)" class="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg font-bold text-[9px] uppercase shadow-sm whitespace-nowrap">Cancel</button>
                                            <button v-if="(isPendingLog(h) && canInputTransaction) || (!isPendingLog(h) && canEdit)" @click="editLog(h)" class="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 px-2.5 py-1.5 rounded-lg font-bold text-[9px] uppercase whitespace-nowrap">Edit</button>
                                        </div>
                                    </td>
                                    <td class="p-2.5 text-center align-middle">
                                        <div class="pr-history-status flex flex-col items-center justify-center gap-1.5 min-w-[125px]">
                                            <span v-if="isCancelledLog(h)" class="w-full px-2 py-1 text-[9px] font-black rounded border bg-rose-100 text-rose-800 border-rose-200 uppercase whitespace-nowrap">🚫 DIBATALKAN</span>
                                            <span v-else :class="h.status === 'Diterima Semua' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : (h.status === 'Diterima Sebagian' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-amber-100 text-amber-800 border-amber-200')" class="w-full px-2 py-1 text-[9px] font-bold rounded border uppercase whitespace-nowrap">{{ h.status || 'Pending' }}</span>
                                            <span v-if="!isCancelledLog(h)" class="w-full px-2 py-1 text-[8px] font-bold rounded border whitespace-nowrap" :class="String(h.approvalStatus || 'approved').toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'">{{ String(h.approvalStatus || 'approved').toLowerCase() === 'pending' ? 'Belum Disetujui' : 'Sudah Disetujui' }}</span>
                                            <span v-else class="w-full px-2 py-1 text-[8px] font-bold rounded border bg-slate-100 text-slate-600 border-slate-200 whitespace-nowrap">Tidak memengaruhi stok</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="monitoringHistoryIn.length === 0"><td colspan="12" class="p-6 text-center text-slate-400 italic text-[11px]">Belum ada riwayat penerimaan order.</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="purchaseRequestHistoryPageCount > 1" class="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3 no-print">
                        <p class="text-[10px] text-slate-500">Menampilkan {{ purchaseRequestHistoryPageStart }}–{{ purchaseRequestHistoryPageEnd }} dari {{ monitoringHistoryDisplay.length }} data</p>
                        <div class="flex items-center gap-2">
                            <button type="button" @click="$emit('update:purchase-request-history-page', Math.max(1, purchaseRequestHistoryPage - 1))" :disabled="purchaseRequestHistoryPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Sebelumnya</button>
                            <span class="px-2 text-[10px] font-black text-slate-600">Halaman {{ Math.min(purchaseRequestHistoryPage, purchaseRequestHistoryPageCount) }} / {{ purchaseRequestHistoryPageCount }}</span>
                            <button type="button" @click="$emit('update:purchase-request-history-page', Math.min(purchaseRequestHistoryPageCount, purchaseRequestHistoryPage + 1))" :disabled="purchaseRequestHistoryPage >= purchaseRequestHistoryPageCount" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Berikutnya</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <!-- MODAL 1: INPUT MONITORING ORDER -->
    <!-- REVISI 1 & 2: Ketik Manual Dulu Baru Ada Pilihan Data Master + Kepentingan Spesifik Per Barang -->
    <div v-if="showMonitoringInputModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-3xl w-full p-4 space-y-3 shadow-2xl max-h-[85vh] flex flex-col">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 class="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
                    <i data-lucide="plus-square" class="w-5 h-5 text-emerald-600"></i>
                    Input Purchase Request Baru
                </h3>
                <button @click="$emit('update:show-monitoring-input-modal', false)" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>
            <div class="space-y-3 overflow-y-auto custom-scroll pr-1 flex-1">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Tanggal Transaksi / Tanggal Order *</label>
                        <input v-model="formOrderMulti.tanggal" type="date" required class="w-full p-2.5 bg-emerald-50 font-extrabold text-sm border-2 border-emerald-500 rounded-lg outline-none focus:ring-2 focus:ring-emerald-200">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Nomor Purchase Request *</label>
                        <input v-model="formOrderMulti.nomorPR" @input="onPurchaseRequestHeaderInput" type="text" required autocomplete="off" placeholder="Input nomor Purchase Request secara manual" class="w-full p-2.5 bg-white font-extrabold text-sm border-2 border-slate-300 rounded-lg outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Nomor Purchase Order</label>
                        <input v-model="formOrderMulti.nomorPO" type="text" autocomplete="off" placeholder="Nomor PO" class="w-full p-2.5 bg-white font-extrabold text-sm border-2 border-slate-300 rounded-lg outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Supplier</label>
                        <input v-model="formOrderMulti.supplier" type="text" autocomplete="off" placeholder="Nama supplier" class="w-full p-2.5 bg-white font-extrabold text-sm border-2 border-slate-300 rounded-lg outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Nama Pemesan *</label>
                        <input v-model="formOrderMulti.pemesan" type="text" required autocomplete="off" placeholder="Nama pemesan" class="w-full p-2.5 bg-white font-extrabold text-sm border-2 border-slate-300 rounded-lg outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-rose-700 uppercase block mb-1">Skala Prioritas *</label>
                        <input v-model.number="formOrderMulti.prioritas" type="number" min="1" step="1" :readonly="hasExistingPurchaseRequest" :placeholder="hasExistingPurchaseRequest ? ('Otomatis: ' + formOrderMulti.prioritas) : '1, 2, 3, ...'" class="w-full p-2.5 bg-white font-bold text-sm border-2 border-rose-300 rounded-lg outline-none focus:border-rose-500" :class="hasExistingPurchaseRequest ? 'bg-slate-100 cursor-not-allowed' : ''">
                        <span v-if="hasExistingPurchaseRequest" class="text-[8px] font-bold text-rose-600 uppercase block mt-1">Nomor PR ini sudah memiliki skala prioritas yang sama.</span>
                    </div>
                </div>
                <div>
                    <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Keterangan *</label>
                    <input v-model="formOrderMulti.keperluan" type="text" required placeholder="Contoh: GH-A / Maintenance" class="w-full p-2.5 bg-white font-semibold text-xs border border-slate-300 rounded-lg uppercase outline-none focus:border-emerald-500">
                </div>
                <div class="w-full max-w-2xl mx-auto flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span class="text-xs font-bold text-slate-700 uppercase">Daftar Barang Order:</span>
                    <button @click="addManualItemToMonitoring" class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg uppercase shadow-sm flex items-center gap-1">
                        + Tambah Item Order
                    </button>
                </div>
                <div class="space-y-3">
                    <div v-for="(item, idx) in formOrderMulti.itemsToProcess" :key="idx" class="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 space-y-2">
                        <div class="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span class="text-xs font-black text-emerald-800 uppercase">Item #{{ idx + 1 }}</span>
                            <button @click="removeMonitoringItemToProcess(idx)" class="text-rose-500 hover:text-rose-700 font-bold text-xs flex items-center gap-1">
                                &times; Hapus Item
                            </button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                            <!-- Input Nama Barang Manual dengan Saran Datalist dari Master -->
                            <div class="md:col-span-5">
                                <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Nama Barang (Ketik / Pilih Master)</label>
                                <div class="relative flex-1 mr-2">
                                <input v-model="item.nama" @focus="openMasterDropdown('monitoring-' + idx, item, $event)" @click="openMasterDropdown('monitoring-' + idx, item, $event)" @input="updateMasterDropdown('monitoring-' + idx, item, $event); onMonitoringItemInput(item)" :data-master-dropdown-input="'monitoring-' + idx" type="text" placeholder="Ketik nama barang..." class="w-full p-2 bg-white font-bold text-xs uppercase border border-slate-300 rounded-lg outline-none focus:border-emerald-500">
                            </div>
                            </div>
                            <!-- Qty Order -->
                            <div class="md:col-span-2">
                                <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Qty</label>
                                <input v-model.number="item.orderQty" type="number" min="1" placeholder="Qty" class="w-full p-2 bg-white font-bold text-xs text-center border border-slate-300 rounded-lg outline-none focus:border-emerald-500">
                            </div>
                            <!-- Satuan -->
                            <div class="md:col-span-2">
                                <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Satuan</label>
                                <input :value="getMasterSatuan(item.nama, item.orderSatuan || 'Pcs')" type="text" readonly placeholder="Satuan dari Data Master" class="w-full p-2 bg-slate-100 font-semibold text-xs text-center border border-slate-300 rounded-lg uppercase outline-none">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                            <div>
                                <label class="text-[9px] font-bold text-amber-700 uppercase block mb-1">Harga Satuan (Rp)</label>
                                <input v-model.number="item.harga" type="number" min="0" step="any" placeholder="0" class="w-full p-2 bg-slate-100 font-bold text-xs border border-amber-300 rounded-lg outline-none" readonly>
                            </div>
                            <div class="flex items-end">
                                <div class="w-full p-2 bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200 rounded-lg uppercase">Pemesan &amp; skala prioritas mengikuti data PR di atas.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button @click="$emit('update:show-monitoring-input-modal', false)" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase">Batal</button>
                <button @click="simpanOrderMulti" class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase shadow-sm">Masukkan Ke Purchase Request</button>
            </div>
        </div>
    </div>

    <!-- MODAL PENERIMAAN PURCHASE REQUEST MULTI ITEM -->
    <div v-if="showPurchaseReceiptModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 no-print">
        <div class="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div class="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                    <h3 class="font-black text-slate-800 text-sm uppercase">Penerimaan Purchase Request</h3>
                    <p class="text-[10px] text-slate-500 mt-1">Format penerimaan dibuat satu form seperti Input Purchase Request. Semua item dalam No. PR diproses sekaligus.</p>
                </div>
                <button @click="$emit('update:show-purchase-receipt-modal',false)" class="text-slate-400 hover:text-slate-700 text-xl">&times;</button>
            </div>

            <div class="space-y-3 overflow-y-auto overflow-x-hidden custom-scroll pr-1 flex-1 w-full">
                <div class="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Tanggal Penerimaan *</label>
                        <input :value="purchaseReceiptDate" @input="$emit('update:purchase-receipt-date', $event.target.value)" type="date" required class="w-full p-2.5 bg-emerald-50 font-extrabold text-sm border-2 border-emerald-500 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Nomor Purchase Request</label>
                        <input :value="purchaseReceiptItems[0]?.nomorPR || '-'" type="text" readonly class="w-full p-2.5 bg-slate-100 font-extrabold text-sm border border-slate-200 rounded-xl uppercase text-slate-700">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Nomor Purchase Order *</label>
                        <input :value="purchaseReceiptPO" @input="$emit('update:purchase-receipt-po', $event.target.value)" type="text" required autocomplete="off" placeholder="Input nomor PO" class="w-full p-2.5 bg-white font-extrabold text-sm border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 uppercase">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Supplier *</label>
                        <input :value="purchaseReceiptSupplier" @input="$emit('update:purchase-receipt-supplier', $event.target.value)" type="text" required autocomplete="off" placeholder="Input nama supplier" class="w-full p-2.5 bg-white font-extrabold text-sm border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 uppercase">
                    </div>
                </div>

                <div class="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span class="text-xs font-bold text-slate-700 uppercase">Daftar Barang Penerimaan:</span>
                    <span class="text-[10px] font-bold text-emerald-700 uppercase">{{ purchaseReceiptItems.length }} Item</span>
                </div>

                <div class="w-full max-w-2xl mx-auto space-y-2 border-t border-slate-100 pt-3">
                    <div v-for="(item, idx) in purchaseReceiptItems" :key="item.orderId" class="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-2">
                        <div class="flex justify-between items-center">
                            <div class="font-bold text-xs uppercase text-slate-800">{{ idx + 1 }}. {{ item.nama }}</div>
                            <span class="text-[9px] font-bold text-slate-500 uppercase">Sisa Order: {{ item.qtyRemaining }} {{ item.satuan }}</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Qty Diterima</label>
                                <input v-model.number="item.qty" type="number" min="0" :max="item.qtyRemaining" class="w-full p-1.5 bg-white font-bold text-xs text-center border border-emerald-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Harga Satuan (Rp)</label>
                                <input v-model.number="item.harga" @mousedown.stop @click.stop type="number" min="0" step="any" class="w-full p-1.5 bg-white font-bold text-xs text-right border border-emerald-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Satuan</label>
                                <input :value="item.satuan" type="text" readonly class="w-full p-1.5 bg-slate-100 font-semibold text-xs text-center border border-emerald-300 rounded-md uppercase">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Total Harga</label>
                                <input :value="formatRupiah((Number(item.qty) || 0) * (Number(item.harga) || 0))" type="text" readonly class="w-full p-1.5 bg-slate-100 font-bold text-xs text-right border border-emerald-300 rounded-md">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button @click="$emit('update:show-purchase-receipt-modal',false)" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase">Batal</button>
                <button @click="submitPurchaseReceipt" class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase shadow-sm">Simpan Semua Penerimaan</button>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
export default {
    props: {
        activeTab: { default: null },
        canEdit: { default: null },
        canInputTransaction: { default: null },
        canPrint: { default: null },
        filteredMonitoringItems: { type: Array, default: () => [] },
        formOrderMulti: { type: Array, default: () => [] },
        hasExistingPurchaseRequest: { default: null },
        isCancelledLog: { default: null },
        isPendingLog: { default: null },
        monFilterBarang: { default: null },
        monFilterDateEnd: { default: null },
        monFilterDateStart: { default: null },
        monFilterProject: { default: null },
        monFilterStatus: { default: null },
        monSort: { default: null },
        monitoringHistoryDisplay: { type: Array, default: () => [] },
        monitoringHistoryIn: { type: Array, default: () => [] },
        monitoringTotalHarga: { default: null },
        paginatedPurchaseRequestHistory: { type: Array, default: () => [] },
        purchaseReceiptDate: { default: null },
        purchaseReceiptItems: { type: Array, default: () => [] },
        purchaseReceiptPO: { default: null },
        purchaseReceiptSupplier: { default: null },
        purchaseRequestHistoryPage: { default: null },
        purchaseRequestHistoryPageCount: { default: null },
        purchaseRequestHistoryPageEnd: { default: null },
        purchaseRequestHistoryPageStart: { default: null },
        purchaseRequestPage: { default: null },
        purchaseRequestPageSize: { default: null },
        showMonitoringInputModal: { default: null },
        showPurchaseReceiptModal: { default: null },
        addManualItemToMonitoring: { type: Function, required: true },
        cancelPurchaseReceipt: { type: Function, required: true },
        editLog: { type: Function, required: true },
        exportPurchaseRequestExcel: { type: Function, required: true },
        formatRupiah: { type: Function, required: true },
        getMasterSatuan: { type: Function, required: true },
        importMonitoringExcel: { type: Function, required: true },
        onMonitoringItemInput: { type: Function, required: true },
        onPurchaseRequestHeaderInput: { type: Function, required: true },
        openMasterDropdown: { type: Function, required: true },
        openMonitoringInputModal: { type: Function, required: true },
        printBAST: { type: Function, required: true },
        printLogSection: { type: Function, required: true },
        removeMonitoringItemToProcess: { type: Function, required: true },
        simpanOrderMulti: { type: Function, required: true },
        submitPurchaseReceipt: { type: Function, required: true },
        updateMasterDropdown: { type: Function, required: true },
    },
    emits: ['update:mon-filter-barang', 'update:mon-filter-date-end', 'update:mon-filter-date-start', 'update:mon-filter-project', 'update:mon-filter-status', 'update:mon-sort', 'update:purchase-receipt-date', 'update:purchase-receipt-po', 'update:purchase-receipt-supplier', 'update:purchase-request-history-page', 'update:purchase-request-page', 'update:show-monitoring-input-modal', 'update:show-purchase-receipt-modal', 'monitoring-row-action'],
};
</script>

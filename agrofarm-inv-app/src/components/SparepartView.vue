<template>
        <div v-if="activeTab === 'sparepart'" class="space-y-5 sparepart-layout">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 no-print sparepart-actions-grid">
                <div class="portal-card rounded-xl p-3 flex flex-wrap items-center gap-2 sparepart-actions-card">
                    <span class="text-[10px] font-black text-slate-500 uppercase mr-1">Aksi Gudang</span>
                    <button @click="startBarcodeScan('Sparepart')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="scan-barcode" class="w-4 h-4"></i> Scan Barcode
                    </button>
                    <button v-if="canInputTransaction" @click="openSparepartMultiOutModal" class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="minus-square" class="w-4 h-4"></i> Pengeluaran Multiple Sparepart
                    </button>
                    <button @click="$emit('update:sparepart-show-prices', !sparepartShowPrices)" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm border border-slate-200">
                        <i :data-lucide="sparepartShowPrices ? 'eye-off' : 'eye'" class="w-4 h-4"></i> {{ sparepartShowPrices ? 'Hide Harga' : 'Tampilkan Harga' }}
                    </button>
                </div>
                <div class="portal-card rounded-xl p-3 flex flex-wrap items-center gap-2 sparepart-actions-card">
                    <span class="text-[10px] font-black text-slate-500 uppercase mr-1">Tanggal & Cetak</span>
                    <div class="flex items-center gap-1">
                        <span class="text-[9px] font-bold text-slate-500 uppercase">Dari</span>
                        <input :value="spLogDateStart" @input="$emit('update:sp-log-date-start', $event.target.value)" type="date" title="Tanggal mulai" class="p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="text-[9px] font-bold text-slate-500 uppercase">Sampai</span>
                        <input :value="spLogDateEnd" @input="$emit('update:sp-log-date-end', $event.target.value)" type="date" title="Tanggal akhir" class="p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                    </div>
                    <button v-if="canPrint" @click="printDailyLogReport('Sparepart')" class="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="printer" class="w-4 h-4"></i> Cetak Laporan Sparepart
                    </button>
                    <button v-if="canEdit" @click="exportSparepartExcelByDate" class="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> Export Excel Sparepart
                    </button>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl space-y-2 no-print">
                <span class="text-xs font-bold text-slate-700 uppercase">Filter Log Sparepart:</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input :value="spLogBarang" @input="$emit('update:sp-log-barang', $event.target.value); $emit('update:sparepart-page', 1)"   @click.stop @mousedown.stop @input.stop type="search" autocomplete="off" spellcheck="false" placeholder="Cari Barang..." class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase" style="pointer-events:auto !important; position:relative; z-index:20 !important;">
                    <input :value="spLogKeperluan" @input="$emit('update:sp-log-keperluan', $event.target.value)" @click.stop @mousedown.stop @input.stop type="search" autocomplete="off" spellcheck="false" placeholder="Cari Kepentingan / Supplier..." class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase" style="pointer-events:auto !important; position:relative; z-index:20 !important;">
                    <input :value="spLogHargaMin" @input="$emit('update:sp-log-harga-min', Number($event.target.value))" type="number" min="0" placeholder="Harga Min" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <input :value="spLogHargaMax" @input="$emit('update:sp-log-harga-max', Number($event.target.value))" type="number" min="0" placeholder="Harga Max" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                </div>
            </div>
            <div id="sparepart-log-print" class="grid grid-cols-1 lg:grid-cols-2 gap-6 print-area">
                <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-emerald-600">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span class="font-bold text-xs uppercase text-emerald-900 flex items-center gap-1.5">
                            <i data-lucide="arrow-down-left" class="w-4 h-4 text-emerald-600"></i> Log Barang Masuk Sparepart (Inbound)
                        </span>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">{{ filteredSparepartLogsIn.length }} Masuk</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs excel-print-table">
                            <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[9px] border-b border-slate-200 sticky top-0">
                                <tr>
                                    <th class="p-2 text-center">No</th>
                                    <th class="p-2">Nama Barang</th>
                                     <th class="p-2 text-center">Satuan</th>
                                    <th class="p-2 text-center">Qty Masuk</th>
                                    <th class="p-2 text-center">Qty Awal</th>
                                    <th class="p-2 text-center">Qty Akhir</th>
                                    <th class="p-2">No. PO / Supplier</th>
                                    <th class="p-2">Keterangan</th>
                                    <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Satuan</th>
                                    <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Total</th>
                                    <th class="p-2 text-center">Status Approval</th>
                                        <th class="p-2 text-center no-print">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="(log, idx) in paginatedSparepartLogsIn" :key="log.id" :class="isCancelledLog(log) ? 'bg-rose-50/70' : ''">
                                    <td class="p-2 text-center font-bold text-slate-400">{{ ((sparepartLogInPage - 1) * logPageSize) + idx + 1 }}</td>
                                    <td class="p-2 font-bold text-slate-800 uppercase">
                                        {{ log.nama }}
                                        <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                    </td>
                                     <td class="p-2 text-center font-bold text-slate-700 uppercase">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                    <td class="p-2 text-center font-bold text-emerald-600">+{{ getLogDisplayQty(log) }}</td>
                                    <td class="p-2 text-center font-semibold text-slate-500">{{ log.qtyAwal ?? '-' }}</td>
                                    <td class="p-2 text-center font-extrabold text-emerald-700">{{ log.qtyAkhir ?? '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">
                                        <div>No. PO: {{ log.nomorPO || '-' }}</div>
                                        <div class="mt-0.5">Supplier: {{ log.supplier || '-' }}</div>
                                    </td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                    <td v-if="sparepartShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                    <td v-if="sparepartShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                    <td class="p-2 text-center">
                                        <span :class="isPendingLog(log) ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-black whitespace-nowrap">
                                            <i :data-lucide="isPendingLog(log) ? 'clock-3' : 'badge-check'" class="w-3 h-3"></i>
                                            {{ isPendingLog(log) ? 'BELUM DISETUJUI' : 'SUDAH DISETUJUI' }}
                                        </span>
                                    </td>
                                    <td class="p-2 text-center no-print">
                                        <span v-if="isCancelledLog(log)" class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[9px] font-black whitespace-nowrap">
                                            <i data-lucide="ban" class="w-3 h-3"></i> DIBATALKAN
                                        </span>
                                        <button v-if="canApprove && isPendingLog(log)" @click="approveTransaction(log)" class="block mx-auto text-emerald-700 hover:text-emerald-900 font-black text-[10px] underline">Setujui</button>
                                        <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="editLog(log)" class="block mx-auto text-amber-600 hover:text-amber-800 font-bold text-[10px] underline">Edit</button>
                                        <button v-if="canEdit && !isCancelledLog(log)" @click="cancelTransaction(log)" class="block mx-auto text-rose-600 hover:text-rose-800 font-bold text-[10px] underline">Cancel</button>
                                        <span v-if="!isPendingLog(log)" class="text-[9px] text-emerald-600 font-bold">✓ Approved</span>
                                    </td>
                                </tr>
                                <tr v-if="filteredSparepartLogsIn.length === 0"><td colspan="11" class="p-4 text-center text-slate-400 italic text-[11px]">Belum ada log barang masuk.</td></tr>
                            </tbody>
                        </table>
                <div v-if="sparepartLogInPageCount > 1" class="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between gap-2 no-print">
                    <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((sparepartLogInPage - 1) * logPageSize) + 1 }}–{{ Math.min(sparepartLogInPage * logPageSize, filteredSparepartLogsIn.length) }} dari {{ filteredSparepartLogsIn.length }} data</span>
                    <div class="flex items-center gap-2">
                        <button @click="$emit('update:sparepart-log-in-page', Math.max(1, sparepartLogInPage - 1))" :disabled="sparepartLogInPage <= 1" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Sebelumnya</button>
                        <span class="text-[9px] font-black text-slate-600">Halaman {{ sparepartLogInPage }} / {{ sparepartLogInPageCount }}</span>
                        <button @click="$emit('update:sparepart-log-in-page', Math.min(sparepartLogInPageCount, sparepartLogInPage + 1))" :disabled="sparepartLogInPage >= sparepartLogInPageCount" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Berikutnya</button>
                    </div>
                </div>
                    </div>
                </div>
                <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-amber-600">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span class="font-bold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-amber-600"></i> Log Barang Keluar Sparepart (Outbound)
                        </span>
                        <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">{{ filteredSparepartLogsOut.length }} Keluar</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs excel-print-table">
                            <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[9px] border-b border-slate-200 sticky top-0">
                                <tr>
                                    <th class="p-2 text-center">No</th>
                                    <th class="p-2">Nama Barang</th>
                                     <th class="p-2 text-center">Satuan</th>
                                    <th class="p-2 text-center">Qty Out</th>
                                    <th class="p-2 text-center">Qty Awal</th>
                                    <th class="p-2 text-center">Qty Akhir</th>
                                    <th class="p-2">Penerima</th>
                                    <th class="p-2">Keterangan</th>
                                    <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Satuan</th>
                                    <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Total</th>
                                    <th class="p-2 text-center">Status Approval</th>
                                        <th class="p-2 text-center no-print">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="(log, idx) in paginatedSparepartLogsOut" :key="log.id" :class="isCancelledLog(log) ? 'bg-rose-50/70' : ''">
                                    <td class="p-2 text-center font-bold text-slate-400">{{ ((sparepartLogOutPage - 1) * logPageSize) + idx + 1 }}</td>
                                    <td class="p-2 font-bold text-slate-800 uppercase">
                                        {{ log.nama }}
                                        <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                    </td>
                                     <td class="p-2 text-center font-bold text-slate-700 uppercase">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                    <td class="p-2 text-center font-bold text-amber-600">-{{ getLogDisplayQty(log) }}</td>
                                    <td class="p-2 text-center font-semibold text-slate-500">{{ log.qtyAwal ?? '-' }}</td>
                                    <td class="p-2 text-center font-extrabold text-amber-700">{{ log.qtyAkhir ?? '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.penerima || log.user || '-' }} ({{ log.keperluan || log.keterangan || '-' }})</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                    <td v-if="sparepartShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                    <td v-if="sparepartShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                    <td class="p-2 text-center">
                                        <span :class="isPendingLog(log) ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-black whitespace-nowrap">
                                            <i :data-lucide="isPendingLog(log) ? 'clock-3' : 'badge-check'" class="w-3 h-3"></i>
                                            {{ isPendingLog(log) ? 'BELUM DISETUJUI' : 'SUDAH DISETUJUI' }}
                                        </span>
                                    </td>
                                    <td class="p-2 text-center no-print">
                                        <span v-if="isCancelledLog(log)" class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[9px] font-black whitespace-nowrap">
                                            <i data-lucide="ban" class="w-3 h-3"></i> DIBATALKAN
                                        </span>
                                        <button v-if="canApprove && isPendingLog(log)" @click="approveTransaction(log)" class="block mx-auto text-emerald-700 hover:text-emerald-900 font-black text-[10px] underline">Setujui</button>
                                        <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="editLog(log)" class="block mx-auto text-amber-600 hover:text-amber-800 font-bold text-[10px] underline">Edit</button>
                                        <button v-if="canEdit && !isCancelledLog(log)" @click="cancelTransaction(log)" class="block mx-auto text-rose-600 hover:text-rose-800 font-bold text-[10px] underline">Cancel</button>
                                        <span v-if="!isPendingLog(log)" class="text-[9px] text-emerald-600 font-bold">✓ Approved</span>
                                    </td>
                                </tr>
                                <tr v-if="filteredSparepartLogsOut.length === 0"><td colspan="11" class="p-4 text-center text-slate-400 italic text-[11px]">Belum ada log barang keluar.</td></tr>
                            </tbody>
                        </table>
                <div v-if="sparepartLogOutPageCount > 1" class="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between gap-2 no-print">
                    <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((sparepartLogOutPage - 1) * logPageSize) + 1 }}–{{ Math.min(sparepartLogOutPage * logPageSize, filteredSparepartLogsOut.length) }} dari {{ filteredSparepartLogsOut.length }} data</span>
                    <div class="flex items-center gap-2">
                        <button @click="$emit('update:sparepart-log-out-page', Math.max(1, sparepartLogOutPage - 1))" :disabled="sparepartLogOutPage <= 1" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Sebelumnya</button>
                        <span class="text-[9px] font-black text-slate-600">Halaman {{ sparepartLogOutPage }} / {{ sparepartLogOutPageCount }}</span>
                        <button @click="$emit('update:sparepart-log-out-page', Math.min(sparepartLogOutPageCount, sparepartLogOutPage + 1))" :disabled="sparepartLogOutPage >= sparepartLogOutPageCount" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Berikutnya</button>
                    </div>
                </div>
                    </div>
                <div class="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between gap-3 bg-amber-50/60 rounded-lg px-3 py-2">
                    <div>
                        <div class="text-[9px] font-black text-amber-800 uppercase">Total Harga Pengeluaran Gudang Spare Part</div>
                        <div class="text-[9px] text-slate-500 mt-0.5">Nilai dihitung dari seluruh pengeluaran Spare Part yang tercatat.</div>
                    </div>
                    <div v-if="sparepartShowPrices" class="text-sm font-black text-amber-700 whitespace-nowrap">Rp {{ formatRupiah(totalHargaPengeluaranSparepart) }}</div>
                </div>
                </div>
            </div>
            <div class="portal-card rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-4 no-print shadow-sm">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div class="flex items-start gap-3 min-w-0">
                        <div class="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <i data-lucide="scan-barcode" class="w-6 h-6"></i>
                        </div>
                        <div class="min-w-0">
                            <div class="font-black text-blue-900 text-sm uppercase tracking-wide">Scan Barcode Sparepart</div>
                            <div class="text-[10px] text-blue-700 mt-1 leading-relaxed">Scan menggunakan scanner USB/Bluetooth langsung dari laptop, atau gunakan kamera laptop. Setelah kode terbaca, barang akan langsung dikenali.</div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:min-w-[520px]">
                        <input id="sparepart-barcode-input" :value="barcodeScanInput" @input="$emit('update:barcode-scan-input', $event.target.value)" @keyup.enter="processScannedBarcode(barcodeScanInput)" @keydown.esc="$emit('update:barcode-scan-input','')" type="text" autocomplete="off" spellcheck="false" placeholder="Klik di sini lalu scan barcode..." class="flex-1 min-w-0 px-4 py-3 rounded-xl border-2 border-blue-200 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none text-sm font-black uppercase tracking-wide shadow-sm">
                        <button @click="processScannedBarcode(barcodeScanInput)" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-black text-xs uppercase shadow-sm whitespace-nowrap flex items-center justify-center gap-2">
                            <i data-lucide="search-check" class="w-4 h-4"></i> Proses Scan
                        </button>
                        <button @click="openBarcodeScanner" class="bg-white hover:bg-slate-50 text-blue-700 px-4 py-3 rounded-xl font-black text-xs uppercase border-2 border-blue-200 whitespace-nowrap flex items-center justify-center gap-2">
                            <i data-lucide="camera" class="w-4 h-4"></i> Kamera
                        </button>
                    </div>
                </div>
                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-semibold text-slate-500">
                    <span><b>Scanner USB/Bluetooth:</b> arahkan scanner ke barcode → kode otomatis masuk → tekan Enter jika scanner tidak mengirim Enter.</span>
                    <span v-if="barcodeScanMessage" :class="barcodeScanSuccess ? 'text-emerald-700' : 'text-red-600'" class="font-bold">{{ barcodeScanMessage }}</span>
                </div>
            </div>
            <div class="portal-card rounded-xl overflow-hidden no-print">
                <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <i data-lucide="wrench" class="w-4 h-4 text-emerald-600"></i>
                        <h3 class="font-bold text-slate-800 uppercase text-xs tracking-wider">Daftar Stok Gudang Spare Part</h3>
                    </div>
                    <div class="flex items-center gap-2">
                        <button @click="openBarcodeScanner" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm flex items-center gap-1.5">
                            <i data-lucide="scan-barcode" class="w-3.5 h-3.5"></i> Scan Barcode
                        </button>
                        <button v-if="canPrint" @click="printStockGudang('Sparepart')" class="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm flex items-center gap-1.5">
                            <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak Stock
                        </button>
                        <button v-if="canEdit" @click="exportStockGudangExcel('Sparepart')" class="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm flex items-center gap-1.5">
                            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Excel Stock
                        </button>
                        <span class="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">{{ filteredSpareparts.length }} Item Available</span>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs excel-print-table sparepart-table">
                        <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                            <tr>
                                <th class="p-3 text-center">No</th>
                                <th class="p-3 text-center sparepart-location">Lokasi Rak</th>
                                <th class="p-3">Nama Barang</th>
                                <th class="p-3 text-center">Satuan</th>
                                <th class="p-3 text-center sparepart-stock">Stok Available</th>
                                <th class="p-3 text-center sparepart-action">Aksi Pengeluaran</th>
                                <th class="p-3 text-center sparepart-card">Kartu Stock</th>
                                <th v-if="sparepartShowPrices" class="p-3.5 text-right">Harga Satuan</th>
                                <th v-if="sparepartShowPrices" class="p-3.5 text-right">Harga Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(item, idx) in paginatedSpareparts" :key="item.barcode || item.kode || (item.nama + '-' + idx)" class="hover:bg-slate-50 transition-colors">
                                <td class="p-3.5 text-center font-bold text-slate-400">{{ ((sparepartPage - 1) * sparepartPageSize) + idx + 1 }}</td>
                                <td class="p-3.5 text-center font-bold text-slate-600 uppercase">{{ item.lokasi || item.lokasiRak || item.rak || '-' }}</td>
                                <td class="p-3.5 font-bold text-slate-800 uppercase">{{ item.nama }}</td>
                                 <td class="p-3.5 text-center font-bold text-slate-700 uppercase">{{ item.satuan || 'Pcs' }}</td>
                                <td class="p-3.5 text-center">
                                    <span :class="item.qty <= item.minStock ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-slate-800 bg-slate-100 border-slate-200'" class="px-2.5 py-1 rounded-lg font-black text-xs border inline-block">
                                        {{ item.qty }} {{ item.satuan || 'Pcs' }}
                                    </span>
                                </td>
                                <td class="p-3.5 text-center">
                                    <div class="flex flex-col items-center gap-1.5">
                                    <button @click="openSingleOutModal(item)" :disabled="item.qty <= 0" class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm border border-amber-500">
                                        Keluar
                                    </button>
                                    </div>
                                </td>
                                <td class="p-3.5 text-center">
                                    <button v-if="canPrint" @click="printLabel(item)" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold text-[10px] uppercase border border-slate-300 flex items-center gap-1 mx-auto">
                                        <i data-lucide="printer" class="w-3 h-3"></i> Kartu Stock
                                    </button>
                                </td>
                                <td v-if="sparepartShowPrices" class="p-3.5 text-right font-bold text-slate-700 whitespace-nowrap">Rp {{ formatRupiah(item.harga != null ? item.harga : getMasterHarga(item.nama)) }}</td>
                                <td v-if="sparepartShowPrices" class="p-3.5 text-right font-black text-emerald-700 whitespace-nowrap">Rp {{ formatRupiah((Number(item.harga != null ? item.harga : getMasterHarga(item.nama)) || 0) * (Number(item.qty) || 0)) }}</td>
                            </tr>
                            <tr v-if="filteredSpareparts.length === 0"><td :colspan="sparepartShowPrices ? 10 : 8" class="p-10 text-center text-slate-400 font-medium">Stok Sparepart kosong.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="sparepartShowPrices" class="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex justify-end">
                    <div class="text-right">
                        <span class="text-[10px] font-bold uppercase text-slate-500">Total Harga Stock</span>
                        <div class="text-base font-black text-emerald-700">Rp {{ formatRupiah(totalHargaSparepart) }}</div>
                    </div>
                </div>
                <div v-if="sparepartPageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ sparepartPageStart }}–{{ sparepartPageEnd }} dari {{ filteredSpareparts.length }} item</span>
                    <div class="flex items-center gap-2">
                        <button @click="$emit('update:sparepart-page', Math.max(1, sparepartPage - 1))" :disabled="sparepartPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[10px] font-black disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
                        <span class="text-[10px] font-black text-slate-600">Halaman {{ Math.min(sparepartPage, sparepartPageCount) }} / {{ sparepartPageCount }}</span>
                        <button @click="$emit('update:sparepart-page', Math.min(sparepartPageCount, sparepartPage + 1))" :disabled="sparepartPage >= sparepartPageCount" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[10px] font-black disabled:opacity-40 disabled:cursor-not-allowed">›</button>
                    </div>
                </div>
            </div>
        </div>
    <!-- MODAL 2: PENGELUARAN MULTIPLE SPAREPART -->
    <div v-if="showSparepartMultiOutModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 class="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
                    <i data-lucide="minus-square" class="w-5 h-5 text-amber-600"></i>
                    Pengeluaran Multiple Item - Gudang Spare Part
                </h3>
                <button @click="$emit('update:show-sparepart-multi-out-modal', false)" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>

            <div class="space-y-3 overflow-y-auto custom-scroll pr-1 flex-1">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Tanggal Transaksi / Tanggal Pengeluaran *</label>
                        <input v-model="formSparepartMultiOut.tanggal" @mousedown.stop @click.stop type="date" required class="w-full p-2.5 bg-amber-50 border-2 border-amber-500 rounded-xl font-extrabold text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-200">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nomor Purchase Request</label>
                        <input v-model="formSparepartMultiOut.nomorPR" @mousedown.stop @click.stop type="text" placeholder="Nomor PR (jika ada)" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nama Penerima *</label>
                        <input v-model="formSparepartMultiOut.penerima" @mousedown.stop @click.stop type="text" placeholder="Nama penerima barang" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Kepentingan / Keterangan *</label>
                        <input v-model="formSparepartMultiOut.keperluan" @mousedown.stop @click.stop type="text" placeholder="Maintenance / Produksi" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                </div>

                <div class="flex items-center justify-between pt-1">
                    <span class="text-[11px] text-slate-500 font-semibold">Daftar Barang Spare Part:</span>
                    <button @click="addCustomItemToSparepartMultiOut" class="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1">
                        + Tambah Item Manual
                    </button>
                </div>

                <div class="space-y-2 border-t border-slate-100 pt-3">
                    <div v-for="(item, idx) in formSparepartMultiOut.selectedItems" :key="idx" class="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-2">
                        <div class="flex justify-between items-center">
                            <div class="relative flex-1 mr-2">
                                <div class="relative flex-1">
                                    <i data-lucide="search" class="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-amber-500 pointer-events-none"></i>
                                    <input v-model="item.nama" @mousedown.stop @focus="openSparepartOutDropdown(idx, item)" @click.stop="openSparepartOutDropdown(idx, item)" @input.stop="updateSparepartOutDropdown(idx, item)" :data-sparepart-out-input="idx" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik untuk cari barang dari stok sparepart..." class="w-full pl-8 pr-2 py-2 font-bold text-xs uppercase bg-white border-2 border-amber-300 rounded-md cursor-text outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100">
                                    <!-- Dropdown ditampilkan via Teleport agar TIDAK terpotong oleh overflow-y-auto modal -->
                                </div>
                            </div>
                            <button @click="removeSparepartOutItem(idx)" class="text-rose-500 hover:text-rose-700 font-bold text-xs">&times; Hapus</button>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-5 gap-2">
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Stok Saat Ini</label>
                                <input :value="item.qty" type="number" readonly class="w-full p-1.5 bg-slate-100 font-bold text-xs text-center border border-amber-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Qty Keluar</label>
                                <input v-model.number="item.outQty" @mousedown.stop @click.stop type="number" min="1" :max="item.qty" class="w-full p-1.5 bg-white font-bold text-xs text-center border border-amber-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Harga Satuan (Rp)</label>
                                <input v-model.number="item.harga" type="number" min="0" step="any" class="w-full p-1.5 bg-white font-bold text-xs text-right border border-emerald-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Satuan</label>
                                <input :value="getMasterSatuan(item.nama, item.satuan || 'Pcs')" type="text" readonly placeholder="Satuan dari Data Master" class="w-full p-1.5 bg-slate-100 font-semibold text-xs text-center border border-amber-300 rounded-md uppercase">
                            </div>
                        <div v-if="sparepartShowPrices" class="flex justify-end gap-4 pt-1 text-[10px] font-bold text-slate-600">
                            <span>Harga Satuan: Rp {{ formatRupiah(getMasterHarga(item.nama, item.harga)) }}</span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button @click="$emit('update:show-sparepart-multi-out-modal', false)" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase">Batal</button>
                <button @click="submitSparepartMultiOut" class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase shadow-sm">Proses Pengeluaran</button>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
export default {
    props: {
        activeTab: { default: null },
        barcodeScanInput: { default: null },
        barcodeScanMessage: { default: null },
        barcodeScanSuccess: { default: null },
        canApprove: { default: null },
        canEdit: { default: null },
        canInputTransaction: { default: null },
        canPrint: { default: null },
        filteredSparepartLogsIn: { type: Array, default: () => [] },
        filteredSparepartLogsOut: { type: Array, default: () => [] },
        filteredSpareparts: { type: Array, default: () => [] },
        formSparepartMultiOut: { type: Array, default: () => [] },
        isCancelledLog: { default: null },
        isPendingLog: { default: null },
        logPageSize: { default: null },
        paginatedSparepartLogsIn: { type: Array, default: () => [] },
        paginatedSparepartLogsOut: { type: Array, default: () => [] },
        paginatedSpareparts: { type: Array, default: () => [] },
        showSparepartMultiOutModal: { default: null },
        spLogBarang: { default: null },
        spLogDateEnd: { default: null },
        spLogDateStart: { default: null },
        spLogHargaMax: { default: null },
        spLogHargaMin: { default: null },
        spLogKeperluan: { default: null },
        sparepartLogInPage: { default: null },
        sparepartLogInPageCount: { default: null },
        sparepartLogOutPage: { default: null },
        sparepartLogOutPageCount: { default: null },
        sparepartPage: { default: null },
        sparepartPageCount: { default: null },
        sparepartPageEnd: { default: null },
        sparepartPageSize: { default: null },
        sparepartPageStart: { default: null },
        sparepartShowPrices: { default: null },
        totalHargaPengeluaranSparepart: { default: null },
        totalHargaSparepart: { default: null },
        addCustomItemToSparepartMultiOut: { type: Function, required: true },
        approveTransaction: { type: Function, required: true },
        cancelTransaction: { type: Function, required: true },
        editLog: { type: Function, required: true },
        exportSparepartExcelByDate: { type: Function, required: true },
        exportStockGudangExcel: { type: Function, required: true },
        formatRupiah: { type: Function, required: true },
        getLogDisplayQty: { type: Function, required: true },
        getMasterHarga: { type: Function, required: true },
        getMasterSatuan: { type: Function, required: true },
        openBarcodeScanner: { type: Function, required: true },
        openSingleOutModal: { type: Function, required: true },
        openSparepartMultiOutModal: { type: Function, required: true },
        openSparepartOutDropdown: { type: Function, required: true },
        printDailyLogReport: { type: Function, required: true },
        printLabel: { type: Function, required: true },
        printStockGudang: { type: Function, required: true },
        processScannedBarcode: { type: Function, required: true },
        removeSparepartOutItem: { type: Function, required: true },
        startBarcodeScan: { type: Function, required: true },
        submitSparepartMultiOut: { type: Function, required: true },
        updateSparepartOutDropdown: { type: Function, required: true },
    },
    emits: ['update:barcode-scan-input', 'update:show-sparepart-multi-out-modal', 'update:sp-log-barang', 'update:sp-log-date-end', 'update:sp-log-date-start', 'update:sp-log-harga-max', 'update:sp-log-harga-min', 'update:sp-log-keperluan', 'update:sparepart-log-in-page', 'update:sparepart-log-out-page', 'update:sparepart-page', 'update:sparepart-show-prices'],
};
</script>

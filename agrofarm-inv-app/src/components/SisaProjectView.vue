<template>
        <div v-if="activeTab === 'sisa_project'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 no-print">
                <div class="portal-card rounded-xl p-3 flex flex-wrap items-center gap-2">
                    <div class="flex flex-wrap items-center gap-2">
                    <button v-if="canInputTransaction" @click="openSisaProjectMultiInModal" class="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="plus-square" class="w-4 h-4"></i> Input Multiple Sisa Project
                    </button>
                    <button v-if="canInputTransaction" @click="startBarcodeScan('Sisa Project')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="scan-barcode" class="w-4 h-4"></i> Scan Barcode
                    </button>
                    <button v-if="canInputTransaction" @click="openSisaProjectMultiOutModal" class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="minus-square" class="w-4 h-4"></i> Pengeluaran Multiple Sisa Project
                    </button>
                    <button @click="$emit('update:sisa-project-show-prices', !sisaProjectShowPrices)" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 border border-slate-200">
                        <i :data-lucide="sisaProjectShowPrices ? 'eye-off' : 'eye'" class="w-4 h-4"></i> {{ sisaProjectShowPrices ? 'Hide Harga' : 'Tampilkan Harga' }}
                    </button>
                </div>
                </div>
                <div class="portal-card rounded-xl p-3 flex flex-wrap items-center gap-2">
                    <span class="text-[10px] font-black text-slate-500 uppercase mr-1">Tanggal & Cetak</span>
                    <div class="flex items-center gap-1">
                        <span class="text-[9px] font-bold text-slate-500 uppercase">Dari</span>
                        <input :value="spjLogDateStart" @input="$emit('update:spj-log-date-start', $event.target.value)" type="date" title="Tanggal mulai" class="p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="text-[9px] font-bold text-slate-500 uppercase">Sampai</span>
                        <input :value="spjLogDateEnd" @input="$emit('update:spj-log-date-end', $event.target.value)" type="date" title="Tanggal akhir" class="p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                    </div>
                    <button v-if="canPrint" @click="printDailyLogReport('Sisa Project')" class="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                    <i data-lucide="printer" class="w-4 h-4"></i> Cetak Laporan Sisa Project
                </button>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl space-y-2 no-print">
                <span class="text-xs font-bold text-slate-700 uppercase">Filter Log Sisa Project:</span>
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input :value="spjLogBarang" @input="$emit('update:spj-log-barang', $event.target.value); $emit('update:sisa-project-page', 1)"   type="text" placeholder="Cari Barang..." class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase">
                    <input :value="spjLogKeperluan" @input="$emit('update:spj-log-keperluan', $event.target.value)" type="text" placeholder="Cari Keterangan / Supplier..." class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase">
                </div>
            </div>
            <div id="sisa-log-print" class="grid grid-cols-1 lg:grid-cols-2 gap-6 print-area">
                <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-emerald-600">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span class="font-bold text-xs uppercase text-emerald-900 flex items-center gap-1.5">
                            <i data-lucide="arrow-down-left" class="w-4 h-4 text-emerald-600"></i> Log Barang Masuk Sisa Project (Inbound)
                        </span>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">{{ filteredProjectLogsIn.length }} Masuk</span>
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
                                    <th class="p-2">Asal / Kepentingan</th>
                                        <th class="p-2">Keterangan</th>
                                    <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Satuan</th>
                                    <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Total</th>
                                    <th class="p-2 text-center">Status Approval</th>
                                        <th class="p-2 text-center no-print">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="(log, idx) in paginatedProjectLogsIn" :key="log.id" :class="isCancelledLog(log) ? 'bg-rose-50/70' : ''">
                                    <td class="p-2 text-center font-bold text-slate-400">{{ ((sisaProjectLogInPage - 1) * logPageSize) + idx + 1 }}</td>
                                    <td class="p-2 font-bold text-slate-800 uppercase">
                                        {{ log.nama }}
                                        <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                    </td>
                                     <td class="p-2 text-center font-bold text-slate-700 uppercase">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                    <td class="p-2 text-center font-bold text-emerald-600">+{{ getLogDisplayQty(log) }}</td>
                                    <td class="p-2 text-center font-semibold text-slate-500">{{ log.qtyAwal ?? '-' }}</td>
                                    <td class="p-2 text-center font-extrabold text-emerald-700">{{ log.qtyAkhir ?? '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.supplier || log.keperluan || '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                    <td v-if="sisaProjectShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                    <td v-if="sisaProjectShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
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
                                <tr v-if="filteredProjectLogsIn.length === 0"><td colspan="11" class="p-4 text-center text-slate-400 italic text-[11px]">Belum ada log barang masuk.</td></tr>
                            </tbody>
                        </table>
                <div v-if="sisaProjectLogInPageCount > 1" class="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between gap-2 no-print">
                    <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((sisaProjectLogInPage - 1) * logPageSize) + 1 }}–{{ Math.min(sisaProjectLogInPage * logPageSize, filteredProjectLogsIn.length) }} dari {{ filteredProjectLogsIn.length }} data</span>
                    <div class="flex items-center gap-2">
                        <button @click="$emit('update:sisa-project-log-in-page', Math.max(1, sisaProjectLogInPage - 1))" :disabled="sisaProjectLogInPage <= 1" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Sebelumnya</button>
                        <span class="text-[9px] font-black text-slate-600">Halaman {{ sisaProjectLogInPage }} / {{ sisaProjectLogInPageCount }}</span>
                        <button @click="$emit('update:sisa-project-log-in-page', Math.min(sisaProjectLogInPageCount, sisaProjectLogInPage + 1))" :disabled="sisaProjectLogInPage >= sisaProjectLogInPageCount" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Berikutnya</button>
                    </div>
                </div>
                    </div>
                </div>
                <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-amber-600">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span class="font-bold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-amber-600"></i> Log Pengeluaran Sisa Project
                        </span>
                        <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">{{ filteredProjectLogsOut.length }} Keluar</span>
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
                                    <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Satuan</th>
                                    <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Total</th>
                                    <th class="p-2 text-center">Status Approval</th>
                                        <th class="p-2 text-center no-print">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="(log, idx) in paginatedProjectLogsOut" :key="log.id" :class="isCancelledLog(log) ? 'bg-rose-50/70' : ''">
                                    <td class="p-2 text-center font-bold text-slate-400">{{ ((sisaProjectLogOutPage - 1) * logPageSize) + idx + 1 }}</td>
                                    <td class="p-2 font-bold text-slate-800 uppercase">
                                        {{ log.nama }}
                                        <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                    </td>
                                     <td class="p-2 text-center font-bold text-slate-700 uppercase">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                    <td class="p-2 text-center font-bold text-amber-600">-{{ getLogDisplayQty(log) }}</td>
                                    <td class="p-2 text-center font-semibold text-slate-500">{{ log.qtyAwal ?? '-' }}</td>
                                    <td class="p-2 text-center font-extrabold text-amber-700">{{ log.qtyAkhir ?? '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.penerima || log.user || '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                    <td v-if="sisaProjectShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                    <td v-if="sisaProjectShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
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
                                <tr v-if="filteredProjectLogsOut.length === 0"><td colspan="11" class="p-4 text-center text-slate-400 italic text-[11px]">Belum ada log barang keluar.</td></tr>
                            </tbody>
                        </table>
                <div v-if="sisaProjectLogOutPageCount > 1" class="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between gap-2 no-print">
                    <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((sisaProjectLogOutPage - 1) * logPageSize) + 1 }}–{{ Math.min(sisaProjectLogOutPage * logPageSize, filteredProjectLogsOut.length) }} dari {{ filteredProjectLogsOut.length }} data</span>
                    <div class="flex items-center gap-2">
                        <button @click="$emit('update:sisa-project-log-out-page', Math.max(1, sisaProjectLogOutPage - 1))" :disabled="sisaProjectLogOutPage <= 1" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Sebelumnya</button>
                        <span class="text-[9px] font-black text-slate-600">Halaman {{ sisaProjectLogOutPage }} / {{ sisaProjectLogOutPageCount }}</span>
                        <button @click="$emit('update:sisa-project-log-out-page', Math.min(sisaProjectLogOutPageCount, sisaProjectLogOutPage + 1))" :disabled="sisaProjectLogOutPage >= sisaProjectLogOutPageCount" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Berikutnya</button>
                    </div>
                </div>
                    <div class="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between gap-3 bg-amber-50/60 rounded-lg px-3 py-2">
                        <div>
                            <div class="text-[9px] font-black text-amber-800 uppercase">Total Harga Pengeluaran Gudang Sisa Project</div>
                            <div class="text-[9px] text-slate-500 mt-0.5">Nilai dihitung dari seluruh pengeluaran Sisa Project yang tercatat.</div>
                        </div>
                        <div v-if="sisaProjectShowPrices" class="text-sm font-black text-amber-700 whitespace-nowrap">Rp {{ formatRupiah(totalHargaPengeluaranSisaProject) }}</div>
                        <div v-else class="text-[10px] font-bold text-slate-400 whitespace-nowrap">Harga disembunyikan</div>
                    </div>
                    </div>
                </div>
            </div>
<div class="portal-card rounded-xl overflow-hidden no-print">
                <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <i data-lucide="boxes" class="w-4 h-4 text-teal-600"></i>
                        <h3 class="font-bold text-slate-800 uppercase text-xs tracking-wider">Daftar Stok Gudang Sisa Project</h3>
                    </div>
                    <div class="flex items-center gap-2">
                    <button v-if="canPrint" @click="printStockGudang('Sisa Project')" class="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm flex items-center gap-1.5">
                        <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak Stock
                    </button>
                    <button v-if="canEdit" @click="exportStockGudangExcel('Sisa Project')" class="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm flex items-center gap-1.5">
                        <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Excel Stock
                    </button>
                    <span class="text-[11px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">{{ filteredSisaProjects.length }} Item Available</span>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs excel-print-table sparepart-table">
                        <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                            <tr>
                                <th class="p-3 text-center">No</th>
                                <th class="p-3 text-center sparepart-location">Lokasi Rak</th>
                                <th class="p-3 sparepart-name">Nama Barang</th>
                                <th class="p-3 text-center">Satuan</th>
                                <th class="p-3 text-center sparepart-stock">Stok Available</th>
                                <th class="p-3 text-center sparepart-action">Aksi Pengeluaran</th>
                                <th class="p-3 text-center sparepart-card">Kartu Stock</th>
                                <th v-if="sisaProjectShowPrices" class="p-3.5 text-right sparepart-price">Harga Satuan</th>
                                <th v-if="sisaProjectShowPrices" class="p-3.5 text-right">Harga Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(item, idx) in paginatedSisaProjects" :key="item.barcode || item.kode || (item.nama + '-' + idx)" class="hover:bg-slate-50 transition-colors">
                                <td class="p-3.5 text-center font-bold text-slate-400">{{ ((sisaProjectPage - 1) * sisaProjectPageSize) + idx + 1 }}</td>
                                <td class="p-3.5 text-center font-bold text-slate-600 uppercase">{{ item.lokasi || item.lokasiRak || item.rak || '-' }}</td>
                                <td class="p-3.5 font-bold text-slate-800 uppercase">{{ item.nama }}</td>
                                 <td class="p-3.5 text-center font-bold text-slate-700 uppercase">{{ item.satuan || 'Pcs' }}</td>
                                <td class="p-3.5 text-center">
                                    <span class="px-2.5 py-1 rounded-lg font-black text-xs border border-slate-200 bg-slate-100 text-slate-800 inline-block">
                                        {{ item.qty }} {{ item.satuan || 'Pcs' }}
                                    </span>
                                </td>
                                <td class="p-3.5 text-center">
                                    <button @click="openSingleOutModal(item)" :disabled="item.qty <= 0" class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm border border-amber-500">
                                        Keluar
                                    </button>
                                </td>
                                <td class="p-3.5 text-center">
                                    <button v-if="canPrint" @click="printLabel(item)" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold text-[10px] uppercase border border-slate-300 flex items-center gap-1 mx-auto">
                                        <i data-lucide="printer" class="w-3 h-3"></i> Kartu Stock
                                    </button>
                                </td>
                                <td v-if="sisaProjectShowPrices" class="p-3.5 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(item.harga != null ? item.harga : getMasterHarga(item.nama)) }}</td>
                                <td v-if="sisaProjectShowPrices" class="p-3.5 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(item.harga != null ? item.harga : getMasterHarga(item.nama)) || 0) * (Number(item.qty) || 0)) }}</td>
                            </tr>
                            <tr v-if="filteredSisaProjects.length === 0"><td :colspan="sisaProjectShowPrices ? 9 : 7" class="p-10 text-center text-slate-400 font-medium">Stok Sisa Project kosong.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="sisaProjectPageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ sisaProjectPageStart }}–{{ sisaProjectPageEnd }} dari {{ filteredSisaProjects.length }} item</span>
                    <div class="flex items-center gap-2">
                        <button @click="$emit('update:sisa-project-page', Math.max(1, sisaProjectPage - 1))" :disabled="sisaProjectPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[10px] font-black disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
                        <span class="text-[10px] font-black text-slate-600">Halaman {{ Math.min(sisaProjectPage, sisaProjectPageCount) }} / {{ sisaProjectPageCount }}</span>
                        <button @click="$emit('update:sisa-project-page', Math.min(sisaProjectPageCount, sisaProjectPage + 1))" :disabled="sisaProjectPage >= sisaProjectPageCount" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[10px] font-black disabled:opacity-40 disabled:cursor-not-allowed">›</button>
                    </div>
                </div>
            </div>
        </div>
    <!-- MODAL 3: INPUT MULTIPLE SISA PROJECT -->
    <div v-if="showSisaProjectMultiInModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 class="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
                    <i data-lucide="plus-square" class="w-5 h-5 text-emerald-600"></i>
                    Input Multiple Item Masuk - Gudang Sisa Project
                </h3>
                <button @click="$emit('update:show-sisa-project-multi-in-modal', false)" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>
            <div class="space-y-3 overflow-y-auto custom-scroll pr-1 flex-1">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Tanggal Transaksi / Tanggal Penerimaan *</label>
                        <input v-model="formSisaProjectMultiIn.tanggal" type="date" required class="w-full p-2.5 bg-emerald-50 border-2 border-emerald-500 rounded-xl font-extrabold text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Asal Vendor / Supplier Utama *</label>
                        <input v-model="formSisaProjectMultiIn.supplier" type="text" placeholder="Contoh: Vendor PT XYZ / Sisa Proyek" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs text-slate-800 outline-none uppercase focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nomor Purchase Request</label>
                        <input v-model="formSisaProjectMultiIn.nomorPR" type="text" placeholder="Nomor PR (jika ada)" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nama Yang Menyerahkan *</label>
                        <input v-model="formSisaProjectMultiIn.penyerah" type="text" placeholder="Nama yang menyerahkan barang" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nama Penerima *</label>
                        <input v-model="formSisaProjectMultiIn.penerima" type="text" placeholder="Nama penerima barang" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-emerald-500">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Kepentingan / Project *</label>
                        <input v-model="formSisaProjectMultiIn.keperluan" type="text" placeholder="Kepentingan / nama project" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-emerald-500">
                    </div>
                </div>
                <div class="flex items-center justify-between pt-1">
                    <span class="text-[11px] text-slate-500 font-semibold">Daftar Barang Sisa Project:</span>
                    <button @click="addCustomItemToSisaProjectMultiIn" class="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1">
                        + Tambah Item Manual
                    </button>
                </div>
                <div class="space-y-2 border-t border-slate-100 pt-3">
                    <div v-for="(item, idx) in formSisaProjectMultiIn.itemsToProcess" :key="idx" class="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-2">
                        <div class="flex justify-between items-center">
                            <div class="relative flex-1 mr-2">
                                <input v-model="item.nama" @focus="openMasterDropdown('sisa-in-' + idx, item, $event)" @blur="scheduleCloseMasterDropdown('sisa-in-' + idx)" @input="updateMasterDropdown('sisa-in-' + idx, item, $event); onSisaProjectMultiInItemInput(item)" :data-master-dropdown-input="'sisa-in-' + idx" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik untuk cari / pilih barang..." class="w-full font-bold text-xs uppercase bg-white p-1.5 border border-emerald-300 rounded-md">
                            </div>
                            <button @click="removeSisaProjectMultiInItem(idx)" class="text-rose-500 hover:text-rose-700 font-bold text-xs">&times; Hapus</button>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-5 gap-2">
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Qty Masuk</label>
                                <input v-model.number="item.qty" type="number" min="1" class="w-full p-1.5 bg-white font-bold text-xs text-center border border-emerald-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Harga Satuan (Rp)</label>
                                <input v-model.number="item.harga" type="number" min="0" step="any" class="w-full p-1.5 bg-white font-bold text-xs text-right border border-emerald-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Satuan</label>
                                <input :value="getMasterSatuan(item.nama, item.satuan || 'Pcs')" type="text" readonly placeholder="Satuan dari Data Master" class="w-full p-1.5 bg-slate-100 font-semibold text-xs text-center border border-emerald-300 rounded-md uppercase">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Lokasi Rak</label>
                                <input v-model="item.lokasi" type="text" placeholder="RAK SISA" class="w-full p-1.5 bg-white font-semibold text-xs text-center border border-emerald-300 rounded-md uppercase">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Kepentingan / Project</label>
                                <input :value="formSisaProjectMultiIn.keperluan" readonly class="w-full p-1.5 bg-slate-100 font-semibold text-xs border border-emerald-300 rounded-md uppercase">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button @click="$emit('update:show-sisa-project-multi-in-modal', false)" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase">Batal</button>
                <button @click="submitSisaProjectMultiIn" class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase shadow-sm">Simpan Barang Masuk</button>
            </div>
        </div>
    </div>

    <!-- MODAL 4: PENGELUARAN MULTIPLE SISA PROJECT -->
    <div v-if="showSisaProjectMultiOutModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 class="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
                    <i data-lucide="minus-square" class="w-5 h-5 text-amber-600"></i>
                    Pengeluaran Multiple Item - Gudang Sisa Project
                </h3>
                <button @click="$emit('update:show-sisa-project-multi-out-modal', false)" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>

            <div class="space-y-3 overflow-y-auto custom-scroll pr-1 flex-1">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Tanggal Transaksi / Tanggal Pengeluaran *</label>
                        <input v-model="formSisaProjectMultiOut.tanggal" @mousedown.stop @click.stop type="date" required class="w-full p-2.5 bg-amber-50 border-2 border-amber-500 rounded-xl font-extrabold text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-200">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nomor Purchase Request</label>
                        <input v-model="formSisaProjectMultiOut.nomorPR" @mousedown.stop @click.stop type="text" placeholder="Nomor PR (jika ada)" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nama Yang Menyerahkan *</label>
                        <input v-model="formSisaProjectMultiOut.penyerah" @mousedown.stop @click.stop type="text" placeholder="Nama yang menyerahkan barang" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nama Penerima *</label>
                        <input v-model="formSisaProjectMultiOut.penerima" @mousedown.stop @click.stop type="text" placeholder="Nama penerima barang" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Keterangan *</label>
                        <input v-model="formSisaProjectMultiOut.keterangan" @mousedown.stop @click.stop type="text" placeholder="Keterangan pengeluaran" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                </div>

                <div class="flex items-center justify-between pt-1">
                    <span class="text-[11px] text-slate-500 font-semibold">Daftar Barang Sisa Project:</span>
                    <button @click="addCustomItemToSisaProjectMultiOut" class="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1">
                        + Tambah Item Manual
                    </button>
                </div>

                <div class="space-y-2 border-t border-slate-100 pt-3">
                    <div v-for="(item, idx) in formSisaProjectMultiOut.selectedItems" :key="idx" class="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-2">
                        <div class="flex justify-between items-center">
                            <div class="relative flex-1 mr-2">
                                <input v-model="item.nama" @mousedown.stop @focus="openMasterDropdown('sisa-out-' + idx, item, $event)" @blur="scheduleCloseMasterDropdown('sisa-out-' + idx)" @input.stop="updateMasterDropdown('sisa-out-' + idx, item, $event); onSisaProjectMultiOutItemInput(item)" :data-master-dropdown-input="'sisa-out-' + idx" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik untuk cari / pilih barang..." class="w-full font-bold text-xs uppercase bg-white p-1.5 border-2 border-amber-300 rounded-md">
                            </div>
                            <button @click="removeSisaProjectOutItem(idx)" class="text-rose-500 hover:text-rose-700 font-bold text-xs">&times; Hapus</button>
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
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Satuan</label>
                                <input :value="getMasterSatuan(item.nama, item.satuan || 'Pcs')" type="text" readonly placeholder="Satuan dari Data Master" class="w-full p-1.5 bg-slate-100 font-semibold text-xs text-center border border-amber-300 rounded-md uppercase">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Harga Satuan (Rp)</label>
                                <input v-model.number="item.harga" @mousedown.stop @click.stop type="number" min="0" step="any" class="w-full p-1.5 bg-white font-bold text-xs text-right border border-amber-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Lokasi Rak</label>
                                <input :value="item.lokasi || '-'" type="text" readonly class="w-full p-1.5 bg-slate-100 font-semibold text-xs text-center border border-amber-300 rounded-md uppercase">
                            </div>
                        </div>
                        <div v-if="sisaProjectShowPrices" class="flex justify-end pt-1 text-[10px] font-bold text-slate-600">
                            <span>Harga Satuan: Rp {{ formatRupiah(getMasterHarga(item.nama, item.harga)) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button @click="$emit('update:show-sisa-project-multi-out-modal', false)" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase">Batal</button>
                <button @click="submitSisaProjectMultiOut" class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase shadow-sm">Proses Pengeluaran</button>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
export default {
    props: {
        activeTab: { default: null },
        canApprove: { default: null },
        canEdit: { default: null },
        canInputTransaction: { default: null },
        canPrint: { default: null },
        filteredProjectLogsIn: { type: Array, default: () => [] },
        filteredProjectLogsOut: { type: Array, default: () => [] },
        filteredSisaProjects: { type: Array, default: () => [] },
        formSisaProjectMultiIn: { type: Array, default: () => [] },
        formSisaProjectMultiOut: { type: Array, default: () => [] },
        isCancelledLog: { default: null },
        isPendingLog: { default: null },
        logPageSize: { default: null },
        paginatedProjectLogsIn: { type: Array, default: () => [] },
        paginatedProjectLogsOut: { type: Array, default: () => [] },
        paginatedSisaProjects: { type: Array, default: () => [] },
        showSisaProjectMultiInModal: { default: null },
        showSisaProjectMultiOutModal: { default: null },
        sisaProjectLogInPage: { default: null },
        sisaProjectLogInPageCount: { default: null },
        sisaProjectLogOutPage: { default: null },
        sisaProjectLogOutPageCount: { default: null },
        sisaProjectPage: { default: null },
        sisaProjectPageCount: { default: null },
        sisaProjectPageEnd: { default: null },
        sisaProjectPageSize: { default: null },
        sisaProjectPageStart: { default: null },
        sisaProjectShowPrices: { default: null },
        spjLogBarang: { default: null },
        spjLogDateEnd: { default: null },
        spjLogDateStart: { default: null },
        spjLogKeperluan: { default: null },
        totalHargaPengeluaranSisaProject: { default: null },
        addCustomItemToSisaProjectMultiIn: { type: Function, required: true },
        addCustomItemToSisaProjectMultiOut: { type: Function, required: true },
        approveTransaction: { type: Function, required: true },
        cancelTransaction: { type: Function, required: true },
        editLog: { type: Function, required: true },
        exportStockGudangExcel: { type: Function, required: true },
        formatRupiah: { type: Function, required: true },
        getLogDisplayQty: { type: Function, required: true },
        getMasterHarga: { type: Function, required: true },
        getMasterSatuan: { type: Function, required: true },
        onSisaProjectMultiInItemInput: { type: Function, required: true },
        onSisaProjectMultiOutItemInput: { type: Function, required: true },
        openMasterDropdown: { type: Function, required: true },
        openSingleOutModal: { type: Function, required: true },
        openSisaProjectMultiInModal: { type: Function, required: true },
        openSisaProjectMultiOutModal: { type: Function, required: true },
        printDailyLogReport: { type: Function, required: true },
        printLabel: { type: Function, required: true },
        printStockGudang: { type: Function, required: true },
        removeSisaProjectMultiInItem: { type: Function, required: true },
        removeSisaProjectOutItem: { type: Function, required: true },
        scheduleCloseMasterDropdown: { type: Function, required: true },
        startBarcodeScan: { type: Function, required: true },
        submitSisaProjectMultiIn: { type: Function, required: true },
        submitSisaProjectMultiOut: { type: Function, required: true },
        updateMasterDropdown: { type: Function, required: true },
    },
    emits: ['update:show-sisa-project-multi-in-modal', 'update:show-sisa-project-multi-out-modal', 'update:sisa-project-log-in-page', 'update:sisa-project-log-out-page', 'update:sisa-project-page', 'update:sisa-project-show-prices', 'update:spj-log-barang', 'update:spj-log-date-end', 'update:spj-log-date-start', 'update:spj-log-keperluan'],
};
</script>

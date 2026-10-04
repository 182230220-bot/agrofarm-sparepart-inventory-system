<template>
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
        formSparepartMultiOut: { type: Array, default: () => [] },
        showSparepartMultiOutModal: { default: null },
        sparepartShowPrices: { default: null },
        addCustomItemToSparepartMultiOut: { type: Function, required: true },
        formatRupiah: { type: Function, required: true },
        getMasterHarga: { type: Function, required: true },
        getMasterSatuan: { type: Function, required: true },
        openSparepartOutDropdown: { type: Function, required: true },
        removeSparepartOutItem: { type: Function, required: true },
        submitSparepartMultiOut: { type: Function, required: true },
        updateSparepartOutDropdown: { type: Function, required: true },
    },
    emits: ['update:show-sparepart-multi-out-modal'],
};
</script>

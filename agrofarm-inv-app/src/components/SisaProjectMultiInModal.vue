<template>
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
</template>

<script lang="ts">
export default {
    props: {
        formSisaProjectMultiIn: { type: Array, default: () => [] },
        showSisaProjectMultiInModal: { default: null },
        addCustomItemToSisaProjectMultiIn: { type: Function, required: true },
        getMasterSatuan: { type: Function, required: true },
        onSisaProjectMultiInItemInput: { type: Function, required: true },
        openMasterDropdown: { type: Function, required: true },
        removeSisaProjectMultiInItem: { type: Function, required: true },
        scheduleCloseMasterDropdown: { type: Function, required: true },
        submitSisaProjectMultiIn: { type: Function, required: true },
        updateMasterDropdown: { type: Function, required: true },
    },
    emits: ['update:show-sisa-project-multi-in-modal'],
};
</script>

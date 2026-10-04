<template>
        <!-- MODAL: EDIT DATA MASTER -->
        <div v-if="showMasterEditModal && canEdit" class="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 no-print">
            <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 class="font-black text-slate-800 text-base">Edit Data Master</h3>
                        <p class="text-[11px] text-slate-500 mt-0.5">Perubahan harga dan qty akan disinkronkan ke data gudang terkait.</p>
                    </div>
                    <button @click="closeMasterEdit" class="p-2 hover:bg-slate-100 rounded-lg"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>
                <div v-if="editingMaster" class="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nomor SKU</label>
                        <input v-model="editingMaster.kode" type="text" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase outline-none focus:border-emerald-500">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Barang</label>
                        <input v-model="editingMaster.nama" type="text" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Qty / Stock</label>
                        <input v-model.number="editingMaster.currentStock" type="number" min="0" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Harga Satuan (Rp)</label>
                        <input v-model.number="editingMaster.harga" type="number" min="0" step="any" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tanggal Input</label>
                        <input v-model="editingMaster.tanggal" type="date" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Lead Time (Hari)</label>
                        <input v-model.number="editingMaster.leadTime" type="number" min="0" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Buffer Stok</label>
                        <input v-model.number="editingMaster.minStock" type="number" min="0" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Satuan</label>
                        <input v-model="editingMaster.satuan" type="text" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Keterangan Rak</label>
                        <input v-model="editingMaster.lokasi" type="text" placeholder="RAK A1" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase outline-none focus:border-emerald-500">
                    </div>
                </div>
                <div class="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                    <button @click="closeMasterEdit" class="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 text-xs font-bold">Batal</button>
                    <button @click="saveMasterEdit" class="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold">Simpan Perubahan</button>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
export default {
    props: {
        canEdit: { default: null },
        editingMaster: { default: null },
        showMasterEditModal: { default: null },
        closeMasterEdit: { type: Function, required: true },
        saveMasterEdit: { type: Function, required: true },
    },
    emits: [],
};
</script>

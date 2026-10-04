<template>
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
</template>

<script lang="ts">
export default {
    props: {
        formOrderMulti: { type: Array, default: () => [] },
        hasExistingPurchaseRequest: { default: null },
        showMonitoringInputModal: { default: null },
        addManualItemToMonitoring: { type: Function, required: true },
        getMasterSatuan: { type: Function, required: true },
        onMonitoringItemInput: { type: Function, required: true },
        onPurchaseRequestHeaderInput: { type: Function, required: true },
        openMasterDropdown: { type: Function, required: true },
        removeMonitoringItemToProcess: { type: Function, required: true },
        simpanOrderMulti: { type: Function, required: true },
        updateMasterDropdown: { type: Function, required: true },
    },
    emits: ['update:show-monitoring-input-modal'],
};
</script>

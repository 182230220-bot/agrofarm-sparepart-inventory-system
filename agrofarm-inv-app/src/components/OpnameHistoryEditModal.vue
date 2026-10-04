<template>
        <!-- MODAL EDIT RIWAYAT STOCK OPNAME (HANYA SEBELUM APPROVE) -->
        <div v-if="showOpnameHistoryEditModal && canEdit && editingOpnameHistory" class="fixed inset-0 z-[140] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[94vh] overflow-hidden flex flex-col">
                <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 class="font-black text-slate-800 text-sm uppercase">Edit Riwayat Stock Opname</h3>
                        <p class="text-[10px] text-slate-500 mt-1">{{ editingOpnameHistory.nomor }} · hanya dapat diedit selama status belum disetujui.</p>
                    </div>
                    <button @click="closeOpnameHistoryEdit" class="p-2 hover:bg-slate-100 rounded-lg"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>
                <div class="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 border-b border-slate-100">
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Gudang</label><input v-model="editingOpnameHistory.gudang" readonly class="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Tanggal</label><input v-model="editingOpnameHistory.tanggalInput" type="date" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Petugas *</label><input v-model="editingOpnameHistory.petugas" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold uppercase"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Keterangan</label><input v-model="editingOpnameHistory.keterangan" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase"></div>
                </div>
                <div class="p-4 flex items-center justify-between gap-3 border-b border-slate-100">
                    <select :value="opnameHistoryItemFilter" @change="$emit('update:opname-history-item-filter', $event.target.value)" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"><option value="all">Semua Item</option><option value="selisih">Hanya Ada Selisih</option></select>
                    <span class="text-[10px] text-slate-500 font-semibold">Perubahan di sini tidak langsung mengubah stok sampai opname disetujui.</span>
                </div>
                <div class="p-4 overflow-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                            <tr><th class="p-3 text-center">No</th><th class="p-3 text-center">Nomor SKU</th><th class="p-3 text-center">Rak/Lokasi</th><th class="p-3">Nama Barang</th><th class="p-3 text-center">Satuan</th><th class="p-3 text-center">Qty Sistem</th><th class="p-3 text-center">Qty Fisik</th><th class="p-3 text-center">Selisih</th><th class="p-3">Catatan</th></tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(it, i) in filteredEditingOpnameHistoryItems()" :key="i + '-' + (it.kode || it.nama || '')" :class="currentOpnameEditDifference(it) === 0 ? 'bg-emerald-50/40' : 'bg-red-50/40'">
                                <td class="p-3 text-center font-bold text-slate-400">{{ i + 1 }}</td>
                                <td class="p-3 text-center font-mono font-bold text-slate-600">{{ it.kode || '-' }}</td>
                                <td class="p-3 text-center font-bold text-slate-600 uppercase">{{ it.lokasi || '-' }}</td>
                                <td class="p-3 font-bold text-slate-800 uppercase">{{ it.nama }}</td>
                                <td class="p-3 text-center text-slate-600 uppercase">{{ it.satuan || 'Pcs' }}</td>
                                <td class="p-3 text-center font-bold text-slate-700">{{ it.qtySystem }}</td>
                                <td class="p-3 text-center"><input v-model.number="it.qtyFisik" type="number" min="0" class="w-24 p-1.5 text-center bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:border-emerald-500"></td>
                                <td class="p-3 text-center font-black" :class="currentOpnameEditDifference(it) === 0 ? 'text-slate-500' : (currentOpnameEditDifference(it) > 0 ? 'text-blue-700' : 'text-red-700')">{{ currentOpnameEditDifference(it) === 0 ? 'OK' : (currentOpnameEditDifference(it) > 0 ? '+' : '') + currentOpnameEditDifference(it) }}</td>
                                <td class="p-3"><input v-model="it.catatan" class="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-[10px] uppercase" placeholder="Catatan"></td>
                            </tr>
                            <tr v-if="filteredEditingOpnameHistoryItems().length === 0"><td colspan="9" class="p-8 text-center text-slate-400 italic">Tidak ada item sesuai filter.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button @click="closeOpnameHistoryEdit" class="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 text-xs font-bold">Batal</button>
                    <button @click="saveOpnameHistoryEdit" class="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black">Simpan Perubahan</button>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
export default {
    props: {
        canEdit: { default: null },
        editingOpnameHistory: { default: null },
        opnameHistoryItemFilter: { default: null },
        showOpnameHistoryEditModal: { default: null },
        closeOpnameHistoryEdit: { type: Function, required: true },
        currentOpnameEditDifference: { type: Function, required: true },
        filteredEditingOpnameHistoryItems: { type: Function, required: true },
        saveOpnameHistoryEdit: { type: Function, required: true },
    },
    emits: ['update:opname-history-item-filter'],
};
</script>

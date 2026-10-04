<template>
            <!-- MODAL KONFIRMASI OPNAME -->
            <div v-if="showOpnameConfirmModal" class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 no-print">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                    <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100"><i data-lucide="alert-circle" class="w-5 h-5"></i></div>
                            <div>
                                <h3 class="font-black text-slate-800 text-base">Konfirmasi Penyesuaian Stock Opname</h3>
                                <p class="text-[11px] text-slate-500 mt-0.5">Gudang: <b>{{ opnameDraft.gudang }}</b> &middot; Petugas: <b>{{ opnameDraft.petugas }}</b> &middot; Tanggal: <b>{{ opnameDraft.tanggal }}</b></p>
                            </div>
                        </div>
                        <button @click="$emit('update:show-opname-confirm-modal', false)" class="p-1.5 hover:bg-slate-100 rounded-lg"><i data-lucide="x" class="w-4 h-4"></i></button>
                    </div>
                    <div class="p-5 overflow-y-auto flex-1 space-y-3">
                        <div class="grid grid-cols-3 gap-3">
                            <div class="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                                <p class="text-[10px] font-bold text-emerald-700 uppercase">Cocok</p>
                                <p class="text-2xl font-black text-emerald-800">{{ opnameDraftMatchCount }}</p>
                            </div>
                            <div class="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
                                <p class="text-[10px] font-bold text-red-700 uppercase">Ada Selisih</p>
                                <p class="text-2xl font-black text-red-800">{{ opnameDraftSelisihCount }}</p>
                            </div>
                            <div class="p-3 bg-slate-100 rounded-lg border border-slate-200 text-center">
                                <p class="text-[10px] font-bold text-slate-600 uppercase">Total Diisi</p>
                                <p class="text-2xl font-black text-slate-800">{{ opnameDraftMatchCount + opnameDraftSelisihCount }}</p>
                            </div>
                        </div>
                        <div v-if="opnameDraftSelisihCount > 0" class="border border-red-200 rounded-lg overflow-hidden">
                            <div class="bg-red-50 px-3 py-2 border-b border-red-200 text-[11px] font-black text-red-900 uppercase">Detail Item dengan Selisih ({{ opnameDraftSelisihCount }})</div>
                            <div class="overflow-x-auto max-h-72">
                                <table class="w-full text-xs">
                                    <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                                        <tr><th class="p-2">Nama Barang</th><th class="p-2 text-center">Qty Sistem</th><th class="p-2 text-center">Qty Fisik</th><th class="p-2 text-center">Selisih</th><th class="p-2 text-center">Aksi Otomatis</th></tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        <tr v-for="row in opnameDraftSelisihItems" :key="row.nama">
                                            <td class="p-2 font-bold text-slate-800 uppercase">{{ row.nama }}</td>
                                            <td class="p-2 text-center">{{ row.qtySystem }}</td>
                                            <td class="p-2 text-center font-bold">{{ row.qtyFisikNum }}</td>
                                            <td class="p-2 text-center font-black" :class="row.selisih > 0 ? 'text-blue-700' : 'text-red-700'">{{ row.selisih > 0 ? '+' : '' }}{{ row.selisih }}</td>
                                            <td class="p-2 text-center">
                                                <span v-if="row.selisih > 0" class="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Tambah Stok (IN)</span>
                                                <span v-else class="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">Kurangi Stok (OUT)</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div v-else class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm font-semibold text-center">
                            <i data-lucide="check-circle" class="w-5 h-5 inline-block"></i> Semua item cocok. Tidak ada penyesuaian yang akan dibuat, hanya record opname yang disimpan.
                        </div>
                    </div>
                    <div class="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
                        <button @click="$emit('update:show-opname-confirm-modal', false)" class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">Batal</button>
                        <button v-if="canEdit" @click="submitOpname" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm">
                            <i data-lucide="check" class="w-3.5 h-3.5"></i> Ya, Sesuaikan Stok Sekarang
                        </button>
                    </div>
                </div>
            </div>
</template>

<script lang="ts">
export default {
    props: {
        canEdit: { default: null },
        opnameDraft: { default: null },
        opnameDraftMatchCount: { default: null },
        opnameDraftSelisihCount: { default: null },
        opnameDraftSelisihItems: { type: Array, default: () => [] },
        showOpnameConfirmModal: { default: null },
        submitOpname: { type: Function, required: true },
    },
    emits: ['update:show-opname-confirm-modal'],
};
</script>

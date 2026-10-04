<template>
        <!-- MODAL DETAIL & PENGISIAN APPROVAL -->
        <div v-if="showApprovalFormModal && canApprove" class="fixed inset-0 z-[130] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">
                <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 class="font-black text-slate-800 text-sm uppercase">Detail & Pengisian Approval Transaksi</h3>
                        <p class="text-[10px] text-slate-500 mt-1">Lengkapi dan periksa data transaksi sebelum disetujui. Data tidak dihilangkan dari proses approval.</p>
                    </div>
                    <button @click="$emit('update:show-approval-form-modal', false)" class="p-2 hover:bg-slate-100 rounded-lg"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>
                <div class="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tanggal *</label><input v-model="approvalForm.tanggal" type="date" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nomor Purchase Request</label><input v-model="approvalForm.nomorPR" readonly class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Gudang</label><input v-model="approvalForm.gudang" readonly class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Jenis Transaksi</label><input v-model="approvalForm.jenis" readonly class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Barang *</label><input v-model="approvalForm.nama" readonly class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold uppercase"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Qty *</label><input v-model.number="approvalForm.qty" type="number" min="1" class="w-full p-2.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-center"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Satuan</label><input v-model="approvalForm.satuan" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Harga Satuan (Rp)</label><input v-model.number="approvalForm.harga" type="number" min="0" class="w-full p-2.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-right"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Supplier / Asal Barang <span v-if="approvalForm.jenis.includes('INBOUND')" class="text-rose-500">*</span></label><input v-model="approvalForm.supplier" class="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs uppercase"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Penerima <span v-if="approvalForm.jenis.includes('OUTBOUND')" class="text-rose-500">*</span></label><input v-model="approvalForm.penerima" class="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs uppercase"></div>
                    <div class="sm:col-span-2"><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Kepentingan / Keterangan *</label><input v-model="approvalForm.keperluan" class="w-full p-2.5 bg-white border border-emerald-300 rounded-lg text-xs uppercase"></div>
                    <div class="sm:col-span-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-800">Setelah disetujui, transaksi akan memengaruhi stok. Hanya Super Admin yang dapat mengisi, mengubah, dan menyetujui data approval.</div>
                </div>
                <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button @click="$emit('update:show-approval-form-modal', false)" class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">Batal</button>
                    <button @click="confirmApprovalForm" class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black">Simpan & Setujui</button>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
export default {
    props: {
        approvalForm: { default: null },
        canApprove: { default: null },
        showApprovalFormModal: { default: null },
        confirmApprovalForm: { type: Function, required: true },
    },
    emits: ['update:show-approval-form-modal'],
};
</script>

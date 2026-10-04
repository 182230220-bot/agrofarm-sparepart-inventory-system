<template>
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
        purchaseReceiptDate: { default: null },
        purchaseReceiptItems: { type: Array, default: () => [] },
        purchaseReceiptPO: { default: null },
        purchaseReceiptSupplier: { default: null },
        showPurchaseReceiptModal: { default: null },
        formatRupiah: { type: Function, required: true },
        submitPurchaseReceipt: { type: Function, required: true },
    },
    emits: ['update:purchase-receipt-date', 'update:purchase-receipt-po', 'update:purchase-receipt-supplier', 'update:show-purchase-receipt-modal'],
};
</script>

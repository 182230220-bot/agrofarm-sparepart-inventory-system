<template>
        <!-- MODAL PENGELUARAN SATUAN -->
        <div v-if="showSingleOutModal && canInputTransaction" class="fixed inset-0 z-[125] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">
                <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 class="font-black text-slate-800 text-sm uppercase">Pengeluaran Satuan</h3>
                        <p class="text-[10px] text-slate-500 mt-1">Lengkapi data transaksi sebelum dikirim ke Approval, dengan format yang sama seperti form Approval.</p>
                    </div>
                    <button @click="$emit('update:show-single-out-modal', false)" class="p-2 hover:bg-slate-100 rounded-lg"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>
                <div class="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tanggal *</label><input v-model="singleOutForm.tanggal" type="date" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Gudang</label><input v-model="singleOutForm.gudang" readonly class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Jenis Transaksi</label><input v-model="singleOutForm.jenis" readonly class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Barang *</label><input v-model="singleOutForm.nama" readonly class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold uppercase"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Qty *</label><input v-model.number="singleOutForm.qty" type="number" min="1" :max="singleOutForm.item ? singleOutForm.item.qty : undefined" class="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-center"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Satuan</label><input v-model="singleOutForm.satuan" readonly placeholder="Satuan" class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold uppercase"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Harga Satuan (Rp)</label><input v-model.number="singleOutForm.harga" type="number" min="0" readonly class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-right"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Supplier / Asal Barang</label><input v-model="singleOutForm.supplier" class="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs uppercase"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Penerima *</label><input v-model="singleOutForm.penerima" class="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs uppercase"></div>
                    <div><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Pengambil</label><input v-model="singleOutForm.pengambil" class="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs uppercase"></div>
                    <div class="sm:col-span-2"><label class="text-[10px] font-bold text-slate-500 uppercase block mb-1">{{ singleOutForm.gudang === 'Sisa Project' ? 'Keterangan *' : 'Kepentingan / Keterangan *' }}</label><input v-if="singleOutForm.gudang === 'Sisa Project'" v-model="singleOutForm.keterangan" class="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs uppercase"><input v-else v-model="singleOutForm.keperluan" class="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs uppercase"></div>
                    <div class="sm:col-span-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-800">Setelah disimpan, transaksi masuk ke Approval dan stok belum berubah sampai disetujui Super Admin.</div>
                </div>
                <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button @click="$emit('update:show-single-out-modal', false)" class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">Batal</button>
                    <button @click="confirmSingleOut" class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black">Simpan & Kirim Approval</button>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
export default {
    props: {
        canInputTransaction: { default: null },
        showSingleOutModal: { default: null },
        singleOutForm: { default: null },
        confirmSingleOut: { type: Function, required: true },
    },
    emits: ['update:show-single-out-modal'],
};
</script>

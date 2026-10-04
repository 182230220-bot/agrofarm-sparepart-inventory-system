<template>
    <!-- MODAL OPSI CETAK KARTU STOCK -->
    <div v-if="showKartuStockOptions" class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 no-print">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                        <i data-lucide="printer" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="font-black text-slate-800 text-base">Opsi Cetak Kartu Stock</h3>
                        <p class="text-[11px] text-slate-500 mt-0.5" v-if="kartuStockOptions.item">Barang: <b class="uppercase">{{ kartuStockOptions.item.nama }}</b></p>
                    </div>
                </div>
                <button @click="$emit('update:show-kartu-stock-options', false)" class="p-1.5 hover:bg-slate-100 rounded-lg"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <div class="p-5 space-y-4">
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Ukuran Kertas</label>
                    <div class="grid grid-cols-3 gap-2">
                        <button @click="kartuStockOptions.paperSize = 'A4'" :class="kartuStockOptions.paperSize === 'A4' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-300'" class="px-3 py-2 rounded-lg text-xs font-bold border">A4<span class="block text-[9px] font-medium opacity-70 mt-0.5">210 x 297 mm</span></button>
                        <button @click="kartuStockOptions.paperSize = 'F4'" :class="kartuStockOptions.paperSize === 'F4' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-300'" class="px-3 py-2 rounded-lg text-xs font-bold border">F4<span class="block text-[9px] font-medium opacity-70 mt-0.5">210 x 330 mm</span></button>
                        <button @click="kartuStockOptions.paperSize = 'A5'" :class="kartuStockOptions.paperSize === 'A5' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-300'" class="px-3 py-2 rounded-lg text-xs font-bold border">A5<span class="block text-[9px] font-medium opacity-70 mt-0.5">148 x 210 mm</span></button>
                    </div>
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Orientasi</label>
                    <div class="grid grid-cols-2 gap-2">
                        <button @click="kartuStockOptions.orientation = 'portrait'" :class="kartuStockOptions.orientation === 'portrait' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-300'" class="px-3 py-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5"><i data-lucide="rectangle-vertical" class="w-3.5 h-3.5"></i> Portrait</button>
                        <button @click="kartuStockOptions.orientation = 'landscape'" :class="kartuStockOptions.orientation === 'landscape' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-300'" class="px-3 py-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5"><i data-lucide="rectangle-horizontal" class="w-3.5 h-3.5"></i> Landscape</button>
                    </div>
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Filter Periode Transaksi</label>
                    <div class="grid grid-cols-3 gap-2 mb-2">
                        <button @click="kartuStockOptions.filterMode = 'all'" :class="kartuStockOptions.filterMode === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300'" class="px-3 py-2 rounded-lg text-xs font-bold border">Semua</button>
                        <button @click="kartuStockOptions.filterMode = 'bulan'" :class="kartuStockOptions.filterMode === 'bulan' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300'" class="px-3 py-2 rounded-lg text-xs font-bold border">Per Bulan</button>
                        <button @click="kartuStockOptions.filterMode = 'rentang'" :class="kartuStockOptions.filterMode === 'rentang' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300'" class="px-3 py-2 rounded-lg text-xs font-bold border">Rentang Tgl</button>
                    </div>
                    <div v-if="kartuStockOptions.filterMode === 'bulan'">
                        <input v-model="kartuStockOptions.bulan" type="month" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold">
                    </div>
                    <div v-else-if="kartuStockOptions.filterMode === 'rentang'" class="grid grid-cols-2 gap-2">
                        <input v-model="kartuStockOptions.dateStart" type="date" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                        <input v-model="kartuStockOptions.dateEnd" type="date" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    </div>
                    <p v-else class="text-[10px] text-slate-500 italic">Semua transaksi barang ini akan dicetak (mulai stok awal).</p>
                </div>
            </div>
            <div class="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
                <button @click="$emit('update:show-kartu-stock-options', false)" class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">Batal</button>
                <button v-if="canPrint" @click="confirmPrintKartuStock" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm">
                    <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak Sekarang
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        canPrint: { default: null },
        kartuStockOptions: { default: null },
        showKartuStockOptions: { default: null },
        confirmPrintKartuStock: { type: Function, required: true },
    },
    emits: ['update:show-kartu-stock-options'],
};
</script>

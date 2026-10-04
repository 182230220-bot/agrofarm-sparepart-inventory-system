<template>
        <div v-if="activeTab === 'barcode_scan'" class="space-y-6">
            <div class="portal-card rounded-2xl overflow-hidden border border-blue-200 shadow-sm">
                <div class="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-5 text-white">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                            <i data-lucide="scan-barcode" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h2 class="font-black text-lg uppercase tracking-wide">Scan Barcode Sparepart</h2>
                            <p class="text-blue-100 text-xs mt-1">Gunakan scanner USB/Bluetooth di laptop atau ketik kode barang secara manual.</p>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="max-w-3xl mx-auto space-y-4">
                        <label class="block text-xs font-black text-slate-700 uppercase tracking-wider">Kode Barcode</label>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <input id="sparepart-barcode-tab-input" :value="barcodeScanInput" @input="$emit('update:barcode-scan-input', $event.target.value)" @keyup.enter="processScannedBarcode(barcodeScanInput)" @focus="$emit('update:barcode-scan-message','')" type="text" autocomplete="off" spellcheck="false" placeholder="Klik di sini lalu scan barcode..." class="flex-1 min-w-0 px-5 py-4 rounded-xl border-2 border-blue-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none text-base font-black uppercase tracking-widest shadow-sm">
                            <button @click="processScannedBarcode(barcodeScanInput)" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-black text-xs uppercase shadow-sm flex items-center justify-center gap-2">
                                <i data-lucide="search" class="w-4 h-4"></i> Proses Scan
                            </button>
                            <button @click="openBarcodeScanner" class="bg-slate-800 hover:bg-slate-900 text-white px-5 py-4 rounded-xl font-black text-xs uppercase shadow-sm flex items-center justify-center gap-2">
                                <i data-lucide="camera" class="w-4 h-4"></i> Kamera
                            </button>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div class="rounded-xl bg-blue-50 border border-blue-100 p-3 text-center">
                                <div class="text-[10px] font-black text-blue-800 uppercase">1. Fokuskan Kolom</div>
                                <div class="text-[10px] text-blue-600 mt-1">Klik kolom kode barcode</div>
                            </div>
                            <div class="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                                <div class="text-[10px] font-black text-emerald-800 uppercase">2. Scan</div>
                                <div class="text-[10px] text-emerald-600 mt-1">Arahkan scanner USB/Bluetooth</div>
                            </div>
                            <div class="rounded-xl bg-amber-50 border border-amber-100 p-3 text-center">
                                <div class="text-[10px] font-black text-amber-800 uppercase">3. Enter</div>
                                <div class="text-[10px] text-amber-600 mt-1">Otomatis proses jika scanner kirim Enter</div>
                            </div>
                        </div>
                        <div v-if="barcodeScanMessage" class="rounded-xl px-4 py-3 text-center text-xs font-bold" :class="barcodeScanSuccess ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'">{{ barcodeScanMessage }}</div>
                        <div class="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center text-[10px] text-slate-500">
                            <b>Catatan:</b> scanner barcode USB/Bluetooth bekerja seperti keyboard. Tidak memerlukan kamera dan cocok untuk penggunaan di laptop.
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
export default {
    props: {
        activeTab: { default: null },
        barcodeScanInput: { default: null },
        barcodeScanMessage: { default: null },
        barcodeScanSuccess: { default: null },
        openBarcodeScanner: { type: Function, required: true },
        processScannedBarcode: { type: Function, required: true },
    },
    emits: ['update:barcode-scan-input', 'update:barcode-scan-message'],
};
</script>

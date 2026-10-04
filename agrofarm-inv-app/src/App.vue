<template>
<div id="app" class="min-h-screen flex flex-col md:flex-row">
<AuthView :auth-ready="authReady" :is-authenticated="isAuthenticated" :login-form="loginForm" :auth-loading="authLoading" :auth-error="authError" @login="login" />

    <!-- Master autocomplete memakai dropdown Teleport; datalist global lama dihapus karena
         merender seluruh masterCatalog tersembunyi dan membebani setiap update Vue. -->
<!-- AREA CETAK KARTU STOCK BARANG TERPILIH -->
    <div id="label-print-area"></div>
    <!-- AREA CETAK BAST MONITORING ORDER -->
    <div id="bast-print-area" style="display:none; background:#fff; color:#000; font-family:Arial,Helvetica,sans-serif;">
        <div class="bast-sheet">
            <!-- HEADER PERUSAHAAN -->
            <table style="width:100%; border-collapse:collapse; table-layout:fixed;">
                <tr>
                    <td style="width:26%; padding:4mm 3mm 2mm 3mm; vertical-align:middle;">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg04Fvw4tFQIaOv_YisutC8tIMsbS2eM10wP2eWOotwA&s=10" alt="Agrofarm" style="width:42mm; max-width:100%; height:auto; max-height:20mm; object-fit:contain; display:block;">
                    </td>
                    <td style="width:74%; padding:3mm 3mm 2mm 0; vertical-align:middle; line-height:1.35;">
                        <div style="font-size:13pt; font-weight:800;">PT AGROFARM NUSA RAYA</div>
                        <div style="font-size:8.5pt;">Jl. Raya Ponorogo-Madiun KM 4 (JL Industri) Kertosari Babadan Ponorogo</div>
                        <div style="font-size:8.5pt;">NPWP : 0023021389647000</div>
                        <div style="font-size:8.5pt;">Tlp : 0352 - 3591094 &nbsp;&nbsp;&nbsp;&nbsp; / Fax : -</div>
                    </td>
                </tr>
            </table>

            <!-- JUDUL -->
            <table style="width:100%; border-collapse:collapse; table-layout:fixed; border-top:1px solid #000; border-bottom:1px solid #000;">
                <tr style="height:12mm;">
                    <td style="width:28%; padding:2mm 3mm; font-size:8.5pt; font-weight:700; vertical-align:middle;">Tgl Print: {{ bastData.printDate }}</td>
                    <td style="width:57%; padding:2mm; text-align:center; font-size:13pt; font-weight:800; vertical-align:middle;">BERITA ACARA SERAH TERIMA BARANG</td>
                    <td style="width:15%; padding:2mm 3mm; text-align:right; font-size:8.5pt; font-weight:700; vertical-align:middle;">1/1</td>
                </tr>
            </table>

            <!-- INFORMASI DOKUMEN -->
            <table class="bast-info-table">
                <tbody>
                    <tr>
                        <td style="width:50%; border-right:1px solid #000 !important;">
                            <div v-if="bastData.noBPB"><span class="bast-label">No. BPB</span> : {{ bastData.noBPB }}</div>
                            <div v-if="bastData.date"><span class="bast-label">Tanggal</span> : {{ bastData.date }}</div>
                            <div v-if="bastData.kodeSupplier"><span class="bast-label">Kode Supplier</span> : {{ bastData.kodeSupplier }}</div>
                            <div v-if="bastData.kodeDept"><span class="bast-label">Kode Dept</span> : {{ bastData.kodeDept }}</div>
                            <div v-if="bastData.noPO"><span class="bast-label">No. PO</span> : {{ bastData.noPO }}</div>
                            <div v-if="bastData.noSJ"><span class="bast-label">No. SJ</span> : {{ bastData.noSJ }}</div>
                            <div v-if="bastData.nomorPR"><span class="bast-label">No. PR</span> : {{ bastData.nomorPR }}</div>
                        </td>
                        <td style="width:50%;">
                            <div v-if="bastData.supplier"><span class="bast-label">Supplier</span> : {{ bastData.supplier }}</div>
                            <div v-if="bastData.alamat" style="margin-top:1mm;"><span class="bast-label">Alamat</span> : {{ bastData.alamat }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- TABEL BARANG -->
            <table class="bast-items-table">
                <colgroup><col style="width:7%;"><col style="width:63%;"><col style="width:30%;"></colgroup>
                <thead>
                    <tr><th>No.</th><th>Nama Barang</th><th>Qty</th></tr>
                </thead>
                <tbody>
                    <tr class="bast-item-row">
                        <td style="text-align:left; vertical-align:top;">1</td>
                        <td style="font-weight:600; text-transform:uppercase; vertical-align:top;">{{ bastData.nama }}</td>
                        <td style="text-align:center; font-weight:600; vertical-align:top;">{{ bastData.qtyReceived }} {{ bastData.satuan }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- HASIL ANALISA + TANDA TANGAN -->
            <div class="bast-bottom">
                <div v-if="bastData.hasilAnalisa" class="bast-analysis">
                    <div style="font-weight:700; margin-bottom:1mm;">Hasil Analisa</div>
                    <div class="bast-analysis-box">{{ bastData.hasilAnalisa }}</div>
                </div>
                <div class="bast-signature">
                    <div>Created By<br><br><br><br><span style="font-weight:400;">( ____________________ )</span></div>
                    <div>Verified By<br><br><br><br><span style="font-weight:400;">( ____________________ )</span></div>
                    <div>Approved By<br><br><br><br><span style="font-weight:400;">( ____________________ )</span></div>
                </div>
            </div>
        </div>
    </div>
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
                <button @click="showKartuStockOptions = false" class="p-1.5 hover:bg-slate-100 rounded-lg"><i data-lucide="x" class="w-4 h-4"></i></button>
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
                <button @click="showKartuStockOptions = false" class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">Batal</button>
                <button v-if="canPrint" @click="confirmPrintKartuStock" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm">
                    <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak Sekarang
                </button>
            </div>
        </div>
    </div>
    <!-- SIDEBAR LEFT NAVIGATION -->
    <aside v-if="isAuthenticated" class="agrofarm-sidebar w-full md:w-72 bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white flex-shrink-0 border-r border-emerald-800/50 flex flex-col no-print sticky top-0 md:h-screen z-40">
        <div class="agrofarm-sidebar-scroll flex-1 min-h-0">
            <!-- BRAND HEADER -->
            <div class="p-5 border-b border-emerald-800/60 flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-500/10 border border-emerald-400/30 rounded-xl flex items-center justify-center text-emerald-400 shadow-inner flex-shrink-0">
                    <i data-lucide="sprout" class="w-5 h-5"></i>
                </div>
                <div>
                    <div class="flex items-center gap-1.5">
                        <span class="font-extrabold text-sm tracking-wide text-white uppercase">Agrofarm</span>
                        <span class="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">spare part</span>
                    </div>
                    <p class="text-[10px] text-emerald-200/70 font-medium leading-tight">Sistem Inventory</p>
                </div>
            </div>
            <!-- NAVIGATION MENU -->
            <nav class="p-4 space-y-1.5">
                <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 px-3 mb-2">Menu Utama</p>
                <button @click="activeTab = 'dashboard'" :class="activeTab === 'dashboard' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center gap-3 text-xs transition-all">
                    <i data-lucide="layout-dashboard" class="w-4 h-4 text-emerald-400"></i> Dashboard Utama
                </button>
                <button @click="activeTab = 'master_db'" :class="activeTab === 'master_db' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                    <div class="flex items-center gap-3">
                        <i data-lucide="database" class="w-4 h-4 text-emerald-400"></i>
                        <span>Data Master</span>
                    </div>
                    <span class="bg-emerald-900/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 font-mono">{{ masterCatalog.length }}</span>
                </button>
                <button @click="activeTab = 'monitoring'" :class="activeTab === 'monitoring' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                    <div class="flex items-center gap-3">
                        <i data-lucide="clipboard-list" class="w-4 h-4 text-emerald-400"></i>
                        <span>Purchase Request</span>
                    </div>
                    <span class="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">{{ purchasePendingCount }}</span>
                </button>
                <!-- GROUP PLANNING: berdiri sendiri, tidak masuk Purchase Request -->
                <div v-if="canPlanning" class="mt-7 pt-4 border-t-2 border-emerald-800/70">
                    <p class="text-[10px] font-black uppercase tracking-wider text-cyan-300 px-3 mb-2">Planning</p>
                    <button @click="openPlanningTab('planning_request')" :class="activeTab === 'planning_request' ? 'bg-cyan-700/30 text-white shadow-md font-bold border border-cyan-500/30' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                        <div class="flex items-center gap-3"><i data-lucide="clipboard-plus" class="w-4 h-4 text-cyan-300"></i><span>Planning Request</span></div>
                        <span class="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">{{ planningRequestNotificationCount }}</span>
                    </button>
                    <button @click="openPlanningTab('planning_usage')" :class="activeTab === 'planning_usage' ? 'bg-cyan-700/30 text-white shadow-md font-bold border border-cyan-500/30' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                        <div class="flex items-center gap-3"><i data-lucide="calendar-clock" class="w-4 h-4 text-cyan-300"></i><span>Planning Penggunaan</span></div>
                        <span class="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">{{ planningUsageNotificationCount }}</span>
                    </button>
                </div>
                <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 px-3 mt-6 mb-2">Stock Opname</p>
                <button v-if="canEdit" @click="activeTab = 'opname'" :class="activeTab === 'opname' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                    <div class="flex items-center gap-3">
                        <i data-lucide="clipboard-check" class="w-4 h-4 text-emerald-400"></i>
                        <span>Input Stock Opname</span>
                    </div>
                    <span v-if="opnameDraftSelisihCount > 0" class="bg-red-500/20 text-red-300 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30 font-mono">{{ opnameDraftSelisihCount }} Selisih</span>
                </button>
                <button @click="activeTab = 'opname_history'" :class="activeTab === 'opname_history' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                    <div class="flex items-center gap-3">
                        <i data-lucide="history" class="w-4 h-4 text-emerald-400"></i>
                        <span>Riwayat Opname</span>
                    </div>
                    <span class="bg-emerald-900/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 font-mono">{{ opnameHistory.length }}</span>
                </button>
                <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 px-3 mt-6 mb-2">Manajemen Gudang</p>
                <button @click="activeTab = 'sparepart'" :class="activeTab === 'sparepart' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                    <div class="flex items-center gap-3">
                        <i data-lucide="wrench" class="w-4 h-4 text-emerald-400"></i>
                        <span>Gudang Spare Part</span>
                    </div>
                    <span class="bg-emerald-900/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 font-mono">{{ totalSparepartQty }}</span>
                </button>
                <button @click="activeTab = 'barcode_scan'; focusBarcodeTabInput()" :class="activeTab === 'barcode_scan' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                    <span class="flex items-center gap-3"><i data-lucide="scan-barcode" class="w-4 h-4"></i> Scan Barcode</span>
                    <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                </button>
                <button @click="activeTab = 'sisa_project'" :class="activeTab === 'sisa_project' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                    <div class="flex items-center gap-3">
                        <i data-lucide="boxes" class="w-4 h-4 text-emerald-400"></i>
                        <span>Gudang Sisa Project</span>
                    </div>
                    <span class="bg-emerald-900/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 font-mono">{{ totalSisaProjectQty }}</span>
                </button>
                <button v-if="canApprove" @click="activeTab = 'approval'" :class="activeTab === 'approval' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                    <div class="flex items-center gap-3">
                        <i data-lucide="badge-check" class="w-4 h-4 text-emerald-400"></i>
                        <span>Approval Transaksi</span>
                    </div>
                    <span class="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">{{ pendingApprovalLogs.length + pendingMasterApprovalRequests.length }}</span>
                </button>
                <button v-if="canManageAccounts" @click="activeTab = 'settings'; loadUserAccounts(); loadSecuritySettings()" :class="activeTab === 'settings' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center gap-3 text-xs transition-all">
                    <i data-lucide="settings" class="w-4 h-4 text-emerald-400"></i>
                    <span>Pengaturan</span>
                </button>
            </nav>
        </div>
        <div v-if="isAuthenticated" class="agrofarm-sidebar-footer px-4 pb-3">
            <div class="rounded-xl bg-emerald-950/60 border border-emerald-800/70 p-3">
                <div class="flex items-center justify-between gap-2">
                    <div class="min-w-0">
                        <p class="text-[9px] text-emerald-300/70 uppercase font-bold">Akun</p>
                        <p class="text-[10px] text-white font-semibold truncate">{{ authUser?.email || '-' }}</p>
                        <p class="text-[9px] text-emerald-300 mt-0.5">{{ roleLabel }}</p>
                    </div>
                    <button @click="logout" class="text-[9px] text-rose-300 hover:text-white font-bold">Keluar</button>
                </div>
            </div>
        </div>
        <!-- QUICK ACTIONS -->
        <div class="agrofarm-sidebar-footer p-4 border-t border-emerald-800/60 space-y-2 bg-emerald-950/95">
            <button v-if="canEdit" @click="exportToExcel" class="w-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 px-3 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 border border-emerald-700/50 transition-all">
                <i data-lucide="file-spreadsheet" class="w-4 h-4 text-emerald-400"></i>
                <span>Export Laporan Excel</span>
            </button>
        </div>
    </aside>
    <!-- MAIN CONTENT CONTAINER -->
    <main class="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto min-w-0">
        <!-- TAB 1: DASHBOARD UTAMA -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
                <div class="portal-card p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Data Master</p>
                        <h3 class="text-2xl font-black text-slate-800 mt-1">{{ masterCatalog.length }} <span class="text-xs font-normal text-slate-400">Item</span></h3>
                    </div>
                    <div class="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                        <i data-lucide="layers" class="w-6 h-6"></i>
                    </div>
                </div>
                <div class="portal-card p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Stok Sparepart</p>
                        <h3 class="text-2xl font-black text-slate-800 mt-1">{{ totalSparepartQty }} <span class="text-xs font-normal text-slate-400">Qty</span></h3>
                    </div>
                    <div class="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                        <i data-lucide="wrench" class="w-6 h-6"></i>
                    </div>
                </div>
                <div class="portal-card p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Stok Sisa Project</p>
                        <h3 class="text-2xl font-black text-slate-800 mt-1">{{ totalSisaProjectQty }} <span class="text-xs font-normal text-slate-400">Qty</span></h3>
                    </div>
                    <div class="p-3 bg-teal-50 text-teal-700 rounded-xl border border-teal-100">
                        <i data-lucide="package-check" class="w-6 h-6"></i>
                    </div>
                </div>
                <div class="portal-card p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Purchase Pending</p>
                        <h3 class="text-2xl font-black text-amber-600 mt-1">{{ purchasePendingCount }} <span class="text-xs font-normal text-amber-600/70">Antrean</span></h3>
                    </div>
                    <div class="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                        <i data-lucide="clock" class="w-6 h-6"></i>
                    </div>
                </div>
            </div>
            <!-- LOW STOCK ALERT WIDGET -->
            <div v-if="lowStockItems.length > 0" class="portal-card rounded-xl overflow-hidden border-l-4 border-red-500 no-print">
                <div class="p-4 border-b border-slate-100 bg-red-50/40 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i data-lucide="alert-triangle" class="w-4 h-4 text-red-600"></i>
                        <h3 class="font-black text-red-900 uppercase text-xs tracking-wider">Peringatan Stok Menipis / Habis</h3>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[11px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-200">{{ lowStockItems.length }} Item Perlu Restock</span>
                        <button v-if="canEdit" type="button" @click.stop.prevent="exportLowStockExcel" class="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-sm" style="pointer-events:auto !important; position:relative; z-index:30;">
                            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Export Excel
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto max-h-52">
                    <table class="w-full text-xs">
                        <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                            <tr>
                                <th class="p-2.5 text-left">Nama Barang</th>
                                <th class="p-2.5 text-center">No. PR</th>
                                <th class="p-2.5 text-center">Tgl. PR</th>
                                <th class="p-2.5 text-center">Gudang</th>
                                <th class="p-2.5 text-center">Lokasi</th>
                                <th class="p-2.5 text-center">Stok Saat Ini</th>
                                <th class="p-2.5 text-center">Min. Stok</th>
                                <th class="p-2.5 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(row, i) in lowStockItems" :key="i" :class="row.qty === 0 ? 'bg-red-50/60' : 'bg-amber-50/40'">
                                <td class="p-2.5 font-bold text-slate-800 uppercase">{{ row.nama }}</td>
                                <td class="p-2.5 text-center text-[10px] font-bold text-slate-700">{{ row.nomorPR || '-' }}</td>
                                <td class="p-2.5 text-center text-[10px] font-mono font-bold text-slate-600">{{ row.tglPR || '-' }}</td>
                                <td class="p-2.5 text-center text-slate-600 text-[10px] font-bold">{{ row.gudang }}</td>
                                <td class="p-2.5 text-center text-slate-500 text-[10px] uppercase">{{ row.lokasi }}</td>
                                <td class="p-2.5 text-center font-black" :class="row.qty === 0 ? 'text-red-700' : 'text-amber-700'">{{ row.qty }} {{ row.satuan }}</td>
                                <td class="p-2.5 text-center text-slate-600 font-semibold">{{ row.minStock }}</td>
                                <td class="p-2.5 text-center">
                                    <span v-if="row.qty === 0" class="px-2 py-0.5 rounded-lg text-[10px] font-black bg-red-100 text-red-800 border border-red-200">HABIS</span>
                                    <span v-else class="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">MENIPIS</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- FILTER DASHBOARD -->
            <div class="portal-card p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 no-print">
                <div class="flex items-center gap-2">
                    <i data-lucide="calendar-range" class="w-4 h-4 text-emerald-600"></i>
                    <span class="text-xs font-bold text-slate-700 uppercase">Filter Tanggal Inbound & Outbound:</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <input v-model="dashFilterDateStart" type="date" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500">
                    <span class="text-xs text-slate-400">s/d</span>
                    <input v-model="dashFilterDateEnd" type="date" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500">
                    <button @click="resetDashFilter" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold">Reset</button>
                    <button v-if="canPrint" @click="printDailyLogReport('all')" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak Laporan Per Tanggal
                    </button>
                    <button v-if="canEdit" @click="exportDashboardByDate" class="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <i data-lucide="download" class="w-3.5 h-3.5"></i> Export Excel Per Tanggal
                    </button>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl no-print">
                <div class="relative max-w-xl">
                    <i data-lucide="search" class="w-4 h-4 absolute left-3 top-3 text-slate-400"></i>
                    <input v-model="dashSearchBarang" type="text" autocomplete="off" spellcheck="false" placeholder="Cari nama barang di Dashboard..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium uppercase focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                </div>
            </div>
            <!-- SECTION 1: GUDANG SPAREPART (IN & OUT DASHBOARD) -->
            <div class="space-y-3">
                <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <i data-lucide="wrench" class="w-5 h-5 text-emerald-700"></i>
                    <h2 class="font-extrabold text-slate-800 uppercase text-xs tracking-wider">Pergerakan Stok: Gudang Spare Part (Inbound & Outbound)</h2><button @click="sparepartShowPrices = !sparepartShowPrices" class="ml-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200">{{ sparepartShowPrices ? 'Hide Harga' : 'Tampilkan Harga' }}</button>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-emerald-600">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span class="font-bold text-xs uppercase text-emerald-900 flex items-center gap-1.5">
                                <i data-lucide="arrow-down-left" class="w-4 h-4 text-emerald-600"></i> Sparepart Masuk (Inbound)
                            </span>
                            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">{{ filteredSparepartLogsIn.length }} Records</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs excel-print-table">
                                <thead class="bg-emerald-50/70 font-bold text-emerald-900 uppercase text-[9px] sticky top-0 border-b border-emerald-200">
                                    <tr>
                                        <th class="p-2">Tgl</th>
                                        <th class="p-2">Nama Barang</th>
                                        <th class="p-2 text-center">Satuan</th>
                                        <th class="p-2 text-center">Qty</th>
                                        <th class="p-2 text-center">Qty Awal</th>
                                        <th class="p-2 text-center">Qty Akhir</th>
                                        <th class="p-2">No. PO / Supplier</th>
                                    <th class="p-2">Keterangan</th>
                                        <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Satuan</th>
                                        <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Total</th>
                                        <th class="p-2 text-center no-print">Status / Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="log in paginatedDashboardSparepartIn" :key="log.id" class="hover:bg-emerald-50/30" :class="isCancelledLog(log) ? 'bg-rose-50/70 opacity-80' : ''">
                                        <td class="p-2 text-slate-500 text-[10px] font-mono">
                                            {{ log.tgl }}
                                            <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                        </td>
                                        <td class="p-2 font-bold text-slate-800 uppercase">{{ log.nama }}</td>
                                        <td class="p-2 text-center font-bold text-slate-700">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                        <td class="p-2 text-center font-bold text-emerald-700 bg-emerald-50/50 rounded">+{{ getLogDisplayQty(log) }}</td>
                                        <td class="p-2 text-center">{{ log.qtyAwal ?? '-' }}</td>
                                        <td class="p-2 text-center font-bold">{{ log.qtyAkhir ?? '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase"><div>No. PO: {{ log.nomorPO || '-' }}</div><div class="mt-0.5">Supplier: {{ log.supplier || '-' }}</div></td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                        <td v-if="sparepartShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                        <td v-if="sparepartShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                        <td class="p-2 text-center no-print">
                                            <span :class="isCancelledLog(log) ? 'text-rose-600' : (isPendingLog(log) ? 'text-amber-600' : 'text-emerald-600')" class="text-[9px] font-bold block">{{ approvalLabel(log) }}</span>
                                            <button v-if="canApprove && isPendingLog(log)" @click="approveTransaction(log)" class="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold underline">Setujui</button>
                                            <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="editLog(log)" class="text-amber-600 hover:text-amber-800 text-[10px] font-bold underline">Edit</button>
                                            <button v-if="canEdit && !isPendingLog(log) && !log.isCancelled" @click="cancelTransaction(log)" class="text-rose-600 hover:text-rose-800 text-[10px] font-bold underline">Cancel</button>
                                        </td>
                                    </tr>
                                    <tr v-if="filteredSparepartLogsIn.length === 0">
                                        <td colspan="6" class="p-6 text-center text-slate-400 italic text-[11px]">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        <div v-if="filteredSparepartLogsIn.length > 0" class="flex items-center justify-between gap-2 pt-2">
                            <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((dashboardSparepartInPage - 1) * dashboardPageSize) + 1 }}–{{ Math.min(dashboardSparepartInPage * dashboardPageSize, filteredSparepartLogsIn.length) }} dari {{ filteredSparepartLogsIn.length }} data</span>
                            <div class="flex items-center gap-1">
                                <button @click="dashboardSparepartInPage = Math.max(1, dashboardSparepartInPage - 1)" :disabled="dashboardSparepartInPage <= 1" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                                <span class="px-2 py-1 text-[9px] font-bold text-slate-700">{{ dashboardSparepartInPage }} / {{ dashboardSparepartInPageCount }}</span>
                                <button @click="dashboardSparepartInPage = Math.min(dashboardSparepartInPageCount, dashboardSparepartInPage + 1)" :disabled="dashboardSparepartInPage >= dashboardSparepartInPageCount" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                            </div>
                        </div>
                
                        </div>
                    </div>
                    <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-amber-600">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span class="font-bold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                                <i data-lucide="arrow-up-right" class="w-4 h-4 text-amber-600"></i> Sparepart Keluar (Outbound)
                            </span>
                            <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">{{ filteredSparepartLogsOut.length }} Records</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs excel-print-table">
                                <thead class="bg-amber-50/70 font-bold text-amber-900 uppercase text-[9px] sticky top-0 border-b border-amber-200">
                                    <tr>
                                        <th class="p-2">Tgl</th>
                                        <th class="p-2">Nama Barang</th>
                                        <th class="p-2 text-center">Satuan</th>
                                        <th class="p-2 text-center">Qty</th>
                                        <th class="p-2 text-center">Qty Awal</th>
                                        <th class="p-2 text-center">Qty Akhir</th>
                                        <th class="p-2">Penerima</th>
                                        <th class="p-2">Keterangan</th>
                                        <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Satuan</th>
                                        <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Total</th>
                                        <th class="p-2 text-center no-print">Status / Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="log in paginatedDashboardSparepartOut" :key="log.id" class="hover:bg-amber-50/30" :class="isCancelledLog(log) ? 'bg-rose-50/70 opacity-80' : ''">
                                        <td class="p-2 text-slate-500 text-[10px] font-mono">
                                            {{ log.tgl }}
                                            <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                        </td>
                                        <td class="p-2 font-bold text-slate-800 uppercase">{{ log.nama }}</td>
                                        <td class="p-2 text-center font-bold text-slate-700">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                        <td class="p-2 text-center font-bold text-amber-700 bg-amber-50/50 rounded">-{{ getLogDisplayQty(log) }}</td>
                                        <td class="p-2 text-center">{{ log.qtyAwal ?? '-' }}</td>
                                        <td class="p-2 text-center font-bold">{{ log.qtyAkhir ?? '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.penerima || log.user || '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                        <td v-if="sparepartShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                        <td v-if="sparepartShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                        <td class="p-2 text-center no-print">
                                            <span :class="isCancelledLog(log) ? 'text-rose-600' : (isPendingLog(log) ? 'text-amber-600' : 'text-emerald-600')" class="text-[9px] font-bold block">{{ approvalLabel(log) }}</span>
                                            <button v-if="canApprove && isPendingLog(log)" @click="approveTransaction(log)" class="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold underline">Setujui</button>
                                            <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="editLog(log)" class="text-amber-600 hover:text-amber-800 text-[10px] font-bold underline">Edit</button>
                                            <button v-if="canEdit && !isPendingLog(log) && !log.isCancelled" @click="cancelTransaction(log)" class="text-rose-600 hover:text-rose-800 text-[10px] font-bold underline">Cancel</button>
                                        </td>
                                    </tr>
                                    <tr v-if="filteredSparepartLogsOut.length === 0">
                                        <td colspan="11" class="p-6 text-center text-slate-400 italic text-[11px]">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        <div v-if="filteredSparepartLogsOut.length > 0" class="flex items-center justify-between gap-2 pt-2">
                            <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((dashboardSparepartOutPage - 1) * dashboardPageSize) + 1 }}–{{ Math.min(dashboardSparepartOutPage * dashboardPageSize, filteredSparepartLogsOut.length) }} dari {{ filteredSparepartLogsOut.length }} data</span>
                            <div class="flex items-center gap-1">
                                <button @click="dashboardSparepartOutPage = Math.max(1, dashboardSparepartOutPage - 1)" :disabled="dashboardSparepartOutPage <= 1" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                                <span class="px-2 py-1 text-[9px] font-bold text-slate-700">{{ dashboardSparepartOutPage }} / {{ dashboardSparepartOutPageCount }}</span>
                                <button @click="dashboardSparepartOutPage = Math.min(dashboardSparepartOutPageCount, dashboardSparepartOutPage + 1)" :disabled="dashboardSparepartOutPage >= dashboardSparepartOutPageCount" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                            </div>
                        </div>
                
                        </div>
                    </div>
                </div>
            </div>
            <!-- SECTION 2: GUDANG SISA PROJECT (IN & OUT DASHBOARD) -->
            <div class="space-y-3 pt-4">
                <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <i data-lucide="boxes" class="w-5 h-5 text-teal-700"></i>
                    <h2 class="font-extrabold text-slate-800 uppercase text-xs tracking-wider">Pergerakan Stok: Gudang Sisa Project (Inbound & Outbound)</h2><button @click="sisaProjectShowPrices = !sisaProjectShowPrices" class="ml-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200">{{ sisaProjectShowPrices ? 'Hide Harga' : 'Tampilkan Harga' }}</button>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-emerald-600">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span class="font-bold text-xs uppercase text-emerald-900 flex items-center gap-1.5">
                                <i data-lucide="arrow-down-left" class="w-4 h-4 text-emerald-600"></i> Sisa Project Masuk (Inbound)
                            </span>
                            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">{{ filteredProjectLogsIn.length }} Records</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs excel-print-table">
                                <thead class="bg-emerald-50/70 font-bold text-emerald-900 uppercase text-[9px] sticky top-0 border-b border-emerald-200">
                                    <tr>
                                        <th class="p-2">Tgl</th>
                                        <th class="p-2">Nama Barang</th>
                                        <th class="p-2 text-center">Satuan</th>
                                        <th class="p-2 text-center">Qty</th>
                                        <th class="p-2 text-center">Qty Awal</th>
                                        <th class="p-2 text-center">Qty Akhir</th>
                                        <th class="p-2">Asal / Kepentingan</th>
                                        <th class="p-2">Keterangan</th>
                                        <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Satuan</th>
                                        <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Total</th>
                                        <th class="p-2 text-center no-print">Status / Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="log in paginatedDashboardSisaProjectIn" :key="log.id" class="hover:bg-emerald-50/30" :class="isCancelledLog(log) ? 'bg-rose-50/70 opacity-80' : ''">
                                        <td class="p-2 text-slate-500 text-[10px] font-mono">
                                            {{ log.tgl }}
                                            <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                        </td>
                                        <td class="p-2 font-bold text-slate-800 uppercase">{{ log.nama }}</td>
                                        <td class="p-2 text-center font-bold text-slate-700">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                        <td class="p-2 text-center font-bold text-emerald-700 bg-emerald-50/50 rounded">+{{ getLogDisplayQty(log) }}</td>
                                        <td class="p-2 text-center">{{ log.qtyAwal ?? '-' }}</td>
                                        <td class="p-2 text-center font-bold">{{ log.qtyAkhir ?? '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.supplier || log.keperluan || '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                        <td v-if="sisaProjectShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                        <td v-if="sisaProjectShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                        <td class="p-2 text-center no-print">
                                            <span :class="isCancelledLog(log) ? 'text-rose-600' : (isPendingLog(log) ? 'text-amber-600' : 'text-emerald-600')" class="text-[9px] font-bold block">{{ approvalLabel(log) }}</span>
                                            <button v-if="canApprove && isPendingLog(log)" @click="approveTransaction(log)" class="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold underline">Setujui</button>
                                            <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="editLog(log)" class="text-amber-600 hover:text-amber-800 text-[10px] font-bold underline">Edit</button>
                                        </td>
                                    </tr>
                                    <tr v-if="filteredProjectLogsIn.length === 0">
                                        <td colspan="9" class="p-6 text-center text-slate-400 italic text-[11px]">Belum ada data barang masuk sisa project pada periode ini.</td>
                                    </tr>
                                </tbody>
                            </table>
                        <div v-if="filteredProjectLogsIn.length > 0" class="flex items-center justify-between gap-2 pt-2">
                            <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((dashboardSisaProjectInPage - 1) * dashboardPageSize) + 1 }}–{{ Math.min(dashboardSisaProjectInPage * dashboardPageSize, filteredProjectLogsIn.length) }} dari {{ filteredProjectLogsIn.length }} data</span>
                            <div class="flex items-center gap-1">
                                <button @click="dashboardSisaProjectInPage = Math.max(1, dashboardSisaProjectInPage - 1)" :disabled="dashboardSisaProjectInPage <= 1" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                                <span class="px-2 py-1 text-[9px] font-bold text-slate-700">{{ dashboardSisaProjectInPage }} / {{ dashboardSisaProjectInPageCount }}</span>
                                <button @click="dashboardSisaProjectInPage = Math.min(dashboardSisaProjectInPageCount, dashboardSisaProjectInPage + 1)" :disabled="dashboardSisaProjectInPage >= dashboardSisaProjectInPageCount" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                            </div>
                        </div>
                
                        </div>
                    </div>
                    <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-amber-600">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span class="font-bold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                                <i data-lucide="arrow-up-right" class="w-4 h-4 text-amber-600"></i> Sisa Project Keluar (Outbound)
                            </span>
                            <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">{{ filteredProjectLogsOut.length }} Records</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs excel-print-table">
                                <thead class="bg-amber-50/70 font-bold text-amber-900 uppercase text-[9px] sticky top-0 border-b border-amber-200">
                                    <tr>
                                        <th class="p-2">Tgl</th>
                                        <th class="p-2">Nama Barang</th>
                                        <th class="p-2 text-center">Satuan</th>
                                        <th class="p-2 text-center">Qty</th>
                                        <th class="p-2 text-center">Qty Awal</th>
                                        <th class="p-2 text-center">Qty Akhir</th>
                                        <th class="p-2">Penerima</th>
                                        <th class="p-2">Keterangan</th>
                                        <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Satuan</th>
                                        <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Total</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="log in paginatedDashboardSisaProjectOut" :key="log.id" class="hover:bg-amber-50/30" :class="isCancelledLog(log) ? 'bg-rose-50/70 opacity-80' : ''">
                                        <td class="p-2 text-slate-500 text-[10px] font-mono">
                                            {{ log.tgl }}
                                            <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                        </td>
                                        <td class="p-2 font-bold text-slate-800 uppercase">{{ log.nama }}</td>
                                        <td class="p-2 text-center font-bold text-slate-700">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                        <td class="p-2 text-center font-bold text-amber-700 bg-amber-50/50 rounded">-{{ getLogDisplayQty(log) }}</td>
                                        <td class="p-2 text-center">{{ log.qtyAwal ?? '-' }}</td>
                                        <td class="p-2 text-center font-bold">{{ log.qtyAkhir ?? '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.penerima || log.user || '-' }}</td>
                                        <td class="p-2 text-[10px] text-slate-600 uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                        <td v-if="sisaProjectShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                        <td v-if="sisaProjectShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                        <td class="p-2 text-center no-print">
                                            <span :class="isCancelledLog(log) ? 'text-rose-600' : (isPendingLog(log) ? 'text-amber-600' : 'text-emerald-600')" class="text-[9px] font-bold block">{{ approvalLabel(log) }}</span>
                                            <button v-if="canApprove && isPendingLog(log)" @click="approveTransaction(log)" class="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold underline">Setujui</button>
                                            <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="editLog(log)" class="text-amber-600 hover:text-amber-800 text-[10px] font-bold underline">Edit</button>
                                        </td>
                                    </tr>
                                    <tr v-if="filteredProjectLogsOut.length === 0">
                                        <td colspan="11" class="p-6 text-center text-slate-400 italic text-[11px]">Belum ada data barang keluar sisa project pada periode ini.</td>
                                    </tr>
                                </tbody>
                            </table>
                        <div v-if="filteredProjectLogsOut.length > 0" class="flex items-center justify-between gap-2 pt-2">
                            <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((dashboardSisaProjectOutPage - 1) * dashboardPageSize) + 1 }}–{{ Math.min(dashboardSisaProjectOutPage * dashboardPageSize, filteredProjectLogsOut.length) }} dari {{ filteredProjectLogsOut.length }} data</span>
                            <div class="flex items-center gap-1">
                                <button @click="dashboardSisaProjectOutPage = Math.max(1, dashboardSisaProjectOutPage - 1)" :disabled="dashboardSisaProjectOutPage <= 1" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                                <span class="px-2 py-1 text-[9px] font-bold text-slate-700">{{ dashboardSisaProjectOutPage }} / {{ dashboardSisaProjectOutPageCount }}</span>
                                <button @click="dashboardSisaProjectOutPage = Math.min(dashboardSisaProjectOutPageCount, dashboardSisaProjectOutPage + 1)" :disabled="dashboardSisaProjectOutPage >= dashboardSisaProjectOutPageCount" class="px-2 py-1 rounded border border-slate-200 text-[9px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                            </div>
                        </div>
                
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- TAB 2: DATABASE MASTER PUSAT -->
        <div v-if="activeTab === 'master_db'" class="space-y-6 no-print">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div v-if="canEdit" class="lg:col-span-7 portal-card p-6 rounded-xl space-y-4">
                    <div class="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
                        <i data-lucide="plus-circle" class="w-4 h-4 text-emerald-600"></i>
                        <span>Input Data Master Manual</span>
                    </div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nomor SKU</label>
                                <input v-model="formMasterManual.kode" type="text" placeholder="Contoh: SKU-001" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none uppercase">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nama Barang *</label>
                                <input v-model="formMasterManual.nama" type="text" placeholder="Masukkan Nama Barang / Sparepart" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none uppercase">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Tanggal Input *</label>
                                <input :value="getISODateOnly()" type="date" readonly class="w-full h-10 px-2.5 bg-slate-100 border border-slate-200 rounded-lg font-bold text-xs text-slate-600 outline-none cursor-not-allowed">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Qty / Stock Awal</label>
                                <input v-model.number="formMasterManual.currentStock" type="number" min="0" placeholder="0" class="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Harga Satuan (Rp)</label>
                                <input v-model.number="formMasterManual.harga" type="number" min="0" step="any" placeholder="0" class="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Lead Time (Hari)</label>
                                <input v-model.number="formMasterManual.leadTime" type="number" min="0" placeholder="0" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Buffer Stok</label>
                                <input v-model.number="formMasterManual.minStock" type="number" min="0" placeholder="0" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Satuan Barang</label>
                                <input v-model="formMasterManual.satuan" type="text" placeholder="Pcs/Unit" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none uppercase">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Keterangan Rak</label>
                                <input v-model="formMasterManual.lokasi" type="text" placeholder="RAK A1" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none uppercase">
                            </div>
                        </div>
                    </div>
                    <button v-if="canEdit" @click="tambahMasterManual" class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-sm">
                        Simpan Ke Database Master
                    </button>
                </div>
                <div v-if="canEdit" class="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                        <div class="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-1">
                            <i data-lucide="upload-cloud" class="w-4 h-4"></i>
                            <span>Import Master via Excel</span>
                        </div>
                        <p class="text-xs text-emerald-100/70 leading-relaxed">
                            Mendukung berbagai format kolom Excel (misal: <strong>Nama Barang / Nama / Item / Deskripsi</strong>, <strong>Qty / Stok</strong>, <strong>Lead Time</strong>, <strong>Buffer Stok</strong>, <strong>Pemakaian Harian</strong>, <strong>Satuan / Unit</strong>, <strong>Harga / Harga Satuan</strong>).
                        </p>
                    </div>
                    <label class="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-50 p-3 rounded-lg font-medium text-xs text-center cursor-pointer border border-emerald-600/50 block transition-all">
                        📂 Choose File (.xlsx / .xls)
                        <input type="file" @change="importMasterCatalog" accept=".xlsx, .xls" class="hidden"/>
                    </label>
                </div>
            </div>
            <div class="flex justify-between items-center gap-3">
                <div class="relative flex-1">
                    <i data-lucide="search" class="w-4 h-4 absolute left-3.5 top-3 text-slate-400"></i>
                    <input v-model="searchMaster" @input="masterPage = 1" @focus="masterPage = 1" type="search" autocomplete="off" spellcheck="false" placeholder="Cari Nama Barang di Master..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-sm" style="pointer-events:auto !important; position:relative; z-index:100 !important;">
                </div>
            </div>
            <div class="portal-card rounded-xl overflow-hidden">
                <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <i data-lucide="book-open" class="w-4 h-4 text-emerald-600"></i>
                        <h3 class="font-bold text-slate-800 text-xs uppercase tracking-wider">Data Master</h3>
                    </div>
                    <div class="flex items-center gap-2">
                        <button v-if="canEdit" @click="exportMasterCatalogExcel" class="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Simpan Excel
                        </button>
                        <button
                            v-if="canDeleteMaster && selectedMasterItems.length > 0"
                            @click="deleteSelectedMaster"
                            class="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-sm"
                        >
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            Hapus Terpilih ({{ selectedMasterItems.length }})
                        </button>
                        <button
                            v-if="canDeleteMaster && masterCatalog.length > 0"
                            @click="deleteAllMaster"
                            title="Hapus Semua Data Master"
                            aria-label="Hapus Semua Data Master"
                            class="bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-sm border border-rose-300 transition-all"
                        >
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                            <span>Hapus Semua</span>
                        </button>
                        <span class="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200/60">{{ filteredMasterCatalog.length }} Item Master</span>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <!-- Hanya 100 row yang dipasang ke DOM per halaman; data Supabase tetap lengkap. -->
                    <table class="w-full text-left text-xs excel-print-table">
                        <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                            <tr>
                                <th class="p-3.5 text-center"><input type="checkbox" v-model="selectAllMaster" @change="toggleSelectAllMaster" class="w-4 h-4 accent-emerald-600 cursor-pointer"></th>
                                <th class="p-3.5 text-center"><button type="button" @click="setMasterSort('no')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">No <span class="text-[9px]">{{ masterSortArrow('no') }}</span></button></th>
                                <th class="p-3.5 text-center"><button type="button" @click="setMasterSort('rak')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">Keterangan Rak <span class="text-[9px]">{{ masterSortArrow('rak') }}</span></button></th>
                                <th class="p-3.5">Nomor SKU</th>
                                <th class="p-3.5"><button type="button" @click="setMasterSort('nama')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">Nama Sparepart <span class="text-[9px]">{{ masterSortArrow('nama') }}</span></button></th>
                                <th class="p-3.5 text-center">Satuan</th>
                                <th class="p-3.5 text-center">Tanggal Input</th>
                                <th class="p-3.5 text-center"><button type="button" @click="setMasterSort('stock')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">Qty / Stock Awal <span class="text-[9px]">{{ masterSortArrow('stock') }}</span></button></th>
                                <th class="p-3.5 text-right"><button type="button" @click="setMasterSort('harga')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">Harga Satuan <span class="text-[9px]">{{ masterSortArrow('harga') }}</span></button></th>
                                <th class="p-3.5 text-center"><button type="button" @click="setMasterSort('buffer')" class="inline-flex items-center gap-1 font-bold hover:text-emerald-700">Buffer Stok <span class="text-[9px]">{{ masterSortArrow('buffer') }}</span></button></th>
                                <th class="p-3.5 text-center min-w-[150px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(item, idx) in paginatedMasterCatalog" :key="item.kode" v-memo="[item.kode, item.nama, item.currentStock, item.minStock, item.satuan, item.harga, item.tanggal, item.lokasi]" class="hover:bg-slate-50">
                                <td class="p-3.5 text-center">
                                    <input
                                        type="checkbox"
                                        :value="item.kode"
                                        v-model="selectedMasterItems"
                                        @click.stop
                                        class="w-4 h-4 accent-emerald-600 cursor-pointer"
                                    >
                                </td>
                                <td class="p-3.5 text-center font-bold text-slate-500">{{ ((masterPage - 1) * masterPageSize) + idx + 1 }}</td>
                                <td class="p-3.5 text-center font-bold text-slate-600 uppercase">{{ item.lokasi || item.lokasiRak || item.rak || '-' }}</td>
                                <td class="p-3.5 font-mono font-bold text-emerald-700">{{ item.kode }}</td>
                                <td class="p-3.5 font-bold text-slate-800 uppercase">{{ item.nama }}</td>
                                <td class="p-3.5 text-center font-bold text-slate-700 uppercase">{{ item.satuan || 'Pcs' }}</td>
                                <td class="p-3.5 text-center font-mono text-slate-600">{{ item.tanggal || '-' }}</td>
                                <td class="p-3.5 text-center font-bold text-emerald-700 bg-emerald-50/50 rounded">{{ Math.max(0, Math.round(Number(item.currentStock ?? item.stockAwal ?? 0) || 0)) }}</td>
                                <td class="p-3.5 text-right font-bold text-slate-700 whitespace-nowrap">Rp {{ formatRupiah(item.harga || 0) }}</td>
                                <td class="p-3.5 text-center font-bold text-slate-700">{{ Math.max(0, Math.round(Number(item.minStock) || 0)) }}</td>
                                <td class="p-3.5 text-center">
                                    <div class="flex items-center justify-center gap-1.5 flex-nowrap">
                                        <button v-if="canEdit" @click="openMasterEdit(item)" class="bg-blue-100 hover:bg-blue-600 text-blue-700 hover:text-white px-2.5 py-1.5 rounded-lg border border-blue-300 transition-all font-bold text-[11px] inline-flex items-center gap-1 shadow-sm whitespace-nowrap">
                                            <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                                            <span>Edit</span>
                                        </button>
                                        <button v-if="canEdit" @click="printBarcode(item)" class="bg-emerald-100 hover:bg-emerald-600 text-emerald-700 hover:text-white px-2.5 py-1.5 rounded-lg border border-emerald-300 transition-all font-bold text-[11px] inline-flex items-center gap-1 shadow-sm whitespace-nowrap">
                                            <i data-lucide="barcode" class="w-3.5 h-3.5"></i>
                                            <span>Cetak Barcode</span>
                                        </button>
                                        <button v-if="canDeleteMaster" @click="deleteMaster(item.kode)" class="bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-lg border border-rose-300 transition-all font-bold text-[11px] inline-flex items-center gap-1 shadow-sm whitespace-nowrap">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                            <span>Hapus</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filteredMasterCatalog.length === 0">
                                <td colspan="10" class="p-12 text-center text-slate-400 font-medium">Database Master masih kosong. Silakan import atau tambah manual.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="masterPageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                    <span class="text-[10px] font-semibold text-slate-500">
                        Menampilkan {{ masterPageStart }}–{{ masterPageEnd }} dari {{ filteredMasterCatalog.length }} item
                    </span>
                    <div class="flex items-center gap-1.5">
                        <button @click="masterPage = Math.max(1, masterPage - 1)" :disabled="masterPage <= 1" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
                        <span class="px-2 text-[10px] font-bold text-emerald-700">Halaman {{ Math.min(masterPage, masterPageCount) }} / {{ masterPageCount }}</span>
                        <button @click="masterPage = Math.min(masterPageCount, masterPage + 1)" :disabled="masterPage >= masterPageCount" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
                    </div>
                </div>
            </div>
        </div>
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

        <!-- TAB 3: MONITORING ORDER -->
        <div v-if="activeTab === 'monitoring'" class="space-y-6">
            <div class="flex flex-wrap justify-between items-center gap-3 no-print">
                <button v-if="canInputTransaction" @click="openMonitoringInputModal" class="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase flex items-center gap-2 shadow-md transition-all">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i> + Input Purchase Request Baru
                </button>
                <label v-if="canInputTransaction" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase flex items-center gap-2 shadow-md cursor-pointer transition-all">
                    <i data-lucide="upload" class="w-4 h-4"></i> Import Purchase Request Excel
                    <input type="file" @change="importMonitoringExcel" accept=".xlsx, .xls" class="hidden"/>
                </label>
                <button v-if="canPrint" @click="printLogSection('monitoring-print-area')" class="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                    <i data-lucide="printer" class="w-4 h-4"></i> Cetak Purchase Request
                </button>
                <button v-if="canEdit" @click="exportPurchaseRequestExcel" class="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                    <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> Export Purchase Request
                </button>
            </div>
            <div class="portal-card p-4 rounded-xl space-y-3 no-print">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                    <i data-lucide="filter" class="w-4 h-4 text-emerald-600"></i> Filter Purchase Request:
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Dari Tanggal</label>
                        <input v-model="monFilterDateStart" type="date" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Sampai Tanggal</label>
                        <input v-model="monFilterDateEnd" type="date" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Filter Status</label>
                        <select v-model="monFilterStatus" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase">
                            <option value="">-- SEMUA STATUS --</option>
                            <option value="Pending">Pending</option>
                            <option value="Diterima Sebagian">Diterima Sebagian</option>
                            <option value="Diterima Semua">Diterima Semua</option>
                            <option value="Cancel">Cancel Order</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Cari Nama Barang</label>
                        <input v-model="monFilterBarang" @click.stop @mousedown.stop type="text" placeholder="Nama barang..." class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium uppercase">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Cari Keterangan / Project</label>
                        <input v-model="monFilterProject" @click.stop @mousedown.stop type="text" placeholder="Keterangan / project..." class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium uppercase">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Short Data</label>
                        <select v-model="monSort" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase">
                            <option value="priority_desc">Prioritas: Angka Terkecil → Terbesar</option>
                            <option value="priority_asc">Prioritas: Angka Terbesar → Terkecil</option>
                            <option value="date_desc">Tanggal: Terbaru → Terlama</option>
                            <option value="date_asc">Tanggal: Terlama → Terbaru</option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- TABEL MONITORING (PRINTABLE AREA - EXCEL STYLE) -->
            <div id="monitoring-print-area" class="portal-card rounded-xl overflow-hidden print-area">
                <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center no-print">
                    <div class="flex items-center gap-2">
                        <i data-lucide="list-checks" class="w-4 h-4 text-emerald-600"></i>
                        <h3 class="font-bold text-slate-800 uppercase text-xs tracking-wider">Tabel Data Purchase Request</h3>
                    </div>
                    <span class="text-[11px] font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-200/60">{{ filteredMonitoringItems.length }} Record Order</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs excel-print-table">
                        <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                            <tr>
                                <th class="p-3 text-center">No</th>
                                <th class="p-3 text-center">Tgl Order</th>
                                <th class="p-3 text-center">No. PR</th>
                                <th class="p-3 sparepart-name">Nama Barang</th>
                                 <th class="p-3 text-center">Satuan</th>
                                <th class="p-3 text-center">Total Order</th>
                                <th class="p-3 text-center">Diterima</th>
                                <th class="p-3 text-center">Sisa Order</th>
                                <th class="p-3 text-left">Keterangan</th>
                                <th class="p-3 text-center">Skala Prioritas</th>
                                <th class="p-3 text-center no-print">Aksi</th>
                                <th class="p-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(order, idx) in filteredMonitoringItems.slice((purchaseRequestPage - 1) * purchaseRequestPageSize, purchaseRequestPage * purchaseRequestPageSize)" :key="order.id" class="hover:bg-slate-50">
                                <td class="p-3 text-center font-bold text-slate-400">{{ ((purchaseRequestPage - 1) * purchaseRequestPageSize) + idx + 1 }}</td>
                                <!-- REVISI 1 (MONITORING): Jam dihilangkan, hanya menampilkan tanggal -->
                                <td class="p-3 text-center font-mono text-slate-600 font-bold">{{ order.tgl }}</td>
                                <td class="p-3 text-center font-bold text-slate-700">{{ order.nomorPR || '-' }}</td>
                                <td class="p-3 font-bold text-slate-800 uppercase">
                                    {{ order.nama }}
                                </td>
                                 <td class="p-3 text-center font-bold text-slate-700 uppercase">{{ order.satuan || 'Pcs' }}</td>
                                <td class="p-3 text-center font-bold text-slate-700 uppercase">
                                    {{ order.qtyTotal }} {{ order.satuan }}
                                </td>
                                <td class="p-3 text-center font-bold text-emerald-600 uppercase">
                                    {{ order.qtyReceived }} {{ order.satuan }}
                                </td>
                                <td class="p-3 text-center font-bold text-amber-600 uppercase">
                                    {{ order.qtyRemaining }} {{ order.satuan }}
                                </td>
                                <td class="p-3 font-extrabold text-xs text-emerald-900 uppercase bg-emerald-50/40 rounded-lg">
                                    {{ order.keperluan || order.project || '-' }}
                                </td>
                                <td class="p-3 text-center">
                                    <span v-if="order.prioritas" class="px-2 py-0.5 text-[9px] font-bold rounded border bg-slate-100 text-slate-800 border-slate-200">{{ order.prioritas }}</span>
                                    <span v-else class="text-[9px] font-bold text-slate-400 uppercase">Belum diatur</span>
                                </td>
                                <td class="p-3 text-center no-print">
                                    <select @change="const v = $event.target.value; $event.target.value = ''; if (v === 'terima') terimaBarang(order); else if (v === 'cancel') cancelOrder(order); else if (v === 'edit') editMonitoringOrder(order);" :disabled="!canInputTransaction && !canEdit || order.status === 'Diterima Semua'" class="w-full min-w-[110px] px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-700 outline-none focus:border-emerald-500">
                                        <option value="">Pilih Aksi</option>
                                        <option v-if="canInputTransaction && order.status !== 'Diterima Semua'" value="edit">Edit</option>
                                        <option v-if="canInputTransaction && order.status !== 'Cancel' && order.status !== 'Diterima Semua'" value="terima">Terima</option>
                                        <option v-if="canEdit && order.status !== 'Cancel'" value="cancel">Cancel</option>
                                    </select>
                                </td>
                                <td class="p-3 text-center">
                                    <span v-if="order.status === 'Diterima Semua'" class="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-200 uppercase">Diterima Semua</span>
                                    <span v-else-if="order.status === 'Diterima Sebagian'" class="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded border border-blue-200 uppercase">Diterima Sebagian</span>
                                    <span v-else-if="order.status === 'Cancel'" class="bg-rose-100 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded border border-rose-200 uppercase">Canceled</span>
                                    <span v-else class="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-200 uppercase">Pending</span>
                                </td>
                            </tr>
                            <tr v-if="filteredMonitoringItems.length === 0"><td colspan="12" class="p-8 text-center text-slate-400 font-medium">Tidak ada data purchase request yang sesuai filter.</td></tr>
                        </tbody>
                        <tfoot v-if="filteredMonitoringItems.length > 0" class="bg-amber-50 border-t-2 border-amber-200">
                            <tr class="font-black text-amber-900">
                                <td colspan="10" class="p-3 text-right uppercase text-[11px] tracking-wider">Total Nilai Order (sesuai filter)</td>
                                <td class="p-3 text-right whitespace-nowrap">{{ formatRupiah(monitoringTotalHarga) }}</td>
                                <td colspan="4" class="p-3 no-print"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div v-if="filteredMonitoringItems.length > purchaseRequestPageSize" class="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3 no-print">
                    <p class="text-[10px] text-slate-500">Menampilkan {{ ((purchaseRequestPage - 1) * purchaseRequestPageSize) + 1 }}–{{ Math.min(purchaseRequestPage * purchaseRequestPageSize, filteredMonitoringItems.length) }} dari {{ filteredMonitoringItems.length }} data</p>
                    <div class="flex items-center gap-2">
                        <button type="button" @click="purchaseRequestPage = Math.max(1, purchaseRequestPage - 1)" :disabled="purchaseRequestPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Sebelumnya</button>
                        <span class="px-2 text-[10px] font-black text-slate-600">Halaman {{ Math.min(purchaseRequestPage, Math.ceil(filteredMonitoringItems.length / purchaseRequestPageSize)) }} / {{ Math.ceil(filteredMonitoringItems.length / purchaseRequestPageSize) }}</span>
                        <button type="button" @click="purchaseRequestPage = Math.min(Math.ceil(filteredMonitoringItems.length / purchaseRequestPageSize), purchaseRequestPage + 1)" :disabled="purchaseRequestPage >= Math.ceil(filteredMonitoringItems.length / 10)" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Berikutnya</button>
                    </div>
                </div>
            </div>
            <div class="space-y-4 pt-4 border-t border-slate-200 no-print">
                <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-emerald-600">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span class="font-extrabold text-xs uppercase text-emerald-900 flex items-center gap-2">
                            <i data-lucide="history" class="w-5 h-5 text-emerald-600"></i> History Penerimaan Purchase Request
                        </span>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">{{ monitoringHistoryIn.length }} Transaksi</span>
                    </div>
                    <div class="pr-history-scroll overflow-auto custom-scroll max-h-[430px] rounded-lg border border-slate-100">
                        <table class="w-full min-w-[1240px] text-left text-xs excel-print-table pr-history-table">
                            <thead class="bg-emerald-50/70 font-bold text-emerald-900 uppercase text-[9px] border-b border-emerald-200 sticky top-0">
                                <tr>
                                    <th class="p-2.5 text-center">No</th>
                                    <th class="p-2.5 text-center">Tgl Penerimaan</th>
                                    <th class="p-2.5 text-center">No. PO</th>
                                    <th class="p-2.5">Supplier</th>
                                    <th class="p-2.5">Nama Barang</th>
                                    <th class="p-2.5 text-center">Satuan</th>
                                    <th class="p-2.5 text-center">Total Order</th>
                                    <th class="p-2.5 text-center">Diterima</th>
                                    <th class="p-2.5 text-center">Sisa Order</th>
                                    <th class="p-2.5">Keterangan</th>
                                    <th class="p-2.5 text-center no-print w-[180px]">Aksi</th>
                                    <th class="p-2.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="(h, idx) in paginatedPurchaseRequestHistory" :key="h.id" :class="isCancelledLog(h) ? 'bg-rose-50/70' : 'hover:bg-emerald-50/30'">
                                    <td class="p-2.5 text-center font-bold text-slate-400">{{ purchaseRequestHistoryPageStart + idx }}</td>
                                    <td class="p-2.5 text-center font-mono text-slate-600 font-bold text-[10px]">
                                        <div>{{ h.tgl || '-' }}</div>
                                        <div class="text-[9px] text-emerald-700 font-black mt-1">No. PR: {{ h._nomorPR }}</div>
                                    </td>
                                    <td class="p-2.5 text-center font-bold text-slate-700">{{ h._nomorPO }}</td>
                                    <td class="p-2.5 font-bold text-slate-700 uppercase">{{ h._supplier }}</td>
                                    <td class="p-2.5 font-bold text-slate-800 uppercase">{{ h.nama }}</td>
                                    <td class="p-2.5 text-center font-bold text-slate-700 uppercase">{{ h._satuan }}</td>
                                    <td class="p-2.5 text-center font-bold text-slate-700">{{ h._qtyTotal }} {{ h._satuan }}</td>
                                    <td class="p-2.5 text-center font-bold text-emerald-700">{{ h._qtyReceived }} {{ h._satuan }}</td>
                                    <td class="p-2.5 text-center font-bold text-amber-600">{{ h._qtyRemaining }} {{ h._satuan }}</td>
                                    <td class="p-2.5 font-extrabold text-xs text-emerald-900 uppercase">{{ h.keperluan || h.project || '-' }}</td>
                                    <td class="p-2.5 text-center no-print align-middle">
                                        <div class="pr-history-actions flex flex-wrap justify-center items-center gap-1.5 max-w-[180px] mx-auto">
                                            <button v-if="h.qty > 0 && !isCancelledLog(h) && canPrint" @click="printBAST(h)" class="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg font-bold text-[9px] uppercase shadow-sm whitespace-nowrap">BAST</button>
                                            <button v-if="h.qty > 0 && !isCancelledLog(h) && canEdit" @click="cancelPurchaseReceipt(h)" class="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg font-bold text-[9px] uppercase shadow-sm whitespace-nowrap">Cancel</button>
                                            <button v-if="(isPendingLog(h) && canInputTransaction) || (!isPendingLog(h) && canEdit)" @click="editLog(h)" class="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 px-2.5 py-1.5 rounded-lg font-bold text-[9px] uppercase whitespace-nowrap">Edit</button>
                                        </div>
                                    </td>
                                    <td class="p-2.5 text-center align-middle">
                                        <div class="pr-history-status flex flex-col items-center justify-center gap-1.5 min-w-[125px]">
                                            <span v-if="isCancelledLog(h)" class="w-full px-2 py-1 text-[9px] font-black rounded border bg-rose-100 text-rose-800 border-rose-200 uppercase whitespace-nowrap">🚫 DIBATALKAN</span>
                                            <span v-else :class="h.status === 'Diterima Semua' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : (h.status === 'Diterima Sebagian' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-amber-100 text-amber-800 border-amber-200')" class="w-full px-2 py-1 text-[9px] font-bold rounded border uppercase whitespace-nowrap">{{ h.status || 'Pending' }}</span>
                                            <span v-if="!isCancelledLog(h)" class="w-full px-2 py-1 text-[8px] font-bold rounded border whitespace-nowrap" :class="String(h.approvalStatus || 'approved').toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'">{{ String(h.approvalStatus || 'approved').toLowerCase() === 'pending' ? 'Belum Disetujui' : 'Sudah Disetujui' }}</span>
                                            <span v-else class="w-full px-2 py-1 text-[8px] font-bold rounded border bg-slate-100 text-slate-600 border-slate-200 whitespace-nowrap">Tidak memengaruhi stok</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="monitoringHistoryIn.length === 0"><td colspan="12" class="p-6 text-center text-slate-400 italic text-[11px]">Belum ada riwayat penerimaan order.</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="purchaseRequestHistoryPageCount > 1" class="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3 no-print">
                        <p class="text-[10px] text-slate-500">Menampilkan {{ purchaseRequestHistoryPageStart }}–{{ purchaseRequestHistoryPageEnd }} dari {{ monitoringHistoryDisplay.length }} data</p>
                        <div class="flex items-center gap-2">
                            <button type="button" @click="purchaseRequestHistoryPage = Math.max(1, purchaseRequestHistoryPage - 1)" :disabled="purchaseRequestHistoryPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Sebelumnya</button>
                            <span class="px-2 text-[10px] font-black text-slate-600">Halaman {{ Math.min(purchaseRequestHistoryPage, purchaseRequestHistoryPageCount) }} / {{ purchaseRequestHistoryPageCount }}</span>
                            <button type="button" @click="purchaseRequestHistoryPage = Math.min(purchaseRequestHistoryPageCount, purchaseRequestHistoryPage + 1)" :disabled="purchaseRequestHistoryPage >= purchaseRequestHistoryPageCount" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Berikutnya</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- MENU PLANNING REQUEST (TERPISAH) -->
        <div v-if="activeTab === 'planning_request' && canPlanning && !planningViewReady" class="portal-card rounded-xl p-6 no-print border border-cyan-100">
            <div class="flex items-center gap-3 text-cyan-800">
                <div class="w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                <div><div class="font-black text-xs uppercase">Menyiapkan Planning Request</div><div class="text-[10px] text-slate-500 mt-1">Memuat halaman aktif saja agar dataset besar tidak membekukan browser.</div></div>
            </div>
        </div>
        <div v-if="activeTab === 'planning_request' && planningError" class="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 no-print">{{ planningError }}</div>
        <div v-if="activeTab === 'planning_request' && canPlanning && planningViewReady" class="space-y-6 no-print">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div class="flex flex-wrap items-center gap-2"><h2 class="text-lg font-black text-slate-800 uppercase tracking-wide">Planning Request</h2></div>
                    <p class="text-xs text-slate-500 mt-1">Perencanaan kebutuhan tanpa memengaruhi stok atau transaksi gudang.</p>
                    <p class="text-[10px] mt-1" :class="planningCacheReady ? 'text-emerald-600' : 'text-amber-600'">{{ planningCacheReady ? 'Stok gudang siap · pencarian barang on-demand' : (planningCacheBuilding ? 'Menyiapkan cache stok ringan…' : 'Cache stok akan disiapkan setelah menu terbuka') }}<span v-if="planningAutocompleteStatus"> · {{ planningAutocompleteStatus }}</span></p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button @click="addPlanningRequest" class="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Tambah Planning Request</button>
                    <button @click="exportPlanningExcel" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Export Excel</button>
                    <button @click="deleteAllPlanningRequests" :disabled="!planningRequests.length" class="px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Hapus Semua Data Planning Request</button>
                    <button @click="showPlanningPrices = !showPlanningPrices" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-200"><i :data-lucide="showPlanningPrices ? 'eye-off' : 'eye'" class="w-3.5 h-3.5"></i> {{ showPlanningPrices ? 'Hide Harga' : 'Tampilkan Harga' }}</button>
                </div>
            </div>

            <div class="portal-card rounded-xl overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h3 class="font-black text-slate-800 text-xs uppercase tracking-wider">Planning Request</h3>
                        <p class="text-[10px] text-slate-500 mt-1">Stok hanya dibaca dari Data Master, Gudang Spare Part, dan Gudang Sisa Project. Input planning tidak mengubah stok.</p>
                    </div>
                    <div class="flex flex-wrap items-end gap-2 w-full lg:w-auto lg:max-w-[980px]">
                        <div class="min-w-[165px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Filter Stok</label>
                            <select v-model="planningStockFilter" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold">
                            <option value="all">Semua Stok</option><option value="above">Stok &gt; Buffer</option><option value="below">Stok &lt; Buffer</option>
                            </select>
                        </div>
                        <div class="min-w-[145px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Tanggal Mulai</label>
                            <input v-model="planningDateStart" type="date" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium">
                        </div>
                        <div class="min-w-[145px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Tanggal Akhir</label>
                            <input v-model="planningDateEnd" type="date" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium">
                        </div>
                        <div class="min-w-[140px] flex-1">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Gudang</label>
                            <select v-model="planningWarehouseFilter" class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold">
                                <option value="">Semua Gudang</option><option value="Sparepart">Spare Part</option><option value="Sisa Project">Sisa Project</option>
                            </select>
                        </div>
                        <div class="min-w-[180px] flex-[1.2]">
                            <label class="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Cari Barang</label>
                            <input v-model="planningSearchInput" @input="schedulePlanningFilterSearch" type="text" autocomplete="off" placeholder="Cari barang..." class="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] uppercase">
                        </div>
                        <button @click="resetPlanningFilters" class="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold">Reset</button>
                        <div class="w-full text-[9px] text-slate-400">Filter rentang memakai tanggal planning yang tetap disimpan di data, tetapi tidak ditampilkan sebagai kolom tabel.</div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs min-w-[1380px]">
                        <thead class="bg-slate-50 text-[9px] uppercase font-black text-slate-500">
                            <tr>
                                <th class="p-2 text-center">No.</th><th class="p-2">Nomor SKU</th><th class="p-2">Nama Barang</th><th class="p-2 text-center">Stok Terpakai</th><th class="p-2 text-center">Stok</th><th class="p-2 text-center">Buffer Stok</th><th class="p-2 text-center">Planning Penambahan Stock</th><th class="p-2 text-center">Total Stock Setelah Penambahan</th><th v-if="showPlanningPrices" class="p-2 text-right">Harga Satuan</th><th v-if="showPlanningPrices" class="p-2 text-right">Harga Total Penambahan</th><th class="p-2 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="row in paginatedPlanningRequests" :key="row.id" class="hover:bg-slate-50/60">
                                <td class="p-2 text-center font-bold">{{ row.nomor }}</td>
                                <td class="p-2"><input v-model="row.sku" @focus="openPlanningMasterDropdown('planning-request-sku-' + row.id, row, 'sku', $event)" @click="openPlanningMasterDropdown('planning-request-sku-' + row.id, row, 'sku', $event)" @input="updatePlanningMasterDropdown('planning-request-sku-' + row.id, row, 'sku', $event)" @blur="scheduleCloseMasterDropdown('planning-request-sku-' + row.id)" :data-master-dropdown-input="'planning-request-sku-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik/pilih SKU..." class="w-32 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold"></td>
                                <td class="p-2"><input v-model="row.nama" @focus="openPlanningMasterDropdown('planning-request-nama-' + row.id, row, 'nama', $event)" @click="openPlanningMasterDropdown('planning-request-nama-' + row.id, row, 'nama', $event)" @input="updatePlanningMasterDropdown('planning-request-nama-' + row.id, row, 'nama', $event)" @blur="scheduleCloseMasterDropdown('planning-request-nama-' + row.id)" :data-master-dropdown-input="'planning-request-nama-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik beberapa huruf..." class="w-56 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold uppercase"></td>
                                <td class="p-2 text-center font-black text-blue-700">
                                    <span v-if="planningDateRangeReady">{{ formatPlanningQty(getPlanningUsedStock(row), row.satuan) }}</span>
                                    <span v-else class="text-[9px] text-slate-400 font-semibold">Isi tanggal dulu</span>
                                </td>
                                <td class="p-2 text-center font-black" :class="getPlanningRowStock(row) < Number(row.bufferStock || 0) ? 'text-red-600' : 'text-emerald-700'">
                                    <div>{{ formatPlanningQty(getPlanningRowStock(row), row.satuan) }}</div>
                                    <div class="mt-1.5 flex flex-col items-center gap-1">
                                        <label class="text-[9px] font-bold flex items-center gap-1"><input type="checkbox" :checked="(row.gudangPenggunaan || []).includes('Sparepart')" @change="togglePlanningWarehouse(row,'Sparepart')"> Spare Part</label>
                                        <label class="text-[9px] font-bold flex items-center gap-1"><input type="checkbox" :checked="(row.gudangPenggunaan || []).includes('Sisa Project')" @change="togglePlanningWarehouse(row,'Sisa Project')"> Sisa Project</label>
                                    </div>
                                </td>
                                <td class="p-2"><input v-model.number="row.bufferStock" @change="updatePlanningRequestAddition(row)" type="number" min="0" class="w-24 p-2 bg-white border border-slate-200 rounded-lg text-[10px] text-center font-bold"></td>
                                <td class="p-2"><input v-model.number="row.penambahanStock" @change="markPlanningDirty()" type="number" min="0" class="w-28 p-2 bg-white border border-slate-200 rounded-lg text-[10px] text-center font-bold"></td>
                                <td class="p-2 text-center font-black">{{ formatPlanningQty(getPlanningRowStock(row) + (Number(row.penambahanStock) || 0), row.satuan) }}</td>
                                <td v-if="showPlanningPrices" class="p-2 text-right font-bold">Rp {{ formatRupiah(row.hargaSatuan) }}</td>
                                <td v-if="showPlanningPrices" class="p-2 text-right font-black text-emerald-700">Rp {{ formatRupiah((Number(row.hargaSatuan)||0) * (Number(row.penambahanStock)||0)) }}</td>
                                <td class="p-2 text-center"><button @click="removePlanningRequest(row.id)" class="text-rose-600 font-bold text-[10px] underline">Hapus</button></td>
                            </tr>
                            <tr v-if="filteredPlanningRequests.length === 0"><td  :colspan="showPlanningPrices ? 11 : 9" class="p-8 text-center text-slate-400 italic">Belum ada Planning Request. Tekan “Tambah Planning Request”.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="planningRequestPageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ planningRequestPageStart }}–{{ planningRequestPageEnd }} dari {{ filteredPlanningRequests.length }} Planning Request</span>
                    <div class="flex items-center gap-1.5">
                        <button @click="planningRequestPage = Math.max(1, planningRequestPage - 1)" :disabled="planningRequestPage <= 1" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">‹</button>
                        <span class="px-2 text-[10px] font-bold text-cyan-700">Halaman {{ Math.min(planningRequestPage, planningRequestPageCount) }} / {{ planningRequestPageCount }}</span>
                        <button @click="planningRequestPage = Math.min(planningRequestPageCount, planningRequestPage + 1)" :disabled="planningRequestPage >= planningRequestPageCount" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">›</button>
                    </div>
                </div>
            </div>

        </div>

        <!-- MENU PLANNING PENGGUNAAN (TERPISAH) -->
        <div v-if="activeTab === 'planning_usage' && canPlanning && !planningViewReady" class="portal-card rounded-xl p-6 no-print border border-cyan-100">
            <div class="flex items-center gap-3 text-cyan-800">
                <div class="w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                <div><div class="font-black text-xs uppercase">Menyiapkan Planning Penggunaan</div><div class="text-[10px] text-slate-500 mt-1">Hanya data pada halaman aktif yang dirender.</div></div>
            </div>
        </div>
        <div v-if="activeTab === 'planning_usage' && planningError" class="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 no-print">{{ planningError }}</div>
        <div v-if="activeTab === 'planning_usage' && canPlanning && planningViewReady" class="space-y-6 no-print">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div class="flex flex-wrap items-center gap-2"><h2 class="text-lg font-black text-slate-800 uppercase tracking-wide">Planning Penggunaan</h2></div>
                    <p class="text-xs text-slate-500 mt-1">Perencanaan penggunaan barang tanpa memengaruhi stok atau transaksi gudang.</p>
                    <p class="text-[10px] mt-1" :class="planningCacheReady ? 'text-emerald-600' : 'text-amber-600'">{{ planningCacheReady ? 'Stok gudang siap · pencarian barang on-demand' : (planningCacheBuilding ? 'Menyiapkan cache stok ringan…' : 'Cache stok akan disiapkan setelah menu terbuka') }}<span v-if="planningAutocompleteStatus"> · {{ planningAutocompleteStatus }}</span></p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button @click="addPlanningUsage" class="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Tambah Planning Penggunaan</button>
                    <button @click="exportPlanningUsageExcel" :disabled="!planningUsages.length" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Export Excel</button>
                    <button @click="deleteAllPlanningUsages" :disabled="!planningUsages.length" class="px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Hapus Semua Data Planning Penggunaan</button>
                </div>
            </div>

            <div class="portal-card rounded-xl overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div><h3 class="font-black text-slate-800 text-xs uppercase tracking-wider">Planning Penggunaan</h3><p class="text-[10px] text-slate-500 mt-1">Estimasi penggunaan beberapa proyek dikurangi dari gabungan stok dua gudang.</p></div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs min-w-[1350px]">
                        <thead class="bg-slate-50 text-[9px] uppercase font-black text-slate-500"><tr><th class="p-2 text-center">No.</th><th class="p-2">Kode Barang</th><th class="p-2">Nama Barang</th><th class="p-2 text-center">Stok Gudang Spare Part</th><th class="p-2 text-center">Stok Gudang Sisa Project</th><th class="p-2">Estimasi Proyek</th><th class="p-2 text-center">Sisa Stok</th><th class="p-2 text-center">Jumlah Purchase Request</th><th class="p-2 text-center">Aksi</th></tr></thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="row in paginatedPlanningUsages" :key="row.id" class="align-top">
                                <td class="p-2 text-center font-bold">{{ row.nomor }}</td>
                                <td class="p-2"><input v-model="row.kode" @focus="openPlanningMasterDropdown('planning-usage-sku-' + row.id, row, 'sku', $event)" @click="openPlanningMasterDropdown('planning-usage-sku-' + row.id, row, 'sku', $event)" @input="updatePlanningMasterDropdown('planning-usage-sku-' + row.id, row, 'sku', $event)" @blur="scheduleCloseMasterDropdown('planning-usage-sku-' + row.id)" :data-master-dropdown-input="'planning-usage-sku-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik/pilih SKU..." class="w-32 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold"></td>
                                <td class="p-2"><input v-model="row.nama" @focus="openPlanningMasterDropdown('planning-usage-nama-' + row.id, row, 'nama', $event)" @click="openPlanningMasterDropdown('planning-usage-nama-' + row.id, row, 'nama', $event)" @input="updatePlanningMasterDropdown('planning-usage-nama-' + row.id, row, 'nama', $event)" @blur="scheduleCloseMasterDropdown('planning-usage-nama-' + row.id)" :data-master-dropdown-input="'planning-usage-nama-' + row.id" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik beberapa huruf..." class="w-52 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold uppercase"></td>
                                <td class="p-2 text-center font-black text-blue-700">{{ formatPlanningQty(row.stokSparepart, row.satuan) }}</td>
                                <td class="p-2 text-center font-black text-teal-700">{{ formatPlanningQty(row.stokSisaProject, row.satuan) }}</td>
                                <td class="p-2">
                                    <div class="space-y-2 min-w-[360px]">
                                        <div v-for="(proj,pi) in (Array.isArray(row.proyek) ? row.proyek : [])" :key="proj.id" class="grid grid-cols-[1fr_110px_28px] gap-1">
                                            <input v-model="proj.nama" @change="markPlanningDirty()" type="text" placeholder="Nama proyek" class="p-2 bg-white border border-slate-200 rounded-lg text-[10px] uppercase">
                                            <input v-model.number="proj.qty" @change="markPlanningDirty()" type="number" min="0" placeholder="Qty" class="p-2 bg-white border border-slate-200 rounded-lg text-[10px] text-center font-bold">
                                            <button @click="removePlanningProject(row,pi)" class="text-rose-600 font-black">×</button>
                                        </div>
                                        <button @click="addPlanningProject(row)" class="text-[10px] font-bold text-emerald-700 underline">+ Tambah proyek</button>
                                    </div>
                                </td>
                                <td class="p-2 text-center font-black" :class="planningUsageRemaining(row) < 0 ? 'text-red-700' : 'text-emerald-700'">{{ planningUsageRemaining(row) }} {{ row.satuan || '' }}</td>
                                <td class="p-2 text-center font-black" :class="planningUsagePurchase(row) > 0 ? 'text-red-700' : 'text-slate-500'">{{ planningUsagePurchase(row) > 0 ? planningUsagePurchase(row) + ' ' + (row.satuan || '') : '-' }}</td>
                                <td class="p-2 text-center"><button @click="removePlanningUsage(row.id)" class="text-rose-600 font-bold text-[10px] underline">Hapus</button></td>
                            </tr>
                            <tr v-if="planningUsages.length === 0"><td colspan="9" class="p-8 text-center text-slate-400 italic">Belum ada Planning Penggunaan. Tekan “Tambah Planning Penggunaan”.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="planningUsagePageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ planningUsagePageStart }}–{{ planningUsagePageEnd }} dari {{ planningUsages.length }} Planning Penggunaan</span>
                    <div class="flex items-center gap-1.5">
                        <button @click="planningUsagePage = Math.max(1, planningUsagePage - 1)" :disabled="planningUsagePage <= 1" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">‹</button>
                        <span class="px-2 text-[10px] font-bold text-cyan-700">Halaman {{ Math.min(planningUsagePage, planningUsagePageCount) }} / {{ planningUsagePageCount }}</span>
                        <button @click="planningUsagePage = Math.min(planningUsagePageCount, planningUsagePage + 1)" :disabled="planningUsagePage >= planningUsagePageCount" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">›</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 4: INPUT STOCK OPNAME -->
        <div v-if="activeTab === 'opname' && canEdit" class="space-y-6">
            <div class="portal-card p-5 rounded-xl border-l-4 border-emerald-600">
                <div class="flex items-center gap-3">
                    <div class="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                        <i data-lucide="clipboard-check" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h2 class="font-black text-slate-800 text-base tracking-tight">Input Stock Opname</h2>
                        <p class="text-[11px] text-slate-500 mt-0.5">Bandingkan stok fisik dengan stok sistem. Sistem akan otomatis mencatat penyesuaian &amp; update Master Data + Gudang.</p>
                    </div>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 no-print">
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Gudang</label>
                    <select v-model="opnameDraft.gudang" @change="setOpnameGudang(opnameDraft.gudang)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold">
                        <option value="Sparepart">Spare Part</option>
                        <option value="Sisa Project">Sisa Project</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Tanggal Stock Opname</label>
                    <input v-model="opnameDraft.tanggal" type="date" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Petugas Opname *</label>
                    <input :disabled="!canEdit" v-model="opnameDraft.petugas" type="text" placeholder="Nama petugas..." class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-medium">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Keterangan</label>
                    <input :disabled="!canEdit" v-model="opnameDraft.keterangan" type="text" placeholder="Catatan opname (opsional)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase">
                </div>
            </div>
            <!-- SIGNAL BANNER -->
            <div v-if="opnameDraftSelisihCount > 0" class="rounded-xl border-2 border-red-300 bg-red-50 p-4 flex items-start gap-3 no-print">
                <div class="p-2 bg-red-100 text-red-700 rounded-lg border border-red-200 flex-shrink-0">
                    <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                </div>
                <div class="flex-1">
                    <p class="font-black text-red-900 text-sm">Terdeteksi {{ opnameDraftSelisihCount }} item dengan SELISIH stok fisik vs sistem</p>
                    <p class="text-[11px] text-red-700 mt-0.5">Data ini akan masuk sebagai <span class="font-bold">penyesuaian otomatis</span> ke Gudang &amp; Master Data. Silakan review sebelum submit.</p>
                </div>
            </div>
            <div v-else-if="opnameDraftMatchCount > 0" class="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 flex items-start gap-3 no-print">
                <div class="p-2 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 flex-shrink-0">
                    <i data-lucide="check-circle" class="w-5 h-5"></i>
                </div>
                <div class="flex-1">
                    <p class="font-black text-emerald-900 text-sm">Semua {{ opnameDraftMatchCount }} item yang diisi COCOK dengan stok sistem</p>
                    <p class="text-[11px] text-emerald-700 mt-0.5">Tidak ada penyesuaian yang perlu dilakukan. Anda tetap dapat menyimpan hasil opname sebagai record.</p>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl flex flex-wrap items-center justify-between gap-2 no-print">
                <div class="flex flex-wrap gap-2 items-center">
                    <div class="relative">
                        <i data-lucide="search" class="w-4 h-4 absolute left-3 top-2.5 text-slate-400"></i>
                        <input v-model="opnameSearch" @input="opnamePage = 1" type="search" placeholder="Cari barang..." class="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase w-64">
                    </div>
                    <select v-model="opnameFilterMode" @change="opnamePage = 1" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold">
                        <option value="all">Semua Barang</option>
                        <option value="selisih">Hanya Ada Selisih</option>
                        <option value="match">Hanya Cocok</option>
                        <option value="unfilled">Belum Diisi</option>
                    </select>
                    <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">Cocok: {{ opnameDraftMatchCount }}</span>
                    <span class="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-1 rounded">Selisih: {{ opnameDraftSelisihCount }}</span>
                    <span class="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded">Belum: {{ opnameDraftUnfilledCount }}</span>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button @click="fillOpnameEqualSystem" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <i data-lucide="equal" class="w-3.5 h-3.5"></i> Isi = Sistem
                    </button>
                    <button @click="resetOpnameDraft" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Reset
                    </button>
                    <button @click="downloadOpnameTemplate" class="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-blue-200">
                        <i data-lucide="download" class="w-3.5 h-3.5"></i> Template Excel
                    </button>
                    <label class="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-emerald-200 cursor-pointer">
                        <i data-lucide="upload" class="w-3.5 h-3.5"></i> Import Excel Opname
                        <input type="file" accept=".xlsx,.xls" @change="importOpnameExcel" class="hidden">
                    </label>
                    <button @click="openOpnameConfirm" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm">
                        <i data-lucide="save" class="w-3.5 h-3.5"></i> Submit &amp; Sesuaikan Stok
                    </button>
                </div>
            </div>
            <div class="portal-card rounded-xl overflow-hidden no-print">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                            <tr>
                                <th class="p-3 text-center">No</th>
                                <th class="p-3 text-center">Nomor SKU</th>
                                <th class="p-3 text-center">Rak/Lokasi</th>
                                <th class="p-3">Nama Barang</th>
                                <th class="p-3 text-center">Satuan</th>
                                <th class="p-3 text-center">Qty Sistem</th>
                                <th class="p-3 text-center">Qty Fisik</th>
                                <th class="p-3 text-center">Selisih</th>
                                <th class="p-3">Catatan</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(row, i) in paginatedOpnameDraftItems" :key="row.barcode || row.nama" :class="row.selisih === null ? '' : (row.selisih === 0 ? 'bg-emerald-50/40' : 'bg-red-50/40')">
                                <td class="p-3 text-center font-bold text-slate-400">{{ ((opnamePage - 1) * opnamePageSize) + i + 1 }}</td>
                                <td class="p-3 text-center font-mono font-bold text-slate-600">{{ row.kode || row.sku || '-' }}</td>
                                <td class="p-3 text-center font-bold text-slate-600 uppercase">{{ row.lokasi || '-' }}</td>
                                <td class="p-3 font-bold text-slate-800 uppercase">{{ row.nama }}</td>
                                <td class="p-3 text-center text-slate-600 uppercase">{{ row.satuan }}</td>
                                <td class="p-3 text-center font-bold text-slate-700">{{ row.qtySystem }}</td>
                                <td class="p-3 text-center">
                                    <input :disabled="!canEdit" type="number" v-model.number="opnameDraft.items[row.idx].qtyFisik" min="0" class="w-24 p-1.5 text-center bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200">
                                </td>
                                <td class="p-3 text-center">
                                    <span v-if="row.selisih === null" class="text-slate-300 text-[10px] italic">belum diisi</span>
                                    <span v-else-if="row.selisih === 0" class="px-2 py-0.5 rounded-lg font-black text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">COCOK</span>
                                    <span v-else :class="row.selisih > 0 ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-red-100 text-red-800 border-red-200'" class="px-2 py-0.5 rounded-lg font-black text-[10px] border">{{ row.selisih > 0 ? '+' : '' }}{{ row.selisih }}</span>
                                </td>
                                <td class="p-3">
                                    <input :disabled="!canEdit" type="text" v-model="opnameDraft.items[row.idx].catatan" placeholder="Catatan..." class="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs uppercase">
                                </td>
                            </tr>
                            <tr v-if="opnameDraftItemsFiltered.length === 0">
                                <td colspan="9" class="p-10 text-center text-slate-400 font-medium">Tidak ada item pada filter ini. Pilih gudang atau ubah filter.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="opnamePageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2 no-print">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ opnamePageStart }}–{{ opnamePageEnd }} dari {{ opnameDraftItemsFiltered.length }} item selisih</span>
                    <div class="flex items-center gap-1.5">
                        <button @click="opnamePage = Math.max(1, opnamePage - 1)" :disabled="opnamePage <= 1" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">‹</button>
                        <span class="px-2 text-[10px] font-bold text-emerald-700">Halaman {{ Math.min(opnamePage, opnamePageCount) }} / {{ opnamePageCount }}</span>
                        <button @click="opnamePage = Math.min(opnamePageCount, opnamePage + 1)" :disabled="opnamePage >= opnamePageCount" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 disabled:opacity-40">›</button>
                    </div>
                </div>
            </div>
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
                        <button @click="showOpnameConfirmModal = false" class="p-1.5 hover:bg-slate-100 rounded-lg"><i data-lucide="x" class="w-4 h-4"></i></button>
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
                        <button @click="showOpnameConfirmModal = false" class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">Batal</button>
                        <button v-if="canEdit" @click="submitOpname" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm">
                            <i data-lucide="check" class="w-3.5 h-3.5"></i> Ya, Sesuaikan Stok Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- TAB: RIWAYAT OPNAME -->
        <div v-if="activeTab === 'opname_history'" class="space-y-6">
            <div class="portal-card p-5 rounded-xl border-l-4 border-teal-600 flex items-center gap-3">
                <div class="p-2.5 bg-teal-50 text-teal-700 rounded-lg border border-teal-100"><i data-lucide="history" class="w-5 h-5"></i></div>
                <div>
                    <h2 class="font-black text-slate-800 text-base tracking-tight">Riwayat Stock Opname</h2>
                    <p class="text-[11px] text-slate-500 mt-0.5">Semua record opname beserta detail selisih &amp; berita acara.</p>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl no-print">
                <div class="flex flex-wrap items-end gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Bulan</label>
                        <select v-model="opnameHistoryMonth" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold">
                            <option value="">Semua Bulan</option>
                            <option v-for="(nama, idx) in opnameMonths" :key="idx" :value="String(idx + 1).padStart(2, '0')">{{ nama }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Tahun</label>
                        <select v-model="opnameHistoryYear" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold">
                            <option value="">Semua Tahun</option>
                            <option v-for="tahun in opnameHistoryYears" :key="tahun" :value="String(tahun)">{{ tahun }}</option>
                        </select>
                    </div>
                    <button @click="pilihOpnamePeriode" class="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5">
                        <i data-lucide="check" class="w-3.5 h-3.5"></i> Pilih
                    </button>
                </div>
            </div>
            <div v-if="opnameHistoryFilterApplied || opnameHistorySearch || opnameHistoryGudang" class="space-y-3">
                <div v-for="op in filteredOpnameHistoryBySelectedDate" :key="op.id" class="portal-card rounded-xl overflow-hidden">
                    <div class="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/40">
                        <div class="flex items-center gap-3">
                            <div :class="op.gudang === 'Sisa Project' ? 'bg-teal-100 text-teal-700 border-teal-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="p-2 rounded-lg border">
                                <i data-lucide="clipboard-check" class="w-4 h-4"></i>
                            </div>
                            <div>
                                <p class="font-black text-slate-800 text-sm">{{ op.nomor }}</p>
                                <p class="text-[11px] text-slate-500">{{ op.tgl }} &middot; {{ op.gudang }} &middot; Petugas: <span class="font-bold uppercase text-slate-700">{{ op.petugas }}</span></p>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <select v-model="opnameHistoryItemFilter" class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[9px] font-bold text-slate-600">
                                <option value="all">Semua Item</option>
                                <option value="selisih">Hanya Selisih</option>
                            </select>
                            <span class="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">{{ op.totalItem }} Item</span>
                            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Cocok: {{ op.totalMatch }}</span>
                            <span :class="op.totalSelisih > 0 ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-500'" class="text-[10px] font-bold px-2 py-0.5 rounded">Selisih: {{ op.totalSelisih }}</span>
                            <span :class="String(op.approvalStatus || 'approved').toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="text-[10px] font-bold px-2 py-0.5 rounded border">Status Approval: {{ String(op.approvalStatus || 'approved').toLowerCase() === 'pending' ? 'BELUM DISETUJUI' : 'SUDAH DISETUJUI' }}</span>
                            <button v-if="canEdit && String(op.approvalStatus || 'approved').toLowerCase() === 'pending'" @click="openOpnameHistoryEdit(op)" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                                <i data-lucide="pencil" class="w-3 h-3"></i> Edit
                            </button>
                            <button v-if="canPrint" @click="printBeritaAcara(op)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                                <i data-lucide="printer" class="w-3 h-3"></i> Berita Acara
                            </button>
                            <button v-if="canEdit" @click="exportOpnameHistoryExcel(op)" class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                                <i data-lucide="file-spreadsheet" class="w-3 h-3"></i> Excel
                            </button>
                        </div>
                    </div>
                    <div class="p-4">
                        <p v-if="op.keterangan" class="text-[11px] text-slate-500 mb-2 italic">Keterangan: {{ op.keterangan }}</p>
                        <div class="overflow-x-auto max-h-60">
                            <table class="w-full text-xs">
                                <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                                    <tr><th class="p-2 text-center">No</th><th class="p-2 text-center">Nomor SKU</th><th class="p-2 text-center">Rak/Lokasi</th><th class="p-2">Nama Barang</th><th class="p-2 text-center">Satuan</th><th class="p-2 text-center">Qty Sistem</th><th class="p-2 text-center">Qty Fisik</th><th class="p-2 text-center">Selisih</th><th class="p-2">Catatan</th></tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="(it, i) in filteredOpnameHistoryItems(op)" :key="i + '-' + (it.kode || it.nama || '')" :class="it.selisih === 0 ? 'bg-emerald-50/40' : 'bg-red-50/40'">
                                        <td class="p-2 text-center font-bold text-slate-400">{{ i + 1 }}</td>
                                        <td class="p-2 text-center font-mono font-bold text-slate-600">{{ it.kode || it.sku || '-' }}</td>
                                        <td class="p-2 text-center font-bold text-slate-600 uppercase">{{ it.lokasi || '-' }}</td>
                                        <td class="p-2 font-bold text-slate-800 uppercase">{{ it.nama }}</td>
                                        <td class="p-2 text-center text-slate-600 uppercase">{{ it.satuan || 'Pcs' }}</td>
                                        <td class="p-2 text-center font-bold text-slate-700">{{ it.qtySystem }}</td>
                                        <td class="p-2 text-center font-bold">{{ it.qtyFisik }}</td>
                                        <td class="p-2 text-center font-black" :class="it.selisih === 0 ? 'text-slate-500' : (it.selisih > 0 ? 'text-blue-700' : 'text-red-700')">
                                            <span v-if="it.selisih === 0" class="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px]">OK</span>
                                            <span v-else>{{ it.selisih > 0 ? '+' : '' }}{{ it.selisih }}</span>
                                        </td>
                                        <td class="p-2 text-slate-500 uppercase text-[10px]">{{ it.catatan || '-' }}</td>
                                    </tr>
                                    <tr v-if="filteredOpnameHistoryItems(op).length === 0"><td colspan="9" class="p-5 text-center text-slate-400 italic">Tidak ada item sesuai filter.</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div v-if="filteredOpnameHistory.length === 0" class="portal-card p-10 text-center text-slate-400 font-medium rounded-xl">
                    Belum ada riwayat stock opname.
                </div>
            </div>
        </div>
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
                    <select v-model="opnameHistoryItemFilter" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"><option value="all">Semua Item</option><option value="selisih">Hanya Ada Selisih</option></select>
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
        <!-- TAB 4: GUDANG SPAREPART -->
        <div v-if="activeTab === 'sparepart'" class="space-y-5 sparepart-layout">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 no-print sparepart-actions-grid">
                <div class="portal-card rounded-xl p-3 flex flex-wrap items-center gap-2 sparepart-actions-card">
                    <span class="text-[10px] font-black text-slate-500 uppercase mr-1">Aksi Gudang</span>
                    <button @click="startBarcodeScan('Sparepart')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="scan-barcode" class="w-4 h-4"></i> Scan Barcode
                    </button>
                    <button v-if="canInputTransaction" @click="openSparepartMultiOutModal" class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="minus-square" class="w-4 h-4"></i> Pengeluaran Multiple Sparepart
                    </button>
                    <button @click="sparepartShowPrices = !sparepartShowPrices" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm border border-slate-200">
                        <i :data-lucide="sparepartShowPrices ? 'eye-off' : 'eye'" class="w-4 h-4"></i> {{ sparepartShowPrices ? 'Hide Harga' : 'Tampilkan Harga' }}
                    </button>
                </div>
                <div class="portal-card rounded-xl p-3 flex flex-wrap items-center gap-2 sparepart-actions-card">
                    <span class="text-[10px] font-black text-slate-500 uppercase mr-1">Tanggal & Cetak</span>
                    <div class="flex items-center gap-1">
                        <span class="text-[9px] font-bold text-slate-500 uppercase">Dari</span>
                        <input v-model="spLogDateStart" type="date" title="Tanggal mulai" class="p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="text-[9px] font-bold text-slate-500 uppercase">Sampai</span>
                        <input v-model="spLogDateEnd" type="date" title="Tanggal akhir" class="p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                    </div>
                    <button v-if="canPrint" @click="printDailyLogReport('Sparepart')" class="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="printer" class="w-4 h-4"></i> Cetak Laporan Sparepart
                    </button>
                    <button v-if="canEdit" @click="exportSparepartExcelByDate" class="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> Export Excel Sparepart
                    </button>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl space-y-2 no-print">
                <span class="text-xs font-bold text-slate-700 uppercase">Filter Log Sparepart:</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input v-model="spLogBarang" @input="sparepartPage = 1" @click.stop @mousedown.stop @input.stop type="search" autocomplete="off" spellcheck="false" placeholder="Cari Barang..." class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase" style="pointer-events:auto !important; position:relative; z-index:20 !important;">
                    <input v-model="spLogKeperluan" @click.stop @mousedown.stop @input.stop type="search" autocomplete="off" spellcheck="false" placeholder="Cari Kepentingan / Supplier..." class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase" style="pointer-events:auto !important; position:relative; z-index:20 !important;">
                    <input v-model.number="spLogHargaMin" type="number" min="0" placeholder="Harga Min" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <input v-model.number="spLogHargaMax" type="number" min="0" placeholder="Harga Max" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                </div>
            </div>
            <div id="sparepart-log-print" class="grid grid-cols-1 lg:grid-cols-2 gap-6 print-area">
                <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-emerald-600">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span class="font-bold text-xs uppercase text-emerald-900 flex items-center gap-1.5">
                            <i data-lucide="arrow-down-left" class="w-4 h-4 text-emerald-600"></i> Log Barang Masuk Sparepart (Inbound)
                        </span>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">{{ filteredSparepartLogsIn.length }} Masuk</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs excel-print-table">
                            <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[9px] border-b border-slate-200 sticky top-0">
                                <tr>
                                    <th class="p-2 text-center">No</th>
                                    <th class="p-2">Nama Barang</th>
                                     <th class="p-2 text-center">Satuan</th>
                                    <th class="p-2 text-center">Qty Masuk</th>
                                    <th class="p-2 text-center">Qty Awal</th>
                                    <th class="p-2 text-center">Qty Akhir</th>
                                    <th class="p-2">No. PO / Supplier</th>
                                    <th class="p-2">Keterangan</th>
                                    <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Satuan</th>
                                    <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Total</th>
                                    <th class="p-2 text-center">Status Approval</th>
                                        <th class="p-2 text-center no-print">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="(log, idx) in paginatedSparepartLogsIn" :key="log.id" :class="isCancelledLog(log) ? 'bg-rose-50/70' : ''">
                                    <td class="p-2 text-center font-bold text-slate-400">{{ ((sparepartLogInPage - 1) * logPageSize) + idx + 1 }}</td>
                                    <td class="p-2 font-bold text-slate-800 uppercase">
                                        {{ log.nama }}
                                        <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                    </td>
                                     <td class="p-2 text-center font-bold text-slate-700 uppercase">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                    <td class="p-2 text-center font-bold text-emerald-600">+{{ getLogDisplayQty(log) }}</td>
                                    <td class="p-2 text-center font-semibold text-slate-500">{{ log.qtyAwal ?? '-' }}</td>
                                    <td class="p-2 text-center font-extrabold text-emerald-700">{{ log.qtyAkhir ?? '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">
                                        <div>No. PO: {{ log.nomorPO || '-' }}</div>
                                        <div class="mt-0.5">Supplier: {{ log.supplier || '-' }}</div>
                                    </td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                    <td v-if="sparepartShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                    <td v-if="sparepartShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                    <td class="p-2 text-center">
                                        <span :class="isPendingLog(log) ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-black whitespace-nowrap">
                                            <i :data-lucide="isPendingLog(log) ? 'clock-3' : 'badge-check'" class="w-3 h-3"></i>
                                            {{ isPendingLog(log) ? 'BELUM DISETUJUI' : 'SUDAH DISETUJUI' }}
                                        </span>
                                    </td>
                                    <td class="p-2 text-center no-print">
                                        <span v-if="isCancelledLog(log)" class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[9px] font-black whitespace-nowrap">
                                            <i data-lucide="ban" class="w-3 h-3"></i> DIBATALKAN
                                        </span>
                                        <button v-if="canApprove && isPendingLog(log)" @click="approveTransaction(log)" class="block mx-auto text-emerald-700 hover:text-emerald-900 font-black text-[10px] underline">Setujui</button>
                                        <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="editLog(log)" class="block mx-auto text-amber-600 hover:text-amber-800 font-bold text-[10px] underline">Edit</button>
                                        <button v-if="canEdit && !isCancelledLog(log)" @click="cancelTransaction(log)" class="block mx-auto text-rose-600 hover:text-rose-800 font-bold text-[10px] underline">Cancel</button>
                                        <span v-if="!isPendingLog(log)" class="text-[9px] text-emerald-600 font-bold">✓ Approved</span>
                                    </td>
                                </tr>
                                <tr v-if="filteredSparepartLogsIn.length === 0"><td colspan="11" class="p-4 text-center text-slate-400 italic text-[11px]">Belum ada log barang masuk.</td></tr>
                            </tbody>
                        </table>
                <div v-if="sparepartLogInPageCount > 1" class="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between gap-2 no-print">
                    <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((sparepartLogInPage - 1) * logPageSize) + 1 }}–{{ Math.min(sparepartLogInPage * logPageSize, filteredSparepartLogsIn.length) }} dari {{ filteredSparepartLogsIn.length }} data</span>
                    <div class="flex items-center gap-2">
                        <button @click="sparepartLogInPage = Math.max(1, sparepartLogInPage - 1)" :disabled="sparepartLogInPage <= 1" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Sebelumnya</button>
                        <span class="text-[9px] font-black text-slate-600">Halaman {{ sparepartLogInPage }} / {{ sparepartLogInPageCount }}</span>
                        <button @click="sparepartLogInPage = Math.min(sparepartLogInPageCount, sparepartLogInPage + 1)" :disabled="sparepartLogInPage >= sparepartLogInPageCount" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Berikutnya</button>
                    </div>
                </div>
                    </div>
                </div>
                <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-amber-600">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span class="font-bold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-amber-600"></i> Log Barang Keluar Sparepart (Outbound)
                        </span>
                        <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">{{ filteredSparepartLogsOut.length }} Keluar</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs excel-print-table">
                            <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[9px] border-b border-slate-200 sticky top-0">
                                <tr>
                                    <th class="p-2 text-center">No</th>
                                    <th class="p-2">Nama Barang</th>
                                     <th class="p-2 text-center">Satuan</th>
                                    <th class="p-2 text-center">Qty Out</th>
                                    <th class="p-2 text-center">Qty Awal</th>
                                    <th class="p-2 text-center">Qty Akhir</th>
                                    <th class="p-2">Penerima</th>
                                    <th class="p-2">Keterangan</th>
                                    <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Satuan</th>
                                    <th v-if="sparepartShowPrices" class="p-2 text-right">Harga Total</th>
                                    <th class="p-2 text-center">Status Approval</th>
                                        <th class="p-2 text-center no-print">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="(log, idx) in paginatedSparepartLogsOut" :key="log.id" :class="isCancelledLog(log) ? 'bg-rose-50/70' : ''">
                                    <td class="p-2 text-center font-bold text-slate-400">{{ ((sparepartLogOutPage - 1) * logPageSize) + idx + 1 }}</td>
                                    <td class="p-2 font-bold text-slate-800 uppercase">
                                        {{ log.nama }}
                                        <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                    </td>
                                     <td class="p-2 text-center font-bold text-slate-700 uppercase">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                    <td class="p-2 text-center font-bold text-amber-600">-{{ getLogDisplayQty(log) }}</td>
                                    <td class="p-2 text-center font-semibold text-slate-500">{{ log.qtyAwal ?? '-' }}</td>
                                    <td class="p-2 text-center font-extrabold text-amber-700">{{ log.qtyAkhir ?? '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.penerima || log.user || '-' }} ({{ log.keperluan || log.keterangan || '-' }})</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                    <td v-if="sparepartShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                    <td v-if="sparepartShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                    <td class="p-2 text-center">
                                        <span :class="isPendingLog(log) ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-black whitespace-nowrap">
                                            <i :data-lucide="isPendingLog(log) ? 'clock-3' : 'badge-check'" class="w-3 h-3"></i>
                                            {{ isPendingLog(log) ? 'BELUM DISETUJUI' : 'SUDAH DISETUJUI' }}
                                        </span>
                                    </td>
                                    <td class="p-2 text-center no-print">
                                        <span v-if="isCancelledLog(log)" class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[9px] font-black whitespace-nowrap">
                                            <i data-lucide="ban" class="w-3 h-3"></i> DIBATALKAN
                                        </span>
                                        <button v-if="canApprove && isPendingLog(log)" @click="approveTransaction(log)" class="block mx-auto text-emerald-700 hover:text-emerald-900 font-black text-[10px] underline">Setujui</button>
                                        <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="editLog(log)" class="block mx-auto text-amber-600 hover:text-amber-800 font-bold text-[10px] underline">Edit</button>
                                        <button v-if="canEdit && !isCancelledLog(log)" @click="cancelTransaction(log)" class="block mx-auto text-rose-600 hover:text-rose-800 font-bold text-[10px] underline">Cancel</button>
                                        <span v-if="!isPendingLog(log)" class="text-[9px] text-emerald-600 font-bold">✓ Approved</span>
                                    </td>
                                </tr>
                                <tr v-if="filteredSparepartLogsOut.length === 0"><td colspan="11" class="p-4 text-center text-slate-400 italic text-[11px]">Belum ada log barang keluar.</td></tr>
                            </tbody>
                        </table>
                <div v-if="sparepartLogOutPageCount > 1" class="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between gap-2 no-print">
                    <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((sparepartLogOutPage - 1) * logPageSize) + 1 }}–{{ Math.min(sparepartLogOutPage * logPageSize, filteredSparepartLogsOut.length) }} dari {{ filteredSparepartLogsOut.length }} data</span>
                    <div class="flex items-center gap-2">
                        <button @click="sparepartLogOutPage = Math.max(1, sparepartLogOutPage - 1)" :disabled="sparepartLogOutPage <= 1" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Sebelumnya</button>
                        <span class="text-[9px] font-black text-slate-600">Halaman {{ sparepartLogOutPage }} / {{ sparepartLogOutPageCount }}</span>
                        <button @click="sparepartLogOutPage = Math.min(sparepartLogOutPageCount, sparepartLogOutPage + 1)" :disabled="sparepartLogOutPage >= sparepartLogOutPageCount" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Berikutnya</button>
                    </div>
                </div>
                    </div>
                <div class="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between gap-3 bg-amber-50/60 rounded-lg px-3 py-2">
                    <div>
                        <div class="text-[9px] font-black text-amber-800 uppercase">Total Harga Pengeluaran Gudang Spare Part</div>
                        <div class="text-[9px] text-slate-500 mt-0.5">Nilai dihitung dari seluruh pengeluaran Spare Part yang tercatat.</div>
                    </div>
                    <div v-if="sparepartShowPrices" class="text-sm font-black text-amber-700 whitespace-nowrap">Rp {{ formatRupiah(totalHargaPengeluaranSparepart) }}</div>
                </div>
                </div>
            </div>
            <div class="portal-card rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-4 no-print shadow-sm">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div class="flex items-start gap-3 min-w-0">
                        <div class="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <i data-lucide="scan-barcode" class="w-6 h-6"></i>
                        </div>
                        <div class="min-w-0">
                            <div class="font-black text-blue-900 text-sm uppercase tracking-wide">Scan Barcode Sparepart</div>
                            <div class="text-[10px] text-blue-700 mt-1 leading-relaxed">Scan menggunakan scanner USB/Bluetooth langsung dari laptop, atau gunakan kamera laptop. Setelah kode terbaca, barang akan langsung dikenali.</div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:min-w-[520px]">
                        <input id="sparepart-barcode-input" v-model="barcodeScanInput" @keyup.enter="processScannedBarcode(barcodeScanInput)" @keydown.esc="barcodeScanInput=''" type="text" autocomplete="off" spellcheck="false" placeholder="Klik di sini lalu scan barcode..." class="flex-1 min-w-0 px-4 py-3 rounded-xl border-2 border-blue-200 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none text-sm font-black uppercase tracking-wide shadow-sm">
                        <button @click="processScannedBarcode(barcodeScanInput)" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-black text-xs uppercase shadow-sm whitespace-nowrap flex items-center justify-center gap-2">
                            <i data-lucide="search-check" class="w-4 h-4"></i> Proses Scan
                        </button>
                        <button @click="openBarcodeScanner" class="bg-white hover:bg-slate-50 text-blue-700 px-4 py-3 rounded-xl font-black text-xs uppercase border-2 border-blue-200 whitespace-nowrap flex items-center justify-center gap-2">
                            <i data-lucide="camera" class="w-4 h-4"></i> Kamera
                        </button>
                    </div>
                </div>
                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-semibold text-slate-500">
                    <span><b>Scanner USB/Bluetooth:</b> arahkan scanner ke barcode → kode otomatis masuk → tekan Enter jika scanner tidak mengirim Enter.</span>
                    <span v-if="barcodeScanMessage" :class="barcodeScanSuccess ? 'text-emerald-700' : 'text-red-600'" class="font-bold">{{ barcodeScanMessage }}</span>
                </div>
            </div>
            <div class="portal-card rounded-xl overflow-hidden no-print">
                <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <i data-lucide="wrench" class="w-4 h-4 text-emerald-600"></i>
                        <h3 class="font-bold text-slate-800 uppercase text-xs tracking-wider">Daftar Stok Gudang Spare Part</h3>
                    </div>
                    <div class="flex items-center gap-2">
                        <button @click="openBarcodeScanner" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm flex items-center gap-1.5">
                            <i data-lucide="scan-barcode" class="w-3.5 h-3.5"></i> Scan Barcode
                        </button>
                        <button v-if="canPrint" @click="printStockGudang('Sparepart')" class="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm flex items-center gap-1.5">
                            <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak Stock
                        </button>
                        <button v-if="canEdit" @click="exportStockGudangExcel('Sparepart')" class="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm flex items-center gap-1.5">
                            <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Excel Stock
                        </button>
                        <span class="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">{{ filteredSpareparts.length }} Item Available</span>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs excel-print-table sparepart-table">
                        <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                            <tr>
                                <th class="p-3 text-center">No</th>
                                <th class="p-3 text-center sparepart-location">Lokasi Rak</th>
                                <th class="p-3">Nama Barang</th>
                                <th class="p-3 text-center">Satuan</th>
                                <th class="p-3 text-center sparepart-stock">Stok Available</th>
                                <th class="p-3 text-center sparepart-action">Aksi Pengeluaran</th>
                                <th class="p-3 text-center sparepart-card">Kartu Stock</th>
                                <th v-if="sparepartShowPrices" class="p-3.5 text-right">Harga Satuan</th>
                                <th v-if="sparepartShowPrices" class="p-3.5 text-right">Harga Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(item, idx) in paginatedSpareparts" :key="item.barcode || item.kode || (item.nama + '-' + idx)" class="hover:bg-slate-50 transition-colors">
                                <td class="p-3.5 text-center font-bold text-slate-400">{{ ((sparepartPage - 1) * sparepartPageSize) + idx + 1 }}</td>
                                <td class="p-3.5 text-center font-bold text-slate-600 uppercase">{{ item.lokasi || item.lokasiRak || item.rak || '-' }}</td>
                                <td class="p-3.5 font-bold text-slate-800 uppercase">{{ item.nama }}</td>
                                 <td class="p-3.5 text-center font-bold text-slate-700 uppercase">{{ item.satuan || 'Pcs' }}</td>
                                <td class="p-3.5 text-center">
                                    <span :class="item.qty <= item.minStock ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-slate-800 bg-slate-100 border-slate-200'" class="px-2.5 py-1 rounded-lg font-black text-xs border inline-block">
                                        {{ item.qty }} {{ item.satuan || 'Pcs' }}
                                    </span>
                                </td>
                                <td class="p-3.5 text-center">
                                    <div class="flex flex-col items-center gap-1.5">
                                    <button @click="openSingleOutModal(item)" :disabled="item.qty <= 0" class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm border border-amber-500">
                                        Keluar
                                    </button>
                                    </div>
                                </td>
                                <td class="p-3.5 text-center">
                                    <button v-if="canPrint" @click="printLabel(item)" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold text-[10px] uppercase border border-slate-300 flex items-center gap-1 mx-auto">
                                        <i data-lucide="printer" class="w-3 h-3"></i> Kartu Stock
                                    </button>
                                </td>
                                <td v-if="sparepartShowPrices" class="p-3.5 text-right font-bold text-slate-700 whitespace-nowrap">Rp {{ formatRupiah(item.harga != null ? item.harga : getMasterHarga(item.nama)) }}</td>
                                <td v-if="sparepartShowPrices" class="p-3.5 text-right font-black text-emerald-700 whitespace-nowrap">Rp {{ formatRupiah((Number(item.harga != null ? item.harga : getMasterHarga(item.nama)) || 0) * (Number(item.qty) || 0)) }}</td>
                            </tr>
                            <tr v-if="filteredSpareparts.length === 0"><td :colspan="sparepartShowPrices ? 10 : 8" class="p-10 text-center text-slate-400 font-medium">Stok Sparepart kosong.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="sparepartShowPrices" class="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex justify-end">
                    <div class="text-right">
                        <span class="text-[10px] font-bold uppercase text-slate-500">Total Harga Stock</span>
                        <div class="text-base font-black text-emerald-700">Rp {{ formatRupiah(totalHargaSparepart) }}</div>
                    </div>
                </div>
                <div v-if="sparepartPageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ sparepartPageStart }}–{{ sparepartPageEnd }} dari {{ filteredSpareparts.length }} item</span>
                    <div class="flex items-center gap-2">
                        <button @click="sparepartPage = Math.max(1, sparepartPage - 1)" :disabled="sparepartPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[10px] font-black disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
                        <span class="text-[10px] font-black text-slate-600">Halaman {{ Math.min(sparepartPage, sparepartPageCount) }} / {{ sparepartPageCount }}</span>
                        <button @click="sparepartPage = Math.min(sparepartPageCount, sparepartPage + 1)" :disabled="sparepartPage >= sparepartPageCount" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[10px] font-black disabled:opacity-40 disabled:cursor-not-allowed">›</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- MODAL SCAN BARCODE GUDANG SPAREPART -->
        <div v-if="showBarcodeScanner" class="fixed inset-0 z-[120] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 class="font-black text-slate-800 text-sm uppercase">Scan Barcode Sparepart</h3>
                        <p class="text-[10px] text-slate-500 mt-1">Arahkan kamera ke barcode atau gunakan scanner USB/Bluetooth. Tidak perlu mengetik barcode.</p>
                    </div>
                    <button @click="closeBarcodeScanner" class="text-slate-400 hover:text-slate-700">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <div class="p-4 space-y-3">
                    <div id="barcode-reader" class="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50"></div>
                    <div class="rounded-xl bg-blue-50 border border-blue-200 p-3 text-center">
                        <div class="text-[10px] font-black text-blue-800 uppercase">Scanner Laptop / USB / Bluetooth</div>
                        <div class="text-[10px] text-blue-600 mt-1">Klik kolom di bawah, lalu scan barcode. Scanner akan bekerja seperti keyboard.</div>
                    </div>
                    <input id="barcode-modal-input" v-model="barcodeScanInput" @keyup.enter="processScannedBarcode(barcodeScanInput)" type="text" autocomplete="off" spellcheck="false" autofocus aria-label="Barcode scanner input" class="absolute opacity-0 pointer-events-none w-px h-px">
                    <div v-if="barcodeScanMessage" class="text-[10px] rounded-lg px-3 py-2" :class="barcodeScanSuccess ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'">{{ barcodeScanMessage }}</div>
                </div>
                <div class="p-4 border-t border-slate-100 flex justify-end">
                    <button @click="closeBarcodeScanner" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">Tutup</button>
                </div>
            </div>
        </div>

        <!-- TAB BARCODE SCAN -->
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
                            <input id="sparepart-barcode-tab-input" v-model="barcodeScanInput" @keyup.enter="processScannedBarcode(barcodeScanInput)" @focus="barcodeScanMessage=''" type="text" autocomplete="off" spellcheck="false" placeholder="Klik di sini lalu scan barcode..." class="flex-1 min-w-0 px-5 py-4 rounded-xl border-2 border-blue-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none text-base font-black uppercase tracking-widest shadow-sm">
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

        <!-- TAB 5: GUDANG SISA PROJECT -->
        <div v-if="activeTab === 'sisa_project'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 no-print">
                <div class="portal-card rounded-xl p-3 flex flex-wrap items-center gap-2">
                    <div class="flex flex-wrap items-center gap-2">
                    <button v-if="canInputTransaction" @click="openSisaProjectMultiInModal" class="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="plus-square" class="w-4 h-4"></i> Input Multiple Sisa Project
                    </button>
                    <button v-if="canInputTransaction" @click="startBarcodeScan('Sisa Project')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="scan-barcode" class="w-4 h-4"></i> Scan Barcode
                    </button>
                    <button v-if="canInputTransaction" @click="openSisaProjectMultiOutModal" class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                        <i data-lucide="minus-square" class="w-4 h-4"></i> Pengeluaran Multiple Sisa Project
                    </button>
                    <button @click="sisaProjectShowPrices = !sisaProjectShowPrices" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 border border-slate-200">
                        <i :data-lucide="sisaProjectShowPrices ? 'eye-off' : 'eye'" class="w-4 h-4"></i> {{ sisaProjectShowPrices ? 'Hide Harga' : 'Tampilkan Harga' }}
                    </button>
                </div>
                </div>
                <div class="portal-card rounded-xl p-3 flex flex-wrap items-center gap-2">
                    <span class="text-[10px] font-black text-slate-500 uppercase mr-1">Tanggal & Cetak</span>
                    <div class="flex items-center gap-1">
                        <span class="text-[9px] font-bold text-slate-500 uppercase">Dari</span>
                        <input v-model="spjLogDateStart" type="date" title="Tanggal mulai" class="p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="text-[9px] font-bold text-slate-500 uppercase">Sampai</span>
                        <input v-model="spjLogDateEnd" type="date" title="Tanggal akhir" class="p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                    </div>
                    <button v-if="canPrint" @click="printDailyLogReport('Sisa Project')" class="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-sm">
                    <i data-lucide="printer" class="w-4 h-4"></i> Cetak Laporan Sisa Project
                </button>
                </div>
            </div>
            <div class="portal-card p-4 rounded-xl space-y-2 no-print">
                <span class="text-xs font-bold text-slate-700 uppercase">Filter Log Sisa Project:</span>
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input v-model="spjLogBarang" @input="sisaProjectPage = 1" type="text" placeholder="Cari Barang..." class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase">
                    <input v-model="spjLogKeperluan" type="text" placeholder="Cari Keterangan / Supplier..." class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase">
                </div>
            </div>
            <div id="sisa-log-print" class="grid grid-cols-1 lg:grid-cols-2 gap-6 print-area">
                <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-emerald-600">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span class="font-bold text-xs uppercase text-emerald-900 flex items-center gap-1.5">
                            <i data-lucide="arrow-down-left" class="w-4 h-4 text-emerald-600"></i> Log Barang Masuk Sisa Project (Inbound)
                        </span>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">{{ filteredProjectLogsIn.length }} Masuk</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs excel-print-table">
                            <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[9px] border-b border-slate-200 sticky top-0">
                                <tr>
                                    <th class="p-2 text-center">No</th>
                                    <th class="p-2">Nama Barang</th>
                                     <th class="p-2 text-center">Satuan</th>
                                    <th class="p-2 text-center">Qty Masuk</th>
                                    <th class="p-2 text-center">Qty Awal</th>
                                    <th class="p-2 text-center">Qty Akhir</th>
                                    <th class="p-2">Asal / Kepentingan</th>
                                        <th class="p-2">Keterangan</th>
                                    <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Satuan</th>
                                    <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Total</th>
                                    <th class="p-2 text-center">Status Approval</th>
                                        <th class="p-2 text-center no-print">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="(log, idx) in paginatedProjectLogsIn" :key="log.id" :class="isCancelledLog(log) ? 'bg-rose-50/70' : ''">
                                    <td class="p-2 text-center font-bold text-slate-400">{{ ((sisaProjectLogInPage - 1) * logPageSize) + idx + 1 }}</td>
                                    <td class="p-2 font-bold text-slate-800 uppercase">
                                        {{ log.nama }}
                                        <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                    </td>
                                     <td class="p-2 text-center font-bold text-slate-700 uppercase">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                    <td class="p-2 text-center font-bold text-emerald-600">+{{ getLogDisplayQty(log) }}</td>
                                    <td class="p-2 text-center font-semibold text-slate-500">{{ log.qtyAwal ?? '-' }}</td>
                                    <td class="p-2 text-center font-extrabold text-emerald-700">{{ log.qtyAkhir ?? '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.supplier || log.keperluan || '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                    <td v-if="sisaProjectShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                    <td v-if="sisaProjectShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                    <td class="p-2 text-center">
                                        <span :class="isPendingLog(log) ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-black whitespace-nowrap">
                                            <i :data-lucide="isPendingLog(log) ? 'clock-3' : 'badge-check'" class="w-3 h-3"></i>
                                            {{ isPendingLog(log) ? 'BELUM DISETUJUI' : 'SUDAH DISETUJUI' }}
                                        </span>
                                    </td>
                                    <td class="p-2 text-center no-print">
                                        <span v-if="isCancelledLog(log)" class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[9px] font-black whitespace-nowrap">
                                            <i data-lucide="ban" class="w-3 h-3"></i> DIBATALKAN
                                        </span>
                                        <button v-if="canApprove && isPendingLog(log)" @click="approveTransaction(log)" class="block mx-auto text-emerald-700 hover:text-emerald-900 font-black text-[10px] underline">Setujui</button>
                                        <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="editLog(log)" class="block mx-auto text-amber-600 hover:text-amber-800 font-bold text-[10px] underline">Edit</button>
                                        <button v-if="canEdit && !isCancelledLog(log)" @click="cancelTransaction(log)" class="block mx-auto text-rose-600 hover:text-rose-800 font-bold text-[10px] underline">Cancel</button>
                                        <span v-if="!isPendingLog(log)" class="text-[9px] text-emerald-600 font-bold">✓ Approved</span>
                                    </td>
                                </tr>
                                <tr v-if="filteredProjectLogsIn.length === 0"><td colspan="11" class="p-4 text-center text-slate-400 italic text-[11px]">Belum ada log barang masuk.</td></tr>
                            </tbody>
                        </table>
                <div v-if="sisaProjectLogInPageCount > 1" class="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between gap-2 no-print">
                    <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((sisaProjectLogInPage - 1) * logPageSize) + 1 }}–{{ Math.min(sisaProjectLogInPage * logPageSize, filteredProjectLogsIn.length) }} dari {{ filteredProjectLogsIn.length }} data</span>
                    <div class="flex items-center gap-2">
                        <button @click="sisaProjectLogInPage = Math.max(1, sisaProjectLogInPage - 1)" :disabled="sisaProjectLogInPage <= 1" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Sebelumnya</button>
                        <span class="text-[9px] font-black text-slate-600">Halaman {{ sisaProjectLogInPage }} / {{ sisaProjectLogInPageCount }}</span>
                        <button @click="sisaProjectLogInPage = Math.min(sisaProjectLogInPageCount, sisaProjectLogInPage + 1)" :disabled="sisaProjectLogInPage >= sisaProjectLogInPageCount" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Berikutnya</button>
                    </div>
                </div>
                    </div>
                </div>
                <div class="portal-card rounded-xl p-5 space-y-3 border-t-4 border-t-amber-600">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span class="font-bold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-amber-600"></i> Log Pengeluaran Sisa Project
                        </span>
                        <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">{{ filteredProjectLogsOut.length }} Keluar</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs excel-print-table">
                            <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[9px] border-b border-slate-200 sticky top-0">
                                <tr>
                                    <th class="p-2 text-center">No</th>
                                    <th class="p-2">Nama Barang</th>
                                     <th class="p-2 text-center">Satuan</th>
                                    <th class="p-2 text-center">Qty Out</th>
                                    <th class="p-2 text-center">Qty Awal</th>
                                    <th class="p-2 text-center">Qty Akhir</th>
                                    <th class="p-2">Penerima</th>
                                    <th class="p-2">Keterangan</th>
                                    <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Satuan</th>
                                    <th v-if="sisaProjectShowPrices" class="p-2 text-right">Harga Total</th>
                                    <th class="p-2 text-center">Status Approval</th>
                                        <th class="p-2 text-center no-print">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="(log, idx) in paginatedProjectLogsOut" :key="log.id" :class="isCancelledLog(log) ? 'bg-rose-50/70' : ''">
                                    <td class="p-2 text-center font-bold text-slate-400">{{ ((sisaProjectLogOutPage - 1) * logPageSize) + idx + 1 }}</td>
                                    <td class="p-2 font-bold text-slate-800 uppercase">
                                        {{ log.nama }}
                                        <span v-if="log.editedAt" class="block text-[8px] text-amber-600 font-bold italic">{{ log.editedAt }}</span>
                                    </td>
                                     <td class="p-2 text-center font-bold text-slate-700 uppercase">{{ getMasterSatuan(log.nama, log.satuan || 'Pcs', log.kode || log.barcode || '') }}</td>
                                    <td class="p-2 text-center font-bold text-amber-600">-{{ getLogDisplayQty(log) }}</td>
                                    <td class="p-2 text-center font-semibold text-slate-500">{{ log.qtyAwal ?? '-' }}</td>
                                    <td class="p-2 text-center font-extrabold text-amber-700">{{ log.qtyAkhir ?? '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.penerima || log.user || '-' }}</td>
                                    <td class="p-2 text-slate-500 text-[10px] uppercase">{{ log.keterangan || log.keperluan || '-' }}</td>
                                    <td v-if="sisaProjectShowPrices" class="p-2 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(log.harga != null ? log.harga : getMasterHarga(log.nama)) }}</td>
                                    <td v-if="sisaProjectShowPrices" class="p-2 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(log.harga != null ? log.harga : getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0)) }}</td>
                                    <td class="p-2 text-center">
                                        <span :class="isPendingLog(log) ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-black whitespace-nowrap">
                                            <i :data-lucide="isPendingLog(log) ? 'clock-3' : 'badge-check'" class="w-3 h-3"></i>
                                            {{ isPendingLog(log) ? 'BELUM DISETUJUI' : 'SUDAH DISETUJUI' }}
                                        </span>
                                    </td>
                                    <td class="p-2 text-center no-print">
                                        <span v-if="isCancelledLog(log)" class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[9px] font-black whitespace-nowrap">
                                            <i data-lucide="ban" class="w-3 h-3"></i> DIBATALKAN
                                        </span>
                                        <button v-if="canApprove && isPendingLog(log)" @click="approveTransaction(log)" class="block mx-auto text-emerald-700 hover:text-emerald-900 font-black text-[10px] underline">Setujui</button>
                                        <button v-if="(isPendingLog(log) && canInputTransaction) || (!isPendingLog(log) && canEdit)" @click="editLog(log)" class="block mx-auto text-amber-600 hover:text-amber-800 font-bold text-[10px] underline">Edit</button>
                                        <button v-if="canEdit && !isCancelledLog(log)" @click="cancelTransaction(log)" class="block mx-auto text-rose-600 hover:text-rose-800 font-bold text-[10px] underline">Cancel</button>
                                        <span v-if="!isPendingLog(log)" class="text-[9px] text-emerald-600 font-bold">✓ Approved</span>
                                    </td>
                                </tr>
                                <tr v-if="filteredProjectLogsOut.length === 0"><td colspan="11" class="p-4 text-center text-slate-400 italic text-[11px]">Belum ada log barang keluar.</td></tr>
                            </tbody>
                        </table>
                <div v-if="sisaProjectLogOutPageCount > 1" class="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between gap-2 no-print">
                    <span class="text-[9px] font-semibold text-slate-500">Menampilkan {{ ((sisaProjectLogOutPage - 1) * logPageSize) + 1 }}–{{ Math.min(sisaProjectLogOutPage * logPageSize, filteredProjectLogsOut.length) }} dari {{ filteredProjectLogsOut.length }} data</span>
                    <div class="flex items-center gap-2">
                        <button @click="sisaProjectLogOutPage = Math.max(1, sisaProjectLogOutPage - 1)" :disabled="sisaProjectLogOutPage <= 1" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Sebelumnya</button>
                        <span class="text-[9px] font-black text-slate-600">Halaman {{ sisaProjectLogOutPage }} / {{ sisaProjectLogOutPageCount }}</span>
                        <button @click="sisaProjectLogOutPage = Math.min(sisaProjectLogOutPageCount, sisaProjectLogOutPage + 1)" :disabled="sisaProjectLogOutPage >= sisaProjectLogOutPageCount" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-40">Berikutnya</button>
                    </div>
                </div>
                    <div class="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between gap-3 bg-amber-50/60 rounded-lg px-3 py-2">
                        <div>
                            <div class="text-[9px] font-black text-amber-800 uppercase">Total Harga Pengeluaran Gudang Sisa Project</div>
                            <div class="text-[9px] text-slate-500 mt-0.5">Nilai dihitung dari seluruh pengeluaran Sisa Project yang tercatat.</div>
                        </div>
                        <div v-if="sisaProjectShowPrices" class="text-sm font-black text-amber-700 whitespace-nowrap">Rp {{ formatRupiah(totalHargaPengeluaranSisaProject) }}</div>
                        <div v-else class="text-[10px] font-bold text-slate-400 whitespace-nowrap">Harga disembunyikan</div>
                    </div>
                    </div>
                </div>
            </div>
<div class="portal-card rounded-xl overflow-hidden no-print">
                <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <i data-lucide="boxes" class="w-4 h-4 text-teal-600"></i>
                        <h3 class="font-bold text-slate-800 uppercase text-xs tracking-wider">Daftar Stok Gudang Sisa Project</h3>
                    </div>
                    <div class="flex items-center gap-2">
                    <button v-if="canPrint" @click="printStockGudang('Sisa Project')" class="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm flex items-center gap-1.5">
                        <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak Stock
                    </button>
                    <button v-if="canEdit" @click="exportStockGudangExcel('Sisa Project')" class="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm flex items-center gap-1.5">
                        <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Excel Stock
                    </button>
                    <span class="text-[11px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">{{ filteredSisaProjects.length }} Item Available</span>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs excel-print-table sparepart-table">
                        <thead class="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                            <tr>
                                <th class="p-3 text-center">No</th>
                                <th class="p-3 text-center sparepart-location">Lokasi Rak</th>
                                <th class="p-3 sparepart-name">Nama Barang</th>
                                <th class="p-3 text-center">Satuan</th>
                                <th class="p-3 text-center sparepart-stock">Stok Available</th>
                                <th class="p-3 text-center sparepart-action">Aksi Pengeluaran</th>
                                <th class="p-3 text-center sparepart-card">Kartu Stock</th>
                                <th v-if="sisaProjectShowPrices" class="p-3.5 text-right sparepart-price">Harga Satuan</th>
                                <th v-if="sisaProjectShowPrices" class="p-3.5 text-right">Harga Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(item, idx) in paginatedSisaProjects" :key="item.barcode || item.kode || (item.nama + '-' + idx)" class="hover:bg-slate-50 transition-colors">
                                <td class="p-3.5 text-center font-bold text-slate-400">{{ ((sisaProjectPage - 1) * sisaProjectPageSize) + idx + 1 }}</td>
                                <td class="p-3.5 text-center font-bold text-slate-600 uppercase">{{ item.lokasi || item.lokasiRak || item.rak || '-' }}</td>
                                <td class="p-3.5 font-bold text-slate-800 uppercase">{{ item.nama }}</td>
                                 <td class="p-3.5 text-center font-bold text-slate-700 uppercase">{{ item.satuan || 'Pcs' }}</td>
                                <td class="p-3.5 text-center">
                                    <span class="px-2.5 py-1 rounded-lg font-black text-xs border border-slate-200 bg-slate-100 text-slate-800 inline-block">
                                        {{ item.qty }} {{ item.satuan || 'Pcs' }}
                                    </span>
                                </td>
                                <td class="p-3.5 text-center">
                                    <button @click="openSingleOutModal(item)" :disabled="item.qty <= 0" class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm border border-amber-500">
                                        Keluar
                                    </button>
                                </td>
                                <td class="p-3.5 text-center">
                                    <button v-if="canPrint" @click="printLabel(item)" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold text-[10px] uppercase border border-slate-300 flex items-center gap-1 mx-auto">
                                        <i data-lucide="printer" class="w-3 h-3"></i> Kartu Stock
                                    </button>
                                </td>
                                <td v-if="sisaProjectShowPrices" class="p-3.5 text-right font-bold whitespace-nowrap">Rp {{ formatRupiah(item.harga != null ? item.harga : getMasterHarga(item.nama)) }}</td>
                                <td v-if="sisaProjectShowPrices" class="p-3.5 text-right font-black whitespace-nowrap">Rp {{ formatRupiah((Number(item.harga != null ? item.harga : getMasterHarga(item.nama)) || 0) * (Number(item.qty) || 0)) }}</td>
                            </tr>
                            <tr v-if="filteredSisaProjects.length === 0"><td :colspan="sisaProjectShowPrices ? 9 : 7" class="p-10 text-center text-slate-400 font-medium">Stok Sisa Project kosong.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="sisaProjectPageCount > 1" class="px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
                    <span class="text-[10px] font-semibold text-slate-500">Menampilkan {{ sisaProjectPageStart }}–{{ sisaProjectPageEnd }} dari {{ filteredSisaProjects.length }} item</span>
                    <div class="flex items-center gap-2">
                        <button @click="sisaProjectPage = Math.max(1, sisaProjectPage - 1)" :disabled="sisaProjectPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[10px] font-black disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
                        <span class="text-[10px] font-black text-slate-600">Halaman {{ Math.min(sisaProjectPage, sisaProjectPageCount) }} / {{ sisaProjectPageCount }}</span>
                        <button @click="sisaProjectPage = Math.min(sisaProjectPageCount, sisaProjectPage + 1)" :disabled="sisaProjectPage >= sisaProjectPageCount" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[10px] font-black disabled:opacity-40 disabled:cursor-not-allowed">›</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB APPROVAL TRANSAKSI (SUPER ADMIN) -->
        <div v-if="activeTab === 'approval' && canApprove" class="space-y-6 no-print">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="portal-card rounded-xl p-5 border-l-4 border-amber-500">
                    <p class="text-[10px] font-black text-slate-500 uppercase">Belum Disetujui</p>
                    <p class="text-3xl font-black text-amber-600 mt-1">{{ pendingApprovalLogs.length + pendingApprovalOpname.length + pendingMasterApprovalRequests.length }}</p>
                    <p class="text-[10px] text-slate-500 mt-1">Transaksi + Stock Opname + Data Master</p>
                </div>
                <div class="portal-card rounded-xl p-5 border-l-4 border-emerald-500">
                    <p class="text-[10px] font-black text-slate-500 uppercase">Sudah Disetujui</p>
                    <p class="text-3xl font-black text-emerald-600 mt-1">{{ approvedApprovalLogs.length + approvedApprovalOpname.length + approvedMasterApprovalRequests.length }}</p>
                    <p class="text-[10px] text-slate-500 mt-1">Transaksi + Stock Opname + Data Master</p>
                </div>
                <div class="portal-card rounded-xl p-5 border-l-4 border-slate-400">
                    <p class="text-[10px] font-black text-slate-500 uppercase">Total</p>
                    <p class="text-3xl font-black text-slate-700 mt-1">{{ allTransactionLogs.length + opnameHistory.length + masterApprovalRequests.length }}</p>
                    <p class="text-[10px] text-slate-500 mt-1">Inbound + Outbound + Opname + Data Master</p>
                </div>
            </div>

            <div class="portal-card rounded-xl overflow-hidden">
                <div class="p-5 border-b border-slate-100 bg-slate-50/60">
                    <h2 class="font-black text-slate-800 text-sm uppercase">Approval</h2>
                    <p class="text-[10px] text-slate-500 mt-1">Super Admin dapat menyetujui maupun membatalkan persetujuan transaksi serta menyetujui perubahan Data Master dari Admin.</p>
                </div>

                <div class="p-4 border-b border-slate-100 bg-white flex flex-wrap gap-2">
                    <button @click="approvalWarehouseTab = 'Sparepart'; approvalMovementTab = 'IN'; approvalStatusFilter = 'all'" :class="approvalWarehouseTab === 'Sparepart' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Gudang Spare Part</button>
                    <button @click="approvalWarehouseTab = 'Sisa Project'; approvalMovementTab = 'IN'; approvalStatusFilter = 'all'" :class="approvalWarehouseTab === 'Sisa Project' ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Gudang Sisa Project</button>
                    <button @click="approvalWarehouseTab = 'Stock Opname'; approvalStatusFilter = 'all'" :class="approvalWarehouseTab === 'Stock Opname' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Stock Opname</button>
                    <button @click="approvalWarehouseTab = 'Data Master'; approvalStatusFilter = 'all'" :class="approvalWarehouseTab === 'Data Master' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Data Master ({{ pendingMasterApprovalRequests.length }})</button>
                </div>

                <div v-if="approvalWarehouseTab !== 'Stock Opname'" class="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-2">
                    <button @click="approvalMovementTab = 'IN'; approvalStatusFilter = 'all'" :class="approvalMovementTab === 'IN' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Inbound ({{ approvalWarehouseTab === 'Sparepart' ? approvalSparepartInLogs.length : approvalSisaProjectInLogs.length }})</button>
                    <button @click="approvalMovementTab = 'OUT'; approvalStatusFilter = 'all'" :class="approvalMovementTab === 'OUT' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Outbound ({{ approvalWarehouseTab === 'Sparepart' ? approvalSparepartOutLogs.length : approvalSisaProjectOutLogs.length }})</button>
                </div>

                <div v-if="approvalWarehouseTab !== 'Stock Opname'" class="p-4 border-b border-slate-100 bg-white">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button type="button" @click="approvalStatusFilter = 'pending'" :class="approvalStatusFilter === 'pending' ? 'ring-2 ring-amber-300 shadow-md' : 'hover:shadow-sm'" class="text-left rounded-xl bg-amber-50 border border-amber-200 p-4 transition-all cursor-pointer">
                            <p class="text-[10px] font-black text-amber-700 uppercase">Belum Disetujui</p>
                            <p class="text-2xl font-black text-amber-700">{{ approvalWarehousePendingCount }}</p>
                            <p class="text-[10px] text-slate-500 mt-1">Klik untuk menampilkan approval yang belum disetujui · {{ approvalWarehouseTab }}</p>
                        </button>
                        <button type="button" @click="approvalStatusFilter = 'approved'" :class="approvalStatusFilter === 'approved' ? 'ring-2 ring-emerald-300 shadow-md' : 'hover:shadow-sm'" class="text-left rounded-xl bg-emerald-50 border border-emerald-200 p-4 transition-all cursor-pointer">
                            <p class="text-[10px] font-black text-emerald-700 uppercase">Sudah Disetujui</p>
                            <p class="text-2xl font-black text-emerald-700">{{ approvalWarehouseApprovedCount }}</p>
                            <p class="text-[10px] text-slate-500 mt-1">Klik untuk menampilkan approval yang sudah disetujui · {{ approvalWarehouseTab }}</p>
                        </button>
                    </div>
                    <div v-if="approvalStatusFilter !== 'all'" class="mt-3 flex items-center justify-between gap-2">
                        <span class="text-[10px] text-slate-500">Filter aktif: <b>{{ approvalStatusFilter === 'pending' ? 'Belum Disetujui' : 'Sudah Disetujui' }}</b></span>
                        <button type="button" @click="approvalStatusFilter = 'all'" class="text-[10px] font-black text-slate-600 underline hover:text-slate-900">Tampilkan Semua</button>
                    </div>
                </div>

                <div v-if="approvalWarehouseTab !== 'Stock Opname'" class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                            <tr><th class="p-3 text-center">No</th><th class="p-3">Tanggal<br><span class="text-[9px]">No. PR</span></th><th class="p-3">Gudang</th><th class="p-3">Jenis</th><th class="p-3">Nama Barang</th><th class="p-3 text-center">Qty</th><th class="p-3">Dibuat Oleh</th><th class="p-3 text-center">Status</th><th class="p-3 text-center">Aksi</th></tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(log, idx) in approvalVisibleLogs.slice((approvalPage - 1) * 20, approvalPage * 20)" :key="log.id" :class="isPendingLog(log) ? 'bg-amber-50/40' : ''">
                                <td class="p-3 text-center font-bold text-slate-400">{{ idx + 1 }}</td>
                                <td class="p-3 text-slate-600 font-mono"><div>{{ log.tgl || '-' }}</div><div class="mt-1 text-[9px] font-bold text-slate-700">{{ log.nomorPR || '-' }}</div></td>
                                <td class="p-3 font-bold text-slate-700">{{ log.gudang || '-' }}</td>
                                <td class="p-3 text-center"><span :class="log.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'" class="px-2 py-1 rounded text-[9px] font-black">{{ log.type === 'IN' ? 'INBOUND' : 'OUTBOUND' }}</span></td>
                                <td class="p-3 font-bold uppercase">{{ log.nama || '-' }}</td>
                                <td class="p-3 text-center font-black">{{ getLogDisplayQty(log) }}</td>
                                <td class="p-3 text-slate-600">{{ log.user || log.pengambil || log.penerima || '-' }}</td>
                                <td class="p-3 text-center"><span :class="isPendingLog(log) ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-black">{{ isPendingLog(log) ? 'BELUM DISETUJUI' : 'SUDAH DISETUJUI' }}</span></td>
                                <td class="p-3 text-center">
                                    <button v-if="isPendingLog(log)" @click="approveTransaction(log)" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black">Setujui</button>
                                    <button v-else @click="unapproveTransaction(log)" class="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black">Un Approved</button>
                                </td>
                            </tr>
                            <tr v-if="approvalVisibleLogs.length === 0"><td colspan="9" class="p-10 text-center text-slate-400">Belum ada data {{ approvalMovementTab === 'IN' ? 'inbound' : 'outbound' }}.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="approvalVisibleLogs.length > 20" class="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
                    <p class="text-[10px] text-slate-500">Menampilkan {{ ((approvalPage - 1) * 20) + 1 }}–{{ Math.min(approvalPage * 20, approvalVisibleLogs.length) }} dari {{ approvalVisibleLogs.length }} data</p>
                    <div class="flex items-center gap-1.5">
                        <button type="button" @click="approvalPage = Math.max(1, approvalPage - 1)" :disabled="approvalPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Sebelumnya</button>
                        <span class="px-2 text-[10px] font-black text-slate-600">Halaman {{ Math.min(approvalPage, Math.ceil(approvalVisibleLogs.length / 20)) }} / {{ Math.ceil(approvalVisibleLogs.length / 20) }}</span>
                        <button type="button" @click="approvalPage = Math.min(Math.ceil(approvalVisibleLogs.length / 20), approvalPage + 1)" :disabled="approvalPage >= Math.ceil(approvalVisibleLogs.length / 20)" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Berikutnya</button>
                    </div>
                </div>

                <div v-else-if="approvalWarehouseTab === 'Data Master'" class="p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div class="rounded-xl bg-amber-50 border border-amber-200 p-4"><p class="text-[10px] font-black text-amber-700 uppercase">Menunggu Approval Data Master</p><p class="text-2xl font-black text-amber-700">{{ pendingMasterApprovalRequests.length }}</p></div>
                        <div class="rounded-xl bg-emerald-50 border border-emerald-200 p-4"><p class="text-[10px] font-black text-emerald-700 uppercase">Sudah Disetujui</p><p class="text-2xl font-black text-emerald-700">{{ approvedMasterApprovalRequests.length }}</p></div>
                    </div>
                    <div class="space-y-3">
                        <div v-for="req in masterApprovalRequests.slice().sort((a,b) => (String(b.createdAt || b.id)).localeCompare(String(a.createdAt || a.id)))" :key="req.id" class="border border-slate-200 rounded-xl p-4">
                            <div class="flex flex-wrap items-start justify-between gap-4">
                                <div class="min-w-0 flex-1">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <p class="font-black text-slate-800 text-xs uppercase">{{ req.before?.nama || req.targetNama || '-' }}</p>
                                        <span class="px-2 py-0.5 rounded-full border text-[9px] font-black" :class="String(req.approvalStatus || 'pending').toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'">{{ String(req.approvalStatus || 'pending').toLowerCase() === 'pending' ? 'BELUM DISETUJUI' : 'SUDAH DISETUJUI' }}</span>
                                    </div>
                                    <p class="text-[10px] text-slate-500 mt-1">Diajukan oleh: {{ req.createdBy || '-' }} · {{ req.createdAt ? new Date(req.createdAt).toLocaleString('id-ID') : '-' }}</p>
                                    <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div class="rounded-lg bg-slate-50 border border-slate-200 p-3">
                                            <p class="text-[9px] font-black text-slate-500 uppercase mb-2">Data Sebelum</p>
                                            <p class="text-[10px] text-slate-700">SKU: <b>{{ req.before?.kode || '-' }}</b></p>
                                            <p class="text-[10px] text-slate-700">Nama: <b>{{ req.before?.nama || '-' }}</b></p>
                                            <p class="text-[10px] text-slate-700">Satuan: <b>{{ req.before?.satuan || '-' }}</b> · Stok: <b>{{ req.before?.currentStock ?? 0 }}</b></p>
                                        </div>
                                        <div class="rounded-lg bg-blue-50 border border-blue-200 p-3">
                                            <p class="text-[9px] font-black text-blue-600 uppercase mb-2">Usulan Perubahan</p>
                                            <p class="text-[10px] text-slate-700">SKU: <b>{{ req.after?.kode || '-' }}</b></p>
                                            <p class="text-[10px] text-slate-700">Nama: <b>{{ req.after?.nama || '-' }}</b></p>
                                            <p class="text-[10px] text-slate-700">Satuan: <b>{{ req.after?.satuan || '-' }}</b> · Stok: <b>{{ req.after?.currentStock ?? 0 }}</b></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2 shrink-0">
                                    <button v-if="String(req.approvalStatus || 'pending').toLowerCase() === 'pending'" @click="approveMasterEdit(req)" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black">Setujui</button>
                                </div>
                            </div>
                        </div>
                        <div v-if="masterApprovalRequests.length === 0" class="p-8 text-center text-slate-400 text-xs">Belum ada pengajuan perubahan Data Master.</div>
                    </div>
                </div>

                <div v-else class="p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div class="rounded-xl bg-amber-50 border border-amber-200 p-4"><p class="text-[10px] font-black text-amber-700 uppercase">Menunggu Approval</p><p class="text-2xl font-black text-amber-700">{{ pendingApprovalOpname.length }}</p></div>
                        <div class="rounded-xl bg-emerald-50 border border-emerald-200 p-4"><p class="text-[10px] font-black text-emerald-700 uppercase">Sudah Disetujui</p><p class="text-2xl font-black text-emerald-700">{{ approvedApprovalOpname.length }}</p></div>
                    </div>
                    <div class="space-y-3">
                        <div v-for="op in opnameHistory.slice((approvalPage - 1) * 20, approvalPage * 20)" :key="op.id" class="border border-slate-200 rounded-xl p-4">
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <div><p class="font-black text-slate-800 text-xs uppercase">{{ op.nomor }}</p><p class="text-[10px] text-slate-500 mt-1">{{ op.tgl }} · {{ op.gudang }} · {{ op.petugas }}</p><p class="text-[10px] text-slate-500">{{ op.totalItem }} item · {{ op.totalSelisih }} selisih</p></div>
                                <div class="text-right">
                                    <span :class="String(op.approvalStatus || 'approved').toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="inline-flex px-2 py-1 rounded-full border text-[9px] font-black">{{ String(op.approvalStatus || 'approved').toLowerCase() === 'pending' ? 'BELUM DISETUJUI' : 'SUDAH DISETUJUI' }}</span>
                                    <div class="mt-2">
                                        <button v-if="String(op.approvalStatus || 'approved').toLowerCase() === 'pending'" @click="approveOpname(op)" class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[9px] font-black">Setujui</button>
                                        <button v-else @click="unapproveOpname(op)" class="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-[9px] font-black">Un Approved</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="opnameHistory.length > 20" class="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between gap-3">
                            <p class="text-[10px] text-slate-500">Menampilkan {{ ((approvalPage - 1) * 20) + 1 }}–{{ Math.min(approvalPage * 20, opnameHistory.length) }} dari {{ opnameHistory.length }} data</p>
                            <div class="flex items-center gap-1.5">
                                <button type="button" @click="approvalPage = Math.max(1, approvalPage - 1)" :disabled="approvalPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Sebelumnya</button>
                                <span class="px-2 text-[10px] font-black text-slate-600">Halaman {{ Math.min(approvalPage, Math.ceil(opnameHistory.length / 20)) }} / {{ Math.ceil(opnameHistory.length / 20) }}</span>
                                <button type="button" @click="approvalPage = Math.min(Math.ceil(opnameHistory.length / 20), approvalPage + 1)" :disabled="approvalPage >= Math.ceil(opnameHistory.length / 20)" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Berikutnya</button>
                            </div>
                        </div>
                        <div v-if="opnameHistory.length === 0" class="p-8 text-center text-slate-400 text-xs">Belum ada stock opname.</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL PENGELUARAN SATUAN -->
        <div v-if="showSingleOutModal && canInputTransaction" class="fixed inset-0 z-[125] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">
                <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 class="font-black text-slate-800 text-sm uppercase">Pengeluaran Satuan</h3>
                        <p class="text-[10px] text-slate-500 mt-1">Lengkapi data transaksi sebelum dikirim ke Approval, dengan format yang sama seperti form Approval.</p>
                    </div>
                    <button @click="showSingleOutModal = false" class="p-2 hover:bg-slate-100 rounded-lg"><i data-lucide="x" class="w-4 h-4"></i></button>
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
                    <button @click="showSingleOutModal = false" class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">Batal</button>
                    <button @click="confirmSingleOut" class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black">Simpan & Kirim Approval</button>
                </div>
            </div>
        </div>

        <!-- MODAL DETAIL & PENGISIAN APPROVAL -->
        <div v-if="showApprovalFormModal && canApprove" class="fixed inset-0 z-[130] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">
                <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 class="font-black text-slate-800 text-sm uppercase">Detail & Pengisian Approval Transaksi</h3>
                        <p class="text-[10px] text-slate-500 mt-1">Lengkapi dan periksa data transaksi sebelum disetujui. Data tidak dihilangkan dari proses approval.</p>
                    </div>
                    <button @click="showApprovalFormModal = false" class="p-2 hover:bg-slate-100 rounded-lg"><i data-lucide="x" class="w-4 h-4"></i></button>
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
                    <button @click="showApprovalFormModal = false" class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">Batal</button>
                    <button @click="confirmApprovalForm" class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black">Simpan & Setujui</button>
                </div>
            </div>
        </div>

        <!-- TAB PENGATURAN AKUN (SUPER ADMIN) -->
        <div v-if="activeTab === 'settings' && canManageAccounts" class="space-y-6 no-print">
            <div class="portal-card p-6 rounded-xl">
                <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                    <div>
                        <h2 class="font-black text-slate-800 text-sm uppercase">Pengaturan Akun</h2>
                        <p class="text-[10px] text-slate-500 mt-1">Super Admin dapat membuat akun, mengatur status, dan membatasi jumlah perangkat aktif.</p>
                    </div>
                    <span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-black">SUPER ADMIN</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Email Akun Baru</label>
                        <input v-model="newAccount.email" type="email" placeholder="email@contoh.com" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Password Awal</label>
                        <div class="relative">
                            <input v-model="newAccount.password" :type="showNewAccountPassword ? 'text' : 'password'" minlength="6" placeholder="Minimal 6 karakter" class="w-full p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                            <button type="button" @click="showNewAccountPassword = !showNewAccountPassword" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700" :title="showNewAccountPassword ? 'Sembunyikan password' : 'Tampilkan password'">
                                <i :data-lucide="showNewAccountPassword ? 'eye-off' : 'eye'" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Role</label>
                        <select v-model="newAccount.role" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold">
                            <option value="viewer">Viewer</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                    </div>
                </div>
                <div class="flex justify-end mt-3">
                    <button @click="createUserAccount" :disabled="authLoading" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold">Buat Akun</button>
                </div>
                <p v-if="accountMessage" class="mt-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">{{ accountMessage }}</p>
                <p v-if="accountError" class="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{{ accountError }}</p>
            </div>

            <div class="portal-card p-6 rounded-xl">
                <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                    <div>
                        <h2 class="font-black text-slate-800 text-sm uppercase">Batas Akses Perangkat</h2>
                        <p class="text-[10px] text-slate-500 mt-1">Atur jumlah perangkat yang boleh aktif bersamaan untuk setiap role.</p>
                    </div>
                    <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-black">KEAMANAN</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Super Admin (device)</label>
                        <input v-model.number="securitySettings.max_super_admin_devices" type="number" min="1" max="100" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Admin (device)</label>
                        <input v-model.number="securitySettings.max_admin_devices" type="number" min="1" max="100" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Viewer (device)</label>
                        <input v-model.number="securitySettings.max_viewer_devices" type="number" min="1" max="100" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Auto Logout (jam)</label>
                        <input v-model.number="securitySettings.session_timeout_hours" type="number" min="1" max="720" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    </div>
                </div>
                <div class="flex items-center justify-between gap-3 mt-4">
                    <p class="text-[10px] text-slate-500">Default: Super Admin 1, Admin 5, Viewer 10, auto logout setelah tidak dibuka 24 jam.</p>
                    <button @click="saveSecuritySettings" :disabled="securitySettingsSaving" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold">{{ securitySettingsSaving ? 'Menyimpan...' : 'Simpan Pengaturan' }}</button>
                </div>
                <p v-if="securitySettingsMessage" class="mt-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">{{ securitySettingsMessage }}</p>
            </div>

            <div class="portal-card rounded-xl overflow-hidden">
                <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 class="font-black text-slate-800 text-xs uppercase">Daftar Akun</h3>
                    <button @click="loadUserAccounts" class="text-[10px] font-bold text-emerald-700 hover:underline">Refresh</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs">
                        <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                            <tr><th class="p-3 text-left">Email</th><th class="p-3 text-center">Role</th><th class="p-3 text-center">Status</th><th class="p-3 text-center">Aksi</th></tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="account in userAccounts" :key="account.id">
                                <td class="p-3 font-semibold text-slate-700">{{ account.email || account.id }}</td>
                                <td class="p-3 text-center">
                                    <select v-model="account.role" @change="saveAccountSettings(account)" class="p-1.5 border border-slate-200 rounded text-[10px] font-bold">
                                        <option value="viewer">Viewer</option><option value="admin">Admin</option><option value="super_admin">Super Admin</option>
                                    </select>
                                </td>
                                <td class="p-3 text-center">
                                    <span :class="account.active === false ? 'bg-red-100 text-red-700 border-red-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" class="px-2 py-1 rounded border text-[10px] font-bold">{{ account.active === false ? 'Nonaktif' : 'Aktif' }}</span>
                                </td>
                                <td class="p-3 text-center">
                                    <div class="flex items-center justify-center gap-3 flex-wrap">
                                        <button @click="openPasswordChange(account)" class="text-[10px] font-bold underline text-amber-700 hover:text-amber-800">Ganti Password</button>
                                        <button v-if="account.id !== authUser?.id" @click="toggleAccountActive(account)" class="text-[10px] font-bold underline" :class="account.active === false ? 'text-emerald-700' : 'text-rose-600'">{{ account.active === false ? 'Aktifkan' : 'Nonaktifkan' }}</button>
                                        <span v-else class="text-[10px] text-slate-400">Akun saat ini</span>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="userAccounts.length === 0"><td colspan="4" class="p-8 text-center text-slate-400">Belum ada data akun.</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <!-- MODAL GANTI PASSWORD AKUN (SUPER ADMIN) -->
    <div v-if="showPasswordChangeModal && canManageAccounts" class="fixed inset-0 z-[100] bg-slate-900/50 flex items-center justify-center p-4 no-print" @click.self="closePasswordChange">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <div class="flex items-center justify-between mb-5">
                <div>
                    <h3 class="font-black text-slate-800 text-sm uppercase">Ganti Password</h3>
                    <p class="text-[10px] text-slate-500 mt-1">{{ passwordChange.email }}</p>
                </div>
                <button type="button" @click="closePasswordChange" class="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Password Baru</label>
            <div class="relative">
                <input v-model="passwordChange.password" :type="showChangedPassword ? 'text' : 'password'" minlength="6" autocomplete="new-password" placeholder="Minimal 6 karakter" class="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <button type="button" @click="showChangedPassword = !showChangedPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700" :title="showChangedPassword ? 'Sembunyikan password' : 'Tampilkan password'">
                    <i :data-lucide="showChangedPassword ? 'eye-off' : 'eye'" class="w-4 h-4"></i>
                </button>
            </div>
            <p class="text-[10px] text-slate-500 mt-2">Password lama tidak ditampilkan. Yang dapat ditampilkan adalah password baru yang sedang dimasukkan.</p>
            <div class="flex justify-end gap-2 mt-5">
                <button type="button" @click="closePasswordChange" class="px-4 py-2 rounded-lg text-xs font-bold border border-slate-200 text-slate-600">Batal</button>
                <button type="button" @click="changeUserPassword" :disabled="passwordChangeSaving" class="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-50">{{ passwordChangeSaving ? 'Menyimpan...' : 'Simpan Password' }}</button>
            </div>
        </div>
    </div>
    <!-- SEARCH DROPDOWN: TELEPORT KE BODY AGAR TIDAK TERPOTONG overflow-y-auto MODAL -->
    <teleport to="body">
        <div v-if="masterDropdownKey"
             class="fixed bg-white border-2 border-amber-400 rounded-xl shadow-2xl overflow-y-auto"
             :style="Object.assign({ zIndex: 2147483647, position: 'fixed', pointerEvents: 'auto', left: '20px', top: '100px', width: '360px', maxHeight: '300px' }, masterDropdownStyle)"
             @mousedown.stop>
            <template v-if="masterDropdownOptions.length">
                <button v-for="m in masterDropdownOptions"
                        :key="m.barcode || m.kode || m.nama"
                        type="button"
                        @mousedown.prevent.stop="selectMasterItem(m)"
                        class="w-full text-left px-3 py-2.5 hover:bg-amber-50 active:bg-amber-100 border-b border-slate-100 last:border-0 cursor-pointer"
                        style="pointer-events:auto;">
                    <div class="font-bold text-xs uppercase text-slate-800">{{ m.nama }}</div>
                    <div class="text-[9px] text-slate-500">{{ m.satuan || 'Pcs' }} · SKU: {{ m.kode || m.barcode || '-' }}<span v-if="masterDropdownKey.startsWith('sparepart-out-') || masterDropdownKey.startsWith('sisa-out-')"> · Stok: {{ m.qty }}</span></div>
                </button>
            </template>
            <div v-else class="px-3 py-3 text-[10px] font-semibold text-slate-500">
                {{ masterDropdownKey.startsWith('planning-') ? 'Barang tidak ditemukan di Data Master.' : 'Barang tidak ditemukan di stok.' }}
            </div>
        </div>
    </teleport>
    <!-- DROPDOWN KHUSUS SPAREPART OUT: TELEPORT KE BODY -->
    <teleport to="body">
        <div v-if="activeSparepartOutDropdown !== null"
             class="fixed bg-white border-2 border-amber-400 rounded-xl shadow-2xl overflow-y-auto"
             :style="sparepartOutDropdownStyle"
             @mousedown.stop>
            <button v-for="m in sparepartOutDropdownOptions"
                    :key="m.barcode || m.kode || m.nama"
                    type="button"
                    @mousedown.prevent.stop="selectSparepartOutItem(activeSparepartOutDropdown, formSparepartMultiOut.selectedItems[activeSparepartOutDropdown], m)"
                    class="w-full text-left px-3 py-2.5 hover:bg-amber-50 active:bg-amber-100 border-b border-slate-100 last:border-0 cursor-pointer">
                <div class="font-bold text-xs uppercase text-slate-800">{{ m.nama }}</div>
                <div class="text-[9px] text-slate-500">{{ m.satuan || 'Pcs' }} · SKU: {{ m.kode || m.barcode || '-' }} · Stok: {{ m.qty }}</div>
            </button>
            <div v-if="sparepartOutDropdownOptions.length === 0" class="px-3 py-3 text-[10px] font-semibold text-slate-500">Barang tidak ditemukan di stok.</div>
        </div>
    </teleport>
    
    <!-- MODAL 1: INPUT MONITORING ORDER -->
    <!-- REVISI 1 & 2: Ketik Manual Dulu Baru Ada Pilihan Data Master + Kepentingan Spesifik Per Barang -->
    <div v-if="showMonitoringInputModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-3xl w-full p-4 space-y-3 shadow-2xl max-h-[85vh] flex flex-col">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 class="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
                    <i data-lucide="plus-square" class="w-5 h-5 text-emerald-600"></i>
                    Input Purchase Request Baru
                </h3>
                <button @click="showMonitoringInputModal = false" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
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
                <button @click="showMonitoringInputModal = false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase">Batal</button>
                <button @click="simpanOrderMulti" class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase shadow-sm">Masukkan Ke Purchase Request</button>
            </div>
        </div>
    </div>
    <!-- MODAL PENERIMAAN PURCHASE REQUEST MULTI ITEM -->
    <div v-if="showPurchaseReceiptModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 no-print">
        <div class="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div class="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                    <h3 class="font-black text-slate-800 text-sm uppercase">Penerimaan Purchase Request</h3>
                    <p class="text-[10px] text-slate-500 mt-1">Format penerimaan dibuat satu form seperti Input Purchase Request. Semua item dalam No. PR diproses sekaligus.</p>
                </div>
                <button @click="showPurchaseReceiptModal=false" class="text-slate-400 hover:text-slate-700 text-xl">&times;</button>
            </div>

            <div class="space-y-3 overflow-y-auto overflow-x-hidden custom-scroll pr-1 flex-1 w-full">
                <div class="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Tanggal Penerimaan *</label>
                        <input v-model="purchaseReceiptDate" type="date" required class="w-full p-2.5 bg-emerald-50 font-extrabold text-sm border-2 border-emerald-500 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Nomor Purchase Request</label>
                        <input :value="purchaseReceiptItems[0]?.nomorPR || '-'" type="text" readonly class="w-full p-2.5 bg-slate-100 font-extrabold text-sm border border-slate-200 rounded-xl uppercase text-slate-700">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Nomor Purchase Order *</label>
                        <input v-model="purchaseReceiptPO" type="text" required autocomplete="off" placeholder="Input nomor PO" class="w-full p-2.5 bg-white font-extrabold text-sm border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 uppercase">
                    </div>
                    <div>
                        <label class="text-[9px] font-bold text-slate-500 uppercase block mb-1">Supplier *</label>
                        <input v-model="purchaseReceiptSupplier" type="text" required autocomplete="off" placeholder="Input nama supplier" class="w-full p-2.5 bg-white font-extrabold text-sm border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 uppercase">
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
                <button @click="showPurchaseReceiptModal=false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase">Batal</button>
                <button @click="submitPurchaseReceipt" class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase shadow-sm">Simpan Semua Penerimaan</button>
            </div>
        </div>
    </div>
    <!-- MODAL 2: PENGELUARAN MULTIPLE SPAREPART -->
    <div v-if="showSparepartMultiOutModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 class="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
                    <i data-lucide="minus-square" class="w-5 h-5 text-amber-600"></i>
                    Pengeluaran Multiple Item - Gudang Spare Part
                </h3>
                <button @click="showSparepartMultiOutModal = false" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>

            <div class="space-y-3 overflow-y-auto custom-scroll pr-1 flex-1">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Tanggal Transaksi / Tanggal Pengeluaran *</label>
                        <input v-model="formSparepartMultiOut.tanggal" @mousedown.stop @click.stop type="date" required class="w-full p-2.5 bg-amber-50 border-2 border-amber-500 rounded-xl font-extrabold text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-200">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nomor Purchase Request</label>
                        <input v-model="formSparepartMultiOut.nomorPR" @mousedown.stop @click.stop type="text" placeholder="Nomor PR (jika ada)" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nama Penerima *</label>
                        <input v-model="formSparepartMultiOut.penerima" @mousedown.stop @click.stop type="text" placeholder="Nama penerima barang" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Kepentingan / Keterangan *</label>
                        <input v-model="formSparepartMultiOut.keperluan" @mousedown.stop @click.stop type="text" placeholder="Maintenance / Produksi" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                </div>

                <div class="flex items-center justify-between pt-1">
                    <span class="text-[11px] text-slate-500 font-semibold">Daftar Barang Spare Part:</span>
                    <button @click="addCustomItemToSparepartMultiOut" class="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1">
                        + Tambah Item Manual
                    </button>
                </div>

                <div class="space-y-2 border-t border-slate-100 pt-3">
                    <div v-for="(item, idx) in formSparepartMultiOut.selectedItems" :key="idx" class="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-2">
                        <div class="flex justify-between items-center">
                            <div class="relative flex-1 mr-2">
                                <div class="relative flex-1">
                                    <i data-lucide="search" class="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-amber-500 pointer-events-none"></i>
                                    <input v-model="item.nama" @mousedown.stop @focus="openSparepartOutDropdown(idx, item)" @click.stop="openSparepartOutDropdown(idx, item)" @input.stop="updateSparepartOutDropdown(idx, item)" :data-sparepart-out-input="idx" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik untuk cari barang dari stok sparepart..." class="w-full pl-8 pr-2 py-2 font-bold text-xs uppercase bg-white border-2 border-amber-300 rounded-md cursor-text outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100">
                                    <!-- Dropdown ditampilkan via Teleport agar TIDAK terpotong oleh overflow-y-auto modal -->
                                </div>
                            </div>
                            <button @click="removeSparepartOutItem(idx)" class="text-rose-500 hover:text-rose-700 font-bold text-xs">&times; Hapus</button>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-5 gap-2">
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Stok Saat Ini</label>
                                <input :value="item.qty" type="number" readonly class="w-full p-1.5 bg-slate-100 font-bold text-xs text-center border border-amber-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Qty Keluar</label>
                                <input v-model.number="item.outQty" @mousedown.stop @click.stop type="number" min="1" :max="item.qty" class="w-full p-1.5 bg-white font-bold text-xs text-center border border-amber-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Harga Satuan (Rp)</label>
                                <input v-model.number="item.harga" type="number" min="0" step="any" class="w-full p-1.5 bg-white font-bold text-xs text-right border border-emerald-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Satuan</label>
                                <input :value="getMasterSatuan(item.nama, item.satuan || 'Pcs')" type="text" readonly placeholder="Satuan dari Data Master" class="w-full p-1.5 bg-slate-100 font-semibold text-xs text-center border border-amber-300 rounded-md uppercase">
                            </div>
                        <div v-if="sparepartShowPrices" class="flex justify-end gap-4 pt-1 text-[10px] font-bold text-slate-600">
                            <span>Harga Satuan: Rp {{ formatRupiah(getMasterHarga(item.nama, item.harga)) }}</span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button @click="showSparepartMultiOutModal = false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase">Batal</button>
                <button @click="submitSparepartMultiOut" class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase shadow-sm">Proses Pengeluaran</button>
            </div>
        </div>
    </div>
    <!-- MODAL 3: INPUT MULTIPLE SISA PROJECT -->
    <div v-if="showSisaProjectMultiInModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 class="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
                    <i data-lucide="plus-square" class="w-5 h-5 text-emerald-600"></i>
                    Input Multiple Item Masuk - Gudang Sisa Project
                </h3>
                <button @click="showSisaProjectMultiInModal = false" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
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
                <button @click="showSisaProjectMultiInModal = false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase">Batal</button>
                <button @click="submitSisaProjectMultiIn" class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase shadow-sm">Simpan Barang Masuk</button>
            </div>
        </div>
    </div>
    <!-- MODAL 4: PENGELUARAN MULTIPLE SISA PROJECT -->
    <div v-if="showSisaProjectMultiOutModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 class="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
                    <i data-lucide="minus-square" class="w-5 h-5 text-amber-600"></i>
                    Pengeluaran Multiple Item - Gudang Sisa Project
                </h3>
                <button @click="showSisaProjectMultiOutModal = false" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>

            <div class="space-y-3 overflow-y-auto custom-scroll pr-1 flex-1">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Tanggal Transaksi / Tanggal Pengeluaran *</label>
                        <input v-model="formSisaProjectMultiOut.tanggal" @mousedown.stop @click.stop type="date" required class="w-full p-2.5 bg-amber-50 border-2 border-amber-500 rounded-xl font-extrabold text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-200">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nomor Purchase Request</label>
                        <input v-model="formSisaProjectMultiOut.nomorPR" @mousedown.stop @click.stop type="text" placeholder="Nomor PR (jika ada)" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nama Yang Menyerahkan *</label>
                        <input v-model="formSisaProjectMultiOut.penyerah" @mousedown.stop @click.stop type="text" placeholder="Nama yang menyerahkan barang" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Nama Penerima *</label>
                        <input v-model="formSisaProjectMultiOut.penerima" @mousedown.stop @click.stop type="text" placeholder="Nama penerima barang" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Keterangan *</label>
                        <input v-model="formSisaProjectMultiOut.keterangan" @mousedown.stop @click.stop type="text" placeholder="Keterangan pengeluaran" class="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800 outline-none uppercase focus:border-amber-500">
                    </div>
                </div>

                <div class="flex items-center justify-between pt-1">
                    <span class="text-[11px] text-slate-500 font-semibold">Daftar Barang Sisa Project:</span>
                    <button @click="addCustomItemToSisaProjectMultiOut" class="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1">
                        + Tambah Item Manual
                    </button>
                </div>

                <div class="space-y-2 border-t border-slate-100 pt-3">
                    <div v-for="(item, idx) in formSisaProjectMultiOut.selectedItems" :key="idx" class="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-2">
                        <div class="flex justify-between items-center">
                            <div class="relative flex-1 mr-2">
                                <input v-model="item.nama" @mousedown.stop @focus="openMasterDropdown('sisa-out-' + idx, item, $event)" @blur="scheduleCloseMasterDropdown('sisa-out-' + idx)" @input.stop="updateMasterDropdown('sisa-out-' + idx, item, $event); onSisaProjectMultiOutItemInput(item)" :data-master-dropdown-input="'sisa-out-' + idx" type="text" autocomplete="off" spellcheck="false" placeholder="Ketik untuk cari / pilih barang..." class="w-full font-bold text-xs uppercase bg-white p-1.5 border-2 border-amber-300 rounded-md">
                            </div>
                            <button @click="removeSisaProjectOutItem(idx)" class="text-rose-500 hover:text-rose-700 font-bold text-xs">&times; Hapus</button>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-5 gap-2">
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Stok Saat Ini</label>
                                <input :value="item.qty" type="number" readonly class="w-full p-1.5 bg-slate-100 font-bold text-xs text-center border border-amber-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Qty Keluar</label>
                                <input v-model.number="item.outQty" @mousedown.stop @click.stop type="number" min="1" :max="item.qty" class="w-full p-1.5 bg-white font-bold text-xs text-center border border-amber-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Satuan</label>
                                <input :value="getMasterSatuan(item.nama, item.satuan || 'Pcs')" type="text" readonly placeholder="Satuan dari Data Master" class="w-full p-1.5 bg-slate-100 font-semibold text-xs text-center border border-amber-300 rounded-md uppercase">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Harga Satuan (Rp)</label>
                                <input v-model.number="item.harga" @mousedown.stop @click.stop type="number" min="0" step="any" class="w-full p-1.5 bg-white font-bold text-xs text-right border border-amber-300 rounded-md">
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-500 uppercase block">Lokasi Rak</label>
                                <input :value="item.lokasi || '-'" type="text" readonly class="w-full p-1.5 bg-slate-100 font-semibold text-xs text-center border border-amber-300 rounded-md uppercase">
                            </div>
                        </div>
                        <div v-if="sisaProjectShowPrices" class="flex justify-end pt-1 text-[10px] font-bold text-slate-600">
                            <span>Harga Satuan: Rp {{ formatRupiah(getMasterHarga(item.nama, item.harga)) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button @click="showSisaProjectMultiOutModal = false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase">Batal</button>
                <button @click="submitSisaProjectMultiOut" class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase shadow-sm">Proses Pengeluaran</button>
            </div>
        </div>
    </div>
    <!-- MODAL PILIH TANGGAL UNTUK TRANSAKSI LANGSUNG (WAJIB) -->
    <div v-if="showTransactionDatePicker" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10050] flex items-center justify-center p-4" style="position:fixed !important; inset:0 !important;">
        <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5" style="position:relative; z-index:10051; max-height:calc(100dvh - 2rem); overflow-y:auto;">
            <div class="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <i data-lucide="calendar-days" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="font-bold text-slate-800 text-sm uppercase">{{ transactionDatePickerTitle }}</h3>
                    <p class="text-[10px] text-slate-500 mt-0.5">Tanggal ini yang akan dicatat sebagai tanggal barang masuk/keluar. Pilih sesuai tanggal transaksi sebenarnya.</p>
                </div>
            </div>
            <div>
                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Tanggal Transaksi *</label>
                <input id="transaction-date-picker-input" v-model="transactionDatePickerValue" type="date" required inputmode="none" autocomplete="off" class="w-full p-3 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
            </div>
            <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button @click="cancelTransactionDate" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase">Batal</button>
                <button @click="confirmTransactionDate" class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase shadow-sm">Lanjutkan</button>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
    import * as fmt from './lib/format';
    import AuthView from './components/AuthView.vue';
    import { getSupabaseClient as getSbClient } from './lib/supabase';
    // ================= SUPABASE CONFIG =================
    // Diambil dari file .env (lihat .env.example).
    // JANGAN masukkan service_role/secret key ke browser.
    window.SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
    window.SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

    const AGROFARM_EXCEL_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAYAAAAZUZThAAA2ZElEQVR4nO2993MdV5bn+Tn3Zj4DbwmAAAl6K4qkRImUWDLVVapqdbWJmYnojY2dP29iN2Zjp6One6taU06lkimJFEXvCRAkQBDem/cy896zP9x8DwBFUlR1zWwb3pAIPJOZ1x33Pd97IKqqvGwv28v21Gb+/+7Ay/ay/UtuLwXkZXvZntOiP9WNnvTT5E914/8FT6jdWZ75Ru3NF3nmUy/+ju8+rcn/gjn9t9++z2o8rUV/TAgiIqi6zW/gAd3UDQvIptf1p6giT3ukhPuEryiK3zIqye++0V9BZMMAhnc3GcT8ObXvqwBm0w013F7zz1QVi4KX/MuAKBhQNPyOpf5rrc9PDlCyfBgRoGydX5NPV+3JbsvnNZHwXjDG4DCbHqKIuvqrcA+pfy7yIlvA51NTe6bZct3T9kJYa93y+mnfFxH8UwTe8Jzr6z+1/sazRiEiW76vqmF/PbkGXupbSVFScaAeKwYRg8E8sz9Pa38SCyJP/HyR9iwZebEnfb9nKJq/eP71m/u0eRlVw8b67j2obFiaF1E8T95w0zUq4YFblIR8zxn499eeOT8a/vH1tXyxmfxnCMgm7f0Uyc/1dpB0kVxLSF37Prlf63rymRYtaMvax7XxbbYoyCZtVL9kQ8s+ryng0bAng/rZPJD8OfrsLbrFOHlUN+7xtMXYGObmz4L1EswWa/wi7Vnz9m0LsOUqvq8D8b08Dn1iPZ52/Qtu1Cfbd6kKzfWUzb+N1vai/V7PiV5Ukp7Wxa2vnj9xmz34mluz2UJu8fA3K+H6m0IQSh9cMFUkl7anbsCnDOu5I5WNSZXNb272xbbcQ7eOSQE8iMtF2UDuAj7bD5an/r7ZnXj+tMq3BGDLJbrJxZONLSV1V/Z5t97an/D9p1xQ+4ynbdoXEybZsgte8Ps1Zfjk5G423lL7rmwMRzf6u/myZ7XvbUG2TNJ3jUdqmnnTRsoH4PLBGXI/NUQdiGrQoiporskVDR5H/kBRELM53tj8gI0fftMzRWtxUd685kIarJKqbmyiTbMXNLnNhVHzeKT2W7AoJv/Eo6GPPjhDvibA9X5mmJqj5H0+kNqocqtR70CwI6gEuatFYSJblYuyZR3qMZV8G1YwtcnQTfbpCR8+d+PzsW34CVvjydqnTzT9bru35XGqKA5Tf8oTTm7Nzch/rXsq+U3yJdlylW6Z843+qG7sN1/fl/pMt7WmhP9oF6vW9/pe0ifnWjc08reswcZLqV3r89Hmm1TrQ6z9/mztVX+5+V/V3N482emNyQsyETaiR/H1ILp2+8133HQDqLtCooLiUBxOEoQ0n3QHxBtXKRg1W+dAfQAa8ud4v2Wpc2HaNL5aXFLv/xPSUevrFvW4cQenYV7CvD/H6j5Nocvmt2TDl3/C3m65X+3dJ8yh1JVsrmxq91Lqm2Uj4De5HtlsBXIPQjdZtyf6uDEFm9zIoGuCzhFF/VNigyfa9xIQ7ze2m9OggV3uamxomiDpJh+IMTX9sLUndf2voN7XJ82rB2twKFlNT8vGyCXfbVZz2c8tjBWLUdnYNAIeT1azTPlTpa418u9ohkdxhMnz+UwbkW8liXSzy6IgRHhVRBwiFYzPgBSjG0hKDqfgnQNxIBGeKMyAhHv6/J6utkNVEWNwuXgbEzZisKo167vJRm7WqLWXSoiDagpDBKe+NnJUXW7Nn3ClVDEqRCKYLTtOa8YMVU+mPlhN7/LNu/H92r+1zaj5TQyCJWxs6zUMrOYX1NbfhzVLRfES1swixD5cZ6Q2F1tWhk3LUrcOToPaq8XBNXdUVBCvGDF4F/pvzLdTgiLyx1kQJSyS0/B/iguvfQ3sNZTVUJAg/RiDGMknQ+u+oSjgPep92JwCmSgZjrW0wtLaCiurq3nwbIjjAs0NjTSUGyhhiP2GRhU0uCQETZzhSEjJBDIJAhnn7oXJN0LuMIW9Kga8JRJDhhLVnCF9YuDUBMWDuuD+yDrGLhHpEuoqeA+VtQyXOUrlMlEchcUwBaARaESlhJFaj/NF3vSozGVUJKtbWrMpePe1vku6dUEJ82ryMcZSzOHNDRMebJ3HoVR8VrewxoT5LIgl/rZh2oiLJCgR5xzrJGTi626jyYW41pmgcMKaGzEYlBghDhKPkQ23QiRYpYo61jVjHYe3AZqNVCh6oWgiYi9EYoIw6mYBDOviCNYhUyXDkxAUIKqoh0gtsRgiMUTeg3xbMGr9gedYEO/9luBsk2GvS/xadZ0LN69y/uplUpv74F4p25g3j73KqSPHiKWAz1JMVCSflSAg+SJ4UdSGgVV8ytj0BNeGbjM0NsL45GOWlpdJsxSNLA3lMl1Nrezs6+eVfYfYt2M3rY0tGAxGFOdSIjE4ddy7f5fPv/mK6eoyWQQYwajBZlrXhjVBVaCpqYn+3u0cHNzHQFcP5bgIGKyvGwEEweNxeLxxRJpixEBlhcrKDZLlu2TJPEniuHt/iuX1dfbv3kFba0wUN1FoGqDcdhApCt7HOG8Bj+CDnBuH+ojJ+Tm+vHyOG49H8IYQ/2QO8YIxcdDDLgACHo+YIATqw1oVxDDQ1cOP3n6P7tZ2TD5YVaXqMobGHvDZ+a+Yry6TiRIbi3GefTt28d6Zd2gtNiCZEBu7ZQ9o3V1SltN1fvX5x4yMP8AZyfNI+U9rcc4Fy59r7mKxSFtrK4N9/Rzec4CuhhZiIMoti+Yb+tH8JL+/eJ7hiUdgLZGJsZky2Lud0ydfZ6CjJ0ioSM0Ib2zqPABTAykpw2MPOHflEhOz06EfWciJ7Bvcy9mTp+lr78apJ9oEdDwJ+DzXgtRcCmNMzWvBq8er4vFMLUzz89/+Dz679DWJ9WhsEac0SsTjyXEG+rezu6MHEc2Db93wufMAJfUOb5TpxTm+vHyBLy9f4NaDIWaW51hPK1SSBLEGNYLLHI1xkZZSAwNdvZw6epJ3T59l/87dSFTEqMOI4PDcHrnHP3z8P3i8vkBiFSfBDSs4sMaQORdcQ2NwzhHHMW0NLRzYsYuzr53m7VNn2NbaTQkTNpgoqMOI4k2CaJXVZInZ8XGy+cdI9QbZyh2Mn8dKxPTICCuVCoNtB1mspGTaTLF5P25qBS1vZ1vvqzQ3dgdLJA6vDlWDV2VmYZ5fff4Jn968gGmIyXxGJAaLQZ1gJcJg8RqcUDEmuDsuKJ2SsRzqH+TIwSN0tLQiGvaUGmFhZYFfffpb/vE3v2TVpKRWMU4xScbhwf309G3nxN5DFGzpKRsiKBUVYbW6zu//8BmXbl/FFSJ87nJl3mGNRXzuURjBWkuxUKQQxXQ2tnDq6AnefeMMh/YcoDEqUpIIYwSvML+4wMeff8rl4duItaBC5JSe1nYqSZWfvPNn9Da15YCAYHPjKJs2d4pjcnGWX3/xCT//3a9ZWF3GA1ZBUsfpY6c4vPsgPW3d2FqQ/JQQ97kC8i1or4byiAF1VFyFu6PDXB66wbJUSSMh8wmqSsUbLg7d5PLdW3S91kqDRBj1dQTFO493SibBzI9OPOIXn/yaT85/waO5KVZ9greKWIMvmiAguau0LCkrlQWmHizyYGqS60N3+I8//UtOvXKSlmIZr44UxxoZ8+kqC1Sp4vEiWBUKKhgveENYQAWxgqZV5uaWGZ+f5N7YCI/nZ/irP/uQwY4eYp8HlpIieCJdJXXzXL/6Cb/55c8pZRVOHGqhvyslsktImlKSOdRkxDKBSkrqU6Ym7nH12gWml+GtH/wN7739IeWmFpxKjspZHIaKS1lJKqy5dQyQ2CCY4g0qimhEbOMQE4qg4kJ8YQxGoZokzK+tkuYulJMw9anPGJ+Z4Oubl5lJlqmWgv3CKJFx3Jkc5eubV9m3czcN5VKwnvkeqAXJCjgNccJiZYUVTaj4BG8NXsCJJ9KMSASxOYKpjqVKFfWeyYVZxmemuTMyzN/89GecOfYanaUmCnnGIskylqtrrGmGzxVebODh7GN++cVv2dbXy9uvnKQpKmAxwbETCTEeghMhwXH++iV+c+4zHi3P4qLglhaMhUrKcnWdapbWEdXnte8UkA2cfROqIjC7OMf5y18ztTKPK1sycThVrBjUwdTKAp9fOMfrB49SbmkP2roWKHlPamDNO+5PPeL/+cV/55NznzO7tkhWEFzBBLcjR7UcYSNjwJsQ3KlaJioLLN24wurqKmmS8oPXTtNYKpEpEFl8FAJFHxscYCXCp8FyYAXF4r0PFrJgcOpZTzKGpsf4+9/8gqZSI3/93gf0NLWBelQc6hKyZI6ZmRssPDrHwtxVJh/PsFrt5M1X+9m5LSIyIZZSKVBVwMRMLDkuXrvB0PUJmhvKLI53Mz3RwfadhzHFblRaEI1CjGEMFC1RZFCrqHgyCQhFsVjCO0jVI1jEBKsTAvKgccVniJEQ0+GJTIRHWV5f4sL1iww9HiErC6nxqAErgqphKa1w4cZV3n39DK3bG4klfmJP5IaUEC/6yOCKljRW0lwYDBbrCNCt1xzODqBHNfNQMMyna1y4fY3Me9pb2nlt36EQU4iG+EHAxZZEHNYooiGndHt0mN98+Xv6t3VzsH8XEGIzk4MhmXMkRrkzOsTHX37GyNQjKApOFO89ai0+NmjBBqX7AknP74xBagKiOQqS+YyKTxidGuPi7SskJiNRR6oOG0XgHVU8znmuDF1naHKMrta2oFEIwoGxOE2YWpzkF7/7iN+e+z0LlRXSguSbOqAtpCmkLlgukwdmccicOHXY2JJZy/Xhe/zdL35OW1MbJw8dxVtD4gJXzNgowLCaYbwimaKpR8XgTIhF1FpMbEm9Jy5YjPXMrEzxyVefcmDXHloPv0LZBOu35taZnrzL0sQV2prWePvNAb6+ts7Nh2OsZGu89fouBrubqUYxlcSzbBqYX0j5w6Uh7tyZYU9LA28f30lfr2d6+hLrWULvwOu0tJSoahHnBcHmat/naItgjEXU4FNPmjrUC1aDCxOCdoAMnKCpQuYxPqi0TB0JjsnFec5dvchcZRmaYrwNIIsQk6gjtoZ7I0NcuXWdPd39NBSiwAbTTUiiBEDEEhRWKg4nQhbgSHBKmnhMZsB5VMBagxYibFwgdUoiwR2/MnSHzy+cY7B3O3FrR3DRjMdbT6ZVJA5oZjXLchBIuHD1AnsHd9LZ2sa2xjacRtTiK2cM47Nj/NPvf8WF21dIbEpqIAXEGFIU9S4gqwbA8V2E9hdHsSQsmMOzuL7CN9ev8HByHCkG4mJIkPmA5QtEpYjZ5QX+cPlrju7aT6FYCKiNQuIzVqqrnL/0NR9/9glLlRXSCLJIsJFFEk/khZZSC709nTQ0lKlkGStra0zNzZG4gExI0QQLYQ23791laGiYo3sOEJVLOepiyFKHxsGyiVOa4xIdrW1EcREnihRi5pYXWVpbJs0cWpSwcWK48eAOF25dYf/gDnqaG3DZMuevfcE3X/09XeVF9u0q09/fiSkbNI64PzKNXBlBTh5hmSbWqTK1GnF9+BFDI48Z6GnjzPFD7OrrpUrGrdGrjH59jeOvLvPe2b/ARGXiqBTQKmfwGIzYEHtknqI3tDa1UWgpId5gQ/Y0d7NCwjPy0JDBnt6dtJSaMAhOAyp458Ewd0dHkGIUoOIaXCwEq+yV5fVlzn1znrPHT9HQFfpiqEHW+ePqcKvBO8VEFpPnJWIj9HS00WIaiFSwkSHNMiZXFlhOqogYnARXqJo5vrx0gbdOvE5Hcys1pNUIWBMEu0Yy9V7xFmaW5/ntH37P3v4dNB85SUtcgMzjUSpZlS8vX+Dzb86zVFkNXoE4MBbZRELNXIbL4ek/2sX6VvMe5z1eYHR6gvPXLrGWJWi5hKhglVoSATGGDGElqXLp5nXG35miqa8Rg2KMkGYZDyYf8fEXnzKxMENWNjiT4/QOilhO7DvEW8de48DO3ZTKJSppyvTCPFduXeeLC18zszYPXskqCY22xKuHjrFzxw6KcRz8XjGhOw5sbIJ74FIODu7lJ2+/T2drJ2ItmVHGZ6f45MvPufrgJlUyUu/Awvz6MndH7zI5P0FX8w7mFmf46g+f8Nnnn9PRljG11MGBPf10d/dw5lSJhvIoD4Yfcvn6BA3FEkoj90bmeXD/EbsHujj96j56t/UwuZpy+/44l4cmeTxVZWoxYufAYQ7sb8GLoJqCgLNRDl57fOLpbG3lJ+/8mMO7D1PQGFEfMsd5dl3zdSip0FZuoqejC6sGL46ltRXOX7vM9MoilC1KoMREYsB7xNrgx9uYOw+HuTU6TEd7JyYqU5DAQtBNpDuvIfK3PiiiKAsIQXOpzE/O/pBXdx6gpJYojljLEr6+fZ2Pz/+B6aUFImvJvCKx4dHsNA8ejXJ09z4ay2VsDq2HDEnwOFQkxBFeia1w6+EQv/z8E/q7+9jbVyTKgYNbQ3f59MI5Hs1O42ODNz7PpWieQ9OtyOyfSkBC3BDutFKpcOPeHe6OPoBCROKygFTkWYiQPPIkQBxZHk4+5qtL3zDYPUChEOO8o5KmXLt9k+tDt3ExAYYVIfaCTTxvHz/Ff/rRz3jtwCs0SIS1Fo0iKt5xZO9hejp6+cXvPmJiYYpdfQO8/9pbvHXiDQ7v2oc1ORlNwwRHNsJ5T2QMmiX0d/Vy9tgpBrb1od6QGM+qS4nV8Hh2nLGFKSgYMu8wsTI1M8H6yhLiK6wsjeKrk0S2wvjsEgtXV5mcS3jl0AA7Bto5c3SQTltkZmad+cUFVCKayjFHd/Zx+FAPLe1tDE3McPHeJPcezrEwt0wUW5AZVpbvYmQQJQNTQSXBSUDZfOYxGJobWzhx5ARnjrxJAzFGwgYICFLIQEUixCoBeXMpgpI6x/DDES7eukEWG1I8YsDkc+Ry1FSswXvPwuoyX16+wJGDRyjHRazIlpMC9X2hEGHxWYgvjRiKRLx28Bg/OHySZltCvWddPAM7dzG9sMBnF8+x7l1Aw6xltVplcm6WJElobmhAfHArxYO1gpecsiM5nd5A6hznr37D/p27aHqvma7mViZnZ/j1Hz7h+tAdEvE4K6QaYiwlH2uO5plnJAafKiBea4yiDe0AwTuTPK9hAOOV1HgmFqe5cPMKS5UKlGO8zxBMwKRdDnsYcKIYUZary3x5+St+/NZZmtuKiIelyhKXb19ldnUJWkqoGNR5Yi8c2r6bv/3xX3P6yAmaTAGyLM+EW4wIu/r6+dkHH1BuLjE+PcGRPQd44/BxuprbKUiEqpKqJzMgcYx4g+AwITInjgoIFusN6jJKxuJtxODADppLTXg/jpoQLBc8+GqKcWtoOgurDzkxWKSkfVwcWmdiKeXKyAwTS2scX+jhtf0DHH9lL5OPF7h8bYj1pMqenX3s3tGCLaRcG37Il3emGJ5YobqW0t1S4NV9PRw/0EFzYQq3PoUtFUE8LkrRnAdgxBAZw9r6KreGb2KNIfYRUe08ieSTriGZ1tXUwu7+HSEpCiyuLHP+4jc8mhrHliOqLiGWEC+6JMMYC2IwkSFNHOuacPXWNR48ekDHvkaKUsR5jzUGfA2ht4ixeA2JRxXNE+5KbPNknBdULZEIXR3b6OzoIIoMZGmIaYySZBUqaYVEQ+Rp1BKOGoU9GZmgrBAw1pJlnkKxwOTqIv/01Sf07Bjg5Ksn+OzqeT698CVza4v4gpCq4qMILw7xQWN64/A2CFnI5m/k454pINQ+lw35yPMtG8LiPAKsu5S7o/e5PnQbIgsmDF5UicXQ3t7C3MI8KUFkvYYDKyPjD7k+dIue410UTIGZxTmGxx4ixRhvA5IUITSYAu+feouTe4/SbItEXkmcZ3jsARPzs/jIUiEjtZ7W9laKTWUKhQK3h+8wrBGaepqbmugd3IEDMu9w3mOs1GHqRJTEKKkxWCkEGNQrE1MzVCpVjDUkPsNIROoFa2MKxuDWlrDrc+zqiOhsHKCzVfhmaIpbj5d5ODFHtVrBOccbB/bS19/Nw/HHFNcT+vq3QSnm8t17fHHjASNTKxgs+/vaeG1fD8f39tLeUCSqLFBZW6Rc3J6DIi6ACj5PPhjD3PoS//C7j/jswjkiibDqsBI2jTExmnkKKpw69Ar/x3/6W9oamkl9xuOZKa7cukmmGb5GVvQQS0xzayuVapWlZB2NIjIUa+DxzCQXrlxk/8AuGhsKwYXO/w+uidTzYRgbEEb1RHFUz/4jIffiVZlfmmd6dibEFSjWCOoyImsol4pYa/MUgsl/hht4n+WWLrhE3kaBwlIw3J4Y5Ref/5aHC5N8ff4cYwuTOYgTEFevICpECCIepzViVJCIAPv4LTmUpwrI05ps+sWL4o1han6Bb25fZ3x+BhcbUpcFnNoLO7p6OHvmDL//4nMeTD1GSoHWkKLMrC3xh8vfcGzfMTqb2plfXmR+dQkig1ePeI91QmdbC8cOHKKpUKKAwWvG0uoK//2XH3Hu9lVMQ5GKq+KNQBSWQRNPhCGSCFdJ2L6th//9P/9nvAlkNO89WCFzGSYWRqbH+eLGRUY6JihSQNUzPjvDrz77lOmFOTCCOCWKDE4sbe3dlBvamJ6eYuzxKI3FNVoaDSf29dLR3kLX0BTXRqaZnlviy4u3sd5w7MAeooYYcY7VTLk3PMnnlx/wYGaVlsYih3f28OqePg4PNNNQEFZXlpmff0TaMMG+9qNhUTUizombKYqKsmY8C7OPeTg1QWQKeJ8RRwWSJAh0jCFOlabGRlbTKs2mheX1da7cvcWDmcdQKpD4DGstPstoaWjjz9//gNv37nLuykVq7OIMWEornLt2mffOvENHqZlY6icrAlyfW4tatrzG762mKdfu3MKuZZRtAbXCalrhm3s3uXHvFkmWohpcRqNKQ7HEtq5uGorFHEJWoijKKS2Bt2ExGKf4JCGOy3m+RXACX16/yNXhW6wur5BGQfBEAljh0xQTBxjb5+6k98Ed3aDfPL9Fkg+2RvutDXQzS1KtZd2njEyOc+nWddIowK3eOSKESOHonv28/+ZZ5qfnePT4MV4MiXcgSoJyeeg2dx495NU9DaxVqyTqyXLFbvJgrKWpibbWNkQCGdKJsuSq3Hg0wtXx+2hs8DXereRBY05aFASTwuzyAh9WlnF5htnk1BNFIbLcGR1m8aMVSlERoxarsLCyxNTCLImm+NgTRxHGeVrKLezbe4CGjm5uX7zGx+eu09Ve4ej+VnpaShzs66SzuYme1jLXhh5xf3yeSzfvEjU1seiFqkQ8nF7g2tXbzM4ssaO3jRP7t3NssJue9gZEPePzC9wZXmZyZpoT9lX2HCoQ0UCsJYwnxH7WkqkGV7EQY7EYNXgREhUkLoMYXOIpRSbEbKok3jG5MMfXVy8xv75K1hComsaEDbdzWx/vnz5La0MzN27dpiopcRxRTVKILcPjY1y5czNAvsVCfV8E0mHOiJCcsJrHu0uVVT76/Hd8FX8dotI8QflwZpKlZB1biImcoyAGn6b09m9j5/Z+yoVSXfhCisFgbBAPUkdDXKRcLrK6GmIzZw2pdyxXElbWV7EiIeELqPOUikU6W1pYq6yyVlnDGIONbK44/TPE4RkWRCA35ZtNSIAAAyPWMb82z+U717g/8RAKQiIOsUCmdLa0c+roSfo6tnHqxGt8eflrHleXMFEUgqoMxudmuXjjCnt3DAbiYh4seQkDMgSUInUZKkLqMzDBvyUSys1NVIwH4zF4RD2Zd4gYxBZwmaPgBVuM0MznVHKPRfEeiCKcEZara6w+Gg64ufcBLo0KxIUCKiHXUNAIXXPs2bGDYwdeoamphZXMcXtqgQsj93kw08rh7d0cHuygs6uV149sp7+zxLW7D7n3aJp7Q3epIBiKVIZHydaWeONIHwcP7mB3bwuxgbnlCsMPp7k3OsXw2Bpp2sqOA1WQAl4t6i2oyd0VJcoPMkTeIN7ivcHEhlQ91gYF47xH1eScLKgkVe48HObayD18FFxOjQxOleZyA68dO8FAZy/+gGdg+wB3H43gEkeI4A3raYVvrl7i7Kuv01JsRHI0K7CfXU5JF4zPaUQmMBTuT4wyplGda5e5DCnERAWL9ymRNUiaUvBw8tAx+rf1ITXOtUDmMzLjQxwshtQldGzr4I2jJ7h9/Rb3Jx6ROU+mGbZQCMrc+QBMeEVSzyuHDrC9fzuXrl5kdHkNE1sMloQ0V7FB1X5XqB7l8PZGU60vSu11xac8mnnMhasXWa6sIo1FauxTsZbtAwPs3rsXW4jp3znAwGA/D6/PERcacjq3Y329wqXrV3nnzdM0NTdTjovI2nJwaXKu1/zSIpMz01T69yJiciYquGpCsrJGFgnOesBh47AYXj14gxoQ74lLReK4kDNLcxq9BEpFpp44Mlgb6DIB4TR4I1S9w1gQZ/BrGT1N3bz75jscGNxDOTL0drYxMNDLzeExrt2fYuzxAiPT7Rza18/+/k4GB7ro6ojYMdbK3Ykl7o7Pk/kCfZ3tnDy5h/27O2lsa2S9us7tsUUuD81w7+Ec8wtrFOMWdmzvo2/7dsQQMufq8cZgbETqMyxgVTAVTwGLUxOUSGTRNE8oZoFGbjGoCHMrC3x15RumluahHHBGlbCJ2ltbObj/IAUb093ewZGDh7n7cASJBJMrMMVze+gO9x7eZ3vbNohKxLnVd3lRDWNqfKjA6cIKPgJvozyYF9RbojgmyxJEM0wm+KrjlX1HePfUGTqaW3KeXh4fmMCe8CJEJsD1DaUGTr92iu7GdmZ//U+srQYFnGmgvsQElq9knm0tnbz3xls0Njdx784djDdYsbjM4/LkakB49cnd/3QL4mucJDZxrwBVjxelkla5O3Kf4dEHmDggRQYCjR3DSnWdTy+ep1wqsry+zFqa5PBkSMbUKNfDow+4ce8Ohw8epquljYm5aXwUFi0znrm1Zb68cpFDew6xvb0DQSnYiP07BlnPUqri0VhYqi4ztTRD1aXYKA4wpRGcdzQ3NdNQKBNv0mwqghpBXZiSLMsC+5cUomIQNOcpaAiK+zp6+cnpH/Ljt9+lt7WVgi6wZ3s7Pz59km1tVe49HGJyap5v7k4yNrvKxGAXJ/b3sb23xNFDA3T0Ziwt32SpAsdfGeTw9kYin/JotsKlexNcHJrk4cwyqVW2dzdzoH8Px4++weH9u4AELynOeBL1xKJYY9AkoxgXObhvD4NdOzE+IrOOxOTZag82g7JaDu/dj4ki7j8Y4crdW7gonC0REcg8ViGrJly5cZWJiQmSLGVxcT4EzlJj7gYvYnp+hnMXv+bovkP0tRSI1NZh1/pRA9nIXbjM15EtYwzqHZiQaVdRIgIEfezgIf7DBz/jld37KZuYglg0Z25InlD2PudUqEKS0WRLvHvqbW7dHWLh1lUSAxVxIVdC8EQaxPKD197g9Csnefh4DJekQQSskPna+ZpaSuK721OD9FqRhRrnZmpulnOXv2F+dRlTtEEK8423nla5++A+I2PjIbljlJVslSjONy6AegwRa0mVc1cucWD/AQ7v28/tkXuoGFJRMitUvOfLSxfYtX2QPz/7Ll1NLbQ2t/CzD37KmytvkfgAQZ67eZFf/eF3pLXSQxJ8YuuUwW19tBXKlMRict6QmhBdlUyEdY7YRIBHPGQuuByIRTXFp44j+w/z0/c+YHfvDkquQuwrtJeFYzu76S4OcrBXuDnyiNujM0zPrvPF3AhzsyucenUHB/Z20drcSGO5ROKUxrYy69Zw/8Es569PcWV4kpUso7OzzK6BJl7f1c+u7l10dnfS1lxANA2EegsuEoyEw2FWDN2t7fzVBz/l9P7XabBlrEBiNE+wBvpHbCxxsciKS7h4+zpjM1P4gkWt4JNqyJNgWZib5+9/+QuwgQyapvnxNA3BsTU2BOyace32DR5OjNHZ1BbySbpx9DgQKPITftaAC/GCkZjUeRKfJ+QkwNV4R0OxxI/ffZ8fvPYmHcXmQCDNnax6cYzctcm8w4ohRiiqsGdgkB+efZeRqQkeTD8mLoQzKAUxUEnYv2sP7755hp3behkbGQlWTXNiqjWBNexrpyFfUEA2qo4Eq1EDwbx41rIq98YfcO3uDXwO3TqX5YP1qFeqOCpawTuHjSypV+KiwWcpquEgTObBiuH2yD3Gpx5z/PhxPvnyc2bTNVIjpOoQI0wuzvH//vYjXFbl5MEjDG7vZ3DXLnqzhOmleYYnRllYmCdzGTaOyLxinCdWodEWObJrL22NDYEHpLkLlmOOPnMMdPRw8tARXJJx+eYNJpYXyGzInKsGHtTaygqrq4tk2Toa0HlKhTKNVugrO3r2NLOzb5A9A01cuzvD6OgCwyMzVNZSNC7Ssa2dSias+YxFb1icq/DxhSFGHi9iShGHexs5tq+VY7u62dFYIvIp1qQUoigcDcAhmiHi8c7lB30gsjF9XT3s6O6hTEyEyeuR5S6xBrLfOo6hB2Ncun6FtayCjyJCNY+Q8FULCZ6KqwIRLg2HjcWGZFzwsBwOKMSW8anHXL5+mQM7dlMq2/BE9ah3+ekYUBNcHSvCqVdepb+9jwejo1y9eytP2AkptZyNsLKySpokmKISi8XlcahxinhBNIANuAyjSqxCQQ1lE3Pm+GvcHL7HzCe/Zs2tU7QWqo725lbeOnWaQ7v2USIiNhYroCYc6lNj8TlJ0eTg0AvVxaqdFqtrBfF4DKn3TCzOcP7GJR4tTONLMRkeTFRPIFqbn5YTCUQ7GxJ6mqXY3P8XG1ApL8r00iwXrl/irz/4C14//hq/+fJTrLXhnIUqmYWhyVH+r5//PV9fuciBPfvobGklqVZ5OPmIGyN3GX48RmqzvB8QOSXKlFf3H+XEoWM0NTaRekcmQiaC8yGAdM5zePc+/ref/UfKUYl/+B8f8csvP2ZyfS4gWAISey7d/oZ/+l0L7Y1l9vYMENsS1rbQ0tKDX7akbo6eFkfHoUb29BYZut/OndvzPHy0xPmLo+w+VmAuLbJExP2ZKhMjw0zNrjE40ML+Pd0cGWxgsN3TbNaIsnWglZaWdkrFBnzAqLAoER5j8lJHCtbEmPwzS57squtBQSW4N6vVNW7cu8Xww/vYOEZF8JkS2QJ4R+YhigvhWK/zmCic55A8fA2HkQxeApCxnlS4cOkC75w6Q0t/kUhsfh4jZ8liwQiqnoZiiR+dfZczR1/n/vAI/+W//Veu3rtNNfNIZBArLFeq/Pzjj+lu7uKnp98jLrdQOwhdr23gwaWOyFgsEeICKyz2Qm9DGx+c/gFDQ0Ncun8DvMeo5bWjJzj7xhm6WzoCpKsBIk9F64e6QiGGkBup7f3nCcmGi1X7Tr4gDiVRx2gO7a7ZEJipEYo2wqQZPnHEYvKKf+EMt19LKESBSOe8QhQQERcbMlW8ChdvXuf9t9/lnbPvMPTwIfcmx0jzRJARgzOex0uzPL46y5c3r1AsFCHLqKZVnFVsIcaaCHUgGUQVT19bFx+cfY8923dSkAhjbDhklePlkQRos6XQQGfcSG9HD3/5zo9YXlrg40tfsJAtkRWCPl6urvG7C5/R29VL64/+imJrEzZqo7F1F+vLfWSLQ0TpAkUrtHeWGWzrYn9fB9eH5xhZWOb+xCiT1Spracb9sRHKfpUzr+/g6J42dnaX6CyuIdVFCqkj0y6i5h00tO7ARK14iojacHTVK5Gx+bkVH/IBarC5EEl+ptv7vBSSCVZ/cmGW81cusri+ipaiAOBnHjFKZCJcNcVkDi+O2vl3nMNGAnjUmkAGNULFp0RRzMjYKFdv32RgWx+NheKGVfbkB7ZAnVI0MV1N7bQXmug6cIzl9xeYm5nn4fwURBEVl2EKBUampvjH3/2Wro4eTh8+TkNUQlTxJk87ODA20OSdV1LAS7AwJSwndh3kJ6fOMjM9yaPJKXbv3MV7p95id+8OYrW5W21wYsDExLaIdw6XVkM9g9xr8urDGfXnJQo3Byxew0UpsLS+yo2hu4xOTxKVSiFrqoo4pYihu6uLvQODGJdLv7UkWYqxFudSxibHGZuewNngS0oU9N307AxXr97gwx/9OX/z4V/zX//x73k4MRoy3nkSiEIhFG8wwpJL0UiJCgWMkUA9cC5olhS6G1v58Ad/xtnjb9JSaCBVRVzgCUWBDor1BjKIUig5Q6O3HO3fy4dn3+fR1COujNyk6gKtpVCKWaqs86s/fEp3+wA/efM03Q0NxIUuSp0HqbpHuDWlwBJRMouyxs7+bpq7++iZ7eHS2CT+wQw+S+lu6uTtA68w2BbRFlWQZAFZraCmkVSKaHE/hfYT2IY9KA1ACSMxRoOWrgEoBgGnGJ+XMfBSY/TVD2g6PCtJhTv3h7k+dBfikBnHOQomEArbm5vYs2cnBWu3VAUBcMYxtTDHg6lxVpIqWWQolIr4BFarFS5cucyZk6codXSjBEVqjCH1ilgbXEEssTOU1VI2BX548m3GHk3y3z7+iMV0nWrmcZGhEBe5+WCEf/zdb2htauPQzr0UbYwai5iISCzWGLx3ZD4IThY0OFaElrjMO6+d5s7QPdKlr/nBiTO8fuQkbYVGYh94WCJBlVgnmGo4Emw1B2+AFynOV6/NWxcQFKegooxNPObilStUKylSCgUNYmNhPaGztY2//fBveOv4qQA75gUU6ponq3Dx+hX+y9/930yvLFEqRMGiZA4RuH71Ou+ffpezr58hraZ88unH3Bu+x2pWxRYivPhAV0EwseBymNZoyIEYb4jU0NXSzl++9wF/9aMP6enowmh+TsJ5YgwlE5PVcHKx2BxFiYmwCCePnORHE+NMz83xYG6cYrEIqmROuT82xi9+/RG9zc2cOX6EZttAqWkPWWWS5WqKJkNEVDFWmVue5sF0xsJaE6aiFB2oEzoammktl1mfnyarzCDZKs5DuaWXUusgLR2v0th1FI26SV1EZgRPhEoB9RH4cErQEnxzk1dvEdWcPJ2X0zRC4jNmFhf4+uplZpcWMAXBEmKxWKHBlvjxm+/yFz/8gIZCCatah3RRJZGU26P3+T//8e+49fA+3tg8wAlB+d2hu9wbuU97S2ugizulQBRyUNaCRBQkxEZFLAW1dDS08ufv/Zj7UxN8+s2XlCXCmIgszUhRzl+5RG97Fy1Nzezo7iHxGWhwIb0L4EkhKiImCpw9GyEYLLCrd4APzrxDV0snZ14/w/a2bkIaFTINhTditcRpqDpmI0FtcBFroelGEcLvoJqEGlI56c0oaaXC6MgDHt4boegtvuIxJlR6KmnMsV0Hef+1t9jV2RdODGgEUst0CykJ5ajE5UvX+N35LwKlWkCzUCxsbPgBQzduseu99/nwnR8y0NHBrz7+Ndfu3WFhfRU0IU0zjDdgg9n1WUYslghDc6GR/f27eeeNt/jhW+/S295FhIUsVFUp2hhXSaCaEblwXoFqQHu0nuUxlEyZ906/x+PJaf7p898wv7CARynGJcTAnXu3+M2nH9PT2crRwe0Uou20tB4lVqUyl5BWLGuVZR5PTjI56VhaW8KlZfZta2axkjA7/pBr6xOUszWajKe1sUBLcyfF8m5aOo/R0nYIE3fjTAPeF/AYnIcs0UBzrobNKxkYZ7CaV/GSUCmmBqmoelyW8ejxONeuXcOkLi9uoMHdTKrs3LWTD956j8N9uynaAkJe1JlcQHxCR0MrYw/GGL57n/UkRSKL94pLPTOT03z11Tle2X8I4yFKPVE1oxwbrPG4dQ9RRkEtRkLuQREGt23nr3/050zPzXBn+DbJWhIKHxlhdX2JX/3212xrbePDH/4YrJCmCZI6Im/ACNUkQ1wIrJGaNfUUxHD65Osce+U4hbhEMfgUeRrCYDKFVIkzJY4EnziS9SqaBhqSbLYMz7IgtV9q3wvn9QyrSYpWU/paO+iwHSQm+LiaZvQ0t/GTN37ArrYeyt6ywd4X0vyQlkHobWrnx2+9w+rSCgvLS9g4Aq8UPEHzrKwTZ0qpUOSt46fY2dvHpRvXuHj9Kg8mx5ldWqCSVDEmLyxjPO2NzfR2dvPK/kOcOfEG+3ftoRyVgz3wUIgiqi6ju62T/f276FxbRiKD8YrNPIM92ykXYlAXBF6gr6WDn5x9n6S6zu07t0mzDFuI8S7DVxLmZueZnJpn3/Y9RFE3tqQ0tJeJbBNL87dZX7xDQ3PEwQYh04hKFpGpZd17tLJOyWcUTZnmphY6t22jqaWfpqY9NHUeIyruwPt2vJZQGyPe0lZq5PDATtbWFyE2qPdYp+zt3UFjVAzUHHJAqJ7PDQREXa/SXW6i2LcTMRKO/gKNcZH33nybV3bsoUkijObnuX3YTKoeSaGn2MJ7r77J8O0hHsxM4KJQuqnoBZN4JPHYDBqiIvt37KaaVElybqE0O7Z3bqO9oQVLIC1ahKJYXj94lKUPfsZHv7bMzM5ionBc2BpDsrzG1Og4y0tLNJab2LtzNy7NiG0QtCRJ2Lutn6ZiA9R2Wl6oojEuUiiUUA0H4gIY47DW0N7Uyv6+AeLMEZeLZD7DVRN29fXTWG6oI7fPa6L532CrFVdTH+o9VSoVHs9O8Wh2msxAmuc9LEJHsZEd/b20NzRjfUCwagLiCUwF9Z5KlrCSVbk/Psba+hpqDKJKKS/N2d3RyfZtvUhsUc3weBLveDw9ycTsDLPz88wvLJBUK6BCe0sLvV3b2L6th4GeXoq2AKpEJgYTNF1MoDrPry9xb2yEqnehRE7mMN6zs6+Xvo4uSoUCRmK8MVSdJ8ExPjPO3Pw869UKXgO9wxC09vaePra1b6McCZFZBb8AborK2igrCzeprI/h0kkyVyFLE5LU4aylIWqgKCVsXCYutuJLjZRa9tDcfBiRPkTaEG3Ei6UiFusi1qurjDweYWFpCReF2jbWKY3lRvYPDNLe0BzyUDky4/LjxQ6YnpthZOwB3ioWixOhkqU0lcoM9PbQ09ZJUXJ3xYfkms1zG3iHGljNEh5MPmJqcZ6KOsQaosDyoa2xmT39OxFrGB0fY3phjkTCacJIoKlU5sDOPbQ2tAQ02AUXJjWwklUYHXvI0spK4PwJ4Bw4T2tTM9u39+PjiIeTj1hZXKxBrGTO0d7aSn9vP83lJspYrJi8EowjzVnAJqD1wRsywkJllfuPHrKwvIDEAUFT5+loaWegZztNpQaKaoICfoaLVReQWtJdvUfVBSZsTkTLahSFnNAYa57AElOvoVtPwOeQsfiQ10jV14vMqQSNYmpIIrm5NIISzruT87MClVqpoY7k37USKu1ZAmwbRaFKoVfNczMhpZvgyfICaSY/abdh6xQrAhIKsWX52WmXQ821k6yGvBJLjtEZiTCiGK0iVDGsAYtk6SOy9cek1Uck1SVcVkFdIGOKi4ikiUKphWJTB6axAylsR+gGmsDHRDbUDKuqxWpQIl7SkOAioC02Vz5xTsFBJC8ZlLsU+Rp4DU5uOB0UMtheanBwOFZgMXWek5FahUrN+VyhnpWK4qTGJCYoIvK5V8IpPzxOwv4QQq7GKhgxxBLo6zU3JvUOJ7XDXSEfYhRMjZgooGJICFC1Ia+kaPL9RC1HYynkheO8BnRPjQ2AgebVMDXkZVL1edk4n+eLwiknk/+dEINQlEBofa4F2fyG5shJPXiv0w6o0wtEQvW+Wl3WJ6Vvc8Xx2s9MtzIoRTd4+OGPrwRgYKM7Ww1g7bu1ZjQcEHoajq0assv+ies3cgYbz609ry6Qz2oKVmpFrDMImSKgguoqsAa6groE71K8DxbRmhLWlBFTRCOLUsBLGShhaYbNyapNBQjCGLKt/SV3NZ+B3W+hCeUzqFvmbAPNr9U723yfzevuvc+LYG+6npx5XftOfqKxxt+zBD7U5vkFs7GnCCCQ11p94FxBkp+cfHINdKOkwpMnAF/krxLUSsoG1vfWta0VP49rQvyM9i0BAbZOUi3CrwlIrXOb2L/PE5D6Pev53prT7DdSXJsTlfXRba5AXjMhm56T86ufNVH+SQ9z02TXnrlFkL/LI9XciRRFpLaR8nJEPph6bJK/lwV9J4AaQoVXC4SkXV2DSl5tsnZ/CSHhxtz5TXNH3ZrV+v+tLj65lJvWbGMMG999UtA21x6uVUN/4vInbq81KKj++eZyUTUBqd2vdr5jczObxvMt1bipv0/280UERKHOLXuy1a63zxWPZwjIlods/njLbD1bQL513VOvd5ve3vzXRfLJ9lBz6Tai0W8L4jP7/ZT3njcV3x2ubWBf4ZXWN1H9bUkJTpFns7jXx6fFcFoOyf/b2PChPWnqnzy38OT3v6vH324vcvWT1n/L9VvmfOufxQtxxZMCvDGm77rfUzT1M577Yu271/S75+M7izY8s2N/RIe3XPGk1cl/6qbix2wq7vzUv2v4J2zfbzQCGuImEV+XX9Ui1NlReZnV+iHuPC6oC0bOafqf2L7/CuXX5WujT1mjreKhW/UDT3f9nrzvMz//9gUv0t3/qe07LcjL9vS2WctuHN98/lR+3z//9S+//fMs3L+G9if7M9D/3trz3Mpv/11A+dZ3nnWPl+1fVnspIP/Mtvnv/X3b/+apr1+2fz3tpYD8ke3bnumLISsv27+u9lJA/lntSR98I8b49yErL1ad8F9z+7c/wpftZftntJcW5I9swUL8EVD3vw/T8m+mvRSQP7r924M0X7Zvt5cu1sv2sj2n/X+MgTOS3DiCbwAAAABJRU5ErkJggg==';

    const INVENTORY_BUILD = 'PLANNING_V5_20260916';
    window.INVENTORY_BUILD = INVENTORY_BUILD;
    import { markRaw, toRaw } from 'vue';
    export default {
        components: { AuthView },
        data() {
            return {
                activeTab: 'dashboard',
                stockHistoryReconciliationVersion: 2,
                activeItem: {},
                bastData: { noBPB: '', date: '', printDate: '', supplier: '', alamat: '', kodeSupplier: '', kodeDept: '', noPO: '', noSJ: '', nomorPR: '', nama: '', qtyReceived: 0, satuan: '', hasilAnalisa: '', createdBy: '', approvedBy: '', verifiedBy: '' },
                showPrices: true,
                sparepartShowPrices: true,
                sisaProjectShowPrices: true,
                purchaseRequestShowPrices: true,
                showPurchaseReceiptModal: false,
                purchaseReceiptDate: '',
                purchaseReceiptPO: '',
                purchaseReceiptSupplier: '',
                purchaseReceiptItems: [],
                showPlanningPrices: true,
                dashFilterDateStart: new Date().toISOString().slice(0, 10),
                dashFilterDateEnd: new Date().toISOString().slice(0, 10),
                dashSearchBarang: '',
                searchMaster: '',
                masterSort: 'nama_asc',
                masterAutocompleteQuery: '',
                masterDropdownKey: '',
                masterDropdownItem: null,
                masterDropdownStyle: { left: '20px', top: '100px', width: '360px', maxHeight: '300px' },
                activeSparepartOutDropdown: null,
                sparepartOutDropdownQuery: '',
                sparepartOutDropdownStyle: { left: '20px', top: '100px', width: '360px', maxHeight: '300px', zIndex: 2147483647, position: 'fixed', pointerEvents: 'auto' },
                masterPage: 1,
                masterPageSize: 20,
                formMasterManual: { kode: '', nama: '', harga: 0, minStock: 0, currentStock: 0, stockAwal: 0, tanggal: new Date().toISOString().slice(0,10), leadTime: 0, avgDailyUsage: 0, satuan: 'Pcs', lokasi: '' },
                showMasterEditModal: false,
                editingMaster: null,
                showMonitoringInputModal: false,
                monFilterDateStart: '',
                monFilterDateEnd: '',
                monFilterStatus: '',
                monFilterBarang: '',
                monFilterProject: '',
                monSort: 'priority_desc',
                formOrderMulti: { tanggal: '', nomorPR: '', nomorPO: '', supplier: '', pemesan: '', prioritas: '', keperluan: '', itemsToProcess: [] },
                showSparepartMultiOutModal: false,
                showBarcodeScanner: false,
                barcodeScanInput: '',
                barcodeScanWarehouse: 'Sparepart',
                barcodeScanMessage: '',
                barcodeScanSuccess: false,
                barcodeScannerInstance: null,
                sparepartOutSearchQuery: '',
                spLogDateStart: this.getISODateOnly(),
                spLogDateEnd: this.getISODateOnly(),
                spLogHargaMin: '',
                spLogHargaMax: '',
                spLogBarang: '',
                spLogKeperluan: '',
                formSparepartMultiOut: { user: '', tanggal: '', nomorPR: '', penerima: '', keperluan: '', selectedItems: [] },
                showSisaProjectMultiInModal: false,
                showSisaProjectMultiOutModal: false,
                sisaProjectOutSearchQuery: '',
                spjLogDateStart: this.getISODateOnly(),
                spjLogDateEnd: this.getISODateOnly(),
                spjLogHargaMin: '',
                spjLogHargaMax: '',
                spjLogBarang: '',
                spjLogKeperluan: '',
                sparepartLogInPage: 1,
                sparepartLogOutPage: 1,
                sisaProjectLogInPage: 1,
                sisaProjectLogOutPage: 1,
                dashboardSparepartInPage: 1,
                dashboardSparepartOutPage: 1,
                dashboardSisaProjectInPage: 1,
                dashboardSisaProjectOutPage: 1,
                dashboardPageSize: 5,
                logPageSize: 5,
                formSisaProjectMultiIn: { supplier: '', nomorPR: '', penyerah: '', penerima: '', keperluan: '', tanggal: '', itemsToProcess: [] },
                formSisaProjectMultiOut: { user: '', tanggal: '', nomorPR: '', penyerah: '', penerima: '', keterangan: '', selectedItems: [] },
                showApprovalFormModal: false,
                approvalWarehouseTab: 'Sparepart',
                approvalMovementTab: 'IN',
                approvalStatusFilter: 'all',
                approvalPage: 1,
                purchaseRequestPage: 1,
                purchaseRequestPageSize: 20,
                purchaseRequestHistoryPage: 1,
                purchaseRequestHistoryPageSize: 10,
                showSingleOutModal: false,
                singleOutForm: { item: null, tanggal: '', gudang: '', jenis: 'Pengeluaran / OUTBOUND', nama: '', qty: 1, harga: 0, satuan: 'Pcs', supplier: '', pengambil: '', penerima: '', keperluan: '' },
                approvalForm: { log: null, tanggal: '', nomorPR: '', gudang: '', jenis: '', nama: '', qty: 0, harga: 0, satuan: '', supplier: '', pengambil: '', penerima: '', keperluan: '' },
                showTransactionDatePicker: false,
                transactionDatePickerTitle: 'Pilih Tanggal Transaksi',
                transactionDatePickerValue: '',
                transactionDatePickerResolve: null,
                masterCatalog: [],
                masterApprovalRequests: [],
                selectedMasterItems: [],
                selectAllMaster: false,
                monitoringItems: [],
                monitoringHistory: [],
                spareparts: [],
                sisaProjects: [],
                logs: [],
                planningRequests: [],
                planningUsages: [],
                planningStockFilter: 'all',
                planningDateStart: '',
                planningDateEnd: '',
                planningWarehouseFilter: '',
                planningSearch: '',
                planningSearchInput: '',
                // Optimasi Planning untuk dataset besar: hanya sebagian kecil row/options dirender ke DOM.
                planningRequestPage: 1,
                planningRequestPageSize: 50,
                planningUsagePage: 1,
                planningUsagePageSize: 30,
                planningAutocompleteQuery: '',
                planningAutocompleteResults: [],
                planningUsedStockCache: new Map(),
                planningUsedStockCacheKey: '',
                planningAutocompleteStatus: '',
                planningAutocompleteToken: 0,
                planningUiRevision: 0,
                masterDropdownField: '',
                planningCacheReady: false,
                planningCacheBuilding: false,
                planningRuntime: markRaw({
                    stockSparepart: new Map(),
                    stockSisaProject: new Map(),
                    sparepartCount: 0,
                    sisaProjectCount: 0
                }),
                planningViewReady: false,
                planningOpenToken: 0,
                planningError: '',
                // Pagination gudang agar maksimal 20 barang dirender per halaman.
                sparepartPage: 1,
                sparepartPageSize: 20,
                sisaProjectPage: 1,
                sisaProjectPageSize: 10,
                opnameHistory: [],
                opnameDraft: {
                    gudang: 'Sparepart',
                    tanggal: new Date().toISOString().slice(0,10),
                    petugas: '',
                    keterangan: '',
                    items: []
                },
                opnameSearch: '',
                opnameFilterMode: 'selisih',
                opnamePage: 1,
                opnamePageSize: 20,
                opnameHistoryItemFilter: 'all',
                editingOpnameHistory: null,
                showOpnameHistoryEditModal: false,
                showOpnameConfirmModal: false,
                showKartuStockOptions: false,
                kartuStockOptions: {
                    item: null,
                    paperSize: 'A4',
                    orientation: 'portrait',
                    filterMode: 'all',
                    dateStart: '',
                    dateEnd: '',
                    bulan: new Date().toISOString().slice(0, 7)
                },
                showOpnameImportPreview: false,
                opnameImportPreview: [],
                opnameHistorySearch: '',
                opnameHistoryDateStart: '',
                opnameHistoryDateEnd: '',
                opnameHistoryGudang: '',
                opnameHistoryMonth: '',
                opnameHistoryYear: '',
                opnameHistoryFilterApplied: false,
                selectedOpnameDate: '',
                authReady: false,
                isAuthenticated: false,
                authUser: null,
                authRole: 'viewer',
                authLoading: false,
                authError: '',
                loginForm: { email: '', password: '' },
                userAccounts: [],
                newAccount: { email: '', password: '', role: 'admin' },
                showNewAccountPassword: false,
                passwordChange: { userId: '', email: '', password: '' },
                showPasswordChangeModal: false,
                showChangedPassword: false,
                passwordChangeSaving: false,
                accountMessage: '',
                accountError: '',
                securitySettings: {
                    max_super_admin_devices: 1,
                    max_admin_devices: 5,
                    max_viewer_devices: 10,
                    session_timeout_hours: 24
                },
                securitySettingsSaving: false,
                securitySettingsMessage: '',
                deviceId: '',
                deviceHeartbeatTimer: null,
                supabaseAuthListener: null,
                supabaseConnected: false,
                isHydratingFromSupabase: true,
                supabaseRealtimeChannel: null,
                supabaseRealtimeTimer: null,
                supabaseLastUpdatedAt: '',

                supabaseSaveTimer: null,
                supabaseSavePromise: null,
                supabaseSaveInProgress: false,
                supabaseSaveQueued: false,
                supabaseSaveRetryCount: 0
            }
        },
        watch: {
            masterCatalog: { handler() { this.scheduleSupabaseSave(); }, deep: true },
            monitoringItems: { handler() { this.scheduleSupabaseSave(); }, deep: true },
            monitoringHistory: { handler() { this.scheduleSupabaseSave(); }, deep: true },
            spareparts: { handler() { this.scheduleSupabaseSave(); }, deep: true },
            sisaProjects: { handler() { this.scheduleSupabaseSave(); }, deep: true },
            logs: { handler() { this.scheduleSupabaseSave(); }, deep: true },
            opnameHistory: { handler() { this.scheduleSupabaseSave(); }, deep: true },
            // Planning tidak memakai deep watcher karena sangat mahal pada ribuan nested row.
            // Perubahan Planning disimpan eksplisit lewat markPlanningDirty().
            searchMaster() {
                this.masterPage = 1;
            },
            planningSearch() { this.planningRequestPage = 1; },
            planningStockFilter() { this.planningRequestPage = 1; },
            planningDateStart() { this.planningRequestPage = 1; this.planningUsedStockCacheKey = ''; },
            planningDateEnd() { this.planningRequestPage = 1; this.planningUsedStockCacheKey = ''; },
            planningWarehouseFilter() { this.planningRequestPage = 1; },
            approvalWarehouseTab() { this.approvalPage = 1; },
            dashFilterDateStart() { this.dashboardSparepartInPage = 1; this.dashboardSparepartOutPage = 1; this.dashboardSisaProjectInPage = 1; this.dashboardSisaProjectOutPage = 1; },
            dashFilterDateEnd() { this.dashboardSparepartInPage = 1; this.dashboardSparepartOutPage = 1; this.dashboardSisaProjectInPage = 1; this.dashboardSisaProjectOutPage = 1; },
            dashSearchBarang() { this.dashboardSparepartInPage = 1; this.dashboardSparepartOutPage = 1; this.dashboardSisaProjectInPage = 1; this.dashboardSisaProjectOutPage = 1; },
            spLogDateStart() { this.sparepartLogInPage = 1; this.sparepartLogOutPage = 1; },
            spLogDateEnd() { this.sparepartLogInPage = 1; this.sparepartLogOutPage = 1; },
            spLogBarang() { this.sparepartLogInPage = 1; this.sparepartLogOutPage = 1; },
            spLogKeperluan() { this.sparepartLogInPage = 1; this.sparepartLogOutPage = 1; },
            spLogHargaMin() { this.sparepartLogInPage = 1; this.sparepartLogOutPage = 1; },
            spLogHargaMax() { this.sparepartLogInPage = 1; this.sparepartLogOutPage = 1; },
            spjLogDateStart() { this.sisaProjectLogInPage = 1; this.sisaProjectLogOutPage = 1; },
            spjLogDateEnd() { this.sisaProjectLogInPage = 1; this.sisaProjectLogOutPage = 1; },
            spjLogBarang() { this.sisaProjectLogInPage = 1; this.sisaProjectLogOutPage = 1; },
            spjLogKeperluan() { this.sisaProjectLogInPage = 1; this.sisaProjectLogOutPage = 1; },
            approvalMovementTab() { this.approvalPage = 1; },
            approvalStatusFilter() { this.approvalPage = 1; },
            monFilterDateStart() { this.purchaseRequestPage = 1; },
            monFilterDateEnd() { this.purchaseRequestPage = 1; },
            monFilterStatus() { this.purchaseRequestPage = 1; },
            monFilterBarang() { this.purchaseRequestPage = 1; },
            monFilterProject() { this.purchaseRequestPage = 1; },
            monSort() { this.purchaseRequestPage = 1; },
            planningRequestPage() { if (this.planningCacheReady) this.$nextTick(() => this.refreshVisiblePlanningStocks()); },
            planningUsagePage() { if (this.planningCacheReady) this.$nextTick(() => this.refreshVisiblePlanningStocks()); },
            activeTab(newTab) {
                // Navigasi tab sengaja tidak menjalankan proses tambahan apa pun.
                // Ini mencegah perpindahan menu memicu render ulang/proses async
                // yang dapat membuat seluruh #app menjadi putih.
                if (newTab !== 'planning_request' && newTab !== 'planning_usage') {
                    this.planningViewReady = false;
                }
                // Stock Opname perlu diinisialisasi saat menu pertama kali dibuka.
                // Sebelumnya opnameDraft.items masih kosong, sehingga template Excel
                // ikut kosong dan filter "Semua Barang" tidak memiliki data untuk ditampilkan.
                if (newTab === 'opname' && (!this.opnameDraft.items || this.opnameDraft.items.length === 0)) {
                    this.initOpnameDraft(this.opnameDraft.gudang || 'Sparepart');
                }
            }
        },
        computed: {
            // Index Data Master sekali per perubahan data master.
            // Ini menggantikan pencarian linear ribuan item pada operasi transaksi.
            masterLookup() {
                const byName = new Map();
                const byCode = new Map();
                for (const item of (this.masterCatalog || [])) {
                    if (!item) continue;
                    const name = String(item.nama || '').trim().toLowerCase();
                    const code = String(item.kode || '').trim().toLowerCase();
                    if (name && !byName.has(name)) byName.set(name, item);
                    if (code && !byCode.has(code)) byCode.set(code, item);
                }
                return { byName, byCode };
            },
            canEdit() {
                return this.isAuthenticated && (this.authRole === 'admin' || this.authRole === 'super_admin');
            },
            canPlanning() {
                const role = String(this.authRole || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
                return this.isAuthenticated && (role === 'admin' || role === 'super_admin');
            },
            canDeleteMaster() {
                const role = String(this.authRole || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
                return this.isAuthenticated && role === 'super_admin';
            },
            canInputTransaction() {
                return this.isAuthenticated && (this.authRole === 'admin' || this.authRole === 'super_admin');
            },
            canPrint() {
                return this.isAuthenticated && (this.authRole === 'admin' || this.authRole === 'super_admin');
            },
            canApprove() {
                return this.isAuthenticated && this.authRole === 'super_admin';
            },
            canManageAccounts() {
                return this.isAuthenticated && this.authRole === 'super_admin';
            },
            roleLabel() {
                return this.authRole === 'super_admin' ? 'Super Admin' : (this.authRole === 'admin' ? 'Admin' : 'Viewer');
            },
            isPendingLog() {
                return (log) => String(log?.approvalStatus || 'approved').toLowerCase() === 'pending';
            },
            approvalLabel() {
                return (log) => {
                    if (this.isCancelledLog(log)) return 'DIBATALKAN';
                    return this.isPendingLog(log) ? 'Menunggu Persetujuan' : 'Disetujui';
                };
            },
            isCancelledLog() {
                return (log) => {
                    if (!log) return false;

                    // Kompatibilitas data lama: baca beberapa kemungkinan nama field
                    // pembatalan tanpa menganggap transaksi aktif sebagai cancel.
                    // Hanya tandai cancelled jika memang ada penanda pembatalan yang nyata.
                    // cancelledBy saja TIDAK dianggap cancel agar transaksi inbound/outbound
                    // normal tetap memiliki tombol Cancel.
                    const explicitCancelFlag = [
                        log.isCancelled, log.is_cancelled, log.cancelled, log.canceled, log.isCanceled
                    ].some(v => v === true || (typeof v === 'string' && ['true','yes','1'].includes(v.trim().toLowerCase())));
                    if (explicitCancelFlag) return true;

                    const cancelTimestamp = [
                        log.cancelledAt, log.cancelled_at, log.canceledAt, log.canceled_at
                    ].some(v => v != null && String(v).trim() !== '' && String(v).trim().toLowerCase() !== 'false');
                    if (cancelTimestamp) return true;

                    const normalizeCancel = v => String(v ?? '').trim().toLowerCase().replace(/[ _-]+/g, '');
                    const cancelledValues = new Set(['cancel', 'cancelled', 'canceled', 'dibatalkan', 'canceltransaction', 'cancelledtransaction', 'canceledtransaction', 'cancelpenerimaan']);
                    const statuses = [
                        log.status, log.approvalStatus, log.approval_status, log.transactionStatus,
                        log.transaction_status, log.actionStatus, log.action_status, log.state
                    ];
                    return statuses.some(v => cancelledValues.has(normalizeCancel(v)));
                };
            },
            allTransactionLogs() {
                return [...this.logs].sort((a, b) => {
                    const ta = a.isoDate ? new Date(a.isoDate).getTime() : Number(a.id) || 0;
                    const tb = b.isoDate ? new Date(b.isoDate).getTime() : Number(b.id) || 0;
                    return tb - ta;
                });
            },
            pendingApprovalLogs() {
                return this.allTransactionLogs.filter(log => this.isPendingLog(log) && log.adjustmentType !== 'OPNAME');
            },
            pendingMasterApprovalRequests() {
                return (this.masterApprovalRequests || []).filter(req => String(req?.approvalStatus || 'pending').toLowerCase() === 'pending');
            },
            approvedMasterApprovalRequests() {
                return (this.masterApprovalRequests || []).filter(req => String(req?.approvalStatus || '').toLowerCase() === 'approved');
            },
            approvedApprovalLogs() {
                return this.allTransactionLogs.filter(log => !this.isPendingLog(log) && log.adjustmentType !== 'OPNAME');
            },
            approvalSparepartInLogs() {
                return this.allTransactionLogs.filter(log => String(log.gudang || '').toLowerCase() === 'sparepart' && log.type === 'IN' && log.adjustmentType !== 'OPNAME');
            },
            approvalSparepartOutLogs() {
                return this.allTransactionLogs.filter(log => String(log.gudang || '').toLowerCase() === 'sparepart' && log.type === 'OUT' && log.adjustmentType !== 'OPNAME');
            },
            approvalSisaProjectInLogs() {
                return this.allTransactionLogs.filter(log => String(log.gudang || '').toLowerCase() === 'sisa project' && log.type === 'IN' && log.adjustmentType !== 'OPNAME');
            },
            approvalSisaProjectOutLogs() {
                return this.allTransactionLogs.filter(log => String(log.gudang || '').toLowerCase() === 'sisa project' && log.type === 'OUT' && log.adjustmentType !== 'OPNAME');
            },
            isCancelledPRLog() {
                return (log) => {
                    if (!log) return false;
                    const orderId = String(log.monitoringOrderId ?? '').trim();
                    if (orderId) {
                        const linkedOrder = (this.monitoringItems || []).find(o => String(o.id ?? '').trim() === orderId);
                        if (linkedOrder && String(linkedOrder.status || '').trim().toLowerCase() === 'cancel') return true;
                    }
                    const prKey = String(log.nomorPR || '').trim().toLowerCase();
                    const itemKey = String(log.nama || '').trim().toLowerCase();
                    if (!prKey) return false;
                    return (this.monitoringItems || []).some(o =>
                        String(o.nomorPR || '').trim().toLowerCase() === prKey &&
                        (!itemKey || String(o.nama || '').trim().toLowerCase() === itemKey) &&
                        String(o.status || '').trim().toLowerCase() === 'cancel'
                    );
                };
            },
            approvalVisibleLogs() {
                if (this.approvalWarehouseTab === 'Stock Opname') return [];
                const gudang = this.approvalWarehouseTab;
                const type = this.approvalMovementTab;
                let list = this.allTransactionLogs.filter(log => log.gudang === gudang && log.type === type && log.adjustmentType !== 'OPNAME' && !this.isCancelledPRLog(log));
                if (this.approvalStatusFilter === 'pending') {
                    list = list.filter(log => this.isPendingLog(log));
                } else if (this.approvalStatusFilter === 'approved') {
                    list = list.filter(log => !this.isPendingLog(log));
                }
                return list;
            },
            approvalWarehousePendingCount() {
                if (this.approvalWarehouseTab === 'Stock Opname') return 0;
                return this.allTransactionLogs.filter(log => log.gudang === this.approvalWarehouseTab && log.adjustmentType !== 'OPNAME' && !this.isCancelledPRLog(log) && this.isPendingLog(log)).length;
            },
            approvalWarehouseApprovedCount() {
                if (this.approvalWarehouseTab === 'Stock Opname') return 0;
                return this.allTransactionLogs.filter(log => log.gudang === this.approvalWarehouseTab && log.adjustmentType !== 'OPNAME' && !this.isCancelledPRLog(log) && !this.isPendingLog(log)).length;
            },
            pendingApprovalOpname() {
                return (this.opnameHistory || []).filter(op => String(op.approvalStatus || 'approved').toLowerCase() === 'pending');
            },
            approvedApprovalOpname() {
                return (this.opnameHistory || []).filter(op => String(op.approvalStatus || 'approved').toLowerCase() !== 'pending');
            },
            opnameHistoryDates() {
                const dates = [...new Set((this.filteredOpnameHistory || []).map(op => op.tgl).filter(Boolean))];
                return dates.sort((a, b) => {
                    const da = new Date(a.split('/').reverse().join('-'));
                    const db = new Date(b.split('/').reverse().join('-'));
                    return db - da;
                });
            },
            filteredOpnameHistoryBySelectedDate() {
                return this.filteredOpnameHistory.filter(op => {
                    const raw = String(op.tgl || '').trim();
                    let month = '';
                    let year = '';
                    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
                        const parts = raw.split('/');
                        month = parts[1];
                        year = parts[2];
                    } else if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
                        const parts = raw.split('-');
                        year = parts[0];
                        month = parts[1];
                    } else if (op.isoDate) {
                        const d = new Date(op.isoDate);
                        if (!isNaN(d.getTime())) {
                            month = String(d.getMonth() + 1).padStart(2, '0');
                            year = String(d.getFullYear());
                        }
                    }
                    if (this.opnameHistoryMonth && month !== String(this.opnameHistoryMonth).padStart(2, '0')) return false;
                    if (this.opnameHistoryYear && year !== String(this.opnameHistoryYear)) return false;
                    return true;
                });
            },
            planningDateRangeReady() {
                const start = String(this.planningDateStart || '');
                const end = String(this.planningDateEnd || '');
                return !!start && !!end && start <= end;
            },
            planningRequestNotificationCount() {
                this.planningUiRevision;
                return Array.isArray(this.planningRequests) ? this.planningRequests.length : 0;
            },
            planningUsageNotificationCount() {
                this.planningUiRevision;
                return Array.isArray(this.planningUsages) ? this.planningUsages.length : 0;
            },
            planningRequestFiltersActive() {
                return this.planningStockFilter !== 'all' || !!this.planningDateStart || !!this.planningDateEnd || !!this.planningWarehouseFilter || !!String(this.planningSearch || '').trim();
            },
            filteredPlanningRequests() {
                const source = Array.isArray(this.planningRequests) ? this.planningRequests : [];
                // Jalur tercepat: saat tidak ada filter, JANGAN copy/scan seluruh Planning.
                if (!this.planningRequestFiltersActive) return source;

                const q = String(this.planningSearch || '').trim().toLowerCase();
                const stockMode = this.planningStockFilter;
                const dateStart = String(this.planningDateStart || '');
                const dateEnd = String(this.planningDateEnd || '');
                const warehouseFilter = String(this.planningWarehouseFilter || '');

                return source.filter(r => {
                    if (!r || typeof r !== 'object') return false;
                    // Filter murah dijalankan lebih dulu. Lookup stok hanya dilakukan jika memang diperlukan.
                    if (q && !String(r.nama || '').toLowerCase().includes(q) && !String(r.sku || '').toLowerCase().includes(q)) return false;
                    const rowDate = String(r.tanggalPenggunaan || r.tanggal || r.createdDate || '');
                    if (dateStart && (!rowDate || rowDate < dateStart)) return false;
                    if (dateEnd && (!rowDate || rowDate > dateEnd)) return false;
                    if (warehouseFilter) {
                        const warehouses = Array.isArray(r.gudangPenggunaan) ? r.gudangPenggunaan : [];
                        if (!warehouses.includes(warehouseFilter)) return false;
                    }
                    if (stockMode !== 'all') {
                        const stock = this.getPlanningStock(r.nama, r.gudangPenggunaan || []);
                        const buffer = Number(r.bufferStock) || 0;
                        if (stockMode === 'above' && stock <= buffer) return false;
                        if (stockMode === 'below' && stock >= buffer) return false;
                    }
                    return true;
                });
            },
            planningRequestPageCount() {
                return Math.max(1, Math.ceil(this.filteredPlanningRequests.length / this.planningRequestPageSize));
            },
            paginatedPlanningRequests() {
                const page = Math.min(Math.max(1, Number(this.planningRequestPage) || 1), this.planningRequestPageCount);
                const start = (page - 1) * this.planningRequestPageSize;
                return this.filteredPlanningRequests.slice(start, start + this.planningRequestPageSize).filter(row => row && typeof row === 'object');
            },
            planningRequestPageStart() {
                if (!this.filteredPlanningRequests.length) return 0;
                return ((Math.min(this.planningRequestPage, this.planningRequestPageCount) - 1) * this.planningRequestPageSize) + 1;
            },
            planningRequestPageEnd() {
                return Math.min(this.filteredPlanningRequests.length, Math.min(this.planningRequestPage, this.planningRequestPageCount) * this.planningRequestPageSize);
            },
            planningUsagePageCount() {
                return Math.max(1, Math.ceil((this.planningUsages || []).length / this.planningUsagePageSize));
            },
            paginatedPlanningUsages() {
                const page = Math.min(Math.max(1, Number(this.planningUsagePage) || 1), this.planningUsagePageCount);
                const start = (page - 1) * this.planningUsagePageSize;
                return (this.planningUsages || []).slice(start, start + this.planningUsagePageSize).filter(row => row && typeof row === 'object');
            },
            planningUsagePageStart() {
                if (!(this.planningUsages || []).length) return 0;
                return ((Math.min(this.planningUsagePage, this.planningUsagePageCount) - 1) * this.planningUsagePageSize) + 1;
            },
            planningUsagePageEnd() {
                return Math.min((this.planningUsages || []).length, Math.min(this.planningUsagePage, this.planningUsagePageCount) * this.planningUsagePageSize);
            },
            filteredMasterCatalog() {
                const keyword = this.searchMaster.trim().toLowerCase();
                let rows = (this.masterCatalog || []).filter(item =>
                    !keyword || String(item?.nama || '').toLowerCase().includes(keyword)
                );
                const textValue = value => String(value || '').trim();
                const numberValue = value => {
                    const n = Number(value);
                    return Number.isFinite(n) ? n : 0;
                };
                const stockValue = item => numberValue(item?.stockAwal ?? item?.currentStock ?? 0);
                const rakParts = value => {
                    const raw = textValue(value).toUpperCase();
                    const match = raw.match(/^([A-Z]+)\s*[-./ ]*([0-9]+(?:[.-][0-9]+)*)/);
                    if (match) return { huruf: match[1], nomor: match[2].split(/[.-]/).map(n => Number(n) || 0) };
                    const letters = (raw.match(/[A-Z]+/) || [''])[0];
                    const nums = (raw.match(/\d+(?:[.-]\d+)*/ ) || ['0'])[0].split(/[.-]/).map(n => Number(n) || 0);
                    return { huruf: letters, nomor: nums };
                };
                const compareRak = (a, b) => {
                    const ra = rakParts(a), rb = rakParts(b);
                    const hurufCmp = ra.huruf.localeCompare(rb.huruf, 'id', { sensitivity: 'base', numeric: false });
                    if (hurufCmp) return hurufCmp;
                    const max = Math.max(ra.nomor.length, rb.nomor.length);
                    for (let i = 0; i < max; i++) {
                        const diff = (ra.nomor[i] || 0) - (rb.nomor[i] || 0);
                        if (diff) return diff;
                    }
                    return textValue(a).localeCompare(textValue(b), 'id', { sensitivity: 'base', numeric: true });
                };
                const cmpName = (a, b) => textValue(a.nama).localeCompare(textValue(b.nama), 'id', { sensitivity: 'base', numeric: true });
                const sortKey = this.masterSort || 'nama_asc';
                const descending = sortKey.endsWith('_desc');
                const key = sortKey.replace(/_(?:asc|desc)$/, '');

                // Urutan nomor sama dengan urutan array asli, jadi tidak perlu
                // membuat wrapper {item, originalIndex} atau melakukan sort.
                if (key === 'no') return rows;

                rows.sort((a, b) => {
                    let cmp = 0;
                    if (key === 'rak') cmp = compareRak(a.lokasi || a.lokasiRak || a.rak || '', b.lokasi || b.lokasiRak || b.rak || '');
                    else if (key === 'nama') cmp = cmpName(a, b);
                    else if (key === 'stock') cmp = stockValue(a) - stockValue(b);
                    else if (key === 'harga') cmp = numberValue(a.harga) - numberValue(b.harga);
                    else if (key === 'buffer') cmp = numberValue(a.minStock) - numberValue(b.minStock);
                    if (cmp === 0) cmp = cmpName(a, b);
                    return descending ? -cmp : cmp;
                });
                return rows;
            },
            masterPageCount() {
                return Math.max(1, Math.ceil(this.filteredMasterCatalog.length / this.masterPageSize));
            },
            paginatedMasterCatalog() {
                const pageCount = this.masterPageCount;
                const page = Math.min(Math.max(1, this.masterPage), pageCount);
                const start = (page - 1) * this.masterPageSize;
                return this.filteredMasterCatalog.slice(start, start + this.masterPageSize);
            },
            masterPageStart() {
                if (!this.filteredMasterCatalog.length) return 0;
                return ((Math.min(this.masterPage, this.masterPageCount) - 1) * this.masterPageSize) + 1;
            },
            masterPageEnd() {
                return Math.min(
                    Math.min(this.masterPage, this.masterPageCount) * this.masterPageSize,
                    this.filteredMasterCatalog.length
                );
            },
            filteredMonitoringItems() {
                const priorityRank = value => { const n = Number(value); return Number.isFinite(n) && n > 0 ? n : 0; };
                const normalizeKey = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                // Jika History PR menunjukkan penerimaan masih sebagian, PR tersebut harus
                // tetap muncul di tabel atas agar sisa barang dapat diterima sampai selesai.
                // Gunakan Set agar pengecekan tetap ringan dan tidak menjalankan find/some
                // berulang untuk setiap baris PR.
                const partialHistoryOrderIds = new Set(
                    (this.monitoringHistory || [])
                        .filter(h => h && h.type === 'IN' && h.status === 'Diterima Sebagian' && h.monitoringOrderId)
                        .map(h => String(h.monitoringOrderId))
                );
                const rows = this.monitoringItems.filter(i => {
                    const hasPartialHistory = partialHistoryOrderIds.has(String(i?.id ?? ''));
                    // PR tetap tampil jika masih ada sisa qty ATAU History PR menunjukkan
                    // bahwa penerimaannya baru sebagian. PR yang sudah diterima semua dan
                    // tidak memiliki riwayat penerimaan sebagian tetap tidak ditampilkan.
                    if (!this.monFilterStatus && (Number(i.qtyRemaining) || 0) <= 0 && !hasPartialHistory) return false;
                    if (!this.monFilterStatus && i.status === 'Diterima Semua' && !hasPartialHistory) return false;
                    const itemName = String(i.nama || '').toLowerCase();
                    const matchBarang = !this.monFilterBarang || itemName.includes(String(this.monFilterBarang || '').toLowerCase());
                    const itemKepentingan = String(i.keperluan || i.project || '').toLowerCase();
                    const matchProject = !this.monFilterProject || itemKepentingan.includes(String(this.monFilterProject || '').toLowerCase());
                    const matchStatus = !this.monFilterStatus || i.status === this.monFilterStatus;
                    let matchDate = true;
                    if (this.monFilterDateStart || this.monFilterDateEnd) {
                        const itemDate = new Date(i.isoDate || i.id);
                        if (this.monFilterDateStart && itemDate < new Date(this.monFilterDateStart)) matchDate = false;
                        if (this.monFilterDateEnd) {
                            const endDate = new Date(this.monFilterDateEnd);
                            endDate.setHours(23, 59, 59);
                            if (itemDate > endDate) matchDate = false;
                        }
                    }
                    return matchBarang && matchProject && matchStatus && matchDate;
                });
                // Bersihkan duplikasi nama barang pada Nomor PR yang sama di tampilan atas.
                // Jika ada beberapa record duplikat, cukup tampilkan satu record yang masih aktif.
                const uniqueRows = [];
                const seen = new Set();
                rows.forEach(row => {
                    const key = `${normalizeKey(row.nomorPR)}|${normalizeKey(row.nama)}`;
                    if (seen.has(key)) return;
                    seen.add(key);
                    uniqueRows.push(row);
                });
                return uniqueRows.slice().sort((a, b) => {
                    if (this.monSort === 'date_asc' || this.monSort === 'date_desc') {
                        const da = new Date(a.isoDate || a.id).getTime() || 0;
                        const db = new Date(b.isoDate || b.id).getTime() || 0;
                        return this.monSort === 'date_asc' ? da - db : db - da;
                    }
                    const pa = priorityRank(a.prioritas);
                    const pb = priorityRank(b.prioritas);
                    if (pa === 0 && pb !== 0) return 1;
                    if (pa !== 0 && pb === 0) return -1;
                    if (pa !== pb) return this.monSort === 'priority_desc' ? pa - pb : pb - pa;
                    const da = new Date(a.isoDate || a.id).getTime() || 0;
                    const db = new Date(b.isoDate || b.id).getTime() || 0;
                    return db - da;
                });
            },
            totalSparepartQty() {
                // Satu angka stok untuk Dashboard + Sidebar: jumlah Qty aktual
                // dari seluruh barang yang tercatat di Gudang Spare Part.
                return (this.masterCatalog || []).reduce((sum, item) => {
                    const qty = Math.max(0, Math.round(Number(item?.currentStock ?? item?.stockAwal) || 0));
                    return sum + qty;
                }, 0);
            },
            totalSisaProjectQty() {
                // Dashboard + Sidebar harus menampilkan Qty stok aktual, bukan jumlah baris/item.
                return (this.sisaProjects || []).reduce((sum, item) => {
                    const qty = Math.max(0, Number(item?.qty) || 0);
                    return sum + qty;
                }, 0);
            },
            purchasePendingCount() {
                // Satu antrean = satu Purchase Request yang masih memiliki sisa qty.
                return (this.monitoringItems || []).filter(order =>
                    order && order.status !== 'Diterima Semua' && order.status !== 'Cancel' && (Number(order.qtyRemaining) || 0) > 0
                ).length;
            },
            totalHargaSparepart() {
                return (this.masterCatalog || []).reduce((sum, item) => {
                    const harga = Math.max(0, Number(item?.harga) || 0);
                    const qty = Math.max(0, Math.round(Number(item?.currentStock ?? item?.stockAwal) || 0));
                    return sum + (harga * qty);
                }, 0);
            },
            monitoringTotalHarga() {
                return this.filteredMonitoringItems.reduce((sum, o) => {
                    const harga = this.getMasterHarga(o.nama, o.harga);
                    const total = harga * (Number(o.qtyTotal) || 0);
                    return sum + (Number(total) || 0);
                }, 0);
            },
            monitoringHistoryIn() {
                return this.monitoringHistory.filter(h => h.type === 'IN');
            },
            // Cache data PR terkait sekali agar tabel History tidak menjalankan find() berulang
            // untuk setiap kolom pada setiap baris. Ini mengurangi beban render saat data PR banyak.
            monitoringHistoryDisplay() {
                const orderMap = new Map((this.monitoringItems || []).map(o => [String(o.id), o]));
                return this.monitoringHistoryIn.map(h => {
                    const order = orderMap.get(String(h.monitoringOrderId));
                    return {
                        ...h,
                        _order: order || null,
                        _nomorPR: h.nomorPR || order?.nomorPR || '-',
                        _nomorPO: h.nomorPO || order?.nomorPO || '-',
                        _supplier: h.supplier || order?.supplier || '-',
                        _satuan: h.satuan || order?.satuan || '-',
                        _qtyTotal: order?.qtyTotal ?? h.qty,
                        _qtyReceived: order?.qtyReceived ?? h.qty,
                        _qtyRemaining: order?.qtyRemaining ?? 0
                    };
                });
            },
            purchaseRequestHistoryPageCount() {
                return Math.max(1, Math.ceil(this.monitoringHistoryDisplay.length / this.purchaseRequestHistoryPageSize));
            },
            paginatedPurchaseRequestHistory() {
                const maxPage = this.purchaseRequestHistoryPageCount;
                const page = Math.min(Math.max(1, Number(this.purchaseRequestHistoryPage) || 1), maxPage);
                const start = (page - 1) * this.purchaseRequestHistoryPageSize;
                return this.monitoringHistoryDisplay.slice(start, start + this.purchaseRequestHistoryPageSize);
            },
            purchaseRequestHistoryPageStart() {
                if (!this.monitoringHistoryDisplay.length) return 0;
                const page = Math.min(Math.max(1, Number(this.purchaseRequestHistoryPage) || 1), this.purchaseRequestHistoryPageCount);
                return ((page - 1) * this.purchaseRequestHistoryPageSize) + 1;
            },
            purchaseRequestHistoryPageEnd() {
                if (!this.monitoringHistoryDisplay.length) return 0;
                const page = Math.min(Math.max(1, Number(this.purchaseRequestHistoryPage) || 1), this.purchaseRequestHistoryPageCount);
                return Math.min(page * this.purchaseRequestHistoryPageSize, this.monitoringHistoryDisplay.length);
            },
            hasExistingPurchaseRequest() {
                const pr = String(this.formOrderMulti.nomorPR || '').trim().toLowerCase().replace(/\s+/g, ' ');
                if (!pr) return false;
                return this.monitoringItems.some(order => String(order.nomorPR || '').trim().toLowerCase().replace(/\s+/g, ' ') === pr);
            },
            filteredSpareparts() {
                const q = String(this.spLogBarang || '').trim().toLowerCase();
                // Tampilan Gudang Spare Part memakai stok gudang terbaru.
                // Data Master hanya dipakai sebagai metadata barang.
                const source = (this.spareparts || []).map(stock => ({
                    ...stock,
                    qty: Math.max(0, Math.round(Number(stock.qty) || 0)),
                    harga: Math.max(0, Number(stock.harga) || 0),
                    minStock: Math.max(0, Number(stock.minStock) || 0),
                    satuan: stock.satuan || 'PCS',
                    lokasi: stock.lokasi || '-'
                }));
                if (!q) return source;
                return source.filter(item => String(item.nama || '').toLowerCase().includes(q) || String(item.kode || '').toLowerCase().includes(q));
            },
            paginatedSpareparts() {
                const total = this.filteredSpareparts.length;
                const maxPage = Math.max(1, Math.ceil(total / this.sparepartPageSize));
                const page = Math.min(Math.max(1, Number(this.sparepartPage) || 1), maxPage);
                const start = (page - 1) * this.sparepartPageSize;
                return this.filteredSpareparts.slice(start, start + this.sparepartPageSize);
            },
            sparepartPageCount() {
                return Math.max(1, Math.ceil(this.filteredSpareparts.length / this.sparepartPageSize));
            },
            sparepartPageStart() {
                if (!this.filteredSpareparts.length) return 0;
                return ((Math.min(this.sparepartPage, this.sparepartPageCount) - 1) * this.sparepartPageSize) + 1;
            },
            sparepartPageEnd() {
                return Math.min(this.sparepartPage * this.sparepartPageSize, this.filteredSpareparts.length);
            },
            filteredSisaProjects() {
                const q = String(this.spjLogBarang || '').trim().toLowerCase();
                if (!q) return this.sisaProjects;
                return this.sisaProjects.filter(item => String(item.nama || '').toLowerCase().includes(q));
            },
            paginatedSisaProjects() {
                const total = this.filteredSisaProjects.length;
                const maxPage = Math.max(1, Math.ceil(total / this.sisaProjectPageSize));
                const page = Math.min(Math.max(1, Number(this.sisaProjectPage) || 1), maxPage);
                const start = (page - 1) * this.sisaProjectPageSize;
                return this.filteredSisaProjects.slice(start, start + this.sisaProjectPageSize);
            },
            sisaProjectPageCount() {
                return Math.max(1, Math.ceil(this.filteredSisaProjects.length / this.sisaProjectPageSize));
            },
            sisaProjectPageStart() {
                if (!this.filteredSisaProjects.length) return 0;
                return ((Math.min(this.sisaProjectPage, this.sisaProjectPageCount) - 1) * this.sisaProjectPageSize) + 1;
            },
            sisaProjectPageEnd() {
                return Math.min(this.sisaProjectPage * this.sisaProjectPageSize, this.filteredSisaProjects.length);
            },
            sparepartOutDropdownOptions() {
                const keyword = String(this.sparepartOutDropdownQuery || '').trim().toLowerCase();
                const out = [];
                const limit = keyword ? 20 : 5;
                for (const i of (this.spareparts || [])) {
                    if ((Number(i?.qty) || 0) <= 0) continue;
                    if (!keyword || String(i?.nama || '').toLowerCase().includes(keyword)) out.push(i);
                    if (out.length >= limit) break;
                }
                return out;
            },
            masterAutocompleteOptions() {
                const keyword = String(this.masterAutocompleteQuery || '').trim().toLowerCase();
                const key = String(this.masterDropdownKey || '');
                const out = [];
                const limit = keyword ? 20 : 5;
                let source = this.masterCatalog || [];
                let requirePositiveStock = false;
                if (key.startsWith('sparepart-out-')) { source = this.spareparts || []; requirePositiveStock = true; }
                else if (key.startsWith('sisa-out-')) { source = this.sisaProjects || []; requirePositiveStock = true; }
                for (const item of source) {
                    if (!item) continue;
                    if (requirePositiveStock && (Number(item.qty) || 0) <= 0) continue;
                    if (keyword && !String(item.nama || '').toLowerCase().includes(keyword) &&
                        !String(item.kode || item.barcode || item.sku || '').toLowerCase().includes(keyword)) continue;
                    out.push(item);
                    if (out.length >= limit) break;
                }
                return out;
            },
            masterDropdownOptions() {
                const key = String(this.masterDropdownKey || '');
                if (key.startsWith('planning-')) return Array.isArray(this.planningAutocompleteResults) ? this.planningAutocompleteResults : [];
                return this.masterAutocompleteOptions;
            },
            sparepartLogsIn() {
                return this.filterLogs('Sparepart', 'IN', this.spLogDateStart, this.spLogDateEnd, this.spLogBarang, this.spLogKeperluan, this.spLogHargaMin, this.spLogHargaMax);
            },
            sparepartLogsOut() {
                return this.filterLogs('Sparepart', 'OUT', this.spLogDateStart, this.spLogDateEnd, this.spLogBarang, this.spLogKeperluan, this.spLogHargaMin, this.spLogHargaMax);
            },
            projectLogsIn() {
                return this.filterLogs('Sisa Project', 'IN', this.spjLogDateStart, this.spjLogDateEnd, this.spjLogBarang, this.spjLogKeperluan, '', '');
            },
            projectLogsOut() {
                return this.filterLogs('Sisa Project', 'OUT', this.spjLogDateStart, this.spjLogDateEnd, this.spjLogBarang, this.spjLogKeperluan, '', '');
            },
            totalHargaPengeluaranSparepart() {
                return (this.sparepartLogsOut || []).reduce((sum, log) => {
                    const harga = Number(log.harga != null ? log.harga : this.getMasterHarga(log.nama)) || 0;
                    return sum + (harga * (Number(log.qty) || 0));
                }, 0);
            },
            totalHargaPengeluaranSisaProject() {
                return (this.projectLogsOut || []).reduce((sum, log) => {
                    const harga = Number(log.harga != null ? log.harga : this.getMasterHarga(log.nama)) || 0;
                    return sum + (harga * (Number(log.qty) || 0));
                }, 0);
            },
            filteredSparepartLogsIn() {
                const useSparepartFilter = this.activeTab === 'sparepart';
                const q = String(useSparepartFilter ? this.spLogBarang : (this.dashSearchBarang || '')).trim().toLowerCase();
                return this.filterLogs(
                    'Sparepart',
                    'IN',
                    useSparepartFilter ? this.spLogDateStart : this.dashFilterDateStart,
                    useSparepartFilter ? this.spLogDateEnd : this.dashFilterDateEnd,
                    useSparepartFilter ? this.spLogBarang : '',
                    useSparepartFilter ? this.spLogKeperluan : '',
                    useSparepartFilter ? this.spLogHargaMin : '',
                    useSparepartFilter ? this.spLogHargaMax : ''
                ).filter(log => !q || String(log.nama || '').toLowerCase().includes(q));
            },
            filteredSparepartLogsOut() {
                const useSparepartFilter = this.activeTab === 'sparepart';
                const q = String(useSparepartFilter ? this.spLogBarang : (this.dashSearchBarang || '')).trim().toLowerCase();
                return this.filterLogs(
                    'Sparepart',
                    'OUT',
                    useSparepartFilter ? this.spLogDateStart : this.dashFilterDateStart,
                    useSparepartFilter ? this.spLogDateEnd : this.dashFilterDateEnd,
                    useSparepartFilter ? this.spLogBarang : '',
                    useSparepartFilter ? this.spLogKeperluan : '',
                    useSparepartFilter ? this.spLogHargaMin : '',
                    useSparepartFilter ? this.spLogHargaMax : ''
                ).filter(log => !q || String(log.nama || '').toLowerCase().includes(q));
            },
            filteredProjectLogsIn() {
                const useSisaFilter = this.activeTab === 'sisa_project';
                const q = String(useSisaFilter ? this.spjLogBarang : this.dashSearchBarang || '').trim().toLowerCase();
                return this.filterLogs(
                    'Sisa Project',
                    'IN',
                    useSisaFilter ? this.spjLogDateStart : this.dashFilterDateStart,
                    useSisaFilter ? this.spjLogDateEnd : this.dashFilterDateEnd,
                    useSisaFilter ? this.spjLogBarang : '',
                    useSisaFilter ? this.spjLogKeperluan : '',
                    useSisaFilter ? this.spjLogHargaMin : '',
                    useSisaFilter ? this.spjLogHargaMax : ''
                ).filter(log => !q || String(log.nama || '').toLowerCase().includes(q));
            },
            filteredProjectLogsOut() {
                const useSisaFilter = this.activeTab === 'sisa_project';
                const q = String(useSisaFilter ? this.spjLogBarang : this.dashSearchBarang || '').trim().toLowerCase();
                return this.filterLogs(
                    'Sisa Project',
                    'OUT',
                    useSisaFilter ? this.spjLogDateStart : this.dashFilterDateStart,
                    useSisaFilter ? this.spjLogDateEnd : this.dashFilterDateEnd,
                    useSisaFilter ? this.spjLogBarang : '',
                    useSisaFilter ? this.spjLogKeperluan : '',
                    useSisaFilter ? this.spjLogHargaMin : '',
                    useSisaFilter ? this.spjLogHargaMax : ''
                ).filter(log => !q || String(log.nama || '').toLowerCase().includes(q));
            },
            paginatedDashboardSparepartIn() {
                const start = (this.dashboardSparepartInPage - 1) * this.dashboardPageSize;
                return this.filteredSparepartLogsIn.slice(start, start + this.dashboardPageSize);
            },
            paginatedDashboardSparepartOut() {
                const start = (this.dashboardSparepartOutPage - 1) * this.dashboardPageSize;
                return this.filteredSparepartLogsOut.slice(start, start + this.dashboardPageSize);
            },
            paginatedDashboardSisaProjectIn() {
                const start = (this.dashboardSisaProjectInPage - 1) * this.dashboardPageSize;
                return this.filteredProjectLogsIn.slice(start, start + this.dashboardPageSize);
            },
            paginatedDashboardSisaProjectOut() {
                const start = (this.dashboardSisaProjectOutPage - 1) * this.dashboardPageSize;
                return this.filteredProjectLogsOut.slice(start, start + this.dashboardPageSize);
            },
            dashboardSparepartInPageCount() { return Math.max(1, Math.ceil(this.filteredSparepartLogsIn.length / this.dashboardPageSize)); },
            dashboardSparepartOutPageCount() { return Math.max(1, Math.ceil(this.filteredSparepartLogsOut.length / this.dashboardPageSize)); },
            dashboardSisaProjectInPageCount() { return Math.max(1, Math.ceil(this.filteredProjectLogsIn.length / this.dashboardPageSize)); },
            dashboardSisaProjectOutPageCount() { return Math.max(1, Math.ceil(this.filteredProjectLogsOut.length / this.dashboardPageSize)); },
            paginatedSparepartLogsIn() {
                const start = (this.sparepartLogInPage - 1) * this.logPageSize;
                return this.filteredSparepartLogsIn.slice(start, start + this.logPageSize);
            },
            paginatedSparepartLogsOut() {
                const start = (this.sparepartLogOutPage - 1) * this.logPageSize;
                return this.filteredSparepartLogsOut.slice(start, start + this.logPageSize);
            },
            paginatedProjectLogsIn() {
                const start = (this.sisaProjectLogInPage - 1) * this.logPageSize;
                return this.filteredProjectLogsIn.slice(start, start + this.logPageSize);
            },
            paginatedProjectLogsOut() {
                const start = (this.sisaProjectLogOutPage - 1) * this.logPageSize;
                return this.filteredProjectLogsOut.slice(start, start + this.logPageSize);
            },
            sparepartLogInPageCount() { return Math.max(1, Math.ceil(this.filteredSparepartLogsIn.length / this.logPageSize)); },
            sparepartLogOutPageCount() { return Math.max(1, Math.ceil(this.filteredSparepartLogsOut.length / this.logPageSize)); },
            sisaProjectLogInPageCount() { return Math.max(1, Math.ceil(this.filteredProjectLogsIn.length / this.logPageSize)); },
            sisaProjectLogOutPageCount() { return Math.max(1, Math.ceil(this.filteredProjectLogsOut.length / this.logPageSize)); },
            lowStockItems() {
                const rows = [];
                const latestPRByName = new Map();
                // Bangun index PR sekali. Sebelumnya setiap item stok melakukan
                // filter + sort ke seluruh monitoringItems sehingga biayanya
                // menjadi O(stok x PR).
                for (const order of (this.monitoringItems || [])) {
                    const key = String(order?.nama || '').trim().toLowerCase();
                    if (!key) continue;
                    const time = new Date(order?.tgl || order?.created_at || 0).getTime() || 0;
                    const previous = latestPRByName.get(key);
                    const previousTime = previous ? (new Date(previous?.tgl || previous?.created_at || 0).getTime() || 0) : -Infinity;
                    if (!previous || time >= previousTime) latestPRByName.set(key, order);
                }

                const addLowStock = (stock, gudang) => {
                    if (!stock) return;
                    const min = Math.max(0, Number(stock.minStock) || 0);
                    const qty = gudang === 'Sparepart'
                        ? Math.max(0, Math.round(Number(stock.currentStock ?? stock.stockAwal) || 0))
                        : Math.max(0, Math.round(Number(stock.qty) || 0));
                    // Peringatan hanya muncul jika stok saat ini BENAR-BENAR di bawah stok minimal.
                    // Jika stok sama dengan stok minimal, tidak perlu masuk dashboard.
                    if (min <= 0 || qty >= min) return;
                    const pr = latestPRByName.get(String(stock.nama || '').trim().toLowerCase());
                    rows.push({
                        gudang,
                        nama: stock.nama,
                        qty,
                        minStock: min,
                        satuan: stock.satuan || 'Pcs',
                        lokasi: stock.lokasi || '-',
                        nomorPR: pr?.nomorPR || '-',
                        tglPR: pr?.tgl || '-'
                    });
                };

                for (const stock of (this.masterCatalog || [])) addLowStock(stock, 'Sparepart');
                for (const stock of (this.sisaProjects || [])) addLowStock(stock, 'Sisa Project');
                return rows.sort((a, b) => (a.qty - a.minStock) - (b.qty - b.minStock));
            },
            opnameDraftItemsWithSelisih() {
                return (this.opnameDraft.items || []).map((it, idx) => {
                    const qtyFisik = it.qtyFisik === '' || it.qtyFisik === null || it.qtyFisik === undefined ? null : Number(it.qtyFisik);
                    const qtySystem = Number(it.qtySystem) || 0;
                    const selisih = qtyFisik === null ? null : (qtyFisik - qtySystem);
                    return { ...it, idx, qtyFisikNum: qtyFisik, qtySystemNum: qtySystem, selisih };
                });
            },
            opnameDraftItemsFiltered() {
                const q = String(this.opnameSearch || '').trim().toLowerCase();
                let list = this.opnameDraftItemsWithSelisih || [];
                if (q) list = list.filter(x => String(x.nama || '').toLowerCase().includes(q) || String(x.kode || '').toLowerCase().includes(q) || String(x.barcode || '').toLowerCase().includes(q));
                if (this.opnameFilterMode === 'selisih') list = list.filter(x => x.selisih !== null && x.selisih !== 0);
                else if (this.opnameFilterMode === 'match') list = list.filter(x => x.selisih === 0);
                else if (this.opnameFilterMode === 'unfilled') list = list.filter(x => x.qtyFisikNum === null);
                return list;
            },
            paginatedOpnameDraftItems() {
                const total = this.opnameDraftItemsFiltered.length;
                const maxPage = Math.max(1, Math.ceil(total / this.opnamePageSize));
                const page = Math.min(Math.max(1, Number(this.opnamePage) || 1), maxPage);
                const start = (page - 1) * this.opnamePageSize;
                return this.opnameDraftItemsFiltered.slice(start, start + this.opnamePageSize);
            },
            opnamePageCount() {
                return Math.max(1, Math.ceil(this.opnameDraftItemsFiltered.length / this.opnamePageSize));
            },
            opnamePageStart() {
                if (!this.opnameDraftItemsFiltered.length) return 0;
                return ((Math.min(this.opnamePage, this.opnamePageCount) - 1) * this.opnamePageSize) + 1;
            },
            opnamePageEnd() {
                return Math.min(this.opnamePage * this.opnamePageSize, this.opnameDraftItemsFiltered.length);
            },
            opnameDraftSelisihCount() {
                return this.opnameDraftItemsWithSelisih.filter(x => x.selisih !== null && x.selisih !== 0).length;
            },
            opnameDraftMatchCount() {
                return this.opnameDraftItemsWithSelisih.filter(x => x.selisih === 0).length;
            },
            opnameDraftUnfilledCount() {
                return this.opnameDraftItemsWithSelisih.filter(x => x.qtyFisikNum === null).length;
            },
            opnameDraftSelisihItems() {
                return this.opnameDraftItemsWithSelisih.filter(x => x.selisih !== null && x.selisih !== 0);
            },
            opnameMonths() {
                return ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
            },
            opnameHistoryYears() {
                const years = new Set();
                (this.opnameHistory || []).forEach(op => {
                    const raw = String(op.tgl || '').trim();
                    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
                        years.add(raw.split('/')[2]);
                    } else if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
                        years.add(raw.split('-')[0]);
                    } else if (op.isoDate) {
                        const d = new Date(op.isoDate);
                        if (!isNaN(d.getTime())) years.add(String(d.getFullYear()));
                    }
                });
                return Array.from(years).sort((a,b) => Number(b) - Number(a));
            },
            filteredOpnameHistory() {
                const q = String(this.opnameHistorySearch || '').trim().toLowerCase();
                return this.opnameHistory.filter(op => {
                    if (this.opnameHistoryGudang && op.gudang !== this.opnameHistoryGudang) return false;
                    if (this.opnameHistoryDateStart && new Date(op.isoDate || 0) < new Date(this.opnameHistoryDateStart)) return false;
                    if (this.opnameHistoryDateEnd) {
                        const end = new Date(this.opnameHistoryDateEnd);
                        end.setHours(23, 59, 59, 999);
                        if (new Date(op.isoDate || 0) > end) return false;
                    }
                    if (q) {
                        const hay = `${op.nomor || ''} ${op.petugas || ''} ${op.keterangan || ''} ${op.gudang || ''}`.toLowerCase();
                        if (!hay.includes(q)) return false;
                    }
                    return true;
                }).slice().sort((a, b) => new Date(b.isoDate || 0) - new Date(a.isoDate || 0));
            }
        },
        async mounted() {
            const today = this.getISODateOnly();
            this.dashFilterDateStart = today;
            this.dashFilterDateEnd = today;
            this.refreshIcons();
            await this.initAuth();
            if (this.isAuthenticated) {
                await this.loadFromSupabase();
                this.subscribeSupabaseRealtime();
                this.startDeviceHeartbeat();
            }
            window.addEventListener('resize', this.repositionMasterDropdown);
            window.addEventListener('scroll', this.repositionMasterDropdown, true);
            window.addEventListener('resize', this.repositionSparepartOutDropdown);
            window.addEventListener('scroll', this.repositionSparepartOutDropdown, true);
            window.addEventListener('keydown', this.handleGlobalBarcodeKeydown);
        },
        beforeUnmount() {
            if (this.supabaseAuthListener?.subscription) this.supabaseAuthListener.subscription.unsubscribe();
            this.unsubscribeSupabaseRealtime();
            this.stopDeviceHeartbeat();
            clearTimeout(this._planningAutocompleteTimer);
            clearTimeout(this._planningFilterTimer);
            window.removeEventListener('resize', this.repositionMasterDropdown);
            window.removeEventListener('scroll', this.repositionMasterDropdown, true);
            window.removeEventListener('resize', this.repositionSparepartOutDropdown);
            window.removeEventListener('scroll', this.repositionSparepartOutDropdown, true);
            window.removeEventListener('keydown', this.handleGlobalBarcodeKeydown);
        },
        methods: {
            // ================================================================
            // INPUT DATA MASTER & PURCHASE REQUEST
            // Metode berikut hanya mengaktifkan tombol/form yang sudah ada.
            // Tidak mengubah struktur Supabase atau jalur sinkronisasi data.
            // ================================================================
            async tambahMasterManual() {
                if (!this.canEdit) return alert('Akun tidak memiliki izin untuk mengubah Data Master.');

                const nama = String(this.formMasterManual.nama || '').trim();
                if (!nama) return alert('Nama Barang wajib diisi.');

                const normalize = value => String(value || '').trim().toLowerCase();
                const existing = (this.masterCatalog || []).find(item => {
                    const sameKode = normalize(item.kode) && normalize(this.formMasterManual.kode) && normalize(item.kode) === normalize(this.formMasterManual.kode);
                    const sameNama = normalize(item.nama) === normalize(nama);
                    return sameKode || sameNama;
                });
                if (existing) return alert(`Data Master dengan ${normalize(existing.kode) === normalize(this.formMasterManual.kode) && this.formMasterManual.kode ? 'SKU tersebut' : 'nama tersebut'} sudah ada.`);

                const qty = Math.max(0, Math.round(Number(this.formMasterManual.currentStock) || 0));
                const kodeInput = String(this.formMasterManual.kode || '').trim();
                const kode = kodeInput || `SKU-${Date.now()}`;
                const satuan = String(this.formMasterManual.satuan || '').trim() || 'Pcs';

                this.masterCatalog.push({
                    kode: kode.toUpperCase(),
                    nama: nama.toUpperCase(),
                    harga: Math.max(0, Number(this.formMasterManual.harga) || 0),
                    minStock: Math.max(0, Math.round(Number(this.formMasterManual.minStock) || 0)),
                    currentStock: qty,
                    stockAwal: qty,
                    tanggal: this.getISODateOnly(),
                    leadTime: Math.max(0, Math.round(Number(this.formMasterManual.leadTime) || 0)),
                    avgDailyUsage: Math.max(0, Number(this.formMasterManual.avgDailyUsage) || 0),
                    satuan,
                    lokasi: String(this.formMasterManual.lokasi || '').trim().toUpperCase(),
                    totalHarga: (Math.max(0, Number(this.formMasterManual.harga) || 0)) * qty
                });

                this.formMasterManual = {
                    kode: '', nama: '', harga: 0, minStock: 0, currentStock: 0, stockAwal: 0,
                    tanggal: new Date().toISOString().slice(0, 10), leadTime: 0, avgDailyUsage: 0,
                    satuan: 'Pcs', lokasi: ''
                };
                this.masterPage = 1;

                // Simpan langsung ke Supabase setelah item Master ditambahkan.
                // Jangan hanya mengandalkan watcher/debounce, supaya data baru
                // benar-benar tersimpan sebelum form dianggap berhasil.
                const saved = await this.saveToSupabase();
                if (!saved) {
                    alert('Data Master tampil di layar, tetapi gagal disimpan ke database. Silakan cek koneksi/izin akun lalu coba lagi.');
                    return;
                }

                alert('Data Master berhasil ditambahkan dan disimpan ke database.');
            },
            async importMasterCatalog(event) {
                if (!this.canEdit) return alert('Akun tidak memiliki izin untuk import Data Master.');
                const file = event?.target?.files?.[0];
                if (!file) return;
                if (typeof XLSX === 'undefined') return alert('Library Excel belum termuat. Silakan refresh halaman.');

                try {
                    const buffer = await file.arrayBuffer();
                    const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
                    if (!rows.length) return alert('File Excel tidak memiliki data.');

                    const normHeader = value => String(value || '').trim().toLowerCase().replace(/[\s_\/-]+/g, '');
                    const findValue = (row, aliases) => {
                        const keys = Object.keys(row);
                        const key = keys.find(k => aliases.includes(normHeader(k)));
                        return key == null ? '' : row[key];
                    };
                    const parseQty = value => this.strictQty(value, 0);
                    const parseDate = value => this.strictDateOnly(value, this.getISODateOnly());

                    const imported = rows.map((row, index) => {
                        const nama = String(findValue(row, ['namabarang','nama','item','deskripsi','namasparepart'])).trim();
                        const kodeRaw = String(findValue(row, ['kodebarang','kode','sku','nomorsku','nomorsku'])).trim();
                        const qty = parseQty(findValue(row, ['qtystockawal','qtystokawal','qty','stok','stock','stokawal','stockawal','stokakhir','stockakhir']));
                        const satuanRaw = String(findValue(row, ['satuanunit','satuan','unit','uom'])).trim();
                        const hargaRaw = findValue(row, ['hargasatuan','harga']);
                        const minStockRaw = findValue(row, ['bufferstok','buffer','minstock','stokminimum','minimumstok']);
                        const leadTimeRaw = findValue(row, ['leadtimedari','leadtime','leadtimedays']);
                        const lokasi = String(findValue(row, ['keteranganrak','lokasi','lokasirak','rak'])).trim();
                        if (!nama && !kodeRaw) return null;
                        return {
                            kode: (kodeRaw || `SKU-${Date.now()}-${index + 1}`).toUpperCase(),
                            nama: nama.toUpperCase(),
                            harga: Math.max(0, Number(hargaRaw) || 0),
                            minStock: parseQty(minStockRaw),
                            currentStock: qty,
                            stockAwal: qty,
                            tanggal: parseDate(findValue(row, ['tanggalinput','tanggal'])),
                            leadTime: parseQty(leadTimeRaw),
                            avgDailyUsage: Math.max(0, Number(findValue(row, ['pemakaianharian','avgdailyusage','pemakaianrataharian'])) || 0),
                            satuan: satuanRaw || 'Pcs',
                            lokasi: lokasi.toUpperCase(),
                            totalHarga: (Math.max(0, Number(hargaRaw) || 0)) * qty
                        };
                    }).filter(Boolean);

                    if (!imported.length) return alert('Tidak ada baris Data Master yang dapat dibaca dari file.');

                    // ==========================================================
                    // IMPORT DATA MASTER: MERGE, BUKAN REPLACE
                    // Identitas barang ditentukan oleh SKU/kode. Jika barang yang
                    // sama hanya berbeda SATUAN, cukup perbarui satuannya.
                    // Stok, harga, min stock, dan field lain dari data lama tidak
                    // ikut ditimpa hanya karena satuan pada file berbeda.
                    // ==========================================================
                    const normalizeMasterKey = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                    const existingMaster = Array.isArray(this.masterCatalog) ? this.masterCatalog : [];
                    const mergedMaster = [...existingMaster];
                    let addedCount = 0;
                    let satuanUpdatedCount = 0;

                    imported.forEach(row => {
                        const kodeKey = normalizeMasterKey(row.kode);
                        const namaKey = normalizeMasterKey(row.nama);
                        let index = -1;

                        if (kodeKey) {
                            index = mergedMaster.findIndex(item => normalizeMasterKey(item.kode) === kodeKey);
                        }
                        if (index < 0 && namaKey) {
                            index = mergedMaster.findIndex(item => normalizeMasterKey(item.nama) === namaKey);
                        }

                        if (index < 0) {
                            mergedMaster.push(row);
                            addedCount++;
                            return;
                        }

                        const existing = mergedMaster[index];
                        const importedSatuan = normalizeMasterKey(row.satuan);
                        const existingSatuan = normalizeMasterKey(existing.satuan);

                        // Jika identitas barang sama dan yang berbeda hanya satuan,
                        // ubah SATUAN SAJA. Jangan reset stok gudang/Data Master.
                        if (importedSatuan && importedSatuan !== existingSatuan) {
                            existing.satuan = row.satuan;
                            satuanUpdatedCount++;
                        }

                        // SKU/nama kosong di data lama boleh dilengkapi dari file,
                        // tetapi nilai stok tidak disentuh.
                        if (!String(existing.kode || '').trim() && row.kode) existing.kode = row.kode;
                        if (!String(existing.nama || '').trim() && row.nama) existing.nama = row.nama;
                    });

                    this.masterCatalog = mergedMaster;
                    this.masterPage = 1;
                    this.syncAllSatuanFromMaster();
                    await this.saveToSupabase();

                    const detail = [];
                    if (addedCount) detail.push(`${addedCount} barang baru`);
                    if (satuanUpdatedCount) detail.push(`${satuanUpdatedCount} satuan diperbarui`);
                    alert(`Import Data Master selesai. ${detail.length ? detail.join(', ') + '.' : 'Tidak ada perubahan identitas barang.'}`);
                } catch (err) {
                    console.error('Import Data Master gagal:', err);
                    alert('Data Master gagal diimport. Pastikan format file Excel sesuai.');
                } finally {
                    if (event?.target) event.target.value = '';
                }
            },
            deleteMaster(kode) {
                if (!this.canDeleteMaster) return alert('Akun Viewer hanya dapat melihat data.');
                const item = this.masterCatalog.find(i => String(i.kode) === String(kode));
                if (!item) return;
                if (!confirm(`Yakin ingin menghapus barang "${item.nama}"?`)) return;
                const deletedName = String(item.nama || '').trim().toLowerCase();
                this.masterCatalog = this.masterCatalog.filter(i => String(i.kode) !== String(kode));
                this.spareparts = this.spareparts.filter(s => String(s.kode || '') !== String(kode) && String(s.nama || '').trim().toLowerCase() !== deletedName);
                this.selectedMasterItems = (this.selectedMasterItems || []).filter(k => String(k) !== String(kode));
                this.selectAllMaster = false;
                this.normalizeMasterPage();
            },
            toggleSelectAllMaster() {
                if (!this.canDeleteMaster) return;
                this.selectAllMaster = !!this.selectAllMaster;
                this.selectedMasterItems = this.selectAllMaster
                    ? this.filteredMasterCatalog.map(item => item.kode)
                    : [];
            },
            deleteSelectedMaster() {
                if (!this.canDeleteMaster) return alert('Akun Viewer hanya dapat melihat data.');
                const selected = Array.isArray(this.selectedMasterItems) ? this.selectedMasterItems : [];
                if (!selected.length) return alert('Pilih minimal satu barang terlebih dahulu.');
                const selectedItems = this.masterCatalog.filter(item => selected.some(k => String(k) === String(item.kode)));
                const preview = selectedItems.slice(0, 5).map(item => item.nama).join('\n');
                const more = selectedItems.length > 5 ? `\n... dan ${selectedItems.length - 5} barang lainnya` : '';
                if (!confirm(`Yakin ingin menghapus ${selectedItems.length} barang?\n\n${preview}${more}`)) return;
                const deletedNames = new Set(selectedItems.map(item => String(item.nama || '').trim().toLowerCase()));
                this.masterCatalog = this.masterCatalog.filter(item => !selected.some(k => String(k) === String(item.kode)));
                this.spareparts = this.spareparts.filter(stock =>
                    !selected.some(k => String(k) === String(stock.kode)) &&
                    !deletedNames.has(String(stock.nama || '').trim().toLowerCase())
                );
                this.selectedMasterItems = [];
                this.selectAllMaster = false;
                this.normalizeMasterPage();
                alert(`${selectedItems.length} barang berhasil dihapus.`);
            },
            async deleteAllMaster() {
                if (!this.canDeleteMaster) return alert('Hanya Super Admin yang dapat menghapus seluruh Data Master.');
                const total = Array.isArray(this.masterCatalog) ? this.masterCatalog.length : 0;
                if (!total) return alert('Data Master masih kosong.');
                if (!confirm(`⚠️ PERINGATAN PENGHAPUSAN DATA MASTER\n\nAnda akan menghapus SELURUH ${total} Data Master.\n\nData Master dan data stok spare part terkait akan dihapus permanen dari sistem dan tidak dapat dikembalikan.\n\nApakah Anda benar-benar yakin ingin melanjutkan?`)) return;

                const previousMasterCatalog = JSON.parse(JSON.stringify(this.masterCatalog || []));
                const previousSpareparts = JSON.parse(JSON.stringify(this.spareparts || []));

                this.masterCatalog = [];
                this.spareparts = [];
                this.selectedMasterItems = [];
                this.selectAllMaster = false;
                this.masterPage = 1;
                this.normalizeMasterPage();

                const saved = await this.saveToSupabase();
                if (!saved) {
                    this.masterCatalog = previousMasterCatalog;
                    this.spareparts = previousSpareparts;
                    this.normalizeMasterPage();
                    return alert('Hapus Semua gagal disimpan ke database. Data Master dikembalikan seperti semula.');
                }

                alert(`${total} Data Master berhasil dihapus.`);
            },
            openMonitoringInputModal() {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                this.formOrderMulti = {
                    tanggal: this.getISODateOnly(),
                    nomorPR: '',
                    nomorPO: '',
                    supplier: '',
                    pemesan: '',
                    prioritas: '',
                    keperluan: '',
                    itemsToProcess: [{ nama: '', orderQty: 1, orderSatuan: 'Pcs', harga: 0, keperluan: '' }]
                };
                this.showMonitoringInputModal = true;
                this.$nextTick(() => this.refreshIcons());
            },
            async confirmApprovalForm() {
                if (!this.canApprove) return alert('Hanya Super Admin yang dapat menyetujui transaksi.');
                const form = this.approvalForm || {};
                const target = this.logs.find(x => String(x.id) === String(form.log?.id));
                if (!target) return alert('Transaksi approval tidak ditemukan.');
                if (!this.isPendingLog(target)) return alert('Transaksi ini sudah diproses.');
                if (!form.tanggal) return alert('Tanggal wajib diisi.');
                if (!form.nama) return alert('Nama barang wajib diisi.');
                if (!Number.isFinite(Number(form.qty)) || Number(form.qty) <= 0) return alert('Qty harus lebih dari 0.');
                if (!form.keperluan || !String(form.keperluan).trim()) return alert('Kepentingan / Keterangan wajib diisi.');
                if (String(form.jenis || '').includes('INBOUND') && !String(form.supplier || '').trim()) return alert('Supplier / Asal Barang wajib diisi untuk transaksi masuk.');
                if (String(form.jenis || '').includes('OUTBOUND') && !String(form.penerima || '').trim()) return alert('Nama Penerima wajib diisi untuk transaksi keluar.');
                target.tgl = this.getFormattedDateOnly(this.getDateFromInput(form.tanggal));
                target.isoDate = new Date(this.getDateFromInput(form.tanggal)).toISOString();
                target.qty = Number(form.qty);
                target.harga = Math.max(0, Number(form.harga) || 0);
                target.totalHarga = target.harga * target.qty;
                target.satuan = String(this.getMasterSatuan(target.nama, form.satuan || target.satuan || 'Pcs') || 'Pcs').trim().toUpperCase();
                target.supplier = String(form.supplier || target.supplier || '').trim().toUpperCase();
                target.penerima = String(form.penerima || target.penerima || '').trim().toUpperCase();
                target.keperluan = String(form.keperluan || target.keperluan || '').trim().toUpperCase();
                this.showApprovalFormModal = false;
                this.approvalForm = { log: null, tanggal: '', nomorPR: '', gudang: '', jenis: '', nama: '', qty: 0, harga: 0, satuan: '', supplier: '', pengambil: '', penerima: '', keperluan: '' };
                await this.approveTransaction(target);
            },
            masterSortArrow(key) {
                if (key === 'no') return this.masterSort === 'no_asc' ? '↑' : (this.masterSort === 'no_desc' ? '↓' : '↕');
                if (key === 'rak') return this.masterSort === 'rak_asc' ? '↑' : (this.masterSort === 'rak_desc' ? '↓' : '↕');
                if (key === 'nama') return this.masterSort === 'nama_asc' ? '↑' : (this.masterSort === 'nama_desc' ? '↓' : '↕');
                if (key === 'stock') return this.masterSort === 'stock_asc' ? '↑' : (this.masterSort === 'stock_desc' ? '↓' : '↕');
                if (key === 'harga') return this.masterSort === 'harga_asc' ? '↑' : (this.masterSort === 'harga_desc' ? '↓' : '↕');
                if (key === 'buffer') return this.masterSort === 'buffer_asc' ? '↑' : (this.masterSort === 'buffer_desc' ? '↓' : '↕');
                return '↕';
            },
            setMasterSort(key) {
                if (typeof key !== 'string') return;
                const ascKey = key + '_asc';
                const descKey = key + '_desc';
                this.masterSort = this.masterSort === ascKey ? descKey : ascKey;
                this.masterPage = 1;
            },
            openMasterEdit(item) {
                if (!this.canEdit || !item) return;
                this.editingMaster = { ...item, _originalNama: item.nama || '' };
                this.showMasterEditModal = true;
                this.$nextTick(() => this.refreshIcons());
            },
            closeMasterEdit() {
                this.showMasterEditModal = false;
                this.editingMaster = null;
            },
            async saveMasterEdit() {
                if (!this.canEdit || !this.editingMaster) return;
                const normalize = value => String(value || '').trim().toLowerCase();
                const target = this.masterCatalog.find(item => item === this.editingMaster || (normalize(item.kode) && normalize(item.kode) === normalize(this.editingMaster.kode)) || (normalize(item.nama) === normalize(this.editingMaster._originalNama)));
                if (!target) return alert('Data Master tidak ditemukan.');
                const nama = String(this.editingMaster.nama || '').trim();
                if (!nama) return alert('Nama Barang wajib diisi.');
                const qty = Math.max(0, Math.round(Number(this.editingMaster.currentStock) || 0));
                const proposed = {
                    ...this.editingMaster,
                    kode: String(this.editingMaster.kode || '').trim().toUpperCase(),
                    nama: nama.toUpperCase(),
                    currentStock: qty,
                    stockAwal: Math.max(0, Math.round(Number(this.editingMaster.stockAwal ?? qty) || 0)),
                    minStock: Math.max(0, Math.round(Number(this.editingMaster.minStock) || 0)),
                    harga: Math.max(0, Number(this.editingMaster.harga) || 0),
                    leadTime: Math.max(0, Math.round(Number(this.editingMaster.leadTime) || 0)),
                    satuan: String(this.editingMaster.satuan || '').trim() || 'Pcs',
                    lokasi: String(this.editingMaster.lokasi || '').trim().toUpperCase()
                };
                delete proposed._originalNama;
                proposed.totalHarga = proposed.harga * proposed.currentStock;

                if (this.authRole === 'admin') {
                    const alreadyPending = (this.masterApprovalRequests || []).find(req => String(req.approvalStatus || 'pending').toLowerCase() === 'pending' && ((req.targetKode && normalize(req.targetKode) === normalize(target.kode)) || (req.targetNama && normalize(req.targetNama) === normalize(target.nama))));
                    if (alreadyPending) return alert('Perubahan Data Master untuk barang ini masih menunggu persetujuan Super Admin.');
                    this.masterApprovalRequests.push({
                        id: 'MST-APP-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
                        targetKode: target.kode || '',
                        targetNama: target.nama || '',
                        before: JSON.parse(JSON.stringify(target)),
                        after: proposed,
                        createdBy: this.authUser?.email || this.authUser?.id || 'Admin',
                        createdAt: new Date().toISOString(),
                        approvalStatus: 'pending'
                    });
                    this.closeMasterEdit();
                    const saved = await this.saveToSupabase();
                    if (!saved) return alert('Pengajuan perubahan Data Master dibuat di layar, tetapi gagal disimpan ke database.');
                    alert('Perubahan Data Master dikirim ke Approval dan menunggu persetujuan Super Admin.');
                    return;
                }

                Object.assign(target, proposed);
                this.closeMasterEdit();
                const saved = await this.saveToSupabase();
                if (!saved) return alert('Data Master berubah di layar, tetapi gagal disimpan ke database.');
                alert('Data Master berhasil diperbarui.');
            },
            addManualItemToMonitoring() {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                this.formOrderMulti.itemsToProcess.push({
                    nama: '',
                    orderQty: 1,
                    orderSatuan: 'Pcs',
                    harga: 0
                });
            },
            openSparepartOutDropdown(idx, item) {
                this.activeSparepartOutDropdown = idx;
                this.sparepartOutDropdownQuery = String(item?.nama || '');
                this.onSparepartMultiOutItemInput(item);
                this.$nextTick(() => this.updateSparepartOutDropdownPosition(idx));
            },
            updateSparepartOutDropdown(idx, item) {
                this.activeSparepartOutDropdown = idx;
                this.sparepartOutDropdownQuery = String(item?.nama || '');
                this.onSparepartMultiOutItemInput(item);

                clearTimeout(this._sparepartOutDropdownRenderTimer);
                this._sparepartOutDropdownRenderTimer = setTimeout(() => {
                    this.$nextTick(() => this.updateSparepartOutDropdownPosition(idx));
                }, 50);
            },
            updateSparepartOutDropdownPosition(idx) {
                const el = this.$el.querySelector('[data-sparepart-out-input="' + idx + '"]');
                if (!el) return;
                const r = el.getBoundingClientRect();
                const width = Math.max(r.width, 280);
                let left = r.left;
                if (left + width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - width - 8);
                const spaceBelow = window.innerHeight - r.bottom - 8;
                const spaceAbove = r.top - 8;
                const openAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
                const maxH = Math.min(300, Math.max(100, openAbove ? spaceAbove : spaceBelow));
                const top = openAbove ? Math.max(8, r.top - maxH - 4) : r.bottom + 4;
                this.sparepartOutDropdownStyle = { left: left + 'px', top: top + 'px', width: width + 'px', maxHeight: maxH + 'px', zIndex: 2147483647, position: 'fixed', pointerEvents: 'auto' };
            },
            selectSparepartOutItem(idx, item, master) {
                item.nama = master.nama;
                item.barcode = master.barcode || '';
                item.qty = Number(master.qty) || 0;
                item.satuan = master.satuan || 'Pcs';
                if (Number(item.outQty) > item.qty) item.outQty = item.qty || 1;
                this.sparepartOutDropdownQuery = '';
                this.activeSparepartOutDropdown = null;
                this.masterDropdownKey = '';
                this.masterAutocompleteQuery = '';
            },
            openMasterDropdown(key, item, event) {
                this.masterDropdownKey = key;
                this.masterDropdownItem = item;
                this.masterAutocompleteQuery = event?.target?.value ?? item?.nama ?? '';
                this.$nextTick(() => this.updateMasterDropdownPosition(event?.target));
            },
            updateMasterDropdown(key, item, event) {
                this.masterDropdownKey = key;
                this.masterDropdownItem = item;
                this.masterAutocompleteQuery = event?.target?.value ?? item?.nama ?? '';

                clearTimeout(this._masterDropdownRenderTimer);
                const target = event?.target;
                this._masterDropdownRenderTimer = setTimeout(() => {
                    this.$nextTick(() => this.updateMasterDropdownPosition(target));
                }, 50);
            },
            updateMasterDropdownPosition(el) {
                if (!el) return;
                const r = el.getBoundingClientRect();
                const width = Math.max(r.width, 280);
                let left = r.left;
                if (left + width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - width - 8);
                const spaceBelow = window.innerHeight - r.bottom - 8;
                const spaceAbove = r.top - 8;
                const openAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
                const maxH = Math.min(300, Math.max(120, openAbove ? spaceAbove : spaceBelow));
                const top = openAbove ? Math.max(8, r.top - maxH - 4) : r.bottom + 4;
                this.masterDropdownStyle = { left: left + 'px', top: top + 'px', width: width + 'px', maxHeight: maxH + 'px' };
            },
            repositionMasterDropdown() {
                if (!this.masterDropdownKey || !this.masterDropdownItem) return;
                const el = this.$el.querySelector('[data-master-dropdown-input="' + this.masterDropdownKey + '"]');
                if (el) this.updateMasterDropdownPosition(el);
            },
            async selectMasterItem(master) {
                const item = this.masterDropdownItem;
                if (!item) return;
                const key = String(this.masterDropdownKey || '');

                if (key.startsWith('planning-request-')) {
                    if (!(await this.confirmPlanningDuplicateIfNeededAsync('request', item, master))) return;
                    this.applyPlanningMaster(item, master);
                    this.masterAutocompleteQuery = master.nama || '';
                } else if (key.startsWith('planning-usage-')) {
                    if (!(await this.confirmPlanningDuplicateIfNeededAsync('usage', item, master))) return;
                    this.applyPlanningUsageMaster(item, master);
                    this.masterAutocompleteQuery = master.nama || '';
                } else {
                    item.nama = master.nama;
                    item.satuan = master.satuan || item.satuan || 'Pcs';
                    this.masterAutocompleteQuery = master.nama || '';
                    if (key.startsWith('sparepart-out-')) this.onSparepartMultiOutItemInput(item);
                    if (key.startsWith('sisa-out-')) this.onSisaProjectMultiOutItemInput(item);
                    if (key.startsWith('monitoring-')) this.onMonitoringItemInput(item);
                }
                this.masterDropdownKey = '';
                this.masterDropdownItem = null;
                this.masterDropdownField = '';
            },
            scheduleCloseMasterDropdown(key) {
                window.clearTimeout(this._masterDropdownCloseTimer);
                this._masterDropdownCloseTimer = window.setTimeout(() => {
                    if (this.masterDropdownKey === key) {
                        this.closeMasterDropdown();
                        this.planningAutocompleteResults = [];
                    }
                }, 60);
            },
            closeMasterDropdown() {
                window.clearTimeout(this._masterDropdownCloseTimer);
                this.masterDropdownKey = '';
                this.masterDropdownItem = null;
                this.masterDropdownField = '';
            },
            repositionSparepartOutDropdown() {
                if (this.activeSparepartOutDropdown === null) return;
                this.$nextTick(() => this.updateSparepartOutDropdownPosition(this.activeSparepartOutDropdown));
            },
            refreshIcons() {
                if (this._iconRefreshPending) return;
                this._iconRefreshPending = true;
                this.$nextTick(() => {
                    requestAnimationFrame(() => {
                        this._iconRefreshPending = false;
                        if (window.lucide) lucide.createIcons();
                    });
                });
            },
            sortMasterCatalog() {
                // Urutkan hanya saat data master berubah, bukan pada setiap render/search.
                this.masterCatalog.sort((a, b) =>
                    String(a.nama || '').localeCompare(String(b.nama || ''), 'id', { sensitivity: 'base' })
                );
            },
            normalizeMasterPage() {
                if (this.masterPage > this.masterPageCount) {
                    this.masterPage = this.masterPageCount;
                }
            },
            getDeviceId() {
                if (this.deviceId) return this.deviceId;
                const key = 'agrofarm_inventory_device_id';
                try {
                    let id = localStorage.getItem(key);
                    if (!id) {
                        if (window.crypto?.randomUUID) id = window.crypto.randomUUID();
                        else id = 'device-' + Date.now() + '-' + Math.random().toString(36).slice(2);
                        localStorage.setItem(key, id);
                    }
                    this.deviceId = id;
                } catch (_) {
                    this.deviceId = 'device-' + Date.now() + '-' + Math.random().toString(36).slice(2);
                }
                return this.deviceId;
            },
            async registerDeviceSession() {
                const client = this.getSupabaseClient();
                if (!client || !this.authUser?.id) return { ok: true };
                try {
                    const { data, error } = await client.rpc('register_device_session', { p_device_id: this.getDeviceId() });
                    if (error) throw error;
                    return data || { ok: false, message: 'Perangkat tidak dapat didaftarkan.' };
                } catch (err) {
                    console.error('Registrasi device gagal:', err);
                    // Jika RPC belum dipasang, jangan mengunci login lama secara diam-diam.
                    if (String(err?.message || '').toLowerCase().includes('register_device_session')) {
                        return { ok: true, setupRequired: true };
                    }
                    return { ok: false, message: err?.message || 'Perangkat tidak dapat didaftarkan.' };
                }
            },
            async touchDeviceSession() {
                if (!this.isAuthenticated || !this.authUser?.id) return true;
                const client = this.getSupabaseClient();
                if (!client) return false;
                try {
                    const { data, error } = await client.rpc('touch_device_session', { p_device_id: this.getDeviceId() });
                    if (error) throw error;
                    if (data?.ok === false) {
                        await this.logout(data.message || 'Sesi perangkat sudah berakhir. Silakan login kembali.');
                        return false;
                    }
                    if (data?.timeout_hours) this.securitySettings.session_timeout_hours = Number(data.timeout_hours) || 24;
                    return true;
                } catch (err) {
                    console.error('Pemeriksaan device session gagal:', err);
                    // Fail closed: jangan biarkan sesi aktif jika status device tidak dapat diverifikasi.
                    await this.logout('Sesi perangkat tidak dapat diverifikasi. Silakan login kembali.');
                    return false;
                }
            },
            async ensureFreshAuthorization(requiredRole = null) {
                const client = this.getSupabaseClient();
                if (!client || !this.isAuthenticated || !this.authUser?.id) {
                    return { ok: false, message: 'Sesi login tidak valid. Silakan login kembali.' };
                }
                try {
                    const { data: sessionData, error: sessionError } = await client.auth.getSession();
                    if (sessionError || !sessionData?.session?.user?.id) {
                        return { ok: false, message: 'Sesi login sudah berakhir. Silakan login kembali.' };
                    }
                    const userId = sessionData.session.user.id;
                    const { data: profile, error: profileError } = await client
                        .from('profiles')
                        .select('role,active')
                        .eq('id', userId)
                        .maybeSingle();
                    if (profileError) throw profileError;
                    if (!profile || profile.active === false) {
                        await this.logout('Akun tidak aktif atau profil tidak ditemukan.');
                        return { ok: false, message: 'Akun tidak aktif atau profil tidak ditemukan.' };
                    }
                    const role = String(profile.role || 'viewer').trim().toLowerCase();
                    const normalizedRequired = requiredRole ? String(requiredRole).trim().toLowerCase() : null;
                    if (normalizedRequired && role !== normalizedRequired) {
                        return { ok: false, message: 'Anda tidak memiliki hak akses untuk tindakan ini.' };
                    }
                    if (role === 'viewer' && requiredRole !== 'viewer') {
                        return { ok: false, message: 'Viewer tidak memiliki hak untuk mengubah data.' };
                    }
                    this.authUser = sessionData.session.user;
                    this.authRole = role;
                    return { ok: true, role, session: sessionData.session };
                } catch (err) {
                    console.error('Verifikasi otorisasi gagal:', err);
                    return { ok: false, message: 'Otorisasi tidak dapat diverifikasi. Silakan login kembali.' };
                }
            },
            startDeviceHeartbeat() {
                this.stopDeviceHeartbeat();
                this.getDeviceId();
                this.touchDeviceSession();
                this.deviceHeartbeatTimer = window.setInterval(() => {
                    if (this.isAuthenticated) this.touchDeviceSession();
                }, 30 * 1000);
            },
            stopDeviceHeartbeat() {
                if (this.deviceHeartbeatTimer) {
                    clearInterval(this.deviceHeartbeatTimer);
                    this.deviceHeartbeatTimer = null;
                }
            },
            async loadSecuritySettings() {
                if (!this.canManageAccounts) return;
                const client = this.getSupabaseClient();
                if (!client) return;
                try {
                    const { data, error } = await client.rpc('get_security_settings');
                    if (error) throw error;
                    if (data) this.securitySettings = {
                        max_super_admin_devices: Number(data.max_super_admin_devices) || 1,
                        max_admin_devices: Number(data.max_admin_devices) || 5,
                        max_viewer_devices: Number(data.max_viewer_devices) || 10,
                        session_timeout_hours: Number(data.session_timeout_hours) || 24
                    };
                } catch (err) {
                    console.error('Gagal memuat pengaturan keamanan:', err);
                }
            },
            async saveSecuritySettings() {
                const authz = await this.ensureFreshAuthorization('super_admin');
                if (!authz.ok) return alert(authz.message);
                const client = this.getSupabaseClient();
                if (!client) return;
                const maxSuper = Math.max(1, Math.min(100, Number(this.securitySettings.max_super_admin_devices) || 1));
                const maxAdmin = Math.max(1, Math.min(100, Number(this.securitySettings.max_admin_devices) || 5));
                const maxViewer = Math.max(1, Math.min(100, Number(this.securitySettings.max_viewer_devices) || 10));
                const timeout = Math.max(1, Math.min(720, Number(this.securitySettings.session_timeout_hours) || 24));
                this.securitySettingsSaving = true;
                this.securitySettingsMessage = '';
                try {
                    const { error } = await client.rpc('save_security_settings', {
                        p_max_super_admin_devices: maxSuper,
                        p_max_admin_devices: maxAdmin,
                        p_max_viewer_devices: maxViewer,
                        p_session_timeout_hours: timeout
                    });
                    if (error) throw error;
                    this.securitySettings = {
                        max_super_admin_devices: maxSuper,
                        max_admin_devices: maxAdmin,
                        max_viewer_devices: maxViewer,
                        session_timeout_hours: timeout
                    };
                    this.securitySettingsMessage = 'Pengaturan keamanan berhasil disimpan.';
                } catch (err) {
                    this.securitySettingsMessage = 'Gagal menyimpan: ' + (err?.message || 'Terjadi kesalahan.');
                } finally {
                    this.securitySettingsSaving = false;
                }
            },
            async initAuth() {
                const client = this.getSupabaseClient();
                if (!client) {
                    this.authReady = true;
                    this.authError = 'Supabase belum dikonfigurasi.';
                    return;
                }
                try {
                    // Batasi waktu pemeriksaan sesi agar overlay auth tidak mengunci seluruh halaman.
                    const sessionResult = await Promise.race([
                        client.auth.getSession(),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('AUTH_TIMEOUT')), 5000))
                    ]);
                    const { data: { session } } = sessionResult;
                    await this.handleAuthSession(session);
                    const { data: listener } = client.auth.onAuthStateChange(async (_event, session) => {
                        await this.handleAuthSession(session);
                    });
                    this.supabaseAuthListener = listener;
                } catch (err) {
                    console.error('Gagal memeriksa sesi:', err);
                    this.authError = err?.message === 'AUTH_TIMEOUT'
                        ? 'Pemeriksaan sesi terlalu lama. Silakan login kembali.'
                        : 'Sesi login tidak dapat diperiksa.';
                    this.authRole = 'viewer';
                    this.isAuthenticated = false;
                    this.authReady = true;
                }
            },
            async handleAuthSession(session) {
                this.authUser = session?.user || null;
                this.isAuthenticated = !!session?.user;
                if (!session?.user) {
                    this.unsubscribeSupabaseRealtime();
                    this.authRole = 'viewer';
                    this.authReady = true;
                    return;
                }
                try {
                    const client = this.getSupabaseClient();
                    const { data, error } = await client.from('profiles').select('role,active').eq('id', session.user.id).maybeSingle();
                    if (error) throw error;
                    if (data?.active === false) {
                        await client.auth.signOut();
                        this.authError = 'Akun ini dinonaktifkan oleh Super Admin.';
                        this.authRole = 'viewer';
                        this.isAuthenticated = false;
                    } else {
                        this.authRole = data?.role || 'viewer';
                        this.authError = '';
                        const deviceResult = await this.registerDeviceSession();
                        if (deviceResult?.ok === false) {
                            const message = deviceResult.message || 'Batas perangkat untuk akun ini sudah tercapai.';
                            await client.auth.signOut();
                            this.authError = message;
                            this.authRole = 'viewer';
                            this.isAuthenticated = false;
                            this.stopDeviceHeartbeat();
                            return;
                        }
                    }
                } catch (err) {
                    console.error('Gagal mengambil role:', err);
                    this.authRole = 'viewer';
                } finally {
                    this.authReady = true;
                    if (this.isAuthenticated) this.startDeviceHeartbeat();
                    this.subscribeSupabaseRealtime();
                    if (this.canManageAccounts) this.loadSecuritySettings();
                    this.$nextTick(() => this.refreshIcons());
                }
            },
            async login() {
                const client = this.getSupabaseClient();
                if (!client) return;
                this.authLoading = true;
                this.authError = '';
                try {
                    const { error } = await client.auth.signInWithPassword({
                        email: this.loginForm.email.trim(),
                        password: this.loginForm.password
                    });
                    if (error) throw error;
                    this.loginForm.password = '';
                    await this.loadFromSupabase();
                    this.subscribeSupabaseRealtime();
                } catch (err) {
                    console.error('Login gagal:', err);
                    this.authError = err?.message || 'Email atau password salah.';
                } finally {
                    this.authLoading = false;
                }
            },
            async logout(reason = '') {
                const client = this.getSupabaseClient();
                if (client && this.authUser?.id) {
                    try { await client.rpc('release_device_session', { p_device_id: this.getDeviceId() }); } catch (_) {}
                    await client.auth.signOut();
                }
                this.stopDeviceHeartbeat();
                this.unsubscribeSupabaseRealtime();
                this.activeTab = 'dashboard';
                this.userAccounts = [];
                if (reason) this.authError = reason;
            },
            async loadUserAccounts() {
                if (!this.canManageAccounts) return;
                const client = this.getSupabaseClient();
                if (!client) return;
                try {
                    const { data, error } = await client.from('profiles').select('id,email,role,active').order('email');
                    if (error) throw error;
                    this.userAccounts = data || [];
                } catch (err) {
                    this.accountError = err?.message || 'Gagal memuat daftar akun.';
                }
            },
            async createUserAccount() {
                if (!this.canManageAccounts) return alert('Hanya Super Admin yang dapat membuat akun.');
                const client = this.getSupabaseClient();
                if (!client) return;
                const email = this.newAccount.email.trim();
                const password = this.newAccount.password;
                if (!email || !password || password.length < 6) return alert('Email dan password minimal 6 karakter wajib diisi.');
                this.authLoading = true;
                this.accountError = '';
                this.accountMessage = '';
                const currentSession = (await client.auth.getSession()).data.session;
                try {
                    const { data, error } = await client.auth.signUp({ email, password });
                    if (error) throw error;
                    if (data?.user?.id) {
                        const { error: profileError } = await client.from('profiles').upsert({
                            id: data.user.id,
                            email: email,
                            role: this.newAccount.role,
                            active: true
                        }, { onConflict: 'id' });
                        if (profileError) throw profileError;
                    }
                    if (currentSession) {
                        await client.auth.setSession({
                            access_token: currentSession.access_token,
                            refresh_token: currentSession.refresh_token
                        });
                    }
                    this.newAccount = { email: '', password: '', role: 'admin' };
                    this.showNewAccountPassword = false;
                    this.accountMessage = 'Akun berhasil dibuat. Jika email confirmation aktif, akun perlu melakukan konfirmasi email terlebih dahulu.';
                    await this.loadUserAccounts();
                } catch (err) {
                    console.error('Gagal membuat akun:', err);
                    this.accountError = err?.message || 'Akun gagal dibuat.';
                    if (currentSession) {
                        try { await client.auth.setSession({ access_token: currentSession.access_token, refresh_token: currentSession.refresh_token }); } catch (_) {}
                    }
                } finally {
                    this.authLoading = false;
                }
            },
            openPasswordChange(account) {
                if (!this.canManageAccounts || !account) return;
                this.passwordChange = { userId: account.id, email: account.email || account.id, password: '' };
                this.showChangedPassword = false;
                this.showPasswordChangeModal = true;
                this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
            },
            closePasswordChange() {
                this.showPasswordChangeModal = false;
                this.showChangedPassword = false;
                this.passwordChange = { userId: '', email: '', password: '' };
            },
            async changeUserPassword() {
                if (!this.canManageAccounts) return alert('Hanya Super Admin yang dapat mengganti password.');
                const password = this.passwordChange.password;
                if (!this.passwordChange.userId || !password || password.length < 6) return alert('Password baru minimal 6 karakter wajib diisi.');
                const client = this.getSupabaseClient();
                if (!client) return;
                this.passwordChangeSaving = true;
                this.accountError = '';
                this.accountMessage = '';
                try {
                    const { data: sessionData, error: sessionError } = await client.auth.getSession();
                    if (sessionError || !sessionData?.session?.access_token) throw new Error('Sesi Super Admin tidak ditemukan. Silakan login kembali.');
                    const response = await fetch(`${window.SUPABASE_URL}/functions/v1/admin-change-password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionData.session.access_token}`
                        },
                        body: JSON.stringify({ user_id: this.passwordChange.userId, password })
                    });
                    const result = await response.json().catch(() => ({}));
                    if (!response.ok) throw new Error(result?.error || 'Gagal mengganti password.');
                    this.accountMessage = `Password akun ${this.passwordChange.email} berhasil diganti.`;
                    this.closePasswordChange();
                } catch (err) {
                    console.error('Gagal mengganti password:', err);
                    this.accountError = err?.message || 'Password gagal diganti.';
                } finally {
                    this.passwordChangeSaving = false;
                }
            },
            async saveAccountSettings(account) {
                const authz = await this.ensureFreshAuthorization('super_admin');
                if (!authz.ok || !account || account.id === this.authUser?.id) return;
                const client = this.getSupabaseClient();
                const { error } = await client.from('profiles').update({
                    role: account.role,
                    active: account.active !== false
                }).eq('id', account.id);
                if (error) {
                    this.accountError = error.message;
                    await this.loadUserAccounts();
                }
            },
            async toggleAccountActive(account) {
                if (!this.canManageAccounts || !account || account.id === this.authUser?.id) return;
                account.active = account.active === false;
                await this.saveAccountSettings(account);
            },
            async approveMasterEdit(request) {
                const deviceOk = await this.touchDeviceSession();
                if (!deviceOk) return;
                const authz = await this.ensureFreshAuthorization('super_admin');
                if (!authz.ok) return alert(authz.message);
                if (!request || String(request.approvalStatus || 'pending').toLowerCase() !== 'pending') return;
                const approvalAuth = await this.getSupabaseClient().rpc('authorize_inventory_approval', { p_action: 'approve' });
                if (approvalAuth?.error || approvalAuth?.data?.ok !== true) {
                    return alert(approvalAuth?.error?.message || approvalAuth?.data?.message || 'Approval Data Master tidak diizinkan oleh server.');
                }
                try {
                    const normalize = value => String(value || '').trim().toLowerCase();
                    const target = this.masterCatalog.find(item => (request.targetKode && normalize(item.kode) === normalize(request.targetKode)) || (request.targetNama && normalize(item.nama) === normalize(request.targetNama)));
                    if (!target) throw new Error('Data Master yang akan diubah tidak ditemukan.');
                    Object.assign(target, JSON.parse(JSON.stringify(request.after || {})));
                    target.totalHarga = (Number(target.harga) || 0) * (Number(target.currentStock) || 0);
                    request.approvalStatus = 'approved';
                    request.approvedBy = this.authUser?.email || this.authUser?.id || 'Super Admin';
                    request.approvedAt = new Date().toISOString();
                    const saved = await this.saveToSupabase();
                    if (!saved) throw new Error('Perubahan approval Data Master tidak berhasil disimpan ke server.');
                    alert('Perubahan Data Master berhasil disetujui dan diterapkan.');
                } catch (err) {
                    console.error('Approval Data Master gagal:', err);
                    alert(err?.message || 'Perubahan Data Master gagal disetujui.');
                }
            },
            async approveTransaction(log) {
                const deviceOk = await this.touchDeviceSession();
                if (!deviceOk) return;
                const authz = await this.ensureFreshAuthorization('super_admin');
                if (!authz.ok) return alert(authz.message);
                const { data: approvalAuth, error: approvalAuthError } = await this.getSupabaseClient().rpc('authorize_inventory_approval', {
                    p_action: 'approve'
                });
                if (approvalAuthError || approvalAuth?.ok !== true) {
                    return alert(approvalAuthError?.message || approvalAuth?.message || 'Approval tidak diizinkan oleh server.');
                }
                if (!log || !this.isPendingLog(log)) return;
                const client = this.getSupabaseClient();
                try {
                    // Ambil status terbaru sebelum memproses agar approval ganda dari tab/perangkat lain ditolak.
                    const latest = this.logs.find(x => String(x.id) === String(log.id));
                    if (!latest || !this.isPendingLog(latest)) {
                        throw new Error('Transaksi sudah diproses atau statusnya telah berubah. Silakan muat ulang data.');
                    }
                    log = latest;
                    if (log.type === 'IN' && log.monitoringOrderId) {
                        const order = this.monitoringItems.find(o => String(o.id) === String(log.monitoringOrderId));
                        if (!order) throw new Error('Purchase Request tidak ditemukan.');
                        const qty = Number(log.qty) || 0;
                        if (qty <= 0 || qty > Number(order.qtyRemaining)) throw new Error('Qty penerimaan tidak valid terhadap sisa order.');
                        let stockItem = this.spareparts.find(s => String(s.nama).toLowerCase() === String(log.nama).toLowerCase());
                        if (stockItem) {
                            stockItem.qty = (Number(stockItem.qty) || 0) + qty;
                            stockItem.harga = this.getMasterHarga(log.nama, log.harga);
                            stockItem.totalHarga = stockItem.harga * stockItem.qty;
                        } else {
                            this.spareparts.push({
                                barcode: 'SP-' + String(this.spareparts.length + 1).padStart(3, '0'),
                                nama: log.nama,
                                qty: qty,
                                harga: this.getMasterHarga(log.nama, log.harga),
                                totalHarga: this.getMasterHarga(log.nama, log.harga) * qty,
                                minStock: this.calculateMinimumStock(log.nama),
                                lokasi: 'RAK UTAMA',
                                satuan: log.satuan || 'Pcs'
                            });
                        }
                        order.qtyReceived = (Number(order.qtyReceived) || 0) + qty;
                        order.qtyRemaining = Math.max(0, (Number(order.qtyRemaining) || 0) - qty);
                        order.status = order.qtyRemaining <= 0 ? 'Diterima Semua' : 'Diterima Sebagian';
                        const hist = this.monitoringHistory.find(h => String(h.id) === String(log.monitoringHistoryId));
                        if (hist) hist.status = order.status;
                        const linkedStock = this.spareparts.find(s => String(s.nama).toLowerCase() === String(log.nama).toLowerCase());
                        this.syncMasterStockForSparepart(linkedStock);
                    } else {
                        const list = log.gudang === 'Sparepart' ? this.spareparts : this.sisaProjects;
                        const normalizeApprovalKey = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                        let stockItem = log.gudang === 'Sisa Project'
                            ? list.find(s => (log.barcode && String(s.barcode || '') === String(log.barcode)) || normalizeApprovalKey(s.nama) === normalizeApprovalKey(log.nama))
                            : list.find(s => normalizeApprovalKey(s.nama) === normalizeApprovalKey(log.nama));
                        const qty = Number(log.qty) || 0;
                        if (log.type === 'IN') {
                            if (stockItem) {
                                stockItem.qty = (Number(stockItem.qty) || 0) + qty;
                                stockItem.harga = this.getMasterHarga(log.nama, log.harga);
                            } else {
                                list.push({
                                    barcode: (log.gudang === 'Sparepart' ? 'SP-' : 'SPJ-') + String(list.length + 1).padStart(3, '0'),
                                    nama: log.nama,
                                    qty: qty,
                                    stockAwal: 0,
                                    harga: this.getMasterHarga(log.nama, log.harga),
                                    totalHarga: this.getMasterHarga(log.nama, log.harga) * qty,
                                    minStock: this.calculateMinimumStock(log.nama),
                                    lokasi: log.gudang === 'Sparepart' ? 'RAK UTAMA' : (log.lokasi || 'RAK SISA'),
                                    satuan: log.satuan || 'Pcs',
                                    supplier: log.supplier || log.asal || '',
                                    keperluan: log.keperluan || log.project || '-'
                                });
                            }
                            if (log.gudang === 'Sparepart') this.syncMasterStockForSparepart(stockItem || list.find(s => s.nama === log.nama));
                        } else if (log.type === 'OUT') {
                            if (!stockItem) throw new Error('Barang tidak ditemukan di stok.');
                            const availableForApproval = this.getAvailableOutboundStock(log.gudang, stockItem, log.id);
                            if (qty > availableForApproval) {
                                throw new Error(`Stok saat ini tidak mencukupi untuk persetujuan transaksi. Stok yang masih tersedia setelah reservasi transaksi lain: ${availableForApproval}.`);
                            }

                            // VALIDASI BERDASARKAN STOK TERKINI, BUKAN STOCK AWAL.
                            // stockItem.qty adalah saldo gudang terakhir setelah transaksi
                            // yang sudah disetujui. Jadi transaksi kedua/ketiga dan seterusnya
                            // selalu memakai saldo terbaru, bukan kembali ke Data Master.
                            const currentStockBeforeApproval = Math.max(0, Number(stockItem.qty) || 0);
                            if (qty > currentStockBeforeApproval) {
                                throw new Error(`Stok ${log.nama} saat ini hanya ${currentStockBeforeApproval}. Qty keluar ${qty} tidak dapat disetujui.`);
                            }

                            stockItem.qty = currentStockBeforeApproval - qty;
                            stockItem.totalHarga = this.getMasterHarga(stockItem.nama, stockItem.harga) * stockItem.qty;
                            if (log.gudang === 'Sparepart') this.syncMasterStockForSparepart(stockItem);
                        }
                    }
                    log.approvalStatus = 'approved';
                    log.approvedBy = this.authUser?.email || this.authUser?.id || 'Super Admin';
                    log.approvedAt = new Date().toISOString();
                    const saved = await this.saveToSupabase();
                    if (!saved) throw new Error('Perubahan approval tidak berhasil disimpan ke server.');
                    alert('Transaksi berhasil disetujui dan stok diperbarui.');
                } catch (err) {
                    console.error('Persetujuan transaksi gagal:', err);
                    alert(err?.message || 'Transaksi gagal disetujui.');
                }
            },
            async cancelTransaction(log) {
                if (!log) return;
                if (!this.canEdit) return alert('Hanya Admin dan Super Admin yang dapat membatalkan transaksi.');

                // Ambil snapshot TERBARU dari server sebelum membatalkan. Karena seluruh
                // aplikasi memakai satu row inventory_state, ini mencegah Admin A melakukan
                // cancel lalu tertimpa state lama milik Admin B.
                const targetId = log.id;
                try {
                    await this.refreshFromSupabaseRealtime('', true);
                    const latestLog = this.logs.find(x => String(x.id) === String(targetId));
                    if (!latestLog) return alert('Transaksi sudah berubah atau tidak ditemukan pada data terbaru. Silakan refresh lalu coba lagi.');
                    log = latestLog;
                } catch (err) {
                    console.error('Gagal mengambil data terbaru sebelum cancel:', err);
                    return alert('Data terbaru dari Supabase gagal dimuat. Pembatalan dibatalkan agar data tidak tertimpa.');
                }
                if (this.isPendingLog(log)) {
                    const previousStatus = log.status;
                    const previousApprovalStatus = log.approvalStatus;
                    const previousIsCancelled = log.isCancelled;
                    const previousCancelledAt = log.cancelledAt;
                    const previousCancelledBy = log.cancelledBy;
                    const previousQty = log.qty;
                    const previousOriginalQty = log.originalQty;
                    log.status = 'Cancelled';
                    log.approvalStatus = 'cancelled';
                    log.isCancelled = true;
                    log.cancelledAt = new Date().toISOString();
                    log.cancelledBy = this.authUser?.email || this.authUser?.id || 'Super Admin';
                    log.originalQty = Number(previousOriginalQty ?? previousQty) || 0;
                    log.qty = 0;
                    log.qtyAkhir = log.qtyAwal ?? log.qtyAkhir ?? 0;
                    const savedPendingCancel = await this.saveToSupabase();
                    if (!savedPendingCancel) {
                        log.status = previousStatus;
                        log.approvalStatus = previousApprovalStatus;
                        if (previousIsCancelled === undefined) delete log.isCancelled; else log.isCancelled = previousIsCancelled;
                        if (previousCancelledAt === undefined) delete log.cancelledAt; else log.cancelledAt = previousCancelledAt;
                        if (previousCancelledBy === undefined) delete log.cancelledBy; else log.cancelledBy = previousCancelledBy;
                        if (previousQty === undefined) delete log.qty; else log.qty = previousQty;
                        if (previousOriginalQty === undefined) delete log.originalQty; else log.originalQty = previousOriginalQty;
                        return alert('Pembatalan gagal disimpan ke Supabase. Perubahan dibatalkan.');
                    }
                    return alert('Transaksi pending berhasil dibatalkan dan langsung disimpan ke Supabase.');
                }
                if (this.isCancelledLog(log)) return;
                if (!confirm(`Batalkan transaksi ${log.type === 'IN' ? 'Inbound' : 'Outbound'} ${log.nama} sebanyak ${log.qty}?\n\nStok dan perhitungan saldo akan dikembalikan.`)) return;

                const qty = Number(log.qty) || 0;
                const normalize = v => String(v || '').trim().toLowerCase().replace(/\s+/g, ' ');
                const list = log.gudang === 'Sparepart' ? this.spareparts : this.sisaProjects;
                let stockItem = list.find(s => (log.barcode && String(s.barcode || '') === String(log.barcode)) || normalize(s.nama) === normalize(log.nama));
                if (!stockItem) return alert(`Barang ${log.nama} tidak ditemukan di stok.`);

                // IN dibatalkan = stok dikurangi kembali; OUT dibatalkan = stok dikembalikan.
                if (log.type === 'IN') {
                    if ((Number(stockItem.qty) || 0) < qty) return alert('Transaksi inbound tidak dapat dibatalkan karena stok saat ini sudah lebih kecil dari qty transaksi.');
                    stockItem.qty = (Number(stockItem.qty) || 0) - qty;
                } else {
                    stockItem.qty = (Number(stockItem.qty) || 0) + qty;
                }
                stockItem.totalHarga = this.getMasterHarga(stockItem.nama, stockItem.harga) * (Number(stockItem.qty) || 0);
                if (log.gudang === 'Sparepart') this.syncMasterStockForSparepart(stockItem);

                // Jika inbound berasal dari Purchase Request, kembalikan qty diterima ke order.
                if (log.type === 'IN' && log.monitoringOrderId) {
                    const order = this.monitoringItems.find(o => String(o.id) === String(log.monitoringOrderId));
                    if (order) {
                        order.qtyReceived = Math.max(0, (Number(order.qtyReceived) || 0) - qty);
                        order.qtyRemaining = Math.max(0, (Number(order.qtyTotal) || 0) - order.qtyReceived);
                        order.status = order.qtyRemaining <= 0 ? 'Diterima Semua' : order.qtyReceived > 0 ? 'Diterima Sebagian' : 'Pending';
                        this.monitoringHistory.forEach(h => { if (String(h.monitoringOrderId) === String(order.id)) h.status = order.status; });
                    }
                }

                log.status = 'Cancelled';
                log.approvalStatus = 'cancelled';
                log.isCancelled = true;
                log.originalQty = qty;
                // Transaksi yang dibatalkan tetap disimpan sebagai histori, tetapi qty transaksi
                // dibuat 0 agar tidak terlihat sebagai barang yang masih keluar/masuk.
                log.qty = 0;
                log.qtyAkhir = log.qtyAwal ?? log.qtyAkhir ?? 0;
                log.totalHarga = 0;
                log.cancelledAt = new Date().toISOString();
                log.cancelledBy = this.authUser?.email || this.authUser?.id || 'Super Admin';
                this.syncWarehouseLogBalances();
                const saved = await this.saveToSupabase();
                if (!saved) return alert('Pembatalan gagal disimpan ke server.');
                alert('Transaksi berhasil dibatalkan dan stok sudah disesuaikan.');
            },
            async unapproveTransaction(log) {
                const deviceOk = await this.touchDeviceSession();
                if (!deviceOk) return;
                const authz = await this.ensureFreshAuthorization('super_admin');
                if (!authz.ok) return alert(authz.message);
                const { data: approvalAuth, error: approvalAuthError } = await this.getSupabaseClient().rpc('authorize_inventory_approval', {
                    p_action: 'unapprove'
                });
                if (approvalAuthError || approvalAuth?.ok !== true) {
                    return alert(approvalAuthError?.message || approvalAuth?.message || 'Pembatalan approval tidak diizinkan oleh server.');
                }
                if (!log || this.isPendingLog(log)) return;
                if (log.adjustmentType === 'OPNAME') return alert('Gunakan menu Stock Opname untuk membatalkan approval penyesuaian opname.');
                if (!confirm(`Batalkan approval transaksi ${log.nama || ''}? Stok akan dikembalikan ke kondisi sebelum transaksi ini disetujui.`)) return;
                try {
                    const list = log.gudang === 'Sparepart' ? this.spareparts : this.sisaProjects;
                    const stockItem = list.find(s => String(s.nama || '').trim().toLowerCase() === String(log.nama || '').trim().toLowerCase());
                    const qty = Number(log.qty) || 0;
                    if (stockItem) {
                        stockItem.qty = log.type === 'IN' ? (Number(stockItem.qty) || 0) - qty : (Number(stockItem.qty) || 0) + qty;
                        stockItem.totalHarga = this.getMasterHarga(stockItem.nama, stockItem.harga) * stockItem.qty;
                        if (log.gudang === 'Sparepart') this.syncMasterStockForSparepart(stockItem);
                    }
                    if (log.monitoringOrderId && log.type === 'IN') {
                        const order = this.monitoringItems.find(o => String(o.id) === String(log.monitoringOrderId));
                        if (order) {
                            order.qtyReceived = Math.max(0, (Number(order.qtyReceived) || 0) - qty);
                            order.qtyRemaining = Math.max(0, (Number(order.qtyTotal) || 0) - order.qtyReceived);
                            order.status = order.qtyRemaining <= 0 ? 'Diterima Semua' : order.qtyReceived > 0 ? 'Diterima Sebagian' : 'Pending';
                        }
                        const mh = this.monitoringHistory.find(h => String(h.id) === String(log.monitoringHistoryId));
                        if (mh) mh.status = 'Menunggu Persetujuan';
                    }
                    log.approvalStatus = 'pending';
                    log.unapprovedBy = this.authUser?.email || this.authUser?.id || 'Super Admin';
                    log.unapprovedAt = new Date().toISOString();
                    delete log.approvedBy;
                    delete log.approvedAt;
                    await this.saveToSupabase();
                    alert('Approval dibatalkan. Transaksi kembali menunggu persetujuan dan stok dikembalikan.');
                } catch (err) {
                    console.error('Unapprove transaksi gagal:', err);
                    alert(err?.message || 'Gagal membatalkan approval transaksi.');
                }
            },
            async approveOpname(op) {
                const authz = await this.ensureFreshAuthorization('super_admin');
                if (!authz.ok) return alert(authz.message);
                if (!op || String(op.approvalStatus || 'approved').toLowerCase() !== 'pending') return;
                try {
                    const source = op.gudang === 'Sisa Project' ? this.sisaProjects : this.spareparts;
                    const isoNow = op.isoDate || new Date().toISOString();
                    op.items.forEach(row => {
                        const target = source.find(s => (row.barcode && s.barcode === row.barcode) || (row.kode && s.kode === row.kode) || String(s.nama || '').trim().toLowerCase() === String(row.nama || '').trim().toLowerCase());
                        if (!target) return;
                        const qtySystem = Number(row.qtySystem) || 0;
                        const qtyFisik = Number(row.qtyFisik) || 0;
                        const selisih = qtyFisik - qtySystem;
                        target.qty = qtyFisik;
                        target.totalHarga = this.getMasterHarga(target.nama, target.harga) * qtyFisik;
                        if (op.gudang === 'Sparepart') {
                            const masterItem = this.masterCatalog.find(m => String(m.nama || '').trim().toLowerCase() === String(row.nama || '').trim().toLowerCase() || (row.kode && m.kode && String(m.kode).trim().toLowerCase() === String(row.kode).trim().toLowerCase()));
                            if (masterItem) masterItem.currentStock = qtyFisik;
                            this.syncMasterStockForSparepart(target);
                        }
                        if (selisih !== 0) {
                            this.logs.unshift({ id: Date.now() + Math.random(), isoDate: isoNow, gudang: op.gudang, type: selisih > 0 ? 'IN' : 'OUT', adjustmentType: 'OPNAME', opnameId: op.id, opnameNomor: op.nomor, nama: target.nama, qty: Math.abs(selisih), qtyAwal: qtySystem, qtyAkhir: qtyFisik, tgl: op.tgl, user: op.petugas, supplier: selisih > 0 ? `PENYESUAIAN OPNAME (${op.nomor})` : '', keperluan: `PENYESUAIAN STOCK OPNAME - ${op.nomor}` + (row.catatan ? ` | ${row.catatan}` : ''), satuan: row.satuan || target.satuan || 'Pcs', approvalStatus: 'approved', approvedBy: this.authUser?.email || this.authUser?.id || 'Super Admin', approvedAt: new Date().toISOString() });
                        }
                    });
                    op.approvalStatus = 'approved';
                    op.approvedBy = this.authUser?.email || this.authUser?.id || 'Super Admin';
                    op.approvedAt = new Date().toISOString();
                    await this.saveToSupabase();
                    alert(`Stock Opname ${op.nomor} berhasil disetujui dan penyesuaian stok telah diterapkan.`);
                } catch (err) {
                    console.error('Approval opname gagal:', err);
                    alert(err?.message || 'Stock opname gagal disetujui.');
                }
            },
            async unapproveOpname(op) {
                const authz = await this.ensureFreshAuthorization('super_admin');
                if (!authz.ok) return alert(authz.message);
                if (!op || String(op.approvalStatus || 'approved').toLowerCase() === 'pending') return;
                if (!confirm(`Batalkan approval ${op.nomor}? Penyesuaian stok akan dikembalikan.`)) return;
                try {
                    const source = op.gudang === 'Sisa Project' ? this.sisaProjects : this.spareparts;
                    op.items.forEach(row => {
                        const target = source.find(s => (row.barcode && s.barcode === row.barcode) || (row.kode && s.kode === row.kode) || String(s.nama || '').trim().toLowerCase() === String(row.nama || '').trim().toLowerCase());
                        if (!target) return;
                        const delta = (Number(row.qtyFisik) || 0) - (Number(row.qtySystem) || 0);
                        target.qty = Math.max(0, (Number(target.qty) || 0) - delta);
                        target.totalHarga = this.getMasterHarga(target.nama, target.harga) * target.qty;
                        if (op.gudang === 'Sparepart') this.syncMasterStockForSparepart(target);
                    });
                    this.logs = this.logs.filter(l => !(l.adjustmentType === 'OPNAME' && String(l.opnameId) === String(op.id)));
                    op.approvalStatus = 'pending';
                    delete op.approvedBy; delete op.approvedAt;
                    await this.saveToSupabase();
                    alert(`Approval ${op.nomor} dibatalkan. Stock Opname kembali menunggu persetujuan.`);
                } catch (err) {
                    console.error('Unapprove opname gagal:', err);
                    alert(err?.message || 'Gagal membatalkan approval stock opname.');
                }
            },
            getSupabaseClient() {
                return getSbClient();
            },
            escapeHtml(value) {
                return fmt.escapeHtml(value);
            },
            getPersistedState() {
                // Ambil raw object Vue agar serialisasi payload Supabase tidak perlu
                // melewati proxy reactive satu per satu.
                const raw = toRaw || (value => value);
                return {
                    masterCatalog: raw(this.masterCatalog),
                    masterApprovalRequests: raw(this.masterApprovalRequests),
                    monitoringItems: raw(this.monitoringItems),
                    monitoringHistory: raw(this.monitoringHistory),
                    spareparts: raw(this.spareparts),
                    sisaProjects: raw(this.sisaProjects),
                    logs: raw(this.logs),
                    planningRequests: raw(this.planningRequests),
                    planningUsages: raw(this.planningUsages),
                    opnameHistory: raw(this.opnameHistory),
                    stockHistoryReconciliationVersion: Number(this.stockHistoryReconciliationVersion) || 0
                };
            },
            scheduleSupabaseSave(delay = 300) {
                if (this.isHydratingFromSupabase) return;
                // Tandai perubahan lokal agar realtime tidak menimpa input baru
                // dengan snapshot database yang masih lama.
                this.supabaseLocalDirty = true;
                clearTimeout(this.supabaseSaveTimer);
                if (this.supabaseSaveInProgress) {
                    this.supabaseSaveQueued = true;
                    return;
                }
                this.supabaseSaveTimer = setTimeout(() => {
                    this.supabaseSaveTimer = null;
                    this.supabaseSavePromise = this.saveToSupabase();
                }, delay);
            },
            unsubscribeSupabaseRealtime() {
                if (this.supabaseRealtimeChannel) {
                    try {
                        const client = this.getSupabaseClient();
                        if (client) client.removeChannel(this.supabaseRealtimeChannel);
                    } catch (err) {
                        console.warn('Gagal melepas channel realtime Supabase:', err);
                    }
                    this.supabaseRealtimeChannel = null;
                }
                clearTimeout(this.supabaseRealtimeTimer);
                this.supabaseRealtimeTimer = null;
            },
            async refreshFromSupabaseRealtime(updatedAt = '', force = false) {
                const client = this.getSupabaseClient();
                if (!client || this.isHydratingFromSupabase) return;
                // Jangan pernah menimpa perubahan yang baru dibuat user ketika
                // penyimpanan lokal masih menunggu/berjalan.
                if (!force && (this.supabaseLocalDirty || this.supabaseSaveInProgress || this.supabaseSaveTimer)) return;
                // Hindari memuat ulang state yang sama atau menimpa perubahan lokal yang baru disimpan.
                if (!force && updatedAt && this.supabaseLastUpdatedAt && String(updatedAt) <= String(this.supabaseLastUpdatedAt)) return;
                try {
                    const { data, error } = await client
                        .from('inventory_state')
                        .select('state,updated_at')
                        .eq('id', 'main')
                        .maybeSingle();
                    if (error) throw error;
                    if (!data?.state) return;
                    if (!force && data.updated_at && this.supabaseLastUpdatedAt && String(data.updated_at) <= String(this.supabaseLastUpdatedAt)) return;

                    const state = data.state;
                    this.isHydratingFromSupabase = true;
                    this.masterCatalog = Array.isArray(state.masterCatalog) ? state.masterCatalog : [];
                    this.monitoringItems = Array.isArray(state.monitoringItems) ? state.monitoringItems : [];
                    this.monitoringHistory = Array.isArray(state.monitoringHistory) ? state.monitoringHistory : [];
                    this.spareparts = Array.isArray(state.spareparts) ? state.spareparts : [];
                    this.sisaProjects = Array.isArray(state.sisaProjects) ? state.sisaProjects : [];
                    this.logs = Array.isArray(state.logs) ? state.logs : [];
                    this.planningRequests = Array.isArray(state.planningRequests) ? state.planningRequests : [];
                    this.planningUsages = Array.isArray(state.planningUsages) ? state.planningUsages : [];
                    this.planningCacheReady = false;
                    this.planningCacheBuilding = false;
                    this.planningAutocompleteResults = [];
                    this.opnameHistory = Array.isArray(state.opnameHistory) ? state.opnameHistory : [];
                    this.stockHistoryReconciliationVersion = Number(state.stockHistoryReconciliationVersion) || 0;
                    this.supabaseLastUpdatedAt = data.updated_at || this.supabaseLastUpdatedAt || '';
                    this.normalizeInventoryDataTypes();
                    this.syncMasterAndSparepart();
                    const needsStockHistoryRepair = Number(this.stockHistoryReconciliationVersion || 0) < 6;
                    if (needsStockHistoryRepair) {
                        (this.masterCatalog || []).forEach(m => { if (m && Number(m._timelineOpeningStock) === 0) delete m._timelineOpeningStock; });
                        this.rebuildStockHistoryFromBeginning();
                        await this.saveToSupabase();
                    } else {
                        this.syncWarehouseLogBalances();
                    }
                    this.supabaseConnected = true;
                    this.$nextTick(() => this.refreshIcons());
                } catch (err) {
                    console.error('Gagal sinkronisasi realtime Supabase:', err);
                } finally {
                    this.isHydratingFromSupabase = false;
                }
            },
            startSupabaseRealtimeFallback() {
                clearTimeout(this.supabaseRealtimeTimer);
                const poll = async () => {
                    if (!this.isAuthenticated || this.isHydratingFromSupabase) {
                        this.supabaseRealtimeTimer = setTimeout(poll, 5000);
                        return;
                    }
                    const client = this.getSupabaseClient();
                    if (!client) return;
                    try {
                        const { data, error } = await client
                            .from('inventory_state')
                            .select('updated_at')
                            .eq('id', 'main')
                            .maybeSingle();
                        if (!error && data?.updated_at && String(data.updated_at) > String(this.supabaseLastUpdatedAt || '')) {
                            await this.refreshFromSupabaseRealtime(data.updated_at);
                        }
                    } catch (err) {
                        console.warn('Fallback sinkronisasi Supabase gagal:', err);
                    } finally {
                        this.supabaseRealtimeTimer = setTimeout(poll, 5000);
                    }
                };
                this.supabaseRealtimeTimer = setTimeout(poll, 5000);
            },
            subscribeSupabaseRealtime() {
                const client = this.getSupabaseClient();
                if (!client || !this.isAuthenticated) return;
                this.unsubscribeSupabaseRealtime();
                this.supabaseRealtimeChannel = client
                    .channel('inventory-state-realtime')
                    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inventory_state', filter: 'id=eq.main' }, payload => {
                        const updatedAt = payload?.new?.updated_at || '';
                        this.refreshFromSupabaseRealtime(updatedAt);
                    })
                    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inventory_state', filter: 'id=eq.main' }, payload => {
                        const updatedAt = payload?.new?.updated_at || '';
                        this.refreshFromSupabaseRealtime(updatedAt);
                    })
                    .subscribe(status => {
                        if (status === 'SUBSCRIBED') {
                            this.supabaseConnected = true;
                        }
                    });
                // Realtime adalah jalur utama; polling updated_at menjadi fallback jika
                // project Supabase belum mengaktifkan replication untuk inventory_state.
                this.startSupabaseRealtimeFallback();
            },
            async loadFromSupabase() {
                const client = this.getSupabaseClient();
                if (!client) {
                    this.isHydratingFromSupabase = false;
                    console.warn('Supabase belum dikonfigurasi. Isi SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY.');
                    return;
                }
                try {
                    const { data, error } = await client
                        .from('inventory_state')
                        .select('state,updated_at')
                        .eq('id', 'main')
                        .maybeSingle();
                    if (error) throw error;
                    if (data && data.state) {
                        this.supabaseLastUpdatedAt = data.updated_at || this.supabaseLastUpdatedAt || '';
                        const state = data.state;
                        this.masterCatalog = Array.isArray(state.masterCatalog) ? state.masterCatalog : [];
                        this.monitoringItems = Array.isArray(state.monitoringItems) ? state.monitoringItems : [];
                        this.monitoringHistory = Array.isArray(state.monitoringHistory) ? state.monitoringHistory : [];
                        this.spareparts = Array.isArray(state.spareparts) ? state.spareparts : [];
                        this.sisaProjects = Array.isArray(state.sisaProjects) ? state.sisaProjects : [];
                        this.logs = Array.isArray(state.logs) ? state.logs : [];
                        // Dataset Planning dapat sangat besar. Jangan normalisasi seluruh nested data
                        // secara sinkron saat load; validasi dilakukan hanya pada baris yang disentuh/dirender.
                        this.planningRequests = Array.isArray(state.planningRequests) ? state.planningRequests : [];
                        this.planningUsages = Array.isArray(state.planningUsages) ? state.planningUsages : [];
                        this.planningCacheReady = false;
                        this.planningCacheBuilding = false;
                        this.planningAutocompleteResults = [];
                        this.opnameHistory = Array.isArray(state.opnameHistory) ? state.opnameHistory : [];
                        this.stockHistoryReconciliationVersion = Number(state.stockHistoryReconciliationVersion) || 0;
                        this.normalizeInventoryDataTypes();
                        this.syncMasterAndSparepart();
                        const needsStockHistoryRepair = Number(this.stockHistoryReconciliationVersion || 0) < 6;
                        if (needsStockHistoryRepair) {
                            (this.masterCatalog || []).forEach(m => { if (m && Number(m._timelineOpeningStock) === 0) delete m._timelineOpeningStock; });
                            this.rebuildStockHistoryFromBeginning();
                            await this.saveToSupabase();
                        } else {
                            this.syncWarehouseLogBalances();
                        }
                    }
                    this.supabaseConnected = true;
                } catch (err) {
                    console.error('Gagal mengambil data dari Supabase:', err);
                    alert('Data Supabase belum bisa dimuat. Cek koneksi, tabel inventory_state, dan RLS Supabase.');
                } finally {
                    this.isHydratingFromSupabase = false;
                }
            },
            async saveEditedLogToSupabase(log, expectedIso, expectedDisplay) {
                // Edit harus menunggu autosave yang mungkin sedang berjalan selesai.
                // Kalau tidak, saveToSupabase() dapat mengembalikan hasil request lama
                // sebelum perubahan tanggal ini ikut masuk ke payload.
                if (this.supabaseSaveTimer) {
                    clearTimeout(this.supabaseSaveTimer);
                    this.supabaseSaveTimer = null;
                }
                let waitCount = 0;
                while (this.supabaseSaveInProgress && waitCount < 300) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    waitCount += 1;
                }
                if (this.supabaseSaveInProgress) return false;

                this.supabaseLocalDirty = true;
                const saved = await this.saveToSupabase();
                if (!saved) return false;

                // Verifikasi bahwa tanggal yang baru benar-benar sudah menjadi state
                // yang tersimpan di Supabase. Ini mencegah snapshot lama menimpa
                // hasil edit ketika halaman/realtime melakukan sinkronisasi.
                const client = this.getSupabaseClient();
                if (!client || !log) return saved;

                const matchesDate = state => {
                    const logs = Array.isArray(state?.logs) ? state.logs : [];
                    const histories = Array.isArray(state?.monitoringHistory) ? state.monitoringHistory : [];
                    const target = [...logs, ...histories].find(x => String(x?.id) === String(log.id));
                    if (!target) return false;
                    return String(target.isoDate || '') === String(expectedIso || '') &&
                           String(target.tgl || '') === String(expectedDisplay || '');
                };

                try {
                    const { data, error } = await client
                        .from('inventory_state')
                        .select('state,updated_at')
                        .eq('id', 'main')
                        .maybeSingle();
                    if (error) throw error;

                    if (matchesDate(data?.state)) {
                        this.supabaseLastUpdatedAt = data.updated_at || this.supabaseLastUpdatedAt || '';
                        this.supabaseLocalDirty = false;
                        return true;
                    }

                    // Jika state yang terbaca belum memuat edit tanggal, tulis ulang
                    // state terbaru sekali lagi lalu verifikasi kembali.
                    this.supabaseLocalDirty = true;
                    const retrySaved = await this.saveToSupabase();
                    if (!retrySaved) return false;

                    const { data: verifyData, error: verifyError } = await client
                        .from('inventory_state')
                        .select('state,updated_at')
                        .eq('id', 'main')
                        .maybeSingle();
                    if (verifyError) throw verifyError;

                    const verified = matchesDate(verifyData?.state);
                    if (verified) {
                        this.supabaseLastUpdatedAt = verifyData.updated_at || this.supabaseLastUpdatedAt || '';
                        this.supabaseLocalDirty = false;
                    }
                    return verified;
                } catch (err) {
                    console.error('Verifikasi edit tanggal ke Supabase gagal:', err);
                    return false;
                }
            },
            async saveToSupabase() {
                if (this.isHydratingFromSupabase) return false;
                // Verifikasi role + sesi perangkat setiap kali state akan ditulis.
                // Jadi perubahan dari console/browser tetap melewati authorization yang sama.
                const deviceOk = await this.touchDeviceSession();
                if (!deviceOk) return false;
                const authz = await this.ensureFreshAuthorization();
                if (!authz.ok || !['admin', 'super_admin'].includes(authz.role)) {
                    console.warn('saveToSupabase ditolak:', authz.message || 'Role tidak memiliki izin tulis.');
                    return false;
                }
                const client = this.getSupabaseClient();
                if (!client) return false;

                // Jangan izinkan dua upsert state besar berjalan bersamaan.
                if (this.supabaseSaveInProgress) {
                    this.supabaseSaveQueued = true;
                    return this.supabaseSavePromise || Promise.resolve(false);
                }

                this.supabaseSaveInProgress = true;
                this.supabaseSaveQueued = false;
                let saved = false;

                try {
                    // Sebelum penyimpanan, pastikan seluruh satuan transaksi/gudang
                    // yang punya pasangan di Data Master memakai satuan dari Master.
                    this.syncAllSatuanFromMaster();
                    this.syncWarehouseLogBalances();
                    const updatedAt = new Date().toISOString();
                    const payload = {
                        id: 'main',
                        state: this.getPersistedState(),
                        updated_at: updatedAt
                    };

                    const { error } = await client
                        .from('inventory_state')
                        .upsert(payload, { onConflict: 'id' });

                    if (error) throw error;
                    this.supabaseLastUpdatedAt = updatedAt;
                    this.supabaseConnected = true;
                    this.supabaseLocalDirty = false;
                    this.supabaseSaveRetryCount = 0;
                    saved = true;
                } catch (err) {
                    this.supabaseConnected = false;
                    console.error('Gagal menyimpan data ke Supabase:', err);
                    // Jangan biarkan input yang sudah muncul di layar hilang hanya karena
                    // satu request penyimpanan gagal sesaat. Coba ulang maksimal 3 kali.
                    if (this.supabaseSaveRetryCount < 3 && this.supabaseLocalDirty) {
                        this.supabaseSaveRetryCount += 1;
                        this.scheduleSupabaseSave(1500);
                    }
                } finally {
                    this.supabaseSaveInProgress = false;

                    // Jika ada perubahan saat request berjalan, simpan sekali lagi
                    // setelah request sebelumnya selesai (bukan membuat request bertumpuk).
                    if (this.supabaseSaveQueued) {
                        this.scheduleSupabaseSave(300);
                    }
                }
                return saved;
            },
            // Helper Fungsi Format Tanggal Tanpa Jam (DD/MM/YYYY)
            getFormattedDateOnly(dateObj = new Date()) {
                return fmt.getFormattedDateOnly(dateObj);
            },
            // Nilai Date untuk Excel agar kolom tanggal tampil konsisten sebagai DD/MM/YYYY.
            excelDateValue(dateValue) {
                return fmt.excelDateValue(dateValue);
            },
            getISODateOnly(dateObj = new Date()) {
                return fmt.getISODateOnly(dateObj);
            },
            getDateFromInput(dateStr) {
                return fmt.getDateFromInput(dateStr);
            },
            pickTransactionDate(defaultDate = this.getISODateOnly(), title = 'Pilih Tanggal Transaksi') {
                this.transactionDatePickerTitle = title;
                this.transactionDatePickerValue = defaultDate || this.getISODateOnly();
                this.showTransactionDatePicker = true;
                // Pastikan modal tanggal benar-benar dirender sebelum pengguna
                // berinteraksi, termasuk pada browser mobile yang lebih ketat
                // terhadap elemen fixed/focus setelah prompt().
                this.$nextTick(() => {
                    this.refreshIcons();
                    const input = document.getElementById('transaction-date-picker-input');
                    if (input) input.focus({ preventScroll: true });
                });
                return new Promise(resolve => {
                    this.transactionDatePickerResolve = resolve;
                });
            },
            confirmTransactionDate() {
                const value = this.transactionDatePickerValue;
                if (!value) return alert('Tanggal transaksi wajib dipilih!');
                this.showTransactionDatePicker = false;
                const resolve = this.transactionDatePickerResolve;
                this.transactionDatePickerResolve = null;
                if (resolve) resolve(value);
            },
            cancelTransactionDate() {
                this.showTransactionDatePicker = false;
                const resolve = this.transactionDatePickerResolve;
                this.transactionDatePickerResolve = null;
                if (resolve) resolve(null);
            },
            filterLogs(gudang, type, dStart, dEnd, barang, ket, hargaMin = '', hargaMax = '') {
                return this.logs.filter(l => {
                    if (l.gudang !== gudang || l.type !== type) return false;
                    const logName = String(l.nama || '').toLowerCase();
                    const barangQuery = String(barang || '').toLowerCase();
                    if (barangQuery && !logName.includes(barangQuery)) return false;
                    const logKet = String((l.gudang === 'Sisa Project' && l.type === 'OUT') ? (l.keterangan || l.keperluan || '') : (l.supplier || l.keperluan || l.user || '')).toLowerCase();
                    const ketQuery = String(ket || '').toLowerCase();
                    if (ketQuery && !logKet.includes(ketQuery)) return false;
                    const logHarga = Number(l.harga != null ? l.harga : this.getMasterHarga(l.nama)) || 0;
                    if (hargaMin !== '' && Number.isFinite(Number(hargaMin)) && logHarga < Number(hargaMin)) return false;
                    if (hargaMax !== '' && Number.isFinite(Number(hargaMax)) && logHarga > Number(hargaMax)) return false;
                    if (dStart || dEnd) {
                        const lDate = new Date(l.isoDate || l.id);
                        if (dStart && lDate < new Date(dStart)) return false;
                        if (dEnd) {
                            const endDate = new Date(dEnd);
                            endDate.setHours(23, 59, 59);
                            if (lDate > endDate) return false;
                        }
                    }
                    return true;
                }).sort((a, b) => {
                    // Urutan tabel gudang = urutan waktu input: yang pertama
                    // diinput tetap berada di atas. createdAt dipakai untuk data baru;
                    // data lama memakai id sebagai fallback agar tetap stabil.
                    const ta = new Date(a.createdAt || a.inputAt || a.id || a.isoDate || 0).getTime();
                    const tb = new Date(b.createdAt || b.inputAt || b.id || b.isoDate || 0).getTime();
                    return ta - tb;
                });
            },
            getLogDisplayQty(log) {
                if (!log) return 0;
                // Log yang dibatalkan menyimpan qty transaksi asli di originalQty
                // agar histori tetap menunjukkan jumlah yang benar, sementara qty=0
                // tetap dipakai untuk perhitungan stok transaksi aktif.
                if (this.isCancelledLog(log) && log.originalQty != null) {
                    const original = Number(log.originalQty);
                    if (Number.isFinite(original)) return Math.max(0, Math.round(original));
                }
                const qty = Number(log.qty);
                return Number.isFinite(qty) ? Math.max(0, Math.round(qty)) : 0;
            },
            async editLog(log) {
                if (!log) return;
                const isPending = this.isPendingLog(log);
                if (this.isCancelledLog(log)) return alert('Transaksi yang sudah dibatalkan tidak dapat diedit.');
                if (isPending && !this.canInputTransaction) return alert('Hanya Admin dan Super Admin yang dapat mengedit transaksi yang belum disetujui.');
                if (!isPending && !this.canEdit) return alert('Transaksi yang sudah disetujui hanya dapat diedit oleh Super Admin.');

                const isMonitoringHistory = this.monitoringHistory.some(h => h.id === log.id);
                const linkedLog = isMonitoringHistory
                    ? this.logs.find(l =>
                        (log.monitoringLogId != null && l.id === log.monitoringLogId) ||
                        (l.monitoringHistoryId != null && l.monitoringHistoryId === log.id)
                    )
                    : log;
                const oldQty = Math.max(0, Math.round(Number(log.qty) || 0));
                const oldNama = String(log.nama || '').trim();
                const oldNamaKey = oldNama.toLowerCase();
                const stockListForEdit = log.gudang === 'Sparepart' ? (this.spareparts || []) : (this.sisaProjects || []);

                const itemNameInput = prompt(`Nama barang untuk ${log.type === 'IN' ? 'barang masuk' : 'barang keluar'} (harga tidak dapat diedit):`, oldNama);
                if (itemNameInput === null) return;
                const newNamaText = String(itemNameInput || '').trim();
                if (!newNamaText) return alert('Nama barang wajib diisi.');
                const matchedStockItem = stockListForEdit.find(s => String(s.nama || '').trim().toLowerCase() === newNamaText.toLowerCase()) ||
                    (this.masterCatalog || []).find(m => String(m.nama || '').trim().toLowerCase() === newNamaText.toLowerCase());
                if (!matchedStockItem) return alert(`Barang "${newNamaText}" tidak ditemukan pada Data Master/stok ${log.gudang}.`);

                const newNama = String(matchedStockItem.nama || newNamaText).trim();
                const itemChanged = newNama.toLowerCase() !== oldNamaKey;
                const existingDate = log.isoDate
                    ? this.getISODateOnly(new Date(log.isoDate))
                    : (() => {
                        const raw = String(log.tgl || '').trim();
                        const m = raw.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
                        return m ? `${m[3]}-${m[2]}-${m[1]}` : this.getISODateOnly();
                    })();
                const editedDate = await this.pickTransactionDate(existingDate, `Edit Tanggal Transaksi - ${log.nama}`);
                if (!editedDate) return;
                const newQtyInput = prompt(`Adjust Qty untuk ${log.nama} (${log.type}):`, oldQty);
                if (newQtyInput === null || !Number.isFinite(Number(newQtyInput)) || Number(newQtyInput) <= 0) return;
                const newQty = Math.max(0, Math.round(Number(newQtyInput)));
                const editedDateObj = this.getDateFromInput(editedDate);
                const editedDateIso = editedDateObj.toISOString();
                const editedDateDisplay = this.getFormattedDateOnly(editedDateObj);
                const dateChanged = String(log.isoDate || '') !== String(editedDateIso);
                const qtyChanged = newQty !== oldQty;
                if (!dateChanged && !qtyChanged && !itemChanged) return;

                const dateStr = editedDateDisplay;
                const relatedHistory = log.monitoringHistoryId != null
                    ? this.monitoringHistory.find(h => String(h.id) === String(log.monitoringHistoryId))
                    : (isMonitoringHistory ? log : null);
                const relatedOrder = log.monitoringOrderId != null
                    ? this.monitoringItems.find(o => String(o.id) === String(log.monitoringOrderId))
                    : null;
                const isMonitoringReceipt = log.type === 'IN' && (
                    isMonitoringHistory ||
                    String(log.keperluan || '').toLowerCase().startsWith('penerimaan monitoring') ||
                    String(linkedLog?.keperluan || '').toLowerCase().startsWith('penerimaan monitoring')
                );

                // Update metadata barang tanpa pernah mengubah harga transaksi.
                if (itemChanged) {
                    log.nama = newNama;
                    log.kode = matchedStockItem.kode || log.kode || '';
                    log.barcode = matchedStockItem.barcode || log.barcode || '';
                    log.satuan = String(this.getMasterSatuan(newNama, matchedStockItem.satuan || 'Pcs', matchedStockItem.kode || matchedStockItem.barcode || '') || 'Pcs').trim().toUpperCase();
                    if (linkedLog && linkedLog !== log) {
                        linkedLog.nama = newNama;
                        linkedLog.kode = log.kode;
                        linkedLog.barcode = log.barcode;
                        linkedLog.satuan = log.satuan;
                    }
                    if (relatedHistory && relatedHistory !== log) {
                        relatedHistory.nama = newNama;
                        relatedHistory.satuan = log.satuan;
                    }
                    if (relatedOrder && isMonitoringReceipt) relatedOrder.nama = newNama;
                }

                // Pending hanya mengubah data pengajuan. Stok belum ikut dihitung.
                if (isPending) {
                    log.qty = newQty;
                    log.isoDate = editedDateIso;
                    log.tgl = editedDateDisplay;
                    log.editedAt = `edited ${itemChanged ? 'barang/' : ''}tanggal ${dateStr}`;
                    if (relatedHistory && relatedHistory !== log) {
                        relatedHistory.qty = newQty;
                        relatedHistory.isoDate = editedDateIso;
                        relatedHistory.tgl = editedDateDisplay;
                        relatedHistory.editedAt = log.editedAt;
                    }
                    const savedPendingEdit = await this.saveEditedLogToSupabase(log, editedDateIso, editedDateDisplay);
                    if (!savedPendingEdit) return alert('Edit transaksi gagal disimpan ke Supabase.');
                    alert('Data transaksi yang belum disetujui berhasil diedit dan langsung disimpan ke Supabase. Stok belum berubah.');
                    return;
                }

                // Jika penerimaan berasal dari Purchase Request, validasi perubahan qty dahulu.
                if (relatedOrder && isMonitoringReceipt && qtyChanged) {
                    const diff = newQty - oldQty;
                    const updatedReceived = (Number(relatedOrder.qtyReceived) || 0) + diff;
                    const totalOrder = Number(relatedOrder.qtyTotal) || 0;
                    if (updatedReceived < 0 || updatedReceived > totalOrder) {
                        return alert('Qty edit tidak valid karena melebihi batas Total Order.');
                    }
                    relatedOrder.qtyReceived = Math.max(0, updatedReceived);
                    relatedOrder.qtyRemaining = Math.max(0, totalOrder - relatedOrder.qtyReceived);
                    relatedOrder.status = relatedOrder.qtyRemaining <= 0
                        ? 'Diterima Semua'
                        : relatedOrder.qtyReceived > 0 ? 'Diterima Sebagian' : 'Pending';
                    this.monitoringHistory.forEach(h => {
                        if (h.monitoringOrderId === relatedOrder.id) h.status = relatedOrder.status;
                    });
                }

                // Semua perubahan approved hanya mengubah record transaksi.
                // Stok gudang TIDAK lagi di-adjust dengan diff; satu mesin rekonsiliasi
                // akan menghitung ulang seluruh timeline dari Data Master.
                log.qty = newQty;
                log.isoDate = editedDateIso;
                log.tgl = editedDateDisplay;
                log.editedAt = `edited ${itemChanged ? 'barang/' : ''}tanggal ${dateStr}`;
                if (linkedLog && linkedLog !== log) {
                    linkedLog.qty = newQty;
                    linkedLog.isoDate = editedDateIso;
                    linkedLog.tgl = editedDateDisplay;
                    linkedLog.editedAt = log.editedAt;
                }
                if (relatedHistory && relatedHistory !== log) {
                    relatedHistory.qty = newQty;
                    relatedHistory.isoDate = editedDateIso;
                    relatedHistory.tgl = editedDateDisplay;
                    relatedHistory.editedAt = log.editedAt;
                }

                this.rebuildStockHistoryFromBeginning();
                const savedEdit = await this.saveEditedLogToSupabase(log, editedDateIso, editedDateDisplay);
                if (!savedEdit) return alert('Edit log gagal disimpan ke Supabase.');
                alert('Log berhasil diedit. Qty Awal, Qty Akhir, dan stok seluruh transaksi terkait sudah dihitung ulang berdasarkan urutan transaksi.');
            },
            resetDashFilter() {
                const today = this.getISODateOnly();
                this.dashFilterDateStart = today;
                this.dashFilterDateEnd = today;
                this.dashSearchBarang = '';
                this.dashboardSparepartInPage = 1;
                this.dashboardSparepartOutPage = 1;
                this.dashboardSisaProjectInPage = 1;
                this.dashboardSisaProjectOutPage = 1;
            },
            formatRupiah(value) {
                return fmt.formatRupiah(value);
            },
            // ================================================================
            // NORMALISASI TIPE DATA INVENTORY - SATU SUMBER, TIPE TEGAS
            // HANYA FIELD TANGGAL YANG BOLEH MENJADI DATE/STRING TANGGAL.
            // QTY/STOK/JUMLAH SELALU NUMBER. SATUAN SELALU TEXT.
            // ================================================================
            excelSerialFromDate(value) {
                return fmt.excelSerialFromDate(value);
            },
            strictQty(value, fallback = 0) {
                return fmt.strictQty(value, fallback);
            },
            strictText(value, fallback = '') {
                return fmt.strictText(value, fallback);
            },
            isDateLikeValue(value) {
                return fmt.isDateLikeValue(value);
            },
            safeQty(primary, ...fallbacks) {
                return fmt.safeQty(primary, ...fallbacks);
            },
            safeNumber(primary, ...fallbacks) {
                return fmt.safeNumber(primary, ...fallbacks);
            },
            safeText(primary, ...fallbacks) {
                return fmt.safeText(primary, ...fallbacks);
            },
            strictDateOnly(value, fallback = '') {
                return fmt.strictDateOnly(value, fallback);
            },
            normalizeInventoryDataTypes() {
                // REPAIR-ONLY: jangan mengubah nilai yang sudah valid.
                // Hanya perbaiki field jika nilainya jelas berupa tanggal/tipe yang salah.
                const masterByKey = new Map();
                const date = v => this.strictDateOnly(v, this.getISODateOnly());
                (this.masterCatalog || []).forEach(m => {
                    if (!m || typeof m !== 'object') return;
                    m.kode = this.safeText(m.kode);
                    m.nama = this.safeText(m.nama).toUpperCase();
                    m.satuan = this.safeText(m.satuan, 'Pcs') || 'Pcs';
                    m.currentStock = this.safeQty(m.currentStock, m.stockAwal);
                    m.stockAwal = this.safeQty(m.stockAwal, m.currentStock);
                    m.minStock = this.safeQty(m.minStock);
                    m.leadTime = this.safeQty(m.leadTime);
                    m.avgDailyUsage = this.safeQty(m.avgDailyUsage);
                    m.harga = this.safeNumber(m.harga);
                    m.tanggal = date(m.tanggal);
                    m.lokasi = this.safeText(m.lokasi).toUpperCase();
                    m.totalHarga = m.harga * m.currentStock;
                    if (m.kode) masterByKey.set(`k:${m.kode.toLowerCase()}`, m);
                    if (m.nama) masterByKey.set(`n:${m.nama.toLowerCase()}`, m);
                });
                const masterFor = r => {
                    const kode = this.safeText(r?.kode, r?.sku, r?.barcode).toLowerCase();
                    const nama = this.safeText(r?.nama).toLowerCase();
                    return (kode && masterByKey.get(`k:${kode}`)) || (nama && masterByKey.get(`n:${nama}`)) || null;
                };
                (this.spareparts || []).forEach(r => {
                    if (!r || typeof r !== 'object') return;
                    const m = masterFor(r);
                    r.kode = this.safeText(r.kode, m?.kode);
                    r.nama = this.safeText(r.nama, m?.nama).toUpperCase();
                    r.qty = this.safeQty(r.qty, r.stockAwal, m?.currentStock);
                    r.stockAwal = this.safeQty(r.stockAwal, r.qty, m?.stockAwal);
                    r.minStock = this.safeQty(r.minStock, m?.minStock);
                    r.satuan = this.safeText(m?.satuan, r.satuan, 'Pcs') || 'Pcs';
                    r.harga = this.safeNumber(m?.harga, r.harga);
                    r.totalHarga = r.harga * r.qty;
                });
                (this.sisaProjects || []).forEach(r => {
                    if (!r || typeof r !== 'object') return;
                    const m = masterFor(r);
                    r.kode = this.safeText(r.kode, m?.kode);
                    r.nama = this.safeText(r.nama, m?.nama).toUpperCase();
                    r.qty = this.safeQty(r.qty, r.stockAwal, m?.currentStock);
                    r.stockAwal = this.safeQty(r.stockAwal, r.qty, m?.stockAwal);
                    r.satuan = this.safeText(m?.satuan, r.satuan, 'Pcs') || 'Pcs';
                    r.harga = this.safeNumber(m?.harga, r.harga);
                    r.totalHarga = r.harga * r.qty;
                });
                (this.monitoringItems || []).forEach(r => {
                    if (!r || typeof r !== 'object') return;
                    const m = masterFor(r);
                    r.nomorPR = this.safeText(r.nomorPR);
                    r.nama = this.safeText(r.nama).toUpperCase();
                    r.satuan = this.safeText(m?.satuan, r.satuan, 'Pcs') || 'Pcs';
                    r.tgl = date(r.tgl || r.isoDate);
                    r.isoDate = this.getDateFromInput(r.tgl).toISOString();
                    r.qtyTotal = this.safeQty(r.qtyTotal, r.qty, r.qtyReceived, r.qtyRemaining);
                    r.qtyReceived = Math.min(r.qtyTotal, this.safeQty(r.qtyReceived));
                    r.qtyRemaining = Math.max(0, r.qtyTotal - r.qtyReceived);
                    r.prioritas = this.safeQty(r.prioritas);
                    r.harga = this.safeNumber(m?.harga, r.harga);
                    r.totalHarga = r.harga * r.qtyTotal;
                });
                (this.monitoringHistory || []).forEach(r => {
                    if (!r || typeof r !== 'object') return;
                    const m = masterFor(r);
                    r.nama = this.safeText(r.nama).toUpperCase();
                    r.satuan = this.safeText(m?.satuan, r.satuan, 'Pcs') || 'Pcs';
                    r.qty = this.safeQty(r.qty, r.qtyReceived, r.qtyRemaining);
                    r.qtyReceived = this.safeQty(r.qtyReceived, r.qty);
                    r.qtyRemaining = this.safeQty(r.qtyRemaining);
                });
                (this.logs || []).forEach(r => {
                    if (!r || typeof r !== 'object') return;
                    const m = masterFor(r);
                    r.nama = this.safeText(r.nama).toUpperCase();
                    r.kode = this.safeText(r.kode, m?.kode);
                    r.satuan = this.safeText(m?.satuan, r.satuan, 'Pcs') || 'Pcs';
                    r.qty = this.safeQty(r.qty, r.qtyAwal, r.qtyAkhir);
                    r.qtyAwal = this.safeQty(r.qtyAwal, r.qty);
                    r.qtyAkhir = this.safeQty(r.qtyAkhir, r.qtyAwal);
                    r.harga = this.safeNumber(m?.harga, r.harga);
                    r.totalHarga = r.harga * r.qty;
                    r.tgl = date(r.tgl || r.isoDate);
                    if (r.isoDate) r.isoDate = this.getDateFromInput(r.tgl).toISOString();
                });
                // Planning: perbaiki hanya angka yang jelas salah; nilai valid dipertahankan.
                (this.planningRequests || []).forEach(r => {
                    if (!r || typeof r !== 'object') return;
                    r.satuan = this.safeText(masterFor(r)?.satuan, r.satuan, 'Pcs') || 'Pcs';
                    r.bufferStock = this.safeQty(r.bufferStock);
                    r.penambahanStock = this.safeQty(r.penambahanStock);
                    r.stok = this.safeQty(r.stok);
                    r.stokTerpakai = this.safeQty(r.stokTerpakai);
                    r.hargaSatuan = this.safeNumber(r.hargaSatuan);
                });
                (this.planningUsages || []).forEach(r => {
                    if (!r || typeof r !== 'object') return;
                    r.satuan = this.safeText(masterFor(r)?.satuan, r.satuan, 'Pcs') || 'Pcs';
                    r.stokSparepart = this.safeQty(r.stokSparepart);
                    r.stokSisaProject = this.safeQty(r.stokSisaProject);
                    (r.proyek || []).forEach(p => {
                        p.qty = this.safeQty(p.qty);
                        p.nama = this.safeText(p.nama);
                    });
                });
                this.syncAllSatuanFromMaster();
            },
            getMasterHarga(nama, fallback = 0) {
                const key = String(nama || '').trim().toLowerCase();
                if (!key) return Number(fallback) || 0;
                const master = this.masterLookup.byName.get(key);
                return master ? (Number(master.harga) || 0) : (Number(fallback) || 0);
            },
            getMasterSatuan(nama, fallback = '', kode = '') {
                const namaKey = String(nama || '').trim().toLowerCase();
                const kodeKey = String(kode || '').trim().toLowerCase();
                const fallbackValue = String(fallback || '').trim();
                if (!namaKey && !kodeKey) return fallbackValue;
                const master = (kodeKey && this.masterLookup.byCode.get(kodeKey)) || (namaKey && this.masterLookup.byName.get(namaKey));
                return master && String(master.satuan || '').trim()
                    ? String(master.satuan).trim()
                    : fallbackValue;
            },
            // SATUAN TRANSAKSI SELALU MENGIKUTI DATA MASTER.
            // Form/gudang boleh membawa nilai sementara, tetapi saat barang sudah
            // dikenali dari Data Master, satuan tidak boleh berbeda dari Master.
            syncTransactionSatuan(item, nama, fallback = 'Pcs', kode = '') {
                if (!item) return fallback;
                const satuanMaster = this.getMasterSatuan(nama, '', kode || item.kode || item.barcode || '');
                const satuan = String(satuanMaster || fallback || '').trim() || 'Pcs';
                item.satuan = satuan;
                return satuan;
            },
            // Sinkronisasi satuan untuk seluruh data transaksi/gudang yang sudah ada.
            // Jika barang punya pasangan di Data Master, satuannya selalu mengikuti Master.
            syncAllSatuanFromMaster() {
                // Gunakan index yang sama untuk seluruh koleksi transaksi/gudang.
                // Sebelumnya setiap record melakukan find() ke seluruh Data Master.
                const { byName, byCode } = this.masterLookup;
                const resolve = (record) => {
                    if (!record) return;
                    const code = String(record.kode || record.sku || record.barcode || '').trim().toLowerCase();
                    const name = String(record.nama || '').trim().toLowerCase();
                    const master = (code && byCode.get(code)) || (name && byName.get(name));
                    const satuanMaster = String(master?.satuan || '').trim();
                    if (satuanMaster) record.satuan = satuanMaster;
                };
                (this.spareparts || []).forEach(resolve);
                (this.sisaProjects || []).forEach(resolve);
                (this.logs || []).forEach(resolve);
                (this.monitoringItems || []).forEach(resolve);
                (this.monitoringHistory || []).forEach(resolve);
            },
            // Rumus minimum stock menggunakan kebutuhan selama lead time + safety stock.
            // Pemakaian harian dapat berasal dari Excel; jika tidak ada, sistem mengambil rata-rata histori OUT 30 hari terakhir.
            calculateMinimumStock(nama, leadTime = 0, safetyStock = 0, avgDailyUsage = 0) {
                const lt = Math.max(0, Number(leadTime) || 0);
                const ss = Math.max(0, Number(safetyStock) || 0);
                let dailyUsage = Math.max(0, Number(avgDailyUsage) || 0);

                if (dailyUsage <= 0 && nama) {
                    const batas = Date.now() - (30 * 24 * 60 * 60 * 1000);
                    const totalKeluar = this.logs
                        .filter(log =>
                            log.type === 'OUT' &&
                            !this.isPendingLog(log) &&
                            !this.isCancelledLog(log) &&
                            String(log.nama || '').trim().toLowerCase() === String(nama || '').trim().toLowerCase() &&
                            (!log.isoDate || new Date(log.isoDate).getTime() >= batas)
                        )
                        .reduce((total, log) => total + (Number(log.qty) || 0), 0);

                    dailyUsage = totalKeluar / 30;
                }

                return Math.ceil((dailyUsage * lt) + ss);
            },
            // ================================================================
            // MASTER DATA <-> GUDANG SPAREPART = SATU SUMBER DATA
            // Nama/SKU/Satuan/Min Stock berasal dari Master Data.
            // Qty stok berjalan adalah satu nilai yang sama di Master & Gudang.
            // ================================================================
            syncMasterStockForSparepart(stockItem) {
                // Transaksi Spare Part yang sudah disetujui memperbarui stok Master.
                // Setelah itu Master tetap menjadi satu-satunya sumber stok untuk
                // tampilan Gudang Spare Part, Dashboard, Notifikasi, dan Excel.
                if (!stockItem) return null;

                const normalize = value => String(value || '').trim().toLowerCase();
                const kode = normalize(stockItem.kode);
                const nama = normalize(stockItem.nama);

                const master = (this.masterCatalog || []).find(m =>
                    (kode && normalize(m.kode) === kode) ||
                    (nama && normalize(m.nama) === nama)
                );

                if (!master) return null;

                const qty = Math.max(0, Math.round(Number(stockItem.qty) || 0));
                master.currentStock = qty;
                master.totalHarga = Math.max(0, Number(master.harga) || 0) * qty;
                return master;
            },
            // ================================================================
            // REKONSILIASI HISTORI STOK V1
            // Menghitung ulang saldo dari transaksi PALING AWAL, bukan mempercayai
            // qtyAwal/qtyAkhir lama yang mungkin sudah salah. Transaksi pending/cancel
            // tidak mengubah saldo. Stock Opname yang sudah approved tetap dihitung
            // sebagai mutasi IN/OUT karena memang merupakan penyesuaian stok.
            // ================================================================
            getWarehouseTransactionTimeline(gudang) {
                const normalize = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                const roundQty = value => Math.max(0, Math.round(Number(value) || 0));
                const typeOf = log => String(log?.type || '').trim().toUpperCase();
                const aliases = item => [item?.barcode, item?.kode, item?.sku, item?.nama]
                    .map(normalize).filter(Boolean).map(v => `k:${v}`);
                const sortLogs = (a, b) => {
                    const da = new Date(a?.isoDate || a?.tgl || 0).getTime() || 0;
                    const db = new Date(b?.isoDate || b?.tgl || 0).getTime() || 0;
                    if (da !== db) return da - db;
                    const ca = new Date(a?.createdAt || a?.inputAt || a?.id || 0).getTime() || Number(a?.id) || 0;
                    const cb = new Date(b?.createdAt || b?.inputAt || b?.id || 0).getTime() || Number(b?.id) || 0;
                    if (ca !== cb) return ca - cb;
                    return String(a?.id || '').localeCompare(String(b?.id || ''));
                };

                // Buat index identitas sekali. Jadi 2.000+ Data Master tidak dicari
                // berulang-ulang untuk setiap transaksi dan halaman tidak freeze.
                const masterAlias = new Map();
                const masterByKey = new Map();
                (this.masterCatalog || []).forEach((master, index) => {
                    const key = `master:${String(master?.kode || master?.barcode || master?.nama || index).trim().toLowerCase()}`;
                    masterByKey.set(key, master);
                    aliases(master).forEach(alias => masterAlias.set(alias, key));
                });
                const stockAlias = new Map();
                const stockByKey = new Map();
                const stocks = gudang === 'Sisa Project' ? (this.sisaProjects || []) : (this.spareparts || []);
                stocks.forEach((stock, index) => {
                    const key = `stock:${String(stock?.kode || stock?.barcode || stock?.nama || index).trim().toLowerCase()}`;
                    stockByKey.set(key, stock);
                    aliases(stock).forEach(alias => { if (!stockAlias.has(alias)) stockAlias.set(alias, key); });
                });

                const getCanonicalKey = log => {
                    for (const alias of aliases(log)) {
                        if (masterAlias.has(alias)) return masterAlias.get(alias);
                    }
                    for (const alias of aliases(log)) {
                        if (stockAlias.has(alias)) return stockAlias.get(alias);
                    }
                    return aliases(log)[0] || '';
                };

                const logs = (this.logs || [])
                    .filter(l => normalize(l?.gudang) === normalize(gudang))
                    .slice()
                    .sort(sortLogs);
                const groups = new Map();
                logs.forEach(log => {
                    const key = getCanonicalKey(log);
                    if (!key) return;
                    if (!groups.has(key)) groups.set(key, []);
                    groups.get(key).push(log);
                });

                const result = new Map();
                groups.forEach((itemLogs, key) => {
                    const master = masterByKey.get(key) || null;
                    const stock = stockByKey.get(key) || null;
                    let opening = 0;

                    if (normalize(gudang) === 'sparepart') {
                        if (master) {
                            // Simpan titik awal secara internal agar currentStock yang
                            // dihitung ulang tidak pernah menjadi baseline berikutnya.
                            if (master._timelineOpeningStock == null) {
                                const stockAwalMaster = roundQty(master.stockAwal);
                                const currentStockMaster = roundQty(master.currentStock);
                                const stockAwalGudang = stock ? roundQty(stock.stockAwal) : 0;
                                // Data Master menjadi titik awal. Jika field stockAwal
                                // masih 0/default, gunakan currentStock Data Master.
                                // Ini penting untuk barang lama seperti V-Belt yang stok
                                // awalnya tersimpan di currentStock, bukan stockAwal.
                                master._timelineOpeningStock = stockAwalMaster > 0
                                    ? stockAwalMaster
                                    : (currentStockMaster > 0 ? currentStockMaster : stockAwalGudang);
                            }
                            opening = roundQty(master._timelineOpeningStock);
                        } else if (stock) {
                            opening = roundQty(stock.stockAwal ?? stock.qty);
                        }
                    } else {
                        // Sisa Project tidak memiliki saldo awal Data Master.
                        opening = 0;
                    }

                    let running = opening;
                    itemLogs.forEach(log => {
                        const before = running;
                        const qty = roundQty(log.qty);
                        log.qtyAwal = before;
                        if (this.isPendingLog(log) || this.isCancelledLog(log)) {
                            log.qtyAkhir = before;
                            if (this.isCancelledLog(log)) log.qty = 0;
                            return;
                        }
                        if (typeOf(log) === 'IN') running = Math.max(0, before + qty);
                        else if (typeOf(log) === 'OUT') running = Math.max(0, before - qty);
                        log.qty = qty;
                        log.qtyAkhir = running;
                    });

                    if (stock) {
                        stock.stockAwal = opening;
                        stock.qty = running;
                        stock.totalHarga = this.getMasterHarga(stock.nama, stock.harga) * stock.qty;
                    }
                    if (master) {
                        master.currentStock = running;
                        master.totalHarga = (Number(master.harga) || 0) * running;
                    }
                    result.set(key, { key, opening, final: running, logs: itemLogs, master, stock });
                });

                // Barang Master yang belum punya transaksi tetap mengikuti Data Master.
                if (normalize(gudang) === 'sparepart') {
                    stockByKey.forEach((stock, key) => {
                        if (groups.has(key)) return;
                        const master = masterByKey.get(key);
                        if (!master) return;
                        stock.stockAwal = roundQty(master._timelineOpeningStock ?? master.stockAwal ?? master.currentStock);
                        stock.qty = roundQty(master.currentStock);
                        stock.totalHarga = (Number(master.harga) || 0) * stock.qty;
                    });
                }
                return result;
            },
            rebuildStockHistoryFromBeginning() {
                this.getWarehouseTransactionTimeline('Sparepart');
                this.getWarehouseTransactionTimeline('Sisa Project');
                this.stockHistoryReconciliationVersion = 6;
                return true;
            },
            syncWarehouseLogBalances() {
                // Satu-satunya mesin rekonsiliasi untuk IN/OUT, Qty Awal, Qty Akhir,
                // stok Gudang, dan Master Data.
                return this.rebuildStockHistoryFromBeginning();
            },
            getLatestWarehouseStock(gudang, nama, barcode = '') {
                const list = gudang === 'Sisa Project' ? (this.sisaProjects || []) : (this.spareparts || []);
                const namaKey = String(nama || '').trim().toLowerCase();
                const barKey = String(barcode || '').trim();
                const found = list.find(item =>
                    (barKey && String(item.barcode || '').trim() === barKey) ||
                    String(item.nama || '').trim().toLowerCase() === namaKey
                );
                return found ? Math.max(0, Number(found.qty) || 0) : 0;
            },
            syncMasterAndSparepart() {
                const norm = value => String(value || '').trim().toLowerCase();
                const usedBarcodes = new Set(this.spareparts.map(s => String(s.barcode || '').trim()).filter(Boolean));
                let barcodeSeq = this.spareparts.length + 1;

                const nextBarcode = () => {
                    let barcode;
                    do {
                        barcode = 'SP-' + String(barcodeSeq++).padStart(3, '0');
                    } while (usedBarcodes.has(barcode));
                    usedBarcodes.add(barcode);
                    return barcode;
                };

                // 1. Setiap Master Data wajib mempunyai pasangan di Gudang Sparepart.
                // Index stok sekali agar proses sinkronisasi tidak melakukan find()
                // ke seluruh 2.000+ item untuk setiap baris Data Master.
                const stockByCode = new Map();
                const stockByName = new Map();
                this.spareparts.forEach(stockItem => {
                    const codeKey = String(stockItem?.kode || '').trim();
                    const nameKey = norm(stockItem?.nama);
                    if (codeKey && !stockByCode.has(codeKey)) stockByCode.set(codeKey, stockItem);
                    if (!codeKey && nameKey && !stockByName.has(nameKey)) stockByName.set(nameKey, stockItem);
                });

                this.masterCatalog.forEach(master => {
                    const key = norm(master.nama);
                    if (!key) return;

                    const codeKey = String(master.kode || '').trim();
                    let stock = codeKey ? stockByCode.get(codeKey) : null;
                    if (!stock) stock = stockByName.get(key) || null;
                    const masterHarga = Math.max(0, Number(master.harga) || 0);

                    // Data Master hanya menjadi referensi identitas barang dan metadata.
                    // Stok Gudang Spare Part berjalan sendiri dari transaksi pemasukan
                    // dan pengeluaran. Barang baru selalu mulai dari 0 di gudang.
                    if (!stock) {
                        stock = {
                            barcode: nextBarcode(),
                            kode: master.kode,
                            nama: master.nama,
                            qty: 0,
                            stockAwal: 0,
                            minStock: Number(master.minStock) || 0,
                            lokasi: master.lokasi || 'RAK UTAMA',
                            satuan: master.satuan || 'PCS',
                            harga: masterHarga,
                            totalHarga: 0,
                        };
                        this.spareparts.push(stock);
                        if (codeKey && !stockByCode.has(codeKey)) stockByCode.set(codeKey, stock);
                        if (!codeKey && key && !stockByName.has(key)) stockByName.set(key, stock);
                    } else {
                        // PENTING: jangan pernah menimpa qty gudang dengan stok Data Master.
                        // qty yang ada adalah stok terbaru setelah transaksi sebelumnya.
                        const currentWarehouseQty = Math.max(0, Number(stock.qty) || 0);
                        stock.kode = master.kode || stock.kode;
                        stock.nama = master.nama;
                        stock.minStock = Number(master.minStock) || 0;
                        stock.harga = masterHarga;
                        stock.qty = currentWarehouseQty;
                        stock.totalHarga = masterHarga * currentWarehouseQty;
                        stock.satuan = master.satuan || stock.satuan || 'PCS';
                        stock.lokasi = master.lokasi || stock.lokasi || '';
                        stock.stockAwal = 0;
                    }

                });

                // Data yang hanya ada di Gudang Sparepart tidak boleh membuat atau menimpa Data Master.
                // Master Data tetap menjadi sumber data otoritatif untuk stok Spare Part.
            },
            onPurchaseRequestHeaderInput() {
                const pr = String(this.formOrderMulti.nomorPR || '').trim().toLowerCase().replace(/\s+/g, ' ');
                if (!pr) {
                    this.formOrderMulti.prioritas = '';
                    return;
                }
                const existing = this.monitoringItems.find(order =>
                    String(order.nomorPR || '').trim().toLowerCase().replace(/\s+/g, ' ') === pr
                );
                if (existing) {
                    this.formOrderMulti.prioritas = existing.prioritas || '';
                    this.formOrderMulti.keperluan = existing.keperluan || existing.project || '';
                }
            },
            onMonitoringItemInput(item) {
                this.masterAutocompleteQuery = item.nama || '';
                if (!item.nama) return;
                const match = this.masterCatalog.find(m => String(m.nama || '').trim().toLowerCase() === String(item.nama || '').trim().toLowerCase());
                if (match) {
                    item.orderSatuan = String(match.satuan || 'Pcs').trim();
                    item.satuan = item.orderSatuan;
                    item.harga = Number(match.harga) || 0;
                }
            },
            removeMonitoringItemToProcess(idx) {
                this.formOrderMulti.itemsToProcess.splice(idx, 1);
            },
            normalizePriorityValue(value) {
                const raw = String(value || '').trim();
                return /^\d+$/.test(raw) && Number(raw) >= 1 ? String(Number(raw)) : '';
            },
            getPurchaseRequestPriorityGroups(excludedPRKey = '') {
                const normalizePR = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                const groups = new Map();
                (this.monitoringItems || []).forEach((order, index) => {
                    const prKey = normalizePR(order.nomorPR);
                    if (!prKey || prKey === excludedPRKey || groups.has(prKey)) return;
                    groups.set(prKey, {
                        key: prKey,
                        priority: Number(this.normalizePriorityValue(order.prioritas) || 999999),
                        firstIndex: index
                    });
                });
                return Array.from(groups.values()).sort((a, b) => {
                    if (a.priority !== b.priority) return a.priority - b.priority;
                    return a.firstIndex - b.firstIndex;
                });
            },
            applyPurchaseRequestPriorityOrder(groups) {
                const normalizePR = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                (groups || []).forEach((group, index) => {
                    const priority = String(index + 1);
                    (this.monitoringItems || []).forEach(order => {
                        if (normalizePR(order.nomorPR) === group.key) order.prioritas = priority;
                    });
                });
            },
            shiftPurchaseRequestPrioritiesForInsert(newPriority, excludedPRKey = '') {
                const p = Number(newPriority);
                if (!Number.isFinite(p) || p < 1) return;
                const groups = this.getPurchaseRequestPriorityGroups(excludedPRKey);
                const insertAt = Math.min(Math.max(Math.floor(p) - 1, 0), groups.length);
                groups.splice(insertAt, 0, { key: '__NEW_PR__', priority: p, firstIndex: -1 });
                this.applyPurchaseRequestPriorityOrder(groups.filter(group => group.key !== '__NEW_PR__'));
                this._pendingInsertedPriorityOrder = groups;
            },
            finalizeInsertedPurchaseRequestPriority(prKey) {
                if (!this._pendingInsertedPriorityOrder) return;
                const groups = this._pendingInsertedPriorityOrder;
                const normalizePR = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                const newGroup = groups.find(group => group.key === '__NEW_PR__');
                if (newGroup) newGroup.key = normalizePR(prKey);
                this.applyPurchaseRequestPriorityOrder(groups);
                this._pendingInsertedPriorityOrder = null;
            },
            changePurchaseRequestPriority(order, newPriority) {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                if (!order) return;
                const normalizedPriority = this.normalizePriorityValue(newPriority);
                if (!normalizedPriority) return alert('Skala prioritas harus berupa angka bulat mulai dari 1.');
                const normalizePR = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                const prKey = normalizePR(order.nomorPR);
                const groups = this.getPurchaseRequestPriorityGroups('');
                const currentIndex = groups.findIndex(group => group.key === prKey);
                if (currentIndex === -1) return;
                const [moving] = groups.splice(currentIndex, 1);
                const targetIndex = Math.min(Math.max(Number(normalizedPriority) - 1, 0), groups.length);
                groups.splice(targetIndex, 0, moving);
                this.applyPurchaseRequestPriorityOrder(groups);
            },
            async simpanOrderMulti() {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                // Input PR dibuat fleksibel: hanya Nomor PR dan minimal 1 barang yang wajib.
                // Field lain boleh kosong dan akan diberi nilai default agar tidak menghambat input.
                const nomorPR = String(this.formOrderMulti.nomorPR || '').trim();
                if (!nomorPR) return alert('Nomor Purchase Request wajib diisi.');
                const pemesan = String(this.formOrderMulti.pemesan || '').trim() || '-';
                const nomorPO = String(this.formOrderMulti.nomorPO || '').trim().toUpperCase();
                const supplier = String(this.formOrderMulti.supplier || '').trim().toUpperCase();
                const keperluanPR = String(this.formOrderMulti.keperluan || '').trim() || '-';
                if (this.formOrderMulti.itemsToProcess.length === 0) return alert('Tambahkan minimal 1 item order!');
                const normalizePR = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                const normalizePO = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                const normalizeItemName = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                const existingPR = this.monitoringItems.find(order =>
                    normalizePR(order.nomorPR) === normalizePR(nomorPR)
                );
                let prioritasPR = this.normalizePriorityValue(this.formOrderMulti.prioritas);
                const prKey = normalizePR(nomorPR);
                if (existingPR) {
                    prioritasPR = this.normalizePriorityValue(existingPR.prioritas) || prioritasPR;
                }
                // Jika prioritas dikosongkan, otomatis ditempatkan setelah prioritas terakhir.
                // Tidak perlu mengisi urutan angka secara manual.
                if (!prioritasPR) {
                    const priorityValues = this.monitoringItems
                        .map(order => Number(this.normalizePriorityValue(order.prioritas)))
                        .filter(value => Number.isFinite(value) && value >= 1);
                    prioritasPR = priorityValues.length ? Math.max(...priorityValues) + 1 : 1;
                }
                let isValid = true;
                this.formOrderMulti.itemsToProcess.forEach(item => {
                    if (!item.nama) isValid = false;
                });
                if (!isValid) return alert('Mohon isi nama barang di semua item!');
                const duplicateItemNames = new Set();
                for (const item of this.formOrderMulti.itemsToProcess) {
                    const itemKey = normalizeItemName(item.nama);
                    if (duplicateItemNames.has(itemKey)) return alert(`Barang "${item.nama}" tidak boleh dimasukkan dua kali pada Nomor Purchase Request ${nomorPR}.`);
                    duplicateItemNames.add(itemKey);
                    const duplicateExisting = this.monitoringItems.some(order =>
                        normalizePR(order.nomorPR) === prKey &&
                        normalizePO(order.nomorPO) === normalizePO(nomorPO) &&
                        normalizeItemName(order.nama) === itemKey
                    );
                    if (duplicateExisting) return alert(`Duplikat ditolak: Nomor Purchase Request ${nomorPR}, Nomor PO ${nomorPO || '-'} dengan barang "${item.nama}" sudah ada.`);
                }
                if (!existingPR) {
                    this.shiftPurchaseRequestPrioritiesForInsert(prioritasPR, prKey);
                }
                // REVISI 1 (MONITORING): Tanggal tanpa jam
                const selectedDate = this.getDateFromInput(this.formOrderMulti.tanggal || new Date().toISOString().slice(0, 10));
                const dateOnlyStr = this.getFormattedDateOnly(selectedDate);
                const isoNow = selectedDate.toISOString();
                this.formOrderMulti.itemsToProcess.forEach(item => {
                    const totalQty = Number(item.orderQty) || 1;
                    const hargaSatuan = this.getMasterHarga(item.nama, item.harga);
                    this.monitoringItems.unshift({
                        id: Date.now() + Math.random(),
                        isoDate: isoNow,
                        tgl: dateOnlyStr,
                        nomorPR: nomorPR,
                        nomorPO: nomorPO,
                        supplier: supplier,
                        nama: item.nama.toUpperCase(),
                        keperluan: keperluanPR.toUpperCase(),
                        prioritas: prioritasPR,
                        penerima: pemesan.toUpperCase(),
                        pengambil: '',
                        qtyTotal: totalQty,
                        qtyReceived: 0,
                        qtyRemaining: totalQty,
                        harga: hargaSatuan,
                        totalHarga: hargaSatuan * totalQty,
                        satuan: String(this.getMasterSatuan(item.nama, item.orderSatuan || 'Pcs') || 'Pcs').trim().toUpperCase(),
                        status: 'Pending'
                    });
                });
                if (!existingPR) this.finalizeInsertedPurchaseRequestPriority(prKey);
                const saved = await this.saveToSupabase();
                if (!saved) {
                    alert('Purchase Request sudah dimasukkan ke layar, tetapi belum berhasil disimpan ke database. Data lokal dipertahankan; silakan coba simpan lagi setelah koneksi/izin diperbaiki.');
                    return;
                }
                this.showMonitoringInputModal = false;
                this.purchaseRequestPage = 1;
                alert('Order berhasil dimasukkan ke Monitoring!');
            },
            async editMonitoringOrder(order) {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                if (!order) return;
                const normalizePR = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                const nomorPRLama = String(order.nomorPR || '').trim();
                const nomorPRBaruInput = prompt('Nomor Purchase Request:', nomorPRLama);
                if (nomorPRBaruInput === null) return;
                const nomorPRBaru = String(nomorPRBaruInput || '').trim();
                if (!nomorPRBaru) return alert('Nomor Purchase Request wajib diisi.');

                const nomorPOBaruInput = prompt('Nomor Purchase Order:', order.nomorPO || '');
                if (nomorPOBaruInput === null) return;
                const nomorPOBaru = String(nomorPOBaruInput || '').trim().toUpperCase();
                const supplierBaruInput = prompt('Supplier:', order.supplier || '');
                if (supplierBaruInput === null) return;
                const supplierBaru = String(supplierBaruInput || '').trim().toUpperCase();

                const keteranganBaru = prompt('Keterangan / project:', order.keperluan || order.project || '');
                if (keteranganBaru === null) return;
                const prioritasBaru = prompt('Skala Prioritas (angka 1 sampai tak terhingga):', order.prioritas || '');
                if (prioritasBaru === null) return;
                const normalizedPriority = this.normalizePriorityValue(prioritasBaru);
                if (!normalizedPriority) {
                    return alert('Skala prioritas harus berupa angka bulat mulai dari 1.');
                }

                const prBaruKey = normalizePR(nomorPRBaru);
                const namaKey = String(order.nama || '').trim().toLowerCase();
                const duplicatePRItem = this.monitoringItems.some(item =>
                    item !== order &&
                    normalizePR(item.nomorPR) === prBaruKey &&
                    String(item.nama || '').trim().toLowerCase() === namaKey
                );
                if (duplicatePRItem) {
                    return alert(`Duplikat ditolak: Nomor Purchase Request ${nomorPRBaru} sudah memiliki barang ${order.nama}.`);
                }

                const qtyBaruInput = prompt(`Qty order ${order.nama}:`, order.qtyTotal);
                if (qtyBaruInput === null) return;
                const qtyBaru = Number(qtyBaruInput);
                if (!Number.isFinite(qtyBaru) || qtyBaru <= 0) return alert('Qty order harus lebih dari 0.');
                const oldReceived = Number(order.qtyReceived) || 0;
                if (qtyBaru < oldReceived) return alert('Qty order tidak boleh lebih kecil dari qty yang sudah diterima.');

                order.nomorPR = nomorPRBaru.toUpperCase();
                order.nomorPO = nomorPOBaru;
                order.supplier = supplierBaru;
                order.keperluan = String(keteranganBaru).trim().toUpperCase();
                this.changePurchaseRequestPriority(order, normalizedPriority);
                order.qtyTotal = qtyBaru;
                order.qtyRemaining = Math.max(0, qtyBaru - oldReceived);
                order.status = order.qtyRemaining <= 0 ? 'Diterima Semua' : (oldReceived > 0 ? 'Diterima Sebagian' : 'Pending');
                this.monitoringHistory.forEach(h => {
                    if (String(h.monitoringOrderId) === String(order.id)) {
                        h.nomorPR = order.nomorPR;
                        h.nomorPO = order.nomorPO;
                        h.supplier = order.supplier;
                        h.keperluan = order.keperluan;
                        h.keterangan = order.keperluan;
                    }
                });
                this.logs.forEach(log => {
                    if (String(log.monitoringOrderId) === String(order.id)) {
                        log.nomorPR = order.nomorPR;
                        log.nomorPO = order.nomorPO;
                        log.supplier = order.supplier;
                    }
                });
                // Simpan langsung supaya perubahan Purchase Order/Monitoring
                // langsung tersinkron ke Dashboard dan perangkat/tab lain.
                await this.saveToSupabase();
                alert(`Purchase Request ${order.nama} berhasil diperbarui.`);
            },
            recalculateWarehouseLogChain(gudang, nama) {
                // Kompatibilitas untuk pemanggil lama (mis. Cancel PR), tetapi
                // perhitungannya tetap memakai mesin timeline yang sama.
                this.getWarehouseTransactionTimeline(gudang);
            },
            async cancelPurchaseReceipt(history) {
                if (!this.canEdit) return alert('Akun Viewer hanya dapat melihat data.');
                if (!history) return;

                // History PR pada tabel adalah object tampilan/salinan. Selalu ambil
                // record asli dari monitoringHistory agar Cancel benar-benar tersimpan.
                const originalHistory = this.monitoringHistory.find(h => String(h.id) === String(history.id));
                if (!originalHistory) return alert('Riwayat penerimaan tidak ditemukan. Silakan refresh data terlebih dahulu.');
                if (this.isCancelledLog(originalHistory) || Number(originalHistory.qty) <= 0) return;

                const qtyOld = Math.max(0, Number(originalHistory.qty) || 0);
                if (!confirm(`Batalkan penerimaan ${originalHistory.nama} sebanyak ${qtyOld} ${originalHistory.satuan || ''}? Qty penerimaan akan menjadi 0 dan sisa PR dikembalikan.`)) return;

                const order = this.monitoringItems.find(o => String(o.id) === String(originalHistory.monitoringOrderId));
                const log = this.logs.find(l =>
                    String(l.id) === String(originalHistory.monitoringLogId) ||
                    String(l.monitoringHistoryId) === String(originalHistory.id)
                );
                const stock = this.spareparts.find(s =>
                    String(s.nama || '').trim().toLowerCase() === String(originalHistory.nama || '').trim().toLowerCase()
                );
                const approved = String(originalHistory.approvalStatus || '').toLowerCase() !== 'pending' && !this.isPendingLog(originalHistory);

                // Snapshot agar jika penyimpanan server gagal, perubahan lokal tidak
                // terlihat sebagai berhasil.
                const historyBefore = JSON.parse(JSON.stringify(originalHistory));
                const logBefore = log ? JSON.parse(JSON.stringify(log)) : null;
                const orderBefore = order ? JSON.parse(JSON.stringify(order)) : null;
                const stockBefore = stock ? JSON.parse(JSON.stringify(stock)) : null;

                if (approved && log && qtyOld > 0) {
                    if (stock && (Number(stock.qty) || 0) < qtyOld) {
                        return alert('Cancel tidak dapat dilakukan karena stok Sparepart saat ini lebih kecil dari qty penerimaan yang akan dibatalkan.');
                    }
                    if (stock) {
                        stock.qty = Math.max(0, (Number(stock.qty) || 0) - qtyOld);
                        stock.totalHarga = (Number(stock.harga) || 0) * stock.qty;
                    }
                }

                // Pola Cancel disamakan dengan histori gudang: histori tetap ada,
                // tetapi qty transaksi menjadi 0 dan diberi penanda pembatalan.
                originalHistory.qty = 0;
                originalHistory.totalHarga = 0;
                originalHistory.status = 'Cancel Penerimaan';
                originalHistory.approvalStatus = 'approved';
                originalHistory.isCancelled = true;
                originalHistory.cancelledAt = new Date().toISOString();
                originalHistory.cancelledBy = this.authUser?.email || this.authUser?.id || 'Super Admin';

                if (log) {
                    log.qty = 0;
                    log.totalHarga = 0;
                    log.qtyAkhir = log.qtyAwal;
                    log.keperluan = `${log.keperluan || 'Penerimaan Monitoring'} [CANCEL]`;
                    log.status = 'Cancelled';
                    log.approvalStatus = 'approved';
                    log.isCancelled = true;
                    log.cancelledAt = originalHistory.cancelledAt;
                    log.cancelledBy = originalHistory.cancelledBy;
                }

                if (order) {
                    order.qtyReceived = Math.max(0, (Number(order.qtyReceived) || 0) - qtyOld);
                    order.qtyRemaining = Math.max(0, (Number(order.qtyTotal) || 0) - order.qtyReceived);
                    order.status = order.qtyRemaining <= 0 ? 'Diterima Semua' : order.qtyReceived > 0 ? 'Diterima Sebagian' : 'Pending';
                    this.monitoringHistory.forEach(h => {
                        if (String(h.monitoringOrderId) === String(order.id) && Number(h.qty) > 0) h.status = order.status;
                    });
                }

                this.recalculateWarehouseLogChain('Sparepart', originalHistory.nama);
                this.syncMasterStockForSparepart(stock);

                const saved = await this.saveToSupabase();
                if (!saved) {
                    Object.assign(originalHistory, historyBefore);
                    if (log && logBefore) Object.assign(log, logBefore);
                    if (order && orderBefore) Object.assign(order, orderBefore);
                    if (stock && stockBefore) Object.assign(stock, stockBefore);
                    this.recalculateWarehouseLogChain('Sparepart', originalHistory.nama);
                    this.syncMasterStockForSparepart(stock);
                    return alert('Pembatalan History PR gagal disimpan ke Supabase. Perubahan dibatalkan.');
                }

                alert(`Penerimaan ${originalHistory.nama} dibatalkan. Qty penerimaan menjadi 0 dan sisa PR dikembalikan.`);
            },
            async cancelOrder(order) {
                if (!this.canEdit) return alert('Akun Viewer hanya dapat melihat data.');

                if (confirm(`Yakin ingin membatalkan/cancel order ${order.nama}?`)) {
                    order.status = 'Cancel';
                    await this.saveToSupabase();
                    alert(`Order ${order.nama} berhasil dicancel.`);
                }
            },
            async terimaBarang(order) {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                if (!order) return;
                const prKey = String(order.nomorPR || '').trim().toLowerCase();
                const related = this.monitoringItems.filter(o => String(o.nomorPR || '').trim().toLowerCase() === prKey && o.status !== 'Cancel' && (Number(o.qtyRemaining) || 0) > 0);
                this.purchaseReceiptItems = related.map(o => ({ orderId:o.id, nama:o.nama, nomorPR:o.nomorPR || order.nomorPR || '', satuan:o.satuan || 'Pcs', qtyRemaining:Number(o.qtyRemaining)||0, qty: Number(o.qtyRemaining)||0, harga:Number(this.getMasterHarga(o.nama,o.harga))||0 }));
                this.purchaseReceiptDate = this.getISODateOnly();
                this.purchaseReceiptPO = order.nomorPO || '';
                this.purchaseReceiptSupplier = order.supplier || '';
                this.showPurchaseReceiptModal = true;
                this.$nextTick(() => this.refreshIcons());
            },
            async submitPurchaseReceipt() {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                if (!this.purchaseReceiptDate) return alert('Tanggal penerimaan wajib dipilih.');
                if (!String(this.purchaseReceiptPO || '').trim()) return alert('Nomor Purchase Order wajib diisi.');
                if (!String(this.purchaseReceiptSupplier || '').trim()) return alert('Supplier wajib diisi.');
                const items = (this.purchaseReceiptItems || []).filter(x => Number(x.qty) > 0);
                if (!items.length) return alert('Isi minimal satu Qty penerimaan.');
                const selectedDate = this.getDateFromInput(this.purchaseReceiptDate);
                const dateOnlyStr = this.getFormattedDateOnly(selectedDate);
                const isoNow = selectedDate.toISOString();
                for (const item of items) {
                    const order = this.monitoringItems.find(o => String(o.id) === String(item.orderId));
                    if (!order) continue;
                    const qty = Math.round(Number(item.qty) || 0);
                    if (qty <= 0 || qty > Number(order.qtyRemaining || 0)) return alert(`Qty penerimaan ${item.nama} melebihi sisa order.`);
                    const stockItem = this.spareparts.find(s => String(s.nama||'').trim().toLowerCase() === String(order.nama||'').trim().toLowerCase());
                    const qtyAwal = stockItem ? this.getLatestWarehouseStock('Sparepart', stockItem.nama, stockItem.barcode) : 0;
                    const harga = Number(this.getMasterHarga(order.nama, order.harga)) || 0;
                    const historyId = Date.now() + Math.random();
                    const logId = Date.now() + Math.random();
                    this.monitoringHistory.unshift({ id:historyId, createdAt:new Date().toISOString(), type:'IN', tgl:dateOnlyStr, isoDate:isoNow, nomorPR:order.nomorPR||'', nomorPO:String(this.purchaseReceiptPO || order.nomorPO || '').trim(), supplier:String(this.purchaseReceiptSupplier || order.supplier || '').trim(), keperluan:order.keperluan||order.project, keterangan:order.keperluan||order.project||'', nama:order.nama, qty, harga, totalHarga:harga*qty, satuan:String(this.getMasterSatuan(order.nama,order.satuan||'Pcs',order.kode||order.barcode||'')||'Pcs').trim().toUpperCase(), status:'Menunggu Persetujuan', monitoringOrderId:order.id, monitoringLogId:logId, approvalStatus:'pending' });
                    this.logs.unshift({ id:logId, createdAt:new Date().toISOString(), isoDate:isoNow, gudang:'Sparepart', type:'IN', nama:order.nama, qty, harga, qtyAwal, qtyAkhir:qtyAwal+qty, totalHarga:harga*qty, tgl:dateOnlyStr, supplier:String(this.purchaseReceiptSupplier || order.supplier || '').trim(), nomorPR:order.nomorPR||'', nomorPO:String(this.purchaseReceiptPO || order.nomorPO || '').trim(), keperluan:`Penerimaan Monitoring (${order.keperluan||order.project||'-'})`, keterangan:order.keperluan||order.project||'', monitoringOrderId:order.id, monitoringHistoryId:historyId, satuan:String(this.getMasterSatuan(order.nama,order.satuan||'Pcs',order.kode||order.barcode||'')||'Pcs').trim().toUpperCase(), approvalStatus:'pending' });
                }
                this.showPurchaseReceiptModal = false;
                const saved = await this.saveToSupabase();
                if (!saved) return alert('Penerimaan sudah muncul di layar, tetapi gagal disimpan ke database.');
                alert('Penerimaan berhasil dicatat sekaligus dan menunggu persetujuan Super Admin.');
            },
            printBAST(order) {
                if (!this.canPrint) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat mencetak.');
                if (!order) return alert('Data BAST tidak ditemukan.');
                const isHistory = order.qtyReceived == null && order.qty != null;
                const qtyReceived = isHistory ? (Number(order.qty) || 0) : (Number(order.qtyReceived) || 0);
                if (qtyReceived <= 0) return alert('BAST hanya dapat dibuat untuk order yang sudah diterima.');

                const sourceDate = order.tgl || this.getFormattedDateOnly();
                const printDate = this.getFormattedDateOnly();
                const formatDate = (value) => {
                    const text = String(value || '').trim();
                    if (!text) return '-';
                    const m = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                    return m ? `${m[3]}/${m[2]}/${m[1]}` : text;
                };

                this.bastData = {
                    noBPB: order.noBPB || order.nomorBPB || order.bpb || order.noBpb || '',
                    date: formatDate(sourceDate),
                    printDate: formatDate(printDate),
                    supplier: order.supplier || order.asalBarang || order.vendor || '',
                    alamat: order.alamatSupplier || order.alamat || order.supplierAlamat || '',
                    kodeSupplier: order.kodeSupplier || order.supplierCode || '',
                    kodeDept: order.kodeDept || order.departemen || '',
                    noPO: order.noPO || order.nomorPO || order.po || '',
                    noSJ: order.noSJ || order.nomorSJ || order.sj || '',
                    nomorPR: order.nomorPR || '',
                    nama: order.nama || '',
                    qtyReceived,
                    satuan: order.satuan || this.getMasterSatuan(order.nama) || '',
                    hasilAnalisa: order.hasilAnalisa || order.keterangan || '',
                    createdBy: order.createdBy || order.user || order.penginput || '',
                    approvedBy: order.approvedBy || '',
                    verifiedBy: order.verifiedBy || ''
                };
                document.body.classList.remove('printing-label');
                document.body.classList.add('printing-bast');
                const bastPageStyle = document.createElement('style');
                bastPageStyle.id = 'bast-page-style';
                bastPageStyle.textContent = '@page { size: A4 landscape; margin: 20mm; }';
                document.head.appendChild(bastPageStyle);
                this.$nextTick(() => {
                    const logo = document.querySelector('#bast-print-area img');
                    const doPrint = () => {
                        window.print();
                        document.body.classList.remove('printing-bast');
                        const style = document.getElementById('bast-page-style');
                        if (style) style.remove();
                    };
                    if (logo && !logo.complete) {
                        logo.onload = doPrint;
                        logo.onerror = doPrint;
                    } else {
                        doPrint();
                    }
                });
            },
            openSparepartMultiOutModal() {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');

                this.formSparepartMultiOut = {
                    user: '',
                    tanggal: this.getISODateOnly(),
                    selectedItems: [this.createSparepartMultiOutItem()]
                };
                this.showSparepartMultiOutModal = true;
            },
            createSparepartMultiOutItem() {
                return {
                    barcode: '',
                    harga: 0,
                    outQty: 1,
                    qty: 0,
                    satuan: 'Pcs',
                    harga: 0,
                    outQty: 1,
                    harga: 0,
                    lokasi: ''
                };
            },
            addCustomItemToSparepartMultiOut() {
                this.formSparepartMultiOut.selectedItems.push(this.createSparepartMultiOutItem());
            },
            onSparepartMultiOutItemInput(item) {
                const nama = (item.nama || '').trim().toLowerCase();
                const stockItem = this.spareparts.find(s => (s.nama || '').trim().toLowerCase() === nama);
                if (stockItem) {
                    item.barcode = stockItem.barcode;
                    item.qty = Number(stockItem.qty) || 0;
                    this.syncTransactionSatuan(item, stockItem.nama, stockItem.satuan || item.satuan || 'Pcs');
                    item.harga = this.getMasterHarga(stockItem.nama, stockItem.harga);
                    if (item.outQty > item.qty) item.outQty = item.qty || 1;
                } else {
                    item.barcode = '';
                    item.qty = 0;
                    item.satuan = 'Pcs';
                    item.harga = 0;
                    item.lokasi = '';
                    item.harga = 0;
                }
            },
            removeSparepartOutItem(idx) {
                this.formSparepartMultiOut.selectedItems.splice(idx, 1);
            },
            getPendingOutboundQty(gudang, item, excludeLogId = null) {
                const normalize = value => String(value || '').trim().toLowerCase();
                const nama = normalize(item?.nama);
                const kode = normalize(item?.kode || item?.barcode);
                return this.logs
                    .filter(log => {
                        if (excludeLogId !== null && String(log.id) === String(excludeLogId)) return false;
                        if (String(log.gudang || '').trim().toLowerCase() !== String(gudang || '').trim().toLowerCase()) return false;
                        if (String(log.type || '').toUpperCase() !== 'OUT') return false;
                        if (!this.isPendingLog(log)) return false;
                        const logNama = normalize(log.nama);
                        const logKode = normalize(log.kode || log.barcode);
                        return (kode && logKode && kode === logKode) || logNama === nama;
                    })
                    .reduce((sum, log) => sum + Math.max(0, Number(log.qty) || 0), 0);
            },
            getAvailableOutboundStock(gudang, item, excludeLogId = null) {
                const currentStock = Math.max(0, Number(item?.qty) || 0);
                const reserved = this.getPendingOutboundQty(gudang, item, excludeLogId);
                return Math.max(0, currentStock - reserved);
            },
            async submitSparepartMultiOut() {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                if (!this.formSparepartMultiOut.penerima || !this.formSparepartMultiOut.penerima.trim()) return alert('Nama Penerima wajib diisi!');
                if (!this.formSparepartMultiOut.tanggal) return alert('Tanggal pengeluaran wajib dipilih!');
                if (!this.formSparepartMultiOut.keperluan || !this.formSparepartMultiOut.keperluan.trim()) return alert('Kepentingan / Keterangan wajib diisi!');
                if (this.formSparepartMultiOut.selectedItems.length === 0) return alert('Tambahkan minimal 1 item!');
                const validNames = this.formSparepartMultiOut.selectedItems.filter(item => item.nama && item.nama.trim());
                if (validNames.length !== this.formSparepartMultiOut.selectedItems.length) return alert('Nama barang wajib diisi pada semua item!');
                const duplicateBarcodes = validNames.map(item => item.barcode).filter((barcode, index, arr) => barcode && arr.indexOf(barcode) !== index);
                if (duplicateBarcodes.length > 0) return alert('Barang yang sama tidak boleh dimasukkan lebih dari satu kali.');
                for (const item of this.formSparepartMultiOut.selectedItems) {
                    const target = this.spareparts.find(s => s.barcode === item.barcode);
                    if (!target) return alert(`Barang "${item.nama}" tidak ditemukan di stok Spare Part!`);
                    if (!Number.isFinite(Number(item.outQty)) || Number(item.outQty) <= 0) return alert(`Qty keluar ${item.nama} harus lebih dari 0!`);
                    const availableForThisOutbound = this.getAvailableOutboundStock('Sparepart', target);
                    if (Number(item.outQty) > availableForThisOutbound) {
                        return alert(`Qty keluar ${item.nama} melebihi stok tersedia setelah memperhitungkan pengeluaran yang masih menunggu approval. Stok yang masih bisa dikeluarkan: ${availableForThisOutbound}.`);
                    }
                }
                const selectedDate = this.getDateFromInput(this.formSparepartMultiOut.tanggal);
                const dateOnlyStr = this.getFormattedDateOnly(selectedDate);
                const isoNow = selectedDate.toISOString();
                this.formSparepartMultiOut.selectedItems.forEach(item => {
                    const target = this.spareparts.find(s => s.barcode === item.barcode);
                    const qtyAwal = this.getLatestWarehouseStock('Sparepart', target.nama, target.barcode);
                    const outQty = Number(item.outQty);
                    const hargaBarang = Number(item.harga != null ? item.harga : this.getMasterHarga(target.nama, target.harga)) || 0;
                    this.logs.unshift({
                        id: Date.now() + Math.random(),
                        createdAt: new Date().toISOString(),
                        isoDate: isoNow,
                        gudang: 'Sparepart',
                        type: 'OUT',
                        nama: target.nama,
                        barcode: target.barcode || item.barcode || '',
                        qty: outQty,
                        qtyAwal: qtyAwal,
                        qtyAkhir: qtyAwal - outQty,
                        harga: hargaBarang,
                        totalHarga: hargaBarang * outQty,
                        tgl: dateOnlyStr,
                        user: this.formSparepartMultiOut.penerima.toUpperCase(),
                        pengambil: '',
                        penerima: this.formSparepartMultiOut.penerima.toUpperCase(),
                        keperluan: this.formSparepartMultiOut.keperluan.toUpperCase(),
                        nomorPR: String(this.formSparepartMultiOut.nomorPR || '').trim().toUpperCase(),
                        satuan: String(this.getMasterSatuan(target.nama, target.satuan || item.satuan || 'Pcs') || 'Pcs').trim().toUpperCase(),
                        approvalStatus: 'pending'
                    });
                });
                this.showSparepartMultiOutModal = false;
                this.closeMasterDropdown();
                this.formSparepartMultiOut = { user: '', tanggal: this.getISODateOnly(), nomorPR: '', penerima: '', keperluan: '', selectedItems: [this.createSparepartMultiOutItem()] };
                let savedSparepartOut = await this.saveToSupabase();
                if (!savedSparepartOut) {
                    // Coba sekali lagi setelah request sebelumnya benar-benar selesai.
                    await new Promise(resolve => setTimeout(resolve, 500));
                    this.supabaseLocalDirty = true;
                    savedSparepartOut = await this.saveToSupabase();
                }
                if (!savedSparepartOut) return alert('Pengeluaran Spare Part sudah muncul di layar, tetapi gagal disimpan ke Supabase. Data tidak dihapus dari layar; silakan cek koneksi/otorisasi lalu simpan kembali.');
                alert('Pengeluaran barang dicatat, tersimpan ke Supabase, dan menunggu persetujuan Super Admin. Stok belum berubah.');
            },
            openSisaProjectMultiInModal() {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');

                this.formSisaProjectMultiIn = { 
                    supplier: '',
                    nomorPR: '',
                    penyerah: '',
                    penerima: '',
                    keperluan: '',
                    tanggal: this.getISODateOnly(), 
                    itemsToProcess: [{ kode: 'MANUAL-' + Date.now(), nama: '', qty: 1, harga: 0, satuan: 'Pcs', lokasi: 'RAK SISA' }] 
                };
                this.showSisaProjectMultiInModal = true;
            },
            addCustomItemToSisaProjectMultiIn() {
                this.formSisaProjectMultiIn.itemsToProcess.push({
                    kode: 'MANUAL-' + Date.now(),
                    nama: '',
                    qty: 1,
                    harga: 0,
                    satuan: 'Pcs',
                    lokasi: 'RAK SISA'
                });
            },
            onSisaProjectMultiInItemInput(item) {
                this.masterAutocompleteQuery = item.nama || '';
                const key = String(item.nama || '').trim().toLowerCase();
                if (!key) return;
                const match = this.masterCatalog.find(m => String(m.nama || '').trim().toLowerCase() === key);
                if (match) {
                    this.syncTransactionSatuan(item, match.nama, match.satuan || 'Pcs');
                }
            },
            removeSisaProjectMultiInItem(idx) {
                this.formSisaProjectMultiIn.itemsToProcess.splice(idx, 1);
            },
            async submitSisaProjectMultiIn() {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                if (!this.formSisaProjectMultiIn.supplier) return alert('Asal Vendor / Supplier wajib diisi!');
                if (!this.formSisaProjectMultiIn.penyerah || !this.formSisaProjectMultiIn.penyerah.trim()) return alert('Nama Yang Menyerahkan wajib diisi!');
                if (!this.formSisaProjectMultiIn.penerima || !this.formSisaProjectMultiIn.penerima.trim()) return alert('Nama Penerima wajib diisi!');
                if (!this.formSisaProjectMultiIn.keperluan || !this.formSisaProjectMultiIn.keperluan.trim()) return alert('Kepentingan / Project wajib diisi!');
                if (!this.formSisaProjectMultiIn.tanggal) return alert('Tanggal penerimaan wajib dipilih!');
                if (this.formSisaProjectMultiIn.itemsToProcess.length === 0) return alert('Tambahkan minimal 1 item!');
                const normalizeSisa = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
                const asalSisa = normalizeSisa(this.formSisaProjectMultiIn.supplier);
                const projectKey = normalizeSisa(this.formSisaProjectMultiIn.keperluan || '-');
                const seenSisa = new Set();
                for (const item of this.formSisaProjectMultiIn.itemsToProcess) {
                    if (!item.nama) continue;
                    const namaKey = normalizeSisa(item.nama);
                    const compositeKey = [namaKey, asalSisa, projectKey].join('|');
                    if (seenSisa.has(compositeKey)) return alert(`Duplikat ditolak: barang "${item.nama}" dengan asal "${this.formSisaProjectMultiIn.supplier}" dan project "${this.formSisaProjectMultiIn.keperluan || '-'}" dimasukkan lebih dari satu kali.`);
                    seenSisa.add(compositeKey);
                    const duplicateExisting = this.sisaProjects.some(stock =>
                        normalizeSisa(stock.nama) === namaKey &&
                        normalizeSisa(stock.supplier || stock.asal || '') === asalSisa &&
                        normalizeSisa(stock.keperluan || stock.project || '-') === projectKey
                    );
                    const duplicatePending = this.logs.some(log =>
                        log.gudang === 'Sisa Project' && log.type === 'IN' && this.isPendingLog(log) &&
                        normalizeSisa(log.nama) === namaKey &&
                        normalizeSisa(log.supplier || log.asal || '') === asalSisa &&
                        normalizeSisa(log.keperluan || log.project || '-') === projectKey
                    );
                    if (duplicateExisting || duplicatePending) return alert(`Duplikat ditolak: barang "${item.nama}" dengan asal "${this.formSisaProjectMultiIn.supplier}" dan project "${this.formSisaProjectMultiIn.keperluan || '-'}" sudah ada.`);
                }
                const selectedDate = this.getDateFromInput(this.formSisaProjectMultiIn.tanggal);
                const dateOnlyStr = this.getFormattedDateOnly(selectedDate);
                const isoNow = selectedDate.toISOString();
                this.formSisaProjectMultiIn.itemsToProcess.forEach(item => {
                    if (!item.nama) return;
                    const namaKey = normalizeSisa(item.nama);
                    const stockItem = this.sisaProjects.find(s => normalizeSisa(s.nama) === namaKey && normalizeSisa(s.supplier || s.asal || '') === asalSisa && normalizeSisa(s.keperluan || s.project || '-') === projectKey);
                    const qtyAwal = stockItem ? this.getLatestWarehouseStock('Sisa Project', stockItem.nama, stockItem.barcode) : 0;
                    const inQty = Number(item.qty) || 1;
                    const hargaBarang = Number(item.harga != null ? item.harga : this.getMasterHarga(item.nama)) || 0;
                    this.logs.unshift({
                        id: Date.now() + Math.random(),
                        createdAt: new Date().toISOString(),
                        isoDate: isoNow,
                        gudang: 'Sisa Project',
                        type: 'IN',
                        nama: item.nama.toUpperCase(),
                        qty: inQty,
                        qtyAwal: qtyAwal,
                        qtyAkhir: qtyAwal + inQty,
                        harga: hargaBarang,
                        totalHarga: hargaBarang * inQty,
                        tgl: dateOnlyStr,
                        supplier: this.formSisaProjectMultiIn.supplier.toUpperCase(),
                        nomorPR: String(this.formSisaProjectMultiIn.nomorPR || '').trim().toUpperCase(),
                        keperluan: (this.formSisaProjectMultiIn.keperluan || '-').toUpperCase(),
                        prioritas: '',
                        penerima: this.formSisaProjectMultiIn.penerima.toUpperCase(),
                        pengambil: this.formSisaProjectMultiIn.penyerah.toUpperCase(),
                        satuan: String(this.getMasterSatuan(item.nama, item.satuan || 'Pcs') || 'Pcs').trim().toUpperCase(),
                        lokasi: (item.lokasi || 'RAK SISA').toUpperCase(),
                        approvalStatus: 'pending'
                    });
                });
                this.showSisaProjectMultiInModal = false;
                const savedSisaProjectIn = await this.saveToSupabase();
                if (!savedSisaProjectIn) return alert('Barang Sisa Project sudah muncul di layar, tetapi gagal disimpan ke Supabase.');
                alert('Barang Sisa Project dicatat, langsung disimpan ke Supabase, dan menunggu persetujuan Super Admin. Stok belum berubah.');
            },
            openSisaProjectMultiOutModal() {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');

                this.formSisaProjectMultiOut = {
                    user: '',
                    tanggal: this.getISODateOnly(),
                    nomorPR: '',
                    penyerah: '',
                    penerima: '',
                    keperluan: '',
                    selectedItems: [this.createSisaProjectMultiOutItem()]
                };
                this.showSisaProjectMultiOutModal = true;
            },
            createSisaProjectMultiOutItem() {
                return {
                    barcode: '',
                    nama: '',
                    qty: 0,
                    harga: 0,
                    satuan: 'Pcs',
                    outQty: 1,
                    keperluan: '',
                    pengambil: '',
                    penerima: ''
                };
            },
            addCustomItemToSisaProjectMultiOut() {
                this.formSisaProjectMultiOut.selectedItems.push(this.createSisaProjectMultiOutItem());
            },
            onSisaProjectMultiOutItemInput(item) {
                const nama = (item.nama || '').trim().toLowerCase();
                const stockItem = this.sisaProjects.find(s => (s.nama || '').trim().toLowerCase() === nama);
                if (stockItem) {
                    item.barcode = stockItem.barcode;
                    item.qty = Number(stockItem.qty) || 0;
                    this.syncTransactionSatuan(item, stockItem.nama, stockItem.satuan || item.satuan || 'Pcs');
                    item.harga = Number(stockItem.harga != null ? stockItem.harga : this.getMasterHarga(stockItem.nama, stockItem.harga)) || 0;
                    item.lokasi = stockItem.lokasi || '';
                    if (item.outQty > item.qty) item.outQty = item.qty || 1;
                } else {
                    item.barcode = '';
                    item.qty = 0;
                    item.satuan = 'Pcs';
                }
            },
            removeSisaProjectOutItem(idx) {
                this.formSisaProjectMultiOut.selectedItems.splice(idx, 1);
            },
            async submitSisaProjectMultiOut() {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                if (!this.formSisaProjectMultiOut.penyerah || !this.formSisaProjectMultiOut.penyerah.trim()) return alert('Nama Yang Menyerahkan wajib diisi!');
                if (!this.formSisaProjectMultiOut.penerima || !this.formSisaProjectMultiOut.penerima.trim()) return alert('Nama Penerima wajib diisi!');
                if (!this.formSisaProjectMultiOut.keterangan || !this.formSisaProjectMultiOut.keterangan.trim()) return alert('Keterangan wajib diisi!');
                if (!this.formSisaProjectMultiOut.tanggal) return alert('Tanggal pengeluaran wajib dipilih!');
                if (this.formSisaProjectMultiOut.selectedItems.length === 0) return alert('Tambahkan minimal 1 item!');
                const validNames = this.formSisaProjectMultiOut.selectedItems.filter(item => item.nama && item.nama.trim());
                if (validNames.length !== this.formSisaProjectMultiOut.selectedItems.length) return alert('Nama barang wajib diisi pada semua item!');
                const duplicateBarcodes = validNames.map(item => item.barcode).filter((barcode, index, arr) => barcode && arr.indexOf(barcode) !== index);
                if (duplicateBarcodes.length > 0) return alert('Barang yang sama tidak boleh dimasukkan lebih dari satu kali.');
                for (const item of this.formSisaProjectMultiOut.selectedItems) {
                    const target = this.sisaProjects.find(s => s.barcode === item.barcode);
                    if (!target) return alert(`Barang "${item.nama}" tidak ditemukan di stok Sisa Project!`);
                    if (!Number.isFinite(Number(item.outQty)) || Number(item.outQty) <= 0) return alert(`Qty keluar ${item.nama} harus lebih dari 0!`);
                    const availableForThisOutbound = this.getAvailableOutboundStock('Sisa Project', target);
                    if (Number(item.outQty) > availableForThisOutbound) {
                        return alert(`Qty keluar ${item.nama} melebihi stok tersedia setelah memperhitungkan pengeluaran yang masih menunggu approval. Stok yang masih bisa dikeluarkan: ${availableForThisOutbound}.`);
                    }
                }
                const selectedDate = this.getDateFromInput(this.formSisaProjectMultiOut.tanggal);
                const dateOnlyStr = this.getFormattedDateOnly(selectedDate);
                const isoNow = selectedDate.toISOString();
                this.formSisaProjectMultiOut.selectedItems.forEach(item => {
                    const target = this.sisaProjects.find(s => s.barcode === item.barcode);
                    const qtyAwal = this.getLatestWarehouseStock('Sisa Project', target.nama, target.barcode);
                    const outQty = Number(item.outQty);
                    const hargaBarang = this.getMasterHarga(target.nama, target.harga);
                    this.logs.unshift({
                        id: Date.now() + Math.random(),
                        createdAt: new Date().toISOString(),
                        isoDate: isoNow,
                        gudang: 'Sisa Project',
                        type: 'OUT',
                        nama: target.nama,
                        qty: outQty,
                        qtyAwal: qtyAwal,
                        qtyAkhir: qtyAwal - outQty,
                        harga: hargaBarang,
                        totalHarga: hargaBarang * outQty,
                        tgl: dateOnlyStr,
                        user: this.formSisaProjectMultiOut.penerima.toUpperCase(),
                        pengambil: this.formSisaProjectMultiOut.penyerah.toUpperCase(),
                        penerima: this.formSisaProjectMultiOut.penerima.toUpperCase(),
                        keperluan: '',
                        keterangan: this.formSisaProjectMultiOut.keterangan.toUpperCase(),
                        nomorPR: String(this.formSisaProjectMultiOut.nomorPR || '').trim().toUpperCase(),
                        lokasi: target.lokasi || '',
                        satuan: String(this.getMasterSatuan(target.nama, target.satuan || 'Pcs') || 'Pcs').trim().toUpperCase(),
                        approvalStatus: 'pending'
                    });
                });
                this.showSisaProjectMultiOutModal = false;
                this.closeMasterDropdown();
                this.formSisaProjectMultiOut = { user: '', tanggal: this.getISODateOnly(), nomorPR: '', penyerah: '', penerima: '', keterangan: '', selectedItems: [this.createSisaProjectMultiOutItem()] };
                let savedSisaProjectOut = await this.saveToSupabase();
                if (!savedSisaProjectOut) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    this.supabaseLocalDirty = true;
                    savedSisaProjectOut = await this.saveToSupabase();
                }
                if (!savedSisaProjectOut) return alert('Pengeluaran Sisa Project sudah muncul di layar, tetapi gagal disimpan ke Supabase. Data tidak dihapus dari layar; silakan cek koneksi/otorisasi lalu simpan kembali.');
                alert('Pengeluaran Sisa Project dicatat, tersimpan ke Supabase, dan menunggu persetujuan Super Admin. Stok belum berubah.');
            },
            openSingleOutModal(item) {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                if (!item) return;
                const gudang = this.activeTab === 'sisa_project' || this.barcodeScanWarehouse === 'Sisa Project' ? 'Sisa Project' : 'Sparepart';
                this.singleOutForm = {
                    item: item,
                    tanggal: this.getISODateOnly(),
                    gudang: gudang,
                    jenis: 'Pengeluaran / OUTBOUND',
                    nama: item.nama || '',
                    qty: 1,
                    harga: Number(this.getMasterHarga(item.nama, item.harga)) || 0,
                    satuan: String(this.getMasterSatuan(item.nama, item.satuan || 'Pcs') || 'Pcs').trim().toUpperCase(),
                    supplier: '',
                    pengambil: '',
                    penerima: '',
                    keperluan: '',
                    keterangan: ''
                };
                this.showSingleOutModal = true;
                this.$nextTick(() => this.refreshIcons());
            },
            async confirmSingleOut() {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                const f = this.singleOutForm;
                const item = f.item;
                if (!item) return;
                f.satuan = this.getMasterSatuan(f.nama || item.nama, item.satuan || f.satuan || 'Pcs');
                const requiredText = f.gudang === 'Sisa Project' ? f.keterangan : f.keperluan;
                if (!f.tanggal || !f.nama || Number(f.qty) <= 0 || !String(f.penerima || '').trim() || !String(requiredText || '').trim()) {
                    return alert(f.gudang === 'Sisa Project' ? 'Tanggal, nama barang, qty, nama penerima, dan keterangan wajib diisi.' : 'Tanggal, nama barang, qty, nama penerima, dan kepentingan/keterangan wajib diisi.');
                }
                const outQty = Number(f.qty) || 0;
                const stok = Number(item.qty) || 0;
                const availableForThisOutbound = this.getAvailableOutboundStock(f.gudang, item);
                if (outQty > availableForThisOutbound) {
                    return alert(`Qty melebihi stok yang masih tersedia. Stok yang dapat dikeluarkan: ${availableForThisOutbound}.`);
                }
                const selectedDate = this.getDateFromInput(f.tanggal);
                const dateOnlyStr = this.getFormattedDateOnly(selectedDate);
                const hargaBarang = Number(f.harga) || this.getMasterHarga(item.nama, item.harga);
                this.logs.unshift({
                    id: Date.now() + Math.random(),
                    createdAt: new Date().toISOString(),
                    isoDate: selectedDate.toISOString(),
                    gudang: f.gudang,
                    type: 'OUT',
                    nama: item.nama,
                    qty: outQty,
                    qtyAwal: stok,
                    qtyAkhir: stok - outQty,
                    harga: hargaBarang,
                    totalHarga: hargaBarang * outQty,
                    satuan: String(this.getMasterSatuan(f.nama || item.nama, f.satuan || item.satuan || 'Pcs', item.kode || item.barcode || '') || 'Pcs').trim().toUpperCase(),
                    tgl: dateOnlyStr,
                    user: (f.pengambil || f.penerima).toUpperCase(),
                    pengambil: (f.pengambil || '').toUpperCase(),
                    penerima: (f.penerima || '').toUpperCase(),
                    supplier: (f.supplier || '').toUpperCase(),
                    keperluan: f.gudang === 'Sisa Project' ? '' : f.keperluan.toUpperCase(),
                    keterangan: f.gudang === 'Sisa Project' ? f.keterangan.toUpperCase() : (f.keterangan || f.keperluan || '').toUpperCase(),
                    approvalStatus: 'pending'
                });
                this.showSingleOutModal = false;
                this.singleOutForm = { item: null, tanggal: '', gudang: '', jenis: 'Pengeluaran / OUTBOUND', nama: '', qty: 1, harga: 0, satuan: 'Pcs', supplier: '', pengambil: '', penerima: '', keperluan: '', keterangan: '' };
                let savedSingleOut = await this.saveToSupabase();
                if (!savedSingleOut) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    this.supabaseLocalDirty = true;
                    savedSingleOut = await this.saveToSupabase();
                }
                if (!savedSingleOut) return alert('Pengeluaran barang sudah muncul di layar, tetapi gagal disimpan ke Supabase. Data tidak dihapus dari layar; silakan cek koneksi/otorisasi lalu simpan kembali.');
                alert('Pengeluaran barang dicatat, tersimpan ke Supabase, dan menunggu persetujuan Super Admin. Stok belum berubah.');
            },
            printLogSection(elementId) {
                if (!this.canPrint) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat mencetak.');
                // Cetak laporan/tabel dengan header logo Agrofarm.
                document.body.classList.remove('printing-label');
                const target = document.getElementById(elementId);
                if (!target) return window.print();
                const logo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg04Fvw4tFQIaOv_YisutC8tIMsbS2eM10wP2eWOotwA&s=10';
                const header = document.createElement('div');
                header.className = 'temporary-print-logo-header';
                const isPurchaseRequest = elementId === 'monitoring-print-area';
                header.innerHTML = `<div style="width:100%;box-sizing:border-box;font-family:Arial,sans-serif;color:#0f2747;">
                    <div style="display:grid;grid-template-columns:65mm 1fr 65mm;align-items:center;width:100%;min-height:35mm;padding:0 0 3mm 0;box-sizing:border-box;">
                        <div style="display:flex;align-items:center;justify-content:flex-start;width:65mm;">
                            <img src="${logo}" alt="Agrofarm" style="height:35mm;width:auto;max-width:65mm;object-fit:contain;display:block;">
                        </div>
                        <div style="text-align:center;width:100%;">
                            <div style="font-family:Arial,sans-serif;font-size:16pt;line-height:1.2;font-weight:800;letter-spacing:0;color:#0f2747;white-space:nowrap;text-align:center;">AGROFARM NUSA RAYA</div>
                            <div style="font-family:Arial,sans-serif;font-size:10pt;line-height:1.2;font-weight:600;letter-spacing:0;color:#0f2747;text-align:center;margin-top:1mm;">Sistem Inventory</div>
                        </div>
                        <div style="width:65mm;"></div>
                    </div>
                    ${isPurchaseRequest ? '<div style="width:100%;box-sizing:border-box;text-align:center;margin:2mm 0 3mm 0;padding:0;"><div style="display:block;width:100%;font-family:Arial,sans-serif;font-size:13pt;line-height:1.2;font-weight:800;letter-spacing:0;color:#0f2747;white-space:nowrap;text-align:center;margin:0;padding:0;">PURCHASE REQUEST</div></div>' : ''}
                    <div style="width:100%;height:0;border-bottom:2px solid #0f2747;padding:0;margin:0 0 6mm 0;box-sizing:border-box;"></div>
                </div>`;
                target.insertBefore(header, target.firstChild);
                const signature = document.createElement('div');
                signature.className = 'temporary-print-signature';
                signature.style.cssText = 'margin-top:16mm;display:flex;justify-content:space-around;font-size:10pt;';
                signature.innerHTML = `<div style="text-align:center;width:180px;">Dibuat<br><br><br><br>____________________</div><div style="text-align:center;width:180px;">Disetujui<br><br><br><br>____________________</div><div style="text-align:center;width:180px;">Diketahui<br><br><br><br>____________________</div>`;
                target.appendChild(signature);
                this.$nextTick(() => {
                    const img = header.querySelector('img');
                    const doPrint = () => {
                        setTimeout(() => {
                            window.print();
                            header.remove();
                            signature.remove();
                        }, 300);
                    };
                    if (img && !img.complete) {
                        img.onload = doPrint;
                        img.onerror = doPrint;
                    } else {
                        doPrint();
                    }
                });
            },
            handleGlobalBarcodeKeydown(event) {
                if (this.activeTab !== 'sparepart' && this.activeTab !== 'sisa_project' && this.activeTab !== 'barcode_scan') return;
                if (this.showBarcodeScanner) return;
                const target = event.target;
                const tag = String(target?.tagName || '').toLowerCase();
                if (tag === 'textarea' || tag === 'select') return;
                if (tag === 'input' && target.id !== 'sparepart-barcode-input' && target.id !== 'barcode-modal-input') return;
                if (event.key === 'Enter') {
                    const value = String(this.barcodeScanInput || '').trim();
                    if (value) {
                        event.preventDefault();
                        this.processScannedBarcode(value);
                    }
                    return;
                }
                if (event.key && event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
                    this.barcodeScanInput += event.key;
                    clearTimeout(this._barcodeKeyTimer);
                    this._barcodeKeyTimer = setTimeout(() => {
                        const input = document.getElementById('sparepart-barcode-input');
                        if (input && document.activeElement !== input) input.focus();
                    }, 120);
                }
            },
            focusBarcodeTabInput() {
                this.$nextTick(() => {
                    const input = document.getElementById('sparepart-barcode-tab-input');
                    if (input) input.focus();
                });
            },
            openBarcodeScanner() {
                this.showBarcodeScanner = true;
                this.barcodeScanInput = '';
                this.barcodeScanMessage = '';
                this.barcodeScanSuccess = false;
                this.$nextTick(() => {
                    this.refreshIcons();
                    const input = document.getElementById('barcode-modal-input');
                    if (input) input.focus();
                    if (typeof Html5Qrcode !== 'undefined') {
                        try {
                            this.barcodeScannerInstance = new Html5Qrcode('barcode-reader');
                            this.barcodeScannerInstance.start(
                                { facingMode: 'environment' },
                                { fps: 10, qrbox: { width: 280, height: 120 }, formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128, Html5QrcodeSupportedFormats.CODE_39, Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8, Html5QrcodeSupportedFormats.UPC_A, Html5QrcodeSupportedFormats.UPC_E] },
                                (decodedText) => this.processScannedBarcode(decodedText),
                                () => {}
                            ).catch(err => {
                                this.barcodeScanMessage = 'Kamera tidak tersedia. Untuk laptop, gunakan scanner USB/Bluetooth pada kolom scan; kamera memerlukan izin browser dan HTTPS/localhost.';
                                this.barcodeScanSuccess = false;
                            });
                        } catch (err) {
                            console.error('Barcode scanner:', err);
                        }
                    } else {
                        this.barcodeScanMessage = 'Fitur kamera belum tersedia. Gunakan scanner USB/Bluetooth atau ketik kode barang.';
                    }
                });
            },
            async closeBarcodeScanner() {
                if (this.barcodeScannerInstance) {
                    try {
                        const state = this.barcodeScannerInstance.getState();
                        if (state === 2) await this.barcodeScannerInstance.stop();
                        await this.barcodeScannerInstance.clear();
                    } catch (err) {
                        console.warn('Menutup scanner:', err);
                    }
                    this.barcodeScannerInstance = null;
                }
                this.showBarcodeScanner = false;
                this.barcodeScanInput = '';
                this.barcodeScanMessage = '';
            },
            startBarcodeScan(gudang = 'Sparepart') {
                if (!this.canInputTransaction) return alert('Akun Viewer hanya dapat melihat data.');
                this.barcodeScanWarehouse = gudang === 'Sisa Project' ? 'Sisa Project' : 'Sparepart';
                this.barcodeScanInput = '';
                this.barcodeScanMessage = '';
                this.barcodeScanSuccess = false;
                this.showBarcodeScanner = true;
                this.$nextTick(() => {
                    this.refreshIcons();
                    const input = document.getElementById('barcode-modal-input');
                    if (input) input.focus();
                    if (typeof Html5Qrcode !== 'undefined') {
                        this.startBarcodeCamera();
                    }
                });
            },
            startBarcodeCamera() {
                if (this.barcodeScannerInstance) return;
                try {
                    this.barcodeScannerInstance = new Html5Qrcode('barcode-reader');
                    this.barcodeScannerInstance.start(
                        { facingMode: 'environment' },
                        { fps: 10, qrbox: { width: 280, height: 120 } },
                        (decodedText) => this.processScannedBarcode(decodedText),
                        () => {}
                    ).catch(err => console.warn('Kamera barcode tidak tersedia:', err));
                } catch (err) {
                    console.warn('Scanner kamera gagal dimulai:', err);
                }
            },
            processScannedBarcode(rawCode) {
                const cleaned = String(rawCode || '').replace(/[\r\n\t]+/g, '').trim();
                const code = cleaned.toLowerCase();
                if (!code) return;
                const source = this.barcodeScanWarehouse === 'Sisa Project' ? this.sisaProjects : this.spareparts;
                const item = source.find(s => String(s.kode || s.barcode || '').trim().toLowerCase() === code || String(s.barcode || '').trim().toLowerCase() === code);
                if (!item) {
                    this.barcodeScanMessage = `Barang dengan kode "${rawCode}" tidak ditemukan di ${this.barcodeScanWarehouse}.`;
                    this.barcodeScanSuccess = false;
                    return;
                }
                if ((Number(item.qty) || 0) <= 0) {
                    this.barcodeScanMessage = `Stok ${item.nama} sedang kosong.`;
                    this.barcodeScanSuccess = false;
                    return;
                }
                const form = this.barcodeScanWarehouse === 'Sisa Project' ? this.formSisaProjectMultiOut : this.formSparepartMultiOut;
                const exists = form.selectedItems.find(x => String(x.barcode || '').toLowerCase() === String(item.barcode || item.kode || '').toLowerCase());
                if (!exists) {
                    const newItem = this.barcodeScanWarehouse === 'Sisa Project' ? this.createSisaProjectMultiOutItem() : this.createSparepartMultiOutItem();
                    newItem.barcode = item.barcode || item.kode || '';
                    newItem.nama = item.nama;
                    newItem.qty = Number(item.qty) || 0;
                    newItem.satuan = item.satuan || 'Pcs';
                    newItem.harga = this.getMasterHarga(item.nama, item.harga);
                    newItem.outQty = 1;
                    form.selectedItems.push(newItem);
                }
                this.barcodeScanMessage = `Barcode terbaca: ${item.nama} — Gudang: ${this.barcodeScanWarehouse}`;
                this.barcodeScanSuccess = true;
                this.barcodeScanInput = '';
                this.closeBarcodeScanner().then(() => {
                    this.$nextTick(() => {
                        if (this.barcodeScanWarehouse === 'Sisa Project') {
                            this.showSisaProjectMultiOutModal = true;
                        } else {
                            this.showSparepartMultiOutModal = true;
                        }
                    });
                });
            },
            printBarcode(item) {
                if (!this.canPrint) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat mencetak.');
                if (!item) return;
                const kode = String(item.kode || item.barcode || '').trim();
                if (!kode) return alert('Kode Barang belum tersedia untuk item ini.');
                const nama = String(item.nama || '').trim();
                const labelArea = document.getElementById('label-print-area');
                if (!labelArea) return alert('Area cetak barcode tidak ditemukan.');

                labelArea.innerHTML = `
                    <div class="barcode-print-card">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg04Fvw4tFQIaOv_YisutC8tIMsbS2eM10wP2eWOotwA&s=10" alt="Agrofarm" style="height:20mm; width:auto; object-fit:contain; margin:0 auto 2mm;">
                        <div class="barcode-print-title">AGROFARM NUSA RAYA</div>
                        <div class="barcode-print-name">${this.escapeHtml(nama || '-')} </div>
                        <svg id="sparepart-barcode-svg" class="barcode-print-svg"></svg>
                        <div class="barcode-print-code">${kode}</div>
                    </div>`;

                document.body.classList.add('printing-barcode');
                this.$nextTick(() => {
                    try {
                        JsBarcode('#sparepart-barcode-svg', kode, {
                            format: 'CODE128',
                            lineColor: '#000',
                            width: 2,
                            height: 70,
                            displayValue: false,
                            margin: 0
                        });
                        setTimeout(() => {
                            window.print();
                            document.body.classList.remove('printing-barcode');
                            labelArea.innerHTML = '';
                        }, 100);
                    } catch (err) {
                        console.error('Gagal membuat barcode:', err);
                        document.body.classList.remove('printing-barcode');
                        labelArea.innerHTML = '';
                        alert('Barcode gagal dibuat. Pastikan Kode Barang valid.');
                    }
                });
            },
            printLabel(item) {
                if (!this.canPrint) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat mencetak.');
                if (!item) return;
                this.kartuStockOptions = {
                    item: item,
                    paperSize: 'A4',
                    orientation: 'portrait',
                    filterMode: 'all',
                    dateStart: '',
                    dateEnd: '',
                    bulan: new Date().toISOString().slice(0, 7)
                };
                this.showKartuStockOptions = true;
                this.$nextTick(() => this.refreshIcons());
            },
            confirmPrintKartuStock() {
                const opts = this.kartuStockOptions;
                if (!opts.item) { this.showKartuStockOptions = false; return; }
                if (opts.filterMode === 'bulan' && !opts.bulan) return alert('Silakan pilih bulan terlebih dahulu.');
                if (opts.filterMode === 'rentang' && (!opts.dateStart || !opts.dateEnd)) return alert('Silakan pilih tanggal mulai dan akhir.');
                const item = opts.item;
                this.showKartuStockOptions = false;
                this.$nextTick(() => this.doPrintKartuStock(item, { ...opts }));
            },
            doPrintKartuStock(item, options) {
                if (!item) return;

                const namaBarang = String(item.nama || '').trim();
                const namaKey = namaBarang.toLowerCase();
                const gudang = this.activeTab === 'sisa_project' ? 'Sisa Project' : 'Sparepart';

                const masterItem = this.masterCatalog.find(master =>
                    String(master.nama || '').trim().toLowerCase() === namaKey ||
                    (item.kode && master.kode && String(master.kode).trim().toLowerCase() === String(item.kode).trim().toLowerCase())
                );
                const satuan = (masterItem && masterItem.satuan) || item.satuan || 'Pcs';
                // Gudang Sisa Project TIDAK mengambil stock awal dari Data Master.
                // Stock awal Sisa Project selalu berasal dari input/mutasi Gudang Sisa Project.
                const stockAwalMaster = gudang === 'Sisa Project'
                    ? 0
                    : (masterItem && masterItem.stockAwal !== undefined && masterItem.stockAwal !== null
                        ? Number(masterItem.stockAwal) || 0
                        : (masterItem && masterItem.currentStock !== undefined ? Number(masterItem.currentStock) || 0 : (Number(item.stockAwal ?? item.currentStock ?? item.qty) || 0)));

                const lokasi = item.lokasi || (masterItem && masterItem.lokasi) || '-';
                const kode = item.kode || (masterItem && masterItem.kode) || '-';
                const minStock = item.minStock || (masterItem && masterItem.minStock) || '-';

                // Gunakan mesin timeline yang sama dengan tabel log, approval, dashboard, dan Excel.
                // Jadi Kartu Stock tidak lagi membuat rumus saldo sendiri.
                const timelineMap = this.getWarehouseTransactionTimeline(gudang);
                const sameItem = log => {
                    const logKey = String(log?.barcode || log?.kode || log?.sku || log?.nama || '').trim().toLowerCase();
                    const itemKey = String(item?.barcode || item?.kode || item?.sku || item?.nama || '').trim().toLowerCase();
                    return logKey === itemKey || String(log?.nama || '').trim().toLowerCase() === namaKey ||
                        (item?.kode && log?.kode && String(item.kode).trim().toLowerCase() === String(log.kode).trim().toLowerCase()) ||
                        (item?.barcode && log?.barcode && String(item.barcode).trim().toLowerCase() === String(log.barcode).trim().toLowerCase());
                };
                const allLogs = Array.from(timelineMap.values())
                    .flatMap(group => group.logs || [])
                    .filter(log => sameItem(log) && !this.isPendingLog(log) && !this.isCancelledLog(log) && String(log.adjustmentType || '').toUpperCase() !== 'OPNAME')
                    .sort((a,b) => {
                        const da = new Date(a?.isoDate || a?.tgl || 0).getTime() || 0;
                        const db = new Date(b?.isoDate || b?.tgl || 0).getTime() || 0;
                        if (da !== db) return da - db;
                        const ca = new Date(a?.createdAt || a?.inputAt || a?.id || 0).getTime() || Number(a?.id) || 0;
                        const cb = new Date(b?.createdAt || b?.inputAt || b?.id || 0).getTime() || Number(b?.id) || 0;
                        return ca - cb;
                    });

                // Tentukan rentang tanggal filter
                let filterStart = null;
                let filterEnd = null;
                let periodeLabel = 'Semua Periode';
                if (options.filterMode === 'bulan' && options.bulan) {
                    const [yy, mm] = options.bulan.split('-').map(Number);
                    filterStart = new Date(yy, mm - 1, 1, 0, 0, 0, 0);
                    filterEnd = new Date(yy, mm, 0, 23, 59, 59, 999);
                    periodeLabel = new Date(yy, mm - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                } else if (options.filterMode === 'rentang' && options.dateStart && options.dateEnd) {
                    filterStart = new Date(options.dateStart + 'T00:00:00');
                    filterEnd = new Date(options.dateEnd + 'T23:59:59.999');
                    periodeLabel = `${options.dateStart} s/d ${options.dateEnd}`;
                }

                const matchingGroup = Array.from(timelineMap.values()).find(group =>
                    (group.logs || []).some(log => sameItem(log))
                );
                const stokSaatIniValue = Math.max(0, Math.round(Number(item?.qty ?? masterItem?.currentStock ?? 0) || 0));
                const openingBalance = matchingGroup
                    ? Math.max(0, Math.round(Number(matchingGroup.opening) || 0))
                    : (gudang === 'Sisa Project' ? 0 : Math.max(0, Math.round(Number(stockAwalMaster) || 0)));

                let saldoAwalPeriode = openingBalance;
                let runningSaldo = openingBalance;
                const filteredLogs = [];
                allLogs.forEach((log) => {
                    const qty = Number(log.qty) || 0;
                    const logDate = new Date(log.isoDate || log.id || 0);
                    const beforePeriod = filterStart && logDate < filterStart;
                    // Saldo dihitung dari mutasi IN/OUT (konsisten & terintegrasi).
                    runningSaldo += String(log.type).toUpperCase() === 'IN' ? qty : -qty;
                    if (beforePeriod) {
                        saldoAwalPeriode = runningSaldo;
                    } else if (!filterEnd || logDate <= filterEnd) {
                        filteredLogs.push({
                            log: log,
                            saldoSetelah: runningSaldo,
                            qty: qty
                        });
                    }
                });

                const enrichedLogs = filteredLogs.map((f, idx) => {
                    const log = f.log;
                    return {
                        no: idx + 1,
                        tgl: log.tgl || '-',
                        keperluan: log.keperluan || log.supplier || '-',
                        qtyIn: log.type === 'IN' ? f.qty : '',
                        qtyOut: log.type === 'OUT' ? f.qty : '',
                         harga: this.getMasterHarga(log.nama, log.harga),
                        satuan: this.getMasterSatuan(log.nama, log.satuan || satuan, log.kode || log.barcode || '') || satuan,
                        saldo: f.saldoSetelah,
                        src: log.type === 'IN' ? (log.supplier || log.user || '-') : (log.user || '-'),
                        isOpname: (log.adjustmentType === 'OPNAME') || String(log.keperluan || '').includes('PENYESUAIAN STOCK OPNAME')
                    };
                });
                // Saldo akhir untuk mode "Semua Periode" DIJAMIN = stok terkini (terintegrasi
                // dengan Gudang/Master/Opname). Untuk mode periode, pakai saldo baris terakhir.
                const finalSaldo = (options.filterMode === 'all')
                    ? stokSaatIniValue
                    : (enrichedLogs.length > 0 ? enrichedLogs[enrichedLogs.length - 1].saldo : saldoAwalPeriode);
                const printedDate = this.getFormattedDateOnly();

                // Bagi ke halaman - 25 baris per halaman
                const ROWS_PER_PAGE = 25;
                const chunks = [];
                if (enrichedLogs.length === 0) {
                    chunks.push([]);
                } else {
                    for (let i = 0; i < enrichedLogs.length; i += ROWS_PER_PAGE) {
                        chunks.push(enrichedLogs.slice(i, i + ROWS_PER_PAGE));
                    }
                }
                const totalPages = chunks.length;

                // Set @page CSS dinamis berdasarkan opsi
                const paperSizeMap = {
                    'A4': { size: 'A4', margin: '20mm' },
                    'F4': { size: 'A4', margin: '20mm' },
                    'A5': { size: 'A4', margin: '20mm' }
                };
                const spec = paperSizeMap[options.paperSize] || paperSizeMap.A4;
                const sizeDecl = 'A4 landscape';
                let dynamicStyle = document.getElementById('__kartu_stock_dynamic_style');
                if (!dynamicStyle) {
                    dynamicStyle = document.createElement('style');
                    dynamicStyle.id = '__kartu_stock_dynamic_style';
                    document.head.appendChild(dynamicStyle);
                }
                dynamicStyle.textContent = `@media print { @page { size: ${sizeDecl}; margin: ${spec.margin}; } }`;

                const AGROFARM_LOGO = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg04Fvw4tFQIaOv_YisutC8tIMsbS2eM10wP2eWOotwA&s=10';

                const buildRowHtml = (r) => `
                    <tr${r.isOpname ? ' style="background:#fef3c7;"' : ''}>
                        <td class="center">${r.no}</td>
                        <td class="center">${r.tgl}</td>
                        <td>${r.keperluan}${r.isOpname ? ' <b>[OPNAME]</b>' : ''}</td>
                        <td class="num">${r.qtyIn === '' ? '' : Number(r.qtyIn).toLocaleString('id-ID')}</td>
                        <td class="num">${r.qtyOut === '' ? '' : Number(r.qtyOut).toLocaleString('id-ID')}</td>
                        <td class="num saldo">${r.saldo.toLocaleString('id-ID')}</td>
                        <td>${r.src}</td>
                    </tr>`;

                const stokAwalLabel = (options.filterMode === 'all')
                    ? 'STOK AWAL (Master Data)'
                    : `SALDO AWAL PERIODE (${periodeLabel})`;

                const buildPage = (chunkRows, pageIdx) => {
                    const isFirst = pageIdx === 0;
                    const isLast = pageIdx === totalPages - 1;
                    const openingRow = isFirst ? `
                        <tr style="background:#f8fafc;">
                            <td class="center">-</td>
                            <td class="center">${filterStart ? filterStart.toLocaleDateString('id-ID') : printedDate}</td>
                            <td style="font-style:italic; font-weight:700;">${stokAwalLabel}</td>
                            <td class="num">-</td>
                            <td class="num">-</td>
                            <td class="num saldo">${saldoAwalPeriode.toLocaleString('id-ID')}</td>
                            <td>-</td>
                        </tr>` : `
                        <tr style="background:#f1f5f9;">
                            <td class="center">-</td>
                            <td class="center">-</td>
                            <td style="font-style:italic; font-weight:700;">SALDO AWAL HALAMAN INI</td>
                            <td class="num">-</td>
                            <td class="num">-</td>
                            <td class="num saldo">${(chunks[pageIdx - 1][chunks[pageIdx - 1].length - 1].saldo).toLocaleString('id-ID')}</td>
                            <td>-</td>
                        </tr>`;
                    const emptyRow = (chunkRows.length === 0 && isFirst) ? `
                        <tr>
                            <td colspan="7" class="empty-row" style="font-style:italic; color:#64748b;">Belum ada transaksi ${options.filterMode !== 'all' ? 'pada periode ' + periodeLabel : 'tercatat untuk barang ini'}.</td>
                        </tr>` : '';
                    const saldoAkhirLabel = (options.filterMode === 'all') ? 'SALDO AKHIR / STOK SAAT INI' : `SALDO AKHIR PERIODE`;
                    const saldoAkhirRow = isLast ? `
                        <tr style="background:#ecfdf5; font-weight:800;">
                            <td class="center" colspan="5" style="text-align:right; font-weight:800;">${saldoAkhirLabel}</td>
                            <td class="num saldo" style="font-weight:800;">${finalSaldo.toLocaleString('id-ID')}</td>
                            <td>-</td>
                        </tr>` : '';
                    const signatureBlock = isLast ? `
                        <div class="stock-card-footer">
                            <span>Dicetak: ${this.escapeHtml(printedDate)}</span>
                            <span>Transaksi Ditampilkan: ${enrichedLogs.length}${options.filterMode !== 'all' ? ' (' + periodeLabel + ')' : ''}</span>
                            <span>Stok Saat Ini: <b>${stokSaatIniValue.toLocaleString('id-ID')} ${satuan}</b></span>
                        </div>
                        <div style="margin-top:14mm; display:flex; justify-content:space-around; font-size:9pt;">
                            <div style="text-align:center; width:180px;">Dibuat<br><br><br><br>____________________</div>
                            <div style="text-align:center; width:180px;">Disetujui<br><br><br><br>____________________</div>
                            <div style="text-align:center; width:180px;">Diketahui<br><br><br><br>____________________</div>
                        </div>` : `
                        <div style="margin-top:6mm; text-align:right; font-size:8pt; font-style:italic; color:#475569;">Bersambung ke halaman ${pageIdx + 2}...</div>`;
                    const pageStyle = isLast ? '' : 'page-break-after: always;';
                    return `
                    <div class="stock-card-print" style="${pageStyle}">
                        <div class="stock-card-heading" style="display:flex; align-items:center; gap:14px; border-bottom:2px solid #000; padding-bottom:6mm;">
                            <img src="${AGROFARM_LOGO}" alt="Agrofarm" style="height:35mm; width:auto; max-width:70mm; object-fit:contain;">
                            <div style="flex:1; text-align:center;">
                                <div class="stock-card-title">KARTU STOCK BARANG</div>
                                <div class="stock-card-subtitle">AGROFARM NUSA RAYA &mdash; SISTEM INVENTORY SPARE PART</div>
                                <div style="font-size:9pt; font-weight:700; margin-top:2px;">Periode: ${periodeLabel} &middot; Halaman ${pageIdx + 1} dari ${totalPages}</div>
                            </div>
                            <div style="text-align:right; font-size:9pt;">
                                <div><b>Tanggal Cetak</b></div>
                                <div>${this.escapeHtml(printedDate)}</div>
                            </div>
                        </div>
                        <table class="stock-card-info">
                            <tr>
                                <td class="info-label">Nama Barang</td>
                                <td class="info-value" colspan="3" style="font-weight:800; text-transform:uppercase;">${namaBarang || '-'}</td>
                            </tr>
                            <tr>
                                <td class="info-label">Kode / SKU</td>
                                <td class="info-value">${kode}</td>
                                <td class="info-label">Gudang</td>
                                <td class="info-value">${gudang}</td>
                            </tr>
                            <tr>
                                <td class="info-label">Satuan</td>
                                <td class="info-value">${satuan}</td>
                                <td class="info-label">Lokasi Rak</td>
                                <td class="info-value">${lokasi}</td>
                            </tr>
                            <tr>
                                <td class="info-label">Min. Stok</td>
                                <td class="info-value">${minStock}</td>
                                <td class="info-label">Stok Saat Ini</td>
                                <td class="info-value" style="font-weight:800;">${stokSaatIniValue.toLocaleString('id-ID')} ${satuan}</td>
                            </tr>
                        </table>
                        <table class="stock-card-table">
                            <thead>
                                <tr>
                                    <th class="col-no">No</th>
                                    <th class="col-date">Tanggal</th>
                                    <th class="col-desc">Keterangan / Kepentingan</th>
                                    <th class="col-opening">Masuk</th>
                                    <th class="col-opening">Keluar</th>
                                    <th class="col-balance">Stock Saat Ini</th>
                                    <th class="col-user">Petugas / Supplier</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${openingRow}
                                ${chunkRows.map(buildRowHtml).join('')}
                                ${emptyRow}
                                ${saldoAkhirRow}
                            </tbody>
                        </table>
                        ${signatureBlock}
                    </div>`;
                };

                const labelArea = document.getElementById('label-print-area');
                labelArea.innerHTML = chunks.map((chunkRows, idx) => buildPage(chunkRows, idx)).join('');

                document.body.classList.add('printing-label');
                this.$nextTick(() => {
                    window.print();
                    document.body.classList.remove('printing-label');
                    labelArea.innerHTML = '';
                    if (dynamicStyle) dynamicStyle.textContent = '';
                });
            },
            async exportSparepartExcelByDate() {
                if (!this.canEdit) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat export Excel.');
                if (!this.spLogDateStart && !this.spLogDateEnd) return alert('Silakan pilih tanggal mulai dan/atau tanggal akhir terlebih dahulu!');
                if (this.spLogDateStart && this.spLogDateEnd && this.spLogDateStart > this.spLogDateEnd) return alert('Tanggal mulai tidak boleh lebih besar dari tanggal akhir!');
                if (typeof ExcelJS === 'undefined') return alert('Library Excel belum siap. Silakan refresh halaman.');
                const start=this.spLogDateStart, end=this.spLogDateEnd || this.spLogDateStart, barangFilter=this.spLogBarang||'', keperluanFilter=this.spLogKeperluan||'';
                const inRange=l=>{const d=new Date(l.isoDate||l.id);if(start&&d<new Date(start))return false;if(end){const e=new Date(end);e.setHours(23,59,59,999);if(d>e)return false;}if(barangFilter&&!String(l.nama||'').toLowerCase().includes(barangFilter.toLowerCase()))return false;if(keperluanFilter){const h=String(l.supplier||l.keperluan||l.user||'').toLowerCase();if(!h.includes(keperluanFilter.toLowerCase()))return false;}return true;};
                this.getWarehouseTransactionTimeline('Sparepart');
                const allSparepartLogs=this.logs.filter(l=>String(l.gudang||'').trim().toLowerCase()==='sparepart'&&!this.isCancelledLog(l));
                const inputOrder=(a,b)=>{const da=new Date(a?.isoDate||a?.tgl||0).getTime()||0;const db=new Date(b?.isoDate||b?.tgl||0).getTime()||0;if(da!==db)return da-db;const ca=new Date(a?.createdAt||a?.inputAt||a?.id||0).getTime()||0;const cb=new Date(b?.createdAt||b?.inputAt||b?.id||0).getTime()||0;if(ca!==cb)return ca-cb;return String(a?.id||'').localeCompare(String(b?.id||''));};
                const logs=allSparepartLogs.filter(inRange); const ins=logs.filter(l=>String(l.type||'').toUpperCase()==='IN').sort(inputOrder); const outs=logs.filter(l=>String(l.type||'').toUpperCase()==='OUT').sort(inputOrder);
                const wb=new ExcelJS.Workbook(); wb.creator='Agrofarm Nusa Raya'; wb.created=new Date(); const ws=wb.addWorksheet('Laporan Sparepart',{pageSetup:{paperSize:9,orientation:'portrait',fitToPage:true,fitToWidth:1,fitToHeight:0,margins:{left:.25,right:.25,top:.35,bottom:.35,header:.1,footer:.1}}}); ws.views=[{showGridLines:false}]; ws.columns=[{width:6},{width:14},{width:34},{width:13},{width:13},{width:13},{width:13},{width:32}];
                const logoId=wb.addImage({base64:AGROFARM_EXCEL_LOGO_BASE64,extension:'png'}); ws.addImage(logoId,{tl:{col:.15,row:.2},ext:{width:145,height:36}}); ws.mergeCells('A1:G1');ws.mergeCells('A2:G2');ws.mergeCells('H1:H3');
                ws.getCell('A1').value='LAPORAN PERGERAKAN STOK';ws.getCell('A2').value='AGROFARM NUSA RAYA — Sistem Inventory Spare Part';ws.getCell('H1').value=`Tanggal Cetak\n${start||'(awal)'} s/d ${end||'(akhir)'}\nDicetak: ${this.getFormattedDateOnly()}`;ws.getCell('A1').font={name:'Arial',size:16,bold:true};ws.getCell('A2').font={name:'Arial',size:10,bold:true};ws.getCell('H1').font={name:'Arial',size:9,bold:true};ws.getCell('A1').alignment={horizontal:'center',vertical:'middle'};ws.getCell('A2').alignment={horizontal:'center',vertical:'middle'};ws.getCell('H1').alignment={horizontal:'right',vertical:'middle',wrapText:true};
                const border={top:{style:'thin'},left:{style:'thin'},bottom:{style:'thin'},right:{style:'thin'}}; const style=c=>{c.font={name:'Arial',size:9};c.border=border;c.alignment={vertical:'middle',wrapText:true};}; const info=(l,v)=>{const r=ws.addRow([l,v]);ws.mergeCells(`B${r.number}:I${r.number}`);style(r.getCell(1));style(r.getCell(2));r.getCell(1).font={name:'Arial',size:9,bold:true};}; info('Cakupan','Gudang Sparepart'); info('Periode',`${start||'(awal)'} s/d ${end||'(akhir)'}`); if(barangFilter)info('Filter Barang',barangFilter); if(keperluanFilter)info('Filter Kepentingan/Supplier',keperluanFilter); ws.addRow([]);
                const addTable=(title,arr,type)=>{let t=ws.addRow([`${title}`,`${arr.length} TRANSAKSI`]);ws.mergeCells(`A${t.number}:G${t.number}`);t.getCell(1).font={name:'Arial',size:11,bold:true};let h=ws.addRow(['No','Tanggal','Nama Barang','Satuan',type==='IN'?'Qty Masuk':'Qty Keluar','Qty Awal','Qty Akhir',type==='IN'?'Supplier / Kepentingan':'Pengambil (Kepentingan)']);h.eachCell(c=>{style(c);c.font={name:'Arial',size:9,bold:true};c.alignment={horizontal:'center',vertical:'middle',wrapText:true};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFE2E8F0'}};});if(!arr.length){const e=ws.addRow(['','','Tidak ada data '+(type==='IN'?'barang masuk':'barang keluar')+' pada periode ini.']);ws.mergeCells(`C${e.number}:H${e.number}`);e.getCell(3).alignment={horizontal:'center'};}arr.forEach((l,i)=>{const q=this.getLogDisplayQty(l),hrg=Number(l.harga!=null?l.harga:this.getMasterHarga(l.nama))||0;const desc=type==='IN'?(l.supplier||l.keperluan||'-'):`${l.user||'-'} (${l.keperluan||'-'})`;const satuan=this.getMasterSatuan(l.nama, l.satuan || '-', l.kode || l.barcode || '') || '-';const r=ws.addRow([i+1,this.excelDateValue(l.tgl)||l.tgl||'-',l.nama||'-',satuan,q,Math.max(0,Math.round(Number(l.qtyAwal)||0)),Math.max(0,Math.round(Number(l.qtyAkhir)||0)),desc]);r.eachCell(style);if(r.getCell(2).value instanceof Date) r.getCell(2).numFmt='dd/mm/yyyy';r.getCell(4).alignment={horizontal:'center',vertical:'middle',wrapText:true};});ws.addRow([]);};
                addTable('GUDANG SPAREPART — BARANG MASUK (INBOUND)',ins,'IN'); addTable('GUDANG SPAREPART — BARANG KELUAR (OUTBOUND)',outs,'OUT'); const last=ws.lastRow.number;ws.freezePanes={xSplit:0,ySplit:5};ws.printArea=`A1:H${last}`;
                const buffer=await wb.xlsx.writeBuffer();const blob=new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`Laporan_Sparepart_${start||'awal'}_sd_${end||'akhir'}.xlsx`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
            },
            async importMonitoringExcel(event) {
                if (!this.canInputTransaction) return alert('Akun Viewer tidak dapat import Purchase Request.');
                const file = event?.target?.files?.[0];
                if (!file) return;
                if (typeof XLSX === 'undefined') return alert('Library Excel belum termuat. Silakan refresh halaman.');
                try {
                    const buffer = await file.arrayBuffer();
                    const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: true });
                    if (!rows.length) return alert('File Excel tidak memiliki data Purchase Request.');
                    const norm = v => String(v ?? '').trim().toLowerCase().replace(/[\s_\/.-]+/g, '');
                    const findValue = (row, aliases) => {
                        const keys = Object.keys(row), wanted = aliases.map(norm);
                        const key = keys.find(k => wanted.includes(norm(k)));
                        return key === undefined ? '' : row[key];
                    };
                    const parseQty = v => this.strictQty(v, 0);
                    const parseDate = v => this.strictDateOnly(v, this.getISODateOnly());
                    const normalizePR = v => String(v || '').trim().toLowerCase().replace(/\s+/g,' ');
                    const normalizeItem = v => String(v || '').trim().toLowerCase().replace(/\s+/g,' ');
                    let added = 0, skipped = 0;
                    const priorityValues = this.monitoringItems.map(x => Number(this.normalizePriorityValue(x.prioritas))).filter(x => Number.isFinite(x) && x >= 1);
                    let nextPriority = priorityValues.length ? Math.max(...priorityValues) + 1 : 1;
                    for (const row of rows) {
                        const nomorPR = String(findValue(row, ['Nomor PR','Nomor Purchase Request','No PR','PR Number','PR']) || '').trim();
                        const nama = String(findValue(row, ['Nama Barang','Nama Sparepart','Barang','Item','Deskripsi']) || '').trim();
                        if (!nomorPR || !nama) { skipped++; continue; }
                        const tgl = parseDate(findValue(row, ['Tanggal PR','Tgl PR','Tanggal Order','Tgl Order','Tanggal Transaksi','Tanggal']));
                        const masterRef = (this.masterCatalog || []).find(m =>
                            String(m.nama || '').trim().toLowerCase() === String(nama || '').trim().toLowerCase()
                        );
                        const satuanRaw = findValue(row, ['Satuan','Unit','UOM']);
                        const satuan = String(masterRef?.satuan || (satuanRaw instanceof Date ? '' : satuanRaw) || 'Pcs').trim() || 'Pcs';
                        const qtyTotal = parseQty(findValue(row, ['Total Order','Qty Order','Qty Total','Jumlah Order','Qty']));
                        const qtyReceived = Math.min(qtyTotal, parseQty(findValue(row, ['Diterima','Qty Diterima','Qty Received'])));
                        const qtyRemainingRaw = findValue(row, ['Sisa Order','Sisa','Qty Sisa','Qty Remaining']);
                        const qtyRemaining = qtyRemainingRaw === '' ? Math.max(0, qtyTotal - qtyReceived) : parseQty(qtyRemainingRaw);
                        const keterangan = String(findValue(row, ['Keterangan','Keterangan Project','Project','Keperluan']) || '-').trim() || '-';
                        const pemesan = String(findValue(row, ['Nama Pemesan','Pemesan','Penerima']) || '-').trim() || '-';
                        const nomorPO = String(findValue(row, ['Nomor PO','Nomor Purchase Order','PO Number','PO']) || '').trim().toUpperCase();
                        const supplier = String(findValue(row, ['Supplier','Nama Supplier','Vendor']) || '').trim().toUpperCase();
                        let prioritas = this.normalizePriorityValue(findValue(row, ['Skala Prioritas','Prioritas','Priority']));
                        const prKey = normalizePR(nomorPR), itemKey = normalizeItem(nama);
                        if (this.monitoringItems.some(x => normalizePR(x.nomorPR) === prKey && normalizeItem(x.nama) === itemKey)) { skipped++; continue; }
                        if (!prioritas) {
                            const samePR = this.monitoringItems.find(x => normalizePR(x.nomorPR) === prKey);
                            prioritas = this.normalizePriorityValue(samePR?.prioritas) || nextPriority;
                        }
                        if (!this.monitoringItems.some(x => normalizePR(x.nomorPR) === prKey)) nextPriority = Math.max(nextPriority, Number(prioritas) + 1);
                        const dateObj = this.getDateFromInput(tgl);
                        const harga = this.getMasterHarga(nama, 0);
                        this.monitoringItems.unshift({
                            id: Date.now() + Math.random(), isoDate: dateObj.toISOString(), tgl: this.getFormattedDateOnly(dateObj),
                            nomorPR, nomorPO, supplier, nama: nama.toUpperCase(), keperluan: keterangan.toUpperCase(), prioritas,
                            penerima: pemesan.toUpperCase(), pengambil: '', qtyTotal, qtyReceived, qtyRemaining,
                            harga, totalHarga: harga * qtyTotal, satuan: satuan.toUpperCase(),
                            status: qtyRemaining <= 0 && qtyTotal > 0 ? 'Diterima Semua' : qtyReceived > 0 ? 'Diterima Sebagian' : 'Pending'
                        });
                        added++;
                    }
                    if (!added) return alert(`Import selesai, tetapi tidak ada data baru yang dimasukkan.\nBaris dilewati: ${skipped}`);
                    await this.saveToSupabase();
                    this.purchaseRequestPage = 1;
                    alert(`Import Purchase Request selesai.\nBerhasil masuk: ${added} baris\nDilewati/duplikat: ${skipped} baris`);
                } catch (err) {
                    console.error('Import Purchase Request gagal:', err);
                    alert('Gagal membaca file Excel. Gunakan file hasil Export Purchase Request dari sistem atau Excel dengan kolom Nomor PR, Tanggal PR, Nama Barang, Satuan, Total Order, Diterima, Sisa Order, Keterangan, dan Skala Prioritas.');
                } finally {
                    if (event?.target) event.target.value = '';
                }
            },
            async exportPurchaseRequestExcel() {
                if (!this.canEdit) return alert('Akun Viewer tidak dapat export Purchase Request.');
                if (typeof ExcelJS === 'undefined') return alert('Library ExcelJS belum termuat. Silakan reload halaman.');
                const rows = this.filteredMonitoringItems || [];
                if (!rows.length) return alert('Tidak ada data Purchase Request yang sesuai filter untuk diexport.');
                const wb = new ExcelJS.Workbook();
                wb.creator = 'Agrofarm Nusa Raya'; wb.created = new Date();
                const ws = wb.addWorksheet('Purchase Request');
                ws.views = [{ state:'frozen', ySplit:6, showGridLines:false }];
                ws.pageSetup = { paperSize:9, orientation:'landscape', fitToPage:true, fitToWidth:1, fitToHeight:0, margins:{left:.25,right:.25,top:.35,bottom:.35,header:.1,footer:.1} };
                const logoId = wb.addImage({ base64: AGROFARM_EXCEL_LOGO_BASE64, extension:'png' });
                ws.addImage(logoId,{tl:{col:.2,row:.2},ext:{width:145,height:36}});
                ws.columns = [{width:7},{width:15},{width:20},{width:20},{width:24},{width:38},{width:13},{width:16},{width:16},{width:16},{width:34},{width:18},{width:20}];
                ws.mergeCells('A1:M1'); ws.getCell('A1').value='PT AGROFARM NUSA RAYA'; ws.getCell('A1').font={bold:true,size:14}; ws.getCell('A1').alignment={horizontal:'center',vertical:'middle'};
                ws.mergeCells('A2:M2'); ws.getCell('A2').value='Jl. Raya Ponorogo-Madiun KM 4 (JL Industri) Kertosari Babadan Ponorogo'; ws.getCell('A2').font={size:9}; ws.getCell('A2').alignment={horizontal:'center'};
                ws.mergeCells('A3:M3'); ws.getCell('A3').value='PURCHASE REQUEST'; ws.getCell('A3').font={bold:true,size:16}; ws.getCell('A3').alignment={horizontal:'center',vertical:'middle'};
                ws.mergeCells('A4:M4'); ws.getCell('A4').value=`Tanggal Export: ${this.getFormattedDateOnly()} | Total Data: ${rows.length}`; ws.getCell('A4').font={italic:true,size:9}; ws.getCell('A4').alignment={horizontal:'center'};
                ws.mergeCells('A5:M5'); ws.getCell('A5').value='';
                const header=ws.getRow(6);
                ['No','Tanggal PR','Nomor PR','Nomor PO','Supplier','Nama Barang','Satuan','Total Order','Diterima','Sisa Order','Keterangan','Skala Prioritas','Status'].forEach((v,i)=>header.getCell(i+1).value=v);
                header.font={bold:true,color:{argb:'FFFFFFFF'},size:9}; header.alignment={horizontal:'center',vertical:'middle',wrapText:true}; header.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF047857'}}; header.height=28;
                header.eachCell(c=>c.border={top:{style:'thin'},left:{style:'thin'},bottom:{style:'thin'},right:{style:'thin'}});
                let r=7;
                for (const [idx,order] of rows.entries()) {
                    const row=ws.getRow(r++);
                    row.values=[idx+1, this.excelDateValue(order.tgl)||order.tgl||'-', order.nomorPR||'-', order.nomorPO||'-', order.supplier||'-', String(order.nama||'-').toUpperCase(), String(order.satuan||'Pcs').toUpperCase(), Number(order.qtyTotal)||0, Number(order.qtyReceived)||0, Number(order.qtyRemaining)||0, String(order.keperluan||order.project||'-').toUpperCase(), Number(order.prioritas)||'', order.status==='Diterima Semua'?'Diterima Semua':order.status==='Diterima Sebagian'?'Diterima Sebagian':order.status==='Cancel'?'Canceled':'Pending'];
                    row.alignment={vertical:'middle',wrapText:true};
                    for(let c=1;c<=13;c++) row.getCell(c).border={top:{style:'thin'},left:{style:'thin'},bottom:{style:'thin'},right:{style:'thin'}};
                    [1,2,3,4,5,7,8,9,10,12,13].forEach(c=>row.getCell(c).alignment={horizontal:'center',vertical:'middle',wrapText:true});
                }
                if (rows.length) {
                    const totalRow=ws.getRow(r++); ws.mergeCells(`A${totalRow.number}:G${totalRow.number}`); totalRow.getCell(1).value='TOTAL NILAI ORDER (SESUAI FILTER)'; totalRow.getCell(1).font={bold:true}; totalRow.getCell(1).alignment={horizontal:'right'}; totalRow.getCell(8).value=this.monitoringTotalHarga; totalRow.getCell(8).numFmt='#,##0'; totalRow.getCell(8).font={bold:true};
                    for(let c=1;c<=13;c++) totalRow.getCell(c).border={top:{style:'thin'},left:{style:'thin'},bottom:{style:'thin'},right:{style:'thin'}};
                }
                ws.autoFilter={from:{row:6,column:1},to:{row:Math.max(6,r-1),column:13}}; ws.printArea=`A1:M${Math.max(6,r-1)}`;
                const buffer=await wb.xlsx.writeBuffer(); const blob=new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`Purchase_Request_Agrofarm_${this.getFormattedDateOnly().replace(/\//g,'-')}.xlsx`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
            },
            exportMasterCatalogExcel() {
                if (!this.canEdit) return alert('Hanya Super Admin yang dapat menyimpan Data Master.');
                const rows = this.masterCatalog.map((item, i) => ({
                    No: i + 1,
                    'Kode Barang': item.kode || '',
                    'Nama Barang': item.nama || '',
                    'Tanggal Input': this.excelDateValue(item.tanggal) || item.tanggal || '',
                    'Stok Awal': String(Math.max(0, Math.round(Number(item.stockAwal ?? item.currentStock ?? 0) || 0))),
                    'Stok Saat Ini': String(Math.max(0, Math.round(Number(item.currentStock ?? item.stockAwal ?? 0) || 0))),
                    'Harga Satuan': Number(item.harga) || 0,
                    'Buffer Stok': Number(item.minStock) || 0,
                    'Lead Time (Hari)': Number(item.leadTime) || 0,
                    Satuan: item.satuan || 'Pcs'
                }));
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Data Master');
                XLSX.writeFile(wb, `Data_Master_Agrofarm_${this.getFormattedDateOnly().replace(/\//g,'-')}.xlsx`);
            },
            async waitForSupabaseSave() {
                // Tidak memakai polling/timer tambahan. Jika ada save yang masih
                // terjadwal, jalankan sekarang dan tunggu Promise-nya selesai.
                if (this.supabaseSaveTimer) {
                    clearTimeout(this.supabaseSaveTimer);
                    this.supabaseSaveTimer = null;
                    this.supabaseSavePromise = this.saveToSupabase();
                }

                if (this.supabaseSavePromise) {
                    const saved = await this.supabaseSavePromise;
                    if (saved === false) throw new Error('Penyimpanan data ke Supabase gagal. Export dibatalkan agar tidak mengambil data lama.');
                }

                // Jika ada perubahan baru yang masuk saat request sebelumnya berjalan,
                // jalankan save berikutnya sekarang agar export selalu menunggu state terakhir.
                if (this.supabaseSaveTimer || this.supabaseSaveQueued || this.supabaseSaveInProgress) {
                    if (this.supabaseSaveTimer) {
                        clearTimeout(this.supabaseSaveTimer);
                        this.supabaseSaveTimer = null;
                        this.supabaseSavePromise = this.saveToSupabase();
                    }
                    if (this.supabaseSavePromise) {
                        const saved = await this.supabaseSavePromise;
                        if (saved === false) throw new Error('Penyimpanan data ke Supabase gagal. Export dibatalkan agar tidak mengambil data lama.');
                    }
                }
            },
            async exportToExcel() {
                if (!this.canEdit) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat export Excel.');
                // Gunakan data yang SAMA PERSIS dengan yang sedang ditampilkan
                // pada tabel Gudang Spare Part. Jangan mengambil snapshot/sumber stok lain.
                const sparepartDisplayRows = Array.isArray(this.filteredSpareparts) ? this.filteredSpareparts.map(item => ({ ...item })) : [];
                const wb = XLSX.utils.book_new();
                const masterSheet = XLSX.utils.json_to_sheet(this.masterCatalog.map(item => ({...item, minStock:Number(item.minStock)||0})));
                XLSX.utils.book_append_sheet(wb, masterSheet, "Master Catalog");
                // Ambil langsung hasil computed Gudang Spare Part yang sedang tampil.
                // Dengan demikian qty/nama/satuan/lokasi/harga tidak dihitung ulang dari sumber lain.
                const sparepartRows = sparepartDisplayRows.map(item => ({
                    barcode: item.barcode || '',
                    kode: item.kode || '',
                    nama: item.nama || '',
                    qty: Math.max(0, Math.round(Number(item.qty) || 0)),
                    minStock: Math.max(0, Math.round(Number(item.minStock) || 0)),
                    satuan: item.satuan || 'PCS',
                    lokasi: item.lokasi || '',
                    harga: Number(item.harga) || 0,
                    totalHarga: (Number(item.harga) || 0) * Math.max(0, Math.round(Number(item.qty) || 0))
                }));
                const spSheet = XLSX.utils.json_to_sheet(sparepartRows);
                Object.keys(spSheet).filter(k => k[0] !== '!' && /^E[2-9]\d*$/.test(k)).forEach(k => { spSheet[k].z = '0'; });
                Object.keys(spSheet).filter(k => k[0] !== '!' && /^F[2-9]\d*$/.test(k)).forEach(k => { spSheet[k].z = '0'; });
                XLSX.utils.book_append_sheet(wb, spSheet, "Stok Sparepart");
                const spjSheet = XLSX.utils.json_to_sheet(this.sisaProjects);
                XLSX.utils.book_append_sheet(wb, spjSheet, "Stok Sisa Project");
                const purchaseRequestRows = this.monitoringItems.map(item => {
                    const row = { ...item, 'Nomor Purchase Request': item.nomorPR || '' };
                    delete row.harga;
                    delete row.hargaSatuan;
                    delete row.totalHarga;
                    delete row.totalNilai;
                    return row;
                });
                const monSheet = XLSX.utils.json_to_sheet(purchaseRequestRows);
                XLSX.utils.book_append_sheet(wb, monSheet, "Purchase Request");
                const activeLogsForExport = (this.logs || []).filter(l => !this.isCancelledLog(l));
                const logsSheet = XLSX.utils.json_to_sheet(activeLogsForExport);
                XLSX.utils.book_append_sheet(wb, logsSheet, "Log Pergerakan");
                XLSX.writeFile(wb, `Laporan_Inventory_Agrofarm_${this.getFormattedDateOnly().replace(/\//g, '-')}.xlsx`);
            },
            async exportLowStockExcel() {
                if (!this.canEdit) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat export Excel.');

                // EXPORT KHUSUS PERINGATAN STOK YANG TAMPIL DI GUDANG SPARE PART.
                // Sumbernya tetap lowStockItems agar sama persis dengan daftar di layar.
                const rows = (this.lowStockItems || [])
                    .filter(row => {
                        const gudang = String(row.gudang || '').trim().toLowerCase().replace(/\s+/g, ' ');
                        return gudang === 'sparepart' || gudang === 'spare part' || gudang === 'gudang sparepart' || gudang === 'gudang spare part';
                    })
                    .map((row, index) => ({
                        no: index + 1,
                        nama: row.nama || '-',
                        satuan: row.satuan || this.getMasterSatuan(row.nama, '-', '') || '-',
                        lokasi: row.lokasi || '-',
                        qty: Math.max(0, Math.round(Number(row.qty) || 0)),
                        minStock: Math.max(0, Math.round(Number(row.minStock) || 0)),
                        tglPR: row.tglPR || '-',
                        nomorPR: row.nomorPR || '-',
                        status: Number(row.qty) === 0 ? 'HABIS' : 'MENIPIS'
                    }));

                if (!rows.length) return alert('Tidak ada data peringatan stok Gudang Spare Part yang dapat diexport.');

                const fileDate = String(this.getFormattedDateOnly() || new Date().toLocaleDateString('id-ID')).replace(/\//g, '-');

                if (typeof ExcelJS === 'undefined') return alert('Library ExcelJS belum siap. Silakan refresh halaman.');

                try {
                    const wb = new ExcelJS.Workbook();
                    wb.creator = 'Agrofarm Nusa Raya';
                    wb.created = new Date();

                    // A4 LANDSCAPE + MARGIN 2 CM (ExcelJS menggunakan INCH).
                    // 2 cm = 0.7874 inch.
                    const ws = wb.addWorksheet('Peringatan Stock', {
                        pageSetup: {
                            paperSize: 9,
                            orientation: 'landscape',
                            fitToPage: true,
                            fitToWidth: 1,
                            fitToHeight: 0,
                            margins: {
                                left: 0.7874,
                                right: 0.7874,
                                top: 0.7874,
                                bottom: 0.7874,
                                header: 0.15,
                                footer: 0.15
                            },
                            horizontalDpi: 300,
                            verticalDpi: 300
                        }
                    });
                    ws.views = [{ showGridLines: false }];

                    // Lebar dibuat lebih proporsional supaya seluruh tabel terbaca
                    // dalam area cetak A4 landscape tanpa kolom terpotong.
                    ws.columns = [
                        { width: 6 }, { width: 28 }, { width: 12 }, { width: 16 },
                        { width: 15 }, { width: 14 }, { width: 15 }, { width: 18 }, { width: 13 }
                    ];

                    if (typeof AGROFARM_EXCEL_LOGO_BASE64 !== 'undefined' && AGROFARM_EXCEL_LOGO_BASE64) {
                        const logoId = wb.addImage({ base64: AGROFARM_EXCEL_LOGO_BASE64, extension: 'png' });
                        ws.addImage(logoId, { tl: { col: 0.15, row: 0.15 }, ext: { width: 145, height: 36 } });
                    }

                    ws.mergeCells('A1:I1');
                    ws.mergeCells('A2:I2');
                    ws.mergeCells('A3:I3');
                    ws.mergeCells('A4:I4');

                    ws.getCell('A1').value = 'PT AGROFARM NUSA RAYA';
                    ws.getCell('A2').value = 'Jl. Raya Ponorogo-Madiun KM 4 (JL Industri) Kertosari Babadan Ponorogo';
                    ws.getCell('A3').value = 'LIST PERINGATAN STOCK GUDANG SPARE PART';
                    ws.getCell('A4').value = `Tanggal Export: ${this.getFormattedDateOnly()} | Total Peringatan: ${rows.length}`;

                    ws.getCell('A1').font = { name: 'Arial', size: 14, bold: true };
                    ws.getCell('A2').font = { name: 'Arial', size: 9 };
                    ws.getCell('A3').font = { name: 'Arial', size: 13, bold: true };
                    ws.getCell('A4').font = { name: 'Arial', size: 9, italic: true };
                    ['A1','A2','A3','A4'].forEach(cell => {
                        ws.getCell(cell).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                    });
                    ws.getRow(1).height = 24;
                    ws.getRow(2).height = 18;
                    ws.getRow(3).height = 22;
                    ws.getRow(4).height = 18;

                    const headers = ['No', 'Nama Barang', 'Satuan', 'Lokasi Rak', 'Stok Saat Ini', 'Min. Stok', 'Tanggal PR', 'Nomor PR', 'Status'];
                    const headerRow = ws.addRow(headers);
                    headerRow.height = 24;
                    headerRow.eachCell(cell => {
                        cell.font = { name: 'Arial', size: 9, bold: true };
                        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
                        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    });

                    rows.forEach(item => {
                        const r = ws.addRow([
                            item.no, item.nama.toUpperCase(), item.satuan, item.lokasi,
                            item.qty, item.minStock, this.excelDateValue(item.tglPR) || item.tglPR || '', item.nomorPR, item.status
                        ]);
                        r.height = 22;
                        r.eachCell(cell => {
                            cell.font = { name: 'Arial', size: 9 };
                            cell.alignment = { vertical: 'middle', wrapText: true };
                            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                        });
                        [1,3,4,5,6,7,8,9].forEach(col => {
                            r.getCell(col).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                        });
                        r.getCell(9).font = item.status === 'HABIS'
                            ? { name: 'Arial', size: 9, bold: true, color: { argb: 'FFC00000' } }
                            : { name: 'Arial', size: 9, bold: true, color: { argb: 'FFC47F00' } };
                    });

                    ws.freezePanes = { xSplit: 0, ySplit: 5 };
                    ws.autoFilter = { from: 'A5', to: `I${Math.max(5, ws.lastRow.number)}` };
                    ws.printArea = `A1:I${Math.max(5, ws.lastRow.number)}`;
                    ws.pageSetup.fitToWidth = 1;
                    ws.pageSetup.fitToHeight = 0;
                    ws.pageSetup.fitToPage = true;
                    ws.pageSetup.orientation = 'landscape';
                    ws.pageSetup.paperSize = 9;
                    ws.pageSetup.margins = {
                        left: 0.7874, right: 0.7874, top: 0.7874, bottom: 0.7874,
                        header: 0.15, footer: 0.15
                    };

                    const buffer = await wb.xlsx.writeBuffer();
                    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `List_Peringatan_Stock_Gudang_Sparepart_${fileDate}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                } catch (err) {
                    console.error('Export Peringatan Stok Gudang Spare Part gagal:', err);
                    alert('Export Peringatan Stok Gudang Spare Part gagal. Silakan refresh halaman lalu coba lagi.');
                }
            },
            async exportDashboardByDate() {
                if (!this.canEdit) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat export Excel.');
                if (!this.dashFilterDateStart && !this.dashFilterDateEnd) return alert('Silakan pilih rentang tanggal terlebih dahulu!');
                if (this.dashFilterDateStart && this.dashFilterDateEnd && this.dashFilterDateStart > this.dashFilterDateEnd) return alert('Tanggal mulai tidak boleh lebih besar dari tanggal akhir!');
                if (typeof ExcelJS === 'undefined') return alert('Library Excel belum siap. Silakan refresh halaman.');
                const inRange=l=>{if(this.isCancelledLog(l))return false;const d=new Date(l.isoDate||l.id);if(this.dashFilterDateStart&&d<new Date(this.dashFilterDateStart))return false;if(this.dashFilterDateEnd){const e=new Date(this.dashFilterDateEnd);e.setHours(23,59,59,999);if(d>e)return false;}return true;};
                const printedDate=this.getFormattedDateOnly(); const rangeText=(this.dashFilterDateStart||this.dashFilterDateEnd)?`${this.dashFilterDateStart||'(awal)'} s/d ${this.dashFilterDateEnd||'(akhir)'}`:'SEMUA PERIODE';
                const wb=new ExcelJS.Workbook(); wb.creator='Agrofarm Nusa Raya'; wb.created=new Date(); const ws=wb.addWorksheet('Laporan Pergerakan Stok',{pageSetup:{paperSize:9,orientation:'portrait',fitToPage:true,fitToWidth:1,fitToHeight:0,margins:{left:.25,right:.25,top:.35,bottom:.35,header:.1,footer:.1}}}); ws.views=[{showGridLines:false}]; ws.columns=[{width:6},{width:14},{width:34},{width:13},{width:13},{width:13},{width:13},{width:32},{width:16},{width:18}];
                const logoId=wb.addImage({base64:'data:image/png;base64,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',extension:'png'}); ws.addImage(logoId,{tl:{col:.15,row:.2},ext:{width:145,height:36}}); ws.mergeCells('A1:G1');ws.mergeCells('A2:G2');ws.mergeCells('H1:I3');
                ws.getCell('A1').value='LAPORAN PERGERAKAN STOK';ws.getCell('A2').value='AGROFARM NUSA RAYA — Sistem Inventory Spare Part';ws.getCell('H1').value=`Tanggal Cetak\n${rangeText}\nDicetak: ${this.escapeHtml(printedDate)}`;
                ws.getCell('A1').font={name:'Arial',size:16,bold:true};ws.getCell('A2').font={name:'Arial',size:10,bold:true};ws.getCell('H1').font={name:'Arial',size:9,bold:true};ws.getCell('A1').alignment={horizontal:'center',vertical:'middle'};ws.getCell('A2').alignment={horizontal:'center',vertical:'middle'};ws.getCell('H1').alignment={horizontal:'right',vertical:'middle',wrapText:true};
                const border={top:{style:'thin'},left:{style:'thin'},bottom:{style:'thin'},right:{style:'thin'}}; const style=c=>{c.font={name:'Arial',size:9};c.border=border;c.alignment={vertical:'middle',wrapText:true};}; const info=(l,v)=>{const r=ws.addRow([l,v]);ws.mergeCells(`B${r.number}:I${r.number}`);style(r.getCell(1));style(r.getCell(2));r.getCell(1).font={name:'Arial',size:9,bold:true};}; info('Cakupan','Semua Gudang');info('Periode',rangeText);ws.addRow([]);
                const section=g=>{
                    this.getWarehouseTransactionTimeline(g);
                    const inputOrder=(a,b)=>{const ta=new Date(a?.isoDate||a?.tgl||0).getTime()||0;const tb=new Date(b?.isoDate||b?.tgl||0).getTime()||0;if(ta!==tb)return ta-tb;const ca=new Date(a?.createdAt||a?.inputAt||a?.id||0).getTime()||0;const cb=new Date(b?.createdAt||b?.inputAt||b?.id||0).getTime()||0;if(ca!==cb)return ca-cb;return String(a?.id||'').localeCompare(String(b?.id||''));};
                    const allWarehouseLogs=this.logs.filter(l=>!this.isCancelledLog(l)&&String(l.gudang||'').toLowerCase()===g.toLowerCase()).sort(inputOrder);
                    const ins=allWarehouseLogs.filter(l=>String(l.type||'').toUpperCase()==='IN'&&inRange(l));
                    const outs=allWarehouseLogs.filter(l=>String(l.type||'').toUpperCase()==='OUT'&&inRange(l));
                    let title=ws.addRow([`GUDANG ${g.toUpperCase()} — BARANG MASUK (INBOUND)`,`${ins.length} TRANSAKSI`]);ws.mergeCells(`A${title.number}:J${title.number}`);title.getCell(1).font={name:'Arial',size:11,bold:true};
                    let h=ws.addRow(['No','Tanggal','Nama Barang','Satuan','Qty Masuk','Qty Awal','Qty Akhir','Supplier / Kepentingan','Harga Satuan','Harga Total']);h.eachCell(c=>{style(c);c.font={name:'Arial',size:9,bold:true};c.alignment={horizontal:'center',vertical:'middle',wrapText:true};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFE2E8F0'}};});
                    if(!ins.length){const e=ws.addRow(['','','Tidak ada data barang masuk pada periode ini.']);ws.mergeCells(`C${e.number}:G${e.number}`);e.getCell(3).alignment={horizontal:'center'};} ins.forEach((l,i)=>{const q=Math.max(0,Math.round(Number(l.qty)||0));const hrg=Number(l.harga!=null?l.harga:this.getMasterHarga(l.nama))||0;const r=ws.addRow([i+1,this.excelDateValue(l.tgl)||l.tgl||'-',l.nama||'-',(this.getMasterSatuan(l.nama, l.satuan || 'Pcs', l.kode || l.barcode || '') || 'Pcs'),q,Math.max(0,Math.round(Number(l.qtyAwal)||0)),Math.max(0,Math.round(Number(l.qtyAkhir)||0)),l.supplier||l.keperluan||'-',hrg,hrg*q]);r.eachCell(style); if (r.getCell(2).value instanceof Date) r.getCell(2).numFmt='dd/mm/yyyy'; r.getCell(9).numFmt='#,##0';r.getCell(10).numFmt='#,##0';});
                    title=ws.addRow([`GUDANG ${g.toUpperCase()} — BARANG KELUAR (OUTBOUND)`,`${outs.length} TRANSAKSI`]);ws.mergeCells(`A${title.number}:J${title.number}`);title.getCell(1).font={name:'Arial',size:11,bold:true};
                    h=ws.addRow(['No','Tanggal','Nama Barang','Satuan','Qty Keluar','Qty Awal','Qty Akhir','Pengambil / Keterangan','Harga Satuan','Harga Total']);h.eachCell(c=>{style(c);c.font={name:'Arial',size:9,bold:true};c.alignment={horizontal:'center',vertical:'middle',wrapText:true};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFE2E8F0'}};});
                    if(!outs.length){const e=ws.addRow(['','','Tidak ada data barang keluar pada periode ini.']);ws.mergeCells(`C${e.number}:G${e.number}`);e.getCell(3).alignment={horizontal:'center'};} outs.forEach((l,i)=>{const q=Math.max(0,Math.round(Number(l.qty)||0));const hrg=Number(l.harga!=null?l.harga:this.getMasterHarga(l.nama))||0;const r=ws.addRow([i+1,this.excelDateValue(l.tgl)||l.tgl||'-',l.nama||'-',(this.getMasterSatuan(l.nama, l.satuan || 'Pcs', l.kode || l.barcode || '') || 'Pcs'),q,Math.max(0,Math.round(Number(l.qtyAwal)||0)),Math.max(0,Math.round(Number(l.qtyAkhir)||0)),`${g === 'Sisa Project' ? (l.user||'-') : `${l.user||'-'} (${l.keperluan||'-'})`}`,hrg,hrg*q]);r.eachCell(style); if (r.getCell(2).value instanceof Date) r.getCell(2).numFmt='dd/mm/yyyy'; r.getCell(9).numFmt='#,##0';r.getCell(10).numFmt='#,##0';});ws.addRow([]);};
                section('Sparepart');section('Sisa Project'); const last=ws.lastRow.number;ws.freezePanes={xSplit:0,ySplit:5};ws.printArea=`A1:J${last}`;
                const buffer=await wb.xlsx.writeBuffer();const blob=new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`Laporan_Pergerakan_Stok_${this.dashFilterDateStart||'awal'}_sd_${this.dashFilterDateEnd||'akhir'}.xlsx`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
            },
            printDailyLogReport(scope) {
                if (!this.canPrint) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat mencetak.');
                // scope: 'all' (dashboard - both gudang) | 'Sparepart' | 'Sisa Project'
                let dateStart, dateEnd, barangFilter = '', keperluanFilter = '';
                if (scope === 'Sparepart') {
                    dateStart = this.spLogDateStart; dateEnd = this.spLogDateEnd || this.spLogDateStart;
                    barangFilter = this.spLogBarang || ''; keperluanFilter = this.spLogKeperluan || '';
                } else if (scope === 'Sisa Project') {
                    dateStart = this.spjLogDateStart; dateEnd = this.spjLogDateEnd || this.spjLogDateStart;
                    barangFilter = this.spjLogBarang || ''; keperluanFilter = this.spjLogKeperluan || '';
                } else {
                    dateStart = this.dashFilterDateStart; dateEnd = this.dashFilterDateEnd;
                }
                if (dateStart && dateEnd && dateStart > dateEnd) {
                    return alert('Tanggal mulai tidak boleh lebih besar dari tanggal akhir!');
                }
                const inRange = (l) => {
                    const lDate = new Date(l.isoDate || l.id);
                    if (dateStart && lDate < new Date(dateStart)) return false;
                    if (dateEnd) {
                        const endDate = new Date(dateEnd);
                        endDate.setHours(23, 59, 59, 999);
                        if (lDate > endDate) return false;
                    }
                    if (barangFilter && !String(l.nama || '').toLowerCase().includes(barangFilter.toLowerCase())) return false;
                    if (keperluanFilter) {
                        const hay = String((scope === 'Sisa Project' && l.type === 'OUT') ? (l.keterangan || l.keperluan || l.user || '') : (l.supplier || l.keperluan || l.user || '')).toLowerCase();
                        if (!hay.includes(keperluanFilter.toLowerCase())) return false;
                    }
                    const priceMin = scope === 'Sparepart' ? this.spLogHargaMin : (scope === 'Sisa Project' ? this.spjLogHargaMin : '');
                    const priceMax = scope === 'Sparepart' ? this.spLogHargaMax : (scope === 'Sisa Project' ? this.spjLogHargaMax : '');
                    const logHarga = Number(l.harga != null ? l.harga : this.getMasterHarga(l.nama)) || 0;
                    if (priceMin !== '' && logHarga < Number(priceMin)) return false;
                    if (priceMax !== '' && logHarga > Number(priceMax)) return false;
                    return true;
                };
                const buildTable = (logs, type, showPrice) => {
                    if (logs.length === 0) {
                        return `<tr><td colspan="${showPrice ? 10 : 8}" style="border:1px solid #000; padding:14px; text-align:center; font-style:italic; color:#64748b;">Tidak ada data ${type === 'IN' ? 'barang masuk' : 'barang keluar'} pada periode ini.</td></tr>`;
                    }
                    return logs.map((log, i) => {
                        const isOpname = (log.adjustmentType === 'OPNAME') || String(log.keperluan || '').includes('PENYESUAIAN STOCK OPNAME');
                        const bg = isOpname ? 'background:#fef3c7;' : '';
                        return `<tr style="${bg}">
                            <td style="border:1px solid #000; padding:5px; text-align:center;">${i + 1}</td>
                            <td style="border:1px solid #000; padding:5px; text-align:center;">${log.tgl || '-'}</td>
                            <td style="border:1px solid #000; padding:5px;">${(log.nama || '-').toUpperCase()}</td>
                            <td style="border:1px solid #000; padding:5px; text-align:center; font-weight:700;">${this.getMasterSatuan(log.nama, log.satuan || '-', log.kode || log.barcode || '') || '-'}</td>
                            <td style="border:1px solid #000; padding:5px; text-align:center; font-weight:700;">${type === 'IN' ? '+' : '-'}${log.qty || 0}</td>
                            <td style="border:1px solid #000; padding:5px; text-align:center;">${log.qtyAwal ?? '-'}</td>
                            <td style="border:1px solid #000; padding:5px; text-align:center; font-weight:700;">${log.qtyAkhir ?? '-'}</td>
                            <td style="border:1px solid #000; padding:5px;">${type === 'IN' ? (log.supplier || log.keperluan || '-') : `${(log.penerima || log.user || '-')} — ${log.keterangan || log.keperluan || '-'}`}${isOpname ? ' <b>[OPNAME]</b>' : ''}</td>
                            ${showPrice ? `<td style="border:1px solid #000; padding:5px; text-align:right;">Rp ${this.formatRupiah(Number(log.harga != null ? log.harga : this.getMasterHarga(log.nama)) || 0)}</td><td style="border:1px solid #000; padding:5px; text-align:right;">Rp ${this.formatRupiah((Number(log.harga != null ? log.harga : this.getMasterHarga(log.nama)) || 0) * (Number(log.qty) || 0))}</td>` : ''}
                        </tr>`;
                    }).join('');
                };
                const renderGudangSection = (gudangName) => {
                    const sectionShowPrice = gudangName.toLowerCase() === 'sparepart' ? this.sparepartShowPrices : this.sisaProjectShowPrices;
                    const inputOrder = (a,b) => {
                        const ta = new Date(a.createdAt || a.inputAt || a.id || a.isoDate || 0).getTime();
                        const tb = new Date(b.createdAt || b.inputAt || b.id || b.isoDate || 0).getTime();
                        return ta - tb;
                    };
                    const inLogs = this.logs.filter(l => String(l.gudang || '').toLowerCase() === gudangName.toLowerCase() && String(l.type || '').toUpperCase() === 'IN' && inRange(l)).sort(inputOrder);
                    const outLogs = this.logs.filter(l => String(l.gudang || '').toLowerCase() === gudangName.toLowerCase() && String(l.type || '').toUpperCase() === 'OUT' && inRange(l)).sort(inputOrder);
                    return `
                        <div style="margin-top:4mm; page-break-inside:auto; break-inside:auto;">
                            <div style="font-size:11pt; font-weight:800; border-bottom:2px solid #065f46; color:#065f46; padding-bottom:3px; margin-bottom:4px; text-transform:uppercase;">Gudang ${gudangName} &mdash; Barang Masuk (Inbound) &middot; ${inLogs.length} Transaksi</div>
                            <table style="width:100%; border-collapse:collapse; font-size:9pt; font-family:Arial, sans-serif; margin-bottom:8mm;">
                                <thead>
                                    <tr style="background:#d1fae5;">
                                        <th style="border:1px solid #000; padding:5px;">No</th>
                                        <th style="border:1px solid #000; padding:5px;">Tanggal</th>
                                        <th style="border:1px solid #000; padding:5px;">Nama Barang</th>
                                         <th style="border:1px solid #000; padding:5px;">Satuan</th>
                                        <th style="border:1px solid #000; padding:5px;">Qty Masuk</th>
                                        <th style="border:1px solid #000; padding:5px;">Qty Awal</th>
                                        <th style="border:1px solid #000; padding:5px;">Qty Akhir</th>
                                        <th style="border:1px solid #000; padding:5px;">Supplier / Kepentingan</th>
                                        ${sectionShowPrice ? '<th style="border:1px solid #000; padding:5px;">Harga Satuan</th><th style="border:1px solid #000; padding:5px;">Harga Total</th>' : ''}
                                    </tr>
                                </thead>
                                <tbody>${buildTable(inLogs, 'IN', sectionShowPrice)}</tbody>
                            </table>
                            <div style="font-size:11pt; font-weight:800; border-bottom:2px solid #b45309; color:#b45309; padding-bottom:3px; margin-bottom:4px; text-transform:uppercase;">Gudang ${gudangName} &mdash; Barang Keluar (Outbound) &middot; ${outLogs.length} Transaksi</div>
                            <table style="width:100%; border-collapse:collapse; font-size:9pt; font-family:Arial, sans-serif; margin-bottom:8mm;">
                                <thead>
                                    <tr style="background:#fef3c7;">
                                        <th style="border:1px solid #000; padding:5px;">No</th>
                                        <th style="border:1px solid #000; padding:5px;">Tanggal</th>
                                        <th style="border:1px solid #000; padding:5px;">Nama Barang</th>
                                         <th style="border:1px solid #000; padding:5px;">Satuan</th>
                                        <th style="border:1px solid #000; padding:5px;">Qty Keluar</th>
                                        <th style="border:1px solid #000; padding:5px;">Qty Awal</th>
                                        <th style="border:1px solid #000; padding:5px;">Qty Akhir</th>
                                        <th style="border:1px solid #000; padding:5px;">Penerima / Keterangan</th>
                                        ${sectionShowPrice ? '<th style="border:1px solid #000; padding:5px;">Harga Satuan</th><th style="border:1px solid #000; padding:5px;">Harga Total</th>' : ''}
                                    </tr>
                                </thead>
                                <tbody>${buildTable(outLogs, 'OUT', sectionShowPrice)}</tbody>
                            </table>
                        </div>`;
                };
                const sections = scope === 'all'
                    ? renderGudangSection('Sparepart') + renderGudangSection('Sisa Project')
                    : renderGudangSection(scope);
                const printedDate = this.getFormattedDateOnly();
                const rangeText = (dateStart || dateEnd)
                    ? `${dateStart || '(awal)'} s/d ${dateEnd || '(akhir)'}`
                    : 'SEMUA PERIODE';
                const scopeTitle = scope === 'all' ? 'Semua Gudang' : `Gudang ${scope}`;
                const AGROFARM_LOGO = 'https://customer-assets-eiarnc6j.emergentagent.net/job_pensive-babbage-6/artifacts/u0i9y95c_WhatsApp%20Image%202026-08-11%20at%2014.22.45.jpeg';
                const labelArea = document.getElementById('label-print-area');
                labelArea.innerHTML = `
                    <div class="stock-card-print" style="font-family: Arial, sans-serif; color:#000;">
                        <div style="display:flex; align-items:center; gap:14px; border-bottom:2px solid #000; padding-bottom:2mm; margin-bottom:2mm;">
                            <img src="${AGROFARM_LOGO}" alt="Agrofarm" style="height:35mm; width:auto; max-width:70mm; object-fit:contain;">
                            <div style="flex:1; text-align:center;">
                                <div style="font-size:16pt; font-weight:800; letter-spacing:.5px;">LAPORAN PERGERAKAN STOK</div>
                                <div style="font-size:10pt; font-weight:600;">AGROFARM NUSA RAYA &mdash; Sistem Inventory Spare Part</div>
                            </div>
                            <div style="text-align:right; font-size:9pt;">
                                <div><b>Tanggal Cetak</b></div>
                                <div>${rangeText}</div>
                                <div style="font-size:8pt; margin-top:2px;">Dicetak: ${this.escapeHtml(printedDate)}</div>
                            </div>
                        </div>
                        <table style="width:100%; font-size:10pt; margin-bottom:8mm;">
                            <tr><td style="width:140px; font-weight:700; padding:2px 0;">Cakupan</td><td style="padding:2px 0;">: ${scopeTitle}</td></tr>
                            <tr><td style="font-weight:700; padding:2px 0;">Periode</td><td style="padding:2px 0;">: ${rangeText}</td></tr>
                            ${barangFilter ? `<tr><td style="font-weight:700; padding:2px 0;">Filter Barang</td><td style="padding:2px 0;">: ${barangFilter}</td></tr>` : ''}
                            ${keperluanFilter ? `<tr><td style="font-weight:700; padding:2px 0;">Filter Kepentingan/Supplier</td><td style="padding:2px 0;">: ${keperluanFilter}</td></tr>` : ''}
                        </table>
                        ${sections}
                        <div style="margin-top:14mm; display:flex; justify-content:space-around; font-size:10pt;">
                            <div style="text-align:center; width:200px;">Dibuat<br><br><br><br>____________________</div>
                            <div style="text-align:center; width:200px;">Disetujui<br><br><br><br>____________________</div>
                            <div style="text-align:center; width:200px;">Diketahui<br><br><br><br>____________________</div>
                        </div>
                    </div>`;
                let reportPrintStyle = document.getElementById('__daily_log_print_dynamic_style');
                if (!reportPrintStyle) {
                    reportPrintStyle = document.createElement('style');
                    reportPrintStyle.id = '__daily_log_print_dynamic_style';
                    document.head.appendChild(reportPrintStyle);
                }
                reportPrintStyle.textContent = `@media print {
                    @page { size: A4 landscape; margin: 20mm; }
                    body.printing-label #label-print-area { display:block !important; visibility:visible !important; width:100% !important; overflow:visible !important; }
                    body.printing-label .stock-card-print { display:block !important; visibility:visible !important; width:100% !important; max-width:none !important; overflow:visible !important; }
                    body.printing-label .stock-card-print > div { page-break-inside:auto; break-inside:auto; }
                    body.printing-label .stock-card-print table { page-break-inside:auto; break-inside:auto; }
                    body.printing-label .stock-card-print table thead { display:table-header-group; }
                    body.printing-label .stock-card-print table tr { page-break-inside:avoid; break-inside:avoid; }
                }`;
                document.body.classList.add('printing-label');
                this.$nextTick(() => {
                    const logoImg = labelArea.querySelector('.stock-card-print img');
                    const doPrint = () => {
                        setTimeout(() => {
                            window.print();
                            document.body.classList.remove('printing-label');
                            labelArea.innerHTML = '';
                            if (reportPrintStyle) reportPrintStyle.textContent = '';
                        }, 500);
                    };
                    if (logoImg && !logoImg.complete) {
                        logoImg.onload = doPrint;
                        logoImg.onerror = doPrint;
                    } else {
                        doPrint();
                    }
                });
            },
            /* ============ STOCK OPNAME METHODS ============ */
            async exportStockGudangExcel(gudang) {
                if (!this.canEdit) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat export Excel.');
                // SUMBER DATA EXPORT = DATA MASTER YANG SEDANG DITAMPILKAN.
                // Tidak mengambil snapshot stok lain, tidak sync/reload, dan tidak menghitung ulang dari spareparts.
                const namaGudang = String(gudang || '').trim().toLowerCase();
                const isSparepart = namaGudang === 'sparepart' || namaGudang === 'spare part';
                const judulGudang = isSparepart ? 'SPARE PART' : 'SISA PROJECT';
                const showPrice = isSparepart ? this.sparepartShowPrices : this.sisaProjectShowPrices;
                const source = isSparepart
                    // Samakan sumber Excel dengan tabel Gudang Spare Part + Print Stok.
                    // Stok berjalan berasal dari spareparts.qty; Data Master hanya metadata.
                    // Ini mencegah currentStock/stockAwal yang belum tersinkron membuat
                    // sebagian item tampil 0 di Excel padahal stok gudang sudah benar.
                    ? (Array.isArray(this.filteredSpareparts) ? this.filteredSpareparts.map(item => ({
                        ...item,
                        qty: Math.max(0, Math.round(Number(item.qty) || 0)),
                        satuan: item.satuan || 'Pcs',
                        lokasi: item.lokasi || item.lokasiRak || item.rak || ''
                    })) : [])
                    : (this.sisaProjects || []);
                if (typeof ExcelJS === 'undefined') return alert('Library Excel belum siap. Silakan refresh halaman.');
                const items = source.filter(item => (Number(item.qty) || 0) > 0).slice().sort((a,b) => String(a.nama || '').localeCompare(String(b.nama || ''), 'id', {sensitivity:'base'}));
                const wb = new ExcelJS.Workbook(); wb.creator='Agrofarm Nusa Raya'; wb.created=new Date();
                const ws=wb.addWorksheet('Stock Gudang',{pageSetup:{paperSize:9,orientation:'portrait',fitToPage:true,fitToWidth:1,fitToHeight:0,margins:{left:.25,right:.25,top:.35,bottom:.35,header:.1,footer:.1}}}); ws.views=[{showGridLines:false}];
                const endCol=showPrice?'H':'F';
                const titleEnd=showPrice?'F':'D';
                const dateStart=showPrice?'G':'E';
                ws.columns=showPrice?[{width:6},{width:18},{width:36},{width:13},{width:16},{width:20},{width:18},{width:20}]:[{width:6},{width:18},{width:36},{width:13},{width:16},{width:20}];
                const logoId=wb.addImage({base64:AGROFARM_EXCEL_LOGO_BASE64,extension:'png'}); ws.addImage(logoId,{tl:{col:.15,row:.2},ext:{width:145,height:36}});
                ws.mergeCells(`A1:${titleEnd}1`); ws.mergeCells(`A2:${titleEnd}2`); ws.mergeCells(`A3:${titleEnd}3`); ws.mergeCells(`${dateStart}1:${endCol}3`);
                ws.getCell('A1').value='DAFTAR STOCK GUDANG'; ws.getCell('A2').value='AGROFARM NUSA RAYA — SISTEM INVENTORY SPARE PART'; ws.getCell('A3').value=`GUDANG ${this.escapeHtml(judulGudang)}`;
                ws.getCell('A1').font={name:'Arial',size:16,bold:true}; ws.getCell('A2').font={name:'Arial',size:10,bold:true}; ws.getCell('A3').font={name:'Arial',size:11,bold:true};
                ws.getCell('A1').alignment={horizontal:'center',vertical:'middle'}; ws.getCell('A2').alignment={horizontal:'center',vertical:'middle'}; ws.getCell('A3').alignment={horizontal:'center',vertical:'middle'};
                const dateCell=ws.getCell(`${dateStart}1`); dateCell.value=`Tanggal Cetak\n${this.getFormattedDateOnly()}`; dateCell.font={name:'Arial',size:9,bold:true}; dateCell.alignment={horizontal:'right',vertical:'middle',wrapText:true};
                const headers=showPrice?['No','Kode / SKU','Nama Barang','Satuan','Stok Saat Ini','Lokasi Rak','Harga Satuan','Harga Total']:['No','Kode / SKU','Nama Barang','Satuan','Stok Saat Ini','Lokasi Rak'];
                const header=ws.addRow(headers); const border={top:{style:'thin'},left:{style:'thin'},bottom:{style:'thin'},right:{style:'thin'}}; header.eachCell(c=>{c.font={name:'Arial',size:9,bold:true};c.alignment={horizontal:'center',vertical:'middle',wrapText:true};c.border=border;c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFE2E8F0'}};});
                let totalHarga=0; items.forEach((item,idx)=>{const qty=Math.max(0,Math.round(Number(item.qty)||0)); const harga=Number(this.getMasterHarga(item.nama,item.harga))||0; const total=harga*qty; totalHarga+=total; const row=[idx+1,item.kode||item.barcode||item.sku||'',item.nama||'',item.satuan||'Pcs',String(qty),item.lokasi||item.lokasiRak||item.rak||'']; if(showPrice)row.push(harga,total); const r=ws.addRow(row); r.eachCell(c=>{c.font={name:'Arial',size:9};c.border=border;c.alignment={vertical:'middle',wrapText:true};}); r.getCell(1).alignment={horizontal:'center'};r.getCell(4).alignment={horizontal:'center'};r.getCell(5).alignment={horizontal:'center'};if(showPrice){r.getCell(7).numFmt='#,##0';r.getCell(8).numFmt='#,##0';}});
                if(!items.length){const row=showPrice?['','','Tidak ada stok tersedia di '+judulGudang+'.','','','','','']:['','','Tidak ada stok tersedia di '+judulGudang+'.','','',''];const r=ws.addRow(row);ws.mergeCells(`C${r.number}:${endCol}${r.number}`);r.getCell(3).alignment={horizontal:'center'};}
                if(showPrice&&items.length){const r=ws.addRow(['','','TOTAL HARGA STOCK','','','','',totalHarga]);ws.mergeCells(`A${r.number}:G${r.number}`);r.getCell(1).font={name:'Arial',size:9,bold:true};r.getCell(1).alignment={horizontal:'right'};r.getCell(8).font={name:'Arial',size:9,bold:true};r.getCell(8).numFmt='#,##0';r.eachCell(c=>c.border=border);}
                const last=ws.lastRow.number; ws.autoFilter={from:'A4',to:`${endCol}${last}`}; ws.freezePanes={xSplit:0,ySplit:4}; ws.printArea=`A1:${endCol}${last}`;
                const buffer=await wb.xlsx.writeBuffer(); const blob=new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download=`Stock_Gudang_${judulGudang.replace(/\s+/g,'_')}_${this.getFormattedDateOnly().replace(/\//g,'-')}.xlsx`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
            },
            printStockGudang(gudang) {
                if (!this.canPrint) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat mencetak.');
                const namaGudang = String(gudang || '').trim().toLowerCase();
                const isSparepart = namaGudang === 'sparepart' || namaGudang === 'spare part';
                const judulGudang = isSparepart ? 'SPARE PART' : 'SISA PROJECT';
                const showPrice = isSparepart ? this.sparepartShowPrices : this.sisaProjectShowPrices;
                // Untuk Spare Part, gunakan saldo yang sama persis dengan tabel Gudang Spare Part.
                // Jangan mengambil ulang stok dari Data Master saat proses cetak agar saldo cetak tidak berbeda.
                const source = isSparepart
                    ? (this.filteredSpareparts || []).map(s => ({...s, qty: Math.max(0, Math.round(Number(s.qty) || 0)), harga: Math.max(0, Number(s.harga) || 0), satuan: s.satuan || 'PCS', lokasi: s.lokasi || ''}))
                    : (this.sisaProjects || []).map(item => {
                        const master = (this.masterCatalog || []).find(m =>
                            (item.kode && m.kode && String(item.kode).trim().toLowerCase() === String(m.kode).trim().toLowerCase()) ||
                            String(item.nama || '').trim().toLowerCase() === String(m.nama || '').trim().toLowerCase()
                        );
                        return {...item, satuan: (master && master.satuan) || item.satuan || 'PCS'};
                    });
                const items = (Array.isArray(source) ? source : [])
                    .filter(item => (Number(item.qty) || 0) > 0)
                    .slice()
                    .sort((a,b) => String(a.nama || '').localeCompare(String(b.nama || ''), 'id', {sensitivity:'base'}));
                const printedDate = this.getFormattedDateOnly ? this.getFormattedDateOnly() : new Date().toLocaleDateString('id-ID');
                const totalHarga = items.reduce((sum,item) => sum + ((Number(this.getMasterHarga(item.nama,item.harga)) || 0) * (Number(item.qty) || 0)), 0);
                const ROWS_PER_PAGE = showPrice ? 18 : 24;
                const chunks = [];
                if (items.length) {
                    for (let i = 0; i < items.length; i += ROWS_PER_PAGE) chunks.push(items.slice(i, i + ROWS_PER_PAGE));
                } else {
                    chunks.push([]);
                }
                const totalPages = chunks.length;
                const logo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg04Fvw4tFQIaOv_YisutC8tIMsbS2eM10wP2eWOotwA&s=10';
                const colSpan = showPrice ? 8 : 6;
                const buildRows = (chunk, offset) => chunk.map((item, idx) => {
                    const qty = Number(item.qty) || 0;
                    const harga = Number(this.getMasterHarga(item.nama,item.harga)) || 0;
                    const total = harga * qty;
                    return `<tr>
                        <td>${offset + idx + 1}</td>
                        <td>${this.escapeHtml(item.kode || item.barcode || item.sku || '-')}</td>
                        <td class="nama">${this.escapeHtml(item.nama || '-')}</td>
                        <td>${this.escapeHtml(item.satuan || 'Pcs')}</td>
                        <td class="qty">${qty.toLocaleString('id-ID')}</td>
                        <td>${this.escapeHtml(item.lokasi || item.lokasiRak || item.rak || '-')}</td>
                        ${showPrice ? `<td class="angka">Rp ${this.formatRupiah(harga)}</td><td class="angka">Rp ${this.formatRupiah(total)}</td>` : ''}
                    </tr>`;
                }).join('');
                const buildPage = (chunk, pageIdx) => {
                    const isLast = pageIdx === totalPages - 1;
                    const offset = chunks.slice(0, pageIdx).reduce((n,c) => n + c.length, 0);
                    const rows = chunk.length ? buildRows(chunk, offset) : `<tr><td colspan="${colSpan}" class="kosong">Tidak ada stok tersedia di ${this.escapeHtml(judulGudang)}.</td></tr>`;
                    const totalRow = isLast && showPrice && items.length
                        ? `<tr class="stock-print-total"><td colspan="7">TOTAL HARGA STOCK</td><td class="angka">Rp ${this.formatRupiah(totalHarga)}</td></tr>` : '';
                    return `<section class="stock-print-page">
                        <div class="stock-print-document">
                            <div class="stock-print-header">
                                <div class="stock-print-brand">
                                    <img src="${logo}" alt="Agrofarm">
                                    <div>
                                        <div class="stock-print-title">DAFTAR STOCK GUDANG</div>
                                        <div class="stock-print-subtitle">AGROFARM NUSA RAYA — SISTEM INVENTORY SPARE PART</div>
                                        <div class="stock-print-warehouse">GUDANG ${this.escapeHtml(judulGudang)}</div>
                                    </div>
                                </div>
                                <div class="stock-print-date"><b>Tanggal Cetak</b><br>${this.escapeHtml(printedDate)}<br><span>Halaman ${pageIdx + 1} dari ${totalPages}</span></div>
                            </div>
                            <table class="stock-print-table">
                                <thead><tr>
                                    <th>No</th><th>Kode / SKU</th><th>Nama Barang</th><th>Satuan</th><th>Stok Saat Ini</th><th>Lokasi Rak</th>
                                    ${showPrice ? '<th>Harga Satuan</th><th>Harga Total</th>' : ''}
                                </tr></thead>
                                <tbody>${rows}${totalRow}</tbody>
                            </table>
                            <div class="stock-print-note">Keterangan: laporan ini menampilkan jumlah stok yang tersedia pada saat tombol Cetak Stock ditekan.</div>
                            ${isLast ? `<div class="stock-print-sign"><div>Dibuat<br><br><br>____________________</div><div>Disetujui<br><br><br>____________________</div><div>Diketahui<br><br><br>____________________</div></div>` : ''}
                        </div>
                    </section>`;
                };
                const labelArea = document.getElementById('label-print-area');
                if (!labelArea) return alert('Area cetak stock tidak ditemukan.');
                labelArea.innerHTML = chunks.map((chunk, idx) => buildPage(chunk, idx)).join('');
                let style = document.getElementById('__stock_print_dynamic_style');
                if (!style) { style = document.createElement('style'); style.id = '__stock_print_dynamic_style'; document.head.appendChild(style); }
                style.textContent = `@media print {
                    @page { size: A4 landscape; margin: 20mm; }
                    body.printing-label .stock-print-page { page-break-after: always; break-after: page; min-height: 0; box-sizing: border-box; padding: 0; }
                    body.printing-label .stock-print-page:last-child { page-break-after: auto; break-after: auto; }
                    body.printing-label .stock-print-document { page-break-inside: avoid; break-inside: avoid; }
                }`;
                document.body.classList.add('printing-label');
                this.$nextTick(() => {
                    const logoImg = labelArea.querySelector('.stock-print-header img');
                    const doPrint = () => setTimeout(() => window.print(), 350);
                    if (logoImg && !logoImg.complete) { logoImg.onload = doPrint; logoImg.onerror = doPrint; } else doPrint();
                });
                const cleanup = () => {
                    document.body.classList.remove('printing-label');
                    labelArea.innerHTML = '';
                    style.textContent = '';
                    window.removeEventListener('afterprint', cleanup);
                };
                window.addEventListener('afterprint', cleanup);
            },
            initOpnameDraft(gudang) {
                const g = gudang || this.opnameDraft.gudang || 'Sparepart';
                this.syncMasterAndSparepart();
                // Untuk Spare Part, Qty Sistem harus sama persis dengan stok yang tampil di Data Master.
                // Data Master menampilkan: stockAwal jika tersedia, lalu currentStock sebagai fallback.
                const source = (g === 'Sisa Project' ? this.sisaProjects : this.spareparts) || [];
                this.opnameDraft = {
                    gudang: g,
                    tanggal: this.opnameDraft.tanggal || new Date().toISOString().slice(0,10),
                    petugas: this.opnameDraft.petugas || '',
                    keterangan: this.opnameDraft.keterangan || '',
                    items: source.map(s => ({
                        barcode: s.barcode || '',
                        kode: s.kode || '',
                        nama: s.nama || '',
                        satuan: s.satuan || 'Pcs',
                        lokasi: s.lokasi || s.lokasiRak || s.rak || '-',
                        qtySystem: g === 'Sisa Project' ? (Number(s.qty) || 0) : (Number(s.stockAwal ?? s.currentStock ?? 0) || 0),
                        qtyFisik: '',
                        catatan: ''
                    }))
                };
                this.opnameSearch = '';
                this.opnameFilterMode = 'all';
                this.opnamePage = 1;
                this.$nextTick(() => this.refreshIcons());
            },
            setOpnameGudang(g) {
                if (this.opnameDraft.items && this.opnameDraft.items.some(x => x.qtyFisik !== '' && x.qtyFisik !== null)) {
                    if (!confirm('Ganti gudang akan menghapus input opname yang sudah ada. Lanjutkan?')) return;
                }
                this.initOpnameDraft(g);
            },
            resetOpnameDraft() {
                if (!confirm('Reset semua input hasil hitung fisik pada draft opname ini?')) return;
                this.opnameDraft.items.forEach(it => { it.qtyFisik = ''; it.catatan = ''; });
            },
            fillOpnameEqualSystem() {
                if (!confirm('Isi semua Qty Fisik = Qty Sistem (untuk item yang belum diisi)?')) return;
                this.opnameDraft.items.forEach(it => {
                    if (it.qtyFisik === '' || it.qtyFisik === null || it.qtyFisik === undefined) {
                        it.qtyFisik = it.qtySystem;
                    }
                });
            },
            downloadOpnameTemplate() {
                const rows = this.opnameDraft.items.map((it, i) => ({
                    No: i + 1,
                    Barcode: it.barcode || '',
                    'Nomor SKU': it.kode || '',
                    'Rak/Lokasi': it.lokasi || '',
                    'Nama Barang': it.nama,
                    Satuan: it.satuan,
                    'Qty Sistem': it.qtySystem,
                    'Qty Fisik': '',
                    Catatan: ''
                }));
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), `Opname_${this.opnameDraft.gudang}`);
                XLSX.writeFile(wb, `Template_Opname_${this.opnameDraft.gudang.replace(/\s+/g,'_')}_${this.opnameDraft.tanggal}.xlsx`);
            },
            importOpnameExcel(event) {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array', cellDates: false });
                        if (!workbook.SheetNames.length) {
                            alert('File Excel tidak memiliki sheet.');
                            return;
                        }
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: true });
                        if (!rows.length) {
                            alert('File Excel kosong!');
                            return;
                        }

                        // Import hanya mengisi Qty Fisik/Catatan pada item opname yang sudah ada.
                        // Pencocokan dibuat fleksibel agar Excel hasil template tetap terbaca meskipun
                        // format nomor SKU/barcode terbaca sebagai angka oleh Excel.
                        const norm = (v) => String(v ?? '').trim().toLowerCase().replace(/\s+/g, '');
                        const findValue = (row, keys) => {
                            const actual = Object.keys(row);
                            const key = actual.find(k => keys.some(x => norm(k) === norm(x)));
                            return key !== undefined ? row[key] : '';
                        };
                        const toQty = (v) => {
                            if (v === '' || v === null || v === undefined || this.isDateLikeValue(v)) return '';
                            const n = this.strictQty(v, 0);
                            return Number.isFinite(n) ? n : '';
                        };

                        let matched = 0, unmatched = 0;
                        rows.forEach(row => {
                            const nama = String(findValue(row, ['Nama Barang', 'nama']) || '').trim();
                            const kode = String(findValue(row, ['Nomor SKU', 'nomor SKU', 'Kode', 'kode', 'SKU']) || '').trim();
                            const barcode = String(findValue(row, ['Barcode', 'barcode']) || '').trim();
                            const qtyRaw = findValue(row, ['Qty Fisik', 'qty fisik', 'QtyFisik', 'Stok Fisik', 'Stock Fisik', 'Stok Aktual', 'Stock Aktual', 'Qty Aktual', 'Qty Actual', 'Jumlah Fisik', 'Stok', 'Stock', 'Qty']);
                            const qtyFisik = toQty(qtyRaw);
                            const catatan = String(findValue(row, ['Catatan', 'catatan']) || '').trim();
                            const lokasi = String(findValue(row, ['Rak/Lokasi', 'Lokasi', 'lokasi', 'Rak', 'rak']) || '').trim();

                            const target = this.opnameDraft.items.find(x =>
                                (barcode && norm(x.barcode) === norm(barcode)) ||
                                (kode && norm(x.kode) === norm(kode)) ||
                                (nama && norm(x.nama) === norm(nama))
                            );

                            if (target) {
                                // Satu baris Excel langsung dipetakan ke baris barang yang sama di tabel.
                                // Qty pada kolom fisik/aktual di Excel otomatis menjadi Qty Fisik.
                                if (qtyFisik !== '') target.qtyFisik = qtyFisik;
                                if (lokasi) target.lokasi = lokasi;
                                if (catatan) target.catatan = catatan;
                                matched++;
                            } else {
                                unmatched++;
                            }
                        });

                        this.$nextTick(() => this.refreshIcons());
                        const filledQty = this.opnameDraft.items.filter(x => x.qtyFisik !== '' && x.qtyFisik !== null && x.qtyFisik !== undefined).length;
                        alert(`Import selesai.\nBerhasil dicocokkan: ${matched}\nTidak ditemukan di gudang: ${unmatched}\nQty Fisik terisi: ${filledQty}\n\nData Excel yang cocok otomatis dimasukkan ke baris barang yang sesuai di tabel Stock Opname.`);
                    } catch (err) {
                        console.error('Import Stock Opname gagal:', err);
                        alert('Gagal membaca file Excel. Pastikan format kolom sesuai template.');
                    } finally {
                        event.target.value = '';
                    }
                };
                reader.readAsArrayBuffer(file);
            },
            openOpnameConfirm() {
                if (!this.opnameDraft.petugas || !this.opnameDraft.petugas.trim()) return alert('Nama Petugas Opname wajib diisi.');
                if (!this.opnameDraft.tanggal) return alert('Tanggal opname wajib diisi.');
                const filled = this.opnameDraftItemsWithSelisih.filter(x => x.qtyFisikNum !== null);
                if (filled.length === 0) return alert('Belum ada item yang diisi Qty Fisik. Isi minimal 1 item.');
                this.showOpnameConfirmModal = true;
                this.$nextTick(() => this.refreshIcons());
            },
            submitOpname() {
                if (!this.canEdit) return alert('Hanya Super Admin yang dapat menginput Stock Opname.');
                const draft = this.opnameDraft;
                const filled = this.opnameDraftItemsWithSelisih.filter(x => x.qtyFisikNum !== null);
                if (filled.length === 0) { this.showOpnameConfirmModal = false; return; }
                const opnameDateObj = this.getDateFromInput(draft.tanggal);
                const nowTime = new Date();
                opnameDateObj.setHours(nowTime.getHours(), nowTime.getMinutes(), nowTime.getSeconds(), 0);
                const isoNow = opnameDateObj.toISOString();
                const dateOnly = this.getFormattedDateOnly(opnameDateObj);
                const opnameId = 'OPN-' + Date.now();
                const nomor = 'OPN/' + new Date(isoNow).getFullYear() + '/' + String(this.opnameHistory.length + 1).padStart(4, '0');
                const source = draft.gudang === 'Sisa Project' ? this.sisaProjects : this.spareparts;
                const detailRecords = [];
                filled.forEach(row => {
                    const target = source.find(s => (row.barcode && s.barcode === row.barcode) || (row.kode && s.kode === row.kode) || String(s.nama || '').toLowerCase() === String(row.nama || '').toLowerCase());
                    if (!target) return;
                    const qtySystem = Number(row.qtySystem) || 0;
                    const qtyFisik = Number(row.qtyFisikNum);
                    detailRecords.push({ barcode: row.barcode, kode: row.kode, nama: row.nama, satuan: row.satuan, lokasi: row.lokasi, qtySystem: qtySystem, qtyFisik: qtyFisik, selisih: qtyFisik - qtySystem, catatan: row.catatan || '' });
                });
                const record = { id: opnameId, nomor: nomor, isoDate: isoNow, tgl: dateOnly, gudang: draft.gudang, petugas: draft.petugas.toUpperCase(), keterangan: draft.keterangan || '', totalItem: detailRecords.length, totalSelisih: detailRecords.filter(d => d.selisih !== 0).length, totalMatch: detailRecords.filter(d => d.selisih === 0).length, items: detailRecords, approvalStatus: 'pending' };
                this.opnameHistory.unshift(record);
                this.showOpnameConfirmModal = false;
                this.initOpnameDraft(draft.gudang);
                this.activeTab = 'opname_history';
                alert(`Stock Opname ${nomor} berhasil disimpan dan menunggu persetujuan Super Admin. Penyesuaian stok belum dilakukan.`);
            },
            filteredOpnameHistoryItems(op) {
                if (!op || !Array.isArray(op.items)) return [];
                if (this.opnameHistoryItemFilter === 'selisih') return op.items.filter(it => Number(it.selisih) !== 0);
                return op.items;
            },
            currentOpnameEditDifference(item) {
                const qtySystem = Number(item?.qtySystem) || 0;
                const raw = item?.qtyFisik;
                if (raw === '' || raw === null || raw === undefined) return 0;
                const qtyFisik = Number(raw);
                return Number.isFinite(qtyFisik) ? qtyFisik - qtySystem : 0;
            },
            filteredEditingOpnameHistoryItems() {
                const items = this.editingOpnameHistory?.items || [];
                if (this.opnameHistoryItemFilter === 'selisih') return items.filter(it => this.currentOpnameEditDifference(it) !== 0);
                return items;
            },
            openOpnameHistoryEdit(op) {
                if (!this.canEdit) return alert('Akun Viewer tidak dapat mengedit Stock Opname.');
                if (!op || String(op.approvalStatus || 'approved').toLowerCase() !== 'pending') return alert('Stock Opname yang sudah disetujui tidak dapat diedit.');
                const rawDate = String(op.tgl || '').trim();
                const dateInput = /^\d{2}\/\d{2}\/\d{4}$/.test(rawDate) ? rawDate.split('/').reverse().join('-') : (rawDate.slice(0, 10) || String(op.isoDate || '').slice(0, 10));
                this.editingOpnameHistory = { ...op, tanggalInput: dateInput, petugas: String(op.petugas || ''), keterangan: String(op.keterangan || ''), items: (op.items || []).map(it => ({ ...it })) };
                this.opnameHistoryItemFilter = 'all';
                this.showOpnameHistoryEditModal = true;
                this.$nextTick(() => this.refreshIcons());
            },
            closeOpnameHistoryEdit() {
                this.showOpnameHistoryEditModal = false;
                this.editingOpnameHistory = null;
            },
            saveOpnameHistoryEdit() {
                if (!this.canEdit) return alert('Akun Viewer tidak dapat mengedit Stock Opname.');
                const edit = this.editingOpnameHistory;
                if (!edit) return;
                const target = this.opnameHistory.find(op => String(op.id) === String(edit.id));
                if (!target) return alert('Riwayat Stock Opname tidak ditemukan.');
                if (String(target.approvalStatus || 'approved').toLowerCase() !== 'pending') {
                    this.closeOpnameHistoryEdit();
                    return alert('Stock Opname sudah disetujui sehingga tidak dapat diedit.');
                }
                if (!String(edit.petugas || '').trim()) return alert('Nama Petugas Opname wajib diisi.');
                if (!String(edit.tanggalInput || '').trim()) return alert('Tanggal opname wajib diisi.');
                const dateObj = this.getDateFromInput(edit.tanggalInput);
                const updatedItems = (edit.items || []).map(it => {
                    const qtySystem = Number(it.qtySystem) || 0;
                    const qtyFisik = Number(it.qtyFisik);
                    const valid = Number.isFinite(qtyFisik);
                    return { ...it, qtySystem, qtyFisik: valid ? qtyFisik : '', selisih: valid ? qtyFisik - qtySystem : 0, catatan: String(it.catatan || '') };
                });
                Object.assign(target, {
                    isoDate: dateObj.toISOString(),
                    tgl: this.getFormattedDateOnly(dateObj),
                    petugas: String(edit.petugas || '').trim().toUpperCase(),
                    keterangan: String(edit.keterangan || '').trim(),
                    items: updatedItems,
                    totalItem: updatedItems.length,
                    totalSelisih: updatedItems.filter(it => Number(it.selisih) !== 0).length,
                    totalMatch: updatedItems.filter(it => Number(it.selisih) === 0).length
                });
                this.closeOpnameHistoryEdit();
                alert(`Stock Opname ${target.nomor} berhasil diperbarui dan tetap menunggu persetujuan.`);
            },
            pilihOpnamePeriode() {
                this.opnameHistoryFilterApplied = true;
                this.$nextTick(() => this.refreshIcons());
            },
            normalizePlanningState(requestRows, usageRows) {
                const requests = Array.isArray(requestRows) ? requestRows : [];
                const usages = Array.isArray(usageRows) ? usageRows : [];
                const requestIds = new Set();
                const usageIds = new Set();

                for (let i = 0; i < requests.length; i++) {
                    let row = requests[i];
                    if (!row || typeof row !== 'object' || Array.isArray(row)) {
                        row = {};
                        requests[i] = row;
                    }
                    let id = String(row.id || '').trim();
                    if (!id || requestIds.has(id)) id = `PRP-LEGACY-${i + 1}-${Date.now()}`;
                    requestIds.add(id);
                    row.id = id;
                    row.nomor = Number.isFinite(Number(row.nomor)) && Number(row.nomor) > 0 ? Number(row.nomor) : i + 1;
                    row.sku = String(row.sku || row.kode || '');
                    row.nama = String(row.nama || '');
                    row.satuan = String(row.satuan || 'Pcs');
                    row.bufferStock = Number(row.bufferStock) || 0;
                    row.penambahanStock = Number(row.penambahanStock) || 0;
                    row.hargaSatuan = Number(row.hargaSatuan) || 0;
                    row.tanggalPenggunaan = String(row.tanggalPenggunaan || '');
                    if (!Array.isArray(row.gudangPenggunaan)) {
                        const legacy = String(row.gudangPenggunaan || '').trim();
                        row.gudangPenggunaan = legacy ? [legacy] : ['Sparepart'];
                    }
                    row.gudangPenggunaan = [...new Set(row.gudangPenggunaan.filter(x => x === 'Sparepart' || x === 'Sisa Project'))];
                    if (!row.gudangPenggunaan.length) row.gudangPenggunaan = ['Sparepart'];
                }

                for (let i = 0; i < usages.length; i++) {
                    let row = usages[i];
                    if (!row || typeof row !== 'object' || Array.isArray(row)) {
                        row = {};
                        usages[i] = row;
                    }
                    let id = String(row.id || '').trim();
                    if (!id || usageIds.has(id)) id = `PUG-LEGACY-${i + 1}-${Date.now()}`;
                    usageIds.add(id);
                    row.id = id;
                    row.nomor = Number.isFinite(Number(row.nomor)) && Number(row.nomor) > 0 ? Number(row.nomor) : i + 1;
                    row.kode = String(row.kode || row.sku || '');
                    row.nama = String(row.nama || '');
                    row.satuan = String(row.satuan || 'Pcs');
                    row.stokSparepart = Number(row.stokSparepart) || 0;
                    row.stokSisaProject = Number(row.stokSisaProject) || 0;
                    if (!Array.isArray(row.proyek)) row.proyek = [];
                    if (!row.proyek.length) row.proyek.push({ id:`PROJ-LEGACY-${i + 1}-1`, nama:'', qty:0 });
                    const projectIds = new Set();
                    for (let p = 0; p < row.proyek.length; p++) {
                        let proj = row.proyek[p];
                        if (!proj || typeof proj !== 'object' || Array.isArray(proj)) {
                            proj = {};
                            row.proyek[p] = proj;
                        }
                        let pid = String(proj.id || '').trim();
                        if (!pid || projectIds.has(pid)) pid = `PROJ-LEGACY-${i + 1}-${p + 1}`;
                        projectIds.add(pid);
                        proj.id = pid;
                        proj.nama = String(proj.nama || '');
                        proj.qty = Number(proj.qty) || 0;
                    }
                }
                return { requests, usages };
            },
            openPlanningTab(tab) {
                if (tab !== 'planning_request' && tab !== 'planning_usage') return;
                this.planningError = '';
                this.planningAutocompleteQuery = '';
                this.planningAutocompleteResults = [];
                this.activeTab = tab;
                if (tab === 'planning_request') this.planningRequestPage = 1;
                if (tab === 'planning_usage') this.planningUsagePage = 1;

                // UI dibuka dulu. Index master/stok TIDAK boleh memblokir klik menu.
                this.planningViewReady = true;
                const token = ++this.planningOpenToken;
                this.$nextTick(() => {
                    if (token !== this.planningOpenToken || this.activeTab !== tab) return;
                    this.refreshIcons();
                    const build = () => {
                        if (token !== this.planningOpenToken || this.activeTab !== tab) return;
                        this.ensurePlanningRuntimeCache(true);
                    };
                    if (typeof requestIdleCallback === 'function') requestIdleCallback(build, { timeout: 250 });
                    else setTimeout(build, 60);
                });
            },
            resetPlanningFilters() {
                this.planningStockFilter = 'all';
                this.planningDateStart = '';
                this.planningDateEnd = '';
                this.planningUsedStockCache = new Map(); this.planningUsedStockCacheKey = '';
                this.planningWarehouseFilter = '';
                this.planningSearch = '';
                this.planningSearchInput = '';
                this.planningRequestPage = 1;
            },
            schedulePlanningFilterSearch() {
                clearTimeout(this._planningFilterTimer);
                const value = String(this.planningSearchInput || '');
                this._planningFilterTimer = setTimeout(() => {
                    this.planningSearch = value;
                    this.planningRequestPage = 1;
                }, 220);
            },
            markPlanningDirty(delay = 6000) {
                // Paksa badge/notifikasi Planning ikut menghitung ulang setiap perubahan.
                this.planningUiRevision++;
                // Planning dapat sangat besar. Simpan hanya setelah user berhenti berinteraksi
                // dan jalankan pada idle time agar serialisasi state tidak mengganggu ketikan.
                clearTimeout(this._planningPersistTimer);
                if (this._planningPersistIdle && typeof cancelIdleCallback === 'function') {
                    cancelIdleCallback(this._planningPersistIdle);
                    this._planningPersistIdle = null;
                }
                this._planningPersistTimer = setTimeout(() => {
                    const persist = () => {
                        this._planningPersistIdle = null;
                        this.saveToSupabase();
                    };
                    if (typeof requestIdleCallback === 'function') {
                        this._planningPersistIdle = requestIdleCallback(persist, { timeout: 2500 });
                    } else {
                        setTimeout(persist, 0);
                    }
                }, Math.max(250, Number(delay) || 6000));
            },
            openPlanningMasterDropdown(key, row, field, event) {
                this.masterDropdownField = field || 'nama';
                this.openMasterDropdown(key, row, event);
                this.schedulePlanningAutocomplete(event?.target?.value ?? (field === 'sku' ? (row?.sku || row?.kode || '') : row?.nama || ''), true);
            },
            updatePlanningMasterDropdown(key, row, field, event) {
                this.masterDropdownField = field || 'nama';
                this.updateMasterDropdown(key, row, event);
                this.schedulePlanningAutocomplete(event?.target?.value ?? '', false);
            },
            onPlanningLookupFocus(value) {
                this.schedulePlanningAutocomplete(String(value || ''), true);
            },
            schedulePlanningAutocomplete(value, immediate = false) {
                const query = String(value || '').trim();
                this.planningAutocompleteQuery = query;
                this.planningAutocompleteResults = [];
                const token = ++this.planningAutocompleteToken;
                const run = () => this.searchPlanningAutocomplete(query, token);
                if (immediate) run();
                else {
                    clearTimeout(this._planningAutocompleteTimer);
                    this._planningAutocompleteTimer = setTimeout(run, 90);
                }
            },
            searchPlanningAutocomplete(query, token) {
                if (token !== this.planningAutocompleteToken) return;
                const q = String(query || '').trim().toLowerCase();
                const rawMaster = toRaw(this.masterCatalog || []);
                if (!q) {
                    this.planningAutocompleteResults = rawMaster.slice(0, 5);
                    this.planningAutocompleteStatus = rawMaster.length ? 'ketik minimal 1 huruf / angka' : 'master kosong';
                    return;
                }

                const source = rawMaster;
                const results = [];
                let i = 0;
                const maxResults = 30;
                const chunkSize = 1800;
                this.planningAutocompleteStatus = 'mencari…';

                const scanChunk = () => {
                    if (token !== this.planningAutocompleteToken) return;
                    const stop = Math.min(i + chunkSize, source.length);
                    for (; i < stop && results.length < maxResults; i++) {
                        const m = source[i];
                        if (!m) continue;
                        const nama = String(m.nama || '').toLowerCase();
                        const kode = String(m.kode || m.barcode || m.sku || '').toLowerCase();
                        if (nama.includes(q) || kode.includes(q)) results.push(m);
                    }
                    if (results.length >= maxResults || i >= source.length) {
                        if (token !== this.planningAutocompleteToken) return;
                        this.planningAutocompleteResults = results;
                        this.planningAutocompleteStatus = results.length ? `${results.length} kandidat` : 'tidak ditemukan';
                        return;
                    }
                    setTimeout(scanChunk, 0);
                };
                scanChunk();
            },
            getPlanningMaster(nama, sku='') {
                const n = String(nama || '').trim().toLowerCase();
                const k = String(sku || '').trim().toLowerCase();
                // Tidak ada index seluruh Master. Kandidat hasil pencarian aktif saja yang dicek.
                for (const m of (this.planningAutocompleteResults || [])) {
                    const mk = String(m?.kode || m?.barcode || m?.sku || '').trim().toLowerCase();
                    const mn = String(m?.nama || '').trim().toLowerCase();
                    if ((k && mk === k) || (n && mn === n)) return m;
                }
                return null;
            },
            getPlanningStock(nama, warehouses=[], fallback = 0) {
                if (!this.planningCacheReady) return Number(fallback) || 0;
                const key = String(nama || '').trim().toLowerCase();
                if (!key) return Number(fallback) || 0;
                const list = Array.isArray(warehouses) && warehouses.length ? warehouses : ['Sparepart','Sisa Project'];
                let total = 0;
                if (list.includes('Sparepart')) total += Number(this.planningRuntime.stockSparepart.get(key) || 0);
                if (list.includes('Sisa Project')) total += Number(this.planningRuntime.stockSisaProject.get(key) || 0);
                return total;
            },
            updatePlanningRequestAddition(row) {
                if (!row || typeof row !== 'object') return;
                const stock = Number(this.getPlanningRowStock(row)) || 0;
                const buffer = Number(row.bufferStock) || 0;
                row.penambahanStock = stock < buffer ? Math.max(0, buffer - stock) : 0;
                this.markPlanningDirty();
            },
            getPlanningRowStock(row) {
                if (!row || typeof row !== 'object') return 0;
                return this.getPlanningStock(row.nama, row.gudangPenggunaan || [], row.stok);
            },
            getPlanningUsedStock(row) {
                if (!row || !this.planningDateRangeReady) return 0;
                const start = String(this.planningDateStart);
                const end = String(this.planningDateEnd);
                const key = `${start}|${end}`;
                let map = this.planningUsedStockCache;
                if (!(map instanceof Map) || this.planningUsedStockCacheKey !== key) {
                    map = new Map();
                    const startMs = new Date(start + 'T00:00:00').getTime();
                    const endMs = new Date(end + 'T23:59:59.999').getTime();
                    const norm = v => String(v || '').trim().toLowerCase();
                    for (const log of (this.logs || [])) {
                        if (!log || String(log.type || '').toUpperCase() !== 'OUT') continue;
                        if (this.isPendingLog(log)) continue;
                        const rawDate = log.isoDate || log.tgl || '';
                        const d = rawDate ? new Date(rawDate).getTime() : NaN;
                        if (!Number.isFinite(d) || d < startMs || d > endMs) continue;
                        const warehouse = String(log.gudang || '').trim().toLowerCase();
                        const name = norm(log.nama);
                        if (!warehouse || !name) continue;
                        const qty = Number(log.qty) || 0;
                        const cacheKey = `${warehouse}|${name}`;
                        map.set(cacheKey, (map.get(cacheKey) || 0) + qty);
                    }
                    this.planningUsedStockCache = map;
                    this.planningUsedStockCacheKey = key;
                }
                const name = String(row.nama || '').trim().toLowerCase();
                if (!name) return 0;
                const warehouses = Array.isArray(row.gudangPenggunaan) && row.gudangPenggunaan.length ? row.gudangPenggunaan : ['Sparepart','Sisa Project'];
                let total = 0;
                for (const gudang of warehouses) total += Number(map.get(`${String(gudang).trim().toLowerCase()}|${name}`) || 0);
                return total;
            },
            ensurePlanningRuntimeCache(force = false) {
                if (this.planningCacheBuilding) return;
                const rawSpare = toRaw(this.spareparts || []);
                const rawSisa = toRaw(this.sisaProjects || []);
                const cache = this.planningRuntime;
                if (!force && this.planningCacheReady &&
                    cache.sparepartCount === rawSpare.length &&
                    cache.sisaProjectCount === rawSisa.length) return;

                this.planningCacheBuilding = true;
                this.planningCacheReady = false;
                this.planningAutocompleteStatus = 'menyiapkan stok gudang…';
                const stockSparepart = new Map();
                const stockSisaProject = new Map();
                let phase = 'spare';
                let i = 0;
                const norm = value => String(value || '').trim().toLowerCase();

                const work = () => {
                    const startTime = performance.now();
                    while (performance.now() - startTime < 6) {
                        if (phase === 'spare') {
                            const stop = Math.min(i + 1200, rawSpare.length);
                            for (; i < stop; i++) {
                                const item = rawSpare[i];
                                const key = norm(item?.nama);
                                if (key) stockSparepart.set(key, (stockSparepart.get(key) || 0) + (Number(item?.qty) || 0));
                            }
                            if (i >= rawSpare.length) { phase = 'sisa'; i = 0; } else break;
                        } else if (phase === 'sisa') {
                            const stop = Math.min(i + 1200, rawSisa.length);
                            for (; i < stop; i++) {
                                const item = rawSisa[i];
                                const key = norm(item?.nama);
                                if (key) stockSisaProject.set(key, (stockSisaProject.get(key) || 0) + (Number(item?.qty) || 0));
                            }
                            if (i >= rawSisa.length) phase = 'done'; else break;
                        } else break;
                    }
                    if (phase !== 'done') {
                        setTimeout(work, 0);
                        return;
                    }
                    this.planningRuntime = markRaw({
                        stockSparepart, stockSisaProject,
                        sparepartCount: rawSpare.length, sisaProjectCount: rawSisa.length
                    });
                    this.planningCacheBuilding = false;
                    this.planningCacheReady = true;
                    this.planningAutocompleteStatus = `stok siap · master dicari saat diketik`;
                    this.refreshVisiblePlanningStocks();
                };
                setTimeout(work, 0);
            },
            refreshVisiblePlanningStocks() {
                if (!this.planningCacheReady) return;
                for (const row of (this.paginatedPlanningRequests || [])) {
                    if (!row || typeof row !== 'object') continue;
                    row.stok = this.getPlanningStock(row.nama, row.gudangPenggunaan || [], row.stok);
                }
                for (const row of (this.paginatedPlanningUsages || [])) {
                    if (!row || typeof row !== 'object') continue;
                    const key = String(row.nama || '').trim().toLowerCase();
                    row.stokSparepart = Number(this.planningRuntime.stockSparepart.get(key) || 0);
                    row.stokSisaProject = Number(this.planningRuntime.stockSisaProject.get(key) || 0);
                    if (!Array.isArray(row.proyek)) row.proyek = [];
                }
            },
            onPlanningRequestLookupInput(row, field) {
                if (!row || typeof row !== 'object') return;
                const value = field === 'sku' ? row.sku : row.nama;
                this.schedulePlanningAutocomplete(value);
                const master = this.getPlanningMaster(field === 'nama' ? value : '', field === 'sku' ? value : '');
                if (!master) return;
                this.applyPlanningMaster(row, master);
            },
            onPlanningUsageLookupInput(row, field) {
                if (!row || typeof row !== 'object') return;
                const value = field === 'sku' ? row.kode : row.nama;
                this.schedulePlanningAutocomplete(value);
                const master = this.getPlanningMaster(field === 'nama' ? value : '', field === 'sku' ? value : '');
                if (!master) return;
                this.applyPlanningUsageMaster(row, master);
            },
            formatPlanningQty(qty, satuan='') { return `${Number(qty)||0}${satuan ? ' '+satuan : ''}`; },
            planningIdentityFromMaster(master) {
                const sku = String(master?.kode || master?.barcode || master?.sku || '').trim().toLowerCase();
                const nama = String(master?.nama || '').trim().toLowerCase();
                return sku ? `sku:${sku}` : (nama ? `nama:${nama}` : '');
            },
            planningIdentityFromRow(row, type='request') {
                const sku = String(type === 'usage' ? (row?.kode || '') : (row?.sku || '')).trim().toLowerCase();
                const nama = String(row?.nama || '').trim().toLowerCase();
                return sku ? `sku:${sku}` : (nama ? `nama:${nama}` : '');
            },
            findPlanningDuplicate(type, currentRow, master) {
                const target = this.planningIdentityFromMaster(master);
                if (!target) return null;
                const source = type === 'usage' ? (this.planningUsages || []) : (this.planningRequests || []);
                for (const row of source) {
                    if (!row || row === currentRow) continue;
                    if (this.planningIdentityFromRow(row, type) === target) return row;
                }
                return null;
            },
            findPlanningDuplicateAsync(type, currentRow, master) {
                const target = this.planningIdentityFromMaster(master);
                if (!target) return Promise.resolve(null);
                const rawSource = toRaw(type === 'usage' ? (this.planningUsages || []) : (this.planningRequests || []));
                let i = 0;
                const chunkSize = 2500;
                return new Promise(resolve => {
                    const scan = () => {
                        const stop = Math.min(i + chunkSize, rawSource.length);
                        for (; i < stop; i++) {
                            const row = rawSource[i];
                            if (!row || row === currentRow) continue;
                            if (this.planningIdentityFromRow(row, type) === target) return resolve(row);
                        }
                        if (i >= rawSource.length) return resolve(null);
                        setTimeout(scan, 0);
                    };
                    scan();
                });
            },
            async confirmPlanningDuplicateIfNeededAsync(type, currentRow, master) {
                const duplicate = await this.findPlanningDuplicateAsync(type, currentRow, master);
                if (!duplicate) return true;
                const label = master?.nama || master?.kode || 'barang ini';
                return confirm(`${label} sudah ada di ${type === 'usage' ? 'Planning Penggunaan' : 'Planning Request'}.\n\nDuplikasi otomatis ditolak. Karena ini input manual, apakah Anda memang ingin memasukkan duplikat?`);
            },
            confirmPlanningDuplicateIfNeeded(type, currentRow, master) {
                const duplicate = this.findPlanningDuplicate(type, currentRow, master);
                if (!duplicate) return true;
                // Input manual tetap boleh override sesuai kebutuhan user, tetapi harus disengaja.
                const label = master?.nama || master?.kode || 'barang ini';
                return confirm(`${label} sudah ada di ${type === 'usage' ? 'Planning Penggunaan' : 'Planning Request'}.\n\nDuplikasi otomatis ditolak. Karena ini input manual, apakah Anda memang ingin memasukkan duplikat?`);
            },
            appendPlanningRequestSafe(payload, options = {}) {
                const manual = options.manual === true;
                const probe = { kode: payload?.sku, sku: payload?.sku, nama: payload?.nama };
                const duplicate = this.findPlanningDuplicate('request', null, probe);
                if (duplicate && !manual) return false;
                this.planningRequests.push(payload);
                this.markPlanningDirty();
                return true;
            },
            deleteAllPlanningRequests() {
                if (!this.planningRequests.length) return;
                if (!confirm(`Hapus SEMUA ${this.planningRequests.length.toLocaleString('id-ID')} data Planning Request?\n\nTindakan ini akan disimpan ke database.`)) return;
                this.planningRequests.splice(0, this.planningRequests.length);
                this.planningRequestPage = 1;
                this.markPlanningDirty(500);
            },
            deleteAllPlanningUsages() {
                if (!this.planningUsages.length) return;
                if (!confirm(`Hapus SEMUA ${this.planningUsages.length.toLocaleString('id-ID')} data Planning Penggunaan?\n\nTindakan ini akan disimpan ke database.`)) return;
                this.planningUsages.splice(0, this.planningUsages.length);
                this.planningUsagePage = 1;
                this.markPlanningDirty(500);
            },
            addPlanningRequest() {
                let maxNo = 0;
                for (const x of (this.planningRequests || [])) maxNo = Math.max(maxNo, Number(x.nomor) || 0);
                const n = maxNo + 1;
                this.planningRequests.push({ id:'PRP-'+Date.now()+'-'+Math.random(), nomor:n, sku:'', nama:'', satuan:'Pcs', stok:0, stokTerpakai:0, bufferStock:0, tanggalPenggunaan:this.getISODateOnly(), gudangPenggunaan:['Sparepart'], penambahanStock:0, hargaSatuan:0, inputMode:'manual' });
                this.planningRequestPage = this.planningRequestPageCount;
                this.markPlanningDirty();
                this.$nextTick(()=>this.refreshIcons());
            },
            applyPlanningMaster(row, resolvedMaster = null) {
                const master = resolvedMaster || this.getPlanningMaster(row.nama, row.sku);
                if (!master) return;
                row.sku = master.kode || master.barcode || master.sku || row.sku;
                row.nama = master.nama;
                row.satuan = master.satuan || 'Pcs';
                row.bufferStock = Number(master.minStock)||0;
                row.hargaSatuan = Number(master.harga)||0;
                row.stok = this.getPlanningStock(row.nama, row.gudangPenggunaan || [], row.stok);
                this.updatePlanningRequestAddition(row);
            },
            togglePlanningWarehouse(row, gudang) {
                const arr = Array.isArray(row.gudangPenggunaan) ? row.gudangPenggunaan.slice() : [];
                const idx = arr.indexOf(gudang);
                if (idx >= 0) arr.splice(idx,1); else arr.push(gudang);
                row.gudangPenggunaan = arr;
                row.stok = this.getPlanningStock(row.nama, arr, row.stok);
                this.updatePlanningRequestAddition(row);
            },
            removePlanningRequest(id) {
                const idx = this.planningRequests.findIndex(x => x.id === id);
                if (idx >= 0) this.planningRequests.splice(idx, 1);
                if (this.planningRequestPage > this.planningRequestPageCount) this.planningRequestPage = this.planningRequestPageCount;
                this.markPlanningDirty(300);
            },
            removePlanningUsage(id) {
                const idx = this.planningUsages.findIndex(x => x.id === id);
                if (idx >= 0) this.planningUsages.splice(idx, 1);
                if (this.planningUsagePage > this.planningUsagePageCount) this.planningUsagePage = this.planningUsagePageCount;
                this.markPlanningDirty(300);
            },
            addPlanningUsage() {
                let maxNo = 0;
                for (const x of (this.planningUsages || [])) maxNo = Math.max(maxNo, Number(x.nomor) || 0);
                const n = maxNo + 1;
                this.planningUsages.push({ id:'PUG-'+Date.now()+'-'+Math.random(), nomor:n, kode:'', nama:'', satuan:'Pcs', stokSparepart:0, stokSisaProject:0, proyek:[{id:'PROJ-'+Date.now()+'-'+Math.random(), nama:'', qty:0}], inputMode:'manual' });
                this.planningUsagePage = this.planningUsagePageCount;
                this.markPlanningDirty();
                this.$nextTick(()=>this.refreshIcons());
            },
            applyPlanningUsageMaster(row, resolvedMaster = null) {
                const master = resolvedMaster || this.getPlanningMaster(row.nama, row.kode);
                if (!master) return;
                row.kode = master.kode || master.barcode || master.sku || row.kode;
                row.nama = master.nama;
                row.satuan = master.satuan || 'Pcs';
                const key = String(row.nama||'').trim().toLowerCase();
                row.stokSparepart = this.planningCacheReady ? Number(this.planningRuntime.stockSparepart.get(key) || 0) : Number(row.stokSparepart || 0);
                row.stokSisaProject = this.planningCacheReady ? Number(this.planningRuntime.stockSisaProject.get(key) || 0) : Number(row.stokSisaProject || 0);
                this.markPlanningDirty();
            },
            addPlanningProject(row) {
                if (!Array.isArray(row.proyek)) row.proyek = [];
                row.proyek.push({id:'PROJ-'+Date.now()+'-'+Math.random(), nama:'', qty:0});
                this.markPlanningDirty();
            },
            removePlanningProject(row, index) {
                if (!Array.isArray(row.proyek) || row.proyek.length<=1) return;
                row.proyek.splice(index,1);
                this.markPlanningDirty(300);
            },
            planningUsageTotal(row) { const projects = Array.isArray(row?.proyek) ? row.proyek : []; return projects.reduce((t,p)=>t+(Number(p?.qty)||0),0); },
            planningUsageRemaining(row) { return (Number(row.stokSparepart)||0)+(Number(row.stokSisaProject)||0)-this.planningUsageTotal(row); },
            planningUsagePurchase(row) { return Math.max(0, -this.planningUsageRemaining(row)); },
            async exportPlanningUsageExcel() {
                if (!this.canEdit) return alert('Akun Viewer tidak dapat export Planning Penggunaan.');
                if (!this.planningUsages.length) return alert('Belum ada data Planning Penggunaan untuk diexport.');
                if (typeof ExcelJS === 'undefined') return alert('Library ExcelJS belum termuat. Silakan reload halaman.');

                const wb = new ExcelJS.Workbook();
                wb.creator = 'Agrofarm Nusa Raya';
                wb.created = new Date();

                const ws = wb.addWorksheet('Planning Penggunaan', {
                    pageSetup: {
                        paperSize: 9,
                        orientation: 'landscape',
                        fitToPage: true,
                        fitToWidth: 1,
                        fitToHeight: 0,
                        margins: { left:.25, right:.25, top:.35, bottom:.35, header:.1, footer:.1 }
                    }
                });
                ws.views = [{ state:'frozen', ySplit:6, showGridLines:false }];

                ws.columns = [
                    {width:7},{width:18},{width:38},{width:20},{width:20},
                    {width:34},{width:14},{width:16},{width:20},{width:14}
                ];

                // Kop laporan + logo, mengikuti format laporan Excel Agrofarm lainnya.
                const logoId = wb.addImage({
                    base64: AGROFARM_EXCEL_LOGO_BASE64,
                    extension: 'png'
                });
                ws.addImage(logoId, {
                    tl:{ col:.2, row:.2 },
                    ext:{ width:145, height:36 }
                });

                ws.mergeCells(1, 3, 1, 10);
                ws.getCell(1,3).value = 'PT AGROFARM NUSA RAYA';
                ws.getCell(1,3).font = { name:'Arial', bold:true, size:14 };
                ws.getCell(1,3).alignment = { horizontal:'center', vertical:'middle' };

                ws.mergeCells(2, 3, 2, 10);
                ws.getCell(2,3).value = 'Jl. Raya Ponorogo-Madiun KM 4 (JL Industri) Kertosari Babadan Ponorogo';
                ws.getCell(2,3).font = { name:'Arial', size:9 };
                ws.getCell(2,3).alignment = { horizontal:'center', vertical:'middle' };

                ws.mergeCells(3, 1, 3, 10);
                ws.getCell(3,1).value = 'LAPORAN PLANNING PENGGUNAAN';
                ws.getCell(3,1).font = { name:'Arial', bold:true, size:13 };
                ws.getCell(3,1).alignment = { horizontal:'center', vertical:'middle' };

                ws.mergeCells(4, 1, 4, 10);
                ws.getCell(4,1).value = `Tanggal Export: ${this.getFormattedDateOnly()} | Total Data: ${this.planningUsages.length}`;
                ws.getCell(4,1).font = { name:'Arial', italic:true, size:9 };
                ws.getCell(4,1).alignment = { horizontal:'center', vertical:'middle' };

                ws.getRow(1).height = 24;
                ws.getRow(2).height = 18;
                ws.getRow(3).height = 22;
                ws.getRow(4).height = 18;

                const border = {
                    top:{style:'thin',color:{argb:'FFB7B7B7'}},
                    left:{style:'thin',color:{argb:'FFB7B7B7'}},
                    bottom:{style:'thin',color:{argb:'FFB7B7B7'}},
                    right:{style:'thin',color:{argb:'FFB7B7B7'}}
                };

                const header = ws.getRow(6);
                [
                    'No',
                    'Kode Barang',
                    'Nama Barang',
                    'Stok Gudang Spare Part',
                    'Stok Gudang Sisa Project',
                    'Estimasi Proyek',
                    'Qty Estimasi',
                    'Sisa Stok',
                    'Jumlah Purchase Request',
                    'Satuan'
                ].forEach((v,i) => header.getCell(i+1).value = v);

                header.font = { name:'Arial', bold:true, color:{argb:'FFFFFFFF'}, size:9 };
                header.alignment = { horizontal:'center', vertical:'middle', wrapText:true };
                header.fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF047857'} };
                header.height = 30;
                header.eachCell(cell => cell.border = border);

                let rowNo = 7;
                for (const r of (this.planningUsages || [])) {
                    const projects = Array.isArray(r?.proyek) && r.proyek.length
                        ? r.proyek
                        : [{ nama:'', qty:0 }];

                    for (const p of projects) {
                        const row = ws.getRow(rowNo++);
                        row.values = [
                            Number(r?.nomor) || rowNo - 7,
                            r?.kode || '',
                            String(r?.nama || '').toUpperCase(),
                            Number(r?.stokSparepart) || 0,
                            Number(r?.stokSisaProject) || 0,
                            String(p?.nama || '').toUpperCase(),
                            Number(p?.qty) || 0,
                            this.planningUsageRemaining(r),
                            this.planningUsagePurchase(r),
                            r?.satuan || ''
                        ];

                        row.font = { name:'Arial', size:9 };
                        row.alignment = { vertical:'middle', wrapText:true };
                        row.eachCell(cell => cell.border = border);
                        row.getCell(1).alignment = { horizontal:'center', vertical:'middle' };
                        row.getCell(4).alignment = { horizontal:'center', vertical:'middle' };
                        row.getCell(5).alignment = { horizontal:'center', vertical:'middle' };
                        row.getCell(7).alignment = { horizontal:'center', vertical:'middle' };
                        row.getCell(8).alignment = { horizontal:'center', vertical:'middle' };
                        row.getCell(9).alignment = { horizontal:'center', vertical:'middle' };
                        row.getCell(10).alignment = { horizontal:'center', vertical:'middle' };
                    }
                }

                const lastRow = Math.max(6, rowNo - 1);
                ws.autoFilter = {
                    from:{ row:6, column:1 },
                    to:{ row:lastRow, column:10 }
                };
                ws.printArea = `A1:J${lastRow}`;

                const buffer = await wb.xlsx.writeBuffer();
                const blob = new Blob(
                    [buffer],
                    { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Laporan_Planning_Penggunaan_Agrofarm_${this.getFormattedDateOnly().replace(/\//g,'-')}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            },
            async exportPlanningExcel() {
                if (!this.canEdit) return alert('Akun Viewer tidak dapat export Planning.');
                if (typeof ExcelJS === 'undefined') return alert('Library ExcelJS belum termuat. Silakan reload halaman.');

                const wb = new ExcelJS.Workbook();
                wb.creator = 'Agrofarm Nusa Raya';
                wb.created = new Date();
                const logoId = wb.addImage({ base64: AGROFARM_EXCEL_LOGO_BASE64, extension: 'png' });

                const setupSheet = (ws, title, columnCount) => {
                    ws.views = [{ state:'frozen', ySplit:6, showGridLines:false }];
                    ws.pageSetup = {
                        paperSize: 9,
                        orientation: columnCount > 9 ? 'landscape' : 'portrait',
                        fitToPage: true, fitToWidth: 1, fitToHeight: 0,
                        margins: { left:.25, right:.25, top:.35, bottom:.35, header:.1, footer:.1 }
                    };
                    ws.addImage(logoId, { tl:{ col:.2, row:.2 }, ext:{ width:145, height:36 } });
                    ws.mergeCells(1, 3, 1, columnCount);
                    ws.getCell(1,3).value = 'PT AGROFARM NUSA RAYA';
                    ws.getCell(1,3).font = { bold:true, size:14 };
                    ws.getCell(1,3).alignment = { horizontal:'center', vertical:'middle' };
                    ws.mergeCells(2, 3, 2, columnCount);
                    ws.getCell(2,3).value = 'Jl. Raya Ponorogo-Madiun KM 4 (JL Industri) Kertosari Babadan Ponorogo';
                    ws.getCell(2,3).font = { size:9 };
                    ws.getCell(2,3).alignment = { horizontal:'center' };
                    ws.mergeCells(3, 1, 3, columnCount);
                    ws.getCell(3,1).value = title;
                    ws.getCell(3,1).font = { bold:true, size:13 };
                    ws.getCell(3,1).alignment = { horizontal:'center' };
                    ws.mergeCells(4, 1, 4, columnCount);
                    ws.getCell(4,1).value = `Tanggal Export: ${this.getFormattedDateOnly()} | Total Data: ${title.includes('REQUEST') ? this.planningRequests.length : this.planningUsages.length}`;
                    ws.getCell(4,1).font = { italic:true, size:9 };
                    ws.getCell(4,1).alignment = { horizontal:'center' };
                    ws.getRow(1).height = 24;
                    ws.getRow(2).height = 18;
                    ws.getRow(3).height = 22;
                    ws.getRow(4).height = 18;
                };

                const styleHeader = row => {
                    row.font = { bold:true, color:{ argb:'FFFFFFFF' }, size:9 };
                    row.alignment = { horizontal:'center', vertical:'middle', wrapText:true };
                    row.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FF047857' } };
                    row.height = 28;
                    row.eachCell(cell => {
                        cell.border = {
                            top:{style:'thin',color:{argb:'FF000000'}},
                            left:{style:'thin',color:{argb:'FF000000'}},
                            bottom:{style:'thin',color:{argb:'FF000000'}},
                            right:{style:'thin',color:{argb:'FF000000'}}
                        };
                    });
                };
                const styleBody = (ws, startRow, endRow, colCount) => {
                    for (let r=startRow; r<=endRow; r++) {
                        const row = ws.getRow(r);
                        row.alignment = { vertical:'middle', wrapText:true };
                        for (let c=1; c<=colCount; c++) {
                            row.getCell(c).border = {
                                top:{style:'thin',color:{argb:'FFB7B7B7'}},
                                left:{style:'thin',color:{argb:'FFB7B7B7'}},
                                bottom:{style:'thin',color:{argb:'FFB7B7B7'}},
                                right:{style:'thin',color:{argb:'FFB7B7B7'}}
                            };
                        }
                    }
                };

                const wsReq = wb.addWorksheet('Planning Request');
                wsReq.columns = [
                    {width:7},{width:18},{width:38},{width:15},{width:14},{width:15},{width:24},{width:24},{width:18},{width:22},{width:18}
                ];
                setupSheet(wsReq, 'LAPORAN PLANNING REQUEST', 11);
                const reqHeader = wsReq.getRow(6);
                ['No','Nomor SKU','Nama Barang','Stok Terpakai','Stok','Buffer Stok','Gudang Penggunaan','Planning Penambahan Stock','Total Stock Setelah Penambahan','Harga Satuan','Harga Total Penambahan'].forEach((v,i)=>reqHeader.getCell(i+1).value=v);
                styleHeader(reqHeader);
                let rr = 7;
                for (const r of (this.planningRequests || [])) {
                    const stock = this.getPlanningStock(r?.nama, r?.gudangPenggunaan || [], r?.stok);
                    const add = Number(r?.penambahanStock)||0;
                    const harga = Number(r?.hargaSatuan)||0;
                    const row = wsReq.getRow(rr++);
                    row.values = [
                        Number(r?.nomor)||rr-7,
                        r?.sku || '',
                        String(r?.nama || '').toUpperCase(),
                        this.getPlanningUsedStock(r),
                        stock,
                        Number(r?.bufferStock)||0,
                        (Array.isArray(r?.gudangPenggunaan) ? r.gudangPenggunaan : []).join(', '),
                        add,
                        stock + add,
                        harga,
                        harga * add
                    ];
                    row.getCell(10).numFmt = '"Rp" #,##0';
                    row.getCell(11).numFmt = '"Rp" #,##0';
                }
                if (rr > 7) styleBody(wsReq, 7, rr-1, 11);
                wsReq.autoFilter = { from:{row:6,column:1}, to:{row:Math.max(6,rr-1),column:11} };

                const wsUse = wb.addWorksheet('Planning Penggunaan');
                wsUse.columns = [
                    {width:7},{width:18},{width:38},{width:19},{width:19},{width:32},
                    {width:14},{width:15},{width:20},{width:14}
                ];
                setupSheet(wsUse, 'LAPORAN PLANNING PENGGUNAAN', 10);
                const useHeader = wsUse.getRow(6);
                ['No','Kode Barang','Nama Barang','Stok Gudang Spare Part','Stok Gudang Sisa Project','Estimasi Proyek','Qty Estimasi','Sisa Stok','Jumlah Purchase Request','Satuan'].forEach((v,i)=>useHeader.getCell(i+1).value=v);
                styleHeader(useHeader);
                let ur = 7;
                for (const r of (this.planningUsages || [])) {
                    const projects = Array.isArray(r?.proyek) && r.proyek.length ? r.proyek : [{nama:'',qty:0}];
                    for (const p of projects) {
                        const row = wsUse.getRow(ur++);
                        row.values = [
                            Number(r?.nomor)||ur-7,
                            r?.kode || '',
                            String(r?.nama || '').toUpperCase(),
                            Number(r?.stokSparepart)||0,
                            Number(r?.stokSisaProject)||0,
                            String(p?.nama || '').toUpperCase(),
                            Number(p?.qty)||0,
                            this.planningUsageRemaining(r),
                            this.planningUsagePurchase(r),
                            r?.satuan || ''
                        ];
                    }
                }
                if (ur > 7) styleBody(wsUse, 7, ur-1, 10);
                wsUse.autoFilter = { from:{row:6,column:1}, to:{row:Math.max(6,ur-1),column:10} };

                const buffer = await wb.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Planning_Agrofarm_${this.getFormattedDateOnly().replace(/\//g,'-')}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            },
            printBeritaAcara(op) {
                if (!this.canPrint) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat mencetak.');
                if (!op) return;
                const labelArea = document.getElementById('label-print-area');
                const chunkSize = 18;
                const chunks = [];
                for (let i = 0; i < op.items.length; i += chunkSize) chunks.push(op.items.slice(i, i + chunkSize));
                if (!chunks.length) chunks.push([]);
                const pages = chunks.map((items, pageIndex) => {
                    const detailRows = items.map((it, j) => `<tr><td style="border:1px solid #000;padding:4px;text-align:center;">${pageIndex * chunkSize + j + 1}</td><td style="border:1px solid #000;padding:4px;text-align:center;">${it.lokasi || '-'}</td><td style="border:1px solid #000;padding:4px;">${it.nama || '-'}</td><td style="border:1px solid #000;padding:4px;text-align:center;">${it.satuan || this.getMasterSatuan(it.nama) || ''}</td><td style="border:1px solid #000;padding:4px;text-align:center;">${Number(it.qtySystem || 0).toLocaleString('id-ID')}</td><td style="border:1px solid #000;padding:4px;text-align:center;">${Number(it.qtyFisik || 0).toLocaleString('id-ID')}</td><td style="border:1px solid #000;padding:4px;text-align:center;">${it.selisih > 0 ? '+' : ''}${it.selisih}</td><td style="border:1px solid #000;padding:4px;">${it.catatan || '-'}</td></tr>`).join('');
                    return `<div class="opname-print-page" style="font-family:Arial,sans-serif;color:#000;padding:8mm;box-sizing:border-box;min-height:277mm;position:relative;page-break-after:${pageIndex < chunks.length - 1 ? 'always' : 'auto'};">
                        <div style="display:flex;align-items:center;gap:14px;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:14px;">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg04Fvw4tFQIaOv_YisutC8tIMsbS2eM10wP2eWOotwA&s=10" style="height:35mm;width:35mm;object-fit:contain;">
                            <div style="flex:1;text-align:center;"><div style="font-size:16pt;font-weight:800;letter-spacing:1px;">BERITA ACARA STOCK OPNAME</div><div style="font-size:10pt;margin-top:2px;">AGROFARM NUSA RAYA &mdash; SISTEM INVENTORY</div></div>
                        </div>
                        <table style="width:100%;font-size:9pt;margin-bottom:10px;"><tr><td style="width:100px;font-weight:700;">No. Dokumen</td><td>: ${op.nomor}</td><td style="width:90px;font-weight:700;">Tanggal</td><td>: ${op.tgl}</td></tr><tr><td style="font-weight:700;">Gudang</td><td>: ${op.gudang}</td><td style="font-weight:700;">Petugas</td><td>: ${op.petugas}</td></tr></table>
                        <table style="width:100%;border-collapse:collapse;font-size:8.5pt;"><thead><tr style="background:#e5e7eb;"><th style="border:1px solid #000;padding:5px;">No</th><th style="border:1px solid #000;padding:5px;">Rak/Lokasi</th><th style="border:1px solid #000;padding:5px;">Nama Barang</th><th style="border:1px solid #000;padding:5px;">Satuan</th><th style="border:1px solid #000;padding:5px;">Qty Sistem</th><th style="border:1px solid #000;padding:5px;">Qty Fisik</th><th style="border:1px solid #000;padding:5px;">Selisih</th><th style="border:1px solid #000;padding:5px;">Catatan</th></tr></thead><tbody>${detailRows}</tbody></table>
                        <div style="position:absolute;left:8mm;right:8mm;bottom:8mm;display:flex;justify-content:space-around;font-size:9pt;">
                            <div style="text-align:center;width:150px;">Dibuat<br><br><br>____________________</div>
                            <div style="text-align:center;width:150px;">Disetujui<br><br><br>____________________</div>
                            <div style="text-align:center;width:150px;">Diketahui<br><br><br>____________________</div>
                        </div>
                    </div>`;
                }).join('');
                labelArea.innerHTML = `<style>@page{size:A4 landscape;margin:20mm;}@media print{.opname-print-page{page-break-after:always!important;break-after:page;} .opname-print-page:last-child{page-break-after:auto!important;}}
/* Split-screen responsive: hide sidebar when window is narrow */
@media screen and (min-width: 1101px) {
  #app > aside.agrofarm-sidebar {
    display:flex !important;
    position:fixed !important;
    left:0 !important; top:0 !important; bottom:0 !important;
    width:288px !important; min-width:288px !important; max-width:288px !important;
    height:100vh !important;
    z-index:10000 !important;
  }
  #app > main {
    margin-left:288px !important;
    width:calc(100% - 288px) !important;
    max-width:calc(100% - 288px) !important;
    min-width:0 !important;
  }
}
@media screen and (max-width:1100px) {
  #app > aside.agrofarm-sidebar { display:none !important; }
  #app > main {
    display:block !important;
    margin-left:0 !important;
    width:100% !important;
    max-width:100% !important;
    min-width:0 !important;
    padding:18px !important;
  }
  #app { display:block !important; width:100% !important; min-width:0 !important; }
}
@media screen and (max-width:700px) {
  #app > main { padding:12px !important; }
}


/* PDF / CETAK KESELURUHAN - margin agar konten tidak terpotong */
@page {
    size: A4 landscape;
    margin: 20mm;
}

@media print {
    html, body {
        width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
    }

    #app, #app > main {
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
    }

    table {
        max-width: 100% !important;
        width: 100% !important;
        table-layout: auto !important;
        page-break-inside: auto !important;
    }

    thead { display: table-header-group !important; }
    tr { page-break-inside: avoid !important; break-inside: avoid !important; }
    img, svg { max-width: 100% !important; }
}



/* =========================================================
   FINAL PRINT FIX — ALL PRINT TYPES
   - Kartu Stock is explicitly printable.
   - Print titles are centered.
   - Keep margins so content is not clipped.
   ========================================================= */
@media print {
    @page { size: A4 landscape; margin: 20mm; }

    html, body {
        width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
    }

    #app > main {
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        padding: 0 !important;
    }

    /* Kartu Stock / Stock report print container */
    body.printing-label #label-print-area {
        display: block !important;
        visibility: visible !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
    }

    body.printing-label .stock-card-print,
    body.printing-label .stock-print-document {
        display: block !important;
        visibility: visible !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    body.printing-label .stock-card-title,
    body.printing-label .stock-print-title,
    body.printing-label .stock-print-subtitle,
    body.printing-label .stock-print-warehouse {
        text-align: center !important;
    }

    body.printing-label .stock-card-heading {
        text-align: center !important;
    }

    body.printing-label .stock-card-heading > div {
        text-align: center !important;
    }

    body.printing-label .stock-print-header {
        align-items: center !important;
    }

    body.printing-label .stock-print-header > div:nth-child(2) {
        text-align: center !important;
        flex: 1 1 auto !important;
    }

    body.printing-label table {
        max-width: 100% !important;
    }

    /* Semua judul pada area print biasa */
    .temporary-print-logo-header,
    .temporary-print-logo-header * {
        text-align: center !important;
    }

    .temporary-print-logo-header > div:first-child > div:first-child {
        text-align: center !important;
    }

    table {
        max-width: 100% !important;
    }

    thead { display: table-header-group !important; }
    tr { break-inside: avoid !important; page-break-inside: avoid !important; }
    img { max-width: 100% !important; }
}

</style>${pages}`;
                document.body.classList.add('printing-label');
                this.$nextTick(() => { window.print(); document.body.classList.remove('printing-label'); labelArea.innerHTML = ''; });
            },
            exportOpnameHistoryExcel(op) {
                if (!this.canEdit) return alert('Akun Viewer hanya dapat melihat data dan tidak dapat export Excel.');
                if (!op) return;
                const rows = op.items.map((it, i) => ({
                    No: i + 1,
                    'Nama Barang': it.nama,
                    Satuan: it.satuan,
                    Lokasi: it.lokasi,
                    'Qty Sistem': it.qtySystem,
                    'Qty Fisik': it.qtyFisik,
                    Selisih: it.selisih,
                    Catatan: it.catatan || ''
                }));
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Detail Opname');
                XLSX.writeFile(wb, `${op.nomor.replace(/\//g,'_')}_${op.gudang.replace(/\s+/g,'_')}.xlsx`);
            }
        }
    };

    export function configureErrorHandler(app: any) {
        app.config.errorHandler = (err: any, instance: any, info: any) => {
        console.error('[Inventory Vue Error]', info, err);
        try {
            if (instance && Object.prototype.hasOwnProperty.call(instance, 'planningError')) {
                instance.planningError = 'Sebagian data Planning tidak dapat dirender. Sistem menahan error agar aplikasi tetap berjalan. Silakan cek Console untuk detail teknis.';
                instance.planningViewReady = true;
            }
        } catch (_) {}
        };
    }
</script>

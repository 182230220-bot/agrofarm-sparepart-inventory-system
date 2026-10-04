<template>
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
            <button @click="$emit('update:activeTab', 'dashboard')" :class="activeTab === 'dashboard' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center gap-3 text-xs transition-all">
                <i data-lucide="layout-dashboard" class="w-4 h-4 text-emerald-400"></i> Dashboard Utama
            </button>
            <button @click="$emit('update:activeTab', 'master_db')" :class="activeTab === 'master_db' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                <div class="flex items-center gap-3">
                    <i data-lucide="database" class="w-4 h-4 text-emerald-400"></i>
                    <span>Data Master</span>
                </div>
                <span class="bg-emerald-900/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 font-mono">{{ masterCount }}</span>
            </button>
            <button @click="$emit('update:activeTab', 'monitoring')" :class="activeTab === 'monitoring' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                <div class="flex items-center gap-3">
                    <i data-lucide="clipboard-list" class="w-4 h-4 text-emerald-400"></i>
                    <span>Purchase Request</span>
                </div>
                <span class="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">{{ purchasePendingCount }}</span>
            </button>
            <!-- GROUP PLANNING: berdiri sendiri, tidak masuk Purchase Request -->
            <div v-if="canPlanning" class="mt-7 pt-4 border-t-2 border-emerald-800/70">
                <p class="text-[10px] font-black uppercase tracking-wider text-cyan-300 px-3 mb-2">Planning</p>
                <button @click="$emit('open-planning', 'planning_request')" :class="activeTab === 'planning_request' ? 'bg-cyan-700/30 text-white shadow-md font-bold border border-cyan-500/30' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                    <div class="flex items-center gap-3"><i data-lucide="clipboard-plus" class="w-4 h-4 text-cyan-300"></i><span>Planning Request</span></div>
                    <span class="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">{{ planningRequestNotificationCount }}</span>
                </button>
                <button @click="$emit('open-planning', 'planning_usage')" :class="activeTab === 'planning_usage' ? 'bg-cyan-700/30 text-white shadow-md font-bold border border-cyan-500/30' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                    <div class="flex items-center gap-3"><i data-lucide="calendar-clock" class="w-4 h-4 text-cyan-300"></i><span>Planning Penggunaan</span></div>
                    <span class="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">{{ planningUsageNotificationCount }}</span>
                </button>
            </div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 px-3 mt-6 mb-2">Stock Opname</p>
            <button v-if="canEdit" @click="$emit('update:activeTab', 'opname')" :class="activeTab === 'opname' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                <div class="flex items-center gap-3">
                    <i data-lucide="clipboard-check" class="w-4 h-4 text-emerald-400"></i>
                    <span>Input Stock Opname</span>
                </div>
                <span v-if="opnameDraftSelisihCount > 0" class="bg-red-500/20 text-red-300 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30 font-mono">{{ opnameDraftSelisihCount }} Selisih</span>
            </button>
            <button @click="$emit('update:activeTab', 'opname_history')" :class="activeTab === 'opname_history' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                <div class="flex items-center gap-3">
                    <i data-lucide="history" class="w-4 h-4 text-emerald-400"></i>
                    <span>Riwayat Opname</span>
                </div>
                <span class="bg-emerald-900/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 font-mono">{{ opnameHistoryCount }}</span>
            </button>
            <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 px-3 mt-6 mb-2">Manajemen Gudang</p>
            <button @click="$emit('update:activeTab', 'sparepart')" :class="activeTab === 'sparepart' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                <div class="flex items-center gap-3">
                    <i data-lucide="wrench" class="w-4 h-4 text-emerald-400"></i>
                    <span>Gudang Spare Part</span>
                </div>
                <span class="bg-emerald-900/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 font-mono">{{ totalSparepartQty }}</span>
            </button>
            <button @click="$emit('update:activeTab', 'barcode_scan'); $emit('focus-barcode')" :class="activeTab === 'barcode_scan' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                <span class="flex items-center gap-3"><i data-lucide="scan-barcode" class="w-4 h-4"></i> Scan Barcode</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>
            <button @click="$emit('update:activeTab', 'sisa_project')" :class="activeTab === 'sisa_project' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                <div class="flex items-center gap-3">
                    <i data-lucide="boxes" class="w-4 h-4 text-emerald-400"></i>
                    <span>Gudang Sisa Project</span>
                </div>
                <span class="bg-emerald-900/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 font-mono">{{ totalSisaProjectQty }}</span>
            </button>
            <button v-if="canApprove" @click="$emit('update:activeTab', 'approval')" :class="activeTab === 'approval' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all">
                <div class="flex items-center gap-3">
                    <i data-lucide="badge-check" class="w-4 h-4 text-emerald-400"></i>
                    <span>Approval Transaksi</span>
                </div>
                <span class="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">{{ pendingApprovalCount }}</span>
            </button>
            <button v-if="canManageAccounts" @click="$emit('update:activeTab', 'settings'); $emit('open-settings')" :class="activeTab === 'settings' ? 'bg-emerald-800 text-white shadow-md font-bold' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium'" class="w-full px-3.5 py-3 rounded-xl flex items-center gap-3 text-xs transition-all">
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
                    <p class="text-[10px] text-white font-semibold truncate">{{ authEmail || '-' }}</p>
                    <p class="text-[9px] text-emerald-300 mt-0.5">{{ roleLabel }}</p>
                </div>
                <button @click="$emit('logout')" class="text-[9px] text-rose-300 hover:text-white font-bold">Keluar</button>
            </div>
        </div>
    </div>
    <!-- QUICK ACTIONS -->
    <div class="agrofarm-sidebar-footer p-4 border-t border-emerald-800/60 space-y-2 bg-emerald-950/95">
        <button v-if="canEdit" @click="$emit('export-excel')" class="w-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 px-3 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 border border-emerald-700/50 transition-all">
            <i data-lucide="file-spreadsheet" class="w-4 h-4 text-emerald-400"></i>
            <span>Export Laporan Excel</span>
        </button>
    </div>
</aside>
</template>

<script lang="ts">
export default {
    props: {
        isAuthenticated: { type: Boolean, default: false },
        activeTab: { type: String, default: 'dashboard' },
        masterCount: { type: Number, default: 0 },
        purchasePendingCount: { type: Number, default: 0 },
        canPlanning: { type: Boolean, default: false },
        planningRequestNotificationCount: { type: Number, default: 0 },
        planningUsageNotificationCount: { type: Number, default: 0 },
        canEdit: { type: Boolean, default: false },
        opnameDraftSelisihCount: { type: Number, default: 0 },
        opnameHistoryCount: { type: Number, default: 0 },
        totalSparepartQty: { type: Number, default: 0 },
        totalSisaProjectQty: { type: Number, default: 0 },
        canApprove: { type: Boolean, default: false },
        pendingApprovalCount: { type: Number, default: 0 },
        canManageAccounts: { type: Boolean, default: false },
        authEmail: { type: String, default: '' },
        roleLabel: { type: String, default: '' },
    },
    emits: ['update:activeTab', 'open-planning', 'focus-barcode', 'open-settings', 'logout', 'export-excel'],
};
</script>

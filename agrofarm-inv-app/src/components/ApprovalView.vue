<template>
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
                    <button @click="$emit('update:approval-warehouse-tab', 'Sparepart'); $emit('update:approval-movement-tab', 'IN'); $emit('update:approval-status-filter', 'all')" :class="approvalWarehouseTab === 'Sparepart' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Gudang Spare Part</button>
                    <button @click="$emit('update:approval-warehouse-tab', 'Sisa Project'); $emit('update:approval-movement-tab', 'IN'); $emit('update:approval-status-filter', 'all')" :class="approvalWarehouseTab === 'Sisa Project' ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Gudang Sisa Project</button>
                    <button @click="$emit('update:approval-warehouse-tab', 'Stock Opname'); $emit('update:approval-status-filter', 'all')" :class="approvalWarehouseTab === 'Stock Opname' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Stock Opname</button>
                    <button @click="$emit('update:approval-warehouse-tab', 'Data Master'); $emit('update:approval-status-filter', 'all')" :class="approvalWarehouseTab === 'Data Master' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Data Master ({{ pendingMasterApprovalRequests.length }})</button>
                </div>

                <div v-if="approvalWarehouseTab !== 'Stock Opname'" class="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-2">
                    <button @click="$emit('update:approval-movement-tab', 'IN'); $emit('update:approval-status-filter', 'all')" :class="approvalMovementTab === 'IN' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Inbound ({{ approvalWarehouseTab === 'Sparepart' ? approvalSparepartInLogs.length : approvalSisaProjectInLogs.length }})</button>
                    <button @click="$emit('update:approval-movement-tab', 'OUT'); $emit('update:approval-status-filter', 'all')" :class="approvalMovementTab === 'OUT' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200'" class="px-4 py-2 rounded-lg border text-xs font-black">Outbound ({{ approvalWarehouseTab === 'Sparepart' ? approvalSparepartOutLogs.length : approvalSisaProjectOutLogs.length }})</button>
                </div>

                <div v-if="approvalWarehouseTab !== 'Stock Opname'" class="p-4 border-b border-slate-100 bg-white">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button type="button" @click="$emit('update:approval-status-filter', 'pending')" :class="approvalStatusFilter === 'pending' ? 'ring-2 ring-amber-300 shadow-md' : 'hover:shadow-sm'" class="text-left rounded-xl bg-amber-50 border border-amber-200 p-4 transition-all cursor-pointer">
                            <p class="text-[10px] font-black text-amber-700 uppercase">Belum Disetujui</p>
                            <p class="text-2xl font-black text-amber-700">{{ approvalWarehousePendingCount }}</p>
                            <p class="text-[10px] text-slate-500 mt-1">Klik untuk menampilkan approval yang belum disetujui · {{ approvalWarehouseTab }}</p>
                        </button>
                        <button type="button" @click="$emit('update:approval-status-filter', 'approved')" :class="approvalStatusFilter === 'approved' ? 'ring-2 ring-emerald-300 shadow-md' : 'hover:shadow-sm'" class="text-left rounded-xl bg-emerald-50 border border-emerald-200 p-4 transition-all cursor-pointer">
                            <p class="text-[10px] font-black text-emerald-700 uppercase">Sudah Disetujui</p>
                            <p class="text-2xl font-black text-emerald-700">{{ approvalWarehouseApprovedCount }}</p>
                            <p class="text-[10px] text-slate-500 mt-1">Klik untuk menampilkan approval yang sudah disetujui · {{ approvalWarehouseTab }}</p>
                        </button>
                    </div>
                    <div v-if="approvalStatusFilter !== 'all'" class="mt-3 flex items-center justify-between gap-2">
                        <span class="text-[10px] text-slate-500">Filter aktif: <b>{{ approvalStatusFilter === 'pending' ? 'Belum Disetujui' : 'Sudah Disetujui' }}</b></span>
                        <button type="button" @click="$emit('update:approval-status-filter', 'all')" class="text-[10px] font-black text-slate-600 underline hover:text-slate-900">Tampilkan Semua</button>
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
                        <button type="button" @click="$emit('update:approval-page', Math.max(1, approvalPage - 1))" :disabled="approvalPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Sebelumnya</button>
                        <span class="px-2 text-[10px] font-black text-slate-600">Halaman {{ Math.min(approvalPage, Math.ceil(approvalVisibleLogs.length / 20)) }} / {{ Math.ceil(approvalVisibleLogs.length / 20) }}</span>
                        <button type="button" @click="$emit('update:approval-page', Math.min(Math.ceil(approvalVisibleLogs.length / 20), approvalPage + 1))" :disabled="approvalPage >= Math.ceil(approvalVisibleLogs.length / 20)" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Berikutnya</button>
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
                                <button type="button" @click="$emit('update:approval-page', Math.max(1, approvalPage - 1))" :disabled="approvalPage <= 1" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Sebelumnya</button>
                                <span class="px-2 text-[10px] font-black text-slate-600">Halaman {{ Math.min(approvalPage, Math.ceil(opnameHistory.length / 20)) }} / {{ Math.ceil(opnameHistory.length / 20) }}</span>
                                <button type="button" @click="$emit('update:approval-page', Math.min(Math.ceil(opnameHistory.length / 20), approvalPage + 1))" :disabled="approvalPage >= Math.ceil(opnameHistory.length / 20)" class="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">Berikutnya</button>
                            </div>
                        </div>
                        <div v-if="opnameHistory.length === 0" class="p-8 text-center text-slate-400 text-xs">Belum ada stock opname.</div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
export default {
    props: {
        activeTab: { default: null },
        allTransactionLogs: { type: Array, default: () => [] },
        approvalMovementTab: { default: null },
        approvalPage: { default: null },
        approvalSisaProjectInLogs: { type: Array, default: () => [] },
        approvalSisaProjectOutLogs: { type: Array, default: () => [] },
        approvalSparepartInLogs: { type: Array, default: () => [] },
        approvalSparepartOutLogs: { type: Array, default: () => [] },
        approvalStatusFilter: { default: null },
        approvalVisibleLogs: { type: Array, default: () => [] },
        approvalWarehouseApprovedCount: { default: null },
        approvalWarehousePendingCount: { default: null },
        approvalWarehouseTab: { default: null },
        approvedApprovalLogs: { type: Array, default: () => [] },
        approvedApprovalOpname: { type: Array, default: () => [] },
        approvedMasterApprovalRequests: { type: Array, default: () => [] },
        canApprove: { default: null },
        isPendingLog: { default: null },
        masterApprovalRequests: { type: Array, default: () => [] },
        opnameHistory: { type: Array, default: () => [] },
        pendingApprovalLogs: { type: Array, default: () => [] },
        pendingApprovalOpname: { type: Array, default: () => [] },
        pendingMasterApprovalRequests: { type: Array, default: () => [] },
        approveMasterEdit: { type: Function, required: true },
        approveOpname: { type: Function, required: true },
        approveTransaction: { type: Function, required: true },
        getLogDisplayQty: { type: Function, required: true },
        unapproveOpname: { type: Function, required: true },
        unapproveTransaction: { type: Function, required: true },
    },
    emits: ['update:approval-page'],
};
</script>

<template>
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
                            <button type="button" @click="$emit('update:show-new-account-password', !showNewAccountPassword)" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700" :title="showNewAccountPassword ? 'Sembunyikan password' : 'Tampilkan password'">
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
                <button type="button" @click="$emit('update:show-changed-password', !showChangedPassword)" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700" :title="showChangedPassword ? 'Sembunyikan password' : 'Tampilkan password'">
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

</template>

<script lang="ts">
export default {
    props: {
        accountError: { default: null },
        accountMessage: { default: null },
        activeTab: { default: null },
        authLoading: { default: null },
        authUser: { default: null },
        canManageAccounts: { default: null },
        newAccount: { default: null },
        passwordChange: { default: null },
        passwordChangeSaving: { default: null },
        securitySettings: { default: null },
        securitySettingsMessage: { default: null },
        securitySettingsSaving: { default: null },
        showChangedPassword: { default: null },
        showNewAccountPassword: { default: null },
        showPasswordChangeModal: { default: null },
        userAccounts: { type: Array, default: () => [] },
        changeUserPassword: { type: Function, required: true },
        closePasswordChange: { type: Function, required: true },
        createUserAccount: { type: Function, required: true },
        loadUserAccounts: { type: Function, required: true },
        openPasswordChange: { type: Function, required: true },
        saveAccountSettings: { type: Function, required: true },
        saveSecuritySettings: { type: Function, required: true },
        toggleAccountActive: { type: Function, required: true },
    },
    emits: ['update:show-changed-password', 'update:show-new-account-password'],
};
</script>

<template>
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
        canManageAccounts: { default: null },
        passwordChange: { default: null },
        passwordChangeSaving: { default: null },
        showChangedPassword: { default: null },
        showPasswordChangeModal: { default: null },
        changeUserPassword: { type: Function, required: true },
        closePasswordChange: { type: Function, required: true },
    },
    emits: ['update:show-changed-password'],
};
</script>

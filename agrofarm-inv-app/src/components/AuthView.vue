<template>
<div v-if="!authReady || !isAuthenticated" class="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div class="text-center mb-6">
            <div class="w-14 h-14 mx-auto bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-3">
                <i data-lucide="sprout" class="w-7 h-7"></i>
            </div>
            <h2 class="font-black text-slate-800 text-lg uppercase">Agrofarm Nusa Raya</h2>
            <p class="text-xs text-slate-500 mt-1">Sistem Inventory Spare Part</p>
        </div>
        <div v-if="!authReady" class="text-center py-6 text-sm text-slate-500">Memeriksa sesi...</div>
        <form v-else @submit.prevent="$emit('login')" class="space-y-4">
            <div>
                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Email</label>
                <input v-model="loginForm.email" type="email" required autocomplete="username" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500">
            </div>
            <div>
                <label class="text-[10px] font-bold text-slate-600 uppercase block mb-1">Password</label>
                <input v-model="loginForm.password" type="password" required autocomplete="current-password" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500">
            </div>
            <button type="submit" :disabled="authLoading" class="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm">
                {{ authLoading ? 'Memproses...' : 'Masuk' }}
            </button>
            <p v-if="authError" class="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{{ authError }}</p>
        </form>
    </div>
</div>
</template>

<script lang="ts">
export default {
    props: {
        authReady: { type: Boolean, default: false },
        isAuthenticated: { type: Boolean, default: false },
        loginForm: { type: Object, required: true },
        authLoading: { type: Boolean, default: false },
        authError: { type: String, default: '' },
    },
    emits: ['login'],
};
</script>

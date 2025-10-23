<template>
    <button type="button" class="btn btn-danger shadow-none" title="Logout" @click="logout">
        <i class="bi bi-power me-1"></i> Logout
    </button>
</template>

<script setup lang="js">
import { useAuthStore } from "@/stores/auth.js"

const store = useAuthStore();
const logout = () => {
    store.purgeAuth();
}
</script>

<style scoped>
.btn-danger {
    background: #e74c3c !important;
    border: none !important;
    color: white !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    padding: 8px 16px !important;
}

.btn-danger:hover {
    background: #c0392b !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.2) !important;
}
</style>
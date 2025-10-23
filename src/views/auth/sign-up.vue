<template>
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-header">
                <h1>Library management system</h1>
                <p>Create new account</p>
            </div>
            <VForm class="auth-form" id="kt_login_signin_form" @submit="signUp" :validation-schema="SIGNUP">
                <div class="auth-inputs">
                    <div class="fv-row">
                        <div class="d-flex flex-stack">
                            <label class="form-label fw-bold fs-6 m-0">Your Name</label>
                        </div>
                        <Field class="form-control form-control-solid" type="text" name="name" tabindex="1" placeholder="Ex: John"/>
                        <div class="fv-plugins-message-container">
                            <div class="fv-help-block text-danger">
                                <ErrorMessage name="name" />
                            </div>
                        </div>
                    </div>
                    <div class="fv-row">
                        <div class="d-flex flex-stack">
                            <label class="form-label fw-bold fs-6 m-0">E-mail</label>
                        </div>
                        <Field class="form-control form-control-solid" type="email" name="email" tabindex="2" placeholder="example@email.com"/>
                        <div class="fv-plugins-message-container">
                            <div class="fv-help-block text-danger">
                                <ErrorMessage name="email" />
                            </div>
                        </div>
                    </div>
                    <div class="fv-row">
                        <div class="d-flex flex-stack">
                            <label class="form-label fw-bold fs-6 m-0">Password</label>
                        </div>

                        <Field class="form-control form-control-solid" type="password" name="password" tabindex="3" placeholder="******"/>
                        <div class="fv-plugins-message-container">
                            <div class="fv-help-block text-danger">
                                <ErrorMessage name="password" />
                            </div>
                        </div>
                    </div>
                    <div class="fv-row">
                        <div class="d-flex flex-stack">
                            <label class="form-label fw-bold fs-6 m-0">Confirm Password</label>
                        </div>

                        <Field class="form-control form-control-solid" type="password" name="password_confirm" tabindex="4" placeholder="*******"/>
                        <div class="fv-plugins-message-container">
                            <div class="fv-help-block text-danger">
                                <ErrorMessage name="password_confirm" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="auth-actions">
                    <button type="button" class="btn btn-secondary" disabled v-if="awaitRequest">
                        <div class="spinner-border" style="width: 2rem; height: 2rem; border-width: 2px;" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
                    <button type="submit" class="btn btn-primary" v-else>Create account</button>
                    <RouterLink :to="{ name: ROUTE_SIGNIN }" class="btn btn-secondary">Sign In</RouterLink>
                </div>
            </VForm>
            <div class="auth-footer">
                <p>&copy;  Library Management System - All Rights Reserved</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { ROUTE_SIGNIN, ROUTE_DASHBOARD } from "@/router/index.js";
import { SIGNUP } from "@/helpers/schemas";
import { useAuthStore } from "@/stores/auth.js";
import ToastHelper from '@/config/ToastHelper';

const router = useRouter();
const store = useAuthStore();
const awaitRequest = ref(false);

const signUp = async (values) => {
    awaitRequest.value = true;

    await store.signUp(values);
    const { error, user } = store;

    awaitRequest.value = false;
    if (error.length > 0) {
        ToastHelper.error(error[0]);
        return;
    }

    ToastHelper.success(`Welcome Sr(a). ${user.data.name}`);
    localStorage.setItem('userName', user.data.name);
    router.push({ name: ROUTE_DASHBOARD });
};
</script>

<style scoped>
.auth-page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f7;
    padding: 20px;
}

.auth-card {
    width: 100%;
    max-width: 420px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.auth-header {
    padding: 30px 30px 15px;
    text-align: center;
}

.auth-header h1 {
    margin: 0 0 10px;
    color: #2c3e50;
    font-size: 24px;
    font-weight: 700;
}

.auth-header p {
    margin: 0;
    color: #7f8c8d;
    font-size: 14px;
}

.auth-form {
    padding: 0 30px 30px;
}

.auth-inputs {
    gap: 18px;
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
}

.fv-row {
    margin-bottom: 0 !important;
}

.form-control {
    height: 35px !important;
    border-radius: 8px !important;
    border: 1px solid #ddd !important;
    padding: 0 15px !important;
    transition: all 0.3s ease !important;
}

.form-control:focus {
    border-color: #3498db !important;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1) !important;
    outline: none !important;
}

.form-label {
    color: #34495e !important;
    margin-bottom: 8px !important;
    display: block !important;
}

.auth-actions {
    display: flex;
    gap: 10px;
}

.btn {
    flex: 1;
    border-radius: 8px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
}

.btn-primary {
    background: #3498db !important;
    border: none !important;
    color: white !important;
}

.btn-primary:hover {
    background: #2980b9 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.2) !important;
}

.btn-secondary {
    background: #ecf0f1 !important;
    border: none !important;
    color: #34495e !important;
}

.btn-secondary:hover {
    background: #dcdde1 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.auth-footer {
    padding: 20px 30px;
    text-align: center;
    border-top: 1px solid #f1f1f1;
}

.auth-footer p {
    margin: 0;
    color: #95a5a6;
    font-size: 12px;
}

.fv-help-block {
    margin-top: 5px !important;
    font-size: 13px !important;
}
</style>
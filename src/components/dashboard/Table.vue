<template>
    <div class="dashboard-table-container">
        <createModal @item-added="handleItemAdded" />
        <nav class="navbar">
            <input type="text" class="form-control input-search" placeholder="Search" v-model="search" @keypress.enter="searchItem">
            <button type="button" class="btn btn-secondary" style="padding: 5px 15px !important;" disabled v-if="awaitRequest">
                <div class="spinner-border" style="width: 1rem; height: 1rem; border-width: 2px;" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </button>
            <i class="bi bi-search btn btn-outline-primary shadow-none" @click="searchItem" v-else></i>
            <i class="bi bi-plus-lg btn btn-outline-success shadow-none" data-bs-toggle="modal" data-bs-target="#newModal"></i>
        </nav>
        <div class="table-list" v-on:scroll="onScroll">
            <table class="table m-0">
                <thead>
                    <tr>
                        <th scope="col" :class="headerClass + ' ' + item.class" v-for="item in tableHeader" v-text="item.text">
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="awaitRequest">
                        <td colspan="5" rowspan="5">
                            <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-else-if="items.length === 0">
                        <td colspan="5" rowspan="5">
                            {{ oldItems.length > 0 
                                ? "No results found 🔍"
                                : "You don't have Books yet... ⛳"
                            }}
                        </td>
                    </tr>
                    <tr v-for="(item, index) in items" :key="index">
                        <td class="fw-bold">{{ index + 1 }}</td>
                        <td>{{ item.title }}</td>
                        <td>{{ item.description  }}</td>
                        <td>{{ convertDate(item.createdAt) }}</td>
                        <!-- <td>
                            <i class="bi bi-eye btn btn-dark d-flex flex-column shadow-none" data-bs-toggle="modal" data-bs-target="#detailModal" @click="setModalData(item)"></i>
                        </td> -->
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!-- <button @click="add" class="btn btn-primary">add</button> -->
</template>

<script setup lang="js">
import { useDashboardStore } from "@/stores/dashboard.js"
import { convertDate } from '@/helpers/utils.js'
import createModal from "@/components/Modals/createModal.vue"
import ToastHelper from "@/config/ToastHelper.js"
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    updateDoc,
    deleteDoc,
    addDoc
} from 'firebase/firestore'
import firebase from '@/config/services/firebase.js'
import { ref, onMounted, watch } from 'vue'

const store = useDashboardStore();

//data
const items = ref([]);
const oldItems = ref([]);
const tableHeader = [
    { text: '#', class: 'fw-bold' },
    { text: 'Title', class: '' },
    { text: 'Description ', class: '' },
    { text: 'Created At', class: '' },
    // { text: 'Action', class: '' },
];
const headerClass = ref('');
const forModal = ref({});
const awaitRequest = ref(false);
const search = ref('');

// methods
async function add() {
    let data = {
        title: 'New Note',
        description: 'This is a new note',
        createdAt: new Date(),
        userId: 1
    };

    await addDoc(collection(firebase, 'abc'), data);
}

function onScroll(event) {
    if (event.target.scrollTop > 0) {
        headerClass.value = 'sticky-scroll';
        return;
    }
    headerClass.value = '';
}

async function getAll() {
    awaitRequest.value = true;
    await store.getAll();
    let { error, list } = store;

    awaitRequest.value = false;
    if (error.length > 0) {
        ToastHelper.error(error[0]);
        return;
    }

    items.value = list;
    oldItems.value = list;
}

function setModalData(data) {
    forModal.value = data;
}

function searchItem() {
    if (search.value == '') {
        items.value = oldItems.value;
        return;
    }

    let searchText = search.value.toLowerCase();
    items.value = oldItems.value.filter(
        ({ title }) => title.toLowerCase().includes(searchText)
    );
}

// life cycle
onMounted(async () => {
    await getAll();
    oldItems.value = items.value;
});

// watch
watch(search, () => {
    searchItem();
});

// event
async function handleItemAdded() {
    await getAll();
};
</script>

<style scoped>
.dashboard-table-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
    width: 80%;
    margin: 0 auto;
}

.navbar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
}

.input-search {
    flex: 1;
    height: 35px !important;
    border-radius: 8px !important;
    border: 1px solid #ddd !important;
    padding: 0 15px !important;
    transition: all 0.3s ease !important;
}

.input-search:focus {
    border-color: #3498db !important;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1) !important;
    outline: none !important;
}

.table-list {
    overflow: auto;
    max-height: 600px;
}

.table {
    width: 100%;
    color: #34495e !important;
    border-collapse: collapse;
}

.table th, .table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #f1f1f1;
}

.table th {
    color: #2c3e50;
    font-weight: 600;
}

.sticky-scroll {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
}

.btn {
    border-radius: 8px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    border: none !important;
    padding: 8px 16px !important;
}

.btn-primary {
    background: #3498db !important;
    color: white !important;
}

.btn-primary:hover {
    background: #2980b9 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.2) !important;
}

.btn-secondary {
    background: #ecf0f1 !important;
    color: #34495e !important;
}

.btn-secondary:hover {
    background: #dcdde1 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.btn-danger {
    background: #e74c3c !important;
    color: white !important;
}

.btn-danger:hover {
    background: #c0392b !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.2) !important;
}

.btn-dark {
    background: #34495e !important;
    color: white !important;
    padding: 5px 10px !important;
}

.btn-dark:hover {
    background: #2c3e50 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}
</style>
// import { API_BASE } from "../config/env.js";
 
// // const TOKEN_KEY = "auth_token";
 
// // function authHeaders() {
// //     const token = localStorage.getItem(TOKEN_KEY);
// //     return {
// //         "Content-Type": "application/json",
// //         Authorization: token ? `Bearer ${token}` : ""
// //     };
// // }
 
// /* ================= DASHBOARD ================= */
// export const getDashboardMetrics = () =>
//     fetch(`${API_BASE}/api/admin/dashboard`, {
//         headers: authHeaders()
//     }).then(r => r.json());
 
// /* ================= ORDERS ================= */
// export const getAdminOrders = ({ page = 1, pageSize = 10 } = {}) =>
//     fetch(
//         `${API_BASE}/api/admin/orders?page=${page}&pageSize=${pageSize}`,
//         { headers: authHeaders() }
//     ).then(r => r.json());
 
// export const getOrderDetail = (code) =>
//     fetch(`${API_BASE}/api/admin/orders/${code}`, {
//         headers: authHeaders()
//     }).then(r => r.json());
 
// export const updateOrder = (data) =>
//     fetch(`${API_BASE}/api/admin/orders`, {
//         method: "PUT",
//         headers: authHeaders(),
//         body: JSON.stringify(data)
//     }).then(r => r.json());
 
// /* ================= PRODUCTS ================= */
// export const getAdminProducts = () =>
//     fetch(`${API_BASE}/api/admin/products`, {
//         headers: authHeaders()
//     }).then(r => r.json());
 
// export const createProduct = (data) =>
//     fetch(`${API_BASE}/api/admin/products`, {
//         method: "POST",
//         headers: authHeaders(),
//         body: JSON.stringify(data)
//     }).then(r => r.json());
 
// export const deleteProduct = (id) =>
//     fetch(`${API_BASE}/api/admin/products?id=${id}`, {
//         method: "DELETE",
//         headers: authHeaders()
//     });
 
// /* ================= CLIENTS ================= */
// export const getClients = () =>
//     fetch(`${API_BASE}/api/admin/clients`, {
//         headers: authHeaders()
//     }).then(r => r.json());
 
// export const getClientDetail = (id) =>
//     fetch(`${API_BASE}/api/admin/clients/${id}`, {
//         headers: authHeaders()
//     }).then(r => r.json());
// admin.service.js
import { API_BASE } from "../config/env.js";

const TOKEN_KEY = "auth_token";

function authFetch(url, options = {}) {
    const token = localStorage.getItem(TOKEN_KEY);

    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            "Authorization": `Bearer ${token}`
        }
    }).then(async (r) => {
        if (!r.ok) {
            const text = await r.text();
            throw new Error(r.status + " - " + text);
        }
        return r.json();
    });
}

/* ===== DASHBOARD ===== */
export const getDashboard = () =>
    authFetch(`${API_BASE}/api/admin/dashboard`);

/* ===== ORDERS ===== */
export const getAdminOrders = ({ page = 1, pageSize = 10 } = {}) => {
    const qs = new URLSearchParams({ page, pageSize });
    return authFetch(`${API_BASE}/api/admin/orders?${qs}`);
};

export const getOrderDetail = (code) =>
    authFetch(`${API_BASE}/api/admin/orders/${code}`);

export const updateOrder = (data) =>
    authFetch(`${API_BASE}/api/admin/orders`, {
        method: "PUT",
        body: JSON.stringify(data)
    });

/* ===== PRODUCTS ===== */
export const getAdminProducts = () =>
    authFetch(`${API_BASE}/api/admin/products`);

export const createProduct = (data) =>
    authFetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const deleteProduct = (id) =>
    authFetch(`${API_BASE}/api/admin/products?id=${id}`, {
        method: "DELETE"
    });

/* ===== CLIENTS ===== */
export const getClients = () =>
    authFetch(`${API_BASE}/api/admin/clients`);

export const getClientDetail = (id) =>
    authFetch(`${API_BASE}/api/admin/clients/${id}`);
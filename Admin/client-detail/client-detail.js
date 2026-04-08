//const $ = s => document.querySelector(s);

//// ================= MOCK DATA =================
//const clients = [
//    { id: 1, name: "Lê Quốc Đạt", phone: "0987654321", address: "Hà Nội" },
//    { id: 2, name: "Trần Thị B", phone: "0912345678", address: "Đà Nẵng" },
//    { id: 3, name: "Nguyễn Văn A", phone: "0909123456", address: "TP.HCM" }
//];

//const orders = [
//    { id: "ORD-001", clientId: 1, total: 52000000, status: "shipped", createdAt: "2026-03-12" },
//    { id: "ORD-002", clientId: 1, total: 12000000, status: "pending", createdAt: "2026-03-13" },
//    { id: "ORD-003", clientId: 2, total: 35000000, status: "paid", createdAt: "2026-03-11" }
//];

//// ================= INIT =================
//const params = new URLSearchParams(location.search);
//const clientId = Number(params.get("clientId"));

//const client = clients.find(c => c.id === clientId);
//const clientOrders = orders.filter(o => o.clientId === clientId);

//renderClientInfo();
//renderOrders();

//// ================= RENDER =================
//function renderClientInfo() {
//    const card = $("#clientInfoCard");

//    if (!client) {
//        card.innerHTML = "<p>Không tìm thấy khách hàng</p>";
//        return;
//    }

//    card.innerHTML = `
//        <div class="section-head">
//            <h2>${client.name}</h2>
//        </div>

//        <div class="client-info-grid">
//            <div><b>Client ID:</b> ${client.id}</div>
//            <div><b>SĐT:</b> ${client.phone}</div>
//            <div><b>Địa chỉ:</b> ${client.address}</div>
//            <div><b>Số đơn:</b> ${clientOrders.length}</div>
//        </div>
//    `;
//}

//function renderOrders() {
//    const tbody = $("#tbodyOrders");
//    const empty = $("#emptyOrders");

//    tbody.innerHTML = "";

//    if (clientOrders.length === 0) {
//        empty.hidden = false;
//        return;
//    }

//    empty.hidden = true;

//    clientOrders.forEach(o => {
//        tbody.innerHTML += `
//            <tr>
//                <td><span class="badge">${o.id}</span></td>
//                <td>${new Date(o.createdAt).toLocaleDateString("vi-VN")}</td>
//                <td>${o.total.toLocaleString("vi-VN")} VND</td>
//                <td><span class="status ${o.status}">${o.status}</span></td>
//            </tr>
//        `;
//    });
//}




/* ================= ADMIN CLIENT DETAIL – API READY ================= */

import {
    adminGetClientById,
    adminGetClientOrders
} from "../../assets/js/services/user.service.js";

const TOKEN_KEY = "auth_token";
const $ = (s) => document.querySelector(s);

function escapeHtml(s = "") {
    return s.replace(/[&<>"']/g, (m) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])
    );
}
function money(n) {
    return Number(n || 0).toLocaleString("vi-VN") + " VND";
}
function formatDate(d) {
    return d ? new Date(d).toLocaleDateString("vi-VN") : "";
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
        location.href = new URLSearchParams(location.search);
        const clientId = params.get("clientId");
        if (!clientId) return;

        await loadClientInfo(clientId);
        await loadClientOrders(clientId);
    });

/* ================= LOAD DATA (SERVICE) ================= */
async function loadClientInfo(clientId) {
    try {
        const c = await adminGetClientById(clientId);
        renderClientInfo(c);
    } catch {
        $("#clientInfoCard").innerHTML =
            "<p>Không tìm thấy khách hàng</p>";
    }
}

async function loadClientOrders(clientId) {
    try {
        const { data } = await adminGetClientOrders(clientId);
        renderOrders(data || []);
    } catch {
        renderOrders([]);
    }
}

/* ================= RENDER ================= */
function renderClientInfo(client) {
    const card = $("#clientInfoCard");

    card.innerHTML = `
        <div class="section-head">
            <h2>${escapeHtml(client.fullName || "")}</h2>
        </div>

        <div class="client-info-grid">
            <div><b>Client ID:</b> ${escapeHtml(client.id)}</div>
            <div><b>SĐT:</b> ${escapeHtml(client.phone || "")}</div>
            <div><b>Địa chỉ:</b> ${escapeHtml(client.address || "")}</div>
            <div><b>Số đơn:</b> ${client.orderCount ?? 0}</div>
        </div>
    `;
}

function renderOrders(orders) {
    const tbody = $("#tbodyOrders");
    const empty = $("#emptyOrders");

    tbody.innerHTML = "";

    if (!orders.length) {
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    orders.forEach((o) => {
        tbody.innerHTML += `
            <tr>
                <td><span class="badge">${escapeHtml(o.orderId)}</span></td>
                <td>${formatDate(o.createdAt)}</td>
                <td>${money(o.total)}</td>
                <td>
                    <span class="status ${o.status}">
                        ${escapeHtml(o.status)}
                    </span>
                </td>
            </tr>
        `;
    });
}
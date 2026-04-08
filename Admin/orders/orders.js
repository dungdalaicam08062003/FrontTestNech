//// ================= CONFIG & UTILS =================
//const API_BASE = "/api/admin";
//const $ = (s) => document.querySelector(s);

//function authHeaders() {
//    const t = localStorage.getItem("adminToken");
//    return t ? { "Authorization": `Bearer ${t}` } : {};
//}

//function money(n) {
//    return Number(n || 0).toLocaleString("vi-VN");
//}

//function toast(msg, ms = 1600) {
//    const t = $("#toast");
//    t.textContent = msg;
//    t.hidden = false;
//    setTimeout(() => t.hidden = true, ms);
//}

//function escapeHtml(s) {
//    return (s || "").replace(/[&<>"']/g, m => ({
//        "&": "&amp;",
//        "<": "&lt;",
//        ">": "&gt;",
//        "\"": "&quot;",
//        "'": "&#039;"
//    }[m]));
//}

//function formatDate(d) {
//    if (!d) return "";
//    return new Date(d).toLocaleString("vi-VN");
//}

//// ================= STATE =================
//let orders = [];

//// ================= INIT =================
//document.addEventListener("DOMContentLoaded", () => {
//    $("#logoutBtn")?.addEventListener("click", () => {
//        localStorage.removeItem("adminToken");
//        location.href = "/homepage.html";
//    });

//    $("#statusFilter")?.addEventListener("change", render);
//    $("#searchInput")?.addEventListener("input", render);
//    $("#closeModal")?.addEventListener("click", () => $("#orderModal").close());

//    loadOrders();
//});

//// ================= API =================
//async function loadOrders() {
//    try {
//        const res = await fetch(`${API_BASE}/orders?page=1&pageSize=100`, {
//            headers: { ...authHeaders() }
//        });

//        if (!res.ok) throw new Error(await res.text());

//        const payload = await res.json();
//        const raw = payload?.data || [];

//        // ✅ MAP SANG SCHEMA FE + THÊM clientId
//        orders = raw.map(o => ({
//            id: o.orderId,
//            clientId: o.customer?.clientId,     // ✅ DÙNG CHO CLIENTS

//            customerName: o.customer?.fullName,
//            phone: o.customer?.phone,
//            address: o.customer?.city || "",

//            total: o.total,
//            status: o.status,                   // pending | paid | shipped | cancelled
//            createdAt: o.createdAt,

//            items: (o.items || []).map(it => ({
//                productId: it.id,
//                productName: it.name,
//                quantity: it.qty,
//                price: it.price
//            }))
//        }));

//        render();
//    } catch (e) {
//        console.error(e);
//        toast("Tải danh sách đơn hàng thất bại");
//    }
//}

//// ================= RENDER =================
//function render() {
//    const status = $("#statusFilter")?.value || "";
//    const q = ($("#searchInput")?.value || "").trim().toLowerCase();

//    let data = orders.slice();

//    if (status) {
//        data = data.filter(o => (o.status || "").toLowerCase() === status);
//    }

//    if (q) {
//        data = data.filter(o =>
//            (o.id || "").toLowerCase().includes(q) ||
//            (o.customerName || "").toLowerCase().includes(q) ||
//            (o.phone || "").toLowerCase().includes(q)
//        );
//    }

//    const tbody = $("#tbodyOrders");
//    const empty = $("#emptyState");

//    tbody.innerHTML = "";

//    if (data.length === 0) {
//        empty.hidden = false;
//        return;
//    }

//    empty.hidden = true;

//    data.forEach(o => {
//        const tr = document.createElement("tr");
//        tr.innerHTML = `
//            <td><span class="badge">${o.id}</span></td>

//            <td>
//                <a href="/Admin/client-detail/client-detail.html?clientId=${o.clientId}">
//                    ${escapeHtml(o.customerName || "")}
//                </a>
//            </td>

//            <td>${escapeHtml(o.phone || "")}</td>
//            <td>${escapeHtml(o.address || "")}</td>
//            <td class="price">${money(o.total)} VND</td>

//            <td>
//                <select data-oid="${o.id}">
//                    ${["pending", "paid", "shipped", "cancelled"].map(s =>
//            `<option value="${s}" ${o.status === s ? "selected" : ""}>${s}</option>`
//        ).join("")}
//                </select>
//            </td>

//            <td>${formatDate(o.createdAt)}</td>
//            <td>
//                <button class="btn" data-view="${o.id}">Xem</button>
//            </td>
//        `;
//        tbody.appendChild(tr);
//    });

//    // ================= EVENTS =================
//    tbody.querySelectorAll("select[data-oid]").forEach(sel => {
//        sel.addEventListener("change", async () => {
//            const id = sel.dataset.oid;
//            const status = sel.value;

//            try {
//                await updateStatus(id, status);
//                const o = orders.find(x => x.id === id);
//                if (o) o.status = status;
//                toast("(Mock) Cập nhật trạng thái thành công");
//            } catch (e) {
//                console.error(e);
//                toast("Cập nhật trạng thái thất bại");
//            }
//        });
//    });

//    tbody.querySelectorAll("button[data-view]").forEach(btn => {
//        btn.addEventListener("click", () => openDetail(btn.dataset.view));
//    });
//}

//// ================= MOCK UPDATE STATUS =================
//async function updateStatus(id, status) {
//    // TODO: sau này thay bằng:
//    // PUT /api/admin/orders/{id}/status
//    return Promise.resolve();
//}

//// ================= MODAL DETAIL =================
//function openDetail(id) {
//    const o = orders.find(x => x.id === id);
//    if (!o) return;

//    const wrap = $("#orderDetail");
//    const items = o.items || [];

//    wrap.innerHTML = `
//        <div><b>Order:</b> ${o.id}</div>
//        <div><b>Khách:</b> ${escapeHtml(o.customerName || "")} — ${escapeHtml(o.phone || "")}</div>
//        <div><b>Địa chỉ:</b> ${escapeHtml(o.address || "")}</div>
//        <div class="note">Tạo lúc: ${formatDate(o.createdAt)}</div>

//        <div class="order-items" style="margin-top:8px">
//            ${items.map(it => `
//                <div class="line">
//                    <span>${escapeHtml(it.productName || it.productId)} × ${it.quantity}</span>
//                    <span>${money(it.price * it.quantity)} VND</span>
//                </div>
//            `).join("")}
//            <div class="line">
//                <b>Tổng</b>
//                <b>${money(o.total)} VND</b>
//            </div>
//        </div>
//    `;

//    $("#orderModal").showModal();
//}


/* ================= ADMIN ORDERS – API READY ================= */

import {
    adminGetOrders,
    adminUpdateOrderStatus
} from "../../assets/js/services/order.service.js";

const TOKEN_KEY = "auth_token";
const $ = (s) => document.querySelector(s);

function money(n) {
    return Number(n || 0).toLocaleString("vi-VN");
}
function toast(msg, ms = 1600) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    setTimeout(() => (t.hidden = true), ms);
}
function escapeHtml(s = "") {
    return s.replace(/[&<>"']/g, (m) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])
    );
}
function formatDate(d) {
    return d ? new Date(d).toLocaleString("vi-VN") : "";
}

// ================= STATE =================
let orders = [];

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
        location.href = "/Auth/login-register.html";
        return;
    }

    $("#logoutBtn")?.addEventListener("click", () => {
        localStorage.removeItem(TOKEN_KEY);
        location.href = "/HomePage/homepage.html";
    });

    $("#statusFilter")?.addEventListener("change", render);
    $("#searchInput")?.addEventListener("input", render);
    $("#closeModal")?.addEventListener("click", () =>
        $("#orderModal").close()
    );

    loadOrders();
});

// ================= API (SERVICE) =================
async function loadOrders() {
    try {
        const payload = await adminGetOrders({ page: 1, pageSize: 100 });
        const raw = payload.data || [];

        orders = raw.map((o) => ({
            id: o.orderId,
            clientId: o.customer?.clientId,
            customerName: o.customer?.fullName,
            phone: o.customer?.phone,
            address: o.customer?.city || "",
            total: o.total,
            status: o.status,
            createdAt: o.createdAt,
            items: (o.items || []).map((it) => ({
                productId: it.id,
                productName: it.name,
                quantity: it.qty,
                price: it.price
            }))
        }));

        render();
    } catch (e) {
        console.error(e);
        toast("Tải danh sách đơn hàng thất bại");
    }
}

// ================= RENDER =================
function render() {
    const status = $("#statusFilter")?.value || "";
    const q = ($("#searchInput")?.value || "").trim().toLowerCase();

    let data = orders.slice();

    if (status) data = data.filter((o) => o.status === status);
    if (q) {
        data = data.filter(
            (o) =>
                (o.id || "").toLowerCase().includes(q) ||
                (o.customerName || "").toLowerCase().includes(q) ||
                (o.phone || "").toLowerCase().includes(q)
        );
    }

    const tbody = $("#tbodyOrders");
    const empty = $("#emptyState");
    tbody.innerHTML = "";

    if (!data.length) {
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    data.forEach((o) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span class="badge">${o.id}</span></td>
            <td>
                <a href="/Admin/client-detail/client-detail.html?clientId=${o.clientId}">
                    ${escapeHtml(o.customerName || "")}
                </a>
            </td>
            <td>${escapeHtml(o.phone || "")}</td>
            <td>${escapeHtml(o.address || "")}</td>
            <td class="price">${money(o.total)} VND</td>
            <td>
                <select data-oid="${o.id}">
                    ${["pending", "paid", "shipped", "cancelled"]
                .map(
                    (s) =>
                        `<option value="${s}" ${o.status === s ? "selected" : ""
                        }>${s}</option>`
                )
                .join("")}
                </select>
            </td>
            <td>${formatDate(o.createdAt)}</td>
            <td>
                <button class="btn" data-view="${o.id}">Xem</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Update status
    tbody.querySelectorAll("select[data-oid]").forEach((sel) => {
        sel.addEventListener("change", async () => {
            const id = sel.dataset.oid;
            const status = sel.value;
            try {
                await adminUpdateOrderStatus(id, status);
                const o = orders.find((x) => x.id === id);
                if (o) o.status = status;
                toast("Cập nhật trạng thái thành công");
            } catch {
                toast("Cập nhật trạng thái thất bại");
            }
        });
    });

    // View detail
    tbody.querySelectorAll("button[data-view]").forEach((btn) =>
        btn.addEventListener("click", () => openDetail(btn.dataset.view))
    );
}

// ================= MODAL DETAIL =================
function openDetail(id) {
    const o = orders.find((x) => x.id === id);
    if (!o) return;

    $("#orderDetail").innerHTML = `
        <div><b>Order:</b> ${o.id}</div>
        <div>
            <b>Khách:</b> ${escapeHtml(o.customerName || "")}
            — ${escapeHtml(o.phone || "")}
        </div>
        <div><b>Địa chỉ:</b> ${escapeHtml(o.address || "")}</div>
        <div class="note">Tạo lúc: ${formatDate(o.createdAt)}</div>

        <div class="order-items">
            ${o.items
            .map(
                (it) => `
                <div class="line">
                    <span>${escapeHtml(
                    it.productName || it.productId
                )} × ${it.quantity}</span>
                    <span>${money(it.price * it.quantity)} VND</span>
                </div>
            `
            )
            .join("")}
            <div class="line">
                <b>Tổng</b>
                <b>${money(o.total)} VND</b>
            </div>
        </div>
    `;
    $("#orderModal").showModal();
}
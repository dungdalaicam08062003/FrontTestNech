//const API_BASE = "/api/admin";
//const $ = s => document.querySelector(s);

//function escapeHtml(s) {
//    return (s || "").replace(/[&<>"']/g, m => ({
//        "&": "&amp;",
//        "<": "&lt;",
//        ">": "&gt;",
//        "\"": "&quot;",
//        "'": "&#039;"
//    }[m]));
//}

//// ================= MOCK DATA =================
//// (sau này thay bằng API clients nếu có)
//let clients = [
//    { id: 1, name: "Lê Quốc Đạt", phone: "0987654321", address: "Hà Nội" },
//    { id: 2, name: "Trần Thị B", phone: "0912345678", address: "Đà Nẵng" },
//    { id: 3, name: "Nguyễn Văn A", phone: "0909123456", address: "TP.HCM" }
//];

//let orders = [
//    { id: "ORD-001", clientId: 1 },
//    { id: "ORD-002", clientId: 1 },
//    { id: "ORD-003", clientId: 2 }
//];

//// ================= INIT =================
//document.addEventListener("DOMContentLoaded", () => {
//    $("#searchInput").addEventListener("input", render);
//    render();
//});

//// ================= RENDER =================
//function render() {
//    const q = ($("#searchInput").value || "").trim().toLowerCase();

//    let data = clients.slice();

//    if (q) {
//        data = data.filter(c =>
//            String(c.id).includes(q) ||
//            (c.name || "").toLowerCase().includes(q)
//        );
//    }

//    const tbody = $("#tbodyClients");
//    const empty = $("#emptyState");

//    tbody.innerHTML = "";

//    if (data.length === 0) {
//        empty.hidden = false;
//        return;
//    }

//    empty.hidden = true;

//    data.forEach(c => {
//        const orderCount = orders.filter(o => o.clientId === c.id).length;

//        const tr = document.createElement("tr");
//        tr.innerHTML = `
//        <td>
//            <span class="badge">${c.id}</span>
//        </td>
//        <td>${escapeHtml(c.name)}</td>
//        <td>${escapeHtml(c.phone)}</td>
//        <td>${escapeHtml(c.address)}</td>
//        <td>${orderCount}</td>
//        <td>
//            <a
//              href="/admin/client-detail/client-detail.html?clientId=${c.id}"
//              class="btn btn-outline"
//            >
//              Xem
//            </a>
//        </td>
//    `;
//        tbody.appendChild(tr);
//    });
//}

/* ================= ADMIN CLIENTS – API READY ================= */

import { adminGetClients } from "../../assets/js/services/user.service.js";

const TOKEN_KEY = "auth_token";
const $ = (s) => document.querySelector(s);

function escapeHtml(s = "") {
    return s.replace(/[&<>"']/g, (m) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])
    );
}

/* ================= STATE ================= */
let clients = [];

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
        location.href = "/Auth/login-register.html";
        return;
    }

    $("#searchInput")?.addEventListener("input", render);
    await loadClients();
});

/* ================= API (SERVICE) ================= */
async function loadClients() {
    try {
        const payload = await adminGetClients({ page: 1, pageSize: 100 });
        clients = payload.data || [];
        render();
    } catch (e) {
        console.error(e);
        $("#emptyState")?.classList.remove("hidden");
    }
}

/* ================= RENDER ================= */
function render() {
    const q = ($("#searchInput")?.value || "").trim().toLowerCase();
    let data = clients.slice();

    if (q) {
        data = data.filter((c) =>
            String(c.id).toLowerCase().includes(q) ||
            (c.fullName || "").toLowerCase().includes(q) ||
            (c.phone || "").toLowerCase().includes(q)
        );
    }

    const tbody = $("#tbodyClients");
    const empty = $("#emptyState");
    tbody.innerHTML = "";

    if (!data.length) {
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    data.forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span class="badge">${escapeHtml(c.id)}</span></td>
            <td>${escapeHtml(c.fullName || "")}</td>
            <td>${escapeHtml(c.phone || "")}</td>
            <td>${escapeHtml(c.address || "")}</td>
            <td>${c.orderCount ?? 0}</td>
            <td>
                <a
                  href="/Admin/client-detail/client-detail.html?clientId=${encodeURIComponent(
            c.id
        )}"
                  class="btn btn-outline"
                >
                  Xem
                </a>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
``
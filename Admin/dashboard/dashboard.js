

// /* ================= ADMIN DASHBOARD – API READY ================= */

// import {
//     getDashboardMetrics,
//     getAdminOrders
// } from "../../assets/js/services/admin.service.js";

// const TOKEN_KEY = "auth_token";
// const $ = (s) => document.querySelector(s);

// function money(n) {
//     return Number(n || 0).toLocaleString("vi-VN");
// }
// function escapeHtml(s = "") {
//     return s.replace(/[&<>"']/g, (m) =>
//         ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])
//     );
// }

// /* ================= INIT ================= */
// document.addEventListener("DOMContentLoaded", async () => {
//     // if (!localStorage.getItem(TOKEN_KEY)) {
//     //     location.href = "/Auth/login-register.html";
//     //     return;
//     // }

//     // $("#logoutBtn")?.addEventListener("click", () => {
//     //     localStorage.removeItem(TOKEN_KEY);
//     //     location.href = "/HomePage/homepage.html";
//     // });

//     await loadMetrics();
//     await loadRecentOrders();
// });

// /* ================= LOAD METRICS ================= */
// async function loadMetrics() {
//     try {
//         const m = await getDashboardMetrics();

//         $("#m_totalProducts").textContent = m?.totals?.products ?? 0;
//         $("#m_totalOrders").textContent = m?.totals?.orders ?? 0;


//         // ✅ ƯU TIÊN DÙNG TỪ DASHBOARD
//         if (typeof m?.totals?.newOrders24h === "number") {
//             $("#m_newOrders").textContent = m.totals.newOrders24h;
//             return;
//         }

//         // ⚠️ Fallback (nếu BE chưa có)
//         let new24h = 0;
//         const now = Date.now();

//         const { data } = await getAdminOrders({ page: 1, pageSize: 1000 });
//         new24h = (data || []).filter(
//             (o) =>
//                 now - new Date(o.createdAt).getTime() <=
//                 24 * 3600 * 1000
//         ).length;

//         $("#m_newOrders").textContent = new24h;

//     } catch (e) {
//         console.error(e);
//     }
// }

// /* ================= RECENT ORDERS ================= */
// async function loadRecentOrders() {
//     try {
//         const { data } = await getAdminOrders({ page: 1, pageSize: 5 });
//         const tbody = $("#tbodyRecent");
//         tbody.innerHTML = "";

//         for (const o of data || []) {
//             const tr = document.createElement("tr");
//             tr.innerHTML = `
//                 <td><span class="badge">${o.orderId}</span></td>
//                 <td>${escapeHtml(o.customer?.fullName || "")}</td>
//                 <td>${escapeHtml(o.customer?.phone || "")}</td>
//                 <td>${o.status}</td>
//                 <td class="price">${money(o.total || 0)} VND</td>
//                 <td>${new Date(o.createdAt).toLocaleString("vi-VN")}</td>
//             `;
//             tbody.appendChild(tr);
//         }
//     } catch (e) {
//         console.error(e);
//     }
// }
import {
    getDashboard,
    getAdminOrders
} from "../../assets/js/services/admin.service.js";

const TOKEN_KEY = "auth_token";
const $ = (s) => document.querySelector(s);

/* ===== UTILS ===== */
function money(n) {
    return Number(n || 0).toLocaleString("vi-VN");
}

function escapeHtml(s = "") {
    return String(s).replace(/[&<>"']/g, m =>
        ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[m])
    );
}

function orderStatusBadge(status = "") {
    const map = {
        Pending: "badge-warning",
        Paid: "badge-info",
        Shipped: "badge-primary",
        Completed: "badge-success",
        Cancelled: "badge-danger"
    };
    return `<span class="badge ${map[status] || "badge-secondary"}">${status}</span>`;
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", async () => {
    // if (!localStorage.getItem(TOKEN_KEY)) {
    //     location.href = "/Auth/login-register.html";
    //     return;
    // }

    // $("#logoutBtn")?.addEventListener("click", () => {
    //     localStorage.removeItem(TOKEN_KEY);
    //     location.href = "/dashboard/dashboard.html";
    // });

    await loadMetrics();
    await loadRecentOrders();
});

/* ===== METRICS ===== */

async function loadMetrics() {
    try {
        const m = await getDashboard();

        $("#m_totalProducts").textContent = m.totalProduct ?? 0;
        $("#m_totalOrders").textContent = m.totalOrder ?? 0;
        $("#m_newOrders").textContent = m.totalOrderIn24hour ?? 0;

    } catch (e) {
        console.error(e);
    }
}

/* ===== RECENT ORDERS ===== */
async function loadRecentOrders() {
    try {
        const res = await getDashboard();
        console.log("DASHBOARD:", res);

        const data = res.listDashBoardOrders || [];
        const tbody = document.querySelector("#tbodyRecent");
        tbody.innerHTML = "";

        for (const o of data) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="badge">${o.orderCode}</span></td>
                <td>${o.clientName}</td>
                <td>${o.phoneNumber}</td>
                <td>${o.status}</td>
                <td class="price">${Number(o.totalPrice).toLocaleString("vi-VN")} VND</td>
                <td>${new Date(o.createAt).toLocaleString("vi-VN")}</td>
            `;
            tbody.appendChild(tr);
        }
    } catch (e) {
        console.error("loadRecentOrders error", e);
    }
}
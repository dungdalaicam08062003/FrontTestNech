


/* ================== ADMIN PRODUCTS – API READY ================== */

import {
    adminGetProducts,
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct
} from "../../assets/js/services/product.service.js";

const TOKEN_KEY = "auth_token";

const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

function money(n) {
    return Number(n || 0).toLocaleString("vi-VN");
}

function toast(msg, ms = 1800) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    setTimeout(() => t.hidden = true, ms);
}

function escapeHtml(s = "") {
    return s.replace(/[&<>"']/g, m =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])
    );
}

/* ================== STATE ================== */
let products = [];
let editId = null;

/* ================== DOM READY ================== */
document.addEventListener("DOMContentLoaded", () => {
    // if (!localStorage.getItem(TOKEN_KEY)) {
    //     location.href = "/Auth/login-register.html";
    //     return;
    // }s
    bindEvents();
    loadProducts();
});

/* ================== EVENTS ================== */
function bindEvents() {
    $("#btnAdd")?.addEventListener("click", openAddModal);
    $("#btnCancel")?.addEventListener("click", () => $("#productModal").close());
    $("#btnCancel2")?.addEventListener("click", () => $("#productModal").close());
    $("#productForm")?.addEventListener("submit", onSubmitProduct);
    $("#logoutBtn")?.addEventListener("click", logout);
    $("#searchInput")?.addEventListener("input", render);
}

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    location.href = "/HomePage/homepage.html";
}

/* ================== API (SERVICE) ================== */
async function loadProducts() {
    try {
        const payload = await adminGetProducts({ page: 1, pageSize: 100 });
        products = payload.data || [];
        render();
    } catch (e) {
        console.error(e);
        toast("Không tải được danh sách sản phẩm");
    }
}

/* ================== RENDER ================== */
function render() {
    const q = ($("#searchInput")?.value || "").trim().toLowerCase();
    const data = q
        ? products.filter(p =>
            (p.id || "").toLowerCase().includes(q) ||
            (p.name || "").toLowerCase().includes(q))
        : products.slice();

    const tbody = $("#tbodyProducts");
    const empty = $("#emptyState");
    tbody.innerHTML = "";

    if (!data.length) {
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    for (const p of data) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span class="badge">${p.id}</span></td>
            <td>${escapeHtml(p.name || "")}</td>
            <td class="price">${money(p.price)}</td>
            <td>${p.stock ?? 0}</td>
            <td>
                <div class="row-actions">
                    <button class="btn" data-edit="${p.id}">Sửa</button>
                    <button class="btn btn-danger" data-del="${p.id}">Xóa</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    }

    tbody.querySelectorAll("[data-edit]").forEach(b =>
        b.onclick = () => openEditModal(b.dataset.edit)
    );

    tbody.querySelectorAll("[data-del]").forEach(b =>
        b.onclick = async () => {
            if (!confirm("Xoá sản phẩm này?")) return;
            try {
                await adminDeleteProduct(b.dataset.del);
                toast("Đã xoá");
                loadProducts();
            } catch {
                toast("Xoá thất bại");
            }
        }
    );
}

/* ================== MODAL / FORM ================== */
function openAddModal() {
    editId = null;
    $("#modalTitle").textContent = "Thêm sản phẩm";
    $("#productForm").reset();
    $("#p_id").disabled = false;
    $("#productModal").showModal();
}

function openEditModal(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    editId = id;
    $("#modalTitle").textContent = `Sửa: ${id}`;
    $("#productForm").reset();

    $("#p_id").value = p.id;
    $("#p_id").disabled = true;
    $("#p_name").value = p.name || "";
    $("#p_price").value = p.price ?? 0;
    $("#p_stock").value = p.stock ?? 0;
    $("#p_mainImage").value = p.mainImage || "";
    $("#p_gallery").value = (p.images || []).join("\n");
    $("#p_desc").value = p.description || "";
    $("#p_specs").value = p.specs ? JSON.stringify(p.specs, null, 2) : "";

    $("#productModal").showModal();
}

async function onSubmitProduct(e) {
    e.preventDefault();
    try {
        const data = getFormProduct();
        if (editId) await adminUpdateProduct(editId, data);
        else await adminCreateProduct(data);

        toast(editId ? "Đã cập nhật" : "Đã tạo mới");
        $("#productModal").close();
        loadProducts();
    } catch (e) {
        console.error(e);
        toast("Lưu sản phẩm thất bại");
    }
}

function getFormProduct() {
    let specs = {};
    const raw = $("#p_specs").value.trim();
    if (raw) specs = JSON.parse(raw);

    return {
        id: $("#p_id").value.trim(),
        name: $("#p_name").value.trim(),
        price: Number($("#p_price").value || 0),
        stock: Number($("#p_stock").value || 0),
        mainImage: $("#p_mainImage").value.trim(),
        images: ($("#p_gallery").value || "")
            .split("\n")
            .map(s => s.trim())
            .filter(Boolean),
        description: $("#p_desc").value,
        specs
    };
}
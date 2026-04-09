/* =========================
   Product Listing – API READY
   ========================= */

import {
    getProducts,
    getProductsByBrand,
    getProductsByCategory,
    searchProducts
} from "./assets/js/services/product.service.js";

const PAGE_SIZE = 12;
const CART_KEY = 'cart';
const CHECKOUT_CTX_KEY = 'checkout_ctx';

const qs = (s) => document.querySelector(s);

/* ---------- DOM ---------- */
const grid = qs('#grid');
const pagination = qs('#pagination');
const emptyState = qs('#emptyState');
const errorState = qs('#errorState');
const toast = qs('#toast');

/* ---------- State ---------- */
const state = {
    keyword: '',
    sort: 'relevance',
    page: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    brand: '',
    category: ''
};

/* ---------- Utils ---------- */
function money(n) {
    return Number(n || 0).toLocaleString('vi-VN') + ' đ';
}

function escapeHtml(s = '') {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showToast(msg = '') {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 1500);
}

/* ---------- Cart ---------- */
function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
}

function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function updateCartBadge() {
    const badge = qs('#cartCount');
    if (!badge) return;
    const count = readCart().reduce((s, i) => s + (i.qty || 1), 0);
    badge.textContent = count;
    badge.classList.toggle('hidden', count <= 0);
}

function addToCart(productId) {
    const cart = readCart();
    const idx = cart.findIndex(x => x.productId === productId);

    if (idx >= 0) cart[idx].qty++;
    else cart.push({ productId, qty: 1 });

    writeCart(cart);
    updateCartBadge();
    showToast('Đã thêm vào giỏ');
}

/* ---------- Fetch ---------- */
async function fetchProducts() {
    try {
        renderSkeleton();

        let res;
        if (state.keyword) {
            res = await searchProducts(state.keyword);
        } else if (state.brand) {
            res = await getProductsByBrand(state.brand);
        } else if (state.category) {
            res = await getProductsByCategory(state.category);
        } else {
            res = await getProducts();
        }

        const items = Array.isArray(res) ? res : (res?.$values || []);
        state.total = items.length;

        const start = (state.page - 1) * state.pageSize;
        const pageItems = items.slice(start, start + state.pageSize);

        renderProducts(pageItems);
        renderPagination(Math.ceil(state.total / state.pageSize));

    } catch (err) {
        console.error(err);
        grid.innerHTML = '';
        errorState?.classList.remove('hidden');
    }
}

/* ---------- Render ---------- */
function renderSkeleton(count = PAGE_SIZE) {
    grid.innerHTML = Array.from({ length: count }).map(() => `
        <div class="card card--skeleton">
            <div class="card__img skeleton"></div>
            <div class="line skeleton"></div>
            <div class="line skeleton" style="width:80%"></div>
            <div class="line skeleton" style="width:60%"></div>
        </div>
    `).join('');
}

function renderProducts(items) {
    if (!items.length) {
        emptyState?.classList.remove('hidden');
        grid.innerHTML = '';
        return;
    }

    emptyState?.classList.add('hidden');

    grid.innerHTML = items.map(p => `
        <div class="card">
            <a class="card__img-link" href="./ProductDetail/productdetail.html?id=${p.id}">
                <img class="card__img"
                     src="${p.thumbnail || 'https://via.placeholder.com/400x300'}"
                     alt="${escapeHtml(p.name)}"
                     loading="lazy">
            </a>

            <a class="card__title" href="./ProductDetail/productdetail.html?id=${p.id}">
                ${escapeHtml(p.name)}
            </a>

            <div class="badges">
                ${p.brand ? `<span class="badge">${escapeHtml(p.brand)}</span>` : ''}
                ${p.category ? `<span class="badge">${escapeHtml(p.category)}</span>` : ''}
            </div>

            <div class="price">${money(p.price)}</div>

            <div class="actions">
                <button class="btn btn--add" data-id="${p.id}">Thêm giỏ</button>
                <button class="btn btn--buy" data-id="${p.id}">Mua ngay</button>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.btn--add')
        .forEach(btn => btn.onclick = () => addToCart(btn.dataset.id));
}

/* ---------- Pagination ---------- */
function renderPagination(totalPages) {
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <button class="page-btn ${i === state.page ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>`;
    }

    pagination.querySelectorAll('.page-btn').forEach(btn => {
        btn.onclick = () => {
            state.page = Number(btn.dataset.page);
            fetchProducts();
        };
    });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    fetchProducts();
});

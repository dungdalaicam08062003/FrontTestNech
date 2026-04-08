/* ====================
   Cart – API READY
   ==================== */

import { getProductDetail } from "../assets/js/services/product.service.js";

// ===== Keys =====
const CART_KEY = 'cart';
const CHECKOUT_CTX_KEY = 'checkout_ctx';

// ===== Els =====
const els = {
    items: document.getElementById('cart-items'),
    tpl: document.getElementById('cart-item-tpl'),
    sumSubtotal: document.getElementById('sum-subtotal'),
    sumTotal: document.getElementById('sum-total'),
    btnUpdate: document.getElementById('btn-update'),
    btnCheckout: document.getElementById('btn-checkout'),
};

if (!els.items) {
    console.warn('cart-items not found');
}

// ===== Utils =====
const money = n => Number(n || 0).toLocaleString('vi-VN') + ' đ';

const readCart = () => {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
};

const writeCart = items => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
};

// ===== State =====
let cart = [];
let lines = [];

// ===== Render =====
async function render() {
    cart = readCart();
    els.items.innerHTML = '';
    lines = [];

    if (!cart.length) {
        els.items.innerHTML = `
            <div class="cart-row">
                <div class="c-col product">Giỏ hàng trống.</div>
            </div>`;
        updateSummary();
        return;
    }

    for (const it of cart) {
        let p;
        try {
            p = await getProductDetail(it.productId);
        } catch {
            cart = cart.filter(x => x.productId !== it.productId);
            writeCart(cart);
            continue;
        }

        const qty = Math.max(1, it.qty || 1);
        const price = Number(p.price || 0);
        const lineTotal = price * qty;

        lines.push({ qty, price });

        const row = els.tpl.content.firstElementChild.cloneNode(true);
        row.dataset.id = p.id;

        row.querySelector('.thumb').src =
            p.thumbnail || '/images/noimg.png';

        const nameEl = row.querySelector('.p-name');
        nameEl.textContent = p.name;
        nameEl.href = `/productdetail.html?id=${encodeURIComponent(p.id)}`;

        row.querySelector('.price-txt').textContent = money(price);
        row.querySelector('.qty-input').value = qty;
        row.querySelector('.subtotal-txt').textContent = money(lineTotal);

        els.items.appendChild(row);
    }

    updateSummary();
    window.updateCartBadge?.();
}

function updateSummary() {
    const subtotal = lines.reduce(
        (s, l) => s + l.price * l.qty,
        0
    );
    els.sumSubtotal.textContent = money(subtotal);
    els.sumTotal.textContent = money(subtotal);
}

// ===== Events =====
els.items.addEventListener('click', e => {
    const row = e.target.closest('.cart-item');
    if (!row) return;

    const id = row.dataset.id;

    if (e.target.classList.contains('inc')) updateQty(id, +1);
    if (e.target.classList.contains('dec')) updateQty(id, -1);
    if (e.target.classList.contains('remove-btn')) removeItem(id);
});

els.items.addEventListener('change', e => {
    if (!e.target.classList.contains('qty-input')) return;
    const row = e.target.closest('.cart-item');
    setQty(row.dataset.id, Number(e.target.value));
});

els.btnUpdate?.addEventListener('click', render);

els.btnCheckout?.addEventListener('click', () => {
    if (!cart.length) {
        alert('Giỏ hàng trống.');
        return;
    }

    localStorage.setItem(
        CHECKOUT_CTX_KEY,
        JSON.stringify({
            mode: 'cart',
            items: cart,
            ts: Date.now()
        })
    );

    window.location.href = '/checkout.html';
});

// ===== Cart ops =====
function updateQty(id, delta) {
    const list = readCart();
    const it = list.find(x => x.productId === id);
    if (!it) return;

    it.qty = Math.max(1, (it.qty || 1) + delta);
    writeCart(list);
    render();
}

function setQty(id, qty) {
    const list = readCart();
    const it = list.find(x => x.productId === id);
    if (!it) return;

    it.qty = Math.max(1, qty);
    writeCart(list);
    render();
}

function removeItem(id) {
    writeCart(readCart().filter(x => x.productId !== id));
    render();
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', render);
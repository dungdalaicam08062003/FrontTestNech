
/* ====================
   Checkout – API READY
   ==================== */

import { getProductById } from "../assets/js/services/product.service.js";
import { createOrder } from "../assets/js/services/order.service.js";

// ==================== Constants ====================
const CHECKOUT_CTX_KEY = 'checkout_ctx';
const CART_KEY = 'cart';

// ==================== Utils ====================
function money(n) {
    return Number(n || 0).toLocaleString('vi-VN') + ' đ';
}
function getQuery(name) {
    return new URL(location.href).searchParams.get(name);
}

// ==================== Storage ====================
function getCheckoutCtx() {
    try { return JSON.parse(localStorage.getItem(CHECKOUT_CTX_KEY)); }
    catch { return null; }
}
function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
}

// ==================== Render ====================
function renderLines(lines) {
    const wrap = document.getElementById('orderItems');
    wrap.innerHTML = '';

    let subtotal = 0;
    let outOfStock = false;

    for (const l of lines) {
        const lineTotal = l.price * l.qty;
        subtotal += lineTotal;

        if (typeof l.stock === 'number' && l.qty > l.stock) {
            outOfStock = true;
        }

        const row = document.createElement('div');
        row.className = 'order-item';
        row.innerHTML = `
            <img src="${l.image || 'https://via.placeholder.com/80'}"
                 width="54" height="54"
                 style="object-fit:cover;border-radius:4px;border:1px solid #eee">

            <div class="title">
                <div>${l.name}</div>
                <div class="qty">x ${l.qty}</div>
            </div>

            <div class="right">${money(lineTotal)}</div>
        `;
        wrap.appendChild(row);
    }

    document.getElementById('subtotal').textContent = money(subtotal);
    document.getElementById('grandTotal').textContent = money(subtotal);

    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = outOfStock;
    btn.textContent = outOfStock ? 'Có sản phẩm vượt tồn kho' : 'Đặt hàng';
}

// ==================== Build order ====================
async function buildOrder() {
    let ctx = getCheckoutCtx();

    // fallback: không có ctx → dùng cart
    if (!ctx) {
        const cart = readCart();
        if (!cart.length) return null;
        ctx = {
            mode: 'cart',
            items: cart.map(x => ({ productId: x.productId, qty: x.qty }))
        };
    }

    if (!ctx.items || !ctx.items.length) return null;

    const lines = [];
    for (const it of ctx.items) {
        const api = await getProductById(it.productId);
        lines.push({
            id: api.id,
            name: api.name,
            price: Number(api.price || 0),
            stock: api.stock,
            image: api.images?.[0] || '',
            qty: Number(it.qty || 1)
        });
    }

    return { mode: ctx.mode || 'single', lines };
}

// ==================== Validation ====================
function validateBilling() {
    const req = ['firstName', 'lastName', 'country', 'address1', 'city', 'phone'];
    for (const id of req) {
        const el = document.getElementById(id);
        if (!el || !el.value.trim()) {
            el?.focus();
            alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
            return false;
        }
    }
    return true;
}

// ==================== Place order ====================
async function placeOrder(payload, mode) {
    try {
        const data = await createOrder(payload);

        alert(`Đặt hàng thành công! Mã đơn: ${data.orderId || 'N/A'}`);

        localStorage.removeItem(CHECKOUT_CTX_KEY);
        if (mode === 'cart') {
            localStorage.removeItem(CART_KEY);
            window.updateCartBadge?.();
        }

        location.href = '/thank-you.html';

    } catch (err) {
        console.error(err);
        alert('Đặt hàng thất bại');
    }
}

// ==================== Init ====================
(async function init() {
    const ctx = await buildOrder();
    if (!ctx) {
        location.href = '/';
        return;
    }

    renderLines(ctx.lines);

    document.getElementById('placeOrderBtn').onclick = async () => {
        if (!validateBilling()) return;

        const payload = {
            customer: {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                company: document.getElementById('company').value.trim(),
                country: document.getElementById('country').value,
                address1: document.getElementById('address1').value.trim(),
                address2: document.getElementById('address2').value.trim(),
                postalCode: document.getElementById('postalCode').value.trim(),
                city: document.getElementById('city').value.trim(),
                phone: document.getElementById('phone').value.trim()
            },
            items: ctx.lines.map(l => ({
                productId: l.id,
                qty: l.qty
            })),
            paymentMethod:
                document.querySelector('input[name="payment"]:checked')?.value || 'cod',
            meta: {
                source: getQuery('src') || (ctx.mode === 'single' ? 'buy-now' : 'cart')
            }
        };

        placeOrder(payload, ctx.mode);
    };
})();
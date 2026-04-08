import { API_BASE } from "../config/env.js";

// ✅ LẤY TẤT CẢ
export async function getProducts() {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

// ✅ THEO CATEGORY
export async function getProductsByCategory(category) {
    const res = await fetch(
        `${API_BASE}/api/products/category/${encodeURIComponent(category)}`
    );
    if (!res.ok) throw new Error('Failed to fetch category');
    return res.json();
}

// ✅ THEO BRAND
export async function getProductsByBrand(brand) {
    const res = await fetch(
        `${API_BASE}/api/products/brand/${encodeURIComponent(brand)}`
    );
    if (!res.ok) throw new Error('Failed to fetch brand');
    return res.json();
}

// ✅ SEARCH
export async function searchProducts(keyword) {
    const res = await fetch(
        `${API_BASE}/api/products/search/${encodeURIComponent(keyword)}`
    );
    if (!res.ok) throw new Error('Failed to search');
    return res.json();
}

/**
 * Detail trong cart
 */
export const getProductDetail = (code) =>
    fetch(`${API_BASE}/api/productDetail/${code}`).then(r => r.json());
/**
 * Detail
 */
export async function getProductById(id) {
    const res = await fetch(`${API_BASE}/api/productDetail/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
}

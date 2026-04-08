import { getProductById } from "/assets/js/services/product.service.js";

const CART_KEY = "cart";
const CHECKOUT_CTX_KEY = "checkout_ctx";
const qs = (s) => document.querySelector(s);

function money(n) {
    return Number(n || 0).toLocaleString("vi-VN") + " đ";
}

// API BE dùng id = "P001"
function getProductId() {
    return new URLSearchParams(window.location.search).get("id");
}

document.addEventListener("DOMContentLoaded", async () => {
    updateCartBadge();

    const id = getProductId(); // ví dụ "P001"
    if (!id) {
        qs("#pdError")?.classList.remove("hidden");
        return;
    }

    try {
        const product = await getProductById(id);
        console.log("✅ product detail:", product);

        renderProduct(product);

        qs("#btnAddToCart")?.addEventListener("click", () =>
            addToCart(product)
        );

        qs("#btnBuyNow")?.addEventListener("click", () => {
            localStorage.setItem(
                CHECKOUT_CTX_KEY,
                JSON.stringify({
                    mode: "single",
                    items: [{ productId: product.id, qty: 1 }],
                })
            );
            location.href = "./checkout.html?src=buy-now";
        });
    } catch (e) {
        console.error("❌ load product failed", e);
        qs("#pdError")?.classList.remove("hidden");
    }
});

function renderProduct(product) {

    // ===== TITLE =====
    qs("#pdTitle").textContent = product.name;


    // ===== PRICE =====
    // 
    qs("#pdPriceSale").textContent = money(product.price);


    // ===== STATUS =====
    // 
    if (product.stock > 0) {

        qs("#pdStatus")?.classList.remove("hidden");

        qs("#pdStatus").textContent = "Còn hàng";

    }

    // ===== MAIN IMAGE =====
    // 
    const mainImg = qs("#pdMainImg");

    mainImg.src = product.thumbnail;

    mainImg.alt = product.name;


    // ===== GALLERY =====
    // 
    const thumbs = qs("#pdThumbs");

    thumbs.innerHTML = "";


    const images = product.images?.length        ? product.images        : [product.thumbnail];


    images.forEach((src, idx) => {

        const img = document.createElement("img");

        img.src = src;

        img.alt = product.name;

        img.className = "pd-thumb" + (idx === 0 ? " active" : "");

        img.onclick = () => {

            mainImg.src = src;

            thumbs                .querySelectorAll(".pd-thumb")

                .forEach(t => t.classList.remove("active"));

            img.classList.add("active");

        };        thumbs.appendChild(img);

    });

    // ===== SPECS =====
    // 
    const specsTable = qs("#pdSpecsTable");

    specsTable.innerHTML = "";


    product.specs?.forEach(spec => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td class="spec-key">${spec.specKey}</td>
            <td class="spec-value">${spec.specValue}</td>
        `;

        specsTable.appendChild(tr);


        // warranty
        // 
        if (spec.specKey.toLowerCase().includes("warranty")) {

            qs("#pdWarrantyMonths").textContent = spec.specValue;

        }

    });

}
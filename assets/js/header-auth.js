
/* =========================
   Header Account Dropdown
   API READY
   ========================= */

const API_BASE = '/api';
const TOKEN_KEY = 'auth_token';

document.addEventListener("DOMContentLoaded", async () => {
    const wrapper = document.querySelector(".account-wrapper");
    const accountBtn = document.getElementById("accountBtn");
    const menu = document.getElementById("accountMenu");
    const btnLogout = document.getElementById("btnLogout");
    const btnProfile = document.getElementById("btnProfile");

    if (!wrapper || !accountBtn || !menu) return;

    const token = localStorage.getItem(TOKEN_KEY);

    /* =======================
       CHƯA ĐĂNG NHẬP
    ======================= */
    if (!token) {
        accountBtn.textContent = "👤 Tài khoản";
        accountBtn.onclick = () => {
            window.location.href = "/Auth/login-register.html";
        };
        return;
    }

    /* =======================
       ĐÃ ĐĂNG NHẬP → FETCH PROFILE
    ======================= */
    let user;
    try {
        const res = await fetch(`${API_BASE}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Unauthorized");
        user = await res.json();
    } catch {
        // Token lỗi / hết hạn → logout cưỡng bức
        localStorage.removeItem(TOKEN_KEY);
        accountBtn.textContent = "👤 Tài khoản";
        accountBtn.onclick = () => {
            window.location.href = "/Auth/login-register.html";
        };
        return;
    }

    // Hiển thị tên
    accountBtn.textContent = `👤 ${user.fullName || user.email}`;

    /* =======================
       TOGGLE MENU
    ======================= */
    accountBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle("open");
    });

    menu.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", () => {
        wrapper.classList.remove("open");
    });

    /* =======================
       PROFILE
    ======================= */
    btnProfile?.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/Auth/profile.html";
    });

    /* =======================
       LOGOUT
    ======================= */
    btnLogout?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        localStorage.removeItem(TOKEN_KEY);
        wrapper.classList.remove("open");

        window.location.href = "/HomePage/homepage.html";
    });
});
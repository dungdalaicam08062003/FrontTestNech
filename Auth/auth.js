

import {
    login,
    register
} from "../assets/js/services/auth.service.js";

const TOKEN_KEY = 'auth_token';

/* =========================================================
   OVERLAY SWITCH (UI giữ nguyên)
========================================================= */
const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");
const container = document.getElementById("authContainer");

signUpBtn?.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});
signInBtn?.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

/* =========================================================
   MESSAGE HELPER
========================================================= */
function showMessage(message, type = "error") {
    let box = document.getElementById("authMessage");
    if (!box) {
        box = document.createElement("div");
        box.id = "authMessage";
        box.className = "auth-message";
        document.body.appendChild(box);
    }

    box.textContent = message;
    box.classList.remove("success", "error");
    box.classList.add(type);

    clearTimeout(box._t);
    box._t = setTimeout(() => box.remove(), 2500);
}

/* =========================================================
   VALIDATION
========================================================= */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =========================================================
   REGISTER
========================================================= */
const registerForm = document.getElementById("registerForm");

registerForm?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const [nameInput, emailInput, passInput] = this.querySelectorAll("input");
    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value;

    if (!fullName || !email || !password)
        return showMessage("Vui lòng nhập đầy đủ thông tin");

    if (!isValidEmail(email))
        return showMessage("Email không hợp lệ");

    if (password.length < 6)
        return showMessage("Mật khẩu tối thiểu 6 ký tự");

    try {
        const res = await register({ fullName, email, password });

        localStorage.setItem(TOKEN_KEY, res.token);

        showMessage("Đăng ký thành công!", "success");
        setTimeout(() => {
            window.location.href = "../HomePage/homepage.html";
        }, 600);

    } catch (err) {
        showMessage(err.message);
    }
});

/* =========================================================
   LOGIN
========================================================= */
const loginForm = document.getElementById("loginForm");

loginForm?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = this.querySelector('input[type="email"]').value.trim();
    const password = this.querySelector('input[type="password"]').value;

    if (!email || !password)
        return showMessage("Vui lòng nhập email và mật khẩu");

    try {
        const res = await login({ email, password });

        localStorage.setItem(TOKEN_KEY, res.token);

        showMessage("Đăng nhập thành công!", "success");
        setTimeout(() => {
            window.location.href = "../HomePage/homepage.html";
        }, 600);

    } catch (err) {
        showMessage(err.message);
    }
});

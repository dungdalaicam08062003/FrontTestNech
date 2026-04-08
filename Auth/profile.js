//const user = JSON.parse(localStorage.getItem("currentUser"));

//if (!user) {
//    window.location.href = "./login-register.html";
//}

//// Load data
//document.getElementById("fullName").value = user.fullName || "";
//document.getElementById("email").value = user.email || "";

//document.getElementById("profileForm").addEventListener("submit", function (e) {
//    e.preventDefault();

//    const fullName = fullName.value.trim();
//    const currentPassword = currentPassword.value;
//    const newPassword = newPassword.value;
//    const confirmPassword = confirmPassword.value;

//    user.fullName = fullName;

//    if (currentPassword || newPassword || confirmPassword) {
//        if (currentPassword !== user.password) {
//            alert("Mật khẩu hiện tại không đúng");
//            return;
//        }

//        if (newPassword.length < 6) {
//            alert("Mật khẩu mới tối thiểu 6 ký tự");
//            return;
//        }

//        if (newPassword !== confirmPassword) {
//            alert("Xác nhận mật khẩu không khớp");
//            return;
//        }

//        user.password = newPassword;
//    }

//    localStorage.setItem("currentUser", JSON.stringify(user));

//    const users = JSON.parse(localStorage.getItem("users")) || [];
//    const index = users.findIndex(u => u.id === user.id);
//    if (index !== -1) {
//        users[index] = user;
//        localStorage.setItem("users", JSON.stringify(users));
//    }

//    alert("Cập nhật thành công");
//});

/* =========================
   Profile – API READY
   ========================= */

import {
    getMyProfile,
    updateMyProfile
} from "../assets/js/services/user.service.js";

const TOKEN_KEY = 'auth_token';

const qs = (s) => document.querySelector(s);

/* ---------- Auth ---------- */
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function requireAuth() {
    if (!getToken()) {
        window.location.href = './login-register.html';
    }
}

/* ---------- Init ---------- */
(async function init() {
    requireAuth();

    const token = getToken();
    let user;

    try {
        user = await getMyProfile(token);
    } catch {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = './login-register.html';
        return;
    }

    qs('#fullName').value = user.fullName || '';
    qs('#email').value = user.email || '';

    qs('#profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = qs('#fullName').value.trim();
        const currentPassword = qs('#currentPassword').value;
        const newPassword = qs('#newPassword').value;
        const confirmPassword = qs('#confirmPassword').value;

        if (!fullName) {
            alert('Vui lòng nhập họ tên');
            return;
        }

        if (newPassword || currentPassword || confirmPassword) {
            if (newPassword.length < 6) {
                alert('Mật khẩu mới tối thiểu 6 ký tự');
                return;
            }
            if (newPassword !== confirmPassword) {
                alert('Xác nhận mật khẩu không khớp');
                return;
            }
        }

        try {
            await updateMyProfile({
                fullName,
                currentPassword: currentPassword || null,
                newPassword: newPassword || null
            }, token);

            alert('Cập nhật thông tin thành công');

            // clear password fields
            qs('#currentPassword').value = '';
            qs('#newPassword').value = '';
            qs('#confirmPassword').value = '';

        } catch (err) {
            alert(err.message || 'Cập nhật thất bại');
        }
    });
})();
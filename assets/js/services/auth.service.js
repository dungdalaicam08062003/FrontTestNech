import { API_BASE } from "../config/env.js";

export async function login(data) {
    const res = await fetch(`${API_BASE}/api/login/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Login failed");
    }

    return res.json();
}

export async function register(data) {
    const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Signup failed");
    }

    return res.json();
}
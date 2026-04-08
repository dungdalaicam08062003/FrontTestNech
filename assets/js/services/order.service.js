import { API_BASE } from "../config/env.js";

export const createOrder = (data) =>
    fetch(`${API_BASE}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(r => r.json());
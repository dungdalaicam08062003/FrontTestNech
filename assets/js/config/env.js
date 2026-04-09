// wwwroot/assets/js/config/env.js

export const MODE = "PROD";
// MOCK | DEV | PROD

const CONFIG = {
    MOCK: {
        API_BASE: "http://localhost:3000"
    },
    DEV: {
        API_BASE: "http://localhost:5000"
    },
    PROD: {
        API_BASE: "https://testnest-jcdx.onrender.com"
    }

};

export const API_BASE = CONFIG[MODE].API_BASE;

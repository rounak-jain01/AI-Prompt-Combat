// src/config.js

// Yeh automatically environment ke hisaab se URL utha lega
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// Console log karke check kar sakte hain ki kaunsa URL le raha hai
console.log("Current API URL:", API_BASE_URL);
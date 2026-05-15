import { toastFn } from "@/utils";
import { getAuthToken } from "../socketStore/authStore";

let isRedirecting = false;

const handleUnauthorized = () => {
    if (isRedirecting) return;

    isRedirecting = true;
    localStorage.clear();
    toastFn("error", "Session expired. Please login again.");
    window.location.href = "/";
};

const parseResponse = async (response) => {
    if (response.status === 401) {
        handleUnauthorized();
        return;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

export const apiClient = async (url, options = {}) => {
    const token = getAuthToken();

    const headers = new Headers(options.headers || {});

    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    return parseResponse(response);
};
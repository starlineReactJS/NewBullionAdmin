import { apiClient } from "./apiClient";
import { apiUrl } from "../../Config";
import { getAuthName } from "../socketStore/authStore";

/* ---------------- GET ---------------- */

export const get = async (endpoint, data, baseUrl = apiUrl,) => {
  let url = baseUrl + endpoint;

  const userName = getAuthName();

  const finalData = {
    ...data,
    user: userName,
  };

  if (finalData && Object.keys(finalData).length) {
    const queryParams = new URLSearchParams(finalData).toString();
    url += `?${queryParams}`;
  }

  return apiClient(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

/* ---------------- POST ---------------- */

export const post = async (endpoint, data, baseUrl = apiUrl, type = "json") => {
  const url = baseUrl + endpoint;

  const isLoginApi = endpoint === "/manage/auth/login";
  const isCostingAPi = endpoint === "/manage/costing/save";

  let body;
  let headers = {};
  if (type === "formData") {
    const userName = getAuthName();

    if (!isLoginApi && userName) {
      data.append("user", userName);
    }

    body = data;

  } else {
    headers["Content-Type"] = "application/json";

    const userName = getAuthName();

    body = JSON.stringify(
      isLoginApi || isCostingAPi
        ? data
        : { ...data, user: userName }
    );
  }

  return apiClient(url, {
    method: "POST",
    headers,
    body,
  });
};

/* ---------------- DELETE ---------------- */

export const del = async (endpoint, data, baseUrl = apiUrl) => {
  let url = baseUrl + endpoint;

  if (data?.id) {
    url += `/${data.id}`;
  }

  return apiClient(url, {
    method: "DELETE",
  });
};
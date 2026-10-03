
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://agasaro-shop.onrender.com";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("agasaro_token");
}

export function setToken(token) {
  localStorage.setItem("agasaro_token", token);
}

export function clearToken() {
  localStorage.removeItem("agasaro_token");
}

async function readError(response) {
  try {
    const data = await response.json();
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map((item) => item.msg).join(", ");
    }
    return JSON.stringify(data);
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await readError(response);
    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
}

export const api = {
  get: (path, auth = false) => request(path, { method: "GET", auth }),
  post: (path, body, auth = false) => request(path, { method: "POST", body, auth }),
  put: (path, body, auth = false) => request(path, { method: "PUT", body, auth }),
  del: (path, auth = false) => request(path, { method: "DELETE", auth }),
};

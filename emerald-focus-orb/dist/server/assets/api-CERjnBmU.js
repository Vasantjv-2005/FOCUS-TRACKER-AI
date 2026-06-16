const API_BASE = "http://localhost:5000/api";
async function request(path, init = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...init.headers || {}
  };
  try {
    const token = await window.Clerk?.session?.getToken();
    console.log(`📡 [API CLIENT] Path: ${path} | Has Clerk Token: ${token ? "YES" : "NO"}`);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Could not get Clerk session token:", err);
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}
async function startSessionApi() {
  return request("/session/start", {
    method: "POST"
  });
}
async function endSessionApi(sessionId) {
  return request("/session/end", {
    method: "POST",
    body: JSON.stringify({ sessionId })
  });
}
async function saveFocusSnapshot(payload) {
  return request("/focus/save", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
async function fetchSessionReport(sessionId) {
  return request(`/report/${sessionId}`, { method: "GET" });
}
async function fetchDashboardStats() {
  return request("/session/stats", { method: "GET" });
}
async function fetchAllSessions() {
  return request("/session/all", { method: "GET" });
}
export {
  startSessionApi as a,
  fetchAllSessions as b,
  fetchSessionReport as c,
  endSessionApi as e,
  fetchDashboardStats as f,
  saveFocusSnapshot as s
};

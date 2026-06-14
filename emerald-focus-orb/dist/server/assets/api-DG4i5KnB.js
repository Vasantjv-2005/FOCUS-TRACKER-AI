const API_BASE = "http://localhost:5000/api";
async function request(path, init = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init.headers || {}
    },
    ...init
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
export {
  startSessionApi as a,
  endSessionApi as e,
  fetchSessionReport as f,
  saveFocusSnapshot as s
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> || {}),
  };

  try {
    const token = await (window as any).Clerk?.session?.getToken();
    console.log(`📡 [API CLIENT] Path: ${path} | Has Clerk Token: ${token ? "YES" : "NO"}`);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Could not get Clerk session token:", err);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data as T;
}

export interface SessionRecord {
  _id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  averageFocusScore?: number;
  totalDistractions?: number;
}

export interface FocusSnapshotPayload {
  sessionId: string;
  focusScore: number;
  eyeDetected: boolean;
  faceDetected: boolean;
  lookingAway: boolean;
}

export interface ReportResponse {
  success: boolean;
  averageFocusScore: number;
  totalRecords: number;
  distractionCount: number;
  focusLogs: Array<{
    _id: string;
    focusScore: number;
    lookingAway: boolean;
    createdAt: string;
  }>;
}

export interface DashboardStatsResponse {
  success: boolean;
  stats: {
    currentFocus: number;
    todayStudy: string;
    weeklyAvg: number;
    totalSessions: number;
    distractions: {
      lookingAway: number;
      attentionDrops: number;
    };
  };
}

export interface AnalyticsResponse {
  success: boolean;
  daily: Array<{ day: string; score: number }>;
  weekly: Array<{ w: string; score: number }>;
  monthly: Array<{ m: string; score: number }>;
  distribution: Array<{ name: string; value: number; color: string }>;
}

export async function startSessionApi() {
  return request<{ success: boolean; message: string; session: SessionRecord }>("/session/start", {
    method: "POST",
  });
}

export async function endSessionApi(sessionId: string) {
  return request<{ success: boolean; message: string; session: SessionRecord }>("/session/end", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
}

export async function saveFocusSnapshot(payload: FocusSnapshotPayload) {
  return request<{ success: boolean; message: string; focusLog: unknown }>("/focus/save", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchSessionReport(sessionId: string) {
  return request<ReportResponse>(`/report/${sessionId}`, { method: "GET" });
}

export async function fetchDashboardStats() {
  return request<DashboardStatsResponse>("/session/stats", { method: "GET" });
}

export async function fetchAnalyticsData() {
  return request<AnalyticsResponse>("/session/analytics", { method: "GET" });
}

export async function fetchAllSessions() {
  return request<{ success: boolean; sessions: SessionRecord[] }>("/session/all", { method: "GET" });
}


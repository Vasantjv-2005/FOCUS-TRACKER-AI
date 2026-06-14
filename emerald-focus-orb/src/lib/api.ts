const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
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

const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-tut-production.up.railway.app/api/v1";

// Token storage in memory
let accessToken = null;
let refreshToken = localStorage.getItem("refresh_token") || null;

export function setTokens(access, refresh) {
  accessToken = access;
  if (refresh) {
    refreshToken = refresh;
    localStorage.setItem("refresh_token", refresh);
  }
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("refresh_token");
}

export function getRefreshToken() {
  return refreshToken;
}

async function refreshAccessToken() {
  if (!refreshToken) throw new Error("No refresh token");
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) {
    clearTokens();
    throw new Error("Session expired");
  }
  const data = await res.json();
  setTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

async function request(method, path, body, retry = true) {
  const headers = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken();
      return request(method, path, body, false);
    } catch {
      clearTokens();
      window.location.href = "/";
      throw new Error("Session expired");
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  patch: (path, body) => request("PATCH", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};

// ── Auth ──
export const auth = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),
  register: (full_name, email, password, referral_code, phone) =>
    api.post("/auth/register", { full_name, email, password, referral_code, phone: phone || "" }),
};

// ── User ──
export const users = {
  me: () => api.get("/users/me"),
  update: (data) => api.patch("/users/me", data),
  referrals: () => api.get("/users/me/referrals"),
  referralList: () => api.get("/users/me/referrals/list"),
};

// ── Subscriptions ──
export const subscriptions = {
  create: () => api.post("/subscriptions/"),
  me: () => api.get("/subscriptions/me"),
  cancel: () => api.post("/subscriptions/cancel"),
};

// ── Courses ──
export const courses = {
  list: () => api.get("/courses/"),
  get: (id) => api.get(`/courses/${id}`),
  lessons: (courseId) => api.get(`/courses/${courseId}/lessons`),
  progress: (courseId) => api.get(`/courses/${courseId}/progress`),
  updateProgress: (courseId, lessonId, data) =>
    api.put(`/courses/${courseId}/lessons/${lessonId}/progress`, data),
};

// ── Chat ──
export const chat = {
  send: (message, session_id, lesson_id) =>
    api.post("/chat/messages", { message, session_id, lesson_id }),
  sessions: () => api.get("/chat/sessions"),
  messages: (sessionId) => api.get(`/chat/sessions/${sessionId}/messages`),
};

// ── Payouts ──
export const payouts = {
  mine: () => api.get("/payouts/me"),
  commissions: () => api.get("/payouts/me/commissions"),
};

// ── Support ──
export const support = {
  create: (data) => api.post("/support/", data),
};

// ── Admin ──
export const admin = {
  users: (limit=200) => api.get("/admin/users?limit="+limit),
  dashboard: () => api.get("/admin/dashboard"),
  updateRole: (userId, role) => api.patch("/admin/users/"+userId+"/role", { role }),
  payouts: (limit=200) => api.get("/admin/payouts?limit="+limit),
  triggerPayouts: () => api.post("/admin/payouts/trigger"),
  activateSubscription: (userId) => api.post("/admin/users/"+userId+"/subscription/activate"),
  cancelSubscription: (userId) => api.post("/admin/users/"+userId+"/subscription/cancel"),
  createUser: (data) => api.post("/admin/users/create", data),
  deleteUser: (userId) => api.delete("/admin/users/"+userId),
  createCourse: (data) => api.post("/courses/", data),
  patchCourse: (id, data) => api.patch("/courses/"+id, data),
  deleteCourse: (id) => api.delete("/courses/"+id),
  getLessons: (courseId) => api.get("/courses/"+courseId+"/lessons"),
  createLesson: (courseId, data) => api.post("/courses/"+courseId+"/lessons", data),
  updateLesson: (courseId, lessonId, data) => api.patch("/courses/"+courseId+"/lessons/"+lessonId, data),
  deleteLesson: (courseId, lessonId) => api.delete("/courses/"+courseId+"/lessons/"+lessonId),
};

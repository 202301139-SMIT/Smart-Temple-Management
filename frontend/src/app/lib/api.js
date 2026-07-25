const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5151/api/v1";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(payload.message || payload.error || "Request failed");
  }

  return payload.data ?? payload;
}

export const api = {
  login: (body) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  registerPilgrim: (body) =>
    request("/auth/register-pilgrim", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  logout: () => request("/auth/logout", { method: "POST" }),
  profile: () => request("/auth/profile"),
  tomorrowForecast: () => request("/forecast/tomorrow"),
  next7DaysForecast: () => request("/forecast/next-7-days"),
  forecastHistory: () => request("/forecast/history"),
  forecastMetrics: () => request("/forecast/metrics"),
  adminSummary: () => request("/forecast/admin/summary"),
  staffStatistics: () => request("/staff/statistics"),
  actualRecords: () => request("/actuals/records"),
  addActualCount: (body) =>
    request("/actuals/add", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

import axios from "axios";

/**
 * 🌍 BASE URL (Vite)
 * Utilise VITE_API_URL dans .env
 */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * 🚀 Instance Axios
 */
const api = axios.create({
  baseURL: BASE,
});

/**
 * 🔐 Interceptor REQUEST (ajout token)
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ⚠️ Interceptor RESPONSE (gestion 401)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* =========================
   🔐 AUTH
========================= */
export const authAPI = {
  login:    (data: any) => api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
  me:       ()          => api.get("/auth/me"),
  logout:   ()          => api.post("/auth/logout"),
};

/* =========================
   📊 DASHBOARD
========================= */
export const dashAPI = {
  admin:     () => api.get("/dashboard/admin"),
  chauffeur: () => api.get("/dashboard/chauffeur"),
};

/* =========================
   🚨 ALERTES
========================= */
export const alertesAPI = {
  getAll:       (params?: any)                => api.get("/alertes", { params }),
  getMap:       ()                            => api.get("/alertes/map"),
  getOne:       (id: number)                  => api.get(`/alertes/${id}`),
  create:       (formData: FormData)          =>
    api.post("/alertes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateStatut: (id: number, statut: string) =>
    api.patch(`/alertes/${id}/statut`, { statut }),
};

/* =========================
   🚛 INTERVENTIONS
========================= */
export const interventionsAPI = {
  getAll:   ()                   => api.get("/interventions"),
  create:   (alerteId: number)  => api.post("/interventions", { alerteId }),
  terminer: (id: number)        => api.patch(`/interventions/${id}/fin`),
};

/* =========================
   📄 RAPPORTS
========================= */
export const rapportsAPI = {
  getAll:  ()                  => api.get("/rapports"),
  create:  (formData: FormData) =>
    api.post("/rapports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  valider: (id: number, statut: string) =>
    api.patch(`/rapports/${id}/valider`, { statut }),
};

/* =========================
   🔔 NOTIFICATIONS
========================= */
export const notifAPI = {
  get:      () => api.get("/notifications"),
  markRead: () => api.patch("/notifications/read"),
};

/* =========================
   📍 ZONES
========================= */
export const zonesAPI = {
  getAll: ()        => api.get("/zones"),
  create: (data:any)=> api.post("/zones", data),
};

/* =========================
   👥 USERS
========================= */
export const usersAPI = {
  getAll: () => api.get("/users"),
};

export default api;
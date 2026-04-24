import { create } from "zustand";

interface User { id: number; name: string; email: string; role: string; phone?: string; }

interface AppState {
  user:      User | null;
  token:     string | null;
  unread:    number;
  setUser:   (u: User | null) => void;
  setToken:  (t: string | null) => void;
  setUnread: (n: number) => void;
  logout:    () => void;
}

export const useStore = create<AppState>((set) => ({
  user:    JSON.parse(localStorage.getItem("user") || "null"),
  token:   localStorage.getItem("token"),
  unread:  0,
  setUser:  (user)  => { set({ user }); localStorage.setItem("user", JSON.stringify(user)); },
  setToken: (token) => { set({ token }); token ? localStorage.setItem("token", token) : localStorage.removeItem("token"); },
  setUnread:(n)     => set({ unread: n }),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, unread: 0 });
  },
}));

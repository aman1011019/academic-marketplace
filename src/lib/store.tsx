import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { Project } from "./mock-data";
import { projects } from "./mock-data";

// ----- Theme -----
type Theme = "light" | "dark";
type ThemeCtx = { theme: Theme; toggle: () => void };
const ThemeContext = createContext<ThemeCtx>({ theme: "light", toggle: () => {} });

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const initial: Theme = saved ?? (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
  }, []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);

// ----- Auth -----
export type User = { id: string; name: string; email: string; role: "user" | "admin"; avatar?: string };
type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};
const AuthContext = createContext<AuthCtx>({} as AuthCtx);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("auth_user");
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setLoading(false);
  }, []);
  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem("auth_user", JSON.stringify(u));
    else localStorage.removeItem("auth_user");
  };
  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    if (!email || !password) throw new Error("Invalid credentials");
    const role: "user" | "admin" = email.toLowerCase().startsWith("admin") ? "admin" : "user";
    persist({ id: "u_" + Date.now(), name: email.split("@")[0], email, role });
    toast.success(`Welcome back, ${email.split("@")[0]}`);
  };
  const register = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    if (!name || !email || !password) throw new Error("Missing fields");
    persist({ id: "u_" + Date.now(), name, email, role: "user" });
    toast.success("Account created!");
  };
  const logout = () => {
    persist(null);
    toast("Signed out");
  };
  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

// ----- Wishlist + Purchases -----
type ListCtx = {
  wishlist: string[];
  toggleWish: (id: string) => void;
  isWished: (id: string) => boolean;
  purchases: string[];
  purchase: (id: string) => void;
  isPurchased: (id: string) => boolean;
  notifications: { id: string; title: string; body: string; date: string; read: boolean }[];
  markAllRead: () => void;
};
const ListContext = createContext<ListCtx>({} as ListCtx);

function ListProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [purchases, setPurchases] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<ListCtx["notifications"]>([
    { id: "n1", title: "Welcome to ProjectHub", body: "Browse 700+ academic projects across 14 categories.", date: new Date().toISOString(), read: false },
    { id: "n2", title: "New AI projects added", body: "12 new AI/ML projects are now live.", date: new Date(Date.now() - 86400000).toISOString(), read: false },
    { id: "n3", title: "Festive discount", body: "Use code STUDY20 for 20% off this week.", date: new Date(Date.now() - 86400000 * 3).toISOString(), read: true },
  ]);

  useEffect(() => {
    try {
      const w = localStorage.getItem("wishlist");
      const p = localStorage.getItem("purchases");
      if (w) setWishlist(JSON.parse(w));
      if (p) setPurchases(JSON.parse(p));
    } catch {}
  }, []);
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem("purchases", JSON.stringify(purchases)); }, [purchases]);

  return (
    <ListContext.Provider
      value={{
        wishlist,
        toggleWish: (id) =>
          setWishlist((w) => {
            const next = w.includes(id) ? w.filter((x) => x !== id) : [...w, id];
            toast(w.includes(id) ? "Removed from wishlist" : "Added to wishlist");
            return next;
          }),
        isWished: (id) => wishlist.includes(id),
        purchases,
        purchase: (id) => {
          setPurchases((p) => (p.includes(id) ? p : [...p, id]));
          const proj = projects.find((x) => x.id === id);
          setNotifications((n) => [
            { id: "n" + Date.now(), title: "Purchase successful", body: `You can now download "${proj?.title}".`, date: new Date().toISOString(), read: false },
            ...n,
          ]);
        },
        isPurchased: (id) => purchases.includes(id),
        notifications,
        markAllRead: () => setNotifications((n) => n.map((x) => ({ ...x, read: true }))),
      }}
    >
      {children}
    </ListContext.Provider>
  );
}
export const useStore = () => useContext(ListContext);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ListProvider>{children}</ListProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// ----- Mock Razorpay-style checkout -----
export function openCheckout(opts: { amount: number; name: string; onSuccess: () => void }) {
  // Real impl: load https://checkout.razorpay.com/v1/checkout.js and call new window.Razorpay(...).open()
  // Mock: confirm prompt
  const ok = window.confirm(`Pay ₹${opts.amount} for "${opts.name}"?\n\n(Razorpay test mode — click OK to simulate success)`);
  if (ok) {
    toast.loading("Processing payment...", { id: "pay" });
    setTimeout(() => {
      toast.success("Payment successful!", { id: "pay" });
      opts.onSuccess();
    }, 900);
  }
}

export function helpers() {
  return projects;
}

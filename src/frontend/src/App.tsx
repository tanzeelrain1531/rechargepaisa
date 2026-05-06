import { Toaster } from "@/components/ui/sonner";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Suspense, lazy, useEffect, useState } from "react";
import { createActor } from "./backend";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const Games = lazy(() => import("./pages/Games"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const WithdrawPage = lazy(() => import("./pages/WithdrawPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminGames = lazy(() => import("./pages/AdminGames"));
const AdminWithdrawals = lazy(() => import("./pages/AdminWithdrawals"));
const AdminRevenue = lazy(() => import("./pages/AdminRevenue"));

export type UserPage =
  | "home"
  | "games"
  | "wallet"
  | "transactions"
  | "withdraw";
export type AdminPage =
  | "admin-dashboard"
  | "admin-users"
  | "admin-games"
  | "admin-withdrawals"
  | "admin-revenue";
export type AppPage = UserPage | AdminPage;

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm">
          Loading RechargePaisa...
        </p>
      </div>
    </div>
  );
}

function LoginScreen({
  onLogin,
  isLoggingIn,
}: { onLogin: () => void; isLoggingIn: boolean }) {
  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center"
      data-ocid="login.page"
    >
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <span
              className="text-3xl font-black text-primary"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              RP
            </span>
          </div>
          <div className="text-center">
            <h1
              className="text-3xl font-black tracking-tight"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              <span className="text-primary">Recharge</span>
              <span className="text-foreground">Paisa</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              India's #1 Real-Money Gaming Platform
            </p>
          </div>
        </div>

        {/* Hero visual */}
        <div className="rounded-2xl overflow-hidden mb-8 border border-border">
          <img
            src="/assets/generated/hero-gaming.dim_800x500.jpg"
            alt="Games"
            className="w-full h-40 object-cover object-top"
          />
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { emoji: "🎮", label: "Real Games" },
            { emoji: "💰", label: "Real Paisa" },
            { emoji: "🎁", label: "10p Bonus" },
          ].map((f) => (
            <div
              key={f.label}
              className="bg-card border border-border rounded-xl p-3 text-center"
            >
              <div className="text-2xl mb-1">{f.emoji}</div>
              <div className="text-xs font-semibold text-foreground">
                {f.label}
              </div>
            </div>
          ))}
        </div>

        {/* Login button */}
        <button
          type="button"
          data-ocid="login.primary_button"
          onClick={onLogin}
          disabled={isLoggingIn}
          className="w-full py-4 rounded-xl font-bold text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 shadow-lg"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          {isLoggingIn ? "Connecting..." : "Login & Start Playing"}
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Naya user? Sign in karo aur paao{" "}
          <span className="text-primary font-semibold">10 Paisa FREE</span>{" "}
          instantly!
        </p>

        <p className="text-center text-xs text-muted-foreground/50 mt-8">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-muted-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

function AppShell() {
  const { login, clear, loginStatus, isInitializing } = useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);
  const isLoggingIn = loginStatus === "logging-in";
  const isLoggedIn = loginStatus === "success";

  const [page, setPage] = useState<AppPage>("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUserViewMode, setIsUserViewMode] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [checking, setChecking] = useState(false);

  // On login, register user and check admin
  useEffect(() => {
    if (!actor || isFetching || !isLoggedIn || registered || checking) return;
    setChecking(true);
    const init = async () => {
      try {
        await (
          actor as unknown as { registerUser: () => Promise<unknown> }
        ).registerUser();
        const adminStatus = await (
          actor as unknown as { isAdmin: () => Promise<boolean> }
        ).isAdmin();
        setIsAdmin(adminStatus);
        if (adminStatus) setPage("admin-dashboard");
        else setPage("home");
      } catch {
        // already registered or not admin — proceed normally
        try {
          const adminStatus = await (
            actor as unknown as { isAdmin: () => Promise<boolean> }
          ).isAdmin();
          setIsAdmin(adminStatus);
          if (adminStatus) setPage("admin-dashboard");
        } catch {
          /* ignore */
        }
      } finally {
        setRegistered(true);
        setChecking(false);
      }
    };
    void init();
  }, [actor, isFetching, isLoggedIn, registered, checking]);

  if (isInitializing) return <LoadingScreen />;
  if (!isLoggedIn)
    return <LoginScreen onLogin={login} isLoggingIn={isLoggingIn} />;
  if (!registered && checking) return <LoadingScreen />;

  const showUserPages = !isAdmin || isUserViewMode;

  return (
    <Layout
      page={page}
      setPage={setPage}
      isAdmin={isAdmin}
      isUserViewMode={isUserViewMode}
      setIsUserViewMode={(val) => {
        setIsUserViewMode(val);
        setPage(val ? "home" : "admin-dashboard");
      }}
      onLogout={clear}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        }
      >
        {showUserPages ? (
          <>
            {page === "home" && <Home page={page} setPage={setPage} />}
            {page === "games" && <Games />}
            {page === "wallet" && <WalletPage setPage={setPage} />}
            {page === "transactions" && <TransactionsPage />}
            {page === "withdraw" && <WithdrawPage />}
            {!["home", "games", "wallet", "transactions", "withdraw"].includes(
              page,
            ) && <Home page="home" setPage={setPage} />}
          </>
        ) : (
          <>
            {page === "admin-dashboard" && <AdminDashboard setPage={setPage} />}
            {page === "admin-users" && <AdminUsers />}
            {page === "admin-games" && <AdminGames />}
            {page === "admin-withdrawals" && <AdminWithdrawals />}
            {page === "admin-revenue" && <AdminRevenue />}
            {![
              "admin-dashboard",
              "admin-users",
              "admin-games",
              "admin-withdrawals",
              "admin-revenue",
            ].includes(page) && <AdminDashboard setPage={setPage} />}
          </>
        )}
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <>
      <AppShell />
      <Toaster />
    </>
  );
}

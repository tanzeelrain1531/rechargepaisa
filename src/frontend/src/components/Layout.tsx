import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMyWallet } from "@/hooks/useBackend";
import { formatPaisa } from "@/lib/backendTypes";
import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  EyeOff,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import type { AppPage } from "../App";

interface LayoutProps {
  children: ReactNode;
  page: AppPage;
  setPage: (p: AppPage) => void;
  isAdmin: boolean;
  isUserViewMode?: boolean;
  setIsUserViewMode?: (val: boolean) => void;
  onLogout: () => void;
}

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ElementType;
}

const USER_NAV: NavItem[] = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "transactions", label: "Transactions", icon: ClipboardList },
  { id: "withdraw", label: "Withdraw", icon: ArrowUpRight },
];

const ADMIN_NAV: NavItem[] = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "admin-users", label: "Users", icon: Users },
  { id: "admin-games", label: "Games Mgmt", icon: Gamepad2 },
  { id: "admin-withdrawals", label: "Withdrawals", icon: ArrowDownLeft },
  { id: "admin-revenue", label: "Revenue", icon: BarChart3 },
];

export default function Layout({
  children,
  page,
  setPage,
  isAdmin,
  isUserViewMode = false,
  setIsUserViewMode,
  onLogout,
}: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: wallet } = useMyWallet();
  const navItems = isAdmin && !isUserViewMode ? ADMIN_NAV : USER_NAV;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 flex-shrink-0",
          collapsed ? "w-16" : "w-60",
        )}
        data-ocid="layout.sidebar"
      >
        {/* Header / Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border min-h-[72px]">
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
            <span
              className="text-sm font-black text-primary"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              RP
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div
                className="font-black text-base leading-tight"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                <span className="text-primary">Recharge</span>
                <span className="text-sidebar-foreground">Paisa</span>
              </div>
              {isAdmin && (
                <Badge className="mt-0.5 text-[10px] px-1.5 py-0 bg-accent/20 text-accent border-accent/30 border">
                  <ShieldCheck className="w-2.5 h-2.5 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Wallet balance (user only, or admin in user view mode) */}
        {(!isAdmin || isUserViewMode) && !collapsed && wallet && (
          <div className="mx-3 mt-3 mb-1 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 px-3 py-2.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
              Your Balance
            </p>
            <p
              className="text-lg font-black text-primary"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              {formatPaisa(wallet.balance)}
            </p>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3 space-y-0.5" data-ocid="layout.nav">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              data-ocid={`nav.${id}`}
              onClick={() => setPage(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                page === id
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5",
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && page === id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 pb-4 space-y-0.5 border-t border-sidebar-border pt-3">
          {/* User View toggle — only for admin */}
          {isAdmin && !isUserViewMode && setIsUserViewMode && (
            <button
              type="button"
              data-ocid="nav.user_view_toggle"
              onClick={() => setIsUserViewMode(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-secondary border border-secondary/30 bg-secondary/10 hover:bg-secondary/20 transition-all"
            >
              <Eye className="w-4.5 h-4.5 flex-shrink-0" />
              {!collapsed && <span>User Mode Dekho</span>}
            </button>
          )}
          <button
            type="button"
            data-ocid="nav.settings"
            onClick={() => {}}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5 transition-all"
          >
            <Settings className="w-4.5 h-4.5 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </button>
          <button
            type="button"
            data-ocid="nav.logout"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <Separator className="bg-sidebar-border" />
        <button
          type="button"
          data-ocid="layout.collapse_toggle"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-3 text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* User View Mode sticky banner */}
        {isAdmin && isUserViewMode && setIsUserViewMode && (
          <div
            className="flex items-center justify-between px-6 py-2.5 bg-accent text-accent-foreground border-b border-accent/50 flex-shrink-0"
            data-ocid="layout.user_view_banner"
          >
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4" />
              <span className="text-sm font-semibold">
                Admin — User View Mode
              </span>
              <span className="text-xs opacity-80">
                (Aap user ka view dekh rahe hain)
              </span>
            </div>
            <button
              type="button"
              data-ocid="layout.back_to_admin_button"
              onClick={() => setIsUserViewMode(false)}
              className="flex items-center gap-1.5 bg-accent-foreground/15 hover:bg-accent-foreground/25 border border-accent-foreground/30 rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Admin Panel Par Wapas Jaao
            </button>
          </div>
        )}
        {/* Top bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              {getPageTitle(page)}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAdmin && !isUserViewMode
                ? "Admin Panel"
                : "Khelo, Jeeto, Kamao!"}
            </p>
          </div>
          {(!isAdmin || isUserViewMode) && wallet && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-xl px-4 py-2">
              <Wallet className="w-4 h-4 text-primary" />
              <span
                className="text-primary font-bold text-sm"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                {formatPaisa(wallet.balance)}
              </span>
            </div>
          )}
          {isAdmin && !isUserViewMode && (
            <div className="flex items-center gap-2 bg-accent/10 border border-accent/25 rounded-xl px-4 py-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-accent font-bold text-sm">Admin Mode</span>
            </div>
          )}
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-6">{children}</div>

        {/* Footer */}
        <footer className="bg-card/50 border-t border-border px-6 py-3 text-center">
          <p className="text-xs text-muted-foreground/50">
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
        </footer>
      </main>
    </div>
  );
}

function getPageTitle(page: AppPage): string {
  const titles: Record<AppPage, string> = {
    home: "Dashboard",
    games: "Game Library",
    wallet: "My Wallet",
    transactions: "Transactions",
    withdraw: "Withdraw",
    "admin-dashboard": "Admin Dashboard",
    "admin-users": "User Management",
    "admin-games": "Games Management",
    "admin-withdrawals": "Withdrawal Requests",
    "admin-revenue": "Revenue & Stats",
  };
  return titles[page] ?? "Dashboard";
}

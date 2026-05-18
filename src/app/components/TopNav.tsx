import { Search, Moon, Sun, ShieldCheck, LogOut, FileText, CornerDownLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../../utils/auth";
import { MOCK_REPORT_SESSIONS, MOCK_USER } from "../../services/api.mock";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/reports", label: "Reports" },
  { to: "/settings", label: "Settings" },
];

type SessionLite = {
  id: string;
  fileName: string;
  auditedAt: string;
  criticalCount: number;
  findingsCount: number;
};

const SESSIONS = MOCK_REPORT_SESSIONS as SessionLite[];

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isThemeWiping, setIsThemeWiping] = useState(false);

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SESSIONS.filter((s) => s.fileName.toLowerCase().includes(q)).slice(
      0,
      5
    );
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [searchOpen]);

  const toggleTheme = () => {
    setIsThemeWiping(true);
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }, 400);
    setTimeout(() => {
      setIsThemeWiping(false);
    }, 800);
  };

  const handleSignOut = () => {
    clearToken();
    navigate("/login");
  };

  const goToReports = (params: URLSearchParams) => {
    const search = params.toString();
    navigate(`/reports${search ? `?${search}` : ""}`);
    setSearchOpen(false);
    setQuery("");
  };

  const handleSelectMatch = (id: string) => {
    const params = new URLSearchParams();
    params.set("selected", id);
    goToReports(params);
  };

  const handleSubmitQuery = () => {
    const q = query.trim();
    if (!q) return;
    const params = new URLSearchParams();
    params.set("q", q);
    goToReports(params);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (matches.length === 0) return;
      setActiveIndex((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (matches.length === 0) return;
      setActiveIndex((i) => (i - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (matches.length > 0 && searchOpen) {
        handleSelectMatch(matches[activeIndex].id);
      } else {
        handleSubmitQuery();
      }
    } else if (e.key === "Escape") {
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0 z-20 relative">
        {/* Left: brand */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">PulseGuard</span>
          <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">
            v1.0
          </span>
        </div>

        {/* Center: nav + search */}
        <div className="flex-1 flex items-center justify-center gap-8 mx-4">
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "px-3 py-2 text-sm font-medium transition-colors border-b-2",
                    isActive
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative max-w-xs flex-1" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search past audits..."
              className="w-full bg-secondary border border-transparent focus:border-primary focus:bg-background transition-colors rounded-full py-1.5 pl-9 pr-4 text-sm outline-none"
            />

            {searchOpen && query.trim() !== "" && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-40">
                {matches.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    No audits match "{query}"
                  </div>
                ) : (
                  <>
                    {matches.map((m, i) => (
                      <button
                        key={m.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectMatch(m.id);
                        }}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={[
                          "w-full text-left px-3 py-2 flex items-center gap-3 transition-colors",
                          i === activeIndex
                            ? "bg-secondary"
                            : "bg-transparent hover:bg-secondary",
                        ].join(" ")}
                      >
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {m.fileName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatShortDate(m.auditedAt)} · {m.findingsCount} finding{m.findingsCount === 1 ? "" : "s"}
                            {m.criticalCount > 0 ? ` · ${m.criticalCount} critical` : ""}
                          </div>
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSubmitQuery();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary border-t border-border flex items-center gap-2"
                    >
                      <CornerDownLeft className="w-3 h-3" />
                      Show all results in Reports
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: status, theme, sign out, user */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-sm font-medium text-muted-foreground">Veea Secure</span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground relative z-30"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>

          <div
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs border border-primary/20"
            title={`${MOCK_USER.name} · ${MOCK_USER.role.replace(/_/g, " ")}`}
          >
            {MOCK_USER.name
              .split(/\s+/)
              .map((p) => p[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isThemeWiping && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 pointer-events-none bg-foreground"
          />
        )}
      </AnimatePresence>
    </>
  );
}

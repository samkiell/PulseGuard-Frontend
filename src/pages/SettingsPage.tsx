import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  UserCircle,
  Palette,
  Shield,
  Bell,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { clearToken } from "../utils/auth";
import { getThemeColors, type ThemeColors } from "../utils/themeColors";
import { MOCK_USER } from "../services/api.mock";

const PRIVACY_LEVELS = ["Maximum", "Balanced", "Minimal"] as const;
const PURGE_OPTIONS = ["Immediately", "5 minutes", "Manual"] as const;
const REID_OPTIONS = ["Off", "On"] as const;
const DENSITY_OPTIONS = ["Comfortable", "Compact"] as const;
const THEME_OPTIONS = ["Light", "Dark"] as const;

export default function SettingsPage() {
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const c = getThemeColors(isDark);

  // Profile — defaults seeded from MOCK_USER (backend data contract)
  const [displayName, setDisplayName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState("demo@pulseguard.ai");
  const [organization, setOrganization] = useState("City General Hospital");
  const [profileSaved, setProfileSaved] = useState(false);

  // Appearance
  const [density, setDensity] = useState<(typeof DENSITY_OPTIONS)[number]>(
    "Comfortable"
  );

  // Audit Preferences
  const [defaultReId, setDefaultReId] = useState<(typeof REID_OPTIONS)[number]>(
    "Off"
  );
  const [privacyLevel, setPrivacyLevel] =
    useState<(typeof PRIVACY_LEVELS)[number]>("Balanced");
  const [purgeOption, setPurgeOption] =
    useState<(typeof PURGE_OPTIONS)[number]>("Immediately");
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Notifications
  const [notifyOnComplete, setNotifyOnComplete] = useState(true);
  const [notifyOnCritical, setNotifyOnCritical] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [inAppToasts, setInAppToasts] = useState(true);
  const [notifSaved, setNotifSaved] = useState(false);

  useEffect(() => {
    if (!profileSaved) return;
    const t = setTimeout(() => setProfileSaved(false), 2000);
    return () => clearTimeout(t);
  }, [profileSaved]);

  useEffect(() => {
    if (!prefsSaved) return;
    const t = setTimeout(() => setPrefsSaved(false), 2000);
    return () => clearTimeout(t);
  }, [prefsSaved]);

  useEffect(() => {
    if (!notifSaved) return;
    const t = setTimeout(() => setNotifSaved(false), 2000);
    return () => clearTimeout(t);
  }, [notifSaved]);

  const handleClearReports = () => {
    window.confirm("Delete all reports? This cannot be undone.");
  };

  const handleSignOut = () => {
    clearToken();
    navigate("/login");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    marginTop: 6,
    padding: "10px 12px",
    border: `1px solid ${c.inputBorder}`,
    borderRadius: 4,
    fontSize: 14,
    color: c.inputText,
    background: c.inputBg,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: c.body,
    marginBottom: 2,
  };

  const cardStyle: React.CSSProperties = {
    background: c.cardBg,
    border: `1px solid ${c.cardBorder}`,
    borderRadius: 8,
    padding: 24,
    marginBottom: 20,
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = c.inputFocusBorder;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = c.inputBorder;
  };

  const userInitials = displayName
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        height: "100%",
        overflow: "auto",
        background: c.pageBg,
        padding: 32,
        width: "100%",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: c.heading,
              margin: 0,
            }}
          >
            Settings
          </h1>
          <p style={{ fontSize: 13, color: c.muted, marginTop: 4 }}>
            Manage your account, audit preferences, and notifications
          </p>
        </div>

        {/* SECTION — Profile */}
        <div style={cardStyle}>
          <SectionHeader
            icon={<UserCircle size={18} color={c.primary} />}
            title="Profile"
            subtitle="How you appear to your team inside PulseGuard"
            c={c}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#D0E2FF",
                color: "#0043CE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {userInitials || "U"}
            </div>
            <div style={{ fontSize: 12, color: c.muted }}>
              Avatar is generated from your display name initials.
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={inputStyle}
            />
            <p style={{ fontSize: 11, color: c.hint, marginTop: 6 }}>
              Used for audit notifications and account recovery.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Organization</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={inputStyle}
            />
          </div>

          {/* Read-only fields from the JWT data contract */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              padding: "12px 0 0 0",
              borderTop: `1px solid ${c.softDivider}`,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: c.hint, marginBottom: 2 }}>
                Role
              </div>
              <div style={{ fontSize: 13, color: c.body }}>
                {MOCK_USER.role.replace(/_/g, " ")}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: c.hint, marginBottom: 2 }}>
                Last login
              </div>
              <div style={{ fontSize: 13, color: c.body }}>
                {new Date(MOCK_USER.lastLogin).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          <SaveRow
            saved={profileSaved}
            onSave={() => setProfileSaved(true)}
            label="Save profile"
            c={c}
          />
        </div>

        {/* SECTION — Appearance */}
        <div style={cardStyle}>
          <SectionHeader
            icon={<Palette size={18} color={c.primary} />}
            title="Appearance"
            subtitle="Choose how PulseGuard looks on this device"
            c={c}
          />

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Theme</label>
            <ToggleGroup
              options={THEME_OPTIONS}
              value={isDark ? "Dark" : "Light"}
              onChange={(next) => setTheme(next.toLowerCase())}
              c={c}
            />
          </div>

          <div>
            <label style={labelStyle}>Density</label>
            <ToggleGroup
              options={DENSITY_OPTIONS}
              value={density}
              onChange={setDensity}
              c={c}
            />
            <p style={{ fontSize: 11, color: c.hint, marginTop: 6 }}>
              Compact reduces padding in tables and cards.
            </p>
          </div>
        </div>

        {/* SECTION — Audit Preferences */}
        <div style={cardStyle}>
          <SectionHeader
            icon={<Shield size={18} color={c.primary} />}
            title="Audit Preferences"
            subtitle="Defaults applied when you run a new compliance audit"
            c={c}
          />

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Privacy level</label>
            <ToggleGroup
              options={PRIVACY_LEVELS}
              value={privacyLevel}
              onChange={setPrivacyLevel}
              c={c}
            />
            <p style={{ fontSize: 11, color: c.hint, marginTop: 6 }}>
              Higher privacy hides more identifiers — Minimal keeps the audit
              trail only.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Reveal patient identity by default</label>
            <ToggleGroup
              options={REID_OPTIONS}
              value={defaultReId}
              onChange={setDefaultReId}
              c={c}
            />
            <p style={{ fontSize: 11, color: c.hint, marginTop: 6 }}>
              When On, new audits start with the Re-ID toggle already enabled.
            </p>
          </div>

          <div>
            <label style={labelStyle}>Auto-purge after audit</label>
            <ToggleGroup
              options={PURGE_OPTIONS}
              value={purgeOption}
              onChange={setPurgeOption}
              c={c}
            />
            <p style={{ fontSize: 11, color: c.hint, marginTop: 6 }}>
              How quickly source documents are wiped from local storage once
              an audit finishes.
            </p>
          </div>

          <SaveRow
            saved={prefsSaved}
            onSave={() => setPrefsSaved(true)}
            label="Save preferences"
            c={c}
          />
        </div>

        {/* SECTION — Notifications */}
        <div style={cardStyle}>
          <SectionHeader
            icon={<Bell size={18} color={c.primary} />}
            title="Notifications"
            subtitle="Decide when PulseGuard should reach out to you"
            c={c}
          />

          <SwitchRow
            title="Email when an audit completes"
            description="A short summary email with the findings count."
            checked={notifyOnComplete}
            onChange={setNotifyOnComplete}
            c={c}
          />
          <SwitchRow
            title="Email on critical findings"
            description="Get notified immediately when a CRITICAL violation is detected."
            checked={notifyOnCritical}
            onChange={setNotifyOnCritical}
            c={c}
          />
          <SwitchRow
            title="Weekly summary"
            description="A digest of audits run in the last 7 days, sent Monday morning."
            checked={weeklySummary}
            onChange={setWeeklySummary}
            c={c}
          />
          <SwitchRow
            title="In-app toasts"
            description="Show small alerts in the bottom of the screen while you work."
            checked={inAppToasts}
            onChange={setInAppToasts}
            c={c}
            isLast
          />

          <SaveRow
            saved={notifSaved}
            onSave={() => setNotifSaved(true)}
            label="Save notifications"
            c={c}
          />
        </div>

        {/* SECTION — Danger Zone */}
        <div
          style={{
            ...cardStyle,
            border: `1px solid ${c.criticalBorder}`,
          }}
        >
          <SectionHeader
            icon={<AlertTriangle size={18} color={c.critical} />}
            title="Danger Zone"
            subtitle="Irreversible actions — use with caution"
            titleColor={c.critical}
            c={c}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: `1px solid ${c.softDivider}`,
            }}
          >
            <div>
              <div
                style={{ fontWeight: 500, fontSize: 14, color: c.heading }}
              >
                Clear All Reports
              </div>
              <div style={{ fontSize: 12, color: c.muted }}>
                Permanently delete all past audit sessions from local storage.
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearReports}
              style={{
                background: c.cardBg,
                color: c.critical,
                border: `1px solid ${c.critical}`,
                borderRadius: 4,
                padding: "6px 14px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Clear Reports
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
            }}
          >
            <div>
              <div
                style={{ fontWeight: 500, fontSize: 14, color: c.heading }}
              >
                Sign Out
              </div>
              <div style={{ fontSize: 12, color: c.muted }}>
                End your session and return to the login screen.
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                background: c.critical,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 4,
                padding: "6px 14px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  titleColor,
  c,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  titleColor?: string;
  c: ThemeColors;
}) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${c.softDivider}`,
        paddingBottom: 12,
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon}
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: titleColor ?? c.heading,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ fontSize: 12, color: c.muted, marginTop: 4 }}>
        {subtitle}
      </div>
    </div>
  );
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  c,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  c: ThemeColors;
}) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            style={{
              padding: "6px 14px",
              fontSize: 13,
              border: active
                ? `1px solid ${c.primary}`
                : `1px solid ${c.cardBorder}`,
              borderRadius: 4,
              cursor: "pointer",
              background: active ? c.primary : c.cardBg,
              color: active ? c.primaryFg : c.body,
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function SwitchRow({
  title,
  description,
  checked,
  onChange,
  c,
  isLast,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  c: ThemeColors;
  isLast?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        padding: "12px 0",
        borderBottom: isLast ? "none" : `1px solid ${c.softDivider}`,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: c.heading }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>
          {description}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          border: "none",
          background: checked ? c.primary : c.cardBorder,
          position: "relative",
          cursor: "pointer",
          padding: 0,
          flexShrink: 0,
          transition: "background-color 0.15s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#FFFFFF",
            transition: "left 0.15s",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </div>
  );
}

function SaveRow({
  saved,
  onSave,
  label,
  c,
}: {
  saved: boolean;
  onSave: () => void;
  label: string;
  c: ThemeColors;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 20,
      }}
    >
      {saved ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: c.success,
            fontSize: 13,
          }}
        >
          <CheckCircle size={14} />
          Saved
        </div>
      ) : (
        <button
          type="button"
          onClick={onSave}
          style={{
            background: c.primary,
            color: c.primaryFg,
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {label}
        </button>
      )}
    </div>
  );
}

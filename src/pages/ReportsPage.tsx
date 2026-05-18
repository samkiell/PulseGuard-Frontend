import { useEffect, useMemo, useState } from "react";
import { FileText, X, CheckCircle, XCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useSearchParams } from "react-router-dom";
import { mockGetReports } from "../services/api.mock";
import { getThemeColors, type ThemeColors } from "../utils/themeColors";

type FindingType = "Critical" | "Warning" | "Info";
type FindingStatus = "Redacted" | "Flagged" | "Pending";

type Finding = {
  findingId: string;
  type: FindingType;
  message: string;
  status: FindingStatus;
  description: string;
  location: string;
  redactedToken: string;
  originalValue: string;
  recommendation: string;
};

type Session = {
  id: string;
  fileName: string;
  auditedAt: string;
  findingsCount: number;
  criticalCount: number;
  status: "violations_found" | "clean";
  findings: Finding[];
};

const PULSE_KEYFRAMES = `@keyframes pg-reports-pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }`;

const TYPE_ORDER: Record<FindingType, number> = {
  Critical: 0,
  Warning: 1,
  Info: 2,
};

function typeBadge(type: FindingType, c: ThemeColors) {
  switch (type) {
    case "Critical":
      return {
        background: c.criticalBg,
        color: c.critical,
        border: `1px solid ${c.criticalBorder}`,
        label: "Critical",
      };
    case "Warning":
      return {
        background: c.warningBg,
        color: c.warningText,
        border: `1px solid ${c.warningBorder}`,
        label: "Warning",
      };
    case "Info":
      return {
        background: c.infoBg,
        color: c.infoText,
        border: `1px solid ${c.infoBorder}`,
        label: "Info",
      };
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReportsPage() {
  const { resolvedTheme } = useTheme();
  const c = getThemeColors(resolvedTheme === "dark");

  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get("q") ?? "";
  const selectedId = searchParams.get("selected");

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;
    mockGetReports().then((data) => {
      if (cancelled) return;
      setSessions(data as Session[]);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedId || sessions.length === 0) return;
    const match = sessions.find((s) => s.id === selectedId);
    if (match) setSelectedSession(match);
  }, [selectedId, sessions]);

  const closeDrawer = () => {
    setSelectedSession(null);
    if (selectedId) {
      const next = new URLSearchParams(searchParams);
      next.delete("selected");
      setSearchParams(next, { replace: true });
    }
  };

  const clearQuery = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const filteredSessions = useMemo(() => {
    const q = querySearch.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => s.fileName.toLowerCase().includes(q));
  }, [sessions, querySearch]);

  const totalCount = sessions.length;
  const violationsCount = sessions.filter(
    (s) => s.status === "violations_found"
  ).length;
  const cleanCount = sessions.filter((s) => s.status === "clean").length;

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
      <style>{PULSE_KEYFRAMES}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            gap: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: c.heading,
                margin: 0,
              }}
            >
              Audit Reports
            </h1>
            <p style={{ fontSize: 13, color: c.muted, marginTop: 4 }}>
              History of all completed HIPAA audits
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <SummaryChip
              label="Total Audits"
              value={totalCount}
              background={c.cardBg}
              border={`1px solid ${c.cardBorder}`}
              labelColor={c.muted}
              valueColor={c.heading}
            />
            <SummaryChip
              label="With Violations"
              value={violationsCount}
              background={c.criticalBg}
              border={`1px solid ${c.criticalBorder}`}
              labelColor={c.muted}
              valueColor={c.critical}
            />
            <SummaryChip
              label="Clean"
              value={cleanCount}
              background={c.successBg}
              border={`1px solid ${c.successBorder}`}
              labelColor={c.muted}
              valueColor={c.success}
            />
          </div>
        </div>

        {/* Active search banner */}
        {!loading && querySearch.trim() !== "" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: c.cardBg,
              border: `1px solid ${c.cardBorder}`,
              borderRadius: 6,
              padding: "10px 14px",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 13, color: c.body }}>
              Showing {filteredSessions.length} result
              {filteredSessions.length === 1 ? "" : "s"} for{" "}
              <span style={{ fontWeight: 600, color: c.heading }}>
                "{querySearch}"
              </span>
            </span>
            <button
              type="button"
              onClick={clearQuery}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: c.muted,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <XCircle size={14} />
              Clear
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 64,
                  background: c.cardBg,
                  borderRadius: 6,
                  border: `1px solid ${c.cardBorder}`,
                  marginBottom: 8,
                  animation: "pg-reports-pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </>
        )}

        {/* Table */}
        {!loading && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
                padding: "8px 16px",
                fontSize: 11,
                fontWeight: 600,
                color: c.muted,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 4,
              }}
            >
              <div>File</div>
              <div>Audited</div>
              <div>Findings</div>
              <div>Critical</div>
              <div>Status</div>
            </div>

            {filteredSessions.length === 0 ? (
              <div
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.cardBorder}`,
                  borderRadius: 6,
                  padding: "32px 16px",
                  textAlign: "center",
                  color: c.muted,
                  fontSize: 13,
                }}
              >
                No audits match your search.
              </div>
            ) : (
              filteredSessions.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  c={c}
                  onClick={() => setSelectedSession(session)}
                />
              ))
            )}
          </>
        )}
      </div>

      {selectedSession && (
        <SessionDrawer
          session={selectedSession}
          c={c}
          onClose={closeDrawer}
        />
      )}
    </div>
  );
}

function SummaryChip({
  label,
  value,
  background,
  border,
  labelColor,
  valueColor,
}: {
  label: string;
  value: number;
  background: string;
  border: string;
  labelColor: string;
  valueColor: string;
}) {
  return (
    <div
      style={{
        background,
        border,
        borderRadius: 6,
        padding: "8px 16px",
        minWidth: 110,
      }}
    >
      <div style={{ fontSize: 11, color: labelColor }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: valueColor }}>
        {value}
      </div>
    </div>
  );
}

function SessionRow({
  session,
  c,
  onClick,
}: {
  session: Session;
  c: ThemeColors;
  onClick: () => void;
}) {
  const hasFindings = session.findingsCount > 0;
  const hasCritical = session.criticalCount > 0;

  return (
    <div
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = c.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = c.cardBorder;
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
        alignItems: "center",
        background: c.cardBg,
        border: `1px solid ${c.cardBorder}`,
        borderRadius: 6,
        padding: "14px 16px",
        marginBottom: 8,
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <FileText
          size={16}
          color={c.muted}
          style={{ marginRight: 8, flexShrink: 0 }}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: c.heading,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {session.fileName}
        </span>
      </div>

      <div style={{ fontSize: 13, color: c.body }}>
        {formatDate(session.auditedAt)}
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: hasFindings ? c.critical : c.success,
        }}
      >
        {session.findingsCount}
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: hasCritical ? c.critical : c.muted,
        }}
      >
        {session.criticalCount}
      </div>

      <StatusBadge status={session.status} c={c} />
    </div>
  );
}

function StatusBadge({
  status,
  c,
}: {
  status: Session["status"];
  c: ThemeColors;
}) {
  if (status === "clean") {
    return (
      <span
        style={{
          background: c.successBg,
          color: c.success,
          border: `1px solid ${c.successBorder}`,
          borderRadius: 20,
          padding: "3px 10px",
          fontSize: 12,
          fontWeight: 500,
          justifySelf: "start",
        }}
      >
        Clean
      </span>
    );
  }
  return (
    <span
      style={{
        background: c.criticalBg,
        color: c.critical,
        border: `1px solid ${c.criticalBorder}`,
        borderRadius: 20,
        padding: "3px 10px",
        fontSize: 12,
        fontWeight: 500,
        justifySelf: "start",
      }}
    >
      Violations
    </span>
  );
}

function SessionDrawer({
  session,
  c,
  onClose,
}: {
  session: Session;
  c: ThemeColors;
  onClose: () => void;
}) {
  const sortedFindings = [...session.findings].sort(
    (a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]
  );

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 40,
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: 480,
          background: c.cardBg,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${c.cardBorder}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <p
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: c.heading,
                margin: 0,
              }}
            >
              {session.fileName}
            </p>
            <p style={{ fontSize: 12, color: c.muted, marginTop: 4 }}>
              {formatDate(session.auditedAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: c.muted,
              padding: 0,
              display: "flex",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
          }}
        >
          {session.findings.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 32,
                textAlign: "center",
              }}
            >
              <CheckCircle size={40} color={c.success} />
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: c.heading,
                  marginTop: 12,
                }}
              >
                No violations found
              </p>
              <p style={{ fontSize: 13, color: c.muted, marginTop: 4 }}>
                This document passed all HIPAA audit checks.
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  fontSize: 13,
                  color: c.body,
                  marginBottom: 16,
                }}
              >
                {session.findingsCount} findings — {session.criticalCount}{" "}
                Critical
              </div>
              {sortedFindings.map((finding) => {
                const badge = typeBadge(finding.type, c);
                return (
                  <div
                    key={finding.findingId}
                    style={{
                      background: c.nestedCardBg,
                      border: `1px solid ${c.cardBorder}`,
                      borderRadius: 6,
                      padding: "12px 14px",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          background: badge.background,
                          color: badge.color,
                          border: badge.border,
                          borderRadius: 20,
                          padding: "2px 8px",
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      >
                        {badge.label}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: c.heading,
                        }}
                      >
                        {finding.message}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: c.body,
                        margin: "6px 0 0 0",
                      }}
                    >
                      {finding.description}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: c.hint,
                        fontStyle: "italic",
                        margin: "4px 0 0 0",
                      }}
                    >
                      {finding.location}
                    </p>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}

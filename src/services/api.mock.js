// Each finding follows the backend data contract on the first 4 fields
// (findingId, type, message, status). The remaining fields are
// client-side display extensions that the backend will need to surface
// when the real API is wired up — flagged for contract extension.
export const MOCK_FINDINGS = [
  {
    // --- contract fields ---
    findingId: "ERR-001",
    type: "Critical",
    message: "Patient Name",
    status: "Redacted",
    // --- UI display extensions (pending contract expansion) ---
    description: "Full patient name appears unredacted in the document header and admission form.",
    location: "Page 1, Paragraph 2",
    redactedToken: "[NAME-A7F2]",
    originalValue: "Margaret L. Thompson",
    recommendation: "Remove or hash the patient name field before transmitting this document."
  },
  {
    findingId: "ERR-002",
    type: "Critical",
    message: "Social Security Number",
    status: "Redacted",
    description: "A 9-digit SSN is present in plain text in the insurance verification section.",
    location: "Page 2, Paragraph 4",
    redactedToken: "[SSN-B3D1]",
    originalValue: "472-88-3901",
    recommendation: "SSNs must never appear in clinical documents — remove immediately and audit access logs."
  },
  {
    findingId: "ERR-003",
    type: "Warning",
    message: "Date of Birth",
    status: "Redacted",
    description: "Patient date of birth is included alongside other identifiers, increasing re-identification risk.",
    location: "Page 1, Paragraph 5",
    redactedToken: "[DOB-C9E4]",
    originalValue: "March 14, 1962",
    recommendation: "Replace exact birth date with age range (e.g. 60–65) when full DOB is not clinically required."
  },
  {
    findingId: "ERR-004",
    type: "Info",
    message: "Provider NPI",
    status: "Flagged",
    description: "Attending physician NPI number is present — low risk but logged for compliance record.",
    location: "Page 3, Paragraph 1",
    redactedToken: "[NPI-D2F8]",
    originalValue: "NPI-1234567890",
    recommendation: "NPI numbers are public but should be reviewed in context of the full document disclosure."
  }
];

// Mock user object matches the backend data contract.
// In production this will be derived from the JWT payload returned
// by /auth/login.
export const MOCK_USER = {
  id: "USR-9921",
  name: "Dr. Sarah Chen",
  role: "Compliance_Officer",
  lastLogin: "2026-05-13T22:13:38Z"
};

export function mockGetUser() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_USER), 200);
  });
}

export function checkProxyStatus() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 800);
  });
}

export function mockUpload(file) {
  return new Promise((resolve, reject) => {
    if (file && file.size > 20971520) {
      reject(new Error("File too large. Maximum size is 20MB."));
      return;
    }
    setTimeout(() => resolve({ jobId: "mock-job-001" }), 1200);
  });
}

export function mockAuditResults() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FINDINGS), 2000);
  });
}

export function mockFlush() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
}

export const MOCK_REPORT_SESSIONS = [
  {
    id: "SESSION-001",
    fileName: "Patient_Intake_Form_March.pdf",
    auditedAt: "2026-05-12T09:14:00Z",
    findingsCount: 4,
    criticalCount: 2,
    status: "violations_found",
    findings: MOCK_FINDINGS
  },
  {
    id: "SESSION-002",
    fileName: "Insurance_Verification_Q1.pdf",
    auditedAt: "2026-05-11T14:32:00Z",
    findingsCount: 2,
    criticalCount: 1,
    status: "violations_found",
    findings: MOCK_FINDINGS.slice(0, 2)
  },
  {
    id: "SESSION-003",
    fileName: "Discharge_Summary_Thompson.docx",
    auditedAt: "2026-05-10T11:05:00Z",
    findingsCount: 0,
    criticalCount: 0,
    status: "clean",
    findings: []
  },
  {
    id: "SESSION-004",
    fileName: "Lab_Results_Batch_April.pdf",
    auditedAt: "2026-05-09T16:48:00Z",
    findingsCount: 3,
    criticalCount: 2,
    status: "violations_found",
    findings: MOCK_FINDINGS.slice(0, 3)
  },
  {
    id: "SESSION-005",
    fileName: "Referral_Letter_Cardiology.docx",
    auditedAt: "2026-05-08T08:22:00Z",
    findingsCount: 1,
    criticalCount: 0,
    status: "violations_found",
    findings: MOCK_FINDINGS.slice(2, 3)
  },
  {
    id: "SESSION-006",
    fileName: "Annual_Wellness_Visit_Notes.pdf",
    auditedAt: "2026-05-07T13:10:00Z",
    findingsCount: 0,
    criticalCount: 0,
    status: "clean",
    findings: []
  }
];

export function mockGetReports() {
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_REPORT_SESSIONS), 800)
  );
}

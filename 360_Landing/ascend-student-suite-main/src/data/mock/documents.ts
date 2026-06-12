// Mock Documents — sourced from /mock-data/documents.json
// Do NOT create Supabase Storage tables yet.

export type DocumentType = "PERSONAL" | "ACADEMIC" | "LANGUAGE" | "FINANCIAL" | "SOP" | "LOR" | "ADDITIONAL";
export type DocumentStatus = "PENDING" | "UPLOADED" | "APPROVED" | "REJECTED";

export interface Document {
  id: number;
  studentId: number;
  applicationId: number | null;
  name: string;
  type: DocumentType;
  category: string;
  status: DocumentStatus;
  uploadDate: string;
  fileSize: number;
  fileType: string;
  remarks: string | null;
  fileUrl?: string | null;
}

export const DOCUMENT_CATEGORIES = {
  PERSONAL: { label: "Personal Documents", icon: "User", examples: ["Passport", "National ID", "Birth Certificate"] },
  ACADEMIC: { label: "Academic Documents", icon: "GraduationCap", examples: ["Degree Certificate", "Transcript", "Mark Sheets"] },
  LANGUAGE: { label: "Language Proficiency", icon: "Languages", examples: ["IELTS", "TOEFL", "PTE", "Duolingo"] },
  FINANCIAL: { label: "Financial Documents", icon: "Wallet", examples: ["Bank Statement", "Loan Letter", "Sponsorship Letter"] },
  SOP: { label: "Statement of Purpose", icon: "FileText", examples: ["SOP"] },
  LOR: { label: "Letters of Recommendation", icon: "Mail", examples: ["Academic LOR", "Professional LOR"] },
  ADDITIONAL: { label: "Additional Documents", icon: "PlusCircle", examples: ["CV/Resume", "Work Experience Certificate", "Portfolio"] },
} as const;

export const mockDocuments: Document[] = [
  { id: 1, studentId: 1, applicationId: 1, name: "Passport Copy", type: "PERSONAL", category: "Personal Documents", status: "APPROVED", uploadDate: "2025-03-10T09:00:00Z", fileSize: 890000, fileType: "image/jpeg", remarks: "Valid until 2030" },
  { id: 2, studentId: 1, applicationId: 1, name: "Bachelor Transcript", type: "ACADEMIC", category: "Academic Documents", status: "APPROVED", uploadDate: "2025-03-12T10:00:00Z", fileSize: 2450000, fileType: "application/pdf", remarks: "Verified by admin" },
  { id: 3, studentId: 1, applicationId: 1, name: "Statement of Purpose", type: "SOP", category: "Statement of Purpose", status: "PENDING", uploadDate: "2025-03-14T11:00:00Z", fileSize: 180000, fileType: "application/pdf", remarks: null },
  { id: 4, studentId: 1, applicationId: 2, name: "IELTS Score Card", type: "LANGUAGE", category: "Language Proficiency", status: "APPROVED", uploadDate: "2025-01-20T14:00:00Z", fileSize: 320000, fileType: "application/pdf", remarks: "Overall 7.5" },
  { id: 5, studentId: 1, applicationId: 2, name: "Letter of Recommendation", type: "LOR", category: "Letters of Recommendation", status: "APPROVED", uploadDate: "2025-01-18T15:00:00Z", fileSize: 210000, fileType: "application/pdf", remarks: "From Prof. Dr. Meier" },
  { id: 6, studentId: 1, applicationId: 2, name: "CV/Resume", type: "ADDITIONAL", category: "Additional Documents", status: "APPROVED", uploadDate: "2025-01-16T10:00:00Z", fileSize: 156000, fileType: "application/pdf", remarks: null },
  { id: 7, studentId: 1, applicationId: null, name: "Degree Certificate", type: "ACADEMIC", category: "Academic Documents", status: "UPLOADED", uploadDate: "2025-04-01T08:00:00Z", fileSize: 3100000, fileType: "application/pdf", remarks: null },
  { id: 8, studentId: 1, applicationId: null, name: "Bank Statement", type: "FINANCIAL", category: "Financial Documents", status: "PENDING", uploadDate: "", fileSize: 0, fileType: "", remarks: "Not yet uploaded" },
];

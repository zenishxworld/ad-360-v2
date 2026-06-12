// ─────────────────────────────────────────────────────────────
// UNI360 Admin — Centralized Mock Data Store
// Phase 1B: Student-Centric Dashboard
// No backend · No Supabase · No Auth (Demo Mode)
// ─────────────────────────────────────────────────────────────

import { DEMO_MODE } from "../config/demoMode";
export { DEMO_MODE };
export const DEMO_ADMIN = { id: "demo-admin-1", name: "Admin User" };

// ── Types ────────────────────────────────────────────────────

export type AppStatus = "Draft" | "Submitted" | "Under Review" | "Accepted" | "Rejected";
export type DocStatus = "Pending" | "Approved" | "Rejected" | "Missing";
export type StudentStatus = "active" | "pending" | "inactive" | "suspended";

export interface MockApplication {
  id: string;
  studentId: string;
  university: string;
  course: string;
  country: string;
  status: AppStatus;
  progress: number;
  appliedDate: string;
  targetSemester: string;
  isUrgent: boolean;
  notes: string;
}

export interface MockDocument {
  id: string;
  studentId: string;
  name: string;
  category: "Personal" | "Academic" | "Language" | "Financial" | "SOP" | "LOR";
  status: DocStatus;
  uploadDate: string;
  remarks?: string;
}

export interface MockInterestedUniversity {
  id: string;
  studentId: string;
  university: string;
  country: string;
  course: string;
  savedDate: string;
  type: "Dream" | "Target" | "Safe";
}

export interface MockSavedCourse {
  id: string;
  studentId: string;
  course: string;
  university: string;
  country: string;
  duration: string;
  savedDate: string;
}

export interface MockNote {
  id: string;
  studentId: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface MockTimelineEvent {
  id: string;
  studentId: string;
  event: string;
  description: string;
  date: string;
  type: "preferences" | "recommendation" | "university" | "application" | "document" | "status";
}

export interface MockStudent {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  targetCountries: string[];
  targetIntake: string;
  educationLevel: string;
  fieldOfStudy: string;
  targetCourse: string;
  gpa: number;
  englishProficiency: string;
  greScore?: string;
  workExperience: string;
  status: StudentStatus;
  profileProgress: number;
  registrationDate: string;
  lastActive: string;
  assignedCounselor: string;
  address: string;
  passportNumber: string;
  emergencyContact: string;
}

// ── Students ─────────────────────────────────────────────────

export const mockStudents: MockStudent[] = [
  {
    id: "1",
    uuid: "ST2025-000001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+49 123 456 7890",
    nationality: "Indian",
    dateOfBirth: "2000-05-15",
    gender: "Male",
    targetCountries: ["Germany", "UK"],
    targetIntake: "Winter 2025/26",
    educationLevel: "Bachelor's Degree",
    fieldOfStudy: "Computer Science",
    targetCourse: "M.Sc. Computer Science",
    gpa: 3.6,
    englishProficiency: "IELTS 7.0",
    greScore: "318",
    workExperience: "1 year",
    status: "active",
    profileProgress: 75,
    registrationDate: "2025-01-10T08:30:00Z",
    lastActive: "2026-06-10T14:20:00Z",
    assignedCounselor: "Dr. Sarah Wilson",
    address: "12A, Sector 18, Noida, UP 201301",
    passportNumber: "IN2345678",
    emergencyContact: "+91 98765 43210",
  },
  {
    id: "2",
    uuid: "ST2025-000002",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    nationality: "Indian",
    dateOfBirth: "2001-08-22",
    gender: "Female",
    targetCountries: ["Germany"],
    targetIntake: "Summer 2026",
    educationLevel: "Bachelor's Degree",
    fieldOfStudy: "Mechanical Engineering",
    targetCourse: "M.Eng. Mechanical Engineering",
    gpa: 3.8,
    englishProficiency: "TOEFL 105",
    workExperience: "0 years",
    status: "active",
    profileProgress: 90,
    registrationDate: "2025-02-15T10:00:00Z",
    lastActive: "2026-06-11T09:15:00Z",
    assignedCounselor: "Prof. James Smith",
    address: "45 MG Road, Bangalore 560001",
    passportNumber: "IN5678901",
    emergencyContact: "+91 77889 00112",
  },
  {
    id: "3",
    uuid: "ST2025-000003",
    firstName: "Ahmed",
    lastName: "Khan",
    email: "ahmed.khan@example.com",
    phone: "+971 50 123 4567",
    nationality: "Pakistani",
    dateOfBirth: "1999-11-03",
    gender: "Male",
    targetCountries: ["UK"],
    targetIntake: "Fall 2025",
    educationLevel: "Master's Degree",
    fieldOfStudy: "Data Science",
    targetCourse: "M.Sc. Data Science",
    gpa: 3.4,
    englishProficiency: "IELTS 7.5",
    workExperience: "2 years",
    status: "active",
    profileProgress: 45,
    registrationDate: "2025-03-01T14:00:00Z",
    lastActive: "2026-06-08T11:30:00Z",
    assignedCounselor: "Dr. Emily Brown",
    address: "Al Barsha, Dubai, UAE",
    passportNumber: "PK9012345",
    emergencyContact: "+971 55 999 8888",
  },
  {
    id: "4",
    uuid: "ST2025-000004",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@example.com",
    phone: "+34 612 345 678",
    nationality: "Spanish",
    dateOfBirth: "2000-03-18",
    gender: "Female",
    targetCountries: ["Germany", "Italy"],
    targetIntake: "Winter 2025/26",
    educationLevel: "Master's Degree",
    fieldOfStudy: "Business Administration",
    targetCourse: "MBA",
    gpa: 3.9,
    englishProficiency: "TOEFL 110",
    greScore: "325",
    workExperience: "3 years",
    status: "active",
    profileProgress: 60,
    registrationDate: "2025-01-20T09:00:00Z",
    lastActive: "2026-06-12T08:00:00Z",
    assignedCounselor: "Dr. Sarah Wilson",
    address: "Calle Mayor 12, Madrid 28001",
    passportNumber: "SP3456789",
    emergencyContact: "+34 699 123 456",
  },
  {
    id: "5",
    uuid: "ST2025-000005",
    firstName: "Wei",
    lastName: "Zhang",
    email: "wei.zhang@example.com",
    phone: "+86 138 0013 8000",
    nationality: "Chinese",
    dateOfBirth: "2001-07-07",
    gender: "Male",
    targetCountries: ["UK", "Germany"],
    targetIntake: "Fall 2025",
    educationLevel: "Bachelor's Degree",
    fieldOfStudy: "Electrical Engineering",
    targetCourse: "B.Eng. Electrical Engineering",
    gpa: 3.7,
    englishProficiency: "IELTS 7.0",
    workExperience: "0 years",
    status: "pending",
    profileProgress: 30,
    registrationDate: "2025-02-28T11:00:00Z",
    lastActive: "2026-06-05T16:45:00Z",
    assignedCounselor: "Prof. James Smith",
    address: "No. 10, Zhongguancun, Beijing 100080",
    passportNumber: "CN7890123",
    emergencyContact: "+86 187 0000 1111",
  },
  {
    id: "6",
    uuid: "ST2025-000006",
    firstName: "Fatima",
    lastName: "Al-Rashid",
    email: "fatima.alrashid@example.com",
    phone: "+966 55 123 4567",
    nationality: "Saudi Arabian",
    dateOfBirth: "2000-12-01",
    gender: "Female",
    targetCountries: ["UK"],
    targetIntake: "Fall 2025",
    educationLevel: "Bachelor's Degree",
    fieldOfStudy: "Biomedical Engineering",
    targetCourse: "M.Sc. Biomedical Engineering",
    gpa: 3.5,
    englishProficiency: "IELTS 6.5",
    workExperience: "1 year",
    status: "inactive",
    profileProgress: 20,
    registrationDate: "2025-04-10T12:00:00Z",
    lastActive: "2026-05-20T10:00:00Z",
    assignedCounselor: "Dr. Emily Brown",
    address: "Al Olaya District, Riyadh, KSA",
    passportNumber: "SA1234567",
    emergencyContact: "+966 50 987 6543",
  },
];

// ── Applications ──────────────────────────────────────────────

export const mockApplications: MockApplication[] = [
  {
    id: "app-1", studentId: "1",
    university: "Technical University of Munich", course: "M.Sc. Computer Science",
    country: "Germany", status: "Under Review", progress: 65,
    appliedDate: "2025-03-10T08:00:00Z", targetSemester: "Winter 2025/26",
    isUrgent: false, notes: "All documents verified except SOP",
  },
  {
    id: "app-2", studentId: "1",
    university: "University of Amsterdam", course: "M.Sc. Artificial Intelligence",
    country: "Netherlands", status: "Submitted", progress: 40,
    appliedDate: "2025-03-20T10:00:00Z", targetSemester: "Winter 2025/26",
    isUrgent: false, notes: "Awaiting university portal confirmation",
  },
  {
    id: "app-3", studentId: "1",
    university: "TU Berlin", course: "M.Sc. Data Science",
    country: "Germany", status: "Draft", progress: 10,
    appliedDate: "2025-04-01T08:00:00Z", targetSemester: "Winter 2025/26",
    isUrgent: false, notes: "Draft saved by student",
  },
  {
    id: "app-4", studentId: "2",
    university: "University of Cambridge", course: "M.Eng. Mechanical Engineering",
    country: "UK", status: "Accepted", progress: 95,
    appliedDate: "2025-01-15T09:00:00Z", targetSemester: "Fall 2025",
    isUrgent: false, notes: "Offer letter received",
  },
  {
    id: "app-5", studentId: "3",
    university: "ETH Zurich", course: "M.Sc. Data Science",
    country: "Switzerland", status: "Under Review", progress: 15,
    appliedDate: "2025-04-01T12:00:00Z", targetSemester: "Fall 2025",
    isUrgent: true, notes: "New application, needs admin assignment",
  },
  {
    id: "app-6", studentId: "4",
    university: "University of Oxford", course: "MBA",
    country: "UK", status: "Under Review", progress: 50,
    appliedDate: "2025-02-20T10:30:00Z", targetSemester: "Fall 2025",
    isUrgent: false, notes: "Waiting for essay review",
  },
  {
    id: "app-7", studentId: "4",
    university: "Bocconi University", course: "Executive MBA",
    country: "Italy", status: "Submitted", progress: 35,
    appliedDate: "2025-03-05T08:00:00Z", targetSemester: "Fall 2025",
    isUrgent: false, notes: "Documents submitted",
  },
  {
    id: "app-8", studentId: "5",
    university: "Imperial College London", course: "B.Eng. Electrical Engineering",
    country: "UK", status: "Draft", progress: 10,
    appliedDate: "2025-03-25T08:00:00Z", targetSemester: "Fall 2025",
    isUrgent: false, notes: "Profile incomplete",
  },
  {
    id: "app-9", studentId: "1",
    university: "Karlsruhe Institute of Technology", course: "M.Sc. Informatics",
    country: "Germany", status: "Rejected", progress: 100,
    appliedDate: "2025-02-01T08:00:00Z", targetSemester: "Summer 2025",
    isUrgent: false, notes: "Application rejected by university",
  },
];

// ── Documents ─────────────────────────────────────────────────

export const mockDocuments: MockDocument[] = [
  { id: "doc-1",  studentId: "1", name: "Passport Copy",            category: "Personal",  status: "Approved",  uploadDate: "2025-03-10T09:00:00Z", remarks: "Valid until 2030" },
  { id: "doc-2",  studentId: "1", name: "National ID",              category: "Personal",  status: "Pending",   uploadDate: "2025-03-11T10:00:00Z" },
  { id: "doc-3",  studentId: "1", name: "Bachelor Transcript",      category: "Academic",  status: "Approved",  uploadDate: "2025-03-12T10:00:00Z", remarks: "Verified" },
  { id: "doc-4",  studentId: "1", name: "Degree Certificate",       category: "Academic",  status: "Pending",   uploadDate: "2025-03-13T10:00:00Z" },
  { id: "doc-5",  studentId: "1", name: "IELTS Certificate",        category: "Language",  status: "Approved",  uploadDate: "2025-03-14T10:00:00Z", remarks: "Band 7.0" },
  { id: "doc-6",  studentId: "1", name: "Bank Statement",           category: "Financial", status: "Rejected",  uploadDate: "2025-03-15T10:00:00Z", remarks: "Insufficient balance" },
  { id: "doc-7",  studentId: "1", name: "Statement of Purpose",     category: "SOP",       status: "Pending",   uploadDate: "2025-03-16T10:00:00Z" },
  { id: "doc-8",  studentId: "1", name: "Letter of Recommendation", category: "LOR",       status: "Approved",  uploadDate: "2025-03-17T10:00:00Z", remarks: "From Prof. Dr. Kumar" },
  { id: "doc-9",  studentId: "2", name: "Passport Copy",            category: "Personal",  status: "Approved",  uploadDate: "2025-01-20T10:00:00Z" },
  { id: "doc-10", studentId: "2", name: "Bachelor Transcript",      category: "Academic",  status: "Approved",  uploadDate: "2025-01-21T10:00:00Z" },
  { id: "doc-11", studentId: "2", name: "TOEFL Certificate",        category: "Language",  status: "Approved",  uploadDate: "2025-01-22T10:00:00Z", remarks: "Score 105" },
  { id: "doc-12", studentId: "2", name: "CV/Resume",                category: "Academic",  status: "Approved",  uploadDate: "2025-01-23T10:00:00Z" },
  { id: "doc-13", studentId: "2", name: "LOR - Professor",          category: "LOR",       status: "Approved",  uploadDate: "2025-01-24T10:00:00Z" },
  { id: "doc-14", studentId: "3", name: "Passport Copy",            category: "Personal",  status: "Pending",   uploadDate: "2025-04-02T08:00:00Z" },
  { id: "doc-15", studentId: "3", name: "Bachelor Transcript",      category: "Academic",  status: "Pending",   uploadDate: "2025-04-02T09:00:00Z", remarks: "Needs verification" },
  { id: "doc-16", studentId: "4", name: "Passport Copy",            category: "Personal",  status: "Approved",  uploadDate: "2025-02-25T12:00:00Z" },
  { id: "doc-17", studentId: "4", name: "GMAT Score Report",        category: "Language",  status: "Approved",  uploadDate: "2025-02-26T12:00:00Z", remarks: "Score 720" },
  { id: "doc-18", studentId: "4", name: "MBA Essays",               category: "SOP",       status: "Pending",   uploadDate: "2025-03-01T09:00:00Z", remarks: "Under review" },
  { id: "doc-19", studentId: "5", name: "Passport Copy",            category: "Personal",  status: "Missing",   uploadDate: "2025-03-25T08:00:00Z" },
];

// ── Interested Universities ───────────────────────────────────

export const mockInterestedUniversities: MockInterestedUniversity[] = [
  { id: "iu-1", studentId: "1", university: "Technical University of Munich",  country: "Germany",     course: "M.Sc. Computer Science",      savedDate: "2025-02-15T10:00:00Z", type: "Dream" },
  { id: "iu-2", studentId: "1", university: "RWTH Aachen University",          country: "Germany",     course: "M.Sc. Computer Science",      savedDate: "2025-02-16T10:00:00Z", type: "Target" },
  { id: "iu-3", studentId: "1", university: "University of Stuttgart",         country: "Germany",     course: "M.Sc. Informatics",           savedDate: "2025-02-17T10:00:00Z", type: "Safe" },
  { id: "iu-4", studentId: "1", university: "University of Edinburgh",         country: "UK",          course: "M.Sc. Computer Science",      savedDate: "2025-02-18T10:00:00Z", type: "Dream" },
  { id: "iu-5", studentId: "2", university: "University of Cambridge",         country: "UK",          course: "M.Eng. Mech Engineering",     savedDate: "2025-01-10T10:00:00Z", type: "Dream" },
  { id: "iu-6", studentId: "2", university: "KIT Karlsruhe",                   country: "Germany",     course: "M.Sc. Mech Engineering",      savedDate: "2025-01-11T10:00:00Z", type: "Safe" },
  { id: "iu-7", studentId: "3", university: "UCL London",                      country: "UK",          course: "M.Sc. Data Science",          savedDate: "2025-03-10T10:00:00Z", type: "Dream" },
  { id: "iu-8", studentId: "3", university: "University of Manchester",        country: "UK",          course: "M.Sc. Data Science",          savedDate: "2025-03-11T10:00:00Z", type: "Target" },
  { id: "iu-9", studentId: "4", university: "University of Oxford",            country: "UK",          course: "MBA",                         savedDate: "2025-01-20T10:00:00Z", type: "Dream" },
  { id: "iu-10",studentId: "4", university: "Bocconi University",              country: "Italy",       course: "Executive MBA",               savedDate: "2025-01-21T10:00:00Z", type: "Target" },
  { id: "iu-11",studentId: "5", university: "Imperial College London",         country: "UK",          course: "B.Eng. Electrical Eng",       savedDate: "2025-02-28T10:00:00Z", type: "Dream" },
];

// ── Saved Courses ─────────────────────────────────────────────

export const mockSavedCourses: MockSavedCourse[] = [
  { id: "sc-1", studentId: "1", course: "M.Sc. Computer Science",      university: "TU Munich",            country: "Germany", duration: "2 years", savedDate: "2025-02-15T10:00:00Z" },
  { id: "sc-2", studentId: "1", course: "M.Sc. Artificial Intelligence",university: "University of Amsterdam",country:"Netherlands",duration:"2 years",savedDate:"2025-02-16T10:00:00Z" },
  { id: "sc-3", studentId: "1", course: "M.Sc. Data Science",          university: "TU Berlin",             country: "Germany", duration: "2 years", savedDate: "2025-02-17T10:00:00Z" },
  { id: "sc-4", studentId: "2", course: "M.Eng. Mechanical Engineering",university: "University of Cambridge",country:"UK",       duration:"1 year",  savedDate: "2025-01-10T10:00:00Z" },
  { id: "sc-5", studentId: "3", course: "M.Sc. Data Science",          university: "ETH Zurich",            country: "Switzerland",duration:"2 years",savedDate: "2025-03-10T10:00:00Z" },
  { id: "sc-6", studentId: "4", course: "MBA",                         university: "University of Oxford",  country: "UK",      duration: "1 year",  savedDate: "2025-01-20T10:00:00Z" },
];

// ── Notes (persisted in localStorage key: "admin_notes") ─────

export const getNotesForStudent = (studentId: string): MockNote[] => {
  try {
    const raw = localStorage.getItem("admin_notes");
    const all: MockNote[] = raw ? JSON.parse(raw) : [];
    return all.filter((n) => n.studentId === studentId);
  } catch {
    return [];
  }
};

export const saveNote = (note: MockNote): void => {
  try {
    const raw = localStorage.getItem("admin_notes");
    const all: MockNote[] = raw ? JSON.parse(raw) : [];
    all.push(note);
    localStorage.setItem("admin_notes", JSON.stringify(all));
  } catch { /* silent */ }
};

export const deleteNote = (noteId: string): void => {
  try {
    const raw = localStorage.getItem("admin_notes");
    const all: MockNote[] = raw ? JSON.parse(raw) : [];
    const filtered = all.filter((n) => n.id !== noteId);
    localStorage.setItem("admin_notes", JSON.stringify(filtered));
  } catch { /* silent */ }
};

// ── Timeline ──────────────────────────────────────────────────

export const mockTimeline: MockTimelineEvent[] = [
  { id: "tl-1",  studentId: "1", event: "Preferences Completed",     description: "Student filled study preferences: Germany & UK, CS programs",    date: "2025-01-12T10:00:00Z", type: "preferences" },
  { id: "tl-2",  studentId: "1", event: "Recommendation Generated",  description: "3 dream, 4 target, 5 safe universities recommended",             date: "2025-01-13T11:00:00Z", type: "recommendation" },
  { id: "tl-3",  studentId: "1", event: "University Saved",          description: "Saved TU Munich — M.Sc. Computer Science",                       date: "2025-02-15T10:00:00Z", type: "university" },
  { id: "tl-4",  studentId: "1", event: "University Saved",          description: "Saved University of Edinburgh — M.Sc. CS",                       date: "2025-02-18T10:00:00Z", type: "university" },
  { id: "tl-5",  studentId: "1", event: "Application Submitted",     description: "Applied to TU Munich — M.Sc. Computer Science",                  date: "2025-03-10T08:00:00Z", type: "application" },
  { id: "tl-6",  studentId: "1", event: "Documents Uploaded",        description: "Passport, Transcript, IELTS Certificate uploaded",               date: "2025-03-14T10:00:00Z", type: "document" },
  { id: "tl-7",  studentId: "1", event: "Application Under Review",  description: "TU Munich application is under admin review",                    date: "2025-04-05T14:30:00Z", type: "status" },

  { id: "tl-8",  studentId: "2", event: "Preferences Completed",     description: "Student filled study preferences: Germany, Mech Engineering",    date: "2025-02-16T09:00:00Z", type: "preferences" },
  { id: "tl-9",  studentId: "2", event: "Recommendation Generated",  description: "2 dream, 3 target, 4 safe universities recommended",             date: "2025-02-17T10:00:00Z", type: "recommendation" },
  { id: "tl-10", studentId: "2", event: "University Saved",          description: "Saved Cambridge — M.Eng. Mechanical Engineering",                date: "2025-01-10T10:00:00Z", type: "university" },
  { id: "tl-11", studentId: "2", event: "Application Submitted",     description: "Applied to University of Cambridge",                              date: "2025-01-15T09:00:00Z", type: "application" },
  { id: "tl-12", studentId: "2", event: "Application Accepted",      description: "🎉 Offer letter received from University of Cambridge",           date: "2025-04-10T10:00:00Z", type: "status" },

  { id: "tl-13", studentId: "3", event: "Preferences Completed",     description: "Student filled study preferences: UK, Data Science",             date: "2025-03-02T14:00:00Z", type: "preferences" },
  { id: "tl-14", studentId: "3", event: "University Saved",          description: "Saved UCL — M.Sc. Data Science",                                 date: "2025-03-10T10:00:00Z", type: "university" },
  { id: "tl-15", studentId: "3", event: "Application Submitted",     description: "Applied to ETH Zurich — M.Sc. Data Science",                    date: "2025-04-01T12:00:00Z", type: "application" },

  { id: "tl-16", studentId: "4", event: "Preferences Completed",     description: "Student filled study preferences: UK & Italy, MBA",              date: "2025-01-21T09:00:00Z", type: "preferences" },
  { id: "tl-17", studentId: "4", event: "Recommendation Generated",  description: "3 dream, 2 target, 3 safe universities recommended",             date: "2025-01-22T10:00:00Z", type: "recommendation" },
  { id: "tl-18", studentId: "4", event: "Application Submitted",     description: "Applied to University of Oxford — MBA",                          date: "2025-02-20T10:30:00Z", type: "application" },
  { id: "tl-19", studentId: "4", event: "Documents Uploaded",        description: "Passport, GMAT report, MBA Essays uploaded",                     date: "2025-03-01T09:00:00Z", type: "document" },

  { id: "tl-20", studentId: "5", event: "Preferences Completed",     description: "Student filled study preferences: UK & Germany, Electrical Eng", date: "2025-03-01T11:00:00Z", type: "preferences" },
  { id: "tl-21", studentId: "5", event: "University Saved",          description: "Saved Imperial College London — B.Eng. Electrical Eng",          date: "2025-02-28T10:00:00Z", type: "university" },
];

// ── Helper: aggregate stats per student ──────────────────────

export interface StudentSummary {
  student: MockStudent;
  totalApplications: number;
  totalDocuments: number;
  interestedCount: number;
  currentStatus: string;
}

export const getStudentSummaries = (): StudentSummary[] => {
  return mockStudents.map((student) => {
    const apps = mockApplications.filter((a) => a.studentId === student.id);
    const docs = mockDocuments.filter((d) => d.studentId === student.id);
    const interested = mockInterestedUniversities.filter((u) => u.studentId === student.id);

    // Determine current status from latest application
    const latestApp = apps.sort((a, b) =>
      new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    )[0];

    let currentStatus = "Profile Setup";
    if (latestApp) currentStatus = latestApp.status;

    return {
      student,
      totalApplications: apps.length,
      totalDocuments: docs.length,
      interestedCount: interested.length,
      currentStatus,
    };
  });
};

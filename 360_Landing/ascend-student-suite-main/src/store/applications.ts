// Application Store — local application state management
// No Supabase, No Backend, No Database

import { applicationService } from "@/lib/supabase/services/ApplicationService";
import { Application, ApplicationStatus, mockApplications } from "@/data/mock/applications";

const APPS_KEY = "student_applications";

let localApps: Application[] | null = null;
let currentUserId: number | null = null;
let initPromise: Promise<void> | null = null;

const mapRowToApp = (row: any): Application => ({
  id: row.id,
  studentId: row.student_id,
  studentName: "Student", 
  universityId: 1, 
  universityName: row.university_name,
  courseId: 1, 
  courseName: row.course_name,
  country: "Global", 
  status: row.status as any,
  workflowStage: "INITIAL",
  assignedAdminId: 0,
  assignedAdminName: "Unassigned",
  appliedDate: row.created_at,
  lastUpdated: row.updated_at,
  targetSemester: "Fall",
  isUrgent: false,
  progress: row.status === "ACCEPTED" ? 100 : row.status === "SUBMITTED" ? 50 : 10,
  documents: [],
  notes: row.notes || "",
});

export interface NewApplication {
  studentId: number;
  studentName: string;
  universityId: number;
  universityName: string;
  courseId: number;
  courseName: string;
  country: string;
  targetSemester: string;
}

export const applicationStore = {
  async init(studentId: number) {
    if (initPromise && currentUserId === studentId) return initPromise;
    currentUserId = studentId;
    initPromise = applicationService.getApplicationsByStudent(studentId).then(rows => {
      if (rows && rows.length > 0) {
        localApps = rows.map(mapRowToApp);
      } else {
        localApps = [];
      }
    });
    return initPromise;
  },

  getAll(): Application[] {
    if (!localApps) {
      // Fallback for immediate UI render if not init
      return mockApplications;
    }
    return localApps;
  },

  getById(id: number): Application | undefined {
    return this.getAll().find(a => a.id === id);
  },

  getByStudent(studentId: number): Application[] {
    return this.getAll().filter(a => a.studentId === studentId);
  },

  create(newApp: NewApplication): Application {
    const apps = this.getAll();
    const application: Application = {
      id: Math.max(0, ...apps.map(a => a.id)) + 1,
      studentId: newApp.studentId,
      studentName: newApp.studentName,
      universityId: newApp.universityId,
      universityName: newApp.universityName,
      courseId: newApp.courseId,
      courseName: newApp.courseName,
      country: newApp.country,
      status: "DRAFT",
      workflowStage: "INITIAL",
      assignedAdminId: 0,
      assignedAdminName: "Unassigned",
      appliedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      targetSemester: newApp.targetSemester,
      isUrgent: false,
      progress: 5,
      documents: [],
      notes: "Application created",
    };
    if (localApps) localApps.push(application);

    if (currentUserId) {
      applicationService.createApplication({
        student_id: newApp.studentId,
        university_name: newApp.universityName,
        course_name: newApp.courseName,
        status: "DRAFT",
        notes: "Application created",
      }).catch(err => console.error("Failed to create application in DB", err));
    }

    return application;
  },

  updateStatus(id: number, status: ApplicationStatus): Application | undefined {
    const apps = this.getAll();
    const app = apps.find(a => a.id === id);
    if (app) {
      app.status = status;
      app.lastUpdated = new Date().toISOString();
      if (currentUserId) {
        applicationService.updateStatus(id, status).catch(err => console.error("Failed to update application status", err));
      }
    }
    return app;
  },

  updateProgress(id: number, progress: number): Application | undefined {
    const apps = this.getAll();
    const app = apps.find(a => a.id === id);
    if (app) {
      app.progress = Math.min(100, Math.max(0, progress));
      app.lastUpdated = new Date().toISOString();
      // Progress not explicitly tracked in backend, only computed from status
    }
    return app;
  },

  delete(id: number): void {
    if (localApps) {
      localApps = localApps.filter(a => a.id !== id);
    }
    if (currentUserId) {
      applicationService.deleteApplication(id).catch(err => console.error("Failed to delete application", err));
    }
  },

  getStats() {
    const apps = this.getAll();
    const active = apps.filter(a => a.status !== "REJECTED").length;
    const accepted = apps.filter(a => a.status === "ACCEPTED").length;
    const submitted = apps.filter(a => a.status !== "DRAFT").length;
    return {
      total: apps.length,
      active,
      accepted,
      submitted,
      successRate: submitted > 0 ? Math.round((accepted / submitted) * 100) : 0,
    };
  },

  seed(): void {
    // Only set mock if empty
    if (!localApps || localApps.length === 0) {
      localApps = [...mockApplications];
    }
  },
};

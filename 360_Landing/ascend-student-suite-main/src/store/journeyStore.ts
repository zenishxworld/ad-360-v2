// ─────────────────────────────────────────────────────────────
// UNI360 Student Journey Store
// Phase 1C: Student Journey Tracker
// No Supabase · No Backend · No Auth · localStorage only
// ─────────────────────────────────────────────────────────────

import { localStorageService } from "@/services/localStorage";
import { preferenceStore } from "@/store/preferences";
import { applicationStore } from "@/store/applications";
import { documentStore } from "@/store/documents";
import { savedItemsStore } from "@/store/savedItems";

// ── Types ────────────────────────────────────────────────────

export type MilestoneId =
  | "preferences_completed"
  | "recommendations_generated"
  | "university_saved"
  | "application_submitted"
  | "documents_uploaded"
  | "admin_review";

export interface Milestone {
  id: MilestoneId;
  step: number;       // 1–6
  title: string;
  description: string;
  nextAction: string;
  nextRoute: string;
  icon: string;
}

export interface JourneyState {
  completedMilestones: MilestoneId[];
  lastUpdated: string;
  demoMode: boolean;
}

// ── Milestone definitions ─────────────────────────────────────

export const MILESTONES: Milestone[] = [
  {
    id: "preferences_completed",
    step: 1,
    title: "Preferences Completed",
    description: "Set your target countries, degree level, CGPA, and test scores",
    nextAction: "Generate Recommendations",
    nextRoute: "/university-finder",
    icon: "🎯",
  },
  {
    id: "recommendations_generated",
    step: 2,
    title: "Recommendations Generated",
    description: "Personalized university matches based on your academic profile",
    nextAction: "Save a University",
    nextRoute: "/university-finder",
    icon: "⭐",
  },
  {
    id: "university_saved",
    step: 3,
    title: "University Saved",
    description: "Shortlisted your preferred universities from recommendations",
    nextAction: "Submit an Application",
    nextRoute: "/university-finder",
    icon: "🏛",
  },
  {
    id: "application_submitted",
    step: 4,
    title: "Application Submitted",
    description: "Your application has been sent to the chosen university",
    nextAction: "Upload Required Documents",
    nextRoute: "/documents",
    icon: "📄",
  },
  {
    id: "documents_uploaded",
    step: 5,
    title: "Documents Uploaded",
    description: "All required documents uploaded and ready for review",
    nextAction: "Wait for Admin Review",
    nextRoute: "/applications",
    icon: "📁",
  },
  {
    id: "admin_review",
    step: 6,
    title: "Admin Review Complete",
    description: "Your application has been reviewed by the admissions team",
    nextAction: "Check Application Status",
    nextRoute: "/applications",
    icon: "✅",
  },
];

const JOURNEY_KEY = "student_journey";

const DEFAULT_STATE: JourneyState = {
  completedMilestones: [],
  lastUpdated: new Date().toISOString(),
  demoMode: false,
};

// ── Journey Store ─────────────────────────────────────────────

export const journeyStore = {
  // ── Get stored state ─────────────────────────────────────
  getState(): JourneyState {
    return localStorageService.get<JourneyState>(JOURNEY_KEY, DEFAULT_STATE);
  },

  saveState(state: JourneyState): void {
    localStorageService.set(JOURNEY_KEY, { ...state, lastUpdated: new Date().toISOString() });
  },

  // ── Mark a milestone complete ─────────────────────────────
  complete(id: MilestoneId): void {
    const state = this.getState();
    if (!state.completedMilestones.includes(id)) {
      state.completedMilestones.push(id);
      this.saveState(state);
    }
  },

  // ── Un-complete a milestone ───────────────────────────────
  uncomplete(id: MilestoneId): void {
    const state = this.getState();
    state.completedMilestones = state.completedMilestones.filter((m) => m !== id);
    this.saveState(state);
  },

  isComplete(id: MilestoneId): boolean {
    return this.getState().completedMilestones.includes(id);
  },

  // ── Compute milestones from actual data ───────────────────
  computeFromStores(): MilestoneId[] {
    const completed: MilestoneId[] = [];

    // 1. Preferences
    if (preferenceStore.hasPreferences()) {
      completed.push("preferences_completed");

      // 2. Recommendations are auto-generated when preferences exist
      completed.push("recommendations_generated");
    }

    // 3. University Saved
    const savedCounts = savedItemsStore.getSavedCounts();
    if (savedCounts.universities > 0 || savedCounts.courses > 0) {
      completed.push("university_saved");
    }

    // 4. Application Submitted (not just DRAFT)
    const apps = applicationStore.getAll();
    const hasSubmitted = apps.some(
      (a) => a.status !== "DRAFT"
    );
    if (hasSubmitted) {
      completed.push("application_submitted");
    }

    // 5. Documents Uploaded (at least 1 uploaded/approved doc)
    const docs = documentStore.getAll();
    const hasUploadedDoc = docs.some(
      (d) => d.status === "UPLOADED" || d.status === "APPROVED"
    );
    if (hasUploadedDoc) {
      completed.push("documents_uploaded");
    }

    // 6. Admin Review (admin changed status to SUBMITTED or UNDER_REVIEW or ACCEPTED)
    const hasAdminReview = apps.some(
      (a) => a.status === "SUBMITTED" || a.status === "UNDER_REVIEW" || a.status === "ACCEPTED"
    );
    if (hasAdminReview) {
      completed.push("admin_review");
    }

    return completed;
  },

  // ── Sync from actual store data (call on mount) ────────────
  sync(): JourneyState {
    const computed = this.computeFromStores();
    const state = this.getState();

    // Merge: keep any manually-set milestones + computed ones
    const merged = Array.from(new Set([...state.completedMilestones, ...computed]));
    const updated: JourneyState = {
      ...state,
      completedMilestones: merged,
    };
    this.saveState(updated);
    return updated;
  },

  // ── Progress calculation ──────────────────────────────────
  getProgress(state?: JourneyState): number {
    const s = state ?? this.sync();
    const totalSteps = MILESTONES.length;
    const completedCount = s.completedMilestones.length;
    return Math.round((completedCount / totalSteps) * 100);
  },

  // ── Current active milestone (first incomplete) ───────────
  getCurrentMilestone(state?: JourneyState): Milestone | null {
    const s = state ?? this.sync();
    return (
      MILESTONES.find((m) => !s.completedMilestones.includes(m.id)) ?? null
    );
  },

  // ── Completed milestone objects ───────────────────────────
  getCompletedMilestones(state?: JourneyState): Milestone[] {
    const s = state ?? this.sync();
    return MILESTONES.filter((m) => s.completedMilestones.includes(m.id));
  },

  // ── Demo: complete the full journey ──────────────────────
  runDemoJourney(): JourneyState {
    // 1. Set preferences
    preferenceStore.save({
      preferredCountries: ["Germany"],
      degreeLevel: "Master",
      targetCourse: "Computer Science",
      cgpa: 8.2,
      ielts: 7.0,
      toefl: 0,
      pte: 0,
      gre: 310,
      gmat: 0,
      workExperience: "1 Year",
    });

    // 2. Save a university
    savedItemsStore.saveUniversity(1);
    savedItemsStore.saveCourse(1, 1);

    // 3. Submit an application (seed + update status)
    applicationStore.seed();
    const apps = applicationStore.getAll();
    if (apps.length > 0) {
      applicationStore.updateStatus(apps[0].id, "SUBMITTED");
    }

    // 4. Seed documents
    documentStore.seed();

    // 5. Mark admin review (update status to UNDER_REVIEW)
    const updatedApps = applicationStore.getAll();
    if (updatedApps.length > 0) {
      applicationStore.updateStatus(updatedApps[0].id, "UNDER_REVIEW");
    }

    const allIds: MilestoneId[] = MILESTONES.map((m) => m.id);
    const state: JourneyState = {
      completedMilestones: allIds,
      lastUpdated: new Date().toISOString(),
      demoMode: true,
    };
    this.saveState(state);
    return state;
  },

  // ── Reset journey ─────────────────────────────────────────
  reset(): void {
    this.saveState(DEFAULT_STATE);
  },
};

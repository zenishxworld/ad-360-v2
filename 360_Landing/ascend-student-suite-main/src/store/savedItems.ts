// Saved Items Store — save/remove universities and courses
// No Supabase, No Backend, No Database

import { savedItemsService } from "@/lib/supabase/services/SavedItemsService";

export interface SavedUniversity {
  universityId: number;
  savedAt: string;
}

export interface SavedCourse {
  courseId: number;
  universityId: number;
  savedAt: string;
}

let localSavedUnis: SavedUniversity[] | null = null;
let localSavedCourses: SavedCourse[] | null = null;
let currentUserId: number | null = null;
let initPromise: Promise<void> | null = null;

export const savedItemsStore = {
  async init(studentId: number) {
    if (initPromise && currentUserId === studentId) return initPromise;
    currentUserId = studentId;
    initPromise = Promise.all([
      savedItemsService.getSavedUniversities(studentId),
      savedItemsService.getSavedCourses(studentId),
    ]).then(([unis, courses]) => {
      localSavedUnis = unis.map(u => ({ universityId: u.university_id, savedAt: u.created_at }));
      localSavedCourses = courses.map(c => ({ courseId: c.course_id, universityId: c.university_id, savedAt: c.created_at }));
    });
    return initPromise;
  },

  // ── Universities ──────────────────────────────────────────
  getSavedUniversities(): SavedUniversity[] {
    return localSavedUnis || [];
  },

  isUniversitySaved(universityId: number): boolean {
    const saved = this.getSavedUniversities();
    return saved.some(s => s.universityId === universityId);
  },

  saveUniversity(universityId: number): void {
    if (!this.isUniversitySaved(universityId)) {
      if (localSavedUnis) localSavedUnis.push({ universityId, savedAt: new Date().toISOString() });
      if (currentUserId) {
        savedItemsService.saveUniversity({ student_id: currentUserId, university_id: universityId })
          .catch(err => console.error("Failed to save university", err));
      }
    }
  },

  removeUniversity(universityId: number): void {
    if (localSavedUnis) localSavedUnis = localSavedUnis.filter(s => s.universityId !== universityId);
    if (currentUserId) {
      savedItemsService.removeUniversity(currentUserId, universityId)
        .catch(err => console.error("Failed to remove university", err));
    }
  },

  toggleUniversity(universityId: number): boolean {
    if (this.isUniversitySaved(universityId)) {
      this.removeUniversity(universityId);
      return false;
    } else {
      this.saveUniversity(universityId);
      return true;
    }
  },

  // ── Courses ──────────────────────────────────────────────
  getSavedCourses(): SavedCourse[] {
    return localSavedCourses || [];
  },

  isCourseSaved(courseId: number): boolean {
    const saved = this.getSavedCourses();
    return saved.some(s => s.courseId === courseId);
  },

  saveCourse(courseId: number, universityId: number): void {
    if (!this.isCourseSaved(courseId)) {
      if (localSavedCourses) localSavedCourses.push({ courseId, universityId, savedAt: new Date().toISOString() });
      if (currentUserId) {
        savedItemsService.saveCourse({ student_id: currentUserId, course_id: courseId, university_id: universityId })
          .catch(err => console.error("Failed to save course", err));
      }
    }
  },

  removeCourse(courseId: number): void {
    if (localSavedCourses) {
      const course = localSavedCourses.find(c => c.courseId === courseId);
      localSavedCourses = localSavedCourses.filter(s => s.courseId !== courseId);
      if (currentUserId && course) {
        savedItemsService.removeCourse(currentUserId, courseId, course.universityId)
          .catch(err => console.error("Failed to remove course", err));
      }
    }
  },

  toggleCourse(courseId: number, universityId: number): boolean {
    if (this.isCourseSaved(courseId)) {
      this.removeCourse(courseId);
      return false;
    } else {
      this.saveCourse(courseId, universityId);
      return true;
    }
  },

  // ── Counts ───────────────────────────────────────────────
  getSavedCounts() {
    return {
      universities: this.getSavedUniversities().length,
      courses: this.getSavedCourses().length,
    };
  },
};

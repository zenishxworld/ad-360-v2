import { studentProfileService } from "@/lib/supabase/services/StudentProfileService";
import { StudentPreferences, DEFAULT_PREFERENCES } from "@/data/mock/recommendations";

let localPrefs: StudentPreferences | null = null;
let currentUserId: string | null = null;
let initPromise: Promise<void> | null = null;

// Map StudentProfileRow to StudentPreferences
const mapRowToPrefs = (row: any): StudentPreferences => ({
  preferredCountries: row.preferred_countries || [],
  degreeLevel: row.degree_level || "",
  targetCourse: row.target_course || "",
  cgpa: row.cgpa || 0,
  ielts: row.english_test === "IELTS" ? (row.english_score || 0) : 0,
  toefl: row.english_test === "TOEFL" ? (row.english_score || null) : null,
  pte: row.english_test === "PTE" ? (row.english_score || null) : null,
  gre: row.gre_score || null,
  gmat: row.gmat_score || null,
  workExperience: row.work_experience || "",
});

export const preferenceStore = {
  async init(userId: string) {
    if (initPromise && currentUserId === userId) return initPromise;
    currentUserId = userId;
    initPromise = studentProfileService.getProfile(userId).then(profile => {
      if (profile) {
        localPrefs = mapRowToPrefs(profile);
      } else {
        localPrefs = { ...DEFAULT_PREFERENCES };
      }
    });
    return initPromise;
  },

  get(): StudentPreferences {
    return localPrefs || DEFAULT_PREFERENCES;
  },

  save(prefs: Partial<StudentPreferences>): StudentPreferences {
    const current = this.get();
    const updated = { ...current, ...prefs };
    localPrefs = updated;

    if (currentUserId) {
      // Fire and forget
      let test = null;
      let score = null;
      if (updated.ielts) { test = "IELTS"; score = updated.ielts; }
      else if (updated.toefl) { test = "TOEFL"; score = updated.toefl; }
      else if (updated.pte) { test = "PTE"; score = updated.pte; }

      studentProfileService.saveProfile({
        user_id: currentUserId,
        full_name: "Student", // Will be updated by auth
        email: "student@demo.com", // Will be updated by auth
        preferred_countries: updated.preferredCountries,
        degree_level: updated.degreeLevel,
        target_course: updated.targetCourse,
        cgpa: updated.cgpa,
        english_test: test,
        english_score: score,
        gre_score: updated.gre,
        gmat_score: updated.gmat,
        work_experience: updated.workExperience,
      }).catch(err => console.error("Failed to save profile", err));
    }

    return updated;
  },

  update<K extends keyof StudentPreferences>(key: K, value: StudentPreferences[K]): StudentPreferences {
    return this.save({ [key]: value });
  },

  reset(): void {
    localPrefs = { ...DEFAULT_PREFERENCES };
    // Should potentially clear in DB as well, but no delete method in spec
  },

  hasPreferences(): boolean {
    const prefs = this.get();
    return prefs.preferredCountries.length > 0 || prefs.degreeLevel !== "" || prefs.cgpa > 0;
  },
};

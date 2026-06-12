import { DEMO_MODE } from '@/config/demoMode';
import { supabase } from '../client';
import { localStorageService } from '@/services/localStorage';
import { Database } from '../types';

type StudentProfileRow = Database['public']['Tables']['student_profiles']['Row'];
type StudentProfileInsert = Database['public']['Tables']['student_profiles']['Insert'];
type StudentProfileUpdate = Database['public']['Tables']['student_profiles']['Update'];

export class StudentProfileRepository {
  private readonly LOCAL_STORAGE_KEY = 'student_preferences'; // Maps to local store

  async getProfile(userId: string): Promise<StudentProfileRow | null> {
    if (DEMO_MODE) {
      const localPrefs = localStorageService.get<any>(this.LOCAL_STORAGE_KEY, null);
      if (!localPrefs) return null;
      // Map local preferences to profile schema shape
      return {
        id: 1,
        user_id: userId,
        full_name: 'Demo Student',
        email: 'student@demo.com',
        phone: null,
        preferred_countries: localPrefs.preferredCountries || [],
        degree_level: localPrefs.degreeLevel || null,
        target_course: localPrefs.targetCourse || null,
        cgpa: localPrefs.cgpa || null,
        english_test: localPrefs.ielts ? 'IELTS' : null,
        english_score: localPrefs.ielts || null,
        gre_score: localPrefs.gre || null,
        gmat_score: localPrefs.gmat || null,
        work_experience: localPrefs.workExperience || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    }
  }

  async saveProfile(profile: StudentProfileInsert): Promise<StudentProfileRow> {
    if (DEMO_MODE) {
      // Map back to local store preferences
      const prefsToSave = {
        preferredCountries: profile.preferred_countries || [],
        degreeLevel: profile.degree_level || '',
        targetCourse: profile.target_course || '',
        cgpa: profile.cgpa || 0,
        ielts: profile.english_test === 'IELTS' ? profile.english_score : 0,
        gre: profile.gre_score || null,
        gmat: profile.gmat_score || null,
        workExperience: profile.work_experience || '',
      };
      
      const current = localStorageService.get<any>(this.LOCAL_STORAGE_KEY, {});
      localStorageService.set(this.LOCAL_STORAGE_KEY, { ...current, ...prefsToSave });
      
      return this.getProfile(profile.user_id || '') as Promise<StudentProfileRow>;
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('student_profiles')
        .upsert(profile)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
}

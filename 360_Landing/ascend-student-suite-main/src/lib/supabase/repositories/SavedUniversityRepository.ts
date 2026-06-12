import { DEMO_MODE } from '@/config/demoMode';
import { supabase } from '../client';
import { localStorageService } from '@/services/localStorage';
import { Database } from '../types';

type SavedUniversityRow = Database['public']['Tables']['saved_universities']['Row'];
type SavedUniversityInsert = Database['public']['Tables']['saved_universities']['Insert'];

interface LocalSavedUniversity {
  universityId: number;
  savedAt: string;
}

export class SavedUniversityRepository {
  private readonly LOCAL_STORAGE_KEY = 'saved_universities';

  async getSavedUniversities(studentId: number): Promise<SavedUniversityRow[]> {
    if (DEMO_MODE) {
      const saved = localStorageService.get<LocalSavedUniversity[]>(this.LOCAL_STORAGE_KEY, []);
      return saved.map((s, index) => ({
        id: index + 1,
        student_id: studentId,
        university_id: s.universityId,
        country: null,
        created_at: s.savedAt,
      }));
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('saved_universities')
        .select('*')
        .eq('student_id', studentId);

      if (error) throw error;
      return data;
    }
  }

  async saveUniversity(savedUni: SavedUniversityInsert): Promise<SavedUniversityRow> {
    if (DEMO_MODE) {
      const saved = localStorageService.get<LocalSavedUniversity[]>(this.LOCAL_STORAGE_KEY, []);
      // Local storage currently uses universityId, we'll mock an ID here for demo mode compatibility
      const mockUniversityId = Math.floor(Math.random() * 100) + 1;
      
      if (!saved.some(s => s.universityId === mockUniversityId)) {
        saved.push({ universityId: mockUniversityId, savedAt: new Date().toISOString() });
        localStorageService.set(this.LOCAL_STORAGE_KEY, saved);
      }
      
      return {
        id: Math.random(),
        student_id: savedUni.student_id,
        university_id: savedUni.university_id,
        country: savedUni.country || null,
        created_at: new Date().toISOString(),
      };
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('saved_universities')
        .insert(savedUni)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async removeUniversity(studentId: number, universityId: number): Promise<void> {
    if (DEMO_MODE) {
      // In Demo mode, we just clear everything for simplicity if we can't match by ID
      // Real app uses universityId. This is a shim for the new string-based schema.
      const saved = localStorageService.get<LocalSavedUniversity[]>(this.LOCAL_STORAGE_KEY, []);
      localStorageService.set(this.LOCAL_STORAGE_KEY, saved.slice(0, -1)); // Just remove the last one as mock
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase
        .from('saved_universities')
        .delete()
        .match({ student_id: studentId, university_id: universityId });

      if (error) throw error;
    }
  }
}

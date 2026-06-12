import { DEMO_MODE } from '@/config/demoMode';
import { supabase } from '../client';
import { localStorageService } from '@/services/localStorage';
import { Database } from '../types';

type SavedCourseRow = Database['public']['Tables']['saved_courses']['Row'];
type SavedCourseInsert = Database['public']['Tables']['saved_courses']['Insert'];

interface LocalSavedCourse {
  courseId: number;
  universityId: number;
  savedAt: string;
}

export class SavedCourseRepository {
  private readonly LOCAL_STORAGE_KEY = 'saved_courses';

  async getSavedCourses(studentId: number): Promise<SavedCourseRow[]> {
    if (DEMO_MODE) {
      const saved = localStorageService.get<LocalSavedCourse[]>(this.LOCAL_STORAGE_KEY, []);
      return saved.map((s, index) => ({
        id: index + 1,
        student_id: studentId,
        course_id: s.courseId,
        university_id: s.universityId,
        created_at: s.savedAt,
      }));
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('saved_courses')
        .select('*')
        .eq('student_id', studentId);

      if (error) throw error;
      return data;
    }
  }

  async saveCourse(savedCourse: SavedCourseInsert): Promise<SavedCourseRow> {
    if (DEMO_MODE) {
      const saved = localStorageService.get<LocalSavedCourse[]>(this.LOCAL_STORAGE_KEY, []);
      const mockCourseId = Math.floor(Math.random() * 100) + 1;
      const mockUniversityId = Math.floor(Math.random() * 100) + 1;
      
      saved.push({ 
        courseId: mockCourseId, 
        universityId: mockUniversityId, 
        savedAt: new Date().toISOString() 
      });
      localStorageService.set(this.LOCAL_STORAGE_KEY, saved);
      
      return {
        id: Math.random(),
        student_id: savedCourse.student_id,
        course_id: savedCourse.course_id,
        university_id: savedCourse.university_id,
        created_at: new Date().toISOString(),
      };
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('saved_courses')
        .insert(savedCourse)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async removeCourse(studentId: number, courseId: number, universityId: number): Promise<void> {
    if (DEMO_MODE) {
      const saved = localStorageService.get<LocalSavedCourse[]>(this.LOCAL_STORAGE_KEY, []);
      localStorageService.set(this.LOCAL_STORAGE_KEY, saved.slice(0, -1)); // Just remove the last one as mock
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase
        .from('saved_courses')
        .delete()
        .match({ student_id: studentId, course_id: courseId, university_id: universityId });

      if (error) throw error;
    }
  }
}

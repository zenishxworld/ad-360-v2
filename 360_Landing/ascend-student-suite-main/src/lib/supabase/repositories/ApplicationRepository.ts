import { DEMO_MODE } from '@/config/demoMode';
import { supabase } from '../client';
import { localStorageService } from '@/services/localStorage';
import { Database } from '../types';
import { Application } from '@/data/mock/applications';

type ApplicationRow = Database['public']['Tables']['applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];

export class ApplicationRepository {
  private readonly LOCAL_STORAGE_KEY = 'student_applications';

  async getApplicationsByStudent(studentId: number): Promise<ApplicationRow[]> {
    if (DEMO_MODE) {
      const apps = localStorageService.get<Application[]>(this.LOCAL_STORAGE_KEY, []);
      return apps.filter(a => a.studentId === studentId).map(a => ({
        id: a.id,
        student_id: a.studentId,
        university_name: a.universityName,
        course_name: a.courseName,
        status: a.status,
        notes: a.notes || null,
        created_at: a.appliedDate,
        updated_at: a.lastUpdated,
      }));
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('student_id', studentId);

      if (error) throw error;
      return data;
    }
  }

  async createApplication(app: ApplicationInsert): Promise<ApplicationRow> {
    if (DEMO_MODE) {
      const apps = localStorageService.get<Application[]>(this.LOCAL_STORAGE_KEY, []);
      const newId = Math.max(0, ...apps.map(a => a.id)) + 1;
      
      const newApp: Application = {
        id: newId,
        studentId: app.student_id,
        studentName: 'Demo Student', // Mock logic
        universityId: 1, // Mock logic
        universityName: app.university_name,
        courseId: 1, // Mock logic
        courseName: app.course_name,
        country: 'Global', // Mock logic
        status: app.status as any || 'DRAFT',
        workflowStage: 'INITIAL',
        assignedAdminId: 0,
        assignedAdminName: 'Unassigned',
        appliedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        targetSemester: 'Fall 2025',
        isUrgent: false,
        progress: 5,
        documents: [],
        notes: app.notes || '',
      };
      
      apps.push(newApp);
      localStorageService.set(this.LOCAL_STORAGE_KEY, apps);
      
      return {
        id: newId,
        student_id: newApp.studentId,
        university_name: newApp.universityName,
        course_name: newApp.courseName,
        status: newApp.status,
        notes: newApp.notes,
        created_at: newApp.appliedDate,
        updated_at: newApp.lastUpdated,
      };
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('applications')
        .insert(app)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async updateStatus(id: number, status: string): Promise<void> {
    if (DEMO_MODE) {
      const apps = localStorageService.get<Application[]>(this.LOCAL_STORAGE_KEY, []);
      const app = apps.find(a => a.id === id);
      if (app) {
        app.status = status as any;
        app.lastUpdated = new Date().toISOString();
        localStorageService.set(this.LOCAL_STORAGE_KEY, apps);
      }
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    }
  }

  async deleteApplication(id: number): Promise<void> {
    if (DEMO_MODE) {
      const apps = localStorageService.get<Application[]>(this.LOCAL_STORAGE_KEY, []);
      localStorageService.set(this.LOCAL_STORAGE_KEY, apps.filter(a => a.id !== id));
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  }
}

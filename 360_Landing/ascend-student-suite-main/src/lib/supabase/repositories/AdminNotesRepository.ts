import { DEMO_MODE } from '@/config/demoMode';
import { supabase } from '../client';
import { localStorageService } from '@/services/localStorage';
import { Database } from '../types';

type AdminNoteRow = Database['public']['Tables']['admin_notes']['Row'];
type AdminNoteInsert = Database['public']['Tables']['admin_notes']['Insert'];

export class AdminNotesRepository {
  private readonly LOCAL_STORAGE_KEY = 'admin_notes';

  async getNotesByStudent(studentId: number): Promise<AdminNoteRow[]> {
    if (DEMO_MODE) {
      const notes = localStorageService.get<AdminNoteRow[]>(this.LOCAL_STORAGE_KEY, []);
      return notes.filter(n => n.student_id === studentId);
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('admin_notes')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  }

  async addNote(note: AdminNoteInsert): Promise<AdminNoteRow> {
    if (DEMO_MODE) {
      const notes = localStorageService.get<AdminNoteRow[]>(this.LOCAL_STORAGE_KEY, []);
      const newNote: AdminNoteRow = {
        id: Math.max(0, ...notes.map(n => n.id)) + 1,
        student_id: note.student_id,
        admin_id: note.admin_id,
        note: note.note,
        created_at: new Date().toISOString(),
      };
      
      notes.push(newNote);
      localStorageService.set(this.LOCAL_STORAGE_KEY, notes);
      
      return newNote;
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('admin_notes')
        .insert(note)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async updateNote(id: number, updatedNote: string): Promise<AdminNoteRow> {
    if (DEMO_MODE) {
      const notes = localStorageService.get<AdminNoteRow[]>(this.LOCAL_STORAGE_KEY, []);
      const index = notes.findIndex(n => n.id === id);
      if (index === -1) throw new Error('Note not found');
      
      notes[index].note = updatedNote;
      localStorageService.set(this.LOCAL_STORAGE_KEY, notes);
      
      return notes[index];
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('admin_notes')
        .update({ note: updatedNote })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
}

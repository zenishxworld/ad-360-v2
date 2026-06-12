import { AdminNotesRepository } from '../repositories/AdminNotesRepository';
import { Database } from '../types';

type AdminNoteRow = Database['public']['Tables']['admin_notes']['Row'];
type AdminNoteInsert = Database['public']['Tables']['admin_notes']['Insert'];

export class AdminNotesService {
  private repository = new AdminNotesRepository();

  async getNotesByStudent(studentId: number): Promise<AdminNoteRow[]> {
    return this.repository.getNotesByStudent(studentId);
  }

  async addNote(note: AdminNoteInsert): Promise<AdminNoteRow> {
    return this.repository.addNote(note);
  }

  async updateNote(id: number, note: string): Promise<AdminNoteRow> {
    return this.repository.updateNote(id, note);
  }
}

export const adminNotesService = new AdminNotesService();

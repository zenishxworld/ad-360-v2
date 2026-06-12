import { DEMO_MODE } from '@/config/demoMode';
import { supabase } from '../client';
import { localStorageService } from '@/services/localStorage';
import { Database } from '../types';
import { Document as LocalDocument } from '@/data/mock/documents';

type DocumentRow = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];

export class DocumentRepository {
  private readonly LOCAL_STORAGE_KEY = 'student_documents';

  async getDocumentsByStudent(studentId: number): Promise<DocumentRow[]> {
    if (DEMO_MODE) {
      const docs = localStorageService.get<LocalDocument[]>(this.LOCAL_STORAGE_KEY, []);
      return docs.filter(d => d.studentId === studentId).map(d => ({
        id: d.id,
        student_id: d.studentId,
        document_type: d.type,
        file_name: d.name,
        file_url: null, // Mocks don't have real URLs yet
        status: d.status,
        uploaded_at: d.uploadDate,
        updated_at: d.uploadDate, // Mocking
      }));
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('student_id', studentId);

      if (error) throw error;
      return data;
    }
  }

  async uploadDocument(doc: DocumentInsert): Promise<DocumentRow> {
    if (DEMO_MODE) {
      const docs = localStorageService.get<LocalDocument[]>(this.LOCAL_STORAGE_KEY, []);
      const newId = Math.max(0, ...docs.map(d => d.id)) + 1;
      
      const newDoc: LocalDocument = {
        id: newId,
        studentId: doc.student_id,
        applicationId: null,
        name: doc.file_name,
        type: doc.document_type as any,
        category: 'Additional Documents', // Mock mapping
        status: (doc.status as any) || 'UPLOADED',
        uploadDate: new Date().toISOString(),
        fileSize: 1024,
        fileType: 'application/pdf',
        remarks: null,
      };
      
      docs.push(newDoc);
      localStorageService.set(this.LOCAL_STORAGE_KEY, docs);
      
      return {
        id: newId,
        student_id: newDoc.studentId,
        document_type: newDoc.type,
        file_name: newDoc.name,
        file_url: doc.file_url || null,
        status: newDoc.status,
        uploaded_at: newDoc.uploadDate,
        updated_at: newDoc.uploadDate,
      };
    } else {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from('documents')
        .insert(doc)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
}

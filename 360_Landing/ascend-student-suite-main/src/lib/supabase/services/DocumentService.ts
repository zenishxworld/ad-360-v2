import { DocumentRepository } from '../repositories/DocumentRepository';
import { Database } from '../types';

type DocumentRow = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];

export class DocumentService {
  private repository = new DocumentRepository();

  async getDocumentsByStudent(studentId: number): Promise<DocumentRow[]> {
    return this.repository.getDocumentsByStudent(studentId);
  }

  async uploadDocument(doc: DocumentInsert): Promise<DocumentRow> {
    return this.repository.uploadDocument(doc);
  }
}

export const documentService = new DocumentService();

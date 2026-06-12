import { DocumentRepository } from '../repositories/DocumentRepository';
import { documentStorageService } from './DocumentStorageService';
import { Database } from '../types';

type DocumentRow = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];

export class DocumentService {
  private repository = new DocumentRepository();

  async getDocumentsByStudent(studentId: number): Promise<DocumentRow[]> {
    return this.repository.getDocumentsByStudent(studentId);
  }

  async uploadDocument(doc: DocumentInsert, file: File | Blob): Promise<DocumentRow> {
    const bucketName = doc.document_type.toLowerCase();
    const path = `${doc.student_id}/${Date.now()}_${doc.file_name}`;
    
    // Upload file
    const fileUrl = await documentStorageService.uploadFile(bucketName, path, file);
    
    // Save metadata
    doc.file_url = fileUrl;
    return this.repository.uploadDocument(doc);
  }

  async replaceDocument(id: number, doc: DocumentRow, newFile: File | Blob, newFileName: string): Promise<DocumentRow> {
    const bucketName = doc.document_type.toLowerCase();
    
    // Attempt to extract the old path from the file_url to overwrite it.
    // However, if the name changes, it's safer to just upload a new file and maybe delete the old one.
    // For now, let's just create a new path and update the DB to avoid parsing complexity.
    const newPath = `${doc.student_id}/${Date.now()}_${newFileName}`;
    
    // Upload new file
    const newFileUrl = await documentStorageService.uploadFile(bucketName, newPath, newFile);
    
    // Ideally we would delete the old file here if it's not a DEMO mock URL
    if (doc.file_url && !doc.file_url.includes('mock-url')) {
      try {
        const oldPathMatch = doc.file_url.split(`/${bucketName}/`)[1];
        if (oldPathMatch) {
          await documentStorageService.deleteFile(bucketName, oldPathMatch);
        }
      } catch (err) {
        console.warn("Failed to delete old file during replace:", err);
      }
    }

    // Update DB record
    return this.repository.updateDocumentUrl(id, newFileUrl);
  }

  async deleteDocument(id: number, doc: DocumentRow): Promise<void> {
    const bucketName = doc.document_type.toLowerCase();
    
    if (doc.file_url && !doc.file_url.includes('mock-url')) {
      try {
        const pathMatch = doc.file_url.split(`/${bucketName}/`)[1];
        if (pathMatch) {
          await documentStorageService.deleteFile(bucketName, pathMatch);
        }
      } catch (err) {
        console.warn("Failed to delete file from storage during document delete:", err);
      }
    }

    return this.repository.deleteDocument(id);
  }
}

export const documentService = new DocumentService();

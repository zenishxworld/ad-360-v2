// Document Store — local document state management
// Do NOT integrate Supabase Storage yet.

import { documentService } from "@/lib/supabase/services/DocumentService";
import { Document, DocumentStatus, DocumentType, mockDocuments, DOCUMENT_CATEGORIES } from "@/data/mock/documents";

const DOCS_KEY = "student_documents";

export interface UploadDocumentInput {
  name: string;
  type: DocumentType;
  category: string;
  applicationId?: number;
  fileSize: number;
  fileSize: number;
  fileType: string;
  file?: File; // The physical file object to upload
}

let localDocs: Document[] | null = null;
let currentUserId: number | null = null;
let initPromise: Promise<void> | null = null;

const mapRowToDoc = (row: any): Document => ({
  id: row.id,
  studentId: row.student_id,
  applicationId: null, // Depending on future schema, this might map if application tracking links documents
  name: row.file_name,
  type: row.document_type as DocumentType,
  category: "Additional Documents", // Should be mapped correctly if needed
  status: row.status as DocumentStatus || "UPLOADED",
  uploadDate: row.uploaded_at,
  fileSize: 1024, // Ideally we would calculate or retrieve this, hardcoded for now
  fileType: "application/pdf", // Same here
  remarks: null,
  fileUrl: row.file_url || null,
});

export const documentStore = {
  async init(studentId: number) {
    if (initPromise && currentUserId === studentId) return initPromise;
    currentUserId = studentId;
    initPromise = documentService.getDocumentsByStudent(studentId).then(rows => {
      if (rows && rows.length > 0) {
        localDocs = rows.map(mapRowToDoc);
      } else {
        localDocs = [];
      }
    });
    return initPromise;
  },

  getAll(): Document[] {
    if (!localDocs) {
      return mockDocuments;
    }
    return localDocs;
  },

  getByStudent(studentId: number): Document[] {
    return this.getAll().filter(d => d.studentId === studentId);
  },

  getByApplication(applicationId: number): Document[] {
    return this.getAll().filter(d => d.applicationId === applicationId);
  },

  getByCategory(category: string): Document[] {
    return this.getAll().filter(d => d.category === category);
  },

  upload(input: UploadDocumentInput): Document {
    const docs = this.getAll();
    const newDoc: Document = {
      id: Math.max(0, ...docs.map(d => d.id)) + 1,
      studentId: currentUserId || 1,
      applicationId: input.applicationId ?? null,
      name: input.name,
      type: input.type,
      category: input.category,
      status: "UPLOADED",
      uploadDate: new Date().toISOString(),
      fileSize: input.fileSize,
      fileType: input.fileType,
      remarks: null,
    };
    if (localDocs) localDocs.push(newDoc);
    
    if (currentUserId) {
      // Create a dummy file if not provided, just for demo robustness
      const filePayload = input.file || new Blob(["mock content"], { type: input.fileType });
      
      documentService.uploadDocument({
        student_id: currentUserId,
        document_type: input.type,
        file_name: input.name,
        status: "UPLOADED"
      }, filePayload as File).catch(err => console.error("Failed to upload document", err));
    }

    return newDoc;
  },

  replace(id: number, input: UploadDocumentInput): Document | undefined {
    const docs = this.getAll();
    const doc = docs.find(d => d.id === id);
    if (!doc) return undefined;

    doc.name = input.name;
    doc.fileSize = input.fileSize;
    doc.fileType = input.fileType;
    doc.uploadDate = new Date().toISOString();
    
    if (currentUserId) {
      const filePayload = input.file || new Blob(["mock content"], { type: input.fileType });
      // We pass a dummy row to the service since we don't store file_url locally right now
      const docRow: any = { document_type: doc.type, student_id: currentUserId, file_url: `mock-url-for-${doc.type.toLowerCase()}-path` };
      
      documentService.replaceDocument(id, docRow, filePayload as File, input.name)
        .catch(err => console.error("Failed to replace document", err));
    }

    return doc;
  },

  updateStatus(id: number, status: DocumentStatus, remarks?: string): Document | undefined {
    const docs = this.getAll();
    const doc = docs.find(d => d.id === id);
    if (doc) {
      doc.status = status;
      if (remarks !== undefined) doc.remarks = remarks;
      // Depending on the backend needs, you might want a service method to update status.
    }
    return doc;
  },

  delete(id: number): void {
    if (localDocs) {
      const doc = localDocs.find(d => d.id === id);
      localDocs = localDocs.filter(d => d.id !== id);
      
      if (currentUserId && doc) {
        // We need a dummy row to pass to DocumentService for bucket extraction
        const docRow: any = { document_type: doc.type, file_url: `mock-url-for-${doc.type.toLowerCase()}-path` }; // A workaround since we didn't store file_url in memory
        documentService.deleteDocument(id, docRow)
          .catch(err => console.error("Failed to delete document", err));
      }
    }
  },

  getStats() {
    const docs = this.getAll();
    const uploaded = docs.filter(d => d.status === "UPLOADED" || d.status === "APPROVED").length;
    const pending = docs.filter(d => d.status === "PENDING").length;
    const approved = docs.filter(d => d.status === "APPROVED").length;
    return {
      total: docs.length,
      uploaded,
      pending,
      approved,
    };
  },

  getCategoryCounts() {
    const docs = this.getAll();
    const counts: Record<string, { total: number; uploaded: number }> = {};
    for (const [key, cat] of Object.entries(DOCUMENT_CATEGORIES)) {
      const catDocs = docs.filter(d => d.category === cat.label);
      counts[key] = {
        total: catDocs.length,
        uploaded: catDocs.filter(d => d.status === "UPLOADED" || d.status === "APPROVED").length,
      };
    }
    return counts;
  },

  seed(): void {
    if (!localDocs || localDocs.length === 0) {
      localDocs = [...mockDocuments];
    }
  },
};

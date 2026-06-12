// ─────────────────────────────────────────────────────────────
// Document Readiness Store
// Phase 1D: Document Readiness System
// ─────────────────────────────────────────────────────────────

import { documentStore } from "./documents";
import { Document } from "@/data/mock/documents";

export interface RequiredDocumentDef {
  id: string;
  name: string;
  category: string;
  type: string;
}

export const REQUIRED_DOCUMENTS: RequiredDocumentDef[] = [
  { id: "passport", name: "Passport", category: "Personal Documents", type: "PERSONAL" },
  { id: "degree", name: "Degree", category: "Academic Documents", type: "ACADEMIC" },
  { id: "transcript", name: "Transcript", category: "Academic Documents", type: "ACADEMIC" },
  { id: "language", name: "Language Test (IELTS/TOEFL/PTE)", category: "Language Proficiency", type: "LANGUAGE" },
  { id: "sop", name: "Statement of Purpose", category: "Statement of Purpose", type: "SOP" },
  { id: "lor", name: "Recommendation Letter", category: "Letters of Recommendation", type: "LOR" },
];

export interface ReadinessState {
  percentage: number;
  isReady: boolean;
  missingDocs: RequiredDocumentDef[];
  completedDocs: { def: RequiredDocumentDef; doc: Document }[];
}

export const readinessStore = {
  getReadiness(): ReadinessState {
    const allDocs = documentStore.getAll();
    const validDocs = allDocs.filter(d => d.status === "UPLOADED" || d.status === "APPROVED");

    const completedDocs: { def: RequiredDocumentDef; doc: Document }[] = [];
    const missingDocs: RequiredDocumentDef[] = [];

    REQUIRED_DOCUMENTS.forEach(def => {
      // Find a valid document that satisfies this requirement.
      // We check if any valid document matches the 'type' since names might vary slightly.
      // But since there are two ACADEMIC requirements (Degree and Transcript), 
      // we need to be slightly more specific.
      const match = validDocs.find(d => {
        if (d.type !== def.type) return false;
        
        // For ACADEMIC type, check if the name includes the required word.
        if (def.type === "ACADEMIC") {
          return d.name.toLowerCase().includes(def.name.toLowerCase());
        }
        
        // For other types, any document in that category is sufficient.
        return true;
      });

      if (match) {
        completedDocs.push({ def, doc: match });
      } else {
        missingDocs.push(def);
      }
    });

    const total = REQUIRED_DOCUMENTS.length;
    const completed = completedDocs.length;
    
    // According to Phase 1D rules:
    // 100% - All required (6/6)
    // 80% - One missing (5/6)
    // 60% - Two missing (4/6)
    // 40% - Three missing (3/6)
    // 20% - Many missing (< 3/6)
    
    let percentage = 0;
    if (completed === 6) percentage = 100;
    else if (completed === 5) percentage = 80;
    else if (completed === 4) percentage = 60;
    else if (completed === 3) percentage = 40;
    else percentage = 20;

    if (completed === 0) percentage = 0; // Edge case for brand new profile

    return {
      percentage,
      isReady: percentage === 100,
      missingDocs,
      completedDocs,
    };
  },

  // Helper for Category View
  getCategoryStatus(categoryLabel: string): "Completed" | "Pending" | "Missing" {
    // If the category has any required documents, check if they are missing
    const requiredForCat = REQUIRED_DOCUMENTS.filter(r => r.category === categoryLabel);
    
    const allDocs = documentStore.getAll();
    const docsInCat = allDocs.filter(d => d.category === categoryLabel);
    
    // Check if any document in this category is currently PENDING
    if (docsInCat.some(d => d.status === "PENDING")) {
      return "Pending";
    }

    // Check if we are missing any required document for this category
    const validDocsInCat = docsInCat.filter(d => d.status === "UPLOADED" || d.status === "APPROVED");
    
    let isMissing = false;
    requiredForCat.forEach(def => {
      const match = validDocsInCat.find(d => {
        if (def.type === "ACADEMIC") {
          return d.name.toLowerCase().includes(def.name.toLowerCase());
        }
        return true;
      });
      if (!match) isMissing = true;
    });

    if (isMissing) return "Missing";

    // If there are documents and nothing is pending/missing, it's completed
    if (validDocsInCat.length > 0) return "Completed";

    return "Missing";
  },

  generateCompleteDocumentSet() {
    const currentState = this.getReadiness();
    
    currentState.missingDocs.forEach(def => {
      documentStore.upload({
        name: def.name,
        type: def.type as any,
        category: def.category,
        fileSize: Math.floor(Math.random() * 2000000) + 500000, // 500kb - 2.5mb
        fileType: "application/pdf"
      });
    });
  }
};

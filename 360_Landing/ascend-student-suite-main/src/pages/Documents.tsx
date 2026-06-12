import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { documentStore, UploadDocumentInput } from "@/store/documents";
import { Document, DocumentType, DOCUMENT_CATEGORIES } from "@/data/mock/documents";
import { journeyStore } from "@/store/journeyStore";
import {
  FileText, Upload, Trash2, Eye, CheckCircle, Clock,
  XCircle, Plus, User, GraduationCap, Languages, Wallet,
  Mail, FolderPlus, AlertCircle, File
} from "lucide-react";

const CATEGORY_ICONS: Record<string, typeof FileText> = {
  "Personal Documents": User,
  "Academic Documents": GraduationCap,
  "Language Proficiency": Languages,
  "Financial Documents": Wallet,
  "Statement of Purpose": FileText,
  "Letters of Recommendation": Mail,
  "Additional Documents": FolderPlus,
};

const STATUS_STYLES: Record<string, string> = {
  UPLOADED: "bg-blue-100 text-blue-800 border-blue-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_ICONS: Record<string, typeof CheckCircle> = {
  UPLOADED: Clock,
  APPROVED: CheckCircle,
  PENDING: AlertCircle,
  REJECTED: XCircle,
};

export default function Documents() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<Document[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Upload form
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState<DocumentType>("PERSONAL");
  const [uploadCategory, setUploadCategory] = useState("Personal Documents");

  const loadDocs = useCallback(() => {
    setDocs(documentStore.getAll());
  }, [refreshKey]);

  useEffect(() => {
    documentStore.seed();
    loadDocs();
  }, [refreshKey, loadDocs]);

  const stats = documentStore.getStats();
  const categoryCounts = documentStore.getCategoryCounts();

  const handleUpload = () => {
    if (!uploadName.trim()) return;
    const input: UploadDocumentInput = {
      name: uploadName.trim(),
      type: uploadType,
      category: uploadCategory,
      fileSize: Math.floor(Math.random() * 2000000) + 50000,
      fileType: "application/pdf",
    };
    documentStore.upload(input);
    // Sync journey milestone
    journeyStore.complete("documents_uploaded");
    setShowUpload(false);
    setUploadName("");
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = (id: number) => {
    documentStore.delete(id);
    setRefreshKey((k) => k + 1);
  };

  // Group docs by category
  const groupedDocs = docs.reduce(
    (acc, doc) => {
      if (!acc[doc.category]) acc[doc.category] = [];
      acc[doc.category].push(doc);
      return acc;
    },
    {} as Record<string, Document[]>
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3539] mb-1">Document Center</h1>
          <p className="text-muted-foreground text-sm">
            {stats.uploaded} of {stats.total} documents uploaded · {stats.approved} approved
          </p>
        </div>
        <Button
          onClick={() => setShowUpload(true)}
          className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-xl"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload Document
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <Card className="p-3 text-center bg-white/70 border-2 border-gray-200/80">
          <p className="text-2xl font-bold text-[#2C3539]">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </Card>
        <Card className="p-3 text-center bg-white/70 border-2 border-gray-200/80">
          <p className="text-2xl font-bold text-blue-600">{stats.uploaded}</p>
          <p className="text-xs text-muted-foreground">Uploaded</p>
        </Card>
        <Card className="p-3 text-center bg-white/70 border-2 border-gray-200/80">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-xs text-muted-foreground">Approved</p>
        </Card>
        <Card className="p-3 text-center bg-white/70 border-2 border-gray-200/80">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </Card>
      </div>

      {/* Documents by Category */}
      <div className="space-y-6">
        {Object.entries(DOCUMENT_CATEGORIES).map(([key, cat]) => {
          const IconComponent = CATEGORY_ICONS[cat.label] || FileText;
          const catDocs = groupedDocs[cat.label] || [];
          const catCount = categoryCounts[key] || { total: 0, uploaded: 0 };

          return (
            <div key={key}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#C4DFF0]/20 to-[#C4DFF0]/10 border border-[#C4DFF0]/20">
                  <IconComponent className="w-5 h-5 text-[#2C3539]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2C3539]">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {catCount.uploaded}/{catCount.total} uploaded
                    {" · "}
                    {cat.examples.slice(0, 3).join(", ")}
                  </p>
                </div>
              </div>

              {catDocs.length === 0 ? (
                <Card className="p-4 bg-white/50 border border-dashed border-gray-200 rounded-xl text-center">
                  <p className="text-sm text-muted-foreground">No documents in this category yet.</p>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-[#E08D3C] mt-1"
                    onClick={() => {
                      setUploadCategory(cat.label);
                      setUploadType(key as DocumentType);
                      setShowUpload(true);
                    }}
                  >
                    <Upload className="w-3 h-3 mr-1" /> Upload {cat.label}
                  </Button>
                </Card>
              ) : (
                <div className="space-y-2">
                  {catDocs.map((doc) => {
                    const StatusIcon = STATUS_ICONS[doc.status] || FileText;
                    return (
                      <Card
                        key={doc.id}
                        className="p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                              doc.status === "APPROVED" ? "bg-green-100" :
                              doc.status === "REJECTED" ? "bg-red-100" :
                              doc.status === "UPLOADED" ? "bg-blue-100" :
                              "bg-yellow-100"
                            )}>
                              <File className={cn(
                                "w-5 h-5",
                                doc.status === "APPROVED" ? "text-green-600" :
                                doc.status === "REJECTED" ? "text-red-600" :
                                doc.status === "UPLOADED" ? "text-blue-600" :
                                "text-yellow-600"
                              )} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#2C3539] truncate">{doc.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <span>{formatSize(doc.fileSize)}</span>
                                <span>·</span>
                                <span>{doc.fileType}</span>
                                {doc.uploadDate && (
                                  <>
                                    <span>·</span>
                                    <span>{formatDate(doc.uploadDate)}</span>
                                  </>
                                )}
                              </div>
                              {doc.remarks && (
                                <p className="text-xs text-muted-foreground mt-1 italic">
                                  {doc.remarks}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                            <Badge className={cn("text-[10px] border", STATUS_STYLES[doc.status] || "")}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {doc.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(doc.id)}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#2C3539]">
              Upload Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-semibold text-[#2C3539] mb-2 block">Category</label>
              <Select
                value={uploadCategory}
                onValueChange={(v) => {
                  setUploadCategory(v);
                  const entry = Object.entries(DOCUMENT_CATEGORIES).find(([, cat]) => cat.label === v);
                  if (entry) setUploadType(entry[0] as DocumentType);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DOCUMENT_CATEGORIES).map(([key, cat]) => (
                    <SelectItem key={key} value={cat.label}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#2C3539] mb-2 block">Document Name</label>
              <input
                type="text"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="e.g., Passport Copy, IELTS Score Card"
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-sm focus:border-[#E08D3C] focus:outline-none transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Examples: {DOCUMENT_CATEGORIES[uploadType]?.examples.join(", ")}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#C4DFF0]/10 border border-[#C4DFF0]/20">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> This is a mock upload for the MVP. File storage integration
                will be added later.
              </p>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!uploadName.trim()}
              className="w-full bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-xl"
            >
              <Upload className="w-4 h-4 mr-2" /> Upload Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

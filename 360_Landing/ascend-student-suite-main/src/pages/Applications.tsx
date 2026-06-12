import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { applicationStore, NewApplication } from "@/store/applications";
import { Application, ApplicationStatus } from "@/data/mock/applications";
import { mockUniversities } from "@/data/mock/universities";
import { mockCourses } from "@/data/mock/courses";
import { readinessStore } from "@/store/readiness";
import {
  Send, GraduationCap, MapPin, Clock, CheckCircle, XCircle,
  AlertCircle, FileText, Plus, ArrowRight, Trash2, Edit, RefreshCw
} from "lucide-react";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; icon: typeof Clock }> = {
  DRAFT: { label: "Draft", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Edit },
  SUBMITTED: { label: "Submitted", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Send },
  UNDER_REVIEW: { label: "Under Review", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Clock },
  ACCEPTED: { label: "Accepted", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
};

export default function Applications() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Create form state
  const [newUniId, setNewUniId] = useState<number>(0);
  const [newCourseId, setNewCourseId] = useState<number>(0);
  const [newSemester, setNewSemester] = useState("Fall 2025");

  const loadApps = useCallback(() => {
    setApps(applicationStore.getAll());
  }, [refreshKey]);

  useEffect(() => {
    applicationStore.seed();
    loadApps();
  }, [refreshKey, loadApps]);

  const filteredApps = activeTab === "all"
    ? apps
    : apps.filter((a) => a.status === activeTab);

  const handleCreate = () => {
    const uni = mockUniversities.find((u) => u.id === newUniId);
    const course = mockCourses.find((c) => c.id === newCourseId);
    if (!uni || !course) return;

    const newApp: NewApplication = {
      studentId: 1,
      studentName: "John Doe",
      universityId: uni.id,
      universityName: uni.name,
      courseId: course.id,
      courseName: course.name,
      country: uni.country,
      targetSemester: newSemester,
    };
    applicationStore.create(newApp);
    setShowCreateModal(false);
    setNewUniId(0);
    setNewCourseId(0);
    setRefreshKey((k) => k + 1);
  };

  const handleStatusChange = (id: number, status: ApplicationStatus) => {
    applicationStore.updateStatus(id, status);
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = (id: number) => {
    applicationStore.delete(id);
    setRefreshKey((k) => k + 1);
  };

  const stats = applicationStore.getStats();

  const selectedUniCourses = newUniId > 0
    ? mockCourses.filter((c) => c.universityId === newUniId)
    : [];

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3539] mb-1">My Applications</h1>
          <p className="text-muted-foreground text-sm">
            {stats.total} total · {stats.accepted} accepted · {stats.successRate}% success rate
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" /> New Application
        </Button>
      </div>

      {/* Document Readiness Warning Banner */}
      {!readinessStore.getReadiness().isReady && (
        <Card className="mb-6 p-4 bg-yellow-50/80 border-2 border-yellow-200 shadow-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-yellow-800">Action Required: Complete Your Documents</h4>
            <p className="text-sm text-yellow-700 mt-1">
              You must upload all required documents before you can officially submit your applications. 
              Your profile is currently missing {readinessStore.getReadiness().missingDocs.length} required document(s).
            </p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white border-yellow-300 text-yellow-800 hover:bg-yellow-100 shrink-0"
            onClick={() => navigate("/documents")}
          >
            Upload Documents
          </Button>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {([
          { label: "Total", value: stats.total, color: "text-[#2C3539]" },
          { label: "Active", value: stats.active, color: "text-blue-600" },
          { label: "Accepted", value: stats.accepted, color: "text-green-600" },
          { label: "Drafts", value: stats.total - stats.submitted, color: "text-yellow-600" },
        ]).map((s) => (
          <Card key={s.label} className="p-3 text-center bg-white/70 border-2 border-gray-200/80">
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="DRAFT">Drafts</TabsTrigger>
          <TabsTrigger value="SUBMITTED">Submitted</TabsTrigger>
          <TabsTrigger value="UNDER_REVIEW">Under Review</TabsTrigger>
          <TabsTrigger value="ACCEPTED">Accepted</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <Card className="p-10 text-center bg-white/70 backdrop-blur-sm border-2 border-gray-200/80">
            <Send className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#2C3539] mb-2">No Applications Found</h3>
            <p className="text-muted-foreground mb-4">
              Start your journey by creating your first application.
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Application
            </Button>
          </Card>
        ) : (
          filteredApps.map((app) => {
            const config = STATUS_CONFIG[app.status];
            const StatusIcon = config.icon;
            return (
              <Card
                key={app.id}
                className="p-5 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C4DFF0]/30 to-[#C4DFF0]/10 flex items-center justify-center border flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-[#2C3539]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#2C3539]">{app.universityName}</h3>
                        <p className="text-sm text-muted-foreground">{app.courseName}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {app.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {app.targetSemester}
                      </span>
                      <span>ID: #{app.id}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E08D3C] to-[#d07a2a] rounded-full transition-all"
                        style={{ width: `${app.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge className={cn("text-xs border", config.color)}>
                      <StatusIcon className="w-3 h-3 mr-1" /> {config.label}
                    </Badge>

                    {/* Status Actions */}
                    <Select
                      value={app.status}
                      onValueChange={(v) => handleStatusChange(app.id, v as ApplicationStatus)}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(STATUS_CONFIG) as ApplicationStatus[]).map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {STATUS_CONFIG[s].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(app.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Documents status */}
                {app.documents.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200/50 flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div className="flex gap-2">
                      {app.documents.map((doc) => (
                        <Badge
                          key={doc.id}
                          variant="secondary"
                          className={cn(
                            "text-[10px]",
                            doc.status === "APPROVED" && "bg-green-100 text-green-700",
                            doc.status === "PENDING" && "bg-yellow-100 text-yellow-700",
                          )}
                        >
                          {doc.name}: {doc.status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Create Application Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#2C3539]">
              New Application
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-semibold text-[#2C3539] mb-2 block">University</label>
              <Select value={newUniId ? String(newUniId) : ""} onValueChange={(v) => { setNewUniId(Number(v)); setNewCourseId(0); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  {mockUniversities.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.name} ({u.country})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newUniId > 0 && (
              <div>
                <label className="text-sm font-semibold text-[#2C3539] mb-2 block">Course</label>
                <Select value={newCourseId ? String(newCourseId) : ""} onValueChange={(v) => setNewCourseId(Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedUniCourses.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name} · {c.degreeLevel} · {c.duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-[#2C3539] mb-2 block">Target Semester</label>
              <Select value={newSemester} onValueChange={setNewSemester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                  <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                  <SelectItem value="Fall 2026">Fall 2026</SelectItem>
                  <SelectItem value="Winter 2025/26">Winter 2025/26</SelectItem>
                  <SelectItem value="Summer 2026">Summer 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreate}
              disabled={!newUniId || !newCourseId}
              className="w-full bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-xl"
            >
              <Send className="w-4 h-4 mr-2" /> Create Application
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              This creates a draft application. You can submit it later.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

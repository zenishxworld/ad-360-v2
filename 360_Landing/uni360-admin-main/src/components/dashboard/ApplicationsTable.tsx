import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  CheckCircle,
  Eye,
  Loader2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ApplicationsTableProps {
  countries: string[];
  selectedCountry: string;
  setSelectedCountry: (c: string) => void;
  availableFilters: {
    stages: any[];
    taskTypes: any[];
    taskStatuses: any[];
    priorities: any[];
    active: any[];
  };
  selectedStage: string | null;
  setSelectedStage: (s: string | null) => void;
  selectedTaskType: string | null;
  setSelectedTaskType: (t: string | null) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedPriority: string;
  setSelectedPriority: (p: string) => void;
  selectedActive: string;
  setSelectedActive: (a: string) => void;
  applications: any[];
  claimingAppId: string | null;
  handleClaimApplication: (id: string) => void;
  setTaskRequirements: (req: any) => void;
  setCompletionForm: (form: any) => void;
  setCompletionFlags: (flags: any) => void;
  setCompletionErrors: (err: any) => void;
  setHasLoadedRequirements: (val: boolean) => void;
  setSelectedApp: (app: any) => void;
  setShowDetailModal: (val: boolean) => void;
}

const normalizeCountryForFilter = (c?: string) => {
  if (!c) return null;
  const lower = c.trim().toLowerCase();
  const ukVariants = ["uk", "united kingdom", "united kingdoms", "gb", "great britain", "england"];
  const deVariants = ["de", "germany", "deutschland", "ger"];
  if (ukVariants.includes(lower)) return "UK";
  if (deVariants.includes(lower)) return "Germany";
  return null;
};

const formatDisplayName = (str?: string) => {
  if (!str) return "N/A";
  return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const isTaskClaimable = (task: any) => {
  if (task.stage === "APPLICATION_REVIEW") {
    return true;
  }
  return task.status === "CREATED" && (!task.assignee || task.assignee === null);
};

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  countries,
  selectedCountry,
  setSelectedCountry,
  availableFilters,
  selectedStage,
  setSelectedStage,
  selectedTaskType,
  setSelectedTaskType,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  selectedActive,
  setSelectedActive,
  applications,
  claimingAppId,
  handleClaimApplication,
  setTaskRequirements,
  setCompletionForm,
  setCompletionFlags,
  setCompletionErrors,
  setHasLoadedRequirements,
  setSelectedApp,
  setShowDetailModal,
}) => {
  const getApplicationsForCurrentView = () => {
    return applications.filter(app => {
      const normalized = normalizeCountryForFilter(app.country);
      return normalized === selectedCountry;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="uni-card">
        <CardHeader>
          <CardTitle className="text-foreground">Multi-Stage Workflow Management</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage applications through the complete workflow pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Country Toggle */}
          {countries.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted rounded-lg border border-border">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    selectedCountry === country
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-background text-foreground border border-border hover:bg-muted"
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          )}

          {/* Dynamic Stage Tabs */}
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted rounded-lg border border-border">
            {availableFilters.stages
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((stage) => (
                <button
                  key={stage.filterId}
                  onClick={() => {
                    setSelectedActive('true');
                    setSelectedStage(stage.filterId);
                    setSelectedTaskType(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedStage === stage.filterId && selectedActive === 'true'
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-background text-foreground border border-border hover:bg-muted"
                  }`}
                >
                  {stage.name} ({stage.count})
                </button>
              ))}
          </div>

          {/* Dynamic Task Type Pills */}
          {selectedStage && selectedActive === 'true' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {availableFilters.stages
                .find(s => s.filterId === selectedStage)
                ?.taskTypes?.map((taskType) => (
                  <button
                    key={taskType.filterId}
                    onClick={() => {
                      if (selectedTaskType === taskType.filterId) {
                        setSelectedTaskType(null);
                      } else {
                        setSelectedTaskType(taskType.filterId);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border-2 ${
                      selectedTaskType === taskType.filterId
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-ring"
                    }`}
                  >
                    {taskType.name} ({taskType.count})
                  </button>
                ))}
            </div>
          )}

          {/* Dynamic Filter Bar */}
          {selectedStage && selectedTaskType && (
            <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-50 rounded-lg border">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 rounded-lg border px-3 text-sm bg-white"
              >
                <option value="all">All Statuses</option>
                {availableFilters.taskStatuses.map(status => (
                  <option key={status.filterId} value={status.filterId}>
                    {status.name} ({status.count})
                  </option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="h-9 rounded-lg border px-3 text-sm bg-white"
              >
                <option value="all">All Priorities</option>
                {availableFilters.priorities.map(priority => (
                  <option key={priority.filterId} value={priority.filterId}>
                    {priority.name} ({priority.count})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Applications List */}
          <div className="space-y-3 sm:space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                {getApplicationsForCurrentView().map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 mb-2 sm:mb-0">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div>
                          <p className="font-semibold text-foreground text-sm sm:text-base">
                            {formatDisplayName(app.taskType)}
                          </p>
                          <p className="text-md text-muted-foreground">Ref: {app.referenceNumber}</p>
                          <p className="text-sm sm:text-sm text-muted-foreground">{app.university}</p>
                          <p className="text-sm text-muted-foreground">{app.course}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {formatDisplayName(app.taskType)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {formatDisplayName(app.status)}
                            </Badge>
                            {app.completionPercentage > 0 && (
                              <Badge variant="default" className="text-xs">
                                {app.completionPercentage}% Complete
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTaskRequirements(null);
                          setCompletionForm({});
                          setCompletionFlags({});
                          setCompletionErrors({});
                          setHasLoadedRequirements(false);
                          
                          setSelectedApp(app);
                          setShowDetailModal(true);
                        }}
                        className="uni-btn-ghost text-xs sm:text-sm"
                      >
                        <Eye className="h-3 sm:h-4 w-3 sm:w-4 mr-2" />
                        View Detail
                      </Button>

                      {app.isClaimable && app.status !== "CLAIMED" && (
                        <Button
                          size="sm"
                          onClick={() => handleClaimApplication(app.taskId)}
                          disabled={claimingAppId === app.taskId}
                          className="uni-btn-primary text-xs sm:text-sm"
                        >
                          {claimingAppId === app.taskId ? (
                            <>
                              <Loader2 className="h-3 sm:h-4 w-3 sm:w-4 mr-2 animate-spin" />
                              Claiming...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 sm:h-4 w-3 sm:w-4 mr-2" />
                              Claim
                            </>
                          )}
                        </Button>
                      )}

                      {!isTaskClaimable(app) && app.status !== "COMPLETED" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setTaskRequirements(null);
                            setCompletionForm({});
                            setCompletionFlags({});
                            setCompletionErrors({});
                            setHasLoadedRequirements(false);
                            
                            setSelectedApp(app);
                            setShowDetailModal(true);
                          }}
                          className="uni-btn-secondary text-xs sm:text-sm"
                        >
                          <CheckCircle className="h-3 sm:h-4 w-3 sm:w-4 mr-2" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {getApplicationsForCurrentView().length === 0 && (
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <FileText className="h-12 sm:h-16 w-12 sm:w-16 mx-auto mb-4 opacity-30" />
                <p className="text-base sm:text-lg font-medium">
                  No tasks in this stage
                </p>
                <p className="text-xs sm:text-sm">Tasks will appear here as applications are assigned for {selectedCountry}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

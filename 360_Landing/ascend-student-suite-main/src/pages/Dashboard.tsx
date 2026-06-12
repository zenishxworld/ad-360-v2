import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Send,
  GraduationCap,
  Bookmark,
  FileText,
  Star,
  Compass,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { JourneyTracker } from "@/components/ui/JourneyTracker";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { applicationStore } from "@/store/applications";
import { savedItemsStore } from "@/store/savedItems";
import { documentStore } from "@/store/documents";
import { preferenceStore } from "@/store/preferences";
import { readinessStore } from "@/store/readiness";
import { getSampleRecommendations } from "@/data/mock/recommendations";

type Country = "DE" | "UK" | "IT" | "RS";

interface ContextType {
  selectedCountry: Country;
}

const getFirstName = (user: Record<string, string> | null): string => {
  if (!user) return "Student";
  if (user.firstName) return user.firstName;
  if (user.fullName) return user.fullName.split(" ")[0];
  if (user.name) return user.name.split(" ")[0];
  if (user.email) return user.email.split("@")[0];
  return "Student";
};

const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    DRAFT: "bg-yellow-100 text-yellow-800 border-yellow-200",
    SUBMITTED: "bg-blue-100 text-blue-800 border-blue-200",
    UNDER_REVIEW: "bg-purple-100 text-purple-800 border-purple-200",
    ACCEPTED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-800 border-gray-200";
};

export default function Dashboard() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    applicationStore.seed();
    documentStore.seed();
    setMounted(true);
  }, []);

  const appStats = applicationStore.getStats();
  const savedCounts = savedItemsStore.getSavedCounts();
  const docStats = documentStore.getStats();
  const hasPreferences = preferenceStore.hasPreferences();
  const sampleRecs = getSampleRecommendations();
  const recentApps = applicationStore.getAll().slice(0, 3);
  const readiness = readinessStore.getReadiness();

  const countryData: Record<Country, { greeting: string }> = {
    DE: { greeting: "Guten Tag! Ready for Germany?" },
    UK: { greeting: "Hello! Ready for the UK?" },
    IT: { greeting: "Ciao! Ready for Italy?" },
    RS: { greeting: "Zdravo! Ready for Serbia?" },
  };

  const currentData = countryData[selectedCountry];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6 sm:space-y-8 px-3 sm:px-4 md:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Welcome Banner */}
      <motion.section
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-6 sm:p-8 md:p-10 text-white"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E08D3C] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C4DFF0] rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {getFirstName(user as Record<string, string> | null)}! 👋
          </h1>
          <p className="text-base sm:text-lg opacity-80 mb-6">
            {currentData.greeting}
          </p>
          {!hasPreferences ? (
            <Button
              onClick={() => navigate("/preferences")}
              className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-xl px-6 py-2.5 text-sm font-semibold"
            >
              <Compass className="w-4 h-4 mr-2" />
              Set Your Preferences — Get University Matches
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/recommendations")}
              className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-xl px-6 py-2.5 text-sm font-semibold"
            >
              <Star className="w-4 h-4 mr-2" />
              View Your Recommendations
            </Button>
          )}
        </div>
      </motion.section>

      {/* Journey Tracker */}
      <JourneyTracker variant="card" showDemoButton={true} onDemoComplete={() => setMounted(false)} />

      {/* Stats Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Recommendations"
          value={sampleRecs.length}
          description="University matches"
          icon={Star}
          variant="primary"
          onClick={() => navigate("/recommendations")}
        />
        <StatCard
          title="Saved Unis"
          value={savedCounts.universities}
          description="Bookmarked"
          icon={Bookmark}
          variant="accent"
          onClick={() => navigate("/saved")}
        />
        <StatCard
          title="Saved Courses"
          value={savedCounts.courses}
          description="Bookmarked"
          icon={GraduationCap}
          variant="accent"
          onClick={() => navigate("/saved")}
        />
        <StatCard
          title="Applications"
          value={appStats.total}
          description={`${appStats.accepted} accepted`}
          icon={Send}
          variant="primary"
          onClick={() => navigate("/applications")}
        />
        <StatCard
          title="Documents"
          value={`${docStats.uploaded}/${docStats.total}`}
          description="Uploaded"
          icon={FileText}
          variant="default"
          onClick={() => navigate("/documents")}
        />
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Quick Actions + Recent Apps */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <Card className="p-5 sm:p-6 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-[#2C3539]">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="flex-col h-auto py-4 gap-2 rounded-2xl border-2 hover:border-[#E08D3C]/50 hover:bg-[#fff7f0] transition-all"
                onClick={() => navigate("/discover")}
              >
                <Compass className="w-5 h-5 text-[#E08D3C]" />
                <span className="text-xs font-medium">Discover</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-4 gap-2 rounded-2xl border-2 hover:border-[#C4DFF0]/50 hover:bg-[#f0f7fd] transition-all"
                onClick={() => navigate("/saved")}
              >
                <Bookmark className="w-5 h-5 text-[#2C3539]" />
                <span className="text-xs font-medium">Saved</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-4 gap-2 rounded-2xl border-2 hover:border-[#E08D3C]/50 hover:bg-[#fff7f0] transition-all"
                onClick={() => navigate("/applications")}
              >
                <Send className="w-5 h-5 text-[#E08D3C]" />
                <span className="text-xs font-medium">Apply</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-4 gap-2 rounded-2xl border-2 hover:border-[#C4DFF0]/50 hover:bg-[#f0f7fd] transition-all"
                onClick={() => navigate("/documents")}
              >
                <FileText className="w-5 h-5 text-[#2C3539]" />
                <span className="text-xs font-medium">Documents</span>
              </Button>
            </div>
          </Card>

          {/* Recent Applications */}
          <Card className="p-5 sm:p-6 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#2C3539]">Recent Applications</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#E08D3C] hover:text-[#c97a2e] text-xs"
                onClick={() => navigate("/applications")}
              >
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            {recentApps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Send className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No applications yet</p>
                <Button
                  size="sm"
                  className="mt-3 bg-[#E08D3C] hover:bg-[#c97a2e] rounded-xl"
                  onClick={() => navigate("/discover")}
                >
                  Start Your First Application
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-gray-200/60 hover:border-[#C4DFF0]/50 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => navigate("/applications")}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        app.status === "ACCEPTED" ? "bg-green-100" :
                        app.status === "REJECTED" ? "bg-red-100" :
                        app.status === "UNDER_REVIEW" ? "bg-purple-100" :
                        app.status === "SUBMITTED" ? "bg-blue-100" :
                        "bg-yellow-100"
                      )}>
                        <GraduationCap className={cn(
                          "w-5 h-5",
                          app.status === "ACCEPTED" ? "text-green-600" :
                          app.status === "REJECTED" ? "text-red-600" :
                          app.status === "UNDER_REVIEW" ? "text-purple-600" :
                          app.status === "SUBMITTED" ? "text-blue-600" :
                          "text-yellow-600"
                        )} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#2C3539] truncate">{app.universityName}</p>
                        <p className="text-xs text-muted-foreground truncate">{app.courseName}</p>
                      </div>
                    </div>
                    <Badge className={cn("text-[10px] border ml-2 flex-shrink-0", getStatusColor(app.status))}>
                      {app.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Insights Panel */}
        <div className="space-y-4 sm:space-y-6">
          {/* Recommendation Preview */}
          <Card className="p-5 sm:p-6 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-[#E08D3C]" />
              <h3 className="text-lg font-semibold text-[#2C3539]">Top Picks for You</h3>
            </div>
            {sampleRecs.slice(0, 3).map((rec) => (
              <div
                key={rec.university.id}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/60 transition-colors cursor-pointer mb-2 last:mb-0"
                onClick={() => navigate("/recommendations")}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C4DFF0]/30 to-[#C4DFF0]/10 flex items-center justify-center flex-shrink-0 border border-[#C4DFF0]/20">
                  <GraduationCap className="w-5 h-5 text-[#2C3539]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#2C3539] truncate">{rec.university.name}</p>
                  <p className="text-[11px] text-muted-foreground">{rec.university.country} · QS #{rec.university.qsRanking}</p>
                </div>
                <Badge className={cn(
                  "text-[10px] border flex-shrink-0",
                  rec.tier === "dream" ? "bg-amber-100 text-amber-800 border-amber-200" :
                  rec.tier === "target" ? "bg-blue-100 text-blue-800 border-blue-200" :
                  "bg-green-100 text-green-800 border-green-200"
                )}>
                  {rec.tier}
                </Badge>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-[#E08D3C] hover:text-[#c97a2e] text-xs"
              onClick={() => navigate("/recommendations")}
            >
              See all recommendations <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Card>

          {/* Document Readiness Widget */}
          <Card className="p-5 sm:p-6 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-md cursor-pointer hover:border-[#C4DFF0]/50 transition-all" onClick={() => navigate("/documents")}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-[#2C3539] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#E08D3C]" />
                Doc Readiness
              </h3>
              <Badge className={cn("text-xs border", readiness.isReady ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800")}>
                {readiness.percentage}%
              </Badge>
            </div>
            <p className="text-sm font-medium text-[#2C3539] mb-1">
              {readiness.isReady ? "Ready to apply!" : `${readiness.missingDocs.length} required document${readiness.missingDocs.length > 1 ? 's' : ''} missing`}
            </p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                className={cn("h-full rounded-full transition-all", readiness.isReady ? "bg-emerald-500" : "bg-[#E08D3C]")}
                style={{ width: `${readiness.percentage}%` }}
              />
            </div>
          </Card>

          {/* Stats Summary */}
          <Card className="p-5 sm:p-6 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-[#2C3539]">Your Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-bold text-[#E08D3C]">{appStats.successRate}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E08D3C] to-[#d07a2a] rounded-full transition-all duration-700"
                  style={{ width: `${appStats.successRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Accepted</span>
                </div>
                <span className="text-xs font-semibold">{appStats.accepted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs text-muted-foreground">In Progress</span>
                </div>
                <span className="text-xs font-semibold">{appStats.active - appStats.accepted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-xs text-muted-foreground">Drafts</span>
                </div>
                <span className="text-xs font-semibold">{appStats.total - appStats.submitted}</span>
              </div>
            </div>
          </Card>

          {/* Quick Tip */}
          <Card className="p-5 sm:p-6 bg-gradient-to-br from-[#fff7f0] to-white border-2 border-[#E08D3C]/20 shadow-md">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-[#E08D3C] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#2C3539] mb-1">Pro Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complete your preferences to get personalized university recommendations
                  matched to your profile.
                </p>
                <Button
                  variant="link"
                  className="px-0 py-0 h-auto text-xs text-[#E08D3C] mt-2 font-semibold"
                  onClick={() => navigate("/preferences")}
                >
                  Set Preferences →
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </motion.div>
  );
}

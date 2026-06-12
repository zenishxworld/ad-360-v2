import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Star, GraduationCap, MapPin, Heart, Send, Sparkles, Target, ShieldCheck, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { preferenceStore } from "@/store/preferences";
import { savedItemsStore } from "@/store/savedItems";
import { applicationStore } from "@/store/applications";
import { journeyStore } from "@/store/journeyStore";
import { generateRecommendations, Recommendation, RecommendationTier } from "@/data/mock/recommendations";
import { mockUniversities, University } from "@/data/mock/universities";
import { useCompare } from "./CompareContext";
import { DiscoverSection } from "./DiscoverSection";
import { SavedSection } from "./SavedSection";
import { CompareBar } from "./CompareBar";
import { CompareModal } from "./CompareModal";

const TIER_CONFIG: Record<RecommendationTier, { label: string; icon: typeof Star; color: string; bg: string; desc: string }> = {
  dream: { label: "Dream", icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", desc: "Ambitious reach universities — competitive but worth aiming for!" },
  target: { label: "Target", icon: Target, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", desc: "Strong match universities where your profile aligns well." },
  safe: { label: "Safe", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50 border-green-200", desc: "High probability of admission — excellent backup options." },
};

export const ResultsSection: React.FC = () => {
  const navigate = useNavigate();
  const prefs = preferenceStore.get();
  const [recommendationTab, setRecommendationTab] = useState<RecommendationTier | "all">("all");
  const { compareIds, toggleCompare } = useCompare();

  const recommendations = useMemo(() => {
    if (!preferenceStore.hasPreferences()) return [];
    return generateRecommendations(prefs);
  }, [prefs]);

  const filtered = recommendationTab === "all"
    ? recommendations
    : recommendations.filter((r) => r.tier === recommendationTab);

  const tiers = ["dream", "target", "safe"] as RecommendationTier[];
  const tierCounts = tiers.reduce(
    (acc, t) => ({ ...acc, [t]: recommendations.filter((r) => r.tier === t).length }),
    {} as Record<string, number>
  );

  const handleSaveUni = (uniId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = savedItemsStore.isUniversitySaved(uniId);
    savedItemsStore.toggleUniversity(uniId);
    if (!isSaved) journeyStore.complete("university_saved");
  };

  const handleApply = (rec: Recommendation) => {
    if (rec.matchingCourses.length === 0) return;
    const course = rec.matchingCourses[0];
    applicationStore.create({
      studentId: 1,
      studentName: "John Doe",
      universityId: rec.university.id,
      universityName: rec.university.name,
      courseId: course.id,
      courseName: course.name,
      country: rec.university.country,
      targetSemester: rec.university.intake[0] || "Fall 2025",
    });
    navigate("/applications");
  };

  return (
    <div>
      {/* ═══ RECOMMENDATIONS ═══ */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-6 h-6 text-[#E08D3C]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C3539]">Your Recommendations</h2>
        </div>
        <p className="text-muted-foreground mb-6">Personalized university matches based on your profile</p>

        {/* Tier Overview */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {tiers.map((tier) => {
            const config = TIER_CONFIG[tier];
            const Icon = config.icon;
            return (
              <button
                key={tier}
                onClick={() => setRecommendationTab(tier === recommendationTab ? "all" : tier)}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all",
                  "hover:shadow-md hover:-translate-y-0.5",
                  recommendationTab === tier
                    ? config.bg + " shadow-md"
                    : "bg-white border-gray-200"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("p-2 rounded-xl", config.bg)}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                  </div>
                  <span className={cn("text-lg font-bold", config.color)}>{config.label}</span>
                </div>
                <p className="text-2xl font-bold text-[#2C3539]">{tierCounts[tier]}</p>
                <p className="text-xs text-muted-foreground">universities</p>
              </button>
            );
          })}
        </div>

        {recommendationTab !== "all" && (
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={() => setRecommendationTab("all")} className="text-xs">
              Show all tiers
            </Button>
          </div>
        )}

        {/* Recommendations Grid */}
        <div className="space-y-4">
          {filtered.map((rec) => {
            const config = TIER_CONFIG[rec.tier];
            const isSaved = savedItemsStore.isUniversitySaved(rec.university.id);
            return (
              <Card
                key={rec.university.id}
                className="p-5 sm:p-6 bg-white/70 backdrop-blur-sm border-2 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C4DFF0]/30 to-[#C4DFF0]/10 flex items-center justify-center border border-[#C4DFF0]/20 flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-[#2C3539]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#2C3539] text-lg">{rec.university.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {rec.university.city}, {rec.university.country}
                          <span className="mx-1">·</span>
                          QS #{rec.university.qsRanking}
                        </div>
                      </div>
                      <Badge className={cn("flex-shrink-0 text-xs border", config.bg, config.color)}>
                        {config.label}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{rec.matchReason}</p>

                    <div className="flex flex-wrap gap-2">
                      {rec.matchingCourses.map((course) => (
                        <Badge key={course.id} variant="secondary" className="text-xs">
                          {course.name}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="p-2 rounded-lg bg-gray-50 text-center">
                        <p className="text-[10px] text-muted-foreground">Tuition</p>
                        <p className="text-xs font-semibold text-[#2C3539] truncate">{rec.university.tuitionFee}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-gray-50 text-center">
                        <p className="text-[10px] text-muted-foreground">Acceptance</p>
                        <p className="text-xs font-semibold text-[#2C3539]">{rec.university.acceptanceRate}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-gray-50 text-center">
                        <p className="text-[10px] text-muted-foreground">Intake</p>
                        <p className="text-xs font-semibold text-[#2C3539]">{rec.university.intake.join(", ")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 sm:w-36 flex-shrink-0">
                    <Button
                      className="flex-1 bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-xl text-sm"
                      onClick={() => handleApply(rec)}
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" /> Apply
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl text-sm"
                      onClick={(e) => handleSaveUni(rec.university.id, e)}
                    >
                      <Heart
                        className={cn("w-3.5 h-3.5 mr-1.5", isSaved && "fill-red-500 text-red-500")}
                      />
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl text-sm"
                      onClick={() => toggleCompare(rec.university.id)}
                    >
                      <GitCompare
                        className={cn(
                          "w-3.5 h-3.5 mr-1.5",
                          compareIds.includes(rec.university.id) && "text-[#E08D3C]"
                        )}
                      />
                      Compare
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && recommendations.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No universities in this tier.</p>
            <Button variant="outline" onClick={() => setRecommendationTab("all")} className="mt-3">
              Show All
            </Button>
          </div>
        )}
      </section>

      {/* Discover Section */}
      <DiscoverSection />

      {/* Saved Section */}
      <SavedSection />

      {/* Compare Bar & Modal */}
      <CompareBar />
      <CompareModal />
    </div>
  );
};

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { preferenceStore } from "@/store/preferences";
import { savedItemsStore } from "@/store/savedItems";
import { applicationStore } from "@/store/applications";
import { StudentPreferences, generateRecommendations, Recommendation, RecommendationTier } from "@/data/mock/recommendations";
import { mockUniversities, University } from "@/data/mock/universities";
import { mockCourses, Course } from "@/data/mock/courses";
import { JourneyTracker } from "@/components/ui/JourneyTracker";
import { journeyStore } from "@/store/journeyStore";
import {
  ArrowRight, ChevronLeft, Save, SkipForward, Check, Compass,
  Star, GraduationCap, MapPin, Heart, Send, Sparkles,
  TrendingUp, ShieldCheck, Target, Search, Filter, X,
  Bookmark, Trash2, ExternalLink, SlidersHorizontal,
  GitCompare,
} from "lucide-react";

// ── Preferences config ───────────────────────────────────────
const COUNTRY_OPTIONS = [
  { value: "Germany", label: "Germany", flag: "🇩🇪" },
  { value: "UK", label: "United Kingdom", flag: "🇬🇧" },
  { value: "Italy", label: "Italy", flag: "🇮🇹" },
  { value: "Switzerland", label: "Switzerland", flag: "🇨🇭" },
  { value: "Serbia", label: "Serbia", flag: "🇷🇸" },
  { value: "USA", label: "United States", flag: "🇺🇸" },
  { value: "Canada", label: "Canada", flag: "🇨🇦" },
  { value: "Australia", label: "Australia", flag: "🇦🇺" },
];

const DEGREE_OPTIONS = ["Bachelor", "Master", "PhD"];

const COURSE_OPTIONS = [
  "Computer Science", "Engineering", "Business", "Medicine",
  "Law", "Arts & Design", "Data Science", "Finance",
  "Architecture", "Life Sciences", "Physics", "Economics",
];

const IELTS_OPTIONS = ["5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"];
const TOEFL_OPTIONS = ["60-70", "71-80", "81-90", "91-100", "101-110", "111-120"];
const PTE_OPTIONS = ["42-49", "50-57", "58-64", "65-72", "73-78", "79-86", "87-90"];
const CGPA_OPTIONS = ["5.0-5.9", "6.0-6.9", "7.0-7.9", "8.0-8.9", "9.0-10.0"];
const GRE_OPTIONS = ["290-300", "301-310", "311-320", "321-330", "331-340"];
const GMAT_OPTIONS = ["500-550", "551-600", "601-650", "651-700", "701-750", "751-800"];
const WORK_EXP_OPTIONS = ["None", "< 1 Year", "1-2 Years", "2-5 Years", "5+ Years"];

const STEPS = [
  { id: "countries", title: "Preferred Countries", icon: "🌍" },
  { id: "degree", title: "Degree Level", icon: "🎓" },
  { id: "course", title: "Target Course", icon: "📚" },
  { id: "cgpa", title: "CGPA", icon: "📊" },
  { id: "ielts", title: "English Test", icon: "🗣️" },
  { id: "gre", title: "GRE / GMAT", icon: "📝" },
  { id: "experience", title: "Work Experience", icon: "💼" },
];

// ── Recommendation tier config ──────────────────────────────
const TIER_CONFIG: Record<RecommendationTier, { label: string; icon: typeof Star; color: string; bg: string; desc: string }> = {
  dream: { label: "Dream", icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", desc: "Ambitious reach universities — competitive but worth aiming for!" },
  target: { label: "Target", icon: Target, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", desc: "Strong match universities where your profile aligns well." },
  safe: { label: "Safe", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50 border-green-200", desc: "High probability of admission — excellent backup options." },
};

// ── Discover filter config ──────────────────────────────────
const COUNTRIES = [...new Set(mockUniversities.map((u) => u.country))].sort();
const DEGREES = ["Bachelor", "Master", "PhD"];
const FIELDS = [...new Set(mockCourses.map((c) => c.fieldOfStudy))].sort();

// ── Demo mode ───────────────────────────────────────────────
const DEMO_MODE = true;

const DEMO_PREFERENCES: StudentPreferences = {
  preferredCountries: ["Germany"],
  degreeLevel: "Master",
  targetCourse: "Computer Science",
  cgpa: 8.2,
  ielts: 7.0,
  toefl: 0,
  pte: 0,
  gre: 310,
  gmat: 0,
  workExperience: "1 Year",
};

// ── Section types ───────────────────────────────────────────
type Section = "preferences" | "results";

export default function UniversityFinder() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>(
    preferenceStore.hasPreferences() ? "results" : "preferences"
  );
  const [prefsSaved, setPrefsSaved] = useState(preferenceStore.hasPreferences());

  // ── Complete preferences ──────────────────────────────────
  const allPreferencesComplete = (prefs: StudentPreferences): boolean => {
    return prefs.preferredCountries.length > 0
      && prefs.degreeLevel !== ""
      && prefs.targetCourse !== ""
      && prefs.cgpa > 0
      && (prefs.ielts > 0 || (prefs.toefl ?? 0) > 0 || (prefs.pte ?? 0) > 0)
      && prefs.workExperience !== "";
  };

  const handlePreferencesComplete = () => {
    journeyStore.complete("preferences_completed");
    journeyStore.complete("recommendations_generated");
    setPrefsSaved(true);
    setActiveSection("results");
  };

  // Keep old route paths working via redirect
  // No changes needed — the old pages still exist, just sidebar
  // points to /university-finder now.

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Journey Step Banner */}
      <JourneyTracker variant="banner" className="mb-6" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Compass className="w-8 h-8 text-[#E08D3C]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3539]">University Finder</h1>
        </div>
        <p className="text-muted-foreground">
          Set your preferences, get personalized recommendations, and discover your ideal university
        </p>
      </div>

      {/* Section Pills */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveSection("preferences")}
          className={cn(
            "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
            activeSection === "preferences"
              ? "bg-[#E08D3C] text-white shadow-md"
              : prefsSaved
              ? "bg-[#E08D3C]/10 text-[#E08D3C]"
              : "bg-[#E08D3C]/10 text-[#E08D3C]"
          )}
        >
          <SlidersHorizontal className="w-4 h-4 inline mr-1.5" />
          Preferences {prefsSaved && "✓"}
        </button>
        <button
          onClick={() => prefsSaved && setActiveSection("results")}
          className={cn(
            "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
            activeSection === "results"
              ? "bg-[#E08D3C] text-white shadow-md"
              : prefsSaved
              ? "bg-white text-[#2C3539] border border-gray-200 hover:border-[#E08D3C]"
              : "bg-gray-100 text-muted-foreground cursor-not-allowed"
          )}
          disabled={!prefsSaved}
        >
          <Star className="w-4 h-4 inline mr-1.5" />
          Recommendations & Discover
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === "preferences" && (
          <PreferencesSection
            key="preferences"
            onComplete={handlePreferencesComplete}
            isComplete={prefsSaved}
          />
        )}
        {activeSection === "results" && prefsSaved && (
          <ResultsSection key="results" />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PREFERENCES SECTION
// ═══════════════════════════════════════════════════════════════
function PreferencesSection({ onComplete, isComplete }: { onComplete: () => void; isComplete: boolean }) {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<StudentPreferences>(preferenceStore.get());
  const [showEnglishTest, setShowEnglishTest] = useState<"ielts" | "toefl" | "pte" | null>(
    prefs.ielts > 0 ? "ielts" : prefs.toefl ? "toefl" : prefs.pte ? "pte" : null
  );
  const [saved, setSaved] = useState(isComplete);

  const handleLoadDemo = () => {
    const demoPrefs: StudentPreferences = {
      preferredCountries: ["Germany"],
      degreeLevel: "Master",
      targetCourse: "Computer Science",
      cgpa: 8.2,
      ielts: 7.0,
      toefl: 0,
      pte: 0,
      gre: 310,
      gmat: 0,
      workExperience: "1 Year",
    };
    setPrefs(demoPrefs);
    setShowEnglishTest("ielts");
    preferenceStore.save(demoPrefs);
    setSaved(true);
    onComplete();
  };

  const update = <K extends keyof StudentPreferences>(key: K, value: StudentPreferences[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    setSaved(false);
  };

  const toggleCountry = (country: string) => {
    const current = prefs.preferredCountries;
    const updated = current.includes(country)
      ? current.filter((c) => c !== country)
      : [...current, country];
    update("preferredCountries", updated);
  };

  const handleSave = () => {
    preferenceStore.save(prefs);
    setSaved(true);
  };

  const allComplete = (prefs: StudentPreferences): boolean => {
    return prefs.preferredCountries.length > 0
      && prefs.degreeLevel !== ""
      && prefs.targetCourse !== ""
      && prefs.cgpa > 0
      && (prefs.ielts > 0 || (prefs.toefl ?? 0) > 0 || (prefs.pte ?? 0) > 0)
      && prefs.workExperience !== "";
  };

  const handleSeeResults = () => {
    handleSave();
    onComplete();
  };

  const totalSteps = STEPS.length;
  const currentStep = STEPS[step];
  const isLastStep = step === totalSteps - 1;

  const renderStepContent = () => {
    switch (currentStep.id) {
      case "countries":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {COUNTRY_OPTIONS.map((c) => (
              <button
                key={c.value}
                onClick={() => toggleCountry(c.value)}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all duration-200",
                  "hover:shadow-md hover:-translate-y-0.5",
                  prefs.preferredCountries.includes(c.value)
                    ? "border-[#E08D3C] bg-[#fff7f0] shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <span className="text-2xl block mb-1">{c.flag}</span>
                <span className="text-sm font-semibold text-[#2C3539]">{c.label}</span>
              </button>
            ))}
          </div>
        );
      case "degree":
        return (
          <div className="grid grid-cols-3 gap-3">
            {DEGREE_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => update("degreeLevel", d)}
                className={cn(
                  "p-6 rounded-2xl border-2 text-center transition-all duration-200",
                  "hover:shadow-md hover:-translate-y-0.5",
                  prefs.degreeLevel === d
                    ? "border-[#E08D3C] bg-[#fff7f0] shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <span className="text-lg font-bold text-[#2C3539]">{d}</span>
              </button>
            ))}
          </div>
        );
      case "course":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COURSE_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => update("targetCourse", c)}
                className={cn(
                  "px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200",
                  prefs.targetCourse === c
                    ? "border-[#E08D3C] bg-[#fff7f0] text-[#E08D3C]"
                    : "border-gray-200 bg-white text-[#2C3539] hover:border-gray-300"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        );
      case "cgpa":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CGPA_OPTIONS.map((c) => {
              const mid = parseFloat(c.split("-")[1]);
              const isSelected = prefs.cgpa === mid;
              return (
                <button
                  key={c}
                  onClick={() => update("cgpa", mid)}
                  className={cn(
                    "p-5 rounded-2xl border-2 text-center transition-all duration-200",
                    "hover:shadow-md hover:-translate-y-0.5",
                    isSelected
                      ? "border-[#E08D3C] bg-[#fff7f0] shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  <span className="text-xl font-bold text-[#2C3539]">{c}</span>
                  <span className="block text-xs text-muted-foreground mt-1">CGPA</span>
                </button>
              );
            })}
          </div>
        );
      case "ielts":
        return (
          <div className="space-y-5">
            <div className="flex gap-2">
              {(["ielts", "toefl", "pte"] as const).map((test) => (
                <Button
                  key={test}
                  variant={showEnglishTest === test ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowEnglishTest(test)}
                  className={showEnglishTest === test ? "bg-[#E08D3C]" : ""}
                >
                  {test.toUpperCase()}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(showEnglishTest === "toefl"
                ? TOEFL_OPTIONS
                : showEnglishTest === "pte"
                ? PTE_OPTIONS
                : IELTS_OPTIONS
              ).map((score) => {
                const num = parseFloat(score);
                const isSelected =
                  showEnglishTest === "ielts"
                    ? prefs.ielts === num
                    : showEnglishTest === "toefl"
                    ? prefs.toefl === num
                    : prefs.pte === num;
                return (
                  <button
                    key={score}
                    onClick={() => {
                      if (showEnglishTest === "ielts") update("ielts", num);
                      else if (showEnglishTest === "toefl") update("toefl", num);
                      else update("pte", num);
                    }}
                    className={cn(
                      "px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all",
                      isSelected
                        ? "border-[#E08D3C] bg-[#fff7f0] text-[#E08D3C]"
                        : "border-gray-200 bg-white text-[#2C3539] hover:border-gray-300"
                    )}
                  >
                    {score}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case "gre":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {GRE_OPTIONS.map((g) => {
                const mid = parseInt(g.split("-")[1]);
                const isSelected = prefs.gre === mid;
                return (
                  <button
                    key={g}
                    onClick={() => update("gre", mid)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-center transition-all",
                      isSelected
                        ? "border-[#E08D3C] bg-[#fff7f0]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    <span className="text-lg font-bold text-[#2C3539]">{g}</span>
                    <span className="block text-xs text-muted-foreground">GRE</span>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-muted-foreground font-medium mb-3">GMAT (optional)</p>
              <div className="grid grid-cols-3 gap-2">
                {GMAT_OPTIONS.map((g) => {
                  const mid = parseInt(g.split("-")[1]);
                  const isSelected = prefs.gmat === mid;
                  return (
                    <button
                      key={g}
                      onClick={() => update("gmat", mid)}
                      className={cn(
                        "px-3 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all",
                        isSelected
                          ? "border-[#E08D3C] bg-[#fff7f0] text-[#E08D3C]"
                          : "border-gray-200 bg-white text-[#2C3539] hover:border-gray-300"
                      )}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case "experience":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {WORK_EXP_OPTIONS.map((w) => (
              <button
                key={w}
                onClick={() => update("workExperience", w)}
                className={cn(
                  "p-5 rounded-2xl border-2 text-center transition-all duration-200",
                  "hover:shadow-md hover:-translate-y-0.5",
                  prefs.workExperience === w
                    ? "border-[#E08D3C] bg-[#fff7f0] shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <span className="text-lg font-bold text-[#2C3539]">{w}</span>
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Demo Mode Button */}
      {DEMO_MODE && !isComplete && (
        <div className="text-center mb-6">
          <Button
            onClick={handleLoadDemo}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            🚀 Load Demo Profile
          </Button>
        </div>
      )}

      {/* Step Progress */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(i)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all",
              i === step
                ? "bg-[#E08D3C] text-white"
                : i < step
                ? "bg-[#E08D3C]/10 text-[#E08D3C]"
                : "bg-gray-100 text-muted-foreground"
            )}
          >
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-6 sm:p-8 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-md">
        <h2 className="text-xl font-bold text-[#2C3539] mb-6">
          {currentStep.title}
        </h2>
        {renderStepContent()}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="ghost"
          onClick={() => step > 0 ? setStep(step - 1) : undefined}
          className={cn("text-muted-foreground", step === 0 && "opacity-0 pointer-events-none")}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            className="bg-[#2C3539] hover:bg-[#1a1a2e] text-white"
          >
            <Save className="w-4 h-4 mr-1" />
            {saved ? "Saved!" : "Save Progress"}
          </Button>
          {isLastStep ? (
            <Button
              onClick={handleSeeResults}
              className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white"
            >
              See Recommendations
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// RESULTS SECTION (Recommendations + Discover + Saved)
// ═══════════════════════════════════════════════════════════════
function ResultsSection() {
  const navigate = useNavigate();
  const prefs = preferenceStore.get();
  const [recommendationTab, setRecommendationTab] = useState<RecommendationTier | "all">("all");
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (uniId: number) => {
    setCompareIds((prev) =>
      prev.includes(uniId) ? prev.filter((id) => id !== uniId) : [...prev, uniId].slice(-2)
    );
  };

  const compareUniversities = compareIds
    .map((id) => mockUniversities.find((u) => u.id === id))
    .filter(Boolean) as University[];

  const recommendations = useMemo(() => {
    if (!preferenceStore.hasPreferences()) return [];
    return generateRecommendations(prefs);
  }, []);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
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
                      <Send className="w-4 h-4 mr-1.5" /> Apply
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl text-sm"
                      onClick={(e) => handleSaveUni(rec.university.id, e)}
                    >
                      <Heart
                        className={cn("w-4 h-4 mr-1.5", isSaved && "fill-red-500 text-red-500")}
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
                          "w-4 h-4 mr-1.5",
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

      {/* ═══ DISCOVER UNIVERSITIES ═══ */}
      <DiscoverSection />

      {/* ═══ SAVED ═══ */}
      <SavedSection />

      {/* Compare Bar & Modal */}
      {compareIds.length > 0 && (
        <>
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-white/95 backdrop-blur-md border-2 border-[#E08D3C]/30 shadow-2xl rounded-2xl px-5 py-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <GitCompare className="w-5 h-5 text-[#E08D3C]" />
            <span className="text-sm font-semibold text-[#2C3539]">
              {compareIds.length} of 2 selected
            </span>
            <Button
              size="sm"
              className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-lg"
              disabled={compareIds.length < 2}
              onClick={() => setShowCompare(true)}
            >
              Compare Now
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCompareIds([])}
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>

          <Dialog open={showCompare} onOpenChange={setShowCompare}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#2C3539] flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-[#E08D3C]" />
                  University Comparison
                </DialogTitle>
              </DialogHeader>
              {compareUniversities.length >= 2 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-3 bg-gray-50 rounded-l-lg font-semibold text-[#2C3539] w-32">Metric</th>
                        {compareUniversities.map((u) => (
                          <th key={u.id} className="p-3 bg-gray-50 text-center font-semibold text-[#2C3539]">
                            {u.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Country", key: "country" as const },
                        { label: "City", key: "city" as const },
                        { label: "Type", key: "type" as const },
                        { label: "QS Ranking", key: "qsRanking" as const },
                        { label: "Acceptance Rate", key: "acceptanceRate" as const },
                        { label: "Tuition Fee", key: "tuitionFee" as const },
                        { label: "Language", key: "language" as const },
                        { label: "Application Fee", key: "applicationFee" as const },
                      ].map(({ label, key }) => (
                        <tr key={key} className="border-b border-gray-100">
                          <td className="p-3 font-medium text-muted-foreground">{label}</td>
                          {compareUniversities.map((u) => (
                            <td key={u.id} className="p-3 text-center text-[#2C3539]">
                              {key === "qsRanking" ? `#${u[key]}` : u[key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DISCOVER UNIVERSITIES SECTION
// ═══════════════════════════════════════════════════════════════
function DiscoverSection() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (uniId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareIds((prev) =>
      prev.includes(uniId) ? prev.filter((id) => id !== uniId) : [...prev, uniId].slice(-2)
    );
  };

  const compareUniversities = compareIds
    .map((id) => mockUniversities.find((u) => u.id === id))
    .filter(Boolean) as University[];

  const toggleCountry = (c: string) =>
    setSelectedCountries((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);
  const toggleDegree = (d: string) =>
    setSelectedDegrees((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d]);
  const toggleField = (f: string) =>
    setSelectedFields((p) => p.includes(f) ? p.filter((x) => x !== f) : [...p, f]);

  const clearAll = () => {
    setSelectedCountries([]);
    setSelectedDegrees([]);
    setSelectedFields([]);
    setSearch("");
  };

  const hasFilters = selectedCountries.length > 0 || selectedDegrees.length > 0 || selectedFields.length > 0;

  const filtered = useMemo(() => {
    return mockUniversities.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCountries.length > 0 && !selectedCountries.includes(u.country)) return false;
      if (selectedDegrees.length > 0 && !selectedDegrees.some((d) => u.degreeLevels.includes(d))) return false;
      if (selectedFields.length > 0) {
        const uniCourses = mockCourses.filter((c) => c.universityId === u.id);
        if (!selectedFields.some((f) => uniCourses.some((c) => c.fieldOfStudy === f))) return false;
      }
      return true;
    });
  }, [search, selectedCountries, selectedDegrees, selectedFields]);

  const getUniCourses = (uniId: number) => mockCourses.filter((c) => c.universityId === uniId);

  const handleSaveUni = (uniId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    savedItemsStore.toggleUniversity(uniId);
  };

  const handleApply = (uni: University, course: Course) => {
    applicationStore.create({
      studentId: 1,
      studentName: "John Doe",
      universityId: uni.id,
      universityName: uni.name,
      courseId: course.id,
      courseName: course.name,
      country: uni.country,
      targetSemester: uni.intake[0] || "Fall 2025",
    });
    setShowDetail(false);
    navigate("/applications");
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-2">
        <Compass className="w-6 h-6 text-[#E08D3C]" />
        <h2 className="text-xl sm:text-2xl font-bold text-[#2C3539]">Discover Universities</h2>
      </div>
      <p className="text-muted-foreground mb-6">Explore {mockUniversities.length}+ universities across the world</p>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by university name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-12 rounded-2xl border-2 border-gray-200 text-base"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Countries
          </p>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((c) => (
              <button
                key={c}
                onClick={() => toggleCountry(c)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  selectedCountries.includes(c)
                    ? "bg-[#E08D3C] text-white border-[#E08D3C]"
                    : "bg-white text-[#2C3539] border-gray-200 hover:border-gray-300"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> Degree
            </p>
            <div className="flex gap-2">
              {DEGREES.map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDegree(d)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    selectedDegrees.includes(d)
                      ? "bg-[#2C3539] text-white border-[#2C3539]"
                      : "bg-white text-[#2C3539] border-gray-200 hover:border-gray-300"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Field of Study</p>
            <div className="flex flex-wrap gap-2 max-w-xl">
              {FIELDS.slice(0, 8).map((f) => (
                <button
                  key={f}
                  onClick={() => toggleField(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    selectedFields.includes(f)
                      ? "bg-[#C4DFF0] text-[#2C3539] border-[#C4DFF0]"
                      : "bg-white text-[#2C3539] border-gray-200 hover:border-gray-300"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-muted-foreground">
            <X className="w-3 h-3 mr-1" /> Clear all filters
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Showing <span className="font-semibold text-[#2C3539]">{filtered.length}</span> universities
      </p>

      {/* University Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((uni) => {
          const isSaved = savedItemsStore.isUniversitySaved(uni.id);
          return (
            <Card
              key={uni.id}
              className="p-5 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#C4DFF0]/50 transition-all cursor-pointer group"
              onClick={() => { setSelectedUni(uni); setShowDetail(true); }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C4DFF0]/30 to-[#C4DFF0]/10 flex items-center justify-center border border-[#C4DFF0]/20 flex-shrink-0">
                    {uni.logoUrl ? (
                      <img src={uni.logoUrl} alt="" className="w-8 h-8 object-contain" />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-[#2C3539]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#2C3539] text-sm truncate">{uni.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {uni.city}, {uni.country}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleSaveUni(uni.id, e)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <Heart
                    className={cn(
                      "w-5 h-5 transition-all",
                      isSaved ? "fill-red-500 text-red-500" : "text-gray-300 group-hover:text-red-400"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {uni.country}
                </span>
                <span>QS #{uni.qsRanking}</span>
                <Badge className="text-[10px] bg-[#C4DFF0]/20 text-[#2C3539] border-0">
                  {uni.type}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{uni.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {uni.programs.slice(0, 3).map((p) => (
                  <Badge key={p} variant="secondary" className="text-[10px]">
                    {p}
                  </Badge>
                ))}
                {uni.programs.length > 3 && (
                  <Badge variant="outline" className="text-[10px]">+{uni.programs.length - 3}</Badge>
                )}
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 rounded-lg text-xs"
                  onClick={(e) => toggleCompare(uni.id, e)}
                >
                  <GitCompare
                    className={cn(
                      "w-3 h-3 mr-1",
                      compareIds.includes(uni.id) && "text-[#E08D3C]"
                    )}
                  />
                  Compare
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No universities match your filters.</p>
          <Button variant="outline" onClick={clearAll} className="mt-3">
            Clear Filters
          </Button>
        </div>
      )}

      {/* University Detail Modal */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedUni && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#2C3539] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C4DFF0]/30 to-white flex items-center justify-center border">
                    {selectedUni.logoUrl ? (
                      <img src={selectedUni.logoUrl} alt="" className="w-7 h-7 object-contain" />
                    ) : (
                      <GraduationCap className="w-5 h-5" />
                    )}
                  </div>
                  {selectedUni.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#C4DFF0]/10 border border-[#C4DFF0]/20">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">QS Ranking</p>
                    <p className="text-lg font-bold text-[#2C3539]">#{selectedUni.qsRanking}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#C4DFF0]/10 border border-[#C4DFF0]/20">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Acceptance</p>
                    <p className="text-lg font-bold text-[#2C3539]">{selectedUni.acceptanceRate}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#C4DFF0]/10 border border-[#C4DFF0]/20">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tuition</p>
                    <p className="text-sm font-semibold text-[#2C3539] truncate">{selectedUni.tuitionFee}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{selectedUni.description}</p>

                <div>
                  <h4 className="font-semibold text-[#2C3539] mb-3 text-sm">Available Courses</h4>
                  <div className="space-y-2">
                    {getUniCourses(selectedUni.id).map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-gray-200/60 hover:border-[#C4DFF0]/50 transition-all"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#2C3539]">{course.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {course.degreeLevel} · {course.duration} · {course.language}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-lg text-xs flex-shrink-0 ml-3"
                          onClick={() => handleApply(selectedUni, course)}
                        >
                          <Send className="w-3 h-3 mr-1" /> Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-muted-foreground">City</span>
                    <span className="font-medium">{selectedUni.city}, {selectedUni.state}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-muted-foreground">Language</span>
                    <span className="font-medium">{selectedUni.language}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-muted-foreground">Application Fee</span>
                    <span className="font-medium">{selectedUni.applicationFee}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-muted-foreground">Intake</span>
                    <span className="font-medium">{selectedUni.intake.join(", ")}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedUni.website, "_blank")}
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> Website
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => savedItemsStore.toggleUniversity(selectedUni.id)}
                    className={savedItemsStore.isUniversitySaved(selectedUni.id) ? "text-red-500 border-red-200" : ""}
                  >
                    <Heart className={cn("w-3.5 h-3.5 mr-1", savedItemsStore.isUniversitySaved(selectedUni.id) && "fill-red-500")} />
                    {savedItemsStore.isUniversitySaved(selectedUni.id) ? "Saved" : "Save"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Compare Bar & Modal for Discover */}
      {compareIds.length > 0 && (
        <>
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-white/95 backdrop-blur-md border-2 border-[#E08D3C]/30 shadow-2xl rounded-2xl px-5 py-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <GitCompare className="w-5 h-5 text-[#E08D3C]" />
            <span className="text-sm font-semibold text-[#2C3539]">
              {compareIds.length} of 2 selected
            </span>
            <Button
              size="sm"
              className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-lg"
              disabled={compareIds.length < 2}
              onClick={() => setShowCompare(true)}
            >
              Compare Now
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCompareIds([])}
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>

          <Dialog open={showCompare} onOpenChange={setShowCompare}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#2C3539] flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-[#E08D3C]" />
                  University Comparison
                </DialogTitle>
              </DialogHeader>
              {compareUniversities.length >= 2 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-3 bg-gray-50 rounded-l-lg font-semibold text-[#2C3539] w-32">Metric</th>
                        {compareUniversities.map((u) => (
                          <th key={u.id} className="p-3 bg-gray-50 text-center font-semibold text-[#2C3539]">
                            {u.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Country", key: "country" as const },
                        { label: "City", key: "city" as const },
                        { label: "Type", key: "type" as const },
                        { label: "QS Ranking", key: "qsRanking" as const },
                        { label: "Acceptance Rate", key: "acceptanceRate" as const },
                        { label: "Tuition Fee", key: "tuitionFee" as const },
                        { label: "Language", key: "language" as const },
                        { label: "Application Fee", key: "applicationFee" as const },
                      ].map(({ label, key }) => (
                        <tr key={key} className="border-b border-gray-100">
                          <td className="p-3 font-medium text-muted-foreground">{label}</td>
                          {compareUniversities.map((u) => (
                            <td key={u.id} className="p-3 text-center text-[#2C3539]">
                              {key === "qsRanking" ? `#${u[key]}` : u[key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SAVED SECTION (Universities + Courses)
// ═══════════════════════════════════════════════════════════════
function SavedSection() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const savedUnis = savedItemsStore.getSavedUniversities();
  const savedCourses = savedItemsStore.getSavedCourses();

  const savedUniversityDetails = savedUnis
    .map((s) => mockUniversities.find((u) => u.id === s.universityId))
    .filter(Boolean) as typeof mockUniversities;

  const savedCourseDetails = savedCourses
    .map((s) => {
      const course = mockCourses.find((c) => c.id === s.courseId);
      const uni = mockUniversities.find((u) => u.id === s.universityId);
      return course && uni ? { ...course, universityName: uni.name, universityCountry: uni.country } : null;
    })
    .filter(Boolean) as (typeof mockCourses[number] & { universityName: string; universityCountry: string })[];

  const handleRemoveUni = (uniId: number) => {
    savedItemsStore.removeUniversity(uniId);
    setRefreshKey((k) => k + 1);
  };

  const handleRemoveCourse = (courseId: number) => {
    savedItemsStore.removeCourse(courseId);
    setRefreshKey((k) => k + 1);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Bookmark className="w-6 h-6 text-[#E08D3C]" />
        <h2 className="text-xl sm:text-2xl font-bold text-[#2C3539]">Saved Items</h2>
      </div>
      <p className="text-muted-foreground mb-6">Your bookmarked universities and courses</p>

      <Tabs defaultValue="universities" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="universities" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Saved Universities ({savedUnis.length})
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Saved Courses ({savedCourses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="universities">
          {savedUniversityDetails.length === 0 ? (
            <Card className="p-10 text-center bg-white/70 backdrop-blur-sm border-2 border-gray-200/80">
              <Bookmark className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2C3539] mb-2">No Saved Universities</h3>
              <p className="text-muted-foreground mb-4">
                Save universities from Discover to view them here.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedUniversityDetails.map((uni) => (
                <Card
                  key={uni.id}
                  className="p-5 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C4DFF0]/30 to-[#C4DFF0]/10 flex items-center justify-center border flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-[#2C3539]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[#2C3539] text-sm">{uni.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {uni.city}, {uni.country}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveUni(uni.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Badge className="text-[10px] bg-[#C4DFF0]/20 text-[#2C3539] border-0">
                      QS #{uni.qsRanking}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">{uni.type}</Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{uni.description}</p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 rounded-lg text-xs"
                      onClick={() => window.open(uni.website, "_blank")}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" /> Website
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-[#E08D3C] hover:bg-[#c97a2e] text-white rounded-lg text-xs"
                      onClick={() => {
                        const el = document.getElementById("discover-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <Send className="w-3 h-3 mr-1" /> Apply
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="courses">
          {savedCourseDetails.length === 0 ? (
            <Card className="p-10 text-center bg-white/70 backdrop-blur-sm border-2 border-gray-200/80">
              <Bookmark className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2C3539] mb-2">No Saved Courses</h3>
              <p className="text-muted-foreground mb-4">
                Save courses from university details to view them here.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {savedCourseDetails.map((course) => (
                <Card
                  key={course.id}
                  className="p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#2C3539] text-sm">{course.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{course.universityName}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{course.universityCountry}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px]">{course.degreeLevel}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{course.duration}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{course.language}</Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCourse(course.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 ml-3"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

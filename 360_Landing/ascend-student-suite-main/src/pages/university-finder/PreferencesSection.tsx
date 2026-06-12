import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Save, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { preferenceStore } from "@/store/preferences";
import { StudentPreferences } from "@/data/mock/recommendations";
import { DEMO_MODE } from "../../config/demoMode";

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

interface PreferencesSectionProps {
  onComplete: () => void;
  isComplete: boolean;
}

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({ onComplete, isComplete }) => {
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
};

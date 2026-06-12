import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, SlidersHorizontal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { preferenceStore } from "@/store/preferences";
import { JourneyTracker } from "@/components/ui/JourneyTracker";
import { journeyStore } from "@/store/journeyStore";
import { CompareProvider } from "./university-finder/CompareContext";
import { PreferencesSection } from "./university-finder/PreferencesSection";
import { ResultsSection } from "./university-finder/ResultsSection";

type Section = "preferences" | "results";

export default function UniversityFinder() {
  const [activeSection, setActiveSection] = useState<Section>(
    preferenceStore.hasPreferences() ? "results" : "preferences"
  );
  const [prefsSaved, setPrefsSaved] = useState(preferenceStore.hasPreferences());

  const handlePreferencesComplete = () => {
    journeyStore.complete("preferences_completed");
    journeyStore.complete("recommendations_generated");
    setPrefsSaved(true);
    setActiveSection("results");
  };

  return (
    <CompareProvider>
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
    </CompareProvider>
  );
}

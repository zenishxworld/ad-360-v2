// ─────────────────────────────────────────────────────────────
// JourneyTracker Component
// Phase 1C: Student Journey System
// Reuses existing design tokens — no new styles
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Circle, ChevronDown, ChevronUp, Rocket, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  journeyStore,
  MILESTONES,
  type JourneyState,
  type Milestone,
} from "@/store/journeyStore";

// ── Props ─────────────────────────────────────────────────────

interface JourneyTrackerProps {
  /** "card" = full dashboard card with demo button
   *  "banner" = compact top-of-page banner ("Step X of 6")
   *  "timeline" = vertical step list (full detail) */
  variant?: "card" | "banner" | "timeline";
  /** Show the "Complete Demo Journey" button */
  showDemoButton?: boolean;
  /** Called after demo is run (e.g. to trigger page re-render) */
  onDemoComplete?: () => void;
  className?: string;
}

// ── Main component ────────────────────────────────────────────

export const JourneyTracker: React.FC<JourneyTrackerProps> = ({
  variant = "card",
  showDemoButton = false,
  onDemoComplete,
  className,
}) => {
  const navigate = useNavigate();
  const [journeyState, setJourneyState] = useState<JourneyState>(() =>
    journeyStore.sync()
  );
  const [expanded, setExpanded] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);

  // Re-sync every time component mounts / route changes
  useEffect(() => {
    setJourneyState(journeyStore.sync());
  }, []);

  const progress = journeyStore.getProgress(journeyState);
  const current = journeyStore.getCurrentMilestone(journeyState);
  const completedSet = new Set(journeyState.completedMilestones);

  const handleDemo = useCallback(() => {
    setDemoRunning(true);
    setTimeout(() => {
      const newState = journeyStore.runDemoJourney();
      setJourneyState(newState);
      setDemoRunning(false);
      onDemoComplete?.();
    }, 600);
  }, [onDemoComplete]);

  const handleReset = useCallback(() => {
    journeyStore.reset();
    setJourneyState(journeyStore.sync());
  }, []);

  // ── BANNER variant ──────────────────────────────────────────

  if (variant === "banner") {
    const stepNum = current?.step ?? MILESTONES.length;
    const totalSteps = MILESTONES.length;
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border-2",
          "bg-gradient-to-r from-[#fff7f0] to-white border-[#E08D3C]/20",
          className
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E08D3C]/10 shrink-0">
            <span className="text-sm font-bold text-[#E08D3C]">{stepNum}/{totalSteps}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Step {stepNum} of {totalSteps}</p>
            <p className="text-sm font-semibold text-[#2C3539] truncate">
              {current?.title ?? "Journey Complete! 🎉"}
            </p>
          </div>
        </div>
        {/* Mini progress bar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-24 sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E08D3C] to-[#d07a2a] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs font-bold text-[#E08D3C]">{progress}%</span>
        </div>
      </motion.div>
    );
  }

  // ── TIMELINE variant ────────────────────────────────────────

  if (variant === "timeline") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
          {MILESTONES.map((milestone, idx) => {
            const done = completedSet.has(milestone.id);
            const isActive = !done && current?.id === milestone.id;
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex gap-4 mb-4 relative"
              >
                {/* Step indicator */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all",
                    done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isActive
                      ? "bg-[#E08D3C] border-[#E08D3C] text-white animate-pulse"
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-bold">{milestone.step}</span>
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "flex-1 p-3 rounded-xl border transition-all",
                    done
                      ? "bg-emerald-50 border-emerald-200"
                      : isActive
                      ? "bg-[#fff7f0] border-[#E08D3C]/40 shadow-sm"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold flex items-center gap-1.5">
                        <span>{milestone.icon}</span>
                        {milestone.title}
                        {done && (
                          <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-0 ml-1">
                            Done
                          </Badge>
                        )}
                        {isActive && (
                          <Badge className="text-[10px] bg-[#E08D3C]/10 text-[#E08D3C] border-0 ml-1">
                            Current
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {milestone.description}
                      </p>
                    </div>
                    {isActive && (
                      <Button
                        size="sm"
                        className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white text-xs h-7 shrink-0"
                        onClick={() => navigate(milestone.nextRoute)}
                      >
                        Go <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── CARD variant (default — for Dashboard) ─────────────────

  return (
    <Card
      className={cn(
        "p-5 sm:p-6 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-md",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-[#E08D3C]" />
          <h3 className="text-lg font-semibold text-[#2C3539]">Your Journey</h3>
        </div>
        <div className="flex items-center gap-2">
          {showDemoButton && (
            <Button
              size="sm"
              onClick={handleDemo}
              disabled={demoRunning}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs h-7 px-3 rounded-lg gap-1"
            >
              <Zap className="w-3 h-3" />
              {demoRunning ? "Running…" : "Complete Demo Journey"}
            </Button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {completedSet.size} of {MILESTONES.length} steps complete
          </span>
          <span className="text-base font-bold text-[#E08D3C]">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#E08D3C] to-[#d07a2a] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
        {/* Step markers */}
        <div className="flex justify-between mt-1">
          {[20, 40, 60, 80, 100].map((pct) => (
            <span
              key={pct}
              className={cn(
                "text-[10px] font-medium",
                progress >= pct ? "text-[#E08D3C]" : "text-gray-300"
              )}
            >
              {pct}%
            </span>
          ))}
        </div>
      </div>

      {/* Current stage */}
      {current ? (
        <div className="p-3 rounded-xl bg-[#fff7f0] border border-[#E08D3C]/20 mb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Current Stage</p>
              <p className="text-sm font-bold text-[#2C3539] flex items-center gap-1.5">
                <span>{current.icon}</span>
                {current.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Next: {current.nextAction}
              </p>
            </div>
            <Button
              size="sm"
              className="bg-[#E08D3C] hover:bg-[#c97a2e] text-white text-xs h-8 shrink-0"
              onClick={() => navigate(current.nextRoute)}
            >
              {current.nextAction}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 mb-3 text-center">
          <p className="text-sm font-bold text-emerald-700">🎉 Journey Complete!</p>
          <p className="text-xs text-emerald-600 mt-0.5">All milestones achieved. Check your application status.</p>
        </div>
      )}

      {/* Milestone steps compact row */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {MILESTONES.map((m) => {
          const done = completedSet.has(m.id);
          const isActive = current?.id === m.id;
          return (
            <div key={m.id} className="flex items-center gap-1 shrink-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                  done
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isActive
                    ? "bg-[#E08D3C] border-[#E08D3C] text-white"
                    : "bg-gray-100 border-gray-200 text-gray-400"
                )}
                title={m.title}
              >
                {done ? "✓" : m.step}
              </div>
              {m.step < MILESTONES.length && (
                <div
                  className={cn(
                    "h-0.5 w-4 rounded-full",
                    done ? "bg-emerald-400" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Expandable full timeline */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-100 mt-4">
              <JourneyTracker variant="timeline" />
              {journeyState.demoMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="mt-4 text-xs text-muted-foreground w-full"
                >
                  Reset Journey (Clear Demo)
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default JourneyTracker;

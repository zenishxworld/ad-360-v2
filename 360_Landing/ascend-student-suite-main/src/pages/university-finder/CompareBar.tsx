import React from "react";
import { motion } from "framer-motion";
import { GitCompare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "./CompareContext";

interface CompareBarProps {
  offsetBottom?: boolean; // If true, shifts up slightly (useful for discover search tab comparison)
}

export const CompareBar: React.FC<CompareBarProps> = ({ offsetBottom = false }) => {
  const { compareIds, setShowCompare, clearCompare } = useCompare();

  if (compareIds.length === 0) return null;

  return (
    <motion.div
      className={`fixed ${offsetBottom ? 'bottom-24' : 'bottom-6'} left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-white/95 backdrop-blur-md border-2 border-[#E08D3C]/30 shadow-2xl rounded-2xl px-5 py-3`}
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
        onClick={clearCompare}
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

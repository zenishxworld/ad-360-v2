import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { readinessStore, ReadinessState } from "@/store/readiness";
import { journeyStore } from "@/store/journeyStore";
import { FileText, CheckCircle2, XCircle, Zap, ShieldCheck, AlertCircle } from "lucide-react";

interface ReadinessCardProps {
  className?: string;
  showDemoButton?: boolean;
  onStateChange?: () => void;
}

export function ReadinessCard({ className, showDemoButton = false, onStateChange }: ReadinessCardProps) {
  const [readiness, setReadiness] = useState<ReadinessState>(readinessStore.getReadiness());

  useEffect(() => {
    setReadiness(readinessStore.getReadiness());
  }, []);

  const handleDemo = () => {
    readinessStore.generateCompleteDocumentSet();
    const newState = readinessStore.getReadiness();
    setReadiness(newState);
    
    // Also complete the journey milestone if ready
    if (newState.isReady) {
      journeyStore.complete("documents_uploaded");
    }
    
    if (onStateChange) onStateChange();
  };

  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (readiness.percentage / 100) * circumference;

  return (
    <Card className={cn("p-5 sm:p-6 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 shadow-md", className)}>
      <div className="flex flex-col sm:flex-row gap-6">
        
        {/* Left side: Circular Progress */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-gray-200 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
              />
              {/* Progress circle */}
              <motion.circle
                className={cn(
                  "stroke-current transition-all duration-1000 ease-out",
                  readiness.percentage === 100 ? "text-emerald-500" :
                  readiness.percentage >= 60 ? "text-blue-500" :
                  readiness.percentage >= 40 ? "text-yellow-500" : "text-red-500"
                )}
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                strokeDasharray={circumference}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#2C3539]">{readiness.percentage}%</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ready</span>
            </div>
          </div>
          
          <Badge className={cn(
            "mt-4 font-semibold px-3 py-1",
            readiness.isReady ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
          )}>
            {readiness.isReady ? (
              <><ShieldCheck className="w-3 h-3 mr-1" /> Application Ready</>
            ) : (
              <><AlertCircle className="w-3 h-3 mr-1" /> Not Ready</>
            )}
          </Badge>
        </div>

        {/* Right side: Lists */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#2C3539] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#E08D3C]" />
                Document Readiness
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {readiness.isReady 
                  ? "All required documents are uploaded. You are ready to apply!"
                  : `You are missing ${readiness.missingDocs.length} required document${readiness.missingDocs.length > 1 ? 's' : ''}.`}
              </p>
            </div>
            {showDemoButton && !readiness.isReady && (
              <Button 
                onClick={handleDemo}
                size="sm" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm gap-1 ml-4 shrink-0"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Generate Complete Document Set</span>
                <span className="sm:hidden">Auto Complete</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Missing Docs */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                Missing Documents ({readiness.missingDocs.length})
              </h4>
              {readiness.missingDocs.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">None!</p>
              ) : (
                <div className="space-y-1.5">
                  {readiness.missingDocs.map(doc => (
                    <div key={doc.id} className="flex items-center gap-2 p-2 rounded-lg bg-red-50/50 border border-red-100">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-sm font-medium text-[#2C3539] truncate">{doc.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Docs */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                Uploaded Documents ({readiness.completedDocs.length})
              </h4>
              {readiness.completedDocs.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">None yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {readiness.completedDocs.map(({ def }) => (
                    <div key={def.id} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-sm font-medium text-[#2C3539] truncate">{def.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </Card>
  );
}

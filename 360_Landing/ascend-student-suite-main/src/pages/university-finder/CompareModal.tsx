import React from "react";
import { GitCompare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCompare } from "./CompareContext";
import { mockUniversities, University } from "@/data/mock/universities";

export const CompareModal: React.FC = () => {
  const { compareIds, showCompare, setShowCompare } = useCompare();

  const compareUniversities = compareIds
    .map((id) => mockUniversities.find((u) => u.id === id))
    .filter(Boolean) as University[];

  return (
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
  );
};

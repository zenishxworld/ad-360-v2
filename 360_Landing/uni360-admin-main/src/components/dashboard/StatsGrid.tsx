import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsGridProps {
  totalApplications: number;
  activeApplications: number;
  claimPendingCount: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalApplications,
  activeApplications,
  claimPendingCount,
}) => {
  const statsCards = [
    {
      title: "Total Applications",
      value: totalApplications.toString(),
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: `${totalApplications} applications`,
    },
    {
      title: "Active Applications",
      value: activeApplications.toString(),
      icon: CheckCircle,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "In progress",
    },
    {
      title: "Claims Pending",
      value: claimPendingCount.toString(),
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
      change: claimPendingCount === 1 ? "1 application awaiting claim" : `${claimPendingCount} applications awaiting claim`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="uni-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-secondary mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

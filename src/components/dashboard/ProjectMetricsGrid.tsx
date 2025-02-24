import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  ArrowDownRight,
  FileCheck2,
  FileWarning,
  FileClock,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  total?: number;
  icon?: React.ReactNode;
}

interface ProjectMetricsGridProps {
  metrics?: {
    totalDrawings?: number;
    submittedDrawings?: number;
    approvedDrawings?: number;
    inReviewDrawings?: number;
    pendingDrawings?: number;
  };
}

const MetricCard = ({
  title = "Metric",
  value = 0,
  change = 0,
  total = 100,
  icon,
}: MetricCardProps) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <Card className="bg-card hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden border-none relative group hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2">
              {value.toLocaleString()}
            </h3>
            <div className="flex items-center mt-2 gap-1">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {Math.abs(change).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="p-2.5 bg-primary/5 rounded-xl">{icon}</div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className={`h-full ${isPositive ? "bg-blue-500" : "bg-red-500"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectMetricsGrid = ({
  metrics = {
    totalDrawings: 100,
    submittedDrawings: 75,
    approvedDrawings: 50,
    inReviewDrawings: 15,
    pendingDrawings: 10,
  },
}: ProjectMetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <MetricCard
        title="Total Drawings"
        value={metrics.totalDrawings || 0}
        change={5}
        icon={<FileCheck2 className="w-6 h-6 text-primary" />}
      />
      <MetricCard
        title="Submitted Drawings"
        value={metrics.submittedDrawings || 0}
        total={metrics.totalDrawings}
        change={8}
        icon={<FileCheck2 className="w-6 h-6 text-primary" />}
      />
      <MetricCard
        title="Approved Drawings"
        value={metrics.approvedDrawings || 0}
        total={metrics.totalDrawings}
        change={12}
        icon={<FileCheck2 className="w-6 h-6 text-green-500" />}
      />
      <MetricCard
        title="In Review"
        value={metrics.inReviewDrawings || 0}
        total={metrics.totalDrawings}
        change={-3}
        icon={<FileWarning className="w-6 h-6 text-yellow-500" />}
      />
      <MetricCard
        title="Pending Review"
        value={metrics.pendingDrawings || 0}
        total={metrics.totalDrawings}
        change={-2}
        icon={<FileClock className="w-6 h-6 text-red-500" />}
      />
    </div>
  );
};

export default ProjectMetricsGrid;

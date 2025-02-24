import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StructuralElement } from "@/types/project";
import StatusCell from "./StatusCell";

interface ProductionStatusProps {
  elements?: StructuralElement[];
}

const ProductionStatus = ({ elements = [] }: ProductionStatusProps) => {
  if (elements.length === 0) {
    return (
      <Card className="w-full bg-card rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-6 text-center text-muted-foreground">
          No production data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card rounded-xl overflow-hidden shadow-sm">
      <CardHeader>
        <CardTitle>Production Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {elements.map((element) => (
            <div
              key={element.type}
              className="flex flex-col items-center space-y-4"
            >
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#edf2f7"
                    strokeWidth="3"
                  />
                  {/* Progress circle */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    strokeDasharray={`${element.percentage}, 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-lg font-semibold">
                    {element.percentage}%
                  </div>
                  <StatusCell status={element.status} />
                </div>
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-medium capitalize">
                  {element.type.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {element.completed} / {element.total}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionStatus;

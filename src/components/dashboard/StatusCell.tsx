import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Status = "A" | "B" | "C";

interface StatusCellProps {
  status?: Status;
  description?: string;
}

const statusConfig = {
  A: {
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    label: "Approved",
  },
  B: {
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    label: "In Review",
  },
  C: { color: "bg-red-100 text-red-800 hover:bg-red-200", label: "Pending" },
};

const StatusCell = ({
  status = "C",
  description = "Awaiting review",
}: StatusCellProps) => {
  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-start bg-white p-2 w-full h-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge
              variant="secondary"
              className={`${config.color} font-medium px-3 py-1`}
            >
              {status}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {config.label}: {description}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StatusCell;

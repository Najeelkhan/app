import { ElementStatus, StructuralElement } from "@/types/project";

export const calculateProjectStatus = (
  elements: StructuralElement[],
): ElementStatus => {
  // Filter out elements with total = 0
  const activeElements = elements.filter((e) => e.total > 0);

  if (activeElements.length === 0) return "C";

  const statuses = activeElements.map((e) => e.status);

  // If all elements are approved, project is approved
  if (statuses.every((s) => s === "A")) return "A";

  // If all elements are pending, project is pending
  if (statuses.every((s) => s === "C")) return "C";

  // If any elements are in review or approved, but not all approved, project is in review
  if (statuses.some((s) => s === "A") || statuses.some((s) => s === "B"))
    return "B";

  return "C";
};

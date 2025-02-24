import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Edit2 } from "lucide-react";
import StatusCell from "./StatusCell";

import { Project } from "@/types/project";

interface ProjectTableProps {
  selectedClient?: string | null;
  onClientSelect?: (clientName: string | null) => void;
  projects?: Project[];
  onRowClick?: (projectId: string) => void;
  onEditClick?: (projectId: string) => void;
}

const defaultProjects: Project[] = [];

const sortProjects = (projects: Project[]) => {
  return [...projects].sort((a, b) => {
    if (!a.clientName || !b.clientName) return 0;
    const clientCompare = a.clientName.localeCompare(b.clientName);
    return clientCompare !== 0 ? clientCompare : a.name.localeCompare(b.name);
  });
};

const ProjectTable = ({
  projects = defaultProjects,
  onRowClick = () => {},
  onEditClick = () => {},
  selectedClient = null,
  onClientSelect = () => {},
}: ProjectTableProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-64">
          <Input placeholder="Search projects..." className="pl-10" />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead className="text-right">Total Drawings</TableHead>
              <TableHead className="text-right">Submitted</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Progress</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortProjects(projects).map((project) => (
              <TableRow
                key={project.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onRowClick(project.id)}
              >
                <TableCell
                  className="font-medium cursor-pointer hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newSelectedClient =
                      selectedClient === project.clientName
                        ? null
                        : project.clientName;
                    onClientSelect(newSelectedClient);
                  }}
                >
                  {project.clientName}
                  {selectedClient === project.clientName && " ✓"}
                </TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell className="text-right">
                  {project.totalDrawings}
                </TableCell>
                <TableCell className="text-right">
                  {project.submittedDrawings}
                </TableCell>
                <TableCell className="text-center">
                  <StatusCell
                    status={project.status}
                    description={`${project.progress}% complete`}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {project.progress}%
                </TableCell>
                <TableCell>{project.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(project.id);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectTable;

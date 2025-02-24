import React, { useState, useEffect } from "react";
import Header from "./dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import ProjectTable from "./dashboard/ProjectTable";
import ImportProjectDialog from "./dashboard/ImportProjectDialog";
import CreateProjectForm from "./dashboard/CreateProjectForm";
import EditProjectDialog from "./dashboard/EditProjectDialog";
import { Project, ElementType } from "@/types/project";
import { calculateProjectStatus } from "@/lib/projectStatus";
import ProductionStatus from "./dashboard/ProductionStatus";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem("constructionProjects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("constructionProjects", JSON.stringify(projects));
  }, [projects]);

  const filteredProjects = selectedClient
    ? projects.filter((p) => p.clientName === selectedClient)
    : projects;

  const handleProjectClick = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    setSelectedProject(project || null);
    setSelectedClient(null);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header
          onCreateProject={() => setShowCreateForm(true)}
          onImportProject={() => setShowImportDialog(true)}
        />
        <main className="flex-1 px-8 py-6 overflow-auto">
          <ProjectTable
            projects={filteredProjects}
            selectedClient={selectedClient}
            onClientSelect={setSelectedClient}
            onRowClick={handleProjectClick}
            onEditClick={(projectId) => {
              const project = projects.find((p) => p.id === projectId);
              setEditingProject(project || null);
            }}
          />

          {selectedProject && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">
                {selectedProject.name} - Production Status
              </h2>
              <ProductionStatus elements={selectedProject.elements} />
            </div>
          )}

          <ImportProjectDialog
            open={showImportDialog}
            onClose={() => setShowImportDialog(false)}
          />

          <CreateProjectForm
            open={showCreateForm}
            onClose={() => setShowCreateForm(false)}
            onSubmit={(data) => {
              const newProject: Project = {
                clientName: data.clientName,
                id: String(Date.now()),
                name: data.projectName,
                totalDrawings: Number(data.drawingCount),
                submittedDrawings: 0,
                status: "C",
                progress: 0,
                lastUpdated: new Date().toISOString().split("T")[0],
                elements: Object.entries(data.elements).map(
                  ([type, total]) => ({
                    type: type as ElementType,
                    total,
                    completed: 0,
                    remaining: total,
                    percentage: 0,
                    status: "C",
                  }),
                ),
              };
              setProjects([...projects, newProject]);
              setShowCreateForm(false);
            }}
          />

          {editingProject && (
            <EditProjectDialog
              open={!!editingProject}
              project={editingProject}
              onClose={() => setEditingProject(null)}
              onSave={(projectId, data) => {
                const updatedProjects = projects.map((project) => {
                  if (project.id === projectId) {
                    const updatedElements = data.elements.map(
                      (elem, index) => ({
                        ...project.elements[index],
                        completed: elem.completed,
                        total: elem.total,
                        remaining: elem.total - elem.completed,
                        percentage: Math.round(
                          (elem.completed / elem.total) * 100,
                        ),
                        status: elem.status,
                      }),
                    );

                    const totalSubmitted = updatedElements.reduce(
                      (sum, elem) => sum + elem.completed,
                      0,
                    );

                    return {
                      ...project,
                      submittedDrawings: totalSubmitted,
                      status: calculateProjectStatus(updatedElements),
                      progress: Math.round(
                        (totalSubmitted / project.totalDrawings) * 100,
                      ),
                      lastUpdated: new Date().toISOString().split("T")[0],
                      elements: updatedElements,
                    };
                  }
                  return project;
                });
                setProjects(updatedProjects);
                setEditingProject(null);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Projects;

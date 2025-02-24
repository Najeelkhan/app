import React, { useState, useEffect } from "react";
import Header from "./dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import ProjectMetricsGrid from "./dashboard/ProjectMetricsGrid";
import { Project } from "@/types/project";

const Home = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem("constructionProjects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const metrics = {
    totalDrawings: projects.reduce((sum, p) => sum + p.totalDrawings, 0),
    submittedDrawings: projects.reduce(
      (sum, p) => sum + p.submittedDrawings,
      0,
    ),
    approvedDrawings: projects.reduce(
      (sum, p) => sum + (p.status === "A" ? p.submittedDrawings : 0),
      0,
    ),
    inReviewDrawings: projects.reduce(
      (sum, p) => sum + (p.status === "B" ? p.submittedDrawings : 0),
      0,
    ),
    pendingDrawings: projects.reduce(
      (sum, p) =>
        sum + (p.status === "C" ? p.totalDrawings - p.submittedDrawings : 0),
      0,
    ),
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 px-8 py-6 overflow-auto">
          <ProjectMetricsGrid metrics={metrics} />
        </main>
      </div>
    </div>
  );
};

export default Home;

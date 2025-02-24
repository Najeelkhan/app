import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Upload, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  onCreateProject?: () => void;
  onImportProject?: () => void;
  userName?: string;
}

const Header = ({
  onCreateProject = () => {},
  onImportProject = () => {},
  userName = "John Doe",
}: HeaderProps) => {
  return (
    <header className="w-full h-16 px-6 bg-background border-b flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-gray-900">Drawing Tracker</h1>

        <div className="flex items-center gap-2">
          <Button
            onClick={onCreateProject}
            className="flex items-center gap-2"
            variant="default"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>

          <Button
            onClick={onImportProject}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <span className="text-sm text-muted-foreground">{userName}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;

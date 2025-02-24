import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileCheck, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportProjectDialogProps {
  open?: boolean;
  onClose?: () => void;
}

const ImportProjectDialog = ({
  open = true,
  onClose = () => {},
}: ImportProjectDialogProps) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile?.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      droppedFile?.type === "application/vnd.ms-excel"
    ) {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Please upload an Excel file (.xlsx or .xls)");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload an Excel file (.xlsx or .xls)");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Import Project from Excel</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    Drag and drop your Excel file here, or
                  </p>
                  <label className="mt-2 cursor-pointer">
                    <Input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={handleFileInput}
                    />
                    <span className="text-blue-500 hover:text-blue-600">
                      browse to upload
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <FileCheck className="mx-auto h-12 w-12 text-green-500" />
                <p className="text-sm text-gray-600">{file.name}</p>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={!file || !!error}
              onClick={() => {
                // Handle import logic here
                console.log("Importing file:", file);
              }}
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportProjectDialog;

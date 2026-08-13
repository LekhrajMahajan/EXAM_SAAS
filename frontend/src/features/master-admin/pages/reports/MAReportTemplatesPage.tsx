import React, { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useReportTemplates, useDeleteReportTemplate, useToggleReportTemplatePublish, useCreateReportTemplate } from "../../hooks/report-advanced.hooks";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import type { TableColumn } from "@/shared/types";
import { Upload, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export const MAReportTemplatesPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReportTemplates({ page, limit: 10 });
  const deleteMutation = useDeleteReportTemplate();
  const toggleMutation = useToggleReportTemplatePublish();
  const createMutation = useCreateReportTemplate();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const templates = data?.data?.templates || [];
  const stats = data?.data?.stats || { totalTemplates: 0, activeTemplates: 0 };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonContent = JSON.parse(e.target?.result as string);
        
        // Ensure required fields exist or provide defaults for the Master Template
        const payload = {
          name: jsonContent.name || "Imported Master Template",
          dataSource: jsonContent.dataSource || "all", // Master templates can span all sources
          exportFormat: jsonContent.exportFormat || "PDF",
          selectedFields: jsonContent.selectedFields || [],
          filters: jsonContent.filters || {},
          sorting: jsonContent.sorting || [],
          grouping: jsonContent.grouping || [],
          aggregations: jsonContent.aggregations || [],
          branding: jsonContent.branding || { logo: "", header: "", footer: "" },
          isPublished: false,
        };

        createMutation.mutate(payload, {
          onSuccess: () => {
            setIsImportModalOpen(false);
            setSelectedFile(null);
          }
        });
      } catch (error) {
        toast.error("Invalid JSON file format");
      }
    };
    reader.readAsText(selectedFile);
  };

  const columns: TableColumn<any>[] = [
    {
      id: "name",
      header: "Template Name",
      accessorKey: "name",
    },
    {
      id: "dataSource",
      header: "Data Source",
      accessorKey: "dataSource",
    },
    {
      id: "exportFormat",
      header: "Export Format",
      accessorKey: "exportFormat",
    },
    {
      id: "isPublished",
      header: "Status",
      cell: ({ row }: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
          {row.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => toggleMutation.mutate(row._id)}
          >
            {row.isPublished ? <XCircle className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(row._id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report Templates</h1>
          <p className="text-muted-foreground">Manage and import reusable report template designs</p>
        </div>

        <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Import Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Template Design</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Upload Configuration File (.json)</Label>
                <Input 
                  type="file" 
                  accept=".json"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">
                  The JSON file should contain the layout, branding, and styling configuration for the master report.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={createMutation.isPending || !selectedFile}
              >
                {createMutation.isPending ? "Importing..." : "Import"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-muted-foreground">Total Templates</span>
          <span className="text-2xl font-bold">{stats.totalTemplates}</span>
        </Card>
        <Card className="p-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-muted-foreground">Active Templates</span>
          <span className="text-2xl font-bold">{stats.activeTemplates}</span>
        </Card>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p>No Report Templates Found</p>
          </div>
        ) : (
          <GenericDataTable 
            columns={columns}
            data={templates}
            keyExtractor={(item) => item._id}
          />
        )}
      </Card>
    </div>
  );
};

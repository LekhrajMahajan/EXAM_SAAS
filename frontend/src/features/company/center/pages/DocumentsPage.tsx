import { CenterHeader } from "../components/CenterHeader";
import { DocumentViewer } from "../components/DocumentViewer";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCenter } from "../hooks/center.hooks";
import type { Center, Document as CenterDocument } from "../types/center.types";

export const DocumentsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCenter(id || '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const centerData = data?.data as Center | undefined;
  const centerName = centerData?.centerName || 'Center';
  const documents = (centerData?.documents || []) as unknown as CenterDocument[];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link to={`/company/centers/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <CenterHeader
            title="Documents"
            description={`Required compliance documents for ${centerName}`}
            actions={
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            }
          />
        </div>
      </div>

      <DocumentViewer documents={documents} />
    </div>
  );
};


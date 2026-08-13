import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { FileText, Download, Eye, Upload } from "lucide-react";
import type { StaffDetails } from "../types/staff.types";

interface DocumentUploaderProps {
  documents: StaffDetails['documents'];
}

export const DocumentUploader = ({ documents }: DocumentUploaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload New Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {doc.type}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold truncate mb-2" title={doc.name}>
                {doc.name}
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {documents.length === 0 && (
          <div className="col-span-full p-8 text-center border rounded-md bg-muted/20">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No documents uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

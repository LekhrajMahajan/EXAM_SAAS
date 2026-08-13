import { Card, CardContent } from "@/shared/components/ui/card";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface PhotoUploaderProps {
  title: string;
  type: 'photo' | 'signature' | 'thumb';
}

export const PhotoUploader = ({ title, type }: PhotoUploaderProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold text-sm mb-4">{title}</h3>
        <div className="border-2 border-dashed border-slate-300 rounded-md p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer min-h-[150px]">
          <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-700">Click to upload</p>
          <p className="text-xs text-slate-500 mt-1">
            {type === 'signature' ? 'PNG, JPG up to 1MB' : 'PNG, JPG up to 2MB'}
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <ImageIcon className="h-3 w-3 mr-1" />
            No file chosen
          </div>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Browse</Button>
        </div>
      </CardContent>
    </Card>
  );
};

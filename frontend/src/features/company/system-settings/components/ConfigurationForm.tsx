import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Save } from 'lucide-react';

interface ConfigurationFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  children: React.ReactNode;
}

export function ConfigurationForm({ onSubmit, children }: ConfigurationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
       {children}
       
       <div className="flex justify-end gap-2 pt-6 mt-6 border-t border-slate-100">
          <Button type="button" variant="outline">Reset to Defaults</Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
             <Save className="w-4 h-4 mr-2" />
             Save Changes
          </Button>
       </div>
    </form>
  );
}

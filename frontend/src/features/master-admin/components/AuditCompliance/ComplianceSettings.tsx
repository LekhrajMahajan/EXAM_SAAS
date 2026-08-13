import React, { useState, useEffect } from 'react';
import { useComplianceSettings, useUpdateComplianceSettings } from '../../hooks/security.hooks';
import type { ICompliancePolicy, IComplianceFramework } from '../../types/security.types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Loader2, Save, ShieldCheck, Database, FileText } from 'lucide-react';

export const ComplianceSettings: React.FC = () => {
  const { data: settingsData, isLoading } = useComplianceSettings();
  const updateSettings = useUpdateComplianceSettings();

  const [settings, setSettings] = useState<ICompliancePolicy | null>(null);

  useEffect(() => {
    if (settingsData?.data) {
      setSettings(settingsData.data);
    }
  }, [settingsData]);

  if (isLoading || !settings) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const handleFrameworkToggle = (frameworkName: string, checked: boolean) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        frameworks: prev.frameworks.map((fw) =>
          fw.name === frameworkName ? { ...fw, enabled: checked } : fw
        ),
      };
    });
  };

  const handleSave = () => {
    if (settings) {
      updateSettings.mutate({ data: settings });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Compliance Frameworks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              Compliance Frameworks
            </CardTitle>
            <CardDescription>
              Enable security compliance standards for auditing and reporting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.frameworks.map((fw) => (
              <div key={fw.name} className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-medium text-sm">{fw.name}</h4>
                  <p className="text-xs text-slate-500">Score: {fw.score}%</p>
                </div>
                <Switch 
                  checked={fw.enabled} 
                  onCheckedChange={(c) => handleFrameworkToggle(fw.name, c)} 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              Data Retention & Cleanup
            </CardTitle>
            <CardDescription>
              Configure how long audit logs and security records are kept.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <Label>Retention Period (Days)</Label>
              <Input 
                type="number" 
                value={settings.retentionDays} 
                onChange={(e) => setSettings({ ...settings, retentionDays: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-slate-500">Logs older than this will be processed based on cleanup rules.</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Cleanup</Label>
                <p className="text-xs text-slate-500">Automatically delete expired logs</p>
              </div>
              <Switch 
                checked={settings.autoCleanup} 
                onCheckedChange={(c) => setSettings({ ...settings, autoCleanup: c })} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Export Before Deletion</Label>
                <p className="text-xs text-slate-500">Archive logs to secure storage before deleting</p>
              </div>
              <Switch 
                checked={settings.exportBeforeDeletion} 
                onCheckedChange={(c) => setSettings({ ...settings, exportBeforeDeletion: c })} 
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-red-100">
              <div className="space-y-0.5">
                <Label className="text-red-600">Legal Hold</Label>
                <p className="text-xs text-red-500/80">Prevent all data deletion across the platform</p>
              </div>
              <Switch 
                checked={settings.legalHold} 
                onCheckedChange={(c) => setSettings({ ...settings, legalHold: c })} 
                className={settings.legalHold ? 'data-[state=checked]:bg-red-500' : ''}
              />
            </div>

          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={updateSettings.isPending}
          className="gap-2"
        >
          {updateSettings.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Compliance Settings
        </Button>
      </div>
    </div>
  );
};

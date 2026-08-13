import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Database, Shield, CloudUpload, Clock, CheckCircle2, XCircle, 
  RefreshCcw, AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useBackupSettings, 
  useUpdateBackupSettings, 
  useTriggerBackup, 
  useRestoreBackup, 
  useBackupHistory 
} from '../../hooks/system-settings.hooks';
import { SettingCategory, SettingType } from '../../types/system-settings.types';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';

export const BackupSettingsPage = () => {
  const { toast } = useToast();
  
  // Queries
  const { data: backupSettingsData } = useBackupSettings();
  const { data: historyData, isLoading: isLoadingHistory, refetch: refetchHistory } = useBackupHistory();
  
  // Mutations
  const updateSettingsMutation = useUpdateBackupSettings();
  const triggerBackupMutation = useTriggerBackup();
  const restoreBackupMutation = useRestoreBackup();

  // Local State
  const [activeTab, setActiveTab] = useState("configuration");
  const [config, setConfig] = useState({
    BACKUP_COMPRESSION_ENABLED: 'true',
    BACKUP_ENCRYPTION_ENABLED: 'false',
    BACKUP_ENCRYPTION_KEY: '',
  });

  const [restorePassword, setRestorePassword] = useState('');
  const [selectedBackupToRestore, setSelectedBackupToRestore] = useState<string | null>(null);

  const [prevBackupSettingsData, setPrevBackupSettingsData] = useState<any>(null);

  // Initialize config
  if (backupSettingsData !== prevBackupSettingsData) {
    setPrevBackupSettingsData(backupSettingsData);
    if (backupSettingsData?.data) {
      const newConfig = { ...config };
      backupSettingsData.data.forEach((setting: any) => {
        if (setting.key in newConfig) {
          (newConfig as any)[setting.key] = setting.value;
        }
      });
      setConfig(newConfig);
    }
  }

  const handleToggle = async (key: string, checked: boolean, title: string) => {
    const value = checked.toString();
    setConfig(prev => ({ ...prev, [key]: value }));
    try {
      const settingsPayload = [{
        key,
        value,
        category: SettingCategory.BACKUP,
        type: SettingType.BOOLEAN,
      }];
      await updateSettingsMutation.mutateAsync(settingsPayload as any);
      toast({ title: "Success", description: `${title} updated successfully.` });
    } catch {
      setConfig(prev => ({ ...prev, [key]: (!checked).toString() }));
      toast({ title: "Error", description: `Failed to update ${title.toLowerCase()}.`, variant: "destructive" });
    }
  };

  const handleBlur = async (key: string, title: string) => {
    const value = (config as any)[key];
    try {
      const settingsPayload = [{
        key,
        value,
        category: SettingCategory.BACKUP,
        type: SettingType.STRING,
      }];
      await updateSettingsMutation.mutateAsync(settingsPayload as any);
      toast({ title: "Success", description: `${title} updated successfully.` });
    } catch {
      toast({ title: "Error", description: `Failed to update ${title.toLowerCase()}.`, variant: "destructive" });
    }
  };

  const handleConfigChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleTriggerBackup = async () => {
    try {
      await triggerBackupMutation.mutateAsync();
      toast({
        title: "Backup Triggered",
        description: "A new database backup has been queued and will start shortly.",
      });
      refetchHistory();
    } catch (error: any) {
      toast({
        title: "Backup Failed",
        description: error.message || "Could not trigger backup.",
        variant: "destructive",
      });
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackupToRestore || !restorePassword) return;

    try {
      await restoreBackupMutation.mutateAsync({ 
        backupId: selectedBackupToRestore, 
        password: restorePassword 
      });
      toast({
        title: "Restore Triggered",
        description: "The restore process has been queued. System may be temporarily unavailable.",
      });
      setSelectedBackupToRestore(null);
      setRestorePassword('');
    } catch (error: any) {
      toast({
        title: "Restore Failed",
        description: error.message || "Failed to initiate restore.",
        variant: "destructive",
      });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (!ms) return 'N/A';
    return (ms / 1000).toFixed(2) + 's';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Backup & Restore</h1>
        <p className="text-muted-foreground">
          Manage automated backups, storage options, encryption, and system restoration.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="manual">Manual Backup</TabsTrigger>
          <TabsTrigger value="history">Backup History</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Backup Security
              </CardTitle>
              <CardDescription>
                Configure encryption and compression for your backups.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Compression</Label>
                  <p className="text-sm text-muted-foreground">
                    Compress backups using gzip to save storage space.
                  </p>
                </div>
                <Switch
                  checked={config.BACKUP_COMPRESSION_ENABLED === 'true'}
                  onCheckedChange={(checked) => handleToggle('BACKUP_COMPRESSION_ENABLED', checked, 'Compression')}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Encryption</Label>
                  <p className="text-sm text-muted-foreground">
                    Encrypt backups using AES-256 for maximum security.
                  </p>
                </div>
                <Switch
                  checked={config.BACKUP_ENCRYPTION_ENABLED === 'true'}
                  onCheckedChange={(checked) => handleToggle('BACKUP_ENCRYPTION_ENABLED', checked, 'Encryption')}
                />
              </div>

              {config.BACKUP_ENCRYPTION_ENABLED === 'true' && (
                <div className="space-y-2">
                  <Label>Encryption Key</Label>
                  <Input
                    type="password"
                    value={config.BACKUP_ENCRYPTION_KEY}
                    onChange={(e) => handleConfigChange('BACKUP_ENCRYPTION_KEY', e.target.value)}
                    onBlur={() => handleBlur('BACKUP_ENCRYPTION_KEY', 'Encryption Key')}
                    placeholder="Enter a secure 32-character encryption key"
                  />
                  <p className="text-sm text-muted-foreground">
                    Warning: If you lose this key, you will not be able to restore your backups.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Manual Database Backup
              </CardTitle>
              <CardDescription>
                Instantly trigger a full backup of the database. The backup will be processed in the background.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleTriggerBackup} disabled={triggerBackupMutation.isPending} className="w-full sm:w-auto">
                <CloudUpload className="mr-2 h-4 w-4" />
                {triggerBackupMutation.isPending ? "Triggering..." : "Trigger Full Backup Now"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Backup History & Restore
                </CardTitle>
                <CardDescription>
                  View past backups and restore the system to a previous state.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetchHistory()}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Size</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Duration</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {isLoadingHistory ? (
                        <tr>
                          <td colSpan={6} className="h-24 text-center">Loading...</td>
                        </tr>
                      ) : historyData?.data?.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="h-24 text-center text-muted-foreground">No backups found.</td>
                        </tr>
                      ) : (
                        historyData?.data?.map((backup: any) => (
                          <tr key={backup._id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">{new Date(backup.createdAt).toLocaleString()}</td>
                            <td className="p-4 align-middle">
                              <Badge variant="outline">{backup.type}</Badge>
                            </td>
                            <td className="p-4 align-middle">
                              {backup.status === 'COMPLETED' ? (
                                <Badge variant="success" className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>
                              ) : backup.status === 'FAILED' ? (
                                <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Failed</Badge>
                              ) : (
                                <Badge variant="secondary"><RefreshCcw className="mr-1 h-3 w-3 animate-spin" /> In Progress</Badge>
                              )}
                            </td>
                            <td className="p-4 align-middle">{formatBytes(backup.size)}</td>
                            <td className="p-4 align-middle">{formatDuration(backup.duration)}</td>
                            <td className="p-4 align-middle text-right">
                              {backup.status === 'COMPLETED' && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="destructive" size="sm" onClick={() => setSelectedBackupToRestore(backup._id)}>
                                      Restore
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2 text-destructive">
                                        <AlertTriangle className="h-5 w-5" />
                                        Critical Action: Restore Database
                                      </DialogTitle>
                                      <DialogDescription>
                                        You are about to restore the database to the state recorded on <strong>{new Date(backup.createdAt).toLocaleString()}</strong>.
                                        This will overwrite all current data. This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label>Confirm Master Admin Password</Label>
                                        <Input
                                          type="password"
                                          placeholder="Enter your password to confirm"
                                          value={restorePassword}
                                          onChange={(e) => setRestorePassword(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => { setSelectedBackupToRestore(null); setRestorePassword(''); }}>Cancel</Button>
                                      <Button 
                                        variant="destructive" 
                                        onClick={handleRestoreBackup}
                                        disabled={!restorePassword || restoreBackupMutation.isPending}
                                      >
                                        {restoreBackupMutation.isPending ? "Restoring..." : "Yes, Restore Database"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackupSettingsPage;

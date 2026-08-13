import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Button } from '@/shared/components/ui/button';
import { Plus, Plug, Edit2, Trash2, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { useIntegrations, useDeleteIntegration, useTestIntegration, useUpdateIntegration } from '../../hooks/integration.hooks';
import { IntegrationCategory, IntegrationStatus, type IIntegration } from '../../types/integration.types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useCreateIntegration } from '../../hooks/integration.hooks';

export const IntegrationsPage = () => {
  const { data, isLoading } = useIntegrations();
  const { toast } = useToast();
  const deleteMutation = useDeleteIntegration();
  const testMutation = useTestIntegration();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<IIntegration | null>(null);

  const handleTest = async (id: string) => {
    try {
      await testMutation.mutateAsync(id);
      toast({ title: 'Success', description: 'Integration connection tested successfully.' });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: 'Test Failed', description: err.response?.data?.message || 'Failed to verify connection', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this integration?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({ title: 'Success', description: 'Integration deleted.' });
      } catch {
        toast({ title: 'Error', description: 'Failed to delete integration.', variant: 'destructive' });
      }
    }
  };

  const openEdit = (integration: IIntegration) => {
    setEditingIntegration(integration);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingIntegration(null);
    setIsFormOpen(true);
  };

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case IntegrationStatus.ACTIVE: return <Badge className="bg-emerald-500"><CheckCircle2 className="w-3 h-3 mr-1"/> Active</Badge>;
      case IntegrationStatus.INACTIVE: return <Badge variant="secondary">Inactive</Badge>;
      case IntegrationStatus.ERROR: return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1"/> Error</Badge>;
      case IntegrationStatus.PENDING_SETUP: return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1"/> Setup Required</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const integrations = data?.data || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="Dynamic Integrations" 
          description="Manage all system integrations natively." 
        />
        <Button variant="outline" className="gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium" onClick={openCreate}>
           <Plus className="w-4 h-4" /> Add Integration
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
             <Card key={i} className="animate-pulse h-[250px] bg-muted/50 border-dashed border-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {integrations.map((integration: IIntegration) => (
             <Card key={integration._id} className="relative overflow-hidden group">
               <CardHeader className="pb-4">
                 <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-secondary rounded-lg text-primary">
                       <Plug className="w-6 h-6" />
                     </div>
                     <div>
                       <CardTitle className="text-lg">{integration.name}</CardTitle>
                       <CardDescription>{integration.provider} - {integration.category}</CardDescription>
                     </div>
                   </div>
                 </div>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-medium text-muted-foreground">Status</span>
                   {getStatusBadge(integration.status)}
                 </div>
                 {integration.health && (
                    <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Connection</span>
                        <span className={integration.health.connectionStatus === 'ONLINE' ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                          {integration.health.connectionStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Latency</span>
                        <span className="text-foreground">{integration.health.responseTimeMs || 0} ms</span>
                      </div>
                    </div>
                 )}
               </CardContent>
               <CardFooter className="bg-muted/50 border-t border-border p-3 flex justify-end gap-2">
                 <Button variant="outline" size="sm" onClick={() => handleTest(integration._id)} disabled={testMutation.isPending}>
                   <RefreshCw className={`w-4 h-4 mr-1 ${testMutation.isPending ? 'animate-spin' : ''}`} /> Test
                 </Button>
                 <Button variant="outline" size="sm" onClick={() => openEdit(integration)}>
                   <Edit2 className="w-4 h-4 mr-1" /> Edit
                 </Button>
                 <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(integration._id)}>
                   <Trash2 className="w-4 h-4" />
                 </Button>
               </CardFooter>
             </Card>
           ))}
           {integrations.length === 0 && (
             <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border bg-muted/20 rounded-lg">
               <Plug className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
               <h3 className="text-lg font-medium text-foreground">No Integrations Configured</h3>
               <p className="mt-1">Add a new integration to enable dynamic system capabilities.</p>
             </div>
           )}
        </div>
      )}

      {isFormOpen && (
        <IntegrationFormDialog 
          integration={editingIntegration} 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

const IntegrationFormDialog = ({ integration, isOpen, onClose }: { integration: IIntegration | null, isOpen: boolean, onClose: () => void }) => {
  const { toast } = useToast();
  const createMutation = useCreateIntegration();
  const updateMutation = useUpdateIntegration();

  const [formData, setFormData] = useState<Partial<IIntegration>>(
    integration || {
      name: '',
      provider: '',
      category: IntegrationCategory.EMAIL,
      status: IntegrationStatus.ACTIVE,
      restApi: {
        baseUrl: '',
        apiKey: '',
        secret: '',
      }
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('restApi.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        restApi: { ...prev.restApi, [field]: value } as NonNullable<IIntegration['restApi']>
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (integration) {
        await updateMutation.mutateAsync({ id: integration._id, payload: formData });
        toast({ title: 'Success', description: 'Integration updated successfully.' });
      } else {
        await createMutation.mutateAsync(formData);
        toast({ title: 'Success', description: 'Integration created successfully.' });
      }
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to save integration', variant: 'destructive' });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{integration ? 'Edit Integration' : 'Add Integration'}</DialogTitle>
          <DialogDescription>Configure details for the integration.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input name="name" value={formData.name || ''} onChange={handleChange} placeholder="e.g. Primary Email SMTP" />
            </div>
            <div className="space-y-2">
              <Label>Provider</Label>
              <Input name="provider" value={formData.provider || ''} onChange={handleChange} placeholder="e.g. SendGrid, AWS, Custom" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  {Object.values(IntegrationCategory).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                <SelectContent>
                  {Object.values(IntegrationStatus).map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border border-border rounded-md p-4 space-y-4 bg-muted/50 mt-4">
            <h4 className="font-medium text-sm text-foreground">API Credentials / Connection Details</h4>
            <div className="space-y-2">
              <Label>Base URL / Host</Label>
              <Input name="restApi.baseUrl" value={formData.restApi?.baseUrl || ''} onChange={handleChange} placeholder="e.g. smtp.gmail.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>API Key / Username</Label>
                <Input name="restApi.apiKey" value={formData.restApi?.apiKey || ''} onChange={handleChange} placeholder="Enter API Key or Username" />
              </div>
              <div className="space-y-2">
                <Label>Secret / Password</Label>
                <Input type="password" name="restApi.secret" value={formData.restApi?.secret || ''} onChange={handleChange} placeholder="Enter Secret or Password" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Request Timeout / Port</Label>
              <Input type="number" name="restApi.requestTimeout" value={formData.restApi?.requestTimeout || ''} onChange={handleChange} placeholder="e.g. 587 (Port) or 5000 (ms)" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="outline" className="border-border hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium" onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Configuration'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

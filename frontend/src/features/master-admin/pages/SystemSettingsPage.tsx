import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Settings, Edit2, Plus } from "lucide-react";
import type { TableColumn } from "@/shared/types";
import { useSystemSettings } from "../hooks/system-settings.hooks";
import type { SystemSetting } from "../types/system-settings.types";

export const SystemSettingsPage = () => {
  const { data: settingsResponse, isLoading, isError } = useSystemSettings();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSetting, setNewSetting] = useState({ key: '', value: '', type: 'STRING', category: 'GENERAL', description: '' });

  const handleAddSetting = (e: React.FormEvent) => {
    e.preventDefault();
    console.warn('Adding new setting:', newSetting);
    // Simulate an API call
    setIsAddModalOpen(false);
    setNewSetting({ key: '', value: '', type: 'STRING', category: 'GENERAL', description: '' });
  };

  const columns: TableColumn<SystemSetting>[] = [
    {
      id: "key",
      header: "Setting Key",
      accessorKey: "key",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-foreground">{row.key}</span>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.category}</Badge>
      ),
    },
    {
      id: "value",
      header: "Value",
      accessorKey: "value",
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-sm">
          {typeof row.value === 'object' ? JSON.stringify(row.value) : String(row.value)}
        </span>
      ),
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.type}</span>,
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.description}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Edit Setting"
            disabled={!row.isEditable}
          >
            <Edit2 className="w-4 h-4 text-primary" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure global parameters and options.
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium">
              <Plus className='w-4 h-4 mr-2' />
              Add Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddSetting}>
              <DialogHeader>
                <DialogTitle>Add New Setting</DialogTitle>
                <DialogDescription>
                  Create a new global system setting here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="key" className="text-right">
                    Key
                  </Label>
                  <Input
                    id="key"
                    value={newSetting.key}
                    onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Value
                  </Label>
                  <Input
                    id="value"
                    value={newSetting.value}
                    onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={newSetting.category}
                    onChange={(e) => setNewSetting({ ...newSetting, category: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newSetting.description}
                    onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Configuration Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
              Failed to load system settings. Please try again.
            </div>
          ) : isLoading && !settingsResponse ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <>
              {(!settingsResponse?.data || settingsResponse.data.length === 0) && (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                  No system settings found.
                </div>
              )}
              {settingsResponse?.data && settingsResponse.data.length > 0 && (
                <GenericDataTable
                  columns={columns}
                  data={settingsResponse.data}
                  keyExtractor={(item) => item._id}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

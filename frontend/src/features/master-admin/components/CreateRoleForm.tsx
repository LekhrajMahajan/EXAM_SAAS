import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";

import { createRoleSchema, type CreateRoleFormValues } from "../schemas/role.schema";
import { useRoles } from "../hooks/role.hooks";

interface CreateRoleFormProps {
  onSubmit: (values: CreateRoleFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: Partial<CreateRoleFormValues> & { isSystem?: boolean };
}

export const CreateRoleForm = ({ onSubmit, isSubmitting, onCancel, isEditing, initialData }: CreateRoleFormProps) => {
  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: initialData?.name || "",
      displayName: initialData?.displayName || "",
      roleCode: initialData?.roleCode || "",
      description: initialData?.description || "",
      parentRole: initialData?.parentRole || "none",
      hierarchyLevel: initialData?.hierarchyLevel || 0,
      roleType: initialData?.roleType || "CUSTOM",
      category: initialData?.category || "CUSTOM",
      priority: initialData?.priority !== undefined ? initialData.priority : 50,
      color: initialData?.color || "#3b82f6",
      icon: initialData?.icon || "ShieldCheck",
      isSystem: initialData?.isSystem || false,
      status: initialData?.status || "ACTIVE",
    },
  });

  const { data: rolesResponse } = useRoles({ limit: 100, page: 1 });
  const allRoles = rolesResponse?.data || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-sm md:col-span-2">
            <CardContent className="p-6 space-y-6">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
                <p className="text-sm text-slate-500">Essential details for the role.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. DATA_ENTRY_OPERATOR" 
                          {...field} 
                          disabled={isEditing && initialData?.isSystem}
                        />
                      </FormControl>
                      <FormDescription>Internal unique identifier (will be uppercase)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roleCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Code <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. DEO" 
                          {...field} 
                          disabled={isEditing && initialData?.isSystem}
                        />
                      </FormControl>
                      <FormDescription>Short unique code for the role</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Display Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Data Entry Operator" {...field} />
                      </FormControl>
                      <FormDescription>User-friendly name shown in the UI</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the responsibilities of this role..." 
                          className="resize-none h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm md:col-span-2">
            <CardContent className="p-6 space-y-6">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Hierarchy & Settings</h3>
                <p className="text-sm text-slate-500">Configure role relations and system properties.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="parentRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value || "none"}
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None (Top Level)</SelectItem>
                          {allRoles.map((r) => (
                            <SelectItem key={r._id} value={r._id}>
                              {r.displayName} ({r.roleCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Role that this role reports to</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hierarchyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hierarchy Level</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Numeric level in organization (0 is highest)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isSystem"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isEditing}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          System Role
                        </FormLabel>
                        <FormDescription>
                          System roles cannot be deleted and have protected permissions.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm md:col-span-2">
            <CardContent className="p-6 space-y-6">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Enterprise Styling & Categorization</h3>
                <p className="text-sm text-slate-500">Define visual tags, badges, and priority precedence for enterprise multi-tenancy.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PLATFORM">Platform</SelectItem>
                          <SelectItem value="COMPANY">Company Administration</SelectItem>
                          <SelectItem value="OPERATIONAL">Operational / Staff</SelectItem>
                          <SelectItem value="CANDIDATE">Candidate / Student</SelectItem>
                          <SelectItem value="CUSTOM">Custom Role</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Broad functional grouping</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Type Identifier</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. STAFF or CUSTOM" {...field} />
                      </FormControl>
                      <FormDescription>Functional classification tag</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority Index</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Lower numbers indicate higher precedence</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme Badge Color</FormLabel>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={field.value || "#3b82f6"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border p-0.5"
                        />
                        <FormControl>
                          <Input placeholder="#3b82f6" {...field} />
                        </FormControl>
                      </div>
                      <FormDescription>Hex color for role badge in UI</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Name</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ShieldCheck">Shield Check (Default/Admin)</SelectItem>
                          <SelectItem value="Building">Building (Corporate)</SelectItem>
                          <SelectItem value="Briefcase">Briefcase (Manager/Staff)</SelectItem>
                          <SelectItem value="GraduationCap">Graduation Cap (Instructor/Student)</SelectItem>
                          <SelectItem value="Users">Users (Group/Sales)</SelectItem>
                          <SelectItem value="Folder">Folder (Resources/Finance)</SelectItem>
                          <SelectItem value="Settings">Settings (Tech Support)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Icon badge displayed on role cards</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end gap-4 mt-8 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Role"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

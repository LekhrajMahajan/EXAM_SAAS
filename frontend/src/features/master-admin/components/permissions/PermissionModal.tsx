import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  ShieldCheck,
  Lock,
  Globe,
  Route as RouteIcon,
  Server,
  Layers,
  Info,
  Loader2,
} from "lucide-react";

import type { Permission, PermissionGroup, PermissionCategory } from "../../types/permission.types";
import {
  GROUPS_LIST,
  MODULES_LIST,
  ACTIONS_LIST,
  CATEGORIES_LIST,
  HTTP_METHODS_LIST,
} from "../../types/permission.types";
import { useCreatePermission, useUpdatePermission } from "../../hooks/permission.hooks";

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission?: Permission | null;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  permission = null,
}) => {
  const isSystemView = Boolean(permission && (permission.isSystem || permission.isSystemPermission));
  const isEditMode = Boolean(permission && !permission.isSystem && !permission.isSystemPermission);

  // Initializing state directly from props since component is remounted via key when opened/changed
  const [displayName, setDisplayName] = useState(() => permission?.displayName ?? "");
  const [permissionKey, setPermissionKey] = useState(() => permission?.permissionKey ?? permission?.name ?? "");
  const [moduleName, setModuleName] = useState(() => permission?.module ?? "EXAM");
  const [group, setGroup] = useState<PermissionGroup>(() => (permission?.group as PermissionGroup) ?? "Exam");
  const [action, setAction] = useState(() => permission?.action ?? "VIEW");
  const [category, setCategory] = useState<PermissionCategory>(() => (permission?.category as PermissionCategory) ?? "CORE");
  const [resource, setResource] = useState(() => permission?.resource ?? (permission?.permissionKey ? permission.permissionKey.split(".")[0] : "exams"));
  const [apiEndpoint, setApiEndpoint] = useState(() => permission?.apiEndpoint ?? "/api/v1/exams");
  const [httpMethod, setHttpMethod] = useState(() => permission?.httpMethod ?? "GET");
  const [frontendRoute, setFrontendRoute] = useState(() => permission?.frontendRoute ?? "/company/exams");
  const [description, setDescription] = useState(() => permission?.description ?? "");
  const [sortOrder, setSortOrder] = useState<number>(() => permission?.sortOrder ?? 10);

  const { mutateAsync: createPerm, isPending: isCreating } = useCreatePermission();
  const { mutateAsync: updatePerm, isPending: isUpdating } = useUpdatePermission();
  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSystemView) return;

    const payload = {
      displayName,
      permissionKey: permissionKey.trim() || undefined,
      name: permissionKey.trim() || undefined,
      module: moduleName,
      group,
      action,
      category,
      resource: resource.trim() || undefined,
      apiEndpoint: apiEndpoint.trim() || undefined,
      httpMethod,
      frontendRoute: frontendRoute.trim() || undefined,
      description: description.trim() || undefined,
      sortOrder: Number(sortOrder) || 10,
    };

    if (isEditMode && permission?._id) {
      await updatePerm({ id: permission._id, payload });
    } else {
      await createPerm(payload);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isSystemView ? (
              <div className="p-2 rounded-full bg-amber-100 text-amber-700">
                <Lock className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
            <div>
              <DialogTitle className="text-xl font-bold">
                {isSystemView
                  ? "System Permission Details (Immutable)"
                  : isEditMode
                  ? "Edit Custom Permission"
                  : "Create New Permission"}
              </DialogTitle>
              <DialogDescription>
                {isSystemView
                  ? "Built-in core RBAC security registry definition. Enterprise system permissions cannot be modified or deleted."
                  : "Define granular access control rules, API endpoint bindings, and UI module routing."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          {/* Top Row: Display Name & Permission Key */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="displayName" className="font-semibold text-sm">
                Display Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="displayName"
                placeholder="e.g. View All Exams"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isSystemView}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="permissionKey" className="font-semibold text-sm">
                Permission Key (Identifier)
              </Label>
              <Input
                id="permissionKey"
                placeholder="e.g. exams.view (auto-created if blank)"
                value={permissionKey}
                onChange={(e) => setPermissionKey(e.target.value.toLowerCase())}
                disabled={isSystemView}
                className="mt-1.5 font-mono text-xs bg-slate-50"
              />
            </div>
          </div>

          {/* Group, Module, Action, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <Label className="font-semibold text-xs text-slate-600">Group Area</Label>
              {isSystemView ? (
                <div className="mt-1 font-bold text-sm text-slate-800">{group}</div>
              ) : (
                <Select value={group} onValueChange={(val) => setGroup(val as PermissionGroup)}>
                  <SelectTrigger className="mt-1.5 bg-white">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {GROUPS_LIST.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label className="font-semibold text-xs text-slate-600">Module</Label>
              {isSystemView ? (
                <div className="mt-1 font-bold text-sm text-slate-800">{moduleName}</div>
              ) : (
                <Select value={moduleName} onValueChange={(val) => setModuleName(val)}>
                  <SelectTrigger className="mt-1.5 bg-white">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {MODULES_LIST.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label className="font-semibold text-xs text-slate-600">Action Type</Label>
              {isSystemView ? (
                <div className="mt-1">
                  <Badge variant="outline" className="font-mono font-bold text-xs bg-blue-50 text-blue-700">
                    {action}
                  </Badge>
                </div>
              ) : (
                <Select value={action} onValueChange={(val) => setAction(val)}>
                  <SelectTrigger className="mt-1.5 bg-white font-mono text-xs">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {ACTIONS_LIST.map((act) => (
                      <SelectItem key={act} value={act} className="font-mono">
                        {act}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label className="font-semibold text-xs text-slate-600">Category</Label>
              {isSystemView ? (
                <div className="mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                </div>
              ) : (
                <Select value={category} onValueChange={(val) => setCategory(val as PermissionCategory)}>
                  <SelectTrigger className="mt-1.5 bg-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES_LIST.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Technical Bindings: Endpoint, HTTP Method, Route */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-500" />
              API & Frontend Routing Bindings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="apiEndpoint" className="font-medium text-xs text-slate-600">
                  Backend API Endpoint Pattern
                </Label>
                <div className="relative mt-1">
                  <Globe className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                  <Input
                    id="apiEndpoint"
                    placeholder="/api/v1/resource"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    disabled={isSystemView}
                    className="pl-9 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="font-medium text-xs text-slate-600">HTTP Verb</Label>
                {isSystemView ? (
                  <div className="mt-1.5 font-mono text-xs font-bold text-purple-700 bg-purple-50 px-3 py-2 rounded border border-purple-200 inline-block">
                    {httpMethod}
                  </div>
                ) : (
                  <Select value={httpMethod} onValueChange={(val) => setHttpMethod(val)}>
                    <SelectTrigger className="mt-1 font-mono text-xs bg-white">
                      <SelectValue placeholder="HTTP Verb" />
                    </SelectTrigger>
                    <SelectContent>
                      {HTTP_METHODS_LIST.map((m) => (
                        <SelectItem key={m} value={m} className="font-mono">
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frontendRoute" className="font-medium text-xs text-slate-600">
                  Frontend UI Route Pattern
                </Label>
                <div className="relative mt-1">
                  <RouteIcon className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                  <Input
                    id="frontendRoute"
                    placeholder="/company/resource"
                    value={frontendRoute}
                    onChange={(e) => setFrontendRoute(e.target.value)}
                    disabled={isSystemView}
                    className="pl-9 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="resource" className="font-medium text-xs text-slate-600">
                  Resource Identifier
                </Label>
                <div className="relative mt-1">
                  <Layers className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                  <Input
                    id="resource"
                    placeholder="e.g. exams, candidates"
                    value={resource}
                    onChange={(e) => setResource(e.target.value)}
                    disabled={isSystemView}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description & Sort Order */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <Label htmlFor="description" className="font-semibold text-sm">
                Description & Purpose
              </Label>
              <Textarea
                id="description"
                placeholder="Explain what access rights this permission grants..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSystemView}
                className="mt-1.5 text-xs min-h-[72px]"
              />
            </div>

            <div>
              <Label htmlFor="sortOrder" className="font-semibold text-sm">
                Sort Priority
              </Label>
              <Input
                id="sortOrder"
                type="number"
                min={1}
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 10)}
                disabled={isSystemView}
                className="mt-1.5"
              />
              <p className="text-[11px] text-slate-400 mt-1">Lower values display first in lists.</p>
            </div>
          </div>

          {isSystemView && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <Info className="w-5 h-5 shrink-0 text-amber-600" />
              <div>
                <strong>Immutable System Definition:</strong> Because this permission is hardened into the core platform, Master Admins can view its metadata but cannot edit or delete it to guarantee security compliance and prevent lockout.
              </div>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {isSystemView ? "Close" : "Cancel"}
            </Button>
            {!isSystemView && (
              <Button type="submit" variant="default" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Save Changes"
                ) : (
                  "Create Permission"
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import React, { useState, useMemo } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, Shield, ShieldCheck, Key, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useRoles } from "../hooks/role.hooks";
import type { Role } from "../types/role.types";
import { ChangeParentDialog } from "../components/roles/ChangeParentDialog";
import { cn } from "@/utils/cn";

// Helper to get parent ID robustly
const getParentId = (parentRole: unknown): string | undefined => {
  if (typeof parentRole === 'object' && parentRole !== null) {
    return (parentRole as { _id?: string })._id;
  }
  return parentRole as string | undefined;
};

interface TreeNodeProps {
  role: Role;
  childrenMap: Map<string, Role[]>;
  depth: number;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onEditParent: (role: Role) => void;
  searchTerm: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  role, 
  childrenMap, 
  depth, 
  expandedIds, 
  onToggleExpand, 
  onEditParent,
  searchTerm
}) => {
  const children = childrenMap.get(role._id) || [];
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(role._id) || searchTerm.length > 0; // auto-expand if searching

  const navigate = useNavigate();

  // Basic search highlight
  const matchesSearch = searchTerm && role.displayName.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <div className="flex flex-col">
      <div 
        className={cn(
          "flex items-center gap-3 p-3 border-b hover:bg-slate-50 transition-colors group",
          matchesSearch && "bg-blue-50/50"
        )}
      >
        {/* Indentation spacing */}
        <div style={{ width: `${depth * 32}px` }} className="shrink-0 flex justify-end">
          {depth > 0 && <div className="w-px h-full bg-slate-200 mr-4" />}
        </div>

        {/* Expand/Collapse Button */}
        <div className="w-6 h-6 shrink-0 flex items-center justify-center">
          {hasChildren ? (
            <button 
              onClick={() => onToggleExpand(role._id)}
              className="p-1 hover:bg-slate-200 rounded-md text-slate-500"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-4 h-4 bg-slate-200 rounded-full scale-[0.3]" />
          )}
        </div>

        {/* Role Icon */}
        <div className={cn("p-2 rounded-lg shrink-0", role.isSystem ? "bg-red-100" : "bg-primary/10")}>
          {role.isSystem ? <ShieldCheck className="w-4 h-4 text-red-600" /> : <Shield className="w-4 h-4 text-primary" />}
        </div>

        {/* Role Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 truncate">{role.displayName}</span>
            {role.isSystem && <Badge variant="secondary" className="text-xs bg-red-50 text-red-700 border-red-200">System</Badge>}
            <Badge variant="outline" className="text-xs font-mono">{role.roleCode}</Badge>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1"><Key className="w-3 h-3"/> {role.permissions?.length || 0} Permissions</span>
            {/* Note: In a real app we'd fetch actual assigned user counts per role here if API supports it */}
          </div>
        </div>

        {/* Actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/master-admin/access-management/roles/${role._id}`)}>
            View Details
          </Button>
          {!role.isSystem && (
            <Button variant="outline" size="sm" onClick={() => onEditParent(role)}>
              Change Parent
            </Button>
          )}
        </div>
      </div>

      {/* Children recursive rendering */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col">
          {children.map(child => (
            <TreeNode 
              key={child._id}
              role={child}
              childrenMap={childrenMap}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onEditParent={onEditParent}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const RoleHierarchyPage = () => {
  const navigate = useNavigate();
  const { data: rolesResponse, isLoading, isError, refetch, isFetching } = useRoles({ limit: 1000 });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const roles = useMemo(() => rolesResponse?.data || [], [rolesResponse]);

  // Build Hierarchy Data Structures
  const { rootRoles, childrenMap } = useMemo(() => {
    const rRoles: Role[] = [];
    const cMap = new Map<string, Role[]>();

    roles.forEach(role => {
      const parentId = getParentId(role.parentRole);
      if (!parentId) {
        rRoles.push(role);
      } else {
        const existing = cMap.get(parentId) || [];
        cMap.set(parentId, [...existing, role]);
      }
    });

    return { rootRoles: rRoles, childrenMap: cMap };
  }, [roles]);

  const handleToggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExpandAll = () => {
    const allParentIds = Array.from(childrenMap.keys());
    setExpandedIds(new Set(allParentIds));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <Skeleton className="h-24 w-1/3" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4 ml-8" />
            <Skeleton className="h-12 w-1/2 ml-16" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto space-y-4 p-6">
        <Button variant="ghost" onClick={() => navigate("/master-admin/access-management?tab=roles")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roles
        </Button>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>We couldn&apos;t fetch the role hierarchy.</AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/master-admin/access-management?tab=roles")}>
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Role Hierarchy</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage organization structure and permission inheritance.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2 max-w-sm w-full">
            <Input 
              placeholder="Search roles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExpandAll}>Expand All</Button>
            <Button variant="outline" size="sm" onClick={handleCollapseAll}>Collapse All</Button>
          </div>
        </CardHeader>
        <div className="flex flex-col bg-white min-h-[400px]">
          {rootRoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No Role Hierarchy Available</h3>
              <p className="mt-1">Create some roles to build your organization structure.</p>
            </div>
          ) : (
            rootRoles.map(rootRole => (
              <TreeNode 
                key={rootRole._id}
                role={rootRole}
                childrenMap={childrenMap}
                depth={0}
                expandedIds={expandedIds}
                onToggleExpand={handleToggleExpand}
                onEditParent={(r) => setEditingRole(r)}
                searchTerm={searchTerm}
              />
            ))
          )}
        </div>
      </Card>

      {/* Change Parent Dialog */}
      <ChangeParentDialog 
        role={editingRole}
        allRoles={roles}
        open={!!editingRole}
        onOpenChange={(open) => !open && setEditingRole(null)}
      />
    </div>
  );
};

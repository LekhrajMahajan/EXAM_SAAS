import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/components/ui/table";
import { Search, ChevronDown, ChevronRight, ShieldCheck, Lock, Loader2, RefreshCw, CheckSquare } from "lucide-react";
import { usePermissionMatrix } from '../../hooks/permission.hooks';
import { useAssignPermissions } from '../../hooks/role.hooks';

interface MatrixRole {
  _id?: string;
  id?: string;
  name?: string;
  displayName?: string;
  roleCode?: string;
  isSystem?: boolean;
  systemRole?: boolean;
  [key: string]: unknown;
}

interface MatrixPermission {
  _id?: string;
  id?: string;
  name?: string;
  displayName?: string;
  permissionKey?: string;
  module?: string;
  description?: string;
  isLockedBySubscription?: boolean;
  lockedReason?: string;
}

export interface RolePermissionMatrixGridProps {
  companyId?: string;
  onMatrixChange?: () => void;
}

export const RolePermissionMatrixGrid: React.FC<RolePermissionMatrixGridProps> = ({ companyId, onMatrixChange }) => {
  const { data: matrixResponse, isLoading, isError, refetch, isFetching } = usePermissionMatrix(companyId);
  const { mutateAsync: assignPermissions, isPending: isAssigning } = useAssignPermissions();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [localMatrix, setLocalMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  const rawData = matrixResponse?.data;
  const roles = useMemo(() => (rawData?.roles as MatrixRole[]) || [], [rawData?.roles]);
  const permissions = useMemo(() => (rawData?.permissions as MatrixPermission[]) || [], [rawData?.permissions]);
  const serverMatrix = useMemo(() => rawData?.matrix || {}, [rawData?.matrix]);

  // Sync server matrix to local optimistic state
  useEffect(() => {
    if (serverMatrix && Object.keys(serverMatrix).length > 0) {
      queueMicrotask(() => {
        setLocalMatrix(serverMatrix);
      });
    }
  }, [serverMatrix]);

  // Group permissions by module/category
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, MatrixPermission[]> = {};
    permissions.forEach(p => {
      const moduleName = p.module || "General / System";
      if (!groups[moduleName]) {
        groups[moduleName] = [];
      }
      groups[moduleName].push(p);
    });
    return groups;
  }, [permissions]);

  // Filter categories by search term
  const filteredCategories = useMemo(() => {
    const sortedKeys = Object.keys(groupedPermissions).sort();
    if (!searchTerm.trim()) return sortedKeys;
    const lowerSearch = searchTerm.toLowerCase();
    return sortedKeys.filter(cat => {
      if (cat.toLowerCase().includes(lowerSearch)) return true;
      const catPerms = groupedPermissions[cat] || [];
      return catPerms.some(p => 
        (p.displayName && p.displayName.toLowerCase().includes(lowerSearch)) ||
        (p.name && p.name.toLowerCase().includes(lowerSearch)) ||
        (p.permissionKey && p.permissionKey.toLowerCase().includes(lowerSearch)) ||
        (p.description && p.description.toLowerCase().includes(lowerSearch))
      );
    });
  }, [groupedPermissions, searchTerm]);

  // Expand all categories by default once loaded
  useEffect(() => {
    if (Object.keys(groupedPermissions).length > 0 && expandedCategories.size === 0) {
      queueMicrotask(() => {
        setExpandedCategories(new Set(Object.keys(groupedPermissions)));
      });
    }
  }, [groupedPermissions, expandedCategories.size]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const toggleAllCategories = () => {
    if (expandedCategories.size === filteredCategories.length) {
      setExpandedCategories(new Set());
    } else {
      setExpandedCategories(new Set(filteredCategories));
    }
  };

  const handleCheckboxToggle = async (roleId: string, permissionId: string) => {
    if (!roleId || !permissionId) return;
    setUpdatingRoleId(roleId);

    const currentRolePerms = localMatrix[roleId] ? { ...localMatrix[roleId] } : {};
    const currentlySelected = currentRolePerms[permissionId] || false;
    const newStatus = !currentlySelected;

    // Optimistic UI Update without mutating state objects directly
    const updatedRolePerms = { ...currentRolePerms, [permissionId]: newStatus };
    setLocalMatrix(prev => ({
      ...prev,
      [roleId]: updatedRolePerms,
    }));

    // Gather all active permission IDs for this role
    const newActivePermIds = Object.entries(updatedRolePerms)
      .filter(([, active]) => active === true)
      .map(([pId]) => pId);

    try {
      await assignPermissions({ id: roleId, permissions: newActivePermIds });
      if (onMatrixChange) onMatrixChange();
    } catch {
      // Revert optimistic update on failure with a fresh object instead of mutating
      const revertedRolePerms = { ...currentRolePerms, [permissionId]: currentlySelected };
      setLocalMatrix(prev => ({
        ...prev,
        [roleId]: revertedRolePerms,
      }));
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleSelectAllForRole = async (role: MatrixRole) => {
    const roleId = role._id || role.id;
    if (!roleId) return;
    setUpdatingRoleId(roleId);

    // Filter out subscription locked permissions
    const validPermIds = permissions
      .filter(p => !p.isLockedBySubscription)
      .map(p => p._id || p.id)
      .filter((id): id is string => !!id);

    const newMap: Record<string, boolean> = {};
    validPermIds.forEach(id => { newMap[id] = true; });

    setLocalMatrix(prev => ({
      ...prev,
      [roleId]: newMap,
    }));

    try {
      await assignPermissions({ id: roleId, permissions: validPermIds });
      if (onMatrixChange) onMatrixChange();
    } catch {
      if (serverMatrix) setLocalMatrix(serverMatrix);
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleClearAllForRole = async (role: MatrixRole) => {
    const roleId = role._id || role.id;
    if (!roleId) return;
    setUpdatingRoleId(roleId);

    setLocalMatrix(prev => ({
      ...prev,
      [roleId]: {},
    }));

    try {
      await assignPermissions({ id: roleId, permissions: [] });
      if (onMatrixChange) onMatrixChange();
    } catch {
      if (serverMatrix) setLocalMatrix(serverMatrix);
    } finally {
      setUpdatingRoleId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-16 space-x-3 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="font-medium">Loading interactive permission matrix...</span>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full border-rose-200 bg-rose-50/50">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="p-3 mb-3 text-rose-600 bg-rose-100 rounded-full">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Failed to Load Matrix</h3>
          <p className="max-w-md mt-1 text-sm text-slate-600">
            There was an error fetching the organization permission matrix. Please check your network or user permissions.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Retry Fetching
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm border-slate-200">
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold text-slate-900">Enterprise Permission Matrix</CardTitle>
              {isFetching && (
                <span title="Syncing..." className="ml-1 inline-flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                </span>
              )}
            </div>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Interactive 2D visualization across {roles.length} roles and {permissions.length} total system permissions.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute w-4 h-4 text-slate-400 left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search modules or permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm bg-white"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllCategories}
              className="h-9 whitespace-nowrap"
            >
              {expandedCategories.size === filteredCategories.length ? "Collapse All" : "Expand All"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching || isAssigning}
              className="h-9 text-slate-600 hover:text-slate-900"
              title="Refresh Matrix"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-slate-100/80 sticky top-0 z-10 shadow-xs">
            <TableRow>
              <TableHead className="w-[300px] font-bold text-slate-800 px-6 py-4 border-r border-slate-200 min-w-[260px]">
                Module & Permissions ({permissions.length})
              </TableHead>
              {roles.map((role) => {
                const rId = role._id || role.id || "";
                const isSystemProtected = role.isSystem || role.systemRole;
                const isThisUpdating = updatingRoleId === rId;

                return (
                  <TableHead key={rId} className="px-4 py-4 text-center min-w-[170px] border-r border-slate-200 align-top">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="flex items-center gap-1 font-semibold text-slate-900 text-sm">
                        <span>{role.displayName || role.name}</span>
                        {isSystemProtected && (
                          <span title="Protected System Role (Immutable Admin Capabilities)">
                            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                          </span>
                        )}
                      </div>

                      {isSystemProtected ? (
                        <Badge variant="secondary" className="text-[11px] bg-amber-100 text-amber-800 font-medium px-2 py-0">
                          Protected Role
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-1 mt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isThisUpdating || isAssigning}
                            onClick={() => handleSelectAllForRole(role)}
                            className="h-6 px-2 text-[11px] text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                            title="Assign all unlocked permissions to this role"
                          >
                            <CheckSquare className="w-3 h-3 mr-1" /> All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isThisUpdating || isAssigning}
                            onClick={() => handleClearAllForRole(role)}
                            className="h-6 px-2 text-[11px] text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                            title="Remove all permissions from this role"
                          >
                            Clear
                          </Button>
                        </div>
                      )}
                      {isThisUpdating && (
                        <span className="text-[10px] text-indigo-600 animate-pulse font-semibold">Saving...</span>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-200">
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={roles.length + 1} className="p-12 text-center text-slate-500">
                  No permissions match your current search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => {
                const isExpanded = expandedCategories.has(category);
                const categoryPerms = groupedPermissions[category] || [];
                const matchedPerms = !searchTerm.trim() ? categoryPerms : categoryPerms.filter(p =>
                  (p.displayName && p.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (p.permissionKey && p.permissionKey.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  category.toLowerCase().includes(searchTerm.toLowerCase())
                );

                return (
                  <React.Fragment key={category}>
                    {/* Category Header Row */}
                    <TableRow
                      onClick={() => toggleCategory(category)}
                      className="bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors font-medium select-none"
                    >
                      <TableCell colSpan={roles.length + 1} className="px-6 py-3 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-indigo-600 shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="text-slate-900 font-bold text-sm tracking-wide uppercase">{category}</span>
                          <Badge variant="outline" className="ml-2 bg-white text-slate-600 text-xs px-2 py-0.5">
                            {matchedPerms.length} {matchedPerms.length === 1 ? "Permission" : "Permissions"}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Permissions rows under category */}
                    {isExpanded && matchedPerms.map((perm) => {
                      const pId = perm._id || perm.id || "";
                      const isLocked = !!perm.isLockedBySubscription;

                      return (
                        <TableRow key={pId} className="hover:bg-slate-50/70 transition-colors">
                          <TableCell className="px-8 py-3.5 border-r border-slate-200 align-middle">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800 text-sm">
                                  {perm.displayName || perm.name || perm.permissionKey}
                                </span>
                                {isLocked && (
                                  <Badge
                                    variant="outline"
                                    className="border-rose-300 bg-rose-50 text-rose-700 gap-1 text-[11px] px-2 py-0 font-normal"
                                    title={perm.lockedReason || "Feature disabled in current plan"}
                                  >
                                    <Lock className="w-3 h-3 text-rose-600" />
                                    <span>Plan Locked</span>
                                  </Badge>
                                )}
                              </div>
                              {perm.description && (
                                <span className="text-xs text-slate-500 mt-0.5 line-clamp-1" title={perm.description}>
                                  {perm.description}
                                </span>
                              )}
                            </div>
                          </TableCell>

                          {roles.map((role) => {
                            const rId = role._id || role.id || "";
                            const isSystemProtected = !!(role.isSystem || role.systemRole);
                            const isChecked = !!(localMatrix[rId] && localMatrix[rId][pId]);
                            const isDisabled = isSystemProtected || isLocked || updatingRoleId === rId || isAssigning;

                            return (
                              <TableCell key={`${rId}-${pId}`} className="px-4 py-3.5 text-center border-r border-slate-100 align-middle">
                                <div className="flex items-center justify-center">
                                  <Checkbox
                                    checked={isChecked}
                                    disabled={isDisabled}
                                    onCheckedChange={() => handleCheckboxToggle(rId, pId)}
                                    className={`w-5 h-5 transition-transform duration-100 ${
                                      isDisabled && isChecked
                                        ? "opacity-60 bg-amber-600 text-white border-amber-600 cursor-not-allowed"
                                        : isDisabled && isLocked
                                        ? "opacity-40 cursor-not-allowed border-rose-300 bg-rose-50"
                                        : "hover:scale-105 cursor-pointer border-slate-400"
                                    }`}
                                  />
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

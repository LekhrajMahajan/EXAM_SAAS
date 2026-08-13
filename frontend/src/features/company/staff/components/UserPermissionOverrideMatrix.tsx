import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import apiClient from "@/core/api/http/axios-client";
import { 
  Loader2, 
  ShieldAlert, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RotateCcw,
  Calendar,
  Layers,
  Lock
} from "lucide-react";

interface EffectivePermissionItem {
  permissionId: string;
  name: string;
  displayName: string;
  module: string;
  action: string;
  description: string;
  status: "GRANTED" | "DENIED" | "INHERITED" | "DEFAULT";
  isGranted: boolean;
  isTemporary: boolean;
  source: string;
  reason?: string;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
  overrideId?: string | null;
  isSystem?: boolean;
}

interface EffectiveMatrixResponse {
  userId: string;
  userName: string;
  roleCode: string;
  companyId: string;
  permissions: EffectivePermissionItem[];
  summary: {
    total: number;
    effectiveGranted: number;
    inheritedCount: number;
    overriddenGrantedCount: number;
    overriddenDeniedCount: number;
    temporaryCount: number;
  };
}

interface UserPermissionOverrideMatrixProps {
  userId: string;
  userName?: string;
}

export const UserPermissionOverrideMatrix: React.FC<UserPermissionOverrideMatrixProps> = ({
  userId,
  userName = "Selected Employee"
}) => {
  const [data, setData] = useState<EffectiveMatrixResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [moduleFilter, setModuleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  // Modal dialog states for Temporary & Bulk overrides
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<"GRANT" | "DENY" | "TEMPORARY" | "REVOKE">("GRANT");
  const [targetPermissionId, setTargetPermissionId] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");
  const [effectiveFrom, setEffectiveFrom] = useState<string>("");
  const [effectiveUntil, setEffectiveUntil] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const reloadMatrix = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/users/${userId}/effective-permissions`);
      if (res.data?.data) {
        setData(res.data.data);
      }
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let isMounted = true;
    const initialFetch = async () => {
      try {
        const res = await apiClient.get(`/users/${userId}/effective-permissions`);
        if (isMounted && res.data?.data) {
          setData(res.data.data);
        }
      } catch {
        if (isMounted) setData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    initialFetch();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleSelectAll = (checked: boolean) => {
    if (checked && data) {
      const allIds = filteredPermissions.filter(p => !p.isSystem).map(p => p.permissionId);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (permId: string) => {
    setSelectedIds((prev) =>
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  const openActionDialog = (mode: "GRANT" | "DENY" | "TEMPORARY" | "REVOKE", permId: string | null = null) => {
    if (!permId && selectedIds.length === 0) {
      alert("Please select at least one permission first.");
      return;
    }
    setDialogMode(mode);
    setTargetPermissionId(permId);
    setReason("");
    setEffectiveFrom("");
    setEffectiveUntil("");
    setShowDialog(true);
  };

  const handleExecuteAction = async () => {
    if (!reason.trim()) {
      alert("A mandatory reason is strictly required for audit & compliance logs.");
      return;
    }
    if (dialogMode === "TEMPORARY" && !effectiveUntil) {
      alert("An expiration date (End Date) is required for temporary overrides.");
      return;
    }

    const permissionIds = targetPermissionId ? [targetPermissionId] : selectedIds;
    setSubmitting(true);

    try {
      if (dialogMode === "REVOKE") {
        await apiClient.delete(`/users/${userId}/permissions`, {
          data: { permissionIds, reason },
        });
      } else {
        const allowed = dialogMode === "GRANT" || (dialogMode === "TEMPORARY" && !targetPermissionId ? true : dialogMode !== "DENY");
        const source = dialogMode === "TEMPORARY" ? (allowed ? "TEMPORARY_GRANT" : "TEMPORARY_DENY") : (allowed ? "PERMANENT_GRANT" : "PERMANENT_DENY");
        
        await apiClient.post(`/users/${userId}/permissions`, {
          permissionIds,
          allowed,
          source,
          reason,
          effectiveFrom: effectiveFrom ? new Date(effectiveFrom).toISOString() : null,
          effectiveUntil: effectiveUntil ? new Date(effectiveUntil).toISOString() : null,
        });
      }

      setShowDialog(false);
      setSelectedIds([]);
      await reloadMatrix();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || "Error applying permission override.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !data) {
    return (
      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        </CardContent>
      </Card>
    );
  }

  const permissions = data?.permissions || [];
  const modules = Array.from(new Set(permissions.map(p => p.module))).sort();
  const actions = ["VIEW", "CREATE", "UPDATE", "DELETE", "MANAGE"];

  const filteredPermissions = permissions.filter((p) => {
    const matchSearch =
      !search ||
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.module.toLowerCase().includes(search.toLowerCase());

    const matchModule = moduleFilter === "ALL" || p.module === moduleFilter;
    const matchAction = actionFilter === "ALL" || p.action === actionFilter;

    let matchStatus = true;
    if (statusFilter === "INHERITED") matchStatus = p.status === "INHERITED";
    else if (statusFilter === "GRANTED") matchStatus = p.status === "GRANTED" && !p.isTemporary;
    else if (statusFilter === "DENIED") matchStatus = p.status === "DENIED" && !p.isTemporary;
    else if (statusFilter === "TEMPORARY") matchStatus = p.isTemporary;

    return matchSearch && matchModule && matchAction && matchStatus;
  });

  const allSelected = filteredPermissions.length > 0 && selectedIds.length === filteredPermissions.filter(p => !p.isSystem).length;

  return (
    <div className="space-y-6">
      {/* KPI & Difference View Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 shadow-lg">
          <div className="text-xs text-slate-400 font-medium uppercase">Effective Role</div>
          <div className="mt-1 text-lg font-bold text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            {data?.roleCode || "EMPLOYEE"}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 shadow-lg">
          <div className="text-xs text-indigo-400 font-medium uppercase">Inherited (Role)</div>
          <div className="mt-1 text-2xl font-black text-indigo-300">
            {data?.summary.inheritedCount || 0}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 shadow-lg">
          <div className="text-xs text-emerald-400 font-medium uppercase">Override Granted</div>
          <div className="mt-1 text-2xl font-black text-emerald-400">
            {data?.summary.overriddenGrantedCount || 0}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/20 shadow-lg">
          <div className="text-xs text-rose-400 font-medium uppercase">Override Denied</div>
          <div className="mt-1 text-2xl font-black text-rose-400">
            {data?.summary.overriddenDeniedCount || 0}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 shadow-lg">
          <div className="text-xs text-amber-400 font-medium uppercase">Temporary Access</div>
          <div className="mt-1 text-2xl font-black text-amber-400">
            {data?.summary.temporaryCount || 0}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-lg">
          <div className="text-xs text-slate-400 font-medium uppercase">Total Allowed</div>
          <div className="mt-1 text-2xl font-black text-white">
            {data?.summary.effectiveGranted || 0} <span className="text-xs text-slate-500 font-normal">/ {permissions.length}</span>
          </div>
        </div>
      </div>

      {/* Main Override Matrix Card */}
      <Card className="border-slate-800 bg-slate-900 shadow-2xl text-white">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <CardTitle className="text-xl flex items-center gap-2.5">
              <ShieldAlert className="h-6 w-6 text-indigo-500" />
              <span>Enterprise User Permission Override Engine</span>
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              Assign high-priority explicit permission overrides for <strong className="text-indigo-300">{userName}</strong> without modifying global role definitions.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-800/80 rounded-lg text-slate-300 border border-slate-700">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Real-Time Resolution: Active</span>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Filters and Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search permission, module or action..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg text-xs px-3 py-2 text-white focus:outline-none"
              >
                <option value="ALL">All Modules</option>
                {modules.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg text-xs px-3 py-2 text-white focus:outline-none"
              >
                <option value="ALL">All States (Difference View)</option>
                <option value="INHERITED">Inherited Only</option>
                <option value="GRANTED">Granted Overrides</option>
                <option value="DENIED">Denied Overrides</option>
                <option value="TEMPORARY">Temporary Overrides</option>
              </select>

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg text-xs px-3 py-2 text-white focus:outline-none"
              >
                <option value="ALL">All Actions</option>
                {actions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bulk Operations Action Bar */}
          {selectedIds.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-200">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                <span>{selectedIds.length} permission(s) selected for bulk override</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => openActionDialog("GRANT")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Bulk Grant
                </Button>
                <Button
                  size="sm"
                  onClick={() => openActionDialog("DENY")}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-8"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1.5" />
                  Bulk Deny
                </Button>
                <Button
                  size="sm"
                  onClick={() => openActionDialog("TEMPORARY")}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs h-8"
                >
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  Bulk Temporary
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openActionDialog("REVOKE")}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs h-8"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Reset to Inherited
                </Button>
              </div>
            </div>
          )}

          {/* Difference View Permissions Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden shadow-inner">
            <Table>
              <TableHeader className="bg-slate-950 border-b border-slate-800">
                <TableRow>
                  <TableHead className="w-12 text-center">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(val) => handleSelectAll(!!val)}
                      aria-label="Select all permissions"
                    />
                  </TableHead>
                  <TableHead className="text-slate-300 font-semibold">Permission & Module</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Action</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Resolution Priority</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Effective State</TableHead>
                  <TableHead className="text-right text-slate-300 font-semibold">Override Controls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {filteredPermissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                      No permissions match your search or filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPermissions.map((item) => {
                    const isSelected = selectedIds.includes(item.permissionId);
                    
                    // Render custom badges for Difference View Highlighting
                    const getStateBadge = () => {
                      if (item.isSystem) {
                        return (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <Lock className="w-3 h-3 mr-1" />
                            System / Protected
                          </span>
                        );
                      }
                      if (item.status === "INHERITED") {
                        return (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Layers className="w-3 h-3 mr-1" />
                            Inherited (Role)
                          </span>
                        );
                      }
                      if (item.isTemporary) {
                        return (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20" title={`Expires: ${item.effectiveUntil}`}>
                            <Clock className="w-3 h-3 mr-1 animate-spin" style={{ animationDuration: "12s" }} />
                            Temporary {item.status === "GRANTED" ? "Grant" : "Deny"}
                          </span>
                        );
                      }
                      if (item.status === "GRANTED") {
                        return (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Explicit Grant
                          </span>
                        );
                      }
                      if (item.status === "DENIED") {
                        return (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle className="w-3 h-3 mr-1" />
                            Explicit Deny
                          </span>
                        );
                      }
                      return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
                          Default Denied
                        </span>
                      );
                    };

                    return (
                      <TableRow key={item.permissionId} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? "bg-indigo-950/20" : ""}`}>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={isSelected}
                            disabled={item.isSystem}
                            onCheckedChange={() => handleToggleRow(item.permissionId)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{item.displayName}</span>
                            {item.reason && (
                              <span className="text-slate-400 hover:text-white transition-colors cursor-help" title={`Audit Reason: ${item.reason}`}>
                                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono uppercase text-[10px] text-slate-300">
                              {item.module}
                            </span>
                            <span className="truncate max-w-xs">{item.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800/80 text-indigo-300">
                            {item.action}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-slate-300">
                          {item.source}
                          {item.effectiveUntil && (
                            <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              Exp: {new Date(item.effectiveUntil).toLocaleDateString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStateBadge()}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.isSystem ? (
                            <span className="text-xs text-slate-500 italic">Protected</span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              {item.status !== "GRANTED" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openActionDialog("GRANT", item.permissionId)}
                                  className="h-7 px-2 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/50"
                                  title="Explicitly grant this permission"
                                >
                                  Grant
                                </Button>
                              )}
                              {item.status !== "DENIED" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openActionDialog("DENY", item.permissionId)}
                                  className="h-7 px-2 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-950/50"
                                  title="Explicitly deny this permission"
                                >
                                  Deny
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openActionDialog("TEMPORARY", item.permissionId)}
                                className="h-7 px-2 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-950/50"
                                title="Set temporary access window"
                              >
                                Temp
                              </Button>
                              {(item.status === "GRANTED" || item.status === "DENIED" || item.isTemporary) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openActionDialog("REVOKE", item.permissionId)}
                                  className="h-7 px-2 text-xs border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                                  title="Revoke override and restore role default"
                                >
                                  Reset
                                </Button>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog Modal for Override & Mandatory Reason Submission */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white animate-in fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className={`p-2.5 rounded-xl ${dialogMode === "GRANT" ? "bg-emerald-500/10 text-emerald-400" : dialogMode === "DENY" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"}`}>
                {dialogMode === "GRANT" && <CheckCircle2 className="w-6 h-6" />}
                {dialogMode === "DENY" && <XCircle className="w-6 h-6" />}
                {dialogMode === "TEMPORARY" && <Clock className="w-6 h-6" />}
                {dialogMode === "REVOKE" && <RotateCcw className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {dialogMode === "GRANT" && "Apply Explicit Grant Override"}
                  {dialogMode === "DENY" && "Apply Explicit Deny Override"}
                  {dialogMode === "TEMPORARY" && "Schedule Temporary Access Override"}
                  {dialogMode === "REVOKE" && "Revoke Override & Reset"}
                </h3>
                <p className="text-xs text-slate-400">
                  Target: {targetPermissionId ? "1 specific permission" : `${selectedIds.length} selected permissions`}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mandatory Audit Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter specific administrative reason for compliance & security audit logs..."
                  rows={3}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              {dialogMode === "TEMPORARY" && (
                <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Effective Start Date & Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={effectiveFrom}
                      onChange={(e) => setEffectiveFrom(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Effective Until / Expiry Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={effectiveUntil}
                      onChange={(e) => setEffectiveUntil(e.target.value)}
                      required
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Expired access will stop automatically at this exact timestamp without any manual cleanup required.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={submitting}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExecuteAction}
                disabled={submitting}
                className={`text-xs font-semibold text-white ${dialogMode === "GRANT" ? "bg-emerald-600 hover:bg-emerald-700" : dialogMode === "DENY" ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700"}`}
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                Confirm & Apply Override
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

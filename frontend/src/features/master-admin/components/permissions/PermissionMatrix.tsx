import React, { useMemo, useState } from 'react';
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Search, ChevronDown, ChevronRight, CheckSquare } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Permission } from "../../types/permission.types";

interface PermissionMatrixProps {
  allPermissions: Permission[];
  selectedIds: Set<string>;
  onChange: (newSelected: Set<string>) => void;
  isReadonly?: boolean;
}

const ACTION_ORDER = [
  "READ",
  "VIEW",
  "CREATE",
  "UPDATE",
  "DELETE",
  "MANAGE",
  "GENERATE",
  "DOWNLOAD",
  "APPROVE",
  "ASSIGN",
  "VERIFY",
  "PUBLISH",
  "IMPORT",
  "EXPORT",
  "START",
  "STOP",
];

const PERMISSION_DEPENDENCIES: Record<string, string[]> = {
  'UPDATE': ['READ'],
  'DELETE': ['READ'],
  'APPROVE': ['READ'],
  'MANAGE': ['READ'],
  'EXPORT': ['READ'],
  'VERIFY': ['READ'],
};

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  allPermissions,
  selectedIds,
  onChange,
  isReadonly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Process and group permissions
  const { groupedPermissions, columns } = useMemo(() => {
    const groups: Record<string, Record<string, Permission>> = {};
    const actionSet = new Set<string>();

    allPermissions.forEach(p => {
      if (!groups[p.module]) {
        groups[p.module] = {};
      }
      groups[p.module][p.action] = p;
      actionSet.add(p.action);
    });

    // Sort columns based on ACTION_ORDER, then others alphabetically
    const sortedColumns = Array.from(actionSet).sort((a, b) => {
      const idxA = ACTION_ORDER.indexOf(a);
      const idxB = ACTION_ORDER.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return { groupedPermissions: groups, columns: sortedColumns };
  }, [allPermissions]);

  const filteredModules = useMemo(() => {
    if (!searchTerm) return Object.keys(groupedPermissions).sort();
    const lowerSearch = searchTerm.toLowerCase();
    return Object.keys(groupedPermissions).filter(mod => 
      mod.toLowerCase().includes(lowerSearch)
    ).sort();
  }, [groupedPermissions, searchTerm]);

  const handleToggleModuleExpansion = (moduleName: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleName)) next.delete(moduleName);
      else next.add(moduleName);
      return next;
    });
  };

  const handleToggleAllExpansion = () => {
    if (expandedModules.size === filteredModules.length) {
      setExpandedModules(new Set());
    } else {
      setExpandedModules(new Set(filteredModules));
    }
  };

  const handleCheckboxChange = (permission: Permission, isChecked: boolean) => {
    if (isReadonly) return;

    const nextSelected = new Set(selectedIds);

    const checkWithDependencies = (perm: Permission) => {
      nextSelected.add(perm._id);
      // Auto-check dependencies
      const deps = PERMISSION_DEPENDENCIES[perm.action];
      if (deps) {
        deps.forEach(depAction => {
          const depPerm = groupedPermissions[perm.module][depAction];
          if (depPerm) nextSelected.add(depPerm._id);
        });
      }
    };

    const uncheckWithDependencies = (perm: Permission) => {
      nextSelected.delete(perm._id);
      // If we uncheck something like READ, we must uncheck everything that depends on it
      Object.entries(PERMISSION_DEPENDENCIES).forEach(([dependentAction, reqs]) => {
        if (reqs.includes(perm.action)) {
          const dependentPerm = groupedPermissions[perm.module][dependentAction];
          if (dependentPerm && nextSelected.has(dependentPerm._id)) {
            uncheckWithDependencies(dependentPerm);
          }
        }
      });
    };

    if (isChecked) {
      checkWithDependencies(permission);
    } else {
      uncheckWithDependencies(permission);
    }

    onChange(nextSelected);
  };

  const handleToggleModule = (moduleName: string, isChecked: boolean) => {
    if (isReadonly) return;
    const nextSelected = new Set(selectedIds);
    const modulePerms = Object.values(groupedPermissions[moduleName]);

    modulePerms.forEach(p => {
      if (isChecked) nextSelected.add(p._id);
      else nextSelected.delete(p._id);
    });

    onChange(nextSelected);
  };

  const handleToggleColumn = (action: string, isChecked: boolean) => {
    if (isReadonly) return;
    const nextSelected = new Set(selectedIds);

    Object.values(groupedPermissions).forEach(modulePerms => {
      const perm = modulePerms[action];
      if (perm) {
        if (isChecked) {
          nextSelected.add(perm._id);
          // check dependencies for this added permission
          const deps = PERMISSION_DEPENDENCIES[perm.action];
          if (deps) {
            deps.forEach(depAction => {
              const depPerm = groupedPermissions[perm.module][depAction];
              if (depPerm) nextSelected.add(depPerm._id);
            });
          }
        } else {
          // Unchecking a column might be complex if it cascades. We'll simplify and just delete it,
          // then trigger a cleanup pass.
          nextSelected.delete(perm._id);
        }
      }
    });

    if (!isChecked) {
      // Cleanup pass for unchecking columns that act as dependencies
      Object.keys(groupedPermissions).forEach(mod => {
        Object.entries(PERMISSION_DEPENDENCIES).forEach(([dependentAction, reqs]) => {
          if (reqs.includes(action)) {
            const dependentPerm = groupedPermissions[mod][dependentAction];
            if (dependentPerm) nextSelected.delete(dependentPerm._id);
          }
        });
      });
    }

    onChange(nextSelected);
  };

  const getModuleState = (moduleName: string) => {
    const modulePerms = Object.values(groupedPermissions[moduleName]);
    const selectedCount = modulePerms.filter(p => selectedIds.has(p._id)).length;
    return {
      all: selectedCount === modulePerms.length && modulePerms.length > 0,
      some: selectedCount > 0 && selectedCount < modulePerms.length,
    };
  };

  const getColumnState = (action: string) => {
    let total = 0;
    let selected = 0;
    Object.values(groupedPermissions).forEach(modulePerms => {
      if (modulePerms[action]) {
        total++;
        if (selectedIds.has(modulePerms[action]._id)) selected++;
      }
    });
    return {
      all: total > 0 && selected === total,
      some: selected > 0 && selected < total,
    };
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between p-4 border-b bg-slate-50/50 gap-4 flex-wrap">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search modules..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleToggleAllExpansion}>
          {expandedModules.size === filteredModules.length ? 'Collapse All' : 'Expand All'}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0 z-20 shadow-sm">
            <tr>
              <th scope="col" className="px-6 py-4 sticky left-0 z-30 bg-slate-50 border-r border-b min-w-[250px]">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-slate-400" />
                  Modules
                </div>
              </th>
              {columns.map(action => {
                const colState = getColumnState(action);
                return (
                  <th key={action} scope="col" className="px-4 py-4 text-center border-b border-r bg-slate-50 min-w-[100px]">
                    <div className="flex flex-col items-center gap-2">
                      <span>{action}</span>
                      <Checkbox
                        checked={colState.all || (colState.some && "indeterminate")}
                        onCheckedChange={(checked) => handleToggleColumn(action, !!checked)}
                        disabled={isReadonly}
                      />
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredModules.map(moduleName => {
              const modState = getModuleState(moduleName);
              const isExpanded = expandedModules.has(moduleName);
              const hasDescriptions = Object.values(groupedPermissions[moduleName]).some(p => p.description);

              return (
                <React.Fragment key={moduleName}>
                  <tr className="bg-white hover:bg-slate-50/80 transition-colors border-b group">
                    <td className="px-4 py-3 sticky left-0 z-10 bg-white group-hover:bg-slate-50/80 border-r">
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-6 h-6 shrink-0" 
                          onClick={() => handleToggleModuleExpansion(moduleName)}
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Button>
                        <Checkbox
                          checked={modState.all || (modState.some && "indeterminate")}
                          onCheckedChange={(checked) => handleToggleModule(moduleName, !!checked)}
                          disabled={isReadonly}
                        />
                        <span className="font-semibold text-slate-900">{moduleName}</span>
                      </div>
                    </td>
                    {columns.map(action => {
                      const perm = groupedPermissions[moduleName][action];
                      return (
                        <td key={action} className="px-4 py-3 text-center border-r">
                          {perm ? (
                            <div className="flex justify-center" title={perm.description || perm.name}>
                              <Checkbox
                                checked={selectedIds.has(perm._id)}
                                onCheckedChange={(checked) => handleCheckboxChange(perm, !!checked)}
                                disabled={isReadonly}
                              />
                            </div>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  
                  {isExpanded && hasDescriptions && (
                    <tr className="bg-slate-50/50 border-b">
                      <td colSpan={columns.length + 1} className="px-6 py-4 text-slate-600 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.values(groupedPermissions[moduleName]).map(p => p.description && (
                            <div key={p._id} className="flex flex-col gap-1">
                              <span className="font-medium text-slate-700">{p.action}:</span>
                              <span>{p.description}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {filteredModules.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500 bg-white">
                  No modules found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

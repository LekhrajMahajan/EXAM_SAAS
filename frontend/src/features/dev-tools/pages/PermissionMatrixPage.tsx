import React from 'react';
import { RolePermissionMatrixGrid } from '../../master-admin/components/permissions/RolePermissionMatrixGrid';

export function PermissionMatrixPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Permission Matrix</h1>
        <p className="text-sm text-slate-500">
          Live interactive Role-Based Access Control (RBAC) 2D visualization with subscription feature checking and role hierarchy protection.
        </p>
      </div>

      <div className="w-full">
        <RolePermissionMatrixGrid />
      </div>
    </div>
  );
}

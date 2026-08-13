import { SystemUsersPage } from "./SystemUsersPage";

export const AccessManagementPage = () => {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Access Management</h1>
        <p className="text-slate-500">
          Manage all platform users and access controls.
        </p>
      </div>

      <SystemUsersPage isTab={true} />
    </div>
  );
};

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { ShieldAlert, Loader2 } from "lucide-react";
import type { Role } from "../../types/role.types";
import { useUpdateRole } from "../../hooks/role.hooks";

interface ChangeParentDialogProps {
  role: Role | null;
  allRoles: Role[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangeParentDialog = ({ role, allRoles, open, onOpenChange }: ChangeParentDialogProps) => {
  const [selectedParentId, setSelectedParentId] = useState<string>("none");
  const { mutateAsync: updateRole, isPending } = useUpdateRole();

  // Reset state when opened
  if (open && role && selectedParentId === "none" && role.parentRole) {
    const parentId = typeof role.parentRole === 'object' ? (role.parentRole as { _id?: string })?._id : role.parentRole;
    if (parentId && selectedParentId === "none") {
       // Using a useEffect is better but since it's just a simple sync:
       // We'll let it be managed by an effect or just handle default value in render.
    }
  }

  // Calculate descendants to prevent circular assignment
  const getDescendants = (roleId: string, roles: Role[]): string[] => {
    const children = roles.filter(r => {
      const pId = typeof r.parentRole === 'object' && r.parentRole !== null ? (r.parentRole as { _id?: string })._id : r.parentRole;
      return pId === roleId;
    });
    let descendants = [...children.map(c => c._id)];
    children.forEach(child => {
      descendants = [...descendants, ...getDescendants(child._id, roles)];
    });
    return descendants;
  };

  const descendants = role ? getDescendants(role._id, allRoles) : [];
  
  // Available parents: not self, not descendant
  const availableParents = allRoles.filter(r => {
    if (!role) return false;
    if (r._id === role._id) return false;
    if (descendants.includes(r._id)) return false;
    return true;
  });

  const handleSave = async () => {
    if (!role) return;
    try {
      const payloadParentId = selectedParentId === "none" ? null : selectedParentId;
      await updateRole({ id: role._id, payload: { parentRole: payloadParentId } });
      onOpenChange(false);
      setSelectedParentId("none");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) setSelectedParentId("none");
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Parent Role</DialogTitle>
          <DialogDescription>
            Select a new parent for <span className="font-semibold text-slate-900">{role?.displayName}</span>. 
            This will update the hierarchy and permission inheritance.
          </DialogDescription>
        </DialogHeader>

        {role?.isSystem ? (
          <Alert variant="destructive" className="mt-4">
            <ShieldAlert className="w-4 h-4" />
            <AlertDescription>System roles cannot be moved in the hierarchy.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Parent Role</Label>
              <Select 
                value={selectedParentId} 
                onValueChange={setSelectedParentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {availableParents.map(p => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.displayName} (Level {p.hierarchyLevel})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {descendants.length > 0 && (
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertDescription>
                  This role has {descendants.length} descendant(s). Moving it will also move all of its descendants.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          {!role?.isSystem && (
            <Button onClick={handleSave} disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

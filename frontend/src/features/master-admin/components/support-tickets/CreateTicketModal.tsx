import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useCreateSupportTicket } from "../../hooks/support-ticket.hooks";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketModal = ({ isOpen, onClose }: CreateTicketModalProps) => {
  const createTicket = useCreateSupportTicket();
  
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "OTHER",
    priority: "LOW",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket.mutate(formData, {
      onSuccess: () => {
        setFormData({ subject: "", description: "", category: "OTHER", priority: "LOW" });
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Subject</label>
            <Input 
              required
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="Brief summary of the issue"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea 
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed explanation..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TECHNICAL">Technical</SelectItem>
                  <SelectItem value="BILLING">Billing</SelectItem>
                  <SelectItem value="ACCOUNT">Account</SelectItem>
                  <SelectItem value="FEATURE_REQUEST">Feature Request</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createTicket.isPending}>
              {createTicket.isPending ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { useSupportTicketById, useAddTicketMessage } from "../../hooks/support-ticket.hooks";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

interface TicketDetailsDrawerProps {
  ticketId: string | null;
  onClose: () => void;
}

export const TicketDetailsDrawer = ({ ticketId, onClose }: TicketDetailsDrawerProps) => {
  const { data, isLoading } = useSupportTicketById(ticketId || "");
  const addMessage = useAddTicketMessage();
  const [reply, setReply] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const ticket = data?.data;

  const handleReply = () => {
    if (!reply.trim() || !ticketId) return;
    addMessage.mutate(
      { id: ticketId, data: { message: reply, isInternalNote: isInternal } },
      { onSuccess: () => setReply("") }
    );
  };

  return (
    <Sheet open={!!ticketId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Ticket Details</SheetTitle>
          <SheetDescription>View conversation and manage ticket.</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading details...</div>
        ) : !ticket ? (
          <div className="p-8 text-center text-red-500">Failed to load ticket</div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                <Badge variant="outline">{ticket.status}</Badge>
              </div>
              <p className="text-sm text-slate-500 mb-2">ID: {ticket.ticketId} • Priority: {ticket.priority}</p>
              <div className="p-4 bg-slate-50 rounded-md text-sm text-slate-700 whitespace-pre-wrap">
                {ticket.description}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4">Conversation</h4>
              <div className="space-y-4 mb-4">
                {ticket.conversation?.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No replies yet.</p>
                ) : (
                  ticket.conversation?.map((msg: any, idx: number) => (
                    <div key={idx} className={`p-3 rounded-md text-sm ${msg.isInternalNote ? 'bg-yellow-50 border border-yellow-200' : 'bg-slate-100'}`}>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium text-slate-700">{msg.senderName} {msg.isInternalNote && '(Internal Note)'}</span>
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="whitespace-pre-wrap">{msg.message}</div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="space-y-3">
                <Textarea 
                  placeholder="Type your reply here..." 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input 
                      type="checkbox" 
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    Internal Note
                  </label>
                  <Button onClick={handleReply} disabled={!reply.trim() || addMessage.isPending}>
                    {addMessage.isPending ? 'Sending...' : 'Send Reply'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

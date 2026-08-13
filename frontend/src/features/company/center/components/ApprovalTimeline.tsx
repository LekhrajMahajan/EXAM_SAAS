import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import type { Approval } from "../types/center.types";

interface ApprovalTimelineProps {
  approval: Approval;
}

export const ApprovalTimeline = ({ approval }: ApprovalTimelineProps) => {
  const getIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 className="h-6 w-6 text-green-500 bg-white" />;
      case 'Rejected':
        return <XCircle className="h-6 w-6 text-red-500 bg-white" />;
      case 'Pending':
        return <Clock className="h-6 w-6 text-yellow-500 bg-white" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500 bg-white" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-8 space-y-6 before:absolute before:inset-0 before:ml-11 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {approval.timeline.map((event, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {getIcon(event.status)}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-900">{event.status}</div>
                  <time className="text-xs font-medium text-amber-500">
                    {new Date(event.date).toLocaleDateString()}
                  </time>
                </div>
                <div className="text-sm text-slate-500 mb-2">By: {event.by}</div>
                {event.remarks && (
                  <div className="text-sm text-slate-700 bg-slate-50 p-2 rounded">
                    {event.remarks}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

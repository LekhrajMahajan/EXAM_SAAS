import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { MonitorPlay, KeyRound, MapPin } from "lucide-react";

interface ActivityTimelineProps {
  activities: {
    id: string;
    action: string;
    date: string;
    ipAddress: string;
    details?: string;
  }[];
}

export const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-8 space-y-6 before:absolute before:inset-0 before:ml-11 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <MonitorPlay className="h-3 w-3" />
              </div>
              
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white p-4 rounded border shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-900 text-sm">{activity.action}</div>
                  <time className="text-xs font-medium text-amber-500">
                    {new Date(activity.date).toLocaleString()}
                  </time>
                </div>
                {activity.details && (
                  <div className="text-sm text-slate-600 mt-2 mb-2">
                    {activity.details}
                  </div>
                )}
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  IP: {activity.ipAddress}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

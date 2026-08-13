import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  isRead: boolean;
  time: string;
}

interface NotificationCardProps {
  notifications: NotificationItem[];
}

export const NotificationCard = ({ notifications }: NotificationCardProps) => {
  return (
    <Card className="col-span-1 h-full border border-slate-200 dark:border-slate-800 shadow-sm bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-2">
        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-[#2D3E2C] dark:text-[#E4FD97]">
          <div className="p-1.5 rounded-md bg-[#E4FD97] text-[#2D3E2C] shrink-0">
            <Bell className="h-4 w-4" />
          </div>
          Notifications
        </CardTitle>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs text-[#2D3E2C] dark:text-[#E4FD97] font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
            Mark all as read
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  notification.isRead 
                    ? 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800/40' 
                    : 'bg-[#2D3E2C]/5 dark:bg-[#E4FD97]/10 border-[#2D3E2C]/20 dark:border-[#E4FD97]/30 shadow-xs'
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {!notification.isRead && <span className="h-2 w-2 rounded-full bg-[#2D3E2C] dark:bg-[#E4FD97] inline-block" />}
                    {notification.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 pl-3.5">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-[#2D3E2C]/20 dark:border-[#E4FD97]/20 rounded-xl bg-[#2D3E2C]/5 dark:bg-[#2D3E2C]/30 my-2">
            <CheckCircle2 className="h-8 w-8 text-[#A5AF79] dark:text-[#E4FD97] mb-2.5 opacity-80" />
            <p className="text-sm font-semibold text-[#2D3E2C] dark:text-[#E4FD97]/90">You&apos;re all caught up!</p>
            <p className="text-xs text-slate-500 mt-1">No pending notifications for your organization right now.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


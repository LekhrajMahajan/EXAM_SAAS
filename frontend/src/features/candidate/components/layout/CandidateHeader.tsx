import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

export function CandidateHeader() {
  return (
    <header className="h-16 flex-shrink-0 border-b border-slate-200 bg-white px-6 flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-100">
                <User className="h-4 w-4 text-indigo-700" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-slate-500">
                  john.doe@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

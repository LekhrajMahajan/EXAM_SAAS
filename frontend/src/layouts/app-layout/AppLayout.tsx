import { Outlet, useNavigation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FullPageLoader } from "@/shared/components/Loading";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";

export const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const { user } = useAuthStore();

  useIdleTimeout(user?.idleTimeout);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {isLoading && <FullPageLoader />}
      
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <Navbar />

        {/* Page Content and Footer Scrollable Area */}
        <div className="flex-1 bg-muted/20 flex flex-col overflow-y-auto">
          <main className="flex-1">
            <Outlet />
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutations";
import { useLocation } from "react-router-dom";

export const useIdleTimeout = (idleTimeoutMinutes: number | undefined) => {
  const { user } = useAuthStore();
  const logoutMutation = useLogoutMutation();
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If no timeout or user is master admin, disable idle timeout
    if (!idleTimeoutMinutes || idleTimeoutMinutes <= 0) {
      return;
    }

    // Bypass idle timeout for candidate on exam routes
    if (user?.role === "Candidate" && location.pathname.includes("/exam/")) {
      return;
    }

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        logoutMutation.mutate();
      }, idleTimeoutMinutes * 60 * 1000);
    };

    // Attach event listeners
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "DOMMouseScroll",
      "mousewheel",
      "touchmove",
      "MSPointerMove",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [idleTimeoutMinutes, logoutMutation, location.pathname, user?.role]);
};

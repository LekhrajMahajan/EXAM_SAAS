import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const PageContainer = ({ children, className, title, description }: PageContainerProps) => {
  const location = useLocation();

  return (
    <div className={cn("p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full", className)}>
      {(title || description) && (
        <div className="mb-6 space-y-1">
          {title && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

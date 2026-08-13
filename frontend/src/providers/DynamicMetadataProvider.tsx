import React, { useEffect } from 'react';
import { usePublicSettings } from '@/features/master-admin/hooks/system-settings.hooks';

export const DynamicMetadataProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: orgSettings } = usePublicSettings();

  useEffect(() => {
    if (orgSettings?.data) {
      const orgName = orgSettings.data.find(s => s.key === "ORG_NAME")?.value as string;
      const faviconUrl = orgSettings.data.find(s => s.key === "LOGO_FAVICON")?.value as string;

      // Update document title
      if (orgName) {
        document.title = orgName;
      } else {
        document.title = "ExamGuard Pro";
      }

      // Update favicon
      if (faviconUrl) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = faviconUrl;
        
        let shortcutLink = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;
        if (!shortcutLink) {
          shortcutLink = document.createElement('link');
          shortcutLink.rel = 'shortcut icon';
          document.head.appendChild(shortcutLink);
        }
        shortcutLink.href = faviconUrl;
      } else {
        // Fallback to default vite favicon if missing
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) link.href = '/vite.svg';
        
        const shortcutLink = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;
        if (shortcutLink) shortcutLink.href = '/vite.svg';
      }
    }
  }, [orgSettings]);

  return <>{children}</>;
};

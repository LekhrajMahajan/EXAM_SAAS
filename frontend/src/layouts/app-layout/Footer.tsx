import { Mail } from "lucide-react";
import { usePublicSettings } from "@/features/master-admin/hooks/system-settings.hooks";

export const Footer = () => {
  const { data: orgSettings } = usePublicSettings();
  
  const orgName = (orgSettings?.data?.find(s => s.key === "ORG_NAME")?.value as string) || "ExamGuard Pro";
  const supportEmail = orgSettings?.data?.find(s => s.key === "ORG_SUPPORT_EMAIL")?.value as string | undefined;
  const facebook = orgSettings?.data?.find(s => s.key === "SOCIAL_FACEBOOK")?.value as string | undefined;
  const twitter = orgSettings?.data?.find(s => s.key === "SOCIAL_TWITTER")?.value as string | undefined;
  const linkedin = orgSettings?.data?.find(s => s.key === "SOCIAL_LINKEDIN")?.value as string | undefined;
  const instagram = orgSettings?.data?.find(s => s.key === "SOCIAL_INSTAGRAM")?.value as string | undefined;
  const youtube = orgSettings?.data?.find(s => s.key === "SOCIAL_YOUTUBE")?.value as string | undefined;

  return (
    <footer className="border-t bg-background px-6 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
        <p>&copy; {new Date().getFullYear()} {orgName}. All rights reserved.</p>
        
        <div className="flex items-center space-x-4">
          {!!supportEmail && (
            <a href={`mailto:${supportEmail}`} className="hover:text-foreground transition-colors" title="Contact Support">
              <Mail className="w-4 h-4" />
            </a>
          )}
          {!!facebook && (
            <a href={facebook} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Facebook
            </a>
          )}
          {!!twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Twitter
            </a>
          )}
          {!!linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              LinkedIn
            </a>
          )}
          {!!instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Instagram
            </a>
          )}
          {!!youtube && (
            <a href={youtube} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              YouTube
            </a>
          )}
          <a href="#" className="hover:text-foreground transition-colors ml-4">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

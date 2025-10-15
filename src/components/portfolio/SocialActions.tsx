"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface SocialLinkItem {
  platform: string;
  url: string;
}

interface SocialActionsProps {
  githubUrl?: string;
  socialLinks: SocialLinkItem[];
  email?: string;
  variant?: "icons" | "list";
}

export default function SocialActions({ githubUrl, socialLinks, email, variant = "icons" }: SocialActionsProps) {
  const { user } = useAuth();

  const requireAuth = () => {
    toast.error("Join Cluefind to get access");
  };

  const iconButton = (content: React.ReactNode, href?: string, key?: string | number) => {
    const className = variant === "icons" ? "btn-outline p-3" : "btn-outline p-2";
    if (user) {
      if (!href) return null;
      return (
        <Link key={key} href={href} className={className}>
          {content}
        </Link>
      );
    }
    return (
      <button key={key} onClick={requireAuth} className={className}>
        {content}
      </button>
    );
  };

  const emailButton = () => {
    const content = (
      <span className="inline-flex items-center gap-2 text-sm font-bold uppercase">
        <Mail className="w-4 h-4" />
        {variant === "icons" ? "Contact" : "Email"}
      </span>
    );
    if (user) {
      if (!email) return null;
      return (
        <a href={`mailto:${email}`} className="btn-secondary px-4 py-2">
          {content}
        </a>
      );
    }
    return (
      <button onClick={requireAuth} className="btn-secondary px-4 py-2">
        {content}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`flex ${variant === "icons" ? "items-center" : "items-stretch"} justify-center gap-3 flex-wrap max-w-full sm:flex-row flex-col`}>        
        {githubUrl && iconButton(<Github className={variant === "icons" ? "w-6 h-6" : "w-5 h-5"} />, githubUrl, "gh")}
        {socialLinks.map((link, idx) => {
          const lower = link.platform.toLowerCase();
          const icon = lower.includes("linkedin") ? (
            <Linkedin className={variant === "icons" ? "w-6 h-6" : "w-5 h-5"} />
          ) : lower.includes("mail") || lower.includes("email") ? (
            <Mail className={variant === "icons" ? "w-6 h-6" : "w-5 h-5"} />
          ) : (
            <ExternalLink className={variant === "icons" ? "w-6 h-6" : "w-5 h-5"} />
          );
          const content = variant === "icons" ? icon : (
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase">
              {icon}
              {link.platform}
            </span>
          );
          return iconButton(content, link.url, idx);
        })}
        {emailButton()}
      </div>
    </div>
  );
}



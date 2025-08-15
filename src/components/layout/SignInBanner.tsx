import React from "react";
import { LogIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/RedirectAuthContext";

interface SignInBannerProps {
  openAuthDialog?: () => void;
}

export default function SignInBanner({ openAuthDialog }: SignInBannerProps) {
  const { user, signIn } = useAuth();

  // Don't show banner if user is logged in
  if (user) {
    return null;
  }

  return (
    <div className="fixed bottom-12 left-0 right-0 z-40 bg-gradient-to-r from-red-500/80 to-orange-500/80 backdrop-blur-sm py-1.5 px-4 flex items-center justify-between shadow-md">
      <div className="text-white text-xs font-medium">Sign in to explore more</div>
      <Button 
        onClick={signIn} // Changed: Always call signIn directly, bypassing the auth dialog
        size="sm" 
        className="bg-white hover:bg-white/90 text-red-500 shadow-sm flex items-center gap-1 px-2 py-0.5 h-6 rounded-full"
      >
        <LogIn className="w-3 h-3" />
        <span className="text-xs font-medium">Sign in</span>
      </Button>
    </div>
  );
}
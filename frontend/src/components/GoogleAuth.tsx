import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";

interface GoogleAuthProps {
  onSuccess: (credential: string) => void;
  onError: (error: string) => void;
  text?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({
  onSuccess,
  onError,
  text = "Continue with Google",
  variant = "outline",
  size = "default",
  className = "",
}) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id:
            process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id",
          callback: (response: any) => {
            if (response.credential) {
              onSuccess(response.credential);
            } else {
              onError("Failed to authenticate with Google");
            }
          },
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: "100%",
        });
      }
    };

    // Check if Google script is loaded
    if (window.google) {
      initializeGoogleAuth();
    } else {
      // Wait for Google script to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeGoogleAuth();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogle), 10000);
    }
  }, [onSuccess, onError]);

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="w-full"></div>
    </div>
  );
};

export default GoogleAuth;

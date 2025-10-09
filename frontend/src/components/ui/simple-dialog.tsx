import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div ref={dialogRef} className="relative z-50">
        {children}
      </div>
    </div>
  );
};

const DialogContent: React.FC<DialogContentProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-lg border-blue-100 border max-w-lg w-full mx-4 p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogHeader: React.FC<DialogHeaderProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogTitle: React.FC<DialogTitleProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <h2
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h2>
  );
};

export { Dialog, DialogContent, DialogHeader, DialogTitle };

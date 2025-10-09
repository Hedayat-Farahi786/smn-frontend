import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface PopoverTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
  children: React.ReactNode;
}

const Popover: React.FC<PopoverProps> = ({ 
  open: controlledOpen, 
  onOpenChange, 
  children 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === PopoverTrigger) {
            return React.cloneElement(child, { 
              ...(child.props as any), 
              open, 
              setOpen 
            } as any);
          }
          if (child.type === PopoverContent) {
            return React.cloneElement(child, { 
              ...(child.props as any), 
              open, 
              setOpen 
            } as any);
          }
        }
        return child;
      })}
    </div>
  );
};

const PopoverTrigger: React.FC<PopoverTriggerProps & { open?: boolean; setOpen?: (open: boolean) => void }> = ({ 
  asChild, 
  children, 
  open, 
  setOpen,
  ...props 
}) => {
  const handleClick = () => {
    setOpen?.(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...(children.props as any),
      onClick: (e: React.MouseEvent) => {
        (children.props as any).onClick?.(e);
        handleClick();
      },
    } as any);
  }

  return (
    <div onClick={handleClick} {...props}>
      {children}
    </div>
  );
};

const PopoverContent: React.FC<PopoverContentProps & { open?: boolean; setOpen?: (open: boolean) => void }> = ({ 
  className, 
  align = "center", 
  sideOffset = 4, 
  children, 
  open, 
  setOpen,
  ...props 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen?.(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 w-72 rounded-md border-blue-100 border bg-white p-4 text-blue-900 shadow-md outline-none",
        alignmentClasses[align],
        className
      )}
      style={{ top: `calc(100% + ${sideOffset}px)` }}
      {...props}
    >
      {children}
    </div>
  );
};

export { Popover, PopoverTrigger, PopoverContent };

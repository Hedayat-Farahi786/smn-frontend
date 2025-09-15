import * as React from "react";
import { cn } from "../../lib/utils";

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  placement: "top" | "bottom" | "left" | "right";
}

const TooltipContext = React.createContext<TooltipContextType | null>(null);

const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />");
  }
  return context;
};

interface TooltipProps {
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ children, placement = "right" }: TooltipProps) {
  const [open, setOpen] = React.useState(false);

  const contextValue = React.useMemo(
    () => ({ open, setOpen, placement }),
    [open, placement]
  );

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement> & { asChild?: boolean }
>(({ children, asChild = false, ...props }, ref) => {
  const { setOpen } = useTooltipContext();

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ref,
    } as any);
  }

  return (
    <button
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      type="button"
      {...(props as any)}
    >
      {children}
    </button>
  );
});

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, placement } = useTooltipContext();

  if (!open) return null;

  const getPositionClasses = () => {
    switch (placement) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default:
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-xl animate-in fade-in-0 zoom-in-95 backdrop-blur-sm",
        getPositionClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const TooltipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

interface PageWrapperProps {
  title: string | React.ReactNode;
  description: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  description,
  icon: Icon,
  children,
  actions,
  className = "",
}) => {
  return (
    <div className={`min-h-screen bg-blue-50/70 ${className}`}>
      <div className="p-6 space-y-6">
        {/* Standardized Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {title}
                </h1>
                <p className="text-slate-600 mt-1">
                  {description}
                </p>
              </div>
            </div>
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
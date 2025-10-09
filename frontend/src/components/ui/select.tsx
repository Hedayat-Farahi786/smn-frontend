import * as React from "react"
import { cn } from "../../lib/utils"

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onValueChange?.(e.target.value)}
      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {children}
    </select>
  );
};

const SelectTrigger = Select;
const SelectValue = ({ placeholder }: { placeholder?: string }) => null;
const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
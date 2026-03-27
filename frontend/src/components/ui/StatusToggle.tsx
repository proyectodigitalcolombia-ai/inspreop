import { Check, Minus, X } from "lucide-react";
import type { ItemEstado } from "@workspace/api-client-react";

interface StatusToggleProps {
  value?: ItemEstado | null;
  onChange: (value: ItemEstado) => void;
}

export function StatusToggle({ value, onChange }: StatusToggleProps) {
  return (
    <div className="segmented-control">
      <div 
        className="segmented-btn" 
        data-state={value === "B" ? "B" : undefined}
        onClick={() => onChange("B")}
        title="Bueno"
      >
        <Check className="w-4 h-4 mr-1.5 hidden sm:block" /> B
      </div>
      <div 
        className="segmented-btn" 
        data-state={value === "M" ? "M" : undefined}
        onClick={() => onChange("M")}
        title="Malo"
      >
        <X className="w-4 h-4 mr-1.5 hidden sm:block" /> M
      </div>
      <div 
        className="segmented-btn" 
        data-state={value === "NA" ? "NA" : undefined}
        onClick={() => onChange("NA")}
        title="No Aplica"
      >
        <Minus className="w-4 h-4 mr-1.5 hidden sm:block" /> N/A
      </div>
    </div>
  );
}

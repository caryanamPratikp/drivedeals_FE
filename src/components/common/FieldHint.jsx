import React from 'react';
import { AlertCircle } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
export const FieldHint = ({ label, concept, hint, error, required = false, htmlFor, className = '' }) => {
    return (<div className={`mb-1.5 flex flex-col ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-crimson font-bold text-xs" title="Required">*</span>}
          {concept && <InfoTooltip concept={concept} iconSize={13}/>}
        </label>
        {hint && !error && (<span className="text-[11px] text-textSecondary font-normal">{hint}</span>)}
      </div>

      {error && (<span className="flex items-center gap-1 text-[11px] text-crimson font-medium mt-1 animate-in fade-in duration-150">
          <AlertCircle size={12} className="shrink-0"/>
          <span>{error}</span>
        </span>)}
    </div>);
};

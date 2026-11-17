import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { EXPLANATIONS } from '../../domain/explanations';
export const InfoTooltip = ({ concept, title: propTitle, content: propContent, detailed: propDetailed, position = 'top', className = '', iconSize = 14 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef(null);
    // Resolve content from glossary if concept provided
    const item = concept ? EXPLANATIONS[concept] : undefined;
    const title = propTitle || item?.title || 'Information';
    const content = propContent || item?.short || '';
    const detailed = propDetailed || item?.detailed;
    // Handle outside click to close pinned popover
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setIsHovered(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);
    const isVisible = isOpen || isHovered;
    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    }[position];
    return (<div ref={containerRef} className={`relative inline-flex items-center align-middle ${className}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <button type="button" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
        }} onFocus={() => setIsHovered(true)} onBlur={() => setIsHovered(false)} className="inline-flex items-center justify-center p-0.5 text-textSecondary hover:text-crimson focus-visible:text-crimson transition-colors rounded-full focus:outline-none" aria-label={`Learn more about ${title}`} aria-expanded={isVisible}>
        <Info size={iconSize} className="transition-transform active:scale-90"/>
      </button>

      {isVisible && (<div role="tooltip" className={`absolute z-50 w-72 max-w-[90vw] p-3.5 bg-white text-charcoal text-xs rounded-xl shadow-modal border border-borderNeutral animate-in fade-in zoom-in-95 duration-150 ${positionClasses}`} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between gap-2 mb-1.5 border-b border-borderNeutral/60 pb-1.5">
            <span className="font-semibold text-charcoal text-[13px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson"/>
              {title}
            </span>
            {isOpen && (<button type="button" onClick={() => setIsOpen(false)} className="text-textSecondary hover:text-charcoal p-0.5 rounded transition-colors" aria-label="Close tooltip">
                <X size={12}/>
              </button>)}
          </div>
          <p className="text-charcoal/80 leading-relaxed font-normal">{content}</p>
          {detailed && (<p className="mt-2 pt-2 border-t border-borderNeutral/50 text-[11px] text-textSecondary leading-normal">
              {detailed}
            </p>)}
        </div>)}
    </div>);
};

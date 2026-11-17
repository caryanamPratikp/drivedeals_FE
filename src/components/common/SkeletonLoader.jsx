import React from 'react';
export const Skeleton = ({ className = 'h-4 w-full' }) => {
    return (<div className={`animate-pulse bg-warm-200/80 rounded-md ${className}`} aria-hidden="true"/>);
};
export const CardSkeleton = () => {
    return (<div className="bg-white rounded-2xl p-5 border border-borderNeutral shadow-subtle space-y-4">
      <div className="h-40 bg-warm-200/60 rounded-xl animate-pulse"/>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4"/>
        <Skeleton className="h-4 w-1/2"/>
      </div>
      <div className="pt-2 flex items-center justify-between">
        <Skeleton className="h-6 w-1/3"/>
        <Skeleton className="h-8 w-24 rounded-lg"/>
      </div>
    </div>);
};

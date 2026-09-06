"use client";

import React from 'react';

export default function SkeletonVideo() {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-video rounded-xl bg-gray-300 dark:bg-[#272727] animate-pulse overflow-hidden"></div>
      
      {/* Details Skeleton */}
      <div className="flex gap-3 items-start mt-1">
        {/* Channel Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-[#272727] animate-pulse flex-shrink-0"></div>
        
        {/* Text Lines */}
        <div className="flex-1 flex flex-col gap-2 pt-1">
          {/* Title Lines */}
          <div className="w-[90%] h-4 bg-gray-300 dark:bg-[#272727] rounded animate-pulse"></div>
          <div className="w-[70%] h-4 bg-gray-300 dark:bg-[#272727] rounded animate-pulse"></div>
          
          {/* Channel & Views Line */}
          <div className="w-[50%] h-3 bg-gray-300 dark:bg-[#272727] rounded animate-pulse mt-1"></div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React from 'react';
import { MoreVertical } from "lucide-react";

interface ShortsShelfProps {
  shorts: any[];
  onVideoClick: (videoId: string) => void;
  formatViews: (views: string) => string;
}

export default function ShortsShelf({ shorts, onVideoClick, formatViews }: ShortsShelfProps) {
  if (!shorts || shorts.length === 0) return null;

  return (
    <div className="px-4 sm:px-6 my-6">
      <div className="flex items-center gap-2 mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="red">
          <path d="M17.77,10.32l-1.2-.5L18,9.06a3.74,3.74,0,0,0-3.5-6.62L6,6.94a3.74,3.74,0,0,0,.23,6.74l1.2.49L6,14.93a3.75,3.75,0,0,0,3.5,6.63l8.5-4.5a3.74,3.74,0,0,0-.23-6.74Z" />
          <polygon points="10 14.65 15 12 10 9.35 10 14.65" fill="#fff" />
        </svg>
        <h2 className="text-xl font-bold">Shorts</h2>
      </div>
      
      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
        {shorts.map((short) => {
          const sId = typeof short.id === 'string' ? short.id : short.id.videoId;
          return (
            <div key={sId} onClick={() => onVideoClick(sId)} className="w-[180px] sm:w-[210px] flex-shrink-0 cursor-pointer group flex flex-col gap-2">
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-800">
                <img src={short.snippet.thumbnails.high?.url || short.snippet.thumbnails.medium?.url} alt="short" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex justify-between items-start pt-1">
                <div className="flex flex-col pr-2">
                  <h3 className="text-black dark:text-white text-[15px] font-semibold line-clamp-2 leading-tight" dangerouslySetInnerHTML={{ __html: short.snippet.title }}></h3>
                  <p className="text-gray-500 text-xs mt-1">{formatViews(short.statistics?.viewCount)} views</p>
                </div>
                <button className="text-gray-400 hover:text-black dark:hover:text-white mt-0.5">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
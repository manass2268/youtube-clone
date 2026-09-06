/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { MoreVertical } from "lucide-react";

interface VideoGridProps {
  videos: any[];
  onVideoClick: (videoId: string) => void;
  formatViews: (views: string) => string;
  parseDuration: (duration: string) => string;
  timeAgo: (date: string) => string;
}

export default function VideoGrid({ videos, onVideoClick, formatViews, parseDuration, timeAgo }: VideoGridProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 px-4 sm:px-6">
      {videos.map((video, index) => {
        const vId = video.id;
        const snippet = video.snippet;
        const stats = video.statistics || {};
        const duration = video.contentDetails?.duration;

        return (
          <div key={`${vId}-${index}`} onClick={() => onVideoClick(vId)} className="flex flex-col gap-3 cursor-pointer group">
            {/* Thumbnail - Removed scale effect for authenticity */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
              <img src={snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url} alt="thumbnail" className="object-cover w-full h-full" />
              {duration && (
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[12px] px-1.5 py-0.5 rounded font-medium">
                  {parseDuration(duration)}
                </span>
              )}
            </div>
            
            <div className="flex gap-3 items-start">
              {/* Channel Avatar */}
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                {video.channelAvatar ? (
                  <img src={video.channelAvatar} alt={snippet.channelTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#7000df] text-white flex items-center justify-center font-semibold text-sm uppercase">
                    {snippet.channelTitle?.charAt(0) || 'C'}
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="flex-1 overflow-hidden pr-2">
                <h3 className="font-medium text-[16px] leading-[2.2rem] line-clamp-2 text-black dark:text-[#f1f1f1]" dangerouslySetInnerHTML={{ __html: snippet.title }}></h3>
                <div className="text-[14px] text-gray-600 dark:text-[#aaaaaa] mt-1 hover:text-black dark:hover:text-[#f1f1f1] transition-colors">
                  {snippet.channelTitle}
                </div>
                <div className="flex items-center text-[14px] text-gray-600 dark:text-[#aaaaaa]">
                  <span>{formatViews(stats.viewCount)} views</span>
                  <span className="mx-1">•</span>
                  <span>{timeAgo(snippet.publishedAt)}</span>
                </div>
              </div>

              <button className="text-transparent group-hover:text-black dark:group-hover:text-[#f1f1f1] flex-shrink-0 -mt-1 p-1 hover:bg-gray-200 dark:hover:bg-[#272727] rounded-full">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
} 
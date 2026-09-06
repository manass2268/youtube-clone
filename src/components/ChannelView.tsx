
"use client";

import React from 'react';
import VideoGrid from './VideoGrid';

interface ChannelViewProps {
  channelInfo: any;
  videos: any[];
  onVideoClick: (videoId: string) => void;
  formatViews: (views: string) => string;
  parseDuration: (duration: string) => string;
  timeAgo: (date: string) => string;
}

export default function ChannelView({
  channelInfo,
  videos,
  onVideoClick,
  formatViews,
  parseDuration,
  timeAgo
}: ChannelViewProps) {
  if (!channelInfo) return null;

  const snippet = channelInfo.snippet || {};
  const stats = channelInfo.statistics || {};
  const branding = channelInfo.brandingSettings || {};

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Channel Banner */}
      {branding.image?.bannerExternalUrl && (
        <div className="w-full h-32 sm:h-48 md:h-56 lg:h-64 overflow-hidden rounded-2xl mb-6 px-4 sm:px-6">
          <img
            src={branding.image.bannerExternalUrl}
            alt="Channel Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Channel Header Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 px-4 sm:px-6 mb-8 mt-4">
        <img
          src={snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url}
          alt={snippet.title}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover bg-gray-800"
        />
        
        <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-[#f1f1f1] mb-2">
            {snippet.title}
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-[14px] text-gray-600 dark:text-[#aaaaaa] mb-3">
            <span className="font-medium text-black dark:text-[#f1f1f1]">{snippet.customUrl}</span>
            <span className="hidden sm:block">•</span>
            <span>{formatViews(stats.subscriberCount)} subscribers</span>
            <span className="hidden sm:block">•</span>
            <span>{stats.videoCount} videos</span>
          </div>
          <p className="text-[14px] text-gray-600 dark:text-[#aaaaaa] line-clamp-2 max-w-2xl">
            {snippet.description}
          </p>
        </div>
        
        <button className="px-4 py-2 bg-black dark:bg-[#f1f1f1] text-white dark:text-[#0f0f0f] rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors mt-2">
          Subscribe
        </button>
      </div>

      <div className="w-full h-px bg-gray-200 dark:bg-[#272727] mb-6"></div>

      {/* Channel Videos */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="flex gap-6 border-b border-gray-200 dark:border-[#272727]">
          <button className="pb-3 border-b-2 border-black dark:border-[#f1f1f1] text-[16px] font-medium text-black dark:text-[#f1f1f1]">
            Videos
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <VideoGrid
          videos={videos}
          onVideoClick={onVideoClick}
          formatViews={formatViews}
          parseDuration={parseDuration}
          timeAgo={timeAgo}
        />
      </div>
    </div>
  );
}
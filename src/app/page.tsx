/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, Suspense } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChannelView from '../components/ChannelView';
import ShortsShelf from '../components/ShortsShelf';
import VideoGrid from '../components/VideoGrid';
import SkeletonVideo from '../components/SkeletonVideo';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useYouTubeData } from '../hooks/useYouTubeData';
import { formatViews, parseDuration, timeAgo } from '../utils/helpers';

const CATEGORIES = ["All", "Subscriptions", "Liked Videos", "Gaming", "Live", "Music", "Techno Gamerz", "CarryMinati", "Physics Wallah", "Tech Burner", "Python", "Next.js", "React", "Cricket"];

function MainContent() {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("Home"); 
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get('search');

  const {
    searchQuery, setSearchQuery,
    videos, shorts, channelInfo, isChannelView,
    loading, isFetchingMore, nextPageToken, fetchYouTubeData
  } = useYouTubeData(selectedCategory, activeTab, urlSearchQuery);

  const handleSearchTrigger = (term: string) => {
    setSearchQuery(term);
    setSelectedCategory("All");
    router.push(`/?search=${encodeURIComponent(term)}`);
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 300) {
      if (!loading && !isFetchingMore && nextPageToken && !isChannelView && session) {
        fetchYouTubeData(searchQuery, nextPageToken, true);
      }
    }
  };

  const handleVideoClick = (videoId: string) => {
    router.push(`/watch?v=${videoId}`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0f0f0f] text-black dark:text-[#f1f1f1] font-sans">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onSearch={handleSearchTrigger} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main onScroll={handleScroll} className="flex-1 overflow-y-auto bg-white dark:bg-[#0f0f0f] custom-scrollbar">
          
          {/* Categories - Only show if logged in OR searching */}
          {(session || searchQuery) && !isChannelView && (
            <div className="sticky top-0 bg-white/95 dark:bg-[#0f0f0f]/95 z-40 py-3 px-4 sm:px-6 flex items-center gap-3 overflow-x-auto scrollbar-none">
              {CATEGORIES.map((cat) => {
                if (!(session as any)?.accessToken && (cat === "Subscriptions" || cat === "Liked Videos")) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); router.push('/'); }}
                    className={`px-3 py-1.5 rounded-lg text-[14px] font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat && !searchQuery
                        ? "bg-black dark:bg-[#f1f1f1] text-white dark:text-[#0f0f0f]" 
                        : "bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] text-black dark:text-[#f1f1f1]"
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          )}

          {/* Logged Out Empty State */}
          {!session && !searchQuery ? (
            <div className="flex items-center justify-center h-[calc(100vh-120px)] px-4">
              <div className="bg-gray-100 dark:bg-[#222222] rounded-[16px] py-14 px-8 w-full max-w-[700px] text-center">
                <h2 className="text-[24px] font-bold mb-3 text-black dark:text-[#f1f1f1]">Try searching to get started</h2>
                <p className="text-[14px] text-gray-600 dark:text-[#aaaaaa]">Start watching videos to help us build a feed of videos you'll love.</p>
              </div>
            </div>
          ) : (
            /* Regular Video Grid & Results */
            <>
              {searchQuery && (
                <div className="px-6 pt-4 pb-2 text-lg font-bold border-b border-gray-200 dark:border-[#272727]">
                  Results for &quot;{searchQuery}&quot;
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 px-4 sm:px-6 pt-4">
                  {[...Array(12)].map((_, i) => <SkeletonVideo key={i} />)}
                </div>
              ) : (
                <div className="pb-16 pt-2">
                  {isChannelView && channelInfo ? (
                    <ChannelView 
                      channelInfo={channelInfo} videos={videos} 
                      onVideoClick={handleVideoClick} formatViews={formatViews} 
                      parseDuration={parseDuration} timeAgo={timeAgo} 
                    />
                  ) : (
                    <>
                      <VideoGrid 
                        videos={videos.slice(0, 8)} onVideoClick={handleVideoClick} 
                        formatViews={formatViews} parseDuration={parseDuration} timeAgo={timeAgo} 
                      />
                      {!searchQuery && selectedCategory !== "Subscriptions" && selectedCategory !== "Liked Videos" && (
                        <>
                          <ShortsShelf shorts={shorts} onVideoClick={handleVideoClick} formatViews={formatViews} />
                          {shorts.length > 0 && <div className="h-1 w-full bg-gray-200 dark:bg-[#272727] mb-8 mt-2"></div>}
                        </>
                      )}
                      <VideoGrid 
                        videos={videos.slice(8)} onVideoClick={handleVideoClick} 
                        formatViews={formatViews} parseDuration={parseDuration} timeAgo={timeAgo} 
                      />
                      {isFetchingMore && (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin text-[#aaaaaa]" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen bg-[#0f0f0f]">
        <Loader2 className="w-10 h-10 animate-spin text-[#aaaaaa]" />
      </div>
    }>
      <MainContent />
    </Suspense>
  );
}
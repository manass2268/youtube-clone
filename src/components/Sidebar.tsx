"use client";

import React, { useEffect, useState } from 'react';
import { Flame, ShoppingBag, Music, Film, Gamepad2, Trophy, ChevronRight } from 'lucide-react';
import { useSession, signIn } from "next-auth/react";

// --- Original YouTube Custom SVG Icons (Strictly Stroke-Free) ---
// style={{ stroke: 'transparent', strokeWidth: 0 }} ensures no global CSS ruins the shapes
const YtHome = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-full h-full" style={{ fill: 'currentColor', stroke: 'transparent', strokeWidth: 0 }}>
    {isActive ? (
      <path d="M4 21V10.08l8-6.96 8 6.96V21h-6v-6h-4v6H4z" />
    ) : (
      <path d="M12 4.44 19 10.53V20h-5v-6H10v6H5v-9.47l7-6.09m0-1.32-8 6.96V21h6v-6h4v6h6V10.08l-8-6.96z" />
    )}
  </svg>
);

const YtShorts = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-full h-full" style={{ fill: 'currentColor', stroke: 'transparent', strokeWidth: 0 }}>
    {isActive ? (
      <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.06 1.42.94 2.66 2.23 3.14l1.2.5L6 14.94c-1.84.96-2.53 3.23-1.56 5.06s3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 2-3.49-.06-1.42-.94-2.66-2.23-3.14zM10 14.65v-5.3L15 12l-5 2.65z" />
    ) : (
      <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.06 1.42.94 2.66 2.23 3.14l1.2.5L6 14.94c-1.84.96-2.53 3.23-1.56 5.06s3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 2-3.49-.06-1.42-.94-2.66-2.23-3.14zm-.41 6.54-8.5 4.5c-.88.46-1.93.18-2.45-.63-.5-.78-.42-1.78.2-2.48l1.77-1.95-1.92-.8c-.89-.37-1.44-1.2-1.4-2.12.04-.91.66-1.68 1.52-1.94l8.5-4.5c.88-.46 1.93-.18 2.45.63.5.78.42 1.78-.2 2.48l-1.77 1.95 1.92.8c.89.37 1.44 1.2 1.4 2.12-.04.91-.66 1.68-1.52 1.94z" />
    )}
  </svg>
);

const YtSubscriptions = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-full h-full" style={{ fill: 'currentColor', stroke: 'transparent', strokeWidth: 0 }}>
    {isActive ? (
      <path d="M20 7H4V6h16v1zm2 2v12H2V9h20zm-7 6-5-3v6l5-3zm2-12H7v1h10V3z" />
    ) : (
      <path d="M10 18v-6l5 3-5 3zm7-15H7v1h10V3zm3 3H4v1h16V6zm2 3H2v12h20V9zM3 10h18v10H3V10z" />
    )}
  </svg>
);

const YtYou = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-full h-full" style={{ fill: 'currentColor', stroke: 'transparent', strokeWidth: 0 }}>
    {isActive ? (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.5.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"/>
    ) : (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1c4.96 0 9 4.04 9 9 0 1.94-.61 3.73-1.65 5.16-1.53-2-4.96-2.66-7.35-2.66s-5.82.66-7.35 2.66C3.61 15.73 3 13.94 3 12c0-4.96 4.04-9 9-9zm0 16c-1.7 0-3.26-.54-4.54-1.45 1.4-1.62 4.18-2.22 4.54-2.22s3.14.6 4.54 2.22C15.26 18.46 13.7 19 12 19zm0-10c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm0-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    )}
  </svg>
);

const YtHistory = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" style={{ fill: 'currentColor', stroke: 'transparent', strokeWidth: 0 }}>
    <path d="M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM22 12c0 5.51-4.49 10-10 10S2 17.51 2 12h1c0 4.96 4.04 9 9 9s9-4.04 9-9-4.04-9-9-9C8.81 3 5.92 4.64 4.28 7.38c-.11.18-.22.37-.31.56L3.94 8H8v1H1.96V3h1v4.74c.04-.09.07-.17.11-.25.11-.22.23-.42.35-.63C5.22 3.86 8.51 2 12 2c5.51 0 10 4.49 10 10z"/>
  </svg>
);
// ------------------------------------------

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ isOpen, activeTab, setActiveTab }: SidebarProps) {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = (session as any)?.accessToken;
      if (!token) return;
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.items) setSubscriptions(data.items);
      } catch (error) {
        console.error("Error fetching sidebar subscriptions:", error);
      }
    };
    fetchSubscriptions();
  }, [session]);

  if (!isOpen) {
    return (
      <aside className="w-[72px] h-[calc(100vh-56px)] bg-white dark:bg-[#0f0f0f] text-black dark:text-[#f1f1f1] flex flex-col items-center py-1 flex-shrink-0 z-10 transition-all duration-300">
        <MiniNavItem icon={<YtHome isActive={activeTab === "Home"} />} label="Home" isActive={activeTab === "Home"} onClick={() => setActiveTab("Home")} />
        <MiniNavItem icon={<YtShorts isActive={activeTab === "Shorts"} />} label="Shorts" isActive={activeTab === "Shorts"} onClick={() => setActiveTab("Shorts")} />
        <MiniNavItem icon={<YtSubscriptions isActive={activeTab === "Subscriptions"} />} label="Subscriptions" isActive={activeTab === "Subscriptions"} onClick={() => setActiveTab("Subscriptions")} />
        <MiniNavItem icon={<YtYou isActive={activeTab === "You"} />} label="You" isActive={activeTab === "You"} onClick={() => setActiveTab("You")} />
      </aside>
    );
  }

  return (
    <aside className="w-60 h-[calc(100vh-56px)] bg-white dark:bg-[#0f0f0f] text-black dark:text-[#f1f1f1] flex flex-col overflow-y-auto overflow-x-hidden scrollbar-none flex-shrink-0 pb-8 transition-all duration-300 z-10">
      <div className="px-3 py-3 border-b border-gray-200 dark:border-[#272727] flex flex-col gap-1">
        <FullNavItem icon={<YtHome isActive={activeTab === "Home"} />} label="Home" isActive={activeTab === "Home"} onClick={() => setActiveTab("Home")} />
        <FullNavItem icon={<YtShorts isActive={activeTab === "Shorts"} />} label="Shorts" isActive={activeTab === "Shorts"} onClick={() => setActiveTab("Shorts")} />
        <FullNavItem icon={<YtSubscriptions isActive={activeTab === "Subscriptions"} />} label="Subscriptions" isActive={activeTab === "Subscriptions"} onClick={() => setActiveTab("Subscriptions")} />
      </div>

      <div className="px-3 py-3 border-b border-gray-200 dark:border-[#272727] flex flex-col gap-1">
        <div className="px-3 py-2 flex items-center gap-2 text-[16px] font-bold hover:bg-gray-100 dark:hover:bg-[#272727] rounded-lg cursor-pointer w-fit mb-1">
          <span>You</span>
          <ChevronRight className="w-5 h-5 stroke-[2]" />
        </div>
        {!session && <FullNavItem icon={<YtYou isActive={activeTab === "You"} />} label="You" isActive={activeTab === "You"} onClick={() => setActiveTab("You")} />}
        <FullNavItem icon={<YtHistory />} label="History" isActive={activeTab === "History"} onClick={() => setActiveTab("History")} />
      </div>

      {!session && (
        <div className="py-4 px-8 border-b border-gray-200 dark:border-[#272727]">
          <p className="text-[14px] text-black dark:text-[#f1f1f1] mb-3 leading-[1.3rem]">
            Sign in to like videos, comment, and subscribe.
          </p>
          <button onClick={() => signIn("google")} className="flex items-center gap-2 border border-gray-300 dark:border-[#303030] text-blue-600 dark:text-[#3ea6ff] px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-50 dark:hover:bg-[#263850] transition-colors w-fit">
            <div className="w-5 h-5 flex items-center justify-center"><YtYou isActive={false} /></div>
            <span>Sign in</span>
          </button>
        </div>
      )}

      {session && subscriptions.length > 0 && (
        <div className="px-3 py-3 border-b border-gray-200 dark:border-[#272727] flex flex-col gap-1">
          <h3 className="px-3 py-2 text-[16px] font-bold">Subscriptions</h3>
          {subscriptions.map((sub) => (
            <div key={sub.id} className="flex items-center gap-4 px-3 py-2 rounded-lg text-[14px] hover:bg-gray-100 dark:hover:bg-[#272727] cursor-pointer">
              <img src={sub.snippet.thumbnails?.default?.url} alt="Channel" className="w-6 h-6 rounded-full object-cover" />
              <span className="truncate">{sub.snippet.title}</span>
            </div>
          ))}
        </div>
      )}

      <div className="px-3 py-3 border-b border-gray-200 dark:border-[#272727] flex flex-col gap-1">
        <h3 className="px-3 py-2 text-[16px] font-bold">Explore</h3>
        <FullNavItem icon={<Flame className="w-6 h-6 stroke-[1.2] fill-transparent" />} label="Trending" isActive={activeTab === "Trending"} onClick={() => setActiveTab("Trending")} />
        <FullNavItem icon={<ShoppingBag className="w-6 h-6 stroke-[1.2] fill-transparent" />} label="Shopping" isActive={activeTab === "Shopping"} onClick={() => setActiveTab("Shopping")} />
        <FullNavItem icon={<Music className="w-6 h-6 stroke-[1.2] fill-transparent" />} label="Music" isActive={activeTab === "Music"} onClick={() => setActiveTab("Music")} />
        <FullNavItem icon={<Film className="w-6 h-6 stroke-[1.2] fill-transparent" />} label="Movies & TV" isActive={activeTab === "Movies"} onClick={() => setActiveTab("Movies")} />
        <FullNavItem icon={<Gamepad2 className="w-6 h-6 stroke-[1.2] fill-transparent" />} label="Gaming" isActive={activeTab === "Gaming"} onClick={() => setActiveTab("Gaming")} />
        <FullNavItem icon={<Trophy className="w-6 h-6 stroke-[1.2] fill-transparent" />} label="Sports" isActive={activeTab === "Sports"} onClick={() => setActiveTab("Sports")} />
      </div>
    </aside>
  );
}

// Helpers
const MiniNavItem = ({ icon, label, isActive, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1.5 w-[64px] py-4 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] ${isActive ? "bg-gray-100 dark:bg-[#272727]" : ""}`}>
    <div className={`w-6 h-6 flex items-center justify-center ${isActive ? "text-black dark:text-white" : "text-black dark:text-[#f1f1f1]"}`}>
      {icon}
    </div>
    <span className="text-[10px] truncate w-full text-center">{label}</span>
  </button>
);

const FullNavItem = ({ icon, label, isActive, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-5 px-3 py-2.5 rounded-lg text-[14px] transition-colors w-full ${isActive ? "bg-gray-100 dark:bg-[#272727] font-semibold" : "hover:bg-gray-100 dark:hover:bg-[#272727] font-medium"}`}>
    <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 ${isActive ? "text-black dark:text-white" : "text-black dark:text-[#f1f1f1]"}`}>
      {icon}
    </div>
    <span className="truncate">{label}</span>
  </button>
);
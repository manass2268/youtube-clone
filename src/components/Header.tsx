"use client";

import React, { useState } from 'react';
import { Menu, Search, Mic, Video, Bell, User as UserIcon, MoreVertical } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Oswald } from 'next/font/google'; // Real YouTube font jaisa look dene ke liye

const oswald = Oswald({ subsets: ['latin'] });

interface HeaderProps {
  toggleSidebar: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ toggleSidebar, onSearch }: HeaderProps) {
  const { data: session } = useSession();
  const [inputVal, setInputVal] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) onSearch(inputVal);
  };

  return (
    <header className="flex items-center justify-between h-14 px-4 bg-white dark:bg-[#0f0f0f] text-black dark:text-[#f1f1f1] sticky top-0 z-50">
      {/* Left: Menu & Authentic Logo */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full transition-colors">
          <Menu className="w-6 h-6 stroke-[1.5]" />
        </button>
        
        <div onClick={() => router.push('/')} className="flex items-center gap-1 cursor-pointer" title="YouTube Home">
          {/* Real YouTube Red Play SVG */}
          <svg viewBox="0 0 24 24" className="w-[30px] h-[30px]" preserveAspectRatio="xMidYMid meet" focusable="false">
            <g>
              <path d="M21.58,6.49c-0.23-0.86-0.91-1.54-1.77-1.77C18.25,4.28,12,4.28,12,4.28s-6.25,0-7.81,0.44C3.33,4.95,2.65,5.63,2.42,6.49 C2,8.05,2,12,2,12s0,3.95,0.42,5.51c0.23,0.86,0.91,1.54,1.77,1.77c1.56,0.44,7.81,0.44,7.81,0.44s6.25,0,7.81-0.44 c0.86-0.23,1.54-0.91,1.77-1.77C22,15.95,22,12,22,12S22,8.05,21.58,6.49z" fill="#FF0000"></path>
              <path d="M9.9,15.46V8.54L15.92,12L9.9,15.46z" fill="#FFFFFF"></path>
            </g>
          </svg>
          {/* Authentic YouTube Text Typography */}
          <span className={`${oswald.className} text-[22px] font-semibold tracking-tighter`} style={{ letterSpacing: '-0.8px' }}>
            YouTube
          </span>
          <span className="text-[10px] text-[#aaaaaa] -mt-6 ml-0.5 font-sans">IN</span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-[720px] justify-center ml-10">
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full group">
          <div className="flex items-center w-full bg-transparent border border-gray-300 dark:border-[#303030] dark:bg-[#121212] rounded-l-full px-4 py-0.5 group-focus-within:border-[#1c62b9] group-focus-within:ml-[-32px] transition-all">
            <Search className="w-5 h-5 text-gray-400 hidden group-focus-within:block mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-transparent outline-none text-[16px] text-black dark:text-white placeholder-gray-500 py-1.5 font-normal"
            />
          </div>
          <button type="submit" className="bg-gray-100 dark:bg-[#222222] border border-l-0 border-gray-300 dark:border-[#303030] px-5 py-2 rounded-r-full hover:bg-gray-200 dark:hover:bg-[#272727] flex items-center justify-center">
            <Search className="w-6 h-6 stroke-[1.5] text-gray-600 dark:text-[#f1f1f1]" />
          </button>
        </form>
        <button className="p-2.5 bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 dark:hover:bg-[#272727] rounded-full hidden sm:flex items-center justify-center flex-shrink-0">
          <Mic className="w-6 h-6 stroke-[1.5]" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {session ? (
          <>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full hidden sm:block">
              <Video className="w-6 h-6 stroke-[1.5]" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full relative">
              <Bell className="w-6 h-6 stroke-[1.5]" />
              <span className="absolute top-1.5 right-1.5 bg-[#FF0000] text-white text-[10px] font-bold px-1 rounded-full border-2 border-[#0f0f0f]">9+</span>
            </button>
            <img src={session.user?.image || ""} alt="Profile" onClick={() => signOut()} className="w-8 h-8 rounded-full cursor-pointer object-cover ml-2" />
          </>
        ) : (
          <div className="flex items-center gap-1 sm:gap-3">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full hidden sm:block">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-[#f1f1f1]" />
            </button>
            <button onClick={() => signIn("google")} className="flex items-center gap-2 border border-gray-300 dark:border-[#303030] text-blue-600 dark:text-[#3ea6ff] px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-50 dark:hover:bg-[#263850] transition-colors">
              <UserIcon className="w-5 h-5" />
              <span>Sign in</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
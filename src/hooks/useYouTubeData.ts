/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export function useYouTubeData(
  selectedCategory: string,
  activeTab: string,
  urlSearchQuery: string | null
) {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [shorts, setShorts] = useState<any[]>([]);
  const [channelInfo, setChannelInfo] = useState<any>(null);
  const [isChannelView, setIsChannelView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState("");

  const enrichVideosWithChannels = async (items: any[]) => {
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const videoIds = items.map((item: any) => item.id?.videoId || item.id).join(',');
    if (!videoIds) return [];

    const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`);
    const detailsData = await detailsRes.json();
    if (!detailsData.items) return [];

    const channelIds = [...new Set(detailsData.items.map((item: any) => item.snippet.channelId))].join(',');
    const channelsRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${API_KEY}`);
    const channelsData = await channelsRes.json();

    const channelAvatarMap: Record<string, string> = {};
    channelsData.items?.forEach((ch: any) => {
      channelAvatarMap[ch.id] = ch.snippet.thumbnails?.default?.url || '';
    });

    return detailsData.items.map((vid: any) => ({
      ...vid,
      channelAvatar: channelAvatarMap[vid.snippet.channelId] || ''
    }));
  };

  const fetchYouTubeData = async (term = "", pageToken = "", isLoadMore = false) => {
    if (isLoadMore) setIsFetchingMore(true);
    else setLoading(true);

    try {
      const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      let queryTerm = term || (selectedCategory === "All" ? "latest trending videos india" : selectedCategory);
      const token = (session as any)?.accessToken;
      const headers: any = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
        headers.Accept = "application/json";
      }

      if (!isLoadMore) {
        setIsChannelView(false);
        setChannelInfo(null);
        setShorts([]);
      }

      if (selectedCategory === "Subscriptions" && token && !term) {
        let url = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet,contentDetails&mine=true&maxResults=20`;
        if (pageToken) url += `&pageToken=${pageToken}`;
        const res = await fetch(url, { headers });
        const data = await res.json();
        
        if (data.items) {
          setNextPageToken(data.nextPageToken || "");
          const mappedChannels = data.items.map((item: any) => ({
            id: item.snippet.resourceId.channelId,
            snippet: { ...item.snippet, channelTitle: "Subscribed Channel" },
          }));
          setVideos(isLoadMore ? prev => [...prev, ...mappedChannels] : mappedChannels);
        }
        setLoading(false); setIsFetchingMore(false);
        return;
      }

      if (selectedCategory === "Liked Videos" && token && !term) {
        let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&myRating=like&maxResults=20`;
        if (pageToken) url += `&pageToken=${pageToken}`;
        const res = await fetch(url, { headers });
        const data = await res.json();
        
        if (data.items) {
          setNextPageToken(data.nextPageToken || "");
          const enriched = await enrichVideosWithChannels(data.items);
          setVideos(isLoadMore ? prev => [...prev, ...enriched] : enriched);
        }
        setLoading(false); setIsFetchingMore(false);
        return;
      }

      if (!isLoadMore && selectedCategory !== "Subscriptions" && selectedCategory !== "Liked Videos") {
        const isChannelSearch = term.toLowerCase().includes("gamerz") || term.toLowerCase().includes("techno") || term.toLowerCase().includes("carryminati");

        if (isChannelSearch) {
          const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(term)}&key=${API_KEY}`);
          const channelData = await channelRes.json();

          if (channelData.items && channelData.items.length > 0) {
            const channelId = channelData.items[0].snippet.channelId;
            const statsRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${API_KEY}`);
            const statsData = await statsRes.json();
            
            if (statsData.items && statsData.items.length > 0) {
              setChannelInfo(statsData.items[0]);
              setIsChannelView(true);
              const channelVideosRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=12&order=date&type=video&key=${API_KEY}`);
              const cvData = await channelVideosRes.json();
              if (cvData.items) {
                const enriched = await enrichVideosWithChannels(cvData.items);
                setVideos(enriched);
              }
              setLoading(false);
              return;
            }
          }
        }

        if (!term) {
          const shortsRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=#shorts india&type=video&videoDuration=short&regionCode=IN&key=${API_KEY}`);
          const shortsData = await shortsRes.json();
          if (shortsData.items) {
            const shortIds = shortsData.items.map((item: any) => item.id.videoId).join(',');
            const sDetailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${shortIds}&key=${API_KEY}`);
            const sDetailsData = await sDetailsRes.json();
            setShorts(sDetailsData.items || []);
          }
        }
      }

      let searchUrl = (selectedCategory === "All" && token && !term) 
        ? `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&maxResults=16`
        : `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=16&q=${encodeURIComponent(queryTerm)}&type=video&order=relevance&regionCode=IN&key=${API_KEY}`;

      if (pageToken) searchUrl += `&pageToken=${pageToken}`;

      const searchRes = await fetch(searchUrl, { headers: (token && selectedCategory === "All" && !term) ? headers : undefined });
      const searchData = await searchRes.json();

      if (searchData.items) {
        setNextPageToken(searchData.nextPageToken || "");
        const enrichedVideos = await enrichVideosWithChannels(searchData.items);
        setVideos(isLoadMore ? prev => [...prev, ...enrichedVideos] : enrichedVideos);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
      fetchYouTubeData(urlSearchQuery);
    } else if (activeTab === "Home") {
      setSearchQuery("");
      setNextPageToken("");
      fetchYouTubeData();
    }
  }, [selectedCategory, activeTab, urlSearchQuery, session, status]);

  return {
    searchQuery, setSearchQuery,
    videos, shorts, channelInfo, isChannelView,
    loading, isFetchingMore, nextPageToken, fetchYouTubeData
  };
}
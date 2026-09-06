const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export async function getPopularVideos() {
  // part=snippet (Title, Thumbnail, Channel Name layega), statistics (Views layega)
  const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&chart=mostPopular&maxResults=12&regionCode=IN&key=${YOUTUBE_API_KEY}`;
  
  const res = await fetch(url, {
    // Next.js mein har 1 ghante mein nayi trending videos aayengi
    next: { revalidate: 3600 }, 
  });

  if (!res.ok) {
    throw new Error('Failed to fetch YouTube videos');
  }

  return res.json();
}
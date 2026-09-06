export const formatViews = (views: string | number) => {
  if (!views) return "0";
  const num = typeof views === "string" ? parseInt(views, 10) : views;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return views.toString();
};

export const parseDuration = (duration: string) => {
  if (!duration) return "0:00";
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";
  const h = match[1] ? parseInt(match[1].replace('H', '')) : 0;
  const m = match[2] ? parseInt(match[2].replace('M', '')) : 0;
  const s = match[3] ? parseInt(match[3].replace('S', '')) : 0;
  
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  return "Just now";
};
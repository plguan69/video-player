export interface Video {
  id: string;
  title: string;
  description: string;
  driveFileId: string;
  fallbackUrl?: string; // Fallback direct MP4 URL if Drive stream requires confirmation/auth
  thumbnail: string;
  duration: string;
  category: string;
  views: string;
  uploadDate: string;
  quality: string;
  author: {
    name: string;
    avatar: string;
  };
}

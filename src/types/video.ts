import { VideoStatus } from "./common";

export interface Video {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  isVip: boolean;
  videoUrl: string;
  thumbnail: string;
  description: string | null;
  hashtags: string[];
  views: number;
  likesCount: number;
  commentsCount: number;
  status: VideoStatus;
  isAdminVideo: boolean;
  isPinned: boolean;
  pinnedUntil: string | null;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Report {
  id: string;
  videoId: string | null;
  commentId: string | null;
  reason: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  createdAt: string;
}
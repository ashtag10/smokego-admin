"use client";

import { Video } from "@/types/video";
import { Play, Eye, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

interface VideoReviewCardProps {
  video: Video;
}

export function VideoReviewCard({ video }: VideoReviewCardProps) {
  const displayName = video.userName ?? "Utilisateur"; // ← AJOUTÉ
  const initial = displayName.charAt(0).toUpperCase(); // ← CORRIGÉ

  return (
    <div className="relative">
      <div className="aspect-[9/16] bg-smoke-dark relative group">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.description ?? "Vidéo"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="h-12 w-12 text-smoke-muted" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm line-clamp-2">{video.description ?? ""}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {video.views ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {video.likesCount ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {video.commentsCount ?? 0}
            </span>
          </div>
        </div>
      </div>
      <div className="p-3 flex items-center gap-3">
        {video.userAvatar ? (
          <Image
            src={video.userAvatar}
            alt={displayName}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-smoke-gold/10 flex items-center justify-center">
            <span className="text-xs text-smoke-gold font-bold">{initial}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-smoke-white truncate">{displayName}</p>
          {video.isVip && <span className="text-xs text-smoke-gold">VIP</span>}
        </div>
      </div>
    </div>
  );
}
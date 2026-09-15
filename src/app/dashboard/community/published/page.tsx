"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getVideos, pinVideo, deleteVideo } from "@/lib/api/community";
import { Video } from "@/types/video";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoReviewCard } from "@/components/community/video-review-card";
import { Pin, Trash2, Plus } from "lucide-react";

export default function PublishedVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      const res: any = await getVideos({ status: "APPROVED", limit: 100 });
      const items = res?.videos ?? res?.data ?? (Array.isArray(res) ? res : []);
      setVideos(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePin(id: string) {
    try {
      await pinVideo(id, new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString());
      loadVideos();
    } catch (err) {
      alert("Erreur lors de l'épinglage");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer définitivement cette vidéo ?")) return;
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-smoke-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-smoke-white">Vidéos publiées</h1>
        <Link href="/dashboard/community/new-video">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle vidéo
          </Button>
        </Link>
      </div>

      {(videos ?? []).length === 0 ? (
        <div className="text-center py-16 text-smoke-muted">
          <p className="text-lg">Aucune vidéo publiée</p>
          <Link href="/dashboard/community/new-video" className="inline-block mt-4">
            <Button variant="secondary">Publier une vidéo</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(videos ?? []).map((video) => (
            <div key={video.id} className="bg-smoke-card border border-smoke-border rounded-xl overflow-hidden">
              <VideoReviewCard video={video} />
              <div className="p-4 flex items-center justify-between border-t border-smoke-border">
                <div className="flex items-center gap-2">
                  {video.isPinned && <Badge variant="default">Épinglée</Badge>}
                  {video.isAdminVideo && <Badge variant="info">Officiel</Badge>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePin(video.id)}
                    className="p-2 text-smoke-muted hover:text-smoke-gold transition-colors"
                    title="Épingler 48h"
                  >
                    <Pin className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 text-smoke-muted hover:text-smoke-red transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
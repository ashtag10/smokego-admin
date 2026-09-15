"use client";

import { useEffect, useState } from "react";
import { getModerationQueue, approveVideo, rejectVideo } from "@/lib/api/community";
import { Video } from "@/types/video";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoReviewCard } from "@/components/community/video-review-card";
import { Check, X } from "lucide-react";

export default function ModerationQueuePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      const items = await getModerationQueue(50); // ← utilise la bonne route admin
      setVideos(Array.isArray(items) ? items : []);
    } catch (err: any) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      await approveVideo(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      console.error("Erreur APPROVE:", err);     // ← regarde ça dans F12 > Console
      alert(err.message || "Erreur lors de l'approbation");
    }
  }

  async function handleReject(id: string) {
    try {
      await rejectVideo(id, "Contenu inapproprié");
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      console.error("Erreur REJECT:", err);      // ← regarde ça dans F12 > Console
      alert(err.message || "Erreur lors du rejet");
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
        <h1 className="text-2xl font-bold text-smoke-white">Modération vidéo</h1>
        <Badge variant="warning">{videos.length} en attente</Badge>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16 text-smoke-muted">
          <p className="text-lg">Aucune vidéo en attente de modération</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-smoke-card border border-smoke-border rounded-xl overflow-hidden">
              <VideoReviewCard video={video} />
              <div className="p-4 flex gap-2 border-t border-smoke-border">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleReject(video.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
                <Button className="flex-1" onClick={() => handleApprove(video.id)}>
                  <Check className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
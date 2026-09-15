"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Video, X } from "lucide-react";
import { apiClient } from "@/lib/api/client"; // ← utiliser directement pour multipart
import { createVideo } from "@/lib/api/community";

export default function NewVideoPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validation
    if (selected.size > 100 * 1024 * 1024) {
      alert("Fichier trop volumineux (max 100 Mo)");
      return;
    }
    if (!selected.type.startsWith("video/")) {
      alert("Veuillez sélectionner un fichier vidéo");
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setPreviewUrl("");
    setProgress(0);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      alert("Sélectionne une vidéo depuis ton appareil");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload vers Cloudinary via le backend
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await apiClient.post("/media/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setProgress(percent);
        },
      });

      const { videoUrl, thumbnail } = uploadRes.data;

      // 2. Créer la vidéo admin
      await createVideo({
        videoUrl,
        thumbnail,
        description: description || undefined,
        hashtags: hashtags
          .split(" ")
          .map((h) => h.trim())
          .filter((h) => h.startsWith("#")),
        isAdminVideo: true,
      });

      alert("Vidéo publiée avec succès !");
      router.push("/dashboard/community/published");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la publication");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/community/published">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-smoke-white">Nouvelle vidéo admin</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-5">
        {/* Zone d'upload */}
        <div>
          <label className="block text-sm font-medium text-smoke-white mb-1.5">Vidéo *</label>
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-smoke-border rounded-xl cursor-pointer hover:border-smoke-gold/50 hover:bg-smoke-gold/5 transition-colors">
              <div className="flex flex-col items-center gap-2 text-smoke-muted">
                <Upload className="h-8 w-8" />
                <span className="text-sm">Clique pour sélectionner une vidéo</span>
                <span className="text-xs">MP4, max 100 Mo</span>
              </div>
              <input
                type="file"
                accept="video/mp4,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-smoke-border">
              <video src={previewUrl} controls className="w-full max-h-64 object-contain bg-black" />
              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-smoke-border">
                <div
                  className="h-full bg-smoke-gold transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-smoke-white mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="Décris ta vidéo..."
            className="w-full bg-smoke-dark border border-smoke-border rounded-lg px-4 py-2.5 text-sm text-smoke-white placeholder:text-smoke-muted focus:outline-none focus:border-smoke-gold/50 focus:ring-1 focus:ring-smoke-gold/20 resize-none"
          />
          <p className="text-xs text-smoke-muted mt-1">{description.length}/300</p>
        </div>

        <Input
          label="Hashtags (séparés par des espaces)"
          placeholder="#chicha #lounge #nouveau"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />

        <Button type="submit" className="w-full" disabled={uploading || !file}>
          {uploading ? `Upload ${progress}%...` : "Publier la vidéo"}
        </Button>
      </form>
    </div>
  );
}
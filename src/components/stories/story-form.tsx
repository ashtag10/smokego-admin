"use client";

import { useState, useCallback } from "react";
import { Story, StoryMediaType } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreateStoryData,
  CreateStoryItemData,
} from "@/lib/api/stories";
import { apiClient } from "@/lib/api/client";
import {
  Upload,
  X,
  Plus,
  GripVertical,
  Trash2,
} from "lucide-react";

interface StoryFormProps {
  initialData?: Story;
  onSubmit: (data: CreateStoryData) => Promise<void>;
}

interface DraftItem {
  _localId: string;
  _file?: File;
  _preview?: string;

  id?: string;
  mediaType: StoryMediaType;
  mediaUrl: string;
  duration?: number;
  linkUrl?: string;
  position: number;
}

let localIdCounter = 0;

const nextLocalId = () => `draft-${++localIdCounter}`;

export function StoryForm({
  initialData,
  onSubmit,
}: StoryFormProps) {
  const [title, setTitle] = useState(
    initialData?.title ?? "",
  );

  const [coverFile, setCoverFile] =
    useState<File | null>(null);

  const [coverPreview, setCoverPreview] = useState(
    initialData?.coverUrl ?? "",
  );

  const [isActive, setIsActive] = useState(
    initialData?.isActive ?? true,
  );

  const [position, setPosition] = useState(
    initialData?.position ?? 0,
  );

  const [items, setItems] = useState<DraftItem[]>(
    () =>
      initialData?.items.map((item) => ({
        id: item.id,
        _localId: nextLocalId(),
        mediaType: item.mediaType,
        mediaUrl: item.mediaUrl,
        duration: item.duration,
        linkUrl: item.linkUrl ?? undefined,
        position: item.position,
      })) ?? [],
  );

  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // COVER
  // ─────────────────────────────────────────────────────────────

  const handleCoverChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("Image trop volumineuse (max 5 Mo)");
        return;
      }

      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    },
    [],
  );

  // ─────────────────────────────────────────────────────────────
  // AJOUTER UN ÉLÉMENT
  // ─────────────────────────────────────────────────────────────

  function addItem(mediaType: StoryMediaType) {
    setItems((prev) => [
      ...prev,
      {
        _localId: nextLocalId(),
        mediaType,
        mediaUrl: "",
        duration:
          mediaType === "IMAGE" ? 5 : undefined,
        linkUrl: "",
        position: prev.length,
      },
    ]);
  }

  // ─────────────────────────────────────────────────────────────
  // SUPPRIMER UN ÉLÉMENT
  // ─────────────────────────────────────────────────────────────

  function removeItem(localId: string) {
    setItems((prev) => {
      const next = prev.filter(
        (item) => item._localId !== localId,
      );

      return next.map((item, index) => ({
        ...item,
        position: index,
      }));
    });
  }

  // ─────────────────────────────────────────────────────────────
  // MODIFIER UN ÉLÉMENT
  // ─────────────────────────────────────────────────────────────

  function updateItem<K extends keyof DraftItem>(
    localId: string,
    field: K,
    value: DraftItem[K],
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item._localId === localId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SÉLECTION DU FICHIER D'UN ITEM
  // ─────────────────────────────────────────────────────────────

  function handleItemFileChange(
    localId: string,
    mediaType: StoryMediaType,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const maxSize =
      mediaType === "VIDEO"
        ? 50 * 1024 * 1024
        : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        `Fichier trop volumineux (max ${
          mediaType === "VIDEO" ? "50 Mo" : "5 Mo"
        })`,
      );

      e.target.value = "";
      return;
    }

    updateItem(
      localId,
      "_file",
      file,
    );

    updateItem(
      localId,
      "_preview",
      URL.createObjectURL(file),
    );
  }

  // ─────────────────────────────────────────────────────────────
  // UPLOAD MÉDIA
  // ─────────────────────────────────────────────────────────────

  async function uploadFile(
    file: File,
    mediaType: StoryMediaType,
  ): Promise<string> {
    const fd = new FormData();

    fd.append("file", file);

    const endpoint =
      mediaType === "VIDEO"
        ? "/media/video"
        : "/media/image";

    const res = await apiClient.post(
      endpoint,
      fd,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },

        // Les vidéos peuvent prendre plusieurs secondes
        // à être envoyées et traitées par Cloudinary.
        timeout: 120000,
      },
    );

    console.log(
      `[STORY] Réponse upload ${mediaType}:`,
      res.data,
    );

    // L'API image retourne :
    // { url: "..." }
    //
    // L'API vidéo retourne :
    // { videoUrl: "...", thumbnail: "..." }

    const mediaUrl =
      mediaType === "VIDEO"
        ? res.data?.videoUrl
        : res.data?.url;

    if (
      !mediaUrl ||
      typeof mediaUrl !== "string"
    ) {
      console.error(
        `[STORY] URL média absente pour ${mediaType}:`,
        res.data,
      );

      throw new Error(
        `Le serveur n'a pas retourné l'URL du ${
          mediaType === "VIDEO"
            ? "vidéo"
            : "image"
        }.`,
      );
    }

    return mediaUrl;
  }

  // ─────────────────────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────────────────────

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Le titre de la story est obligatoire.");
      return;
    }

    if (items.length === 0) {
      alert(
        "Ajoute au moins un élément (image ou vidéo) à la story.",
      );
      return;
    }

    setLoading(true);

    try {
      // ────────────────────────────────────────────────────────
      // COVER
      // ────────────────────────────────────────────────────────

      let coverUrl =
        coverPreview && !coverFile
          ? coverPreview
          : "";

      if (coverFile) {
        coverUrl = await uploadFile(
          coverFile,
          "IMAGE",
        );
      }

      if (!coverUrl) {
        throw new Error(
          "La vignette de couverture est obligatoire.",
        );
      }

      // ────────────────────────────────────────────────────────
      // ITEMS
      // ────────────────────────────────────────────────────────

      const resolvedItems: CreateStoryItemData[] =
        [];

      for (const item of items) {
        let mediaUrl = item.mediaUrl;

        // Nouveau fichier sélectionné
        if (item._file) {
          mediaUrl = await uploadFile(
            item._file,
            item.mediaType,
          );
        }

        if (
          !mediaUrl ||
          typeof mediaUrl !== "string"
        ) {
          throw new Error(
            `L'élément ${
              item.position + 1
            } de la story n'a pas de média.`,
          );
        }

        resolvedItems.push({
          mediaType: item.mediaType,
          mediaUrl,
          duration: item.duration,
          linkUrl:
            item.linkUrl?.trim() || undefined,
          position: item.position,
        });
      }

      // ────────────────────────────────────────────────────────
      // CRÉATION / MODIFICATION DE LA STORY
      // ────────────────────────────────────────────────────────

      await onSubmit({
        title: title.trim(),
        coverUrl,
        isActive,
        position,
        items: resolvedItems,
      });
    } catch (error) {
      console.error(
        "[STORY] Erreur publication:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la publication de la story.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ────────────────────────────────────────────────────────
          INFORMATIONS GÉNÉRALES
      ──────────────────────────────────────────────────────── */}

      <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-5">
        <Input
          label="Titre de la story"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Position (ordre d'affichage)"
            type="number"
            value={position}
            onChange={(e) =>
              setPosition(
                parseInt(e.target.value) || 0,
              )
            }
          />

          <div className="flex items-end pb-2.5">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="storyActive"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(
                    e.target.checked,
                  )
                }
                className="h-4 w-4 rounded border-smoke-border text-smoke-gold"
              />

              <label
                htmlFor="storyActive"
                className="text-sm text-smoke-white"
              >
                Story active (visible sur le site)
              </label>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────
            COVER
        ────────────────────────────────────────────────────── */}

        <div>
          <label className="block text-sm font-medium text-smoke-white mb-1.5">
            Vignette de couverture *
          </label>

          {!coverPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-smoke-border rounded-xl cursor-pointer hover:border-smoke-gold/50 hover:bg-smoke-gold/5 transition-colors">
              <div className="flex flex-col items-center gap-2 text-smoke-muted">
                <Upload className="h-6 w-6" />

                <span className="text-sm">
                  Format portrait (ex: 300×400)
                </span>
              </div>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative w-32 h-40 rounded-xl overflow-hidden border border-smoke-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-full object-cover bg-smoke-dark"
              />

              <button
                type="button"
                onClick={() => {
                  setCoverFile(null);
                  setCoverPreview("");
                }}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          ITEMS DE LA STORY
      ──────────────────────────────────────────────────────── */}

      <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-smoke-white">
            Contenu de la story
          </h3>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                addItem("IMAGE")
              }
              className="flex items-center gap-1.5 text-xs font-medium text-smoke-gold hover:text-smoke-white transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Image
            </button>

            <button
              type="button"
              onClick={() =>
                addItem("VIDEO")
              }
              className="flex items-center gap-1.5 text-xs font-medium text-smoke-gold hover:text-smoke-white transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Vidéo
            </button>
          </div>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-smoke-muted">
            Aucun élément — ajoute au moins une
            image ou une vidéo.
          </p>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item._localId}
              className="border border-smoke-border rounded-lg p-4 space-y-3 relative"
            >
              {/* ───────────────────────────────────────────────
                  HEADER ITEM
              ─────────────────────────────────────────────── */}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-smoke-muted">
                  <GripVertical className="h-3.5 w-3.5" />

                  Élément {index + 1} —{" "}
                  {item.mediaType === "VIDEO"
                    ? "Vidéo"
                    : "Image"}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeItem(
                      item._localId,
                    )
                  }
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-smoke-muted hover:text-red-400 transition-colors"
                  aria-label="Supprimer cet élément"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* ───────────────────────────────────────────────
                  MÉDIA + PARAMÈTRES
              ─────────────────────────────────────────────── */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  {!item._preview &&
                  !item.mediaUrl ? (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-smoke-border rounded-lg cursor-pointer hover:border-smoke-gold/50 transition-colors">
                      <Upload className="h-4 w-4 text-smoke-muted" />

                      <span className="text-xs text-smoke-muted mt-1">
                        {item.mediaType ===
                        "VIDEO"
                          ? "Vidéo (max 50 Mo)"
                          : "Image (max 5 Mo)"}
                      </span>

                      <input
                        type="file"
                        accept={
                          item.mediaType ===
                          "VIDEO"
                            ? "video/mp4,video/quicktime"
                            : "image/jpeg,image/png,image/webp"
                        }
                        onChange={(e) =>
                          handleItemFileChange(
                            item._localId,
                            item.mediaType,
                            e,
                          )
                        }
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-smoke-border bg-smoke-dark">
                      {item.mediaType ===
                      "VIDEO" ? (
                        <video
                          src={
                            item._preview ||
                            item.mediaUrl
                          }
                          className="w-full h-full object-cover"
                          muted
                          controls
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            item._preview ||
                            item.mediaUrl
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          updateItem(
                            item._localId,
                            "_file",
                            undefined,
                          );

                          updateItem(
                            item._localId,
                            "_preview",
                            undefined,
                          );

                          updateItem(
                            item._localId,
                            "mediaUrl",
                            "",
                          );
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                        aria-label="Retirer le média"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* ─────────────────────────────────────────────
                    PARAMÈTRES ITEM
                ───────────────────────────────────────────── */}

                <div className="space-y-2">
                  {item.mediaType ===
                    "IMAGE" && (
                    <Input
                      label="Durée (secondes)"
                      type="number"
                      min="1"
                      value={
                        item.duration ?? 5
                      }
                      onChange={(e) =>
                        updateItem(
                          item._localId,
                          "duration",
                          parseInt(
                            e.target.value,
                          ) || 5,
                        )
                      }
                    />
                  )}

                  <Input
                    label="Lien produit (optionnel)"
                    value={
                      item.linkUrl ?? ""
                    }
                    onChange={(e) =>
                      updateItem(
                        item._localId,
                        "linkUrl",
                        e.target.value,
                      )
                    }
                    placeholder="/shop/chicha-celeste"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          SUBMIT
      ──────────────────────────────────────────────────────── */}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Publication..."
          : initialData
            ? "Mettre à jour"
            : "Créer la story"}
      </Button>
    </form>
  );
}
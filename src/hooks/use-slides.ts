import { useState, useEffect, useCallback } from "react";
import { getSlides } from "@/lib/api/slides";
import { Slide } from "@/types/slide";

export function useSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSlides(await getSlides());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  return { slides, loading, error, refetch: fetchSlides };
}
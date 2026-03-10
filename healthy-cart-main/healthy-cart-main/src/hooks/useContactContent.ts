import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { ContactContent } from "@/types/site";

export function useContactContent() {
  const [content, setContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadContactContent() {
      try {
        const data = await apiFetch<ContactContent>("/site/contact");

        if (cancelled) {
          return;
        }

        setContent(data);
        setError(null);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load contact details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadContactContent();

    return () => {
      cancelled = true;
    };
  }, []);

  return { content, loading, error };
}

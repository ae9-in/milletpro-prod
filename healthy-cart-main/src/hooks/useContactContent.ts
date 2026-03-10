import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { ContactContent } from "@/types/site";

const CONTACT_OVERRIDES = {
  phone: {
    value: "8431119696",
    detail: "Mon to Sat, 9:00 AM to 6:00 PM",
  },
  address: {
    value: "48, Church St, Haridevpur, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001",
    detail: "Bengaluru, Karnataka 560001",
  },
} as const;

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

        setContent({
          ...data,
          contactCards: data.contactCards.map((card) => {
            const override = CONTACT_OVERRIDES[card.key as keyof typeof CONTACT_OVERRIDES];
            return override ? { ...card, ...override } : card;
          }),
        });
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

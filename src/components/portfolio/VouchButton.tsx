"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface VouchButtonProps {
  profileId: string;
  onChange?: (next: { hasVouched: boolean; count?: number }) => void;
}

export default function VouchButton({ profileId, onChange }: VouchButtonProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasVouched, setHasVouched] = useState<boolean>(false);

  // Fetch initial state
  // Note: keeping it minimal; page can also hydrate via parent fetch if needed
  async function refresh() {
    if (!profileId) return;
    try {
      const res = await fetch(`/api/profiles/${profileId}/vouches`, {
        headers: user?.googleId ? { "x-user-googleid": user.googleId } as any : undefined,
      });
      const data = await res.json();
      if (res.ok) {
        setHasVouched(!!data?.data?.hasVouched);
        onChange?.({ hasVouched: !!data?.data?.hasVouched, count: data?.data?.count });
      }
    } catch {}
  }

  const handleVouch = async () => {
    setError(null);
    if (!user?.googleId) {
      setError("Please sign in to vouch");
      return;
    }
    setLoading(true);
    try {
      const method = hasVouched ? "DELETE" : "POST";
      const res = await fetch(`/api/profiles/${profileId}/vouches`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-googleid": user.googleId,
        },
        body: method === "POST" ? JSON.stringify({}) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to vouch");
      setHasVouched(!hasVouched);
      onChange?.({ hasVouched: !hasVouched });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !user || user.role !== "STUDENT";

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleVouch}
        disabled={disabled}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        aria-disabled={disabled}
      >
        {loading ? (hasVouched ? "Unvouching..." : "Vouching...") : hasVouched ? "Unvouch" : "Vouch"}
      </button>
      {error && <p className="mt-2 text-sm text-feature-red font-bold">{error}</p>}
    </div>
  );
}



import { useCallback, useState } from "react";
import type { Shot } from "@/types";

export function useShots() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [pendingShot, setPendingShot] = useState<Shot | null>(null);

  const markShot = useCallback((time: number) => {
    setPendingShot({
      id: crypto.randomUUID(),
      shotTime: time,
      landingTime: null,
    });
  }, []);

  const markLanding = useCallback(
    (time: number) => {
      if (!pendingShot) return;
      const completed: Shot = { ...pendingShot, landingTime: time };
      setShots((prev) => [...prev, completed]);
      setPendingShot(null);
    },
    [pendingShot],
  );

  const clearPending = useCallback(() => {
    setPendingShot(null);
  }, []);

  const removeShot = useCallback((id: string) => {
    setShots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setShots([]);
    setPendingShot(null);
  }, []);

  return {
    shots,
    pendingShot,
    markShot,
    markLanding,
    clearPending,
    removeShot,
    clearAll,
  };
}

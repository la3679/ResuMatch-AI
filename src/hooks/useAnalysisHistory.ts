import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { fetchAnalyses, deleteAnalysis } from '../services/firebaseService';
import type { AnalysisRecord } from '../types/application';

interface UseAnalysisHistory {
  items: AnalysisRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

/** Loads and manages the signed-in user's saved resume analyses. */
export function useAnalysisHistory(): UseAnalysisHistory {
  const { user } = useAuth();
  const [items, setItems] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchAnalyses(user.uid));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const remove = useCallback(
    async (id: string) => {
      await deleteAnalysis(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, error, refresh, remove };
}

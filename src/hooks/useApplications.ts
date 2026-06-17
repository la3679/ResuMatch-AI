import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import {
  fetchApplications,
  deleteApplication,
  updateApplicationStatus,
} from '../services/firebaseService';
import type { ApplicationRecord, ApplicationStatus } from '../types/application';

interface UseApplications {
  items: ApplicationRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  setStatus: (id: string, status: ApplicationStatus) => Promise<void>;
}

/** Loads and manages the signed-in user's saved applications. */
export function useApplications(): UseApplications {
  const { user } = useAuth();
  const [items, setItems] = useState<ApplicationRecord[]>([]);
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
      setItems(await fetchApplications(user.uid));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const remove = useCallback(async (id: string) => {
    await deleteApplication(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setStatus = useCallback(async (id: string, status: ApplicationStatus) => {
    await updateApplicationStatus(id, status);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, error, refresh, remove, setStatus };
}

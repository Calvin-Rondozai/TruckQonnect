import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { PlaceLoadDraft, PostedLoad } from '@/lib/types';

const KEY = '@truckq_posted_loads';

type ContextValue = {
  loads: PostedLoad[];
  loaded: boolean;
  postLoad: (
    draft: PlaceLoadDraft,
    meta?: { code?: string; shipmentLoadId?: string }
  ) => Promise<PostedLoad>;
};

const PostedLoadsContext = createContext<ContextValue | null>(null);

function makeCode() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `#TQ${n}`;
}

export function PostedLoadsProvider({ children }: { children: React.ReactNode }) {
  const [loads, setLoads] = useState<PostedLoad[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setLoads(JSON.parse(raw) as PostedLoad[]);
      } catch {
        /* ignore */
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback((next: PostedLoad[]) => {
    void AsyncStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const postLoad = useCallback(
    async (draft: PlaceLoadDraft, meta?: { code?: string; shipmentLoadId?: string }) => {
      const entry: PostedLoad = {
        id: `load-${Date.now()}`,
        code: meta?.code ?? makeCode(),
        shipmentLoadId: meta?.shipmentLoadId,
        ...draft,
        status: 'open',
        postedAt: new Date().toISOString(),
      };
      setLoads((prev) => {
        const next = [entry, ...prev];
        persist(next);
        return next;
      });
      return entry;
    },
    [persist],
  );

  const value = useMemo(() => ({ loads, loaded, postLoad }), [loads, loaded, postLoad]);

  return <PostedLoadsContext.Provider value={value}>{children}</PostedLoadsContext.Provider>;
}

export function usePostedLoads() {
  const ctx = useContext(PostedLoadsContext);
  if (!ctx) throw new Error('usePostedLoads must be used within PostedLoadsProvider');
  return ctx;
}

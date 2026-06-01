import { useCallback, useState } from "react";

import { deleteList, getLists, type TaskList } from "@/lib/endpoints";

/** Loads the current user's task lists and exposes reload + optimistic delete. */
export function useLists() {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setError(null);
      const data = await getLists();
      setLists(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las listas");
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(
    async (id: string) => {
      const snapshot = lists;
      setLists((prev) => prev.filter((l) => l.uuid !== id));
      try {
        await deleteList(id);
      } catch {
        setLists(snapshot);
      }
    },
    [lists]
  );

  return { lists, loading, error, reload, remove };
}

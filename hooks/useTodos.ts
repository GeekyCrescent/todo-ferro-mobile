import { useCallback, useState } from "react";

import {
  deleteTodo,
  getMyTodos,
  toggleTodo,
  type Todo,
} from "@/lib/endpoints";

/**
 * Loads the current user's todos and exposes optimistic toggle/delete.
 * Screens call `reload()` from a focus effect to stay fresh after edits.
 */
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setError(null);
      const data = await getMyTodos();
      setTodos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle = useCallback(async (id: string) => {
    // Optimistic flip
    setTodos((prev) =>
      prev.map((t) => (t.uuid === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      const updated = await toggleTodo(id);
      // The toggle response omits categories (loaded lazily server-side), so
      // keep the ones we already know to avoid the chips flickering away.
      setTodos((prev) =>
        prev.map((t) =>
          t.uuid === id ? { ...updated, categories: t.categories } : t
        )
      );
    } catch {
      // Revert on failure
      setTodos((prev) =>
        prev.map((t) => (t.uuid === id ? { ...t, completed: !t.completed } : t))
      );
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    const snapshot = todos;
    setTodos((prev) => prev.filter((t) => t.uuid !== id));
    try {
      await deleteTodo(id);
    } catch {
      setTodos(snapshot);
    }
  }, [todos]);

  return { todos, loading, error, reload, toggle, remove, setLoading };
}

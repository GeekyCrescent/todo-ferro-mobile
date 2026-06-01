import type { Priority, Todo } from "./endpoints";
import { daysFromToday, isOverdue } from "./format";
import { PRIORITY_META } from "@/theme/tokens";

export type StatusFilter = "all" | "active" | "completed";
export type SortKey = "smart" | "due" | "priority" | "created";

export type TodoFilters = {
  search: string;
  status: StatusFilter;
  priority: Priority | null;
  categoryId: string | null;
  sort: SortKey;
};

export const DEFAULT_FILTERS: TodoFilters = {
  search: "",
  status: "all",
  priority: null,
  categoryId: null,
  sort: "smart",
};

const priorityWeight = (t: Todo) =>
  t.priority ? PRIORITY_META[t.priority].weight : 0;

const dueValue = (t: Todo) =>
  t.dueDate ? new Date(t.dueDate).getTime() : Number.MAX_SAFE_INTEGER;

const createdValue = (t: Todo) =>
  t.createdAt ? new Date(t.createdAt).getTime() : 0;

/** Smart score: overdue first, then due soon, then priority. */
const smartScore = (t: Todo): number => {
  if (t.completed) return 1_000_000;
  let score = 0;
  if (t.dueDate) {
    const d = daysFromToday(t.dueDate);
    score += d < 0 ? d * 100 : d; // overdue gets strongly negative
  } else {
    score += 500;
  }
  score -= priorityWeight(t) * 10;
  return score;
};

export const applyFilters = (todos: Todo[], f: TodoFilters): Todo[] => {
  const q = f.search.trim().toLowerCase();

  const filtered = todos.filter((t) => {
    if (f.status === "active" && t.completed) return false;
    if (f.status === "completed" && !t.completed) return false;
    if (f.priority && t.priority !== f.priority) return false;
    if (f.categoryId && !(t.categories ?? []).some((c) => c.uuid === f.categoryId))
      return false;
    if (q) {
      const haystack = `${t.title} ${t.description ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered];
  switch (f.sort) {
    case "due":
      sorted.sort((a, b) => dueValue(a) - dueValue(b));
      break;
    case "priority":
      sorted.sort((a, b) => priorityWeight(b) - priorityWeight(a));
      break;
    case "created":
      sorted.sort((a, b) => createdValue(b) - createdValue(a));
      break;
    case "smart":
    default:
      sorted.sort((a, b) => smartScore(a) - smartScore(b));
      break;
  }
  return sorted;
};

export type TodoStats = {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  dueToday: number;
  progress: number; // 0..1
};

export const computeStats = (todos: Todo[]): TodoStats => {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const overdue = todos.filter((t) => isOverdue(t.dueDate, t.completed)).length;
  const dueToday = todos.filter(
    (t) => !t.completed && t.dueDate && daysFromToday(t.dueDate) === 0
  ).length;
  return {
    total,
    completed,
    active: total - completed,
    overdue,
    dueToday,
    progress: total === 0 ? 0 : completed / total,
  };
};

export const hasActiveFilters = (f: TodoFilters): boolean =>
  f.search.trim().length > 0 ||
  f.status !== "all" ||
  f.priority !== null ||
  f.categoryId !== null;

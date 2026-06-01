import type { Priority } from "@/lib/endpoints";

/**
 * Design tokens — clean, minimal light theme (Todoist/Things vibe).
 * Flat light-gray canvas, opaque white cards, subtle hairline borders and a
 * single teal accent used sparingly. No glass, no busy gradients.
 */

export const palette = {
  // App canvas + surfaces.
  bg: "#F4F5F7",
  surface: "#FFFFFF",
  surfaceMuted: "#F9FAFB",

  // Accent (teal) — used sparingly for actions / active states.
  accent: "#0D9488",
  accentBright: "#14B8A6",
  accentSoft: "rgba(13, 148, 136, 0.10)",

  // Visible control border — for chips/inputs/selectors that sit directly on
  // the gray canvas (a white fill alone gets lost, so the border defines them).
  border: "#D1D5DB",

  // Back-compat keys (components still reference these). Mapped to the clean
  // surface/border values so nothing looks translucent anymore.
  glass: "#FFFFFF",
  glassStrong: "#FFFFFF",
  glassBorder: "#E5E7EB",
  glassHairline: "#D1D5DB",

  // Text.
  text: "#111827", // gray-900
  textMuted: "#6B7280", // gray-500/600
  textFaint: "#9CA3AF", // gray-400 (icons / placeholders only)

  // States.
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",

  white: "#FFFFFF",
};

export type PriorityMeta = {
  label: string;
  color: string;
  tint: string;
  icon: "flag" | "flag-outline";
  weight: number;
};

export const PRIORITY_META: Record<Priority, PriorityMeta> = {
  HIGH: {
    label: "Alta",
    color: "#EF4444",
    tint: "rgba(239, 68, 68, 0.10)",
    icon: "flag",
    weight: 3,
  },
  MEDIUM: {
    label: "Media",
    color: "#F59E0B",
    tint: "rgba(245, 158, 11, 0.12)",
    icon: "flag",
    weight: 2,
  },
  LOW: {
    label: "Baja",
    color: "#10B981",
    tint: "rgba(16, 185, 129, 0.11)",
    icon: "flag-outline",
    weight: 1,
  },
};

/** Curated palette offered when creating a new category. */
export const CATEGORY_COLORS = [
  "#0D9488",
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#4F46E5",
  "#0891B2",
  "#64748B",
];

/** Very soft shadow — barely-there separation for white cards. */
export const glassShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 2,
};

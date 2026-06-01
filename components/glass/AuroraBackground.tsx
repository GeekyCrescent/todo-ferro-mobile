import { ReactNode } from "react";
import { View } from "react-native";

import { palette } from "@/theme/tokens";

type Props = { children: ReactNode };

/**
 * App background. Intentionally a flat, clean light-gray canvas — the
 * prettiness comes from the white cards, spacing and the single teal accent,
 * not from a busy gradient.
 */
export default function AuroraBackground({ children }: Props) {
  return <View style={{ flex: 1, backgroundColor: palette.bg }}>{children}</View>;
}

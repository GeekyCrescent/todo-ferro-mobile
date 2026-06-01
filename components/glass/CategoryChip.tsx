import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { palette } from "@/theme/tokens";
import type { Category } from "@/lib/endpoints";

type Props = { category: Category; small?: boolean };

/** Converts a hex color to an rgba tint for the chip background. */
const tint = (hex?: string | null, alpha = 0.14): string => {
  if (!hex || !/^#([0-9a-f]{6})$/i.test(hex)) return palette.accentSoft;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function CategoryChip({ category, small }: Props) {
  const color = category.color ?? palette.accent;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: tint(color),
        paddingHorizontal: small ? 8 : 10,
        paddingVertical: small ? 3 : 5,
        borderRadius: 999,
      }}
    >
      <View
        style={{
          width: small ? 6 : 7,
          height: small ? 6 : 7,
          borderRadius: 999,
          backgroundColor: color,
        }}
      />
      <Text
        style={{ color: palette.textMuted, fontSize: small ? 11 : 12, fontWeight: "600" }}
      >
        {category.name}
      </Text>
    </View>
  );
}

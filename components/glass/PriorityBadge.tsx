import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { PRIORITY_META } from "@/theme/tokens";
import type { Priority } from "@/lib/endpoints";

type Props = { priority: Priority; small?: boolean };

export default function PriorityBadge({ priority, small }: Props) {
  const meta = PRIORITY_META[priority];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: meta.tint,
        paddingHorizontal: small ? 8 : 10,
        paddingVertical: small ? 3 : 5,
        borderRadius: 999,
      }}
    >
      <Ionicons name={meta.icon} size={small ? 11 : 13} color={meta.color} />
      <Text
        style={{
          color: meta.color,
          fontSize: small ? 11 : 12,
          fontWeight: "700",
        }}
      >
        {meta.label}
      </Text>
    </View>
  );
}

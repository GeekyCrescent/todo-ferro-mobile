import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import GlassCard from "./GlassCard";
import { palette } from "@/theme/tokens";
import type { TaskList } from "@/lib/endpoints";

type Props = {
  list: TaskList;
  onPress: (list: TaskList) => void;
  onEdit: (list: TaskList) => void;
};

export default function ListCard({ list, onPress, onEdit }: Props) {
  const color = list.color ?? palette.accent;
  const count = list.todoCount ?? 0;

  return (
    <Pressable onPress={() => onPress(list)} style={{ marginBottom: 12 }}>
      <GlassCard style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          {/* Color icon tile */}
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              backgroundColor: `${color}22`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="list" size={24} color={color} />
          </View>

          {/* Texts */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16.5, fontWeight: "700", color: palette.text }}>
              {list.name}
            </Text>
            {list.description ? (
              <Text
                numberOfLines={1}
                style={{ fontSize: 13, color: palette.textMuted, marginTop: 2 }}
              >
                {list.description}
              </Text>
            ) : (
              <Text style={{ fontSize: 13, color: palette.textMuted, marginTop: 2 }}>
                {count} {count === 1 ? "tarea" : "tareas"}
              </Text>
            )}
          </View>

          {/* Count badge + edit */}
          {list.description ? (
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: "#EEF0F2",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: palette.textMuted }}>
                {count}
              </Text>
            </View>
          ) : null}

          <Pressable onPress={() => onEdit(list)} hitSlop={10} style={{ padding: 4 }}>
            <Ionicons name="ellipsis-vertical" size={18} color={palette.textFaint} />
          </Pressable>
        </View>
      </GlassCard>
    </Pressable>
  );
}

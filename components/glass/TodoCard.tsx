import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import CategoryChip from "./CategoryChip";
import GlassCard from "./GlassCard";
import { formatDueDate, isDueSoon, isOverdue } from "@/lib/format";
import { palette, PRIORITY_META } from "@/theme/tokens";
import type { Todo } from "@/lib/endpoints";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onPress: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

export default function TodoCard({ todo, onToggle, onPress, onDelete }: Props) {
  const done = !!todo.completed;
  const overdue = isOverdue(todo.dueDate, done);
  const dueSoon = isDueSoon(todo.dueDate, done);
  const dueColor = overdue ? palette.danger : dueSoon ? palette.warning : palette.textMuted;
  const prio = todo.priority ? PRIORITY_META[todo.priority] : null;

  const hasMeta = !!todo.dueDate || (todo.categories ?? []).length > 0;

  return (
    <Pressable onPress={() => onPress(todo)} style={{ marginBottom: 10 }}>
      <GlassCard style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 13 }}>
          {/* Toggle circle */}
          <Pressable
            onPress={() => onToggle(todo.uuid)}
            hitSlop={10}
            style={{
              width: 24,
              height: 24,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: done ? palette.accent : "#D1D5DB",
              backgroundColor: done ? palette.accent : "transparent",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            {done ? <Ionicons name="checkmark" size={15} color={palette.white} /> : null}
          </Pressable>

          {/* Content */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              {prio ? (
                <Ionicons name={prio.icon} size={13} color={done ? palette.textFaint : prio.color} />
              ) : null}
              <Text
                style={{
                  flex: 1,
                  fontSize: 15.5,
                  fontWeight: "600",
                  lineHeight: 21,
                  color: done ? palette.textFaint : palette.text,
                  textDecorationLine: done ? "line-through" : "none",
                }}
              >
                {todo.title}
              </Text>
            </View>

            {todo.description ? (
              <Text
                numberOfLines={2}
                style={{ fontSize: 13.5, lineHeight: 19, color: palette.textMuted, marginTop: 3 }}
              >
                {todo.description}
              </Text>
            ) : null}

            {hasMeta ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 9,
                }}
              >
                {todo.dueDate ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Ionicons
                      name={overdue ? "alert-circle" : "calendar-outline"}
                      size={13}
                      color={dueColor}
                    />
                    <Text style={{ fontSize: 12.5, fontWeight: "600", color: dueColor }}>
                      {formatDueDate(todo.dueDate)}
                    </Text>
                  </View>
                ) : null}

                {(todo.categories ?? []).map((c) => (
                  <CategoryChip key={c.uuid} category={c} small />
                ))}
              </View>
            ) : null}
          </View>

          {/* Delete */}
          <Pressable onPress={() => onDelete(todo.uuid)} hitSlop={10} style={{ padding: 2, marginTop: 1 }}>
            <Ionicons name="trash-outline" size={18} color="#D1D5DB" />
          </Pressable>
        </View>
      </GlassCard>
    </Pressable>
  );
}

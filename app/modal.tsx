import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuroraBackground from "@/components/glass/AuroraBackground";
import TodoForm, { type TodoFormValue } from "@/components/glass/TodoForm";
import { palette } from "@/theme/tokens";
import type { Priority } from "@/lib/endpoints";

const parseIds = (raw?: string): string[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function TodoModalScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    listId?: string;
    categoryIds?: string;
  }>();

  // Build an initial value when editing (has id) OR when creating inside a list
  // (has listId), so the task is pre-assigned to that list.
  const initial: TodoFormValue | undefined =
    params.id || params.listId
      ? {
          id: params.id,
          title: params.title,
          description: params.description,
          priority: (params.priority as Priority) || "MEDIUM",
          dueDate: params.dueDate || null,
          listId: params.listId || null,
          categoryIds: parseIds(params.categoryIds),
        }
      : undefined;

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingHorizontal: 16,
              paddingTop: 8,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                backgroundColor: palette.glassStrong,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: palette.glassHairline,
              }}
            >
              <Ionicons name="close" size={20} color={palette.textMuted} />
            </Pressable>
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <TodoForm initial={initial} onDone={() => router.back()} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </AuroraBackground>
    </View>
  );
}

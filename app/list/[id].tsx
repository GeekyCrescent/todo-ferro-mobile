import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuroraBackground from "@/components/glass/AuroraBackground";
import GlassCard from "@/components/glass/GlassCard";
import TodoCard from "@/components/glass/TodoCard";
import { Text } from "@/components/ui/text";
import {
  deleteList,
  deleteTodo,
  getListTodos,
  toggleTodo,
  type Todo,
} from "@/lib/endpoints";
import { applyFilters, DEFAULT_FILTERS } from "@/lib/todoUtils";
import { palette } from "@/theme/tokens";

export default function ListDetailScreen() {
  const { id, name, color } = useLocalSearchParams<{
    id: string;
    name?: string;
    color?: string;
  }>();
  const accent = color || palette.accent;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getListTodos(id);
      setTodos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const onToggle = async (todoId: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.uuid === todoId ? { ...t, completed: !t.completed } : t))
    );
    try {
      const updated = await toggleTodo(todoId);
      setTodos((prev) =>
        prev.map((t) => (t.uuid === todoId ? { ...updated, categories: t.categories } : t))
      );
    } catch {
      setTodos((prev) =>
        prev.map((t) => (t.uuid === todoId ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  const onDelete = async (todoId: string) => {
    const snapshot = todos;
    setTodos((prev) => prev.filter((t) => t.uuid !== todoId));
    try {
      await deleteTodo(todoId);
    } catch {
      setTodos(snapshot);
    }
  };

  const openEdit = (todo: Todo) =>
    router.push({
      pathname: "/modal",
      params: {
        id: todo.uuid,
        title: todo.title,
        description: todo.description ?? "",
        priority: todo.priority ?? "MEDIUM",
        dueDate: todo.dueDate ?? "",
        listId: id,
        categoryIds: JSON.stringify((todo.categories ?? []).map((c) => c.uuid)),
      },
    });

  const confirmDeleteList = () => {
    Alert.alert("Borrar lista", `¿Borrar "${name}"? Las tareas no se eliminan.`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteList(id);
            router.back();
          } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo borrar la lista");
          }
        },
      },
    ]);
  };

  const visible = applyFilters(todos, DEFAULT_FILTERS);
  const done = todos.filter((t) => t.completed).length;

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 16,
              paddingTop: 8,
            }}
          >
            <Pressable onPress={() => router.back()} hitSlop={10} style={{ padding: 4 }}>
              <Ionicons name="chevron-back" size={26} color={palette.text} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: palette.text }}>
                {name ?? "Lista"}
              </Text>
              <Text style={{ fontSize: 13, color: palette.textMuted }}>
                {done}/{todos.length} completadas
              </Text>
            </View>
            <View style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: accent }} />
            <Pressable onPress={confirmDeleteList} hitSlop={10} style={{ padding: 4 }}>
              <Ionicons name="trash-outline" size={20} color={palette.textFaint} />
            </Pressable>
          </View>

          {loading && todos.length === 0 ? (
            <View style={{ marginTop: 80, alignItems: "center" }}>
              <ActivityIndicator size="large" color={palette.accent} />
            </View>
          ) : (
            <FlatList
              data={visible}
              keyExtractor={(item) => item.uuid}
              contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.accent} />
              }
              renderItem={({ item }) => (
                <TodoCard todo={item} onToggle={onToggle} onPress={openEdit} onDelete={onDelete} />
              )}
              ListEmptyComponent={
                <GlassCard style={{ padding: 28, alignItems: "center", marginTop: 20 }}>
                  <Ionicons name="checkmark-done-outline" size={30} color={palette.accent} />
                  <Text style={{ color: palette.text, fontWeight: "700", marginTop: 10 }}>
                    Lista vacía
                  </Text>
                  <Text style={{ color: palette.textMuted, marginTop: 4, textAlign: "center" }}>
                    Agrega tareas con el botón +.
                  </Text>
                </GlassCard>
              }
            />
          )}

          {error ? (
            <View style={{ position: "absolute", bottom: 90, left: 20, right: 20 }}>
              <GlassCard style={{ padding: 12 }}>
                <Text style={{ color: palette.danger, textAlign: "center" }}>{error}</Text>
              </GlassCard>
            </View>
          ) : null}
        </SafeAreaView>

        {/* FAB nueva tarea en esta lista */}
        <Pressable
          onPress={() => router.push({ pathname: "/modal", params: { listId: id } })}
          style={{
            position: "absolute",
            right: 24,
            bottom: 28,
            width: 60,
            height: 60,
            borderRadius: 999,
            backgroundColor: palette.accent,
            alignItems: "center",
            justifyContent: "center",
            elevation: 6,
          }}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </Pressable>
      </AuroraBackground>
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuroraBackground from "@/components/glass/AuroraBackground";
import FilterChip from "@/components/glass/FilterChip";
import GlassCard from "@/components/glass/GlassCard";
import TodoCard from "@/components/glass/TodoCard";
import { Text } from "@/components/ui/text";
import { useTodos } from "@/hooks/useTodos";
import type { Priority, Todo } from "@/lib/endpoints";
import {
  applyFilters,
  DEFAULT_FILTERS,
  hasActiveFilters,
  type SortKey,
  type StatusFilter,
  type TodoFilters,
} from "@/lib/todoUtils";
import { palette, PRIORITY_META } from "@/theme/tokens";

const STATUS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "active", label: "Pendientes" },
  { key: "completed", label: "Hechas" },
];

const PRIORITIES: Priority[] = ["HIGH", "MEDIUM", "LOW"];

const SORTS: { key: SortKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "created", label: "Recientes", icon: "time" },
  { key: "smart", label: "Inteligente", icon: "sparkles" },
  { key: "due", label: "Fecha", icon: "calendar" },
  { key: "priority", label: "Prioridad", icon: "flag" },
];

export default function AllTasksScreen() {
  const { todos, loading, error, reload, toggle, remove } = useTodos();
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<TodoFilters>({ ...DEFAULT_FILTERS, sort: "created" });

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const visible = useMemo(() => applyFilters(todos, filters), [todos, filters]);
  const set = (patch: Partial<TodoFilters>) => setFilters((prev) => ({ ...prev, ...patch }));

  const openEdit = (todo: Todo) =>
    router.push({
      pathname: "/modal",
      params: {
        id: todo.uuid,
        title: todo.title,
        description: todo.description ?? "",
        priority: todo.priority ?? "MEDIUM",
        dueDate: todo.dueDate ?? "",
        listId: todo.listId ?? "",
        categoryIds: JSON.stringify((todo.categories ?? []).map((c) => c.uuid)),
      },
    });

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          {/* Header + búsqueda */}
          <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
            <Text style={{ fontSize: 30, fontWeight: "800", color: palette.text }}>
              Todas las tareas
            </Text>
            <GlassCard style={{ marginTop: 12, paddingHorizontal: 14, paddingVertical: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="search" size={18} color={palette.textFaint} />
                <TextInput
                  value={filters.search}
                  onChangeText={(t) => set({ search: t })}
                  placeholder="Buscar tareas…"
                  placeholderTextColor={palette.textFaint}
                  style={{ flex: 1, paddingVertical: 11, fontSize: 15, color: palette.text }}
                />
                {filters.search ? (
                  <Pressable onPress={() => set({ search: "" })} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={palette.textFaint} />
                  </Pressable>
                ) : null}
              </View>
            </GlassCard>
          </View>

          {/* Filtros estado + prioridad */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginTop: 12 }}
            style={{ flexGrow: 0 }}
          >
            {STATUS.map((s) => (
              <FilterChip
                key={s.key}
                label={s.label}
                active={filters.status === s.key}
                onPress={() => set({ status: s.key })}
              />
            ))}
            {PRIORITIES.map((p) => (
              <FilterChip
                key={p}
                label={PRIORITY_META[p].label}
                dot={PRIORITY_META[p].color}
                color={PRIORITY_META[p].color}
                active={filters.priority === p}
                onPress={() => set({ priority: filters.priority === p ? null : p })}
              />
            ))}
          </ScrollView>

          {/* Orden */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginTop: 10 }}
            style={{ flexGrow: 0 }}
          >
            {SORTS.map((s) => (
              <Pressable
                key={s.key}
                onPress={() => set({ sort: s.key })}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: filters.sort === s.key ? palette.accentSoft : "transparent",
                }}
              >
                <Ionicons
                  name={s.icon}
                  size={13}
                  color={filters.sort === s.key ? palette.accent : palette.textFaint}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: filters.sort === s.key ? palette.accent : palette.textFaint,
                  }}
                >
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Lista */}
          {loading && todos.length === 0 ? (
            <View style={{ marginTop: 60, alignItems: "center" }}>
              <ActivityIndicator size="large" color={palette.accent} />
            </View>
          ) : (
            <FlatList
              data={visible}
              keyExtractor={(item) => item.uuid}
              contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.accent} />
              }
              renderItem={({ item }) => (
                <TodoCard todo={item} onToggle={toggle} onPress={openEdit} onDelete={remove} />
              )}
              ListEmptyComponent={
                <GlassCard style={{ padding: 28, alignItems: "center", marginTop: 20 }}>
                  <Ionicons
                    name={hasActiveFilters(filters) ? "filter-outline" : "clipboard-outline"}
                    size={30}
                    color={palette.accent}
                  />
                  <Text style={{ color: palette.text, fontWeight: "700", marginTop: 10 }}>
                    {hasActiveFilters(filters) ? "Sin resultados" : "Aún no hay tareas"}
                  </Text>
                  <Text style={{ color: palette.textMuted, marginTop: 4, textAlign: "center" }}>
                    {hasActiveFilters(filters)
                      ? "Prueba ajustar los filtros."
                      : "Crea tareas con el botón +."}
                  </Text>
                </GlassCard>
              }
            />
          )}

          {error ? (
            <View style={{ position: "absolute", bottom: 100, left: 20, right: 20 }}>
              <GlassCard style={{ padding: 12 }}>
                <Text style={{ color: palette.danger, textAlign: "center" }}>{error}</Text>
              </GlassCard>
            </View>
          ) : null}
        </SafeAreaView>

        {/* FAB nueva tarea */}
        <Pressable
          onPress={() => router.push("/modal")}
          style={{
            position: "absolute",
            right: 24,
            bottom: 104,
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

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuroraBackground from "@/components/glass/AuroraBackground";
import CategoryChip from "@/components/glass/CategoryChip";
import GlassCard from "@/components/glass/GlassCard";
import { Text } from "@/components/ui/text";
import { getLists, getMyTodos, type TaskList, type Todo } from "@/lib/endpoints";
import { formatDueDate } from "@/lib/format";
import { palette, PRIORITY_META } from "@/theme/tokens";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [lists, setLists] = useState<TaskList[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [l, t] = await Promise.all([getLists(), getMyTodos()]);
      setLists(l);
      setTodos(t);
    } catch {
      // silencioso; búsqueda no es crítica
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const q = query.trim().toLowerCase();
  const matchedLists = useMemo(
    () =>
      q.length === 0
        ? []
        : lists.filter((l) => l.name.toLowerCase().includes(q) || (l.description ?? "").toLowerCase().includes(q)),
    [lists, q]
  );
  const matchedTodos = useMemo(
    () =>
      q.length === 0
        ? []
        : todos.filter(
            (t) => t.title.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q)
          ),
    [todos, q]
  );

  const listName = (id?: string | null) => lists.find((l) => l.uuid === id)?.name;

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
            <Text style={{ fontSize: 30, fontWeight: "800", color: palette.text }}>
              Buscar
            </Text>
            <GlassCard style={{ marginTop: 14, paddingHorizontal: 14, paddingVertical: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="search" size={18} color={palette.textFaint} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                  placeholder="Buscar listas y tareas…"
                  placeholderTextColor={palette.textFaint}
                  style={{ flex: 1, paddingVertical: 12, fontSize: 15, color: palette.text }}
                />
                {query ? (
                  <Pressable onPress={() => setQuery("")} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={palette.textFaint} />
                  </Pressable>
                ) : null}
              </View>
            </GlassCard>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
            {loading ? (
              <ActivityIndicator size="large" color={palette.accent} style={{ marginTop: 40 }} />
            ) : q.length === 0 ? (
              <View style={{ alignItems: "center", marginTop: 60 }}>
                <Ionicons name="search-outline" size={34} color={palette.textFaint} />
                <Text style={{ color: palette.textMuted, marginTop: 10 }}>
                  Escribe para buscar listas y tareas
                </Text>
              </View>
            ) : matchedLists.length === 0 && matchedTodos.length === 0 ? (
              <GlassCard style={{ padding: 26, alignItems: "center" }}>
                <Text style={{ color: palette.text, fontWeight: "700" }}>Sin resultados</Text>
                <Text style={{ color: palette.textMuted, marginTop: 4 }}>
                  Nada coincide con “{query}”.
                </Text>
              </GlassCard>
            ) : (
              <>
                {matchedLists.length > 0 ? (
                  <>
                    <SectionTitle>Listas ({matchedLists.length})</SectionTitle>
                    {matchedLists.map((l) => (
                      <Pressable
                        key={l.uuid}
                        onPress={() =>
                          router.push({
                            pathname: "/list/[id]",
                            params: { id: l.uuid, name: l.name, color: l.color ?? "" },
                          })
                        }
                        style={{ marginBottom: 10 }}
                      >
                        <GlassCard style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
                          <View
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 999,
                              backgroundColor: l.color ?? palette.accent,
                            }}
                          />
                          <Text style={{ flex: 1, fontWeight: "700", color: palette.text }}>
                            {l.name}
                          </Text>
                          <Ionicons name="chevron-forward" size={18} color={palette.textFaint} />
                        </GlassCard>
                      </Pressable>
                    ))}
                  </>
                ) : null}

                {matchedTodos.length > 0 ? (
                  <>
                    <SectionTitle>Tareas ({matchedTodos.length})</SectionTitle>
                    {matchedTodos.map((t) => (
                      <Pressable
                        key={t.uuid}
                        onPress={() =>
                          router.push({
                            pathname: "/modal",
                            params: {
                              id: t.uuid,
                              title: t.title,
                              description: t.description ?? "",
                              priority: t.priority ?? "MEDIUM",
                              dueDate: t.dueDate ?? "",
                              listId: t.listId ?? "",
                              categoryIds: JSON.stringify((t.categories ?? []).map((c) => c.uuid)),
                            },
                          })
                        }
                        style={{ marginBottom: 10 }}
                      >
                        <GlassCard style={{ padding: 14 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            {t.priority ? (
                              <Ionicons
                                name={PRIORITY_META[t.priority].icon}
                                size={13}
                                color={PRIORITY_META[t.priority].color}
                              />
                            ) : null}
                            <Text
                              style={{
                                flex: 1,
                                fontWeight: "600",
                                color: t.completed ? palette.textFaint : palette.text,
                                textDecorationLine: t.completed ? "line-through" : "none",
                              }}
                            >
                              {t.title}
                            </Text>
                          </View>
                          <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                            {listName(t.listId) ? (
                              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                                <Ionicons name="folder-outline" size={12} color={palette.textMuted} />
                                <Text style={{ fontSize: 12, color: palette.textMuted }}>
                                  {listName(t.listId)}
                                </Text>
                              </View>
                            ) : null}
                            {t.dueDate ? (
                              <Text style={{ fontSize: 12, color: palette.textMuted }}>
                                {formatDueDate(t.dueDate)}
                              </Text>
                            ) : null}
                            {(t.categories ?? []).map((c) => (
                              <CategoryChip key={c.uuid} category={c} small />
                            ))}
                          </View>
                        </GlassCard>
                      </Pressable>
                    ))}
                  </>
                ) : null}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </AuroraBackground>
    </View>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 14,
        fontWeight: "800",
        color: palette.textMuted,
        marginBottom: 10,
        marginTop: 6,
      }}
    >
      {children}
    </Text>
  );
}

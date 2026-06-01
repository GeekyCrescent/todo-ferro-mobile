import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuroraBackground from "@/components/glass/AuroraBackground";
import GlassCard from "@/components/glass/GlassCard";
import ListCard from "@/components/glass/ListCard";
import { Text } from "@/components/ui/text";
import { useLists } from "@/hooks/useLists";
import { palette } from "@/theme/tokens";
import type { TaskList } from "@/lib/endpoints";

const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
};

export default function HomeScreen() {
  const { lists, loading, error, reload } = useLists();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const openList = (list: TaskList) =>
    router.push({
      pathname: "/list/[id]",
      params: { id: list.uuid, name: list.name, color: list.color ?? "" },
    });

  const editList = (list: TaskList) =>
    router.push({
      pathname: "/list-modal",
      params: {
        id: list.uuid,
        name: list.name,
        description: list.description ?? "",
        color: list.color ?? "",
      },
    });

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 }}>
            <Text style={{ fontSize: 14, color: palette.textMuted, fontWeight: "600" }}>
              {greeting()}
            </Text>
            <Text style={{ fontSize: 30, fontWeight: "800", color: palette.text }}>
              Mis listas
            </Text>
          </View>

          {loading && lists.length === 0 ? (
            <View style={{ marginTop: 80, alignItems: "center" }}>
              <ActivityIndicator size="large" color={palette.accent} />
            </View>
          ) : (
            <FlatList
              data={lists}
              keyExtractor={(item) => item.uuid}
              contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
              renderItem={({ item }) => (
                <ListCard list={item} onPress={openList} onEdit={editList} />
              )}
              ListEmptyComponent={
                <GlassCard style={{ padding: 28, alignItems: "center", marginTop: 20 }}>
                  <Ionicons name="albums-outline" size={30} color={palette.accent} />
                  <Text style={{ color: palette.text, fontWeight: "700", marginTop: 10 }}>
                    Aún no tienes listas
                  </Text>
                  <Text style={{ color: palette.textMuted, marginTop: 4, textAlign: "center" }}>
                    Crea tu primera lista con el botón +.
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

        {/* FAB nueva lista */}
        <Pressable
          onPress={() => router.push("/list-modal")}
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

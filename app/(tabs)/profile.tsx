import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuroraBackground from "@/components/glass/AuroraBackground";
import GlassCard from "@/components/glass/GlassCard";
import { Text } from "@/components/ui/text";
import { logout } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { getLists, getMyTodos } from "@/lib/endpoints";
import { palette } from "@/theme/tokens";

export default function ProfileScreen() {
  const [email, setEmail] = useState<string | null>(null);
  const [stats, setStats] = useState({ lists: 0, todos: 0, done: 0 });

  useFocusEffect(
    useCallback(() => {
      setEmail(auth.currentUser?.email ?? null);
      Promise.all([getLists(), getMyTodos()])
        .then(([l, t]) => {
          setStats({
            lists: l.length,
            todos: t.length,
            done: t.filter((x) => x.completed).length,
          });
        })
        .catch(() => {});
    }, [])
  );

  const onLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const initial = (email ?? "U").charAt(0).toUpperCase();

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
            <Text style={{ fontSize: 30, fontWeight: "800", color: palette.text }}>Perfil</Text>

            {/* User card */}
            <GlassCard style={{ padding: 20, marginTop: 16, alignItems: "center" }}>
              <View
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 999,
                  backgroundColor: palette.accentSoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 32, fontWeight: "800", color: palette.accent }}>
                  {initial}
                </Text>
              </View>
              <Text style={{ fontSize: 17, fontWeight: "700", color: palette.text, marginTop: 12 }}>
                {email ?? "Usuario"}
              </Text>
              <Text style={{ fontSize: 13, color: palette.textMuted, marginTop: 2 }}>
                Sesión iniciada con Firebase
              </Text>
            </GlassCard>

            {/* Stats */}
            <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
              <Stat value={stats.lists} label="Listas" />
              <Stat value={stats.todos} label="Tareas" />
              <Stat value={stats.done} label="Hechas" />
            </View>

            {/* About */}
            <Text style={{ fontSize: 14, fontWeight: "800", color: palette.textMuted, marginTop: 26, marginBottom: 10 }}>
              Acerca de
            </Text>
            <GlassCard style={{ padding: 4 }}>
              <Row icon="information-circle-outline" label="Todo App" value="v1.0.0" />
              <Divider />
              <Row icon="cloud-outline" label="Backend" value="Cloud Run" />
              <Divider />
              <Row icon="phone-portrait-outline" label="Construido con" value="Expo + RN" />
            </GlassCard>

            {/* Logout */}
            <Pressable
              onPress={onLogout}
              style={{
                marginTop: 24,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 15,
                borderRadius: 16,
                backgroundColor: "#FEE2E2",
                borderWidth: 1,
                borderColor: "#FECACA",
              }}
            >
              <Ionicons name="log-out-outline" size={20} color={palette.danger} />
              <Text style={{ color: palette.danger, fontWeight: "700", fontSize: 16 }}>
                Cerrar sesión
              </Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </AuroraBackground>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={{ flex: 1 }}>
      <GlassCard style={{ padding: 14, alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: palette.text }}>{value}</Text>
        <Text style={{ fontSize: 12, color: palette.textMuted, fontWeight: "600" }}>{label}</Text>
      </GlassCard>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14 }}>
      <Ionicons name={icon} size={20} color={palette.textMuted} />
      <Text style={{ flex: 1, color: palette.text, fontWeight: "600" }}>{label}</Text>
      <Text style={{ color: palette.textMuted }}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: palette.glassHairline, marginHorizontal: 14 }} />;
}

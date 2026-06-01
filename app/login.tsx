import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuroraBackground from "@/components/glass/AuroraBackground";
import GlassCard from "@/components/glass/GlassCard";
import GradientButton from "@/components/glass/GradientButton";
import { Text } from "@/components/ui/text";
import { login } from "@/lib/auth";
import { palette } from "@/theme/tokens";

const inputWrap = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 10,
  backgroundColor: palette.glassStrong,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: palette.glassHairline,
  paddingHorizontal: 14,
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  const onSubmit = async () => {
    if (!canSubmit) return;
    try {
      setError(null);
      setLoading(true);
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch (err) {
      const code = (err as { code?: string })?.code;
      const message = err instanceof Error ? err.message : String(err);
      setError(code ? `${code} — ${message}` : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
           <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
            keyboardShouldPersistTaps="handled"
           >
            {/* Brand */}
            <View style={{ alignItems: "center", marginBottom: 28 }}>
              <View
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 24,
                  backgroundColor: palette.accent,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: palette.accent,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.4,
                  shadowRadius: 18,
                  elevation: 8,
                }}
              >
                <Ionicons name="checkmark-done" size={40} color={palette.white} />
              </View>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "800",
                  color: palette.text,
                  marginTop: 18,
                }}
              >
                Bienvenido
              </Text>
              <Text style={{ fontSize: 15, color: palette.textMuted, marginTop: 4 }}>
                Organiza tu día con claridad
              </Text>
            </View>

            <GlassCard strong style={{ padding: 22 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: palette.textMuted, marginBottom: 8 }}>
                Correo
              </Text>
              <View style={inputWrap}>
                <Ionicons name="mail-outline" size={18} color={palette.textFaint} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="tu@correo.com"
                  placeholderTextColor={palette.textFaint}
                  style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: palette.text }}
                />
              </View>

              <Text style={{ fontSize: 13, fontWeight: "700", color: palette.textMuted, marginBottom: 8, marginTop: 16 }}>
                Contraseña
              </Text>
              <View style={inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={palette.textFaint} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor={palette.textFaint}
                  style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: palette.text }}
                />
              </View>

              {error ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 16,
                    backgroundColor: "rgba(244,63,94,0.1)",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Ionicons name="alert-circle" size={16} color={palette.danger} />
                  <Text style={{ color: palette.danger, flex: 1, fontSize: 13 }}>{error}</Text>
                </View>
              ) : null}

              <View style={{ marginTop: 22 }}>
                <GradientButton
                  label="Iniciar sesión"
                  icon="arrow-forward"
                  loading={loading}
                  disabled={!canSubmit}
                  onPress={onSubmit}
                />
              </View>
            </GlassCard>

            <Pressable
              onPress={() => router.push("/test-api")}
              style={{ alignItems: "center", marginTop: 20 }}
            >
              <Text style={{ color: palette.textFaint, fontSize: 13 }}>
                Probar API (debug)
              </Text>
            </Pressable>
           </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </AuroraBackground>
    </View>
  );
}

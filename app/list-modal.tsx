import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuroraBackground from "@/components/glass/AuroraBackground";
import ListForm, { type ListFormValue } from "@/components/glass/ListForm";
import { palette } from "@/theme/tokens";

export default function ListModalScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    description?: string;
    color?: string;
  }>();

  const initial: ListFormValue | undefined = params.id
    ? {
        id: params.id,
        name: params.name,
        description: params.description,
        color: params.color || undefined,
      }
    : undefined;

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 16, paddingTop: 8 }}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                backgroundColor: palette.surface,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: palette.border,
              }}
            >
              <Ionicons name="close" size={20} color={palette.textMuted} />
            </Pressable>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ListForm initial={initial} onDone={() => router.back()} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </AuroraBackground>
    </View>
  );
}

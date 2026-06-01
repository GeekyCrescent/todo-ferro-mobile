import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  height?: number;
};

// NO white anywhere: dark teal text on a light teal fill + teal border.
// This is the same "light fill + dark text" recipe that already renders fine
// (inactive chips), so it can't disappear like white-on-color did.
const FILL = "#CCFBF1"; // teal-100
const TEXT = "#0F766E"; // teal-700
const BORDER = "#0D9488"; // teal-600

export default function GradientButton({
  label,
  onPress,
  loading,
  disabled,
  icon,
  height = 54,
}: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => ({
        height,
        borderRadius: 16,
        backgroundColor: FILL,
        borderWidth: 2,
        borderColor: BORDER,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: inactive ? 0.5 : pressed ? 0.8 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color={TEXT} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={TEXT} /> : null}
          <Text style={{ color: TEXT, fontWeight: "800", fontSize: 16 }}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

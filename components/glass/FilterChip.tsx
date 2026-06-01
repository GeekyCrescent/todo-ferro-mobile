import { Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  color?: string;
  dot?: string;
};

// Selected = light teal fill + dark teal text + teal border (NO white).
// Unselected = light gray fill + dark gray text. Neither relies on white,
// so the selected state can't vanish like white-on-color did on Android.
const ACTIVE_FILL = "#CCFBF1";
const ACTIVE_TEXT = "#0F766E";
const ACTIVE_BORDER = "#0D9488";
const INACTIVE_FILL = "#E5E7EB";
const INACTIVE_TEXT = "#374151";

export default function FilterChip({ label, active, onPress, color, dot }: Props) {
  const activeBorder = color ?? ACTIVE_BORDER;
  const activeText = color ?? ACTIVE_TEXT;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 999,
        backgroundColor: active ? ACTIVE_FILL : INACTIVE_FILL,
        borderWidth: active ? 1.5 : 0,
        borderColor: active ? activeBorder : "transparent",
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {dot ? (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            backgroundColor: dot,
          }}
        />
      ) : null}
      <Text
        style={{
          color: active ? activeText : INACTIVE_TEXT,
          fontWeight: "700",
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { glassShadow, palette } from "@/theme/tokens";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  strong?: boolean;
  padded?: boolean;
};

/**
 * Clean white card: opaque surface, hairline border and a very soft shadow.
 * (`strong` kept for back-compat; both render the same crisp white surface.)
 */
export default function GlassCard({ children, style, padded }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: palette.surface,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: palette.glassBorder,
          ...glassShadow,
        },
        padded && { padding: 18 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

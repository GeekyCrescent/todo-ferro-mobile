import { View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

import { Text } from "@/components/ui/text";
import { palette } from "@/theme/tokens";

type Props = {
  progress: number; // 0..1
  size?: number;
  strokeWidth?: number;
  label?: string;
  caption?: string;
};

/** Circular progress indicator with a teal gradient stroke. */
export default function ProgressRing({
  progress,
  size = 132,
  strokeWidth = 12,
  label,
  caption,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = circumference * (1 - clamped);
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Defs>
          <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={palette.accentBright} />
            <Stop offset="1" stopColor={palette.accent} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(15, 23, 42, 0.07)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#ring)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <Text style={{ fontSize: 30, fontWeight: "800", color: palette.text }}>
        {label ?? `${Math.round(clamped * 100)}%`}
      </Text>
      {caption ? (
        <Text style={{ fontSize: 12, color: palette.textMuted, marginTop: 2 }}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

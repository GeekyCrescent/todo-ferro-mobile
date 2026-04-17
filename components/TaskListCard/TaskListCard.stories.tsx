import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { fn } from "storybook/test";

import TaskListCard from "./TaskListCard";

const meta = {
  title: "Components/TaskListCard",
  component: TaskListCard,
  tags: ["autodocs"],
  args: { onPress: fn() },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#111" }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TaskListCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const baseItem = {
  id: "1",
  title: "Computer Science",
  subtitle: "Algorithms and data structures",
  percentage: 60,
  tags: ["school", "important"],
  idColor: "bg-blue-500",
  idIcon: "code",
};

export const Expanded: Story = {
  args: {
    variant: "expanded",
    item: baseItem,
  },
};

export const Compact: Story = {
  args: {
    variant: "compact",
    item: baseItem,
  },
};

export const CompactCompleted: Story = {
  args: {
    variant: "compact",
    item: { ...baseItem, title: "Math", percentage: 100 },
  },
};

export const ExpandedLongTitle: Story = {
  args: {
    variant: "expanded",
    item: {
      ...baseItem,
      title: "Very long title that probably wraps to two lines",
      subtitle: "Also a long subtitle to stress the layout",
      percentage: 25,
    },
  },
};

import { TaskList } from "@/types/TaskList";
import React from "react";
import { Box } from "../ui/box";
import { Pressable } from "../ui/pressable";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Text } from "../ui/text";

export type TaskListCardVariant = "expanded" | "compact";

export type TaskListCardProps = {
  /** Datos del task list a mostrar. */
  item: TaskList;
  /**
   * Variante visual.
   * - `expanded`: muestra título, subtítulo, barra de progreso y porcentaje.
   * - `compact`: solo título y porcentaje inline en una fila.
   * @default "expanded"
   */
  variant?: TaskListCardVariant;
  /** Callback al presionar la tarjeta. */
  onPress?: () => void;
};

const TaskListCard: React.FC<TaskListCardProps> = ({
  item,
  variant = "expanded",
  onPress,
}) => {
  if (variant === "compact") {
    return (
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg"
      >
        <Text className="text-base font-semibold flex-1" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-xs text-gray-500 ml-3">{item.percentage}%</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className="p-4 border border-gray-300 rounded-xl"
    >
      <Text className="text-lg font-bold">{item.title}</Text>
      <Text className="text-sm text-gray-500 mb-2">{item.subtitle}</Text>
      <Box className="mb-3">
        <Progress value={item.percentage} size="md">
          <ProgressFilledTrack />
        </Progress>
        <Text className="text-xs text-gray-500">
          {item.percentage}% completed
        </Text>
      </Box>
    </Pressable>
  );
};

export default TaskListCard;

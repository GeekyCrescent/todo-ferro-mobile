import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { logout } from "@/lib/auth";
import {
  createTodo,
  deleteTodo,
  getMyTodos,
  toggleTodo,
  type Todo,
} from "@/lib/endpoints";

export default function TodosScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const loadTodos = async () => {
    try {
      setError(null);
      const data = await getMyTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadTodos();
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodos();
    setRefreshing(false);
  };

  const onCreate = async () => {
    if (!title.trim()) return;
    try {
      setCreating(true);
      setError(null);
      await createTodo({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setTitle("");
      setDescription("");
      await loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
    } finally {
      setCreating(false);
    }
  };

  const onLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const onToggle = async (id: string) => {
    try {
      const updated = await toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t.uuid === id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.uuid !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Box className="flex-1 p-4">
          <Box className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold">My Todos</Text>
            <Pressable onPress={onLogout}>
              <Text className="text-red-500">Logout</Text>
            </Pressable>
          </Box>

          <Box className="mb-4 p-4 border border-outline-300 rounded-xl">
            <Text className="text-sm font-semibold mb-2">New todo</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              placeholderTextColor="#888"
              className="border border-outline-300 rounded-lg px-3 py-2 mb-2 text-typography-900"
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Description (optional)"
              placeholderTextColor="#888"
              multiline
              className="border border-outline-300 rounded-lg px-3 py-2 mb-3 text-typography-900"
            />
            <Pressable
              onPress={onCreate}
              disabled={!title.trim() || creating}
              className={`rounded-lg py-3 items-center ${
                title.trim() && !creating
                  ? "bg-purple-600"
                  : "bg-purple-600/40"
              }`}
            >
              {creating ? (
                <Spinner color="white" />
              ) : (
                <Text className="text-white font-semibold">Create</Text>
              )}
            </Pressable>
          </Box>

          {error && (
            <Box className="mb-3 p-3 bg-red-500/10 rounded-lg">
              <Text className="text-red-500">{error}</Text>
            </Box>
          )}

          {loading ? (
            <Box className="mt-8 items-center">
              <Spinner size="large" color="grey" />
            </Box>
          ) : todos.length === 0 ? (
            <Box className="mt-8 items-center">
              <Text className="text-typography-500">No todos yet</Text>
            </Box>
          ) : (
            <FlatList
              data={todos}
              keyExtractor={(item) => item.uuid}
              renderItem={({ item }) => (
                <Box className="p-4 mb-2 border border-outline-300 rounded-xl">
                  <Text className="font-semibold">{item.title}</Text>
                  {item.description ? (
                    <Text className="text-typography-500 mt-1">
                      {item.description}
                    </Text>
                  ) : null}
                  {item.completed !== undefined && (
                    <Text
                      className={`text-xs mt-2 ${
                        item.completed ? "text-green-500" : "text-yellow-500"
                      }`}
                    >
                      {item.completed ? "Completed" : "Pending"}
                    </Text>
                  )}
                  <Box className="flex-row mt-3" style={{ gap: 8 }}>
                    <Pressable
                      onPress={() => onToggle(item.uuid)}
                      className="flex-1 rounded-lg py-2 items-center bg-purple-600"
                    >
                      <Text className="text-white text-sm font-semibold">
                        {item.completed ? "Mark pending" : "Mark done"}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => onDelete(item.uuid)}
                      className="rounded-lg py-2 px-4 items-center border border-red-500"
                    >
                      <Text className="text-red-500 text-sm font-semibold">
                        Delete
                      </Text>
                    </Pressable>
                  </Box>
                </Box>
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

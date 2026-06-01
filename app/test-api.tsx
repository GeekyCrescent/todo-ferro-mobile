import { useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";

import { login } from "../lib/auth";
import {
  createTodo,
  createUser,
  getMyTodos,
  pingTodoTest,
} from "../lib/endpoints";

export default function TestApi() {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("password123");
  const [fullName, setFullName] = useState("Test User");
  const [log, setLog] = useState<string[]>([]);

  const append = (msg: string) =>
    setLog((prev) => [`${new Date().toLocaleTimeString()}  ${msg}`, ...prev]);

  const safeRun = async (label: string, fn: () => Promise<unknown>) => {
    try {
      const result = await fn();
      append(`OK ${label}: ${JSON.stringify(result).slice(0, 200)}`);
    } catch (e) {
      append(`ERR ${label}: ${(e as Error).message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>API Test</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 8 }}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
        style={{ borderWidth: 1, padding: 8 }}
      />
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="full name"
        style={{ borderWidth: 1, padding: 8 }}
      />

      <Button
        title="1. Register (POST /user)"
        onPress={() =>
          safeRun("createUser", () =>
            createUser({ email, password, fullName })
          )
        }
      />
      <Button
        title="2. Login (Firebase)"
        onPress={() => safeRun("login", () => login(email, password))}
      />
      <Button
        title="3. Ping (GET /todo/test)"
        onPress={() => safeRun("pingTodoTest", pingTodoTest)}
      />
      <Button
        title="4. Create Todo (POST /todo)"
        onPress={() =>
          safeRun("createTodo", () =>
            createTodo({ title: "Mi todo", description: "desde mobile" })
          )
        }
      />
      <Button
        title="5. My Todos (GET /todo/my-todos)"
        onPress={() => safeRun("getMyTodos", getMyTodos)}
      />

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "bold" }}>Log:</Text>
        {log.map((line, i) => (
          <Text key={i} style={{ fontFamily: "monospace", fontSize: 12 }}>
            {line}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

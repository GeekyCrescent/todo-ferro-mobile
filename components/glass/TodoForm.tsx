import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, TextInput, View } from "react-native";

import { Text } from "@/components/ui/text";
import FilterChip from "./FilterChip";
import GlassCard from "./GlassCard";
import GradientButton from "./GradientButton";
import { formatDueDate, toApiDate } from "@/lib/format";
import {
  createCategory,
  createTodo,
  getCategories,
  getLists,
  updateTodo,
  type Category,
  type Priority,
  type TaskList,
} from "@/lib/endpoints";
import { CATEGORY_COLORS, palette, PRIORITY_META } from "@/theme/tokens";

export type TodoFormValue = {
  id?: string;
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
  listId?: string | null;
  categoryIds?: string[];
};

type Props = { initial?: TodoFormValue; onDone: () => void };

const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

const inputStyle = {
  backgroundColor: palette.glassStrong,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: palette.glassHairline,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 16,
  color: palette.text,
} as const;

const Label = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 13,
      fontWeight: "700",
      color: palette.textMuted,
      marginBottom: 8,
      marginTop: 18,
    }}
  >
    {children}
  </Text>
);

export default function TodoForm({ initial, onDone }: Props) {
  const isEdit = !!initial?.id;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "MEDIUM");
  const [dueDate, setDueDate] = useState<Date | null>(
    initial?.dueDate ? new Date(initial.dueDate) : null
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initial?.categoryIds ?? []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [listId, setListId] = useState<string | null>(initial?.listId ?? null);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New-category mini form
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[0]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
    getLists()
      .then(setLists)
      .catch(() => {});
  }, []);

  const toggleCategory = (id: string) =>
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const quickDate = (days: number | null) => {
    if (days === null) return setDueDate(null);
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDueDate(d);
  };

  const onAddCategory = async () => {
    if (!newName.trim()) return;
    try {
      const cat = await createCategory({ name: newName.trim(), color: newColor });
      setCategories((prev) =>
        prev.some((c) => c.uuid === cat.uuid) ? prev : [...prev, cat]
      );
      setCategoryIds((prev) =>
        prev.includes(cat.uuid) ? prev : [...prev, cat.uuid]
      );
      setNewName("");
      setAdding(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear la categoría");
    }
  };

  const onSubmit = async () => {
    if (!title.trim()) return;
    try {
      setSaving(true);
      setError(null);
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate ? toApiDate(dueDate) : "",
        listId: listId ?? undefined,
        categoryIds,
      };
      if (isEdit && initial?.id) {
        await updateTodo(initial.id, payload);
      } else {
        await createTodo(payload);
      }
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: 26, fontWeight: "800", color: palette.text }}>
        {isEdit ? "Editar tarea" : "Nueva tarea"}
      </Text>

      <Label>Título</Label>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="¿Qué necesitas hacer?"
        placeholderTextColor={palette.textFaint}
        style={inputStyle}
      />

      <Label>Descripción</Label>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Añade detalles (opcional)"
        placeholderTextColor={palette.textFaint}
        multiline
        style={[inputStyle, { minHeight: 84, textAlignVertical: "top" }]}
      />

      {lists.length > 0 ? (
        <>
          <Label>Lista</Label>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <FilterChip
              label="Sin lista"
              active={listId === null}
              onPress={() => setListId(null)}
            />
            {lists.map((l) => (
              <FilterChip
                key={l.uuid}
                label={l.name}
                dot={l.color ?? palette.accent}
                color={l.color ?? palette.accent}
                active={listId === l.uuid}
                onPress={() => setListId(l.uuid)}
              />
            ))}
          </View>
        </>
      ) : null}

      <Label>Prioridad</Label>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {PRIORITIES.map((p) => (
          <View key={p} style={{ flex: 1 }}>
            <Pressable
              onPress={() => setPriority(p)}
              style={{
                alignItems: "center",
                paddingVertical: 12,
                borderRadius: 14,
                backgroundColor:
                  priority === p ? PRIORITY_META[p].tint : palette.glassStrong,
                borderWidth: 1.5,
                borderColor:
                  priority === p ? PRIORITY_META[p].color : palette.glassHairline,
              }}
            >
              <Ionicons
                name={PRIORITY_META[p].icon}
                size={18}
                color={PRIORITY_META[p].color}
              />
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  fontWeight: "700",
                  color:
                    priority === p ? PRIORITY_META[p].color : palette.textMuted,
                }}
              >
                {PRIORITY_META[p].label}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Label>Fecha límite</Label>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <FilterChip label="Hoy" active={isSameDay(dueDate, 0)} onPress={() => quickDate(0)} />
        <FilterChip label="Mañana" active={isSameDay(dueDate, 1)} onPress={() => quickDate(1)} />
        <FilterChip label="En 3 días" active={isSameDay(dueDate, 3)} onPress={() => quickDate(3)} />
        <FilterChip label="Sin fecha" active={dueDate === null} onPress={() => quickDate(null)} />
        {Platform.OS !== "web" ? (
          <FilterChip
            label={dueDate ? formatDueDate(dueDate.toISOString()) : "Elegir…"}
            active={false}
            onPress={() => setShowPicker(true)}
            color={palette.accent}
          />
        ) : null}
      </View>

      {showPicker && Platform.OS !== "web" ? (
        <DateTimePicker
          value={dueDate ?? new Date()}
          mode="date"
          onChange={(_, selected) => {
            setShowPicker(false);
            if (selected) setDueDate(selected);
          }}
        />
      ) : null}

      <Label>Categorías</Label>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {categories.map((c) => (
          <FilterChip
            key={c.uuid}
            label={c.name}
            dot={c.color ?? palette.accent}
            active={categoryIds.includes(c.uuid)}
            color={c.color ?? palette.accent}
            onPress={() => toggleCategory(c.uuid)}
          />
        ))}
        <Pressable
          onPress={() => setAdding((v) => !v)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: palette.accent,
            borderStyle: "dashed",
          }}
        >
          <Ionicons name="add" size={15} color={palette.accent} />
          <Text style={{ color: palette.accent, fontWeight: "700", fontSize: 13 }}>
            Nueva
          </Text>
        </Pressable>
      </View>

      {adding ? (
        <GlassCard style={{ padding: 14, marginTop: 12 }}>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Nombre de la categoría"
            placeholderTextColor={palette.textFaint}
            style={inputStyle}
          />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
            {CATEGORY_COLORS.map((color) => (
              <Pressable
                key={color}
                onPress={() => setNewColor(color)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  backgroundColor: color,
                  borderWidth: newColor === color ? 3 : 0,
                  borderColor: palette.white,
                  shadowColor: color,
                  shadowOpacity: newColor === color ? 0.6 : 0,
                  shadowRadius: 6,
                }}
              />
            ))}
          </View>
          <Pressable
            onPress={onAddCategory}
            style={{ marginTop: 14, alignSelf: "flex-start" }}
          >
            <Text style={{ color: palette.accent, fontWeight: "700" }}>
              Guardar categoría
            </Text>
          </Pressable>
        </GlassCard>
      ) : null}

      {error ? (
        <Text style={{ color: palette.danger, marginTop: 16 }}>{error}</Text>
      ) : null}

      <View style={{ marginTop: 28 }}>
        <GradientButton
          label={isEdit ? "Guardar cambios" : "Crear tarea"}
          icon={isEdit ? "checkmark" : "add"}
          loading={saving}
          disabled={!title.trim()}
          onPress={onSubmit}
        />
      </View>
    </ScrollView>
  );
}

/** True if `date` is exactly `offset` days from today (used to highlight chips). */
function isSameDay(date: Date | null, offset: number): boolean {
  if (!date) return false;
  const target = new Date();
  target.setDate(target.getDate() + offset);
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
}

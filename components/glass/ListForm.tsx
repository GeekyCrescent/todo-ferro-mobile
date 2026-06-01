import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";

import { Text } from "@/components/ui/text";
import GradientButton from "./GradientButton";
import { createList, updateList } from "@/lib/endpoints";
import { CATEGORY_COLORS, palette } from "@/theme/tokens";

export type ListFormValue = {
  id?: string;
  name?: string;
  description?: string;
  color?: string;
};

type Props = { initial?: ListFormValue; onDone: () => void };

const inputStyle = {
  backgroundColor: palette.surface,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: palette.border,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 16,
  color: palette.text,
} as const;

export default function ListForm({ initial, onDone }: Props) {
  const isEdit = !!initial?.id;
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [color, setColor] = useState(initial?.color ?? CATEGORY_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!name.trim()) return;
    try {
      setSaving(true);
      setError(null);
      const dto = {
        name: name.trim(),
        description: description.trim() || undefined,
        color,
      };
      if (isEdit && initial?.id) {
        await updateList(initial.id, dto);
      } else {
        await createList(dto);
      }
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la lista");
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
        {isEdit ? "Editar lista" : "Nueva lista"}
      </Text>

      <Text style={labelStyle}>Nombre</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ej. Escuela, Casa, Trabajo…"
        placeholderTextColor={palette.textFaint}
        style={inputStyle}
      />

      <Text style={labelStyle}>Descripción</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Opcional"
        placeholderTextColor={palette.textFaint}
        style={inputStyle}
      />

      <Text style={labelStyle}>Color</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {CATEGORY_COLORS.map((c) => (
          <Pressable
            key={c}
            onPress={() => setColor(c)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              backgroundColor: c,
              borderWidth: color === c ? 3 : 0,
              borderColor: palette.text,
            }}
          />
        ))}
      </View>

      {error ? (
        <Text style={{ color: palette.danger, marginTop: 16 }}>{error}</Text>
      ) : null}

      <View style={{ marginTop: 28 }}>
        <GradientButton
          label={isEdit ? "Guardar cambios" : "Crear lista"}
          icon={isEdit ? "checkmark" : "add"}
          loading={saving}
          disabled={!name.trim()}
          onPress={onSubmit}
        />
      </View>
    </ScrollView>
  );
}

const labelStyle = {
  fontSize: 13,
  fontWeight: "700" as const,
  color: palette.textMuted,
  marginBottom: 8,
  marginTop: 18,
};

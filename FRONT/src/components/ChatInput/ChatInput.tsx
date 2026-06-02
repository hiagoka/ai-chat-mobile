import { useState, useMemo } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/ThemeContext";
import { createStyles } from "./styles";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled = false }: Props) {
  const [text, setText] = useState("");
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text);
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        placeholder={disabled ? "Aguardando resposta..." : "Digite uma mensagem..."}
        placeholderTextColor={colors.placeholder}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSend}
        returnKeyType="send"
        editable={!disabled}
      />
      <TouchableOpacity onPress={handleSend} disabled={!canSend}>
        <MaterialIcons
          name={disabled ? "hourglass-top" : "send"}
          size={35}
          color={canSend ? colors.primary : colors.placeholder}
        />
      </TouchableOpacity>
    </View>
  );
}

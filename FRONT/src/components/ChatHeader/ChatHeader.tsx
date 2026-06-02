import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/ThemeContext";
import { createStyles } from "./styles";

type Props = {
  title?: string;
  onMenuPress: () => void;
};

export function ChatHeader({ title = "AI Chat", onMenuPress }: Props) {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuBtn}>
        <MaterialIcons name="menu" size={24} color={colors.text} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <TouchableOpacity onPress={toggleTheme} style={styles.menuBtn}>
        <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={22} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

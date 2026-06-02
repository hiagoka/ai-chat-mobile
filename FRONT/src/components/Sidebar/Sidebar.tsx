import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useMemo, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Conversation } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./styles";

const SIDEBAR_WIDTH = Dimensions.get("window").width * 0.75;

type Props = {
  visible: boolean;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export function Sidebar({ visible, conversations, activeId, onSelect, onNewChat, onDelete, onClose }: Props) {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -SIDEBAR_WIDTH,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: visible ? 1 : 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  function formatDate(iso: string) {
    const now = new Date();
    const date = new Date(iso);
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Hoje";
    if (diff === 1) return "Ontem";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          pointerEvents={visible ? "auto" : "none"}
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sidebar, { width: SIDEBAR_WIDTH, transform: [{ translateX }] }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="auto-awesome" size={18} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>AI Chat</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialIcons name="keyboard-double-arrow-left" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.newChatWrapper}>
          <TouchableOpacity style={styles.newChatBtn} onPress={onNewChat} activeOpacity={0.8}>
            <MaterialIcons name="edit-square" size={17} color={colors.primary} />
            <Text style={styles.newChatText}>Nova conversa</Text>
          </TouchableOpacity>
        </View>

        {conversations.length > 0 && (
          <Text style={styles.sectionLabel}>Recentes</Text>
        )}

        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isActive = item.id === activeId;
            return (
              <TouchableOpacity
                style={[styles.item, isActive && styles.itemActive]}
                onPress={() => { onSelect(item.id); onClose(); }}
                activeOpacity={0.7}
              >
                {isActive && <View style={styles.activeBar} />}
                <View style={styles.itemContent}>
                  <Text style={[styles.itemTitle, isActive && styles.itemTitleActive]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemDate}>{formatDate(item.updatedAt)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => onDelete(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialIcons name="close" size={15} color={colors.textMuted} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrapper}>
                <MaterialIcons name="chat-bubble-outline" size={28} color={colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Sem conversas</Text>
              <Text style={styles.emptySubtitle}>Toque em "Nova conversa"{"\n"}para começar</Text>
            </View>
          }
        />

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <MaterialIcons name="info-outline" size={14} color={colors.textMuted} />
            <Text style={styles.footerText}>Salvo localmente</Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

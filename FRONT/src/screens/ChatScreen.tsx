import { StatusBar, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useState } from "react";

import { ChatHeader } from "../components/ChatHeader/ChatHeader";
import { MessagesList } from "../components/MessagesList/MessagesList";
import { ChatInput } from "../components/ChatInput/ChatInput";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { useConversations } from "../hooks/useConversations";
import { useTheme } from "../context/ThemeContext";

export default function ChatScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { colors, isDark } = useTheme();
  const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background } });
  const {
    conversations,
    activeConversation,
    activeId,
    isLoading,
    setActiveId,
    createConversation,
    deleteConversation,
    sendMessage,
  } = useConversations();

  const handleNewChat = () => {
    createConversation();
    setSidebarOpen(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ChatHeader
        title="AI Chat"
        onMenuPress={() => setSidebarOpen(true)}
      />

      <MessagesList messages={activeConversation?.messages ?? []} />

      <ChatInput onSend={sendMessage} disabled={isLoading} />

      <Sidebar
        visible={sidebarOpen}
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNewChat={handleNewChat}
        onDelete={deleteConversation}
        onClose={() => setSidebarOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

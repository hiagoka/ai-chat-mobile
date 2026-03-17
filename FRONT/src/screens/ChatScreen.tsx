import { View } from "react-native";
import { useState } from "react";

import { ChatHeader } from "../components/ChatHeader/ChatHeader";
import { MessagesList } from "../components/MessagesList/MessagesList";
import { ChatInput } from "../components/ChatInput/ChatInput";
import { Message } from "../types/Message";
import { styles } from "./styles";
import axios from "axios";

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);

  // função que chama o backend
  const sendMessageToBackend = async (text: string) => {
    try {
      const res = await axios.post("http://localhost:3000/chat", { message: text });
      return res.data.message; // resposta da IA
    } catch (error) {
      return "Erro ao enviar para IA";
    }
  };

  const handleSend = async (text: string) => {
    // mensagem do usuário
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);

    // chamada da IA
    const aiReplyText = await sendMessageToBackend(text);

    // mensagem da IA
    const aiMessage: Message = {
      id: Date.now().toString() + "-ai",
      text: aiReplyText,
      sender: "ai",
    };
    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <View style={styles.container}>
      <ChatHeader />
      <MessagesList messages={messages} />
      <ChatInput onSend={handleSend} />
    </View>
  );
}
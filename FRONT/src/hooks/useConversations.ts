import { useState, useEffect, useCallback } from "react";
import { Message, Conversation } from "../types";
import { loadConversations, saveConversations } from "../storage/conversationStorage";
import { sendToAI } from "../api/chatApi";

function makeId() {
  return Date.now().toString() + Math.random().toString(36).slice(2);
}

function titleFromText(text: string) {
  return text.length > 30 ? text.slice(0, 30) + "…" : text;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Indica se está aguardando resposta da IA — bloqueia o envio de novas mensagens.
  const [isLoading, setIsLoading] = useState(false);

  // Carrega o histórico salvo no dispositivo quando o app abre.
  useEffect(() => {
    loadConversations().then((saved) => {
      setConversations(saved);
      if (saved.length > 0) setActiveId(saved[0].id);
    });
  }, []);

  /** Cria uma nova conversa vazia e a define como ativa. */
  const createConversation = useCallback(() => {
    const conv: Conversation = {
      id: makeId(),
      title: "Nova conversa",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => {
      const next = [conv, ...prev];
      saveConversations(next);
      return next;
    });
    setActiveId(conv.id);
  }, []);

  /** Remove uma conversa pelo ID e seleciona a próxima disponível. */
  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        saveConversations(next);
        return next;
      });
      setActiveId((prev) => {
        if (prev !== id) return prev;
        return conversations.filter((c) => c.id !== id)[0]?.id ?? null;
      });
    },
    [conversations]
  );

  /**
   * Envia uma mensagem e aguarda a resposta da IA.
   *
   * Fluxo:
   * 1. Se não há conversa ativa, cria uma automaticamente.
   * 2. Adiciona a mensagem do usuário e um placeholder vazio para a IA (exibe o TypingIndicator).
   * 3. Faz a requisição ao backend com fetch.
   * 4. Quando a resposta chega, substitui o placeholder pelo texto recebido e salva no storage.
   */
  const sendMessage = useCallback(
    async (text: string) => {
      if (isLoading) return;

      let chatId = activeId;

      // Cria conversa automaticamente se o usuário ainda não criou nenhuma.
      if (!chatId) {
        const conv: Conversation = {
          id: makeId(),
          title: titleFromText(text),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        setConversations((prev) => [conv, ...prev]);
        setActiveId(conv.id);
        chatId = conv.id;
      }

      const userMsg: Message = { id: makeId(), text, sender: "user" };
      const aiId = makeId() + "-ai";

      // Adiciona a mensagem do usuário e o placeholder da IA imediatamente na tela.
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c;
          return {
            ...c,
            title: c.messages.length === 0 ? titleFromText(text) : c.title,
            updatedAt: new Date().toISOString(),
            messages: [
              ...c.messages,
              userMsg,
              { id: aiId, text: "", sender: "ai" as const, isStreaming: true },
            ],
          };
        })
      );
      setIsLoading(true);

      try {
        const reply = await sendToAI(text);

        // Substitui o placeholder pela resposta real e salva no storage.
        setConversations((prev) => {
          const next = prev.map((c) => {
            if (c.id !== chatId) return c;
            return {
              ...c,
              updatedAt: new Date().toISOString(),
              messages: c.messages.map((m) =>
                m.id === aiId ? { ...m, text: reply, isStreaming: false } : m
              ),
            };
          });
          saveConversations(next);
          return next;
        });
      } catch {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== chatId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === aiId
                  ? { ...m, text: "Erro ao conectar com a IA.", isStreaming: false, isError: true }
                  : m
              ),
            };
          })
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeId, isLoading]
  );

  return {
    conversations,
    activeConversation: conversations.find((c) => c.id === activeId) ?? null,
    activeId,
    isLoading,
    setActiveId,
    createConversation,
    deleteConversation,
    sendMessage,
  };
}

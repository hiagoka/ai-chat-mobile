import AsyncStorage from "@react-native-async-storage/async-storage";
import { Conversation } from "../types";
import { STORAGE_KEY } from "../config";

/**
 * Carrega todas as conversas salvas no dispositivo.
 * Retorna um array vazio se não houver nada salvo ou se ocorrer algum erro de leitura.
 */
export async function loadConversations(): Promise<Conversation[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Salva todas as conversas no dispositivo.
 *
 * Antes de gravar, remove os campos transitórios `isStreaming` e `isError` das mensagens,
 * pois esses campos existem apenas em tempo de execução (indicam estado da UI) e não
 * devem ser persistidos — ao reabrir o app, nenhuma mensagem estará mais "carregando".
 */
export async function saveConversations(conversations: Conversation[]): Promise<void> {
  try {
    const clean = conversations.map((c) => ({
      ...c,
      messages: c.messages.map(({ isStreaming, isError, ...msg }) => msg),
    }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch {}
}

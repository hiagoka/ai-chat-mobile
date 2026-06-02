import { API_URL } from "../config";

/**
 * Envia uma mensagem ao backend e retorna a resposta da IA.
 * Lança um erro se a requisição falhar, para que o chamador possa tratar com try/catch.
 */
export async function sendToAI(message: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error(`Erro na requisição: ${res.status}`);
  }

  const data = await res.json();
  return data.message;
}

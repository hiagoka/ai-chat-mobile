import { memo, useEffect, useRef, useMemo } from "react";
import { Animated, Easing } from "react-native";
import { Message } from "@/src/types";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";
import { useTheme } from "@/src/context/ThemeContext";
import { createStyles } from "./styles";

type Props = {
  message: Message;
};

/**
 * Renderiza uma única mensagem do chat.
 *
 * Envolto em `memo` para evitar re-renders desnecessários durante o streaming —
 * sem isso, toda atualização de texto da IA causaria re-render de TODOS os bubbles
 * anteriores da conversa, mesmo que eles não tenham mudado.
 *
 * Comportamento:
 * - Mensagem do usuário: alinhada à direita, fundo azul.
 * - Mensagem da IA sem texto ainda: exibe o TypingIndicator (três pontos animados).
 * - Mensagem da IA com texto: exibe o conteúdo recebido em streaming.
 * - Mensagem de erro: borda vermelha para diferenciar visualmente da resposta normal.
 *
 * A animação de entrada (fade + deslize) roda apenas na montagem do componente,
 * então novos tokens chegando não re-disparam a animação.
 */
export const MessageBubble = memo(function MessageBubble({ message }: Props) {
  const { colors } = useTheme();

  // useMemo evita recriar o StyleSheet a cada render — só recalcula se o tema mudar.
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isUser = message.sender === "user";

  // Mostra os pontos animados enquanto aguarda o primeiro token da IA.
  const showTyping = !isUser && message.isStreaming && message.text === "";

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  // Animação de entrada: o bubble sobe levemente e aparece ao ser montado.
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
        message.isError && styles.errorContainer,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      {showTyping ? (
        <TypingIndicator />
      ) : (
        <Animated.Text style={isUser ? styles.userText : styles.aiText}>
          {message.text}
        </Animated.Text>
      )}
    </Animated.View>
  );
});

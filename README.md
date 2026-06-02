# AI Chat Mobile

![Em desenvolvimento](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

---

## 1. Visão Geral e a Dor

Assistentes de IA estão cada vez mais presentes no cotidiano, mas a experiência mobile ainda é fragmentada: a maioria dos usuários depende de abrir um navegador, fazer login e lidar com interfaces que não foram pensadas para telas pequenas.

**O que está sendo resolvido?**
Um app mobile nativo que permite conversas com IA de forma fluida, com histórico persistente salvo diretamente no dispositivo — sem login, sem friction, abre e usa.

**Quem sofre com esse problema?**
Usuários que precisam de respostas rápidas e inteligentes no celular, sem depender de uma conexão com uma conta em nuvem ou de alternar entre apps.

**Por que isso importa para produto/negócio?**
Reduz o atrito de adoção ao eliminar etapas de cadastro. O histórico local cria um laço com o app. O usuário retorna porque as conversas já estão lá. Serve como base para produtos verticais (atendimento, tutoria, produtividade) com custo de aquisição baixo.

---

## 2. Arquitetura e Decisões Técnicas

| Camada | Escolha | Por que escolhi isso? | Alternativa considerada | Nota de impacto |
|---|---|---|---|---|
| Front-end | React Native + Expo (TypeScript) | Uma única codebase para iOS e Android, ecossistema maduro e Expo acelera o setup e o deploy | Flutter, Swift nativo | Time-to-market, manutenção, comunidade |
| Back-end | Node.js + Express (TypeScript) | Leveza e velocidade para uma API stateless de proxy de IA; TypeScript garante contratos claros entre front e back | Python (FastAPI), Bun | Deploy simples, baixa latência, integração fácil com SDK da OpenAI |
| Persistência | AsyncStorage (local, no dispositivo) | Histórico de conversas disponível offline, sem custo de banco em nuvem e sem necessidade de autenticação | Banco relacional em nuvem, SQLite | Privacidade, zero infraestrutura, UX instantânea |
| API / Integração | REST — fetch do app para o backend Express | Simples, direto e suficiente para o modelo request/response da OpenAI | GraphQL, SSE (streaming) | Baixa complexidade operacional, fácil de versionar |
| Tema | Context API + AsyncStorage (dark/light mode) | Preferência de tema persistida no dispositivo sem biblioteca externa | React Native Appearance API | Zero dependência extra, controle total sobre a paleta |
| IA | OpenAI SDK — modelo `gpt-4o-mini` | Custo benefício elevado: respostas rápidas e coerentes com custo por token muito menor que modelos maiores | GPT-4o, Claude Haiku, Gemini Flash | Precisão adequada para chat geral, latência baixa, SDK oficial em TypeScript |

---

## 3. Demonstração

https://github.com/user-attachments/assets/cf134fc1-cc40-4e05-8941-0d47540ed837

Fluxo principal:
1. Onboarding de 3 slides na primeira abertura
2. Tela de chat com histórico de conversas na sidebar
3. Envio de mensagem → TypingIndicator aparece enquanto a IA responde → resposta exibida
4. Histórico salvo automaticamente no dispositivo
5. Alternância de tema claro/escuro (preferência persistida localmente)

---

## 4. Destaque de Engenharia — "The Hard Part"

O desafio central foi criar uma UX de resposta imediata sem streaming real da OpenAI. A solução foi um padrão de **placeholder otimista**: a mensagem da IA aparece na tela imediatamente (com `isStreaming: true`), bloqueando novo envio, e é substituída pela resposta real quando a requisição finaliza.

```typescript
// useConversations.ts — envio de mensagem com placeholder otimista

const userMsg: Message = { id: makeId(), text, sender: "user" };
const aiId = makeId() + "-ai";

// 1. Insere a mensagem do usuário e o placeholder vazio da IA de uma vez.
//    O TypingIndicator é renderizado enquanto isStreaming === true.
setConversations((prev) =>
  prev.map((c) => {
    if (c.id !== chatId) return c;
    return {
      ...c,
      title: c.messages.length === 0 ? titleFromText(text) : c.title,
      messages: [
        ...c.messages,
        userMsg,
        { id: aiId, text: "", sender: "ai", isStreaming: true },
      ],
    };
  })
);
setIsLoading(true); // bloqueia envio de novas mensagens

// 2. Faz a chamada ao backend (Express → OpenAI gpt-4o-mini).
const reply = await sendToAI(text);

// 3. Substitui o placeholder pela resposta real e persiste no AsyncStorage.
setConversations((prev) => {
  const next = prev.map((c) => {
    if (c.id !== chatId) return c;
    return {
      ...c,
      messages: c.messages.map((m) =>
        m.id === aiId ? { ...m, text: reply, isStreaming: false } : m
      ),
    };
  });
  saveConversations(next); // persiste no dispositivo
  return next;
});
```

**Impacto**: elimina a percepção de espera, mantém a interface responsiva e garante que o histórico nunca seja perdido, mesmo que o app seja fechado durante uma conversa.

---

## 5. Insights e Valor de Negócio

**Para produto:**
- O histórico local aumenta retenção — o usuário volta porque as conversas já estão lá, sem precisar recriar contexto
- O onboarding de 3 slides educam sobre as features antes do primeiro uso, reduzindo abandono
- O tema dark/light persistido melhora conforto visual e percepção de cuidado com a experiência do usuário

**Para negócio:**
- A arquitetura de proxy no backend permite trocar ou rotear modelos de IA (OpenAI → Claude → Gemini) sem alterar o app, reduzindo risco de lock-in com fornecedor
- Zero custo de banco de dados em nuvem na versão atual — escala horizontal com custo previsível

**Para dados / IA:**
- Conversas salvas localmente abrem caminho para fine-tuning ou personalização de contexto no futuro
- Hipótese testável: usuários retornam mais quando há histórico persistente vs. sessão única

---

## 6. Instruções de Instalação e Uso

```bash
# 1. Clone o repositório
git clone https://github.com/hiagoka/ai-chat-mobile.git
cd ai-chat-mobile
```

### Backend

```bash
cd BACK

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env com:
# OPENAI_API_KEY=sua_chave_aqui
# PORT=3000

# 4. Inicie o servidor
npm run dev
```

### Frontend

```bash
cd FRONT

# 5. Instale as dependências
npm install

# 6. Configure o endpoint do backend
# Edite FRONT/src/config.ts e aponte para o IP da sua máquina
# Em dispositivo físico (Expo Go), localhost não funciona — use o IP local:
# Ex: export const API_URL = "http://192.168.x.x:3000/chat"
# Em emulador Android: export const API_URL = "http://10.0.2.2:3000/chat"

# 7. Inicie o app
npx expo start
```

**Uso:**
- Escaneie o QR code com o app Expo Go (iOS/Android)
- Na primeira abertura, passe pelo onboarding de 3 slides
- Digite uma mensagem e aguarde a resposta da IA
- Acesse a sidebar (ícone de menu) para criar ou alternar entre conversas

---

## 7. Roadmap / Próximos Passos

**Melhorias imediatas:**
- Streaming real de tokens (Server-Sent Events no backend + renderização incremental no front)
- Suporte a múltiplos modelos de IA selecionáveis pelo usuário
- Copiar mensagem com toque longo

**Arquitetura de longo prazo:**
- Autenticação opcional com sincronização de histórico em nuvem
- Sistema de prompts de sistema configuráveis por conversa (personas)
- Separação em monorepo com pacote de tipos compartilhados entre FRONT e BACK

**Qualidade e operação:**
- Testes unitários para o hook `useConversations`
- Métricas de latência por modelo no backend
- CI/CD com Expo EAS Build para distribuição automatizada

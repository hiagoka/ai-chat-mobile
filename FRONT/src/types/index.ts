export type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  isStreaming?: boolean;
  isError?: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};

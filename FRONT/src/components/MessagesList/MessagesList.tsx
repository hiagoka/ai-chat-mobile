import { FlatList } from "react-native";
import { useRef } from "react";

import { MessageBubble } from "../MessageBubble/MessageBubble";
import { Message } from "@/src/types/Message";

type Props = {
  messages: Message[];
};

export function MessagesList({ messages }: Props) {

  const flatListRef = useRef<FlatList>(null); 

  return (
    <FlatList
      initialNumToRender={20}
      ref={flatListRef}
      style={{ flex: 1 }}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MessageBubble message={item} />}
      onContentSizeChange={() =>
        flatListRef.current?.scrollToEnd({ animated: true })
      }
    />
  );
}
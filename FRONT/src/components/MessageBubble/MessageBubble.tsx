import { View, Text} from "react-native";

import { Message } from "@/src/types/Message";
import { styles } from "./styles";

type Props = {
    message: Message;
}

export function MessageBubble({message}: Props){
    const isUser = message.sender === "user"

    return(
        <View
            style={[
                styles.container,
                isUser ? styles.userContainer : styles.aiContainer,
            ]}
        >
            <Text style={isUser ? styles.userText : styles.aiText}>
                {message.text}
            </Text>
        </View>
    )
}
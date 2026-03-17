import { styles } from "./styles";
import { View, Text, StyleSheet } from "react-native";

export function ChatHeader(){
    return(
        <View style={styles.container}>
        <Text style={styles.title}> AI Assistant</Text>
        </View>
    )
}


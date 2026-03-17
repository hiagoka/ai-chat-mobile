import { Colors, Fonts } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
        padding: 12,
        borderRadius: 12,
        maxWidth: "70%",
    },

    userContainer: {
      alignSelf: "flex-end",
      backgroundColor: Colors.messageUser,
      marginRight: 10,
    },

    aiContainer: {
        alignSelf: "flex-start",
        backgroundColor: Colors.messageOther,
        marginLeft: 10,

    },

    userText: {
        color: Colors.text,
        fontFamily: Fonts.sans
    },

    aiText: {
        color: Colors.text,
        fontFamily: Fonts.rounded,
    }
})

import { Colors, Fonts } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: Colors.border,
        alignSelf: "center",
        marginBottom: 25,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.text,
        fontFamily: Fonts.mono,
    }
})
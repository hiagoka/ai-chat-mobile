import { StyleSheet } from "react-native";

import { Colors, Fonts } from "@/constants/theme";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        padding: 10,
        paddingBottom: 50,
    },
    input: {
        backgroundColor: Colors.inputBackground,
        color: Colors.text,
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 8,
        fontFamily: Fonts.sans,
    }
})
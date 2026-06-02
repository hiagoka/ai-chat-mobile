import { StyleSheet } from "react-native";
import { ColorScheme, Fonts } from "@/constants/theme";

export const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      marginVertical: 6,
      padding: 12,
      borderRadius: 12,
      maxWidth: "70%",
    },
    userContainer: {
      alignSelf: "flex-end",
      backgroundColor: colors.messageUser,
      marginRight: 10,
    },
    aiContainer: {
      alignSelf: "flex-start",
      backgroundColor: colors.messageOther,
      marginLeft: 10,
    },
    userText: {
      color: "#FFFFFF",
      fontFamily: Fonts?.sans,
    },
    aiText: {
      color: colors.messageOtherText,
      fontFamily: Fonts?.rounded,
    },
    errorContainer: {
      borderWidth: 1,
      borderColor: "#EF4444",
      backgroundColor: "#1C0A0A",
    },
  });

import { StyleSheet } from "react-native";
import { ColorScheme, Fonts } from "@/constants/theme";

export const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
      padding: 10,
      paddingBottom: 50,
    },
    input: {
      backgroundColor: colors.inputBackground,
      color: colors.text,
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 10,
      marginHorizontal: 8,
      fontFamily: Fonts?.sans,
    },
    inputDisabled: {
      opacity: 0.5,
    },
  });

import { StyleSheet } from "react-native";
import { ColorScheme } from "@/constants/theme";

export const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    menuBtn: {
      width: 36,
      alignItems: "center",
    },
    title: {
      flex: 1,
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
    },
  });

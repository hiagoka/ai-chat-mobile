import { Platform } from "react-native";

export type ColorScheme = {
  primary: string;
  background: string;
  surface: string;
  messageUser: string;
  messageOther: string;
  messageOtherText: string;
  text: string;
  textMuted: string;
  inputBackground: string;
  border: string;
  placeholder: string;
  activeItemBg: string;
  newChatBg: string;
  newChatBorder: string;
};

export const DarkColors: ColorScheme = {
  primary: "#4F8CFF",
  background: "#0F172A",
  surface: "#090F1E",
  messageUser: "#2563EB",
  messageOther: "#1E293B",
  messageOtherText: "#F1F5F9",
  text: "#F1F5F9",
  textMuted: "#64748B",
  inputBackground: "#1E293B",
  border: "#1E293B",
  placeholder: "#94A3B8",
  activeItemBg: "#12233D",
  newChatBg: "#0D1E3A",
  newChatBorder: "#1D3461",
};

export const LightColors: ColorScheme = {
  primary: "#2563EB",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  messageUser: "#2563EB",
  messageOther: "#E2E8F0",
  messageOtherText: "#0F172A",
  text: "#0F172A",
  textMuted: "#64748B",
  inputBackground: "#F1F5F9",
  border: "#E2E8F0",
  placeholder: "#94A3B8",
  activeItemBg: "#EFF6FF",
  newChatBg: "#EFF6FF",
  newChatBorder: "#BFDBFE",
};

// Backward compat
export const Colors = DarkColors;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

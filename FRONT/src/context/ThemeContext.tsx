import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorScheme, DarkColors, LightColors } from "@/constants/theme";

type ThemeContextValue = {
  isDark: boolean;
  /** Objeto de cores do tema ativo — use sempre este ao invés de importar Colors diretamente. */
  colors: ColorScheme;
  /** Alterna entre modo claro e escuro e persiste a escolha no dispositivo. */
  toggleTheme: () => void;
};

// Valor padrão do contexto — usado apenas se algum componente tentar consumir
// o contexto fora do ThemeProvider (o que não deve acontecer em uso normal).
const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  colors: DarkColors,
  toggleTheme: () => {},
});

/**
 * Provedor de tema da aplicação.
 * Deve envolver toda a árvore de componentes (está no _layout.tsx).
 * Ao montar, lê a preferência salva no AsyncStorage para restaurar o último tema escolhido.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("@theme").then((val) => {
      if (val === "light") setIsDark(false);
    });
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem("@theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? DarkColors : LightColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook para acessar o tema atual em qualquer componente da aplicação. */
export function useTheme() {
  return useContext(ThemeContext);
}

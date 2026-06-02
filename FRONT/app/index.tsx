import { useEffect, useState } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatScreen from "@/src/screens/ChatScreen";
import OnboardingScreen from "@/src/screens/OnboardingScreen";
import { useTheme } from "@/src/context/ThemeContext";
import { ONBOARDING_KEY } from "@/src/config";

export default function HomeScreen() {
  const { colors } = useTheme();
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setShowOnboarding(val !== "true");
      setReady(true);
    });
  }, []);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  if (showOnboarding) return <OnboardingScreen onDone={() => setShowOnboarding(false)} />;
  return <ChatScreen />;
}

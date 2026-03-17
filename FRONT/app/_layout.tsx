import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.background}}>
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
    </SafeAreaView>
  );
}

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // App is light-mode only by design (premium glassmorphism palette).
  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ contentStyle: { backgroundColor: '#EAF7F4' } }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="todos" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="list/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen
            name="list-modal"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Protected guard={__DEV__}>
            <Stack.Screen name="storybook" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}

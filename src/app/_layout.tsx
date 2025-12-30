import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryProvider } from "../lib/query/provider";
import { useAuthStore } from "../stores/auth.store";
import { useSessionRestore } from "../features/auth/hooks";
import "../lib/i18n"; // Initialize i18n
import { OfflineBanner } from "../components/ui/OfflineBanner";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const RootLayout: React.FC = () => {
  const { restoreSession, isLoading } = useSessionRestore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        await restoreSession();
      } catch (e) {
        console.error("Failed to restore session:", e);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    bootstrapAsync();
  }, [restoreSession]);

  if (isLoading) {
    return null;
  }

  return (
    <PaperProvider>
      <QueryProvider>
        <OfflineBanner />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen name="auth/login" />
          ) : (
            <>
              <Stack.Screen name="kitchen" />
              <Stack.Screen name="waiter" />
              <Stack.Screen name="admin" />
            </>
          )}
        </Stack>
      </QueryProvider>
    </PaperProvider>
  );
};

export default RootLayout;

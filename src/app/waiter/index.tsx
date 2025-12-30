import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Appbar, Button, Card, Text } from "react-native-paper";
import { useAuthStore } from "../../stores/auth.store";
import { useTranslation } from "react-i18next";

export default function WaiterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/login" as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.Content title={t("waiter.title")} />
              <Appbar.Action icon="logout" onPress={handleLogout} />
            </Appbar.Header>
          ),
        }}
      />

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              {t("waiter.createOrder")}
            </Text>
            <Text variant="bodySmall" style={styles.description}>
              Pantalla para crear nuevas órdenes
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push("/order" as any)}
              style={styles.button}
            >
              Ir a órdenes
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              {t("waiter.checks")}
            </Text>
            <Text variant="bodySmall" style={styles.description}>
              Gestionar cuentas abiertas
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push("/checks" as any)}
              style={styles.button}
            >
              Ver cuentas
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    color: "#666",
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

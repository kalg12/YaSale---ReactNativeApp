import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Appbar, Card, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

export default function AdminDashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.BackAction onPress={() => router.back()} />
              <Appbar.Content title={t("admin.dashboard")} />
            </Appbar.Header>
          ),
        }}
      />

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              {t("admin.dashboard")}
            </Text>
            <Text variant="bodySmall" style={styles.description}>
              Panel de control con estadísticas del día, ventas totales, órdenes
              procesadas
            </Text>
            <Text
              variant="bodySmall"
              style={[styles.description, styles.placeholder]}
            >
              [Placeholder para: Tarjetas de estadísticas, gráficos de ventas,
              top productos]
            </Text>
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
    marginBottom: 8,
  },
  placeholder: {
    fontStyle: "italic",
    color: "#999",
  },
});

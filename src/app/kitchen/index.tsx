import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Pressable,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Appbar, SegmentedButtons, Text, Card } from "react-native-paper";
import { useAuthStore } from "../../stores/auth.store";
import { useOrdersLiveStore } from "../../stores/ordersLive.store";
import { useUIStore } from "../../stores/ui.store";
import {
  connectSocket,
  joinStoreRoom,
  getCurrentSocket,
  disconnectSocket,
} from "../../lib/socket/client";
import {
  initOrdersSocket,
  cleanupOrdersSocket,
} from "../../features/orders/socket";
import { OrderCard } from "../../components/kitchen/OrderCard";
import { useTranslation } from "react-i18next";

export default function KitchenScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { token, tenantId, storeId, logout } = useAuthStore();
  const { ordersList } = useOrdersLiveStore();
  const { kitchenViewMode, setKitchenViewMode } = useUIStore();
  const [refreshing, setRefreshing] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!token || !tenantId || !storeId) return;

    try {
      const socket = connectSocket(token, tenantId, storeId);
      joinStoreRoom(tenantId, storeId);
      initOrdersSocket(socket, storeId);

      return () => {
        const currentSocket = getCurrentSocket();
        if (currentSocket) {
          cleanupOrdersSocket(currentSocket);
        }
      };
    } catch (error) {
      console.error("Failed to initialize socket:", error);
    }
  }, [token, tenantId, storeId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // In a real app, you would refetch from API
    // For now, just simulate a refresh
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const handleLogout = async () => {
    disconnectSocket();
    await logout();
    router.replace("/login" as any);
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/order-${orderId}` as any);
  };

  const pendingOrders = ordersList.filter((o) => o.status === "PENDING");
  const inProgressOrders = ordersList.filter((o) => o.status === "IN_PROGRESS");
  const readyOrders = ordersList.filter((o) => o.status === "READY");

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.Content title={t("kitchen.title")} />
              <Appbar.Action icon="logout" onPress={handleLogout} />
            </Appbar.Header>
          ),
        }}
      />

      {/* View mode selector */}
      <View style={styles.controls}>
        <SegmentedButtons
          value={kitchenViewMode}
          onValueChange={(value) =>
            setKitchenViewMode(value as "list" | "grid")
          }
          buttons={[
            { value: "list", label: "Lista", icon: "format-list-bulleted" },
            { value: "grid", label: "Grid", icon: "view-grid" },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Orders sections */}
      {kitchenViewMode === "list" ? (
        <FlatList
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                {t("kitchen.noOrders")}
              </Text>
            </View>
          }
          data={ordersList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleOrderPress(item.id)}>
              <OrderCard order={item} compact={true} showPrice={false} />
            </Pressable>
          )}
          scrollEnabled={true}
        />
      ) : (
        // Grid view with sections
        <FlatList
          contentContainerStyle={styles.gridContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          data={[
            { type: "PENDING", title: "Pendientes", orders: pendingOrders },
            {
              type: "IN_PROGRESS",
              title: "En Proceso",
              orders: inProgressOrders,
            },
            { type: "READY", title: "Listas", orders: readyOrders },
          ]}
          keyExtractor={(item) => item.type}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                {item.title} ({item.orders.length})
              </Text>
              <View style={styles.ordersGrid}>
                {item.orders.length > 0 ? (
                  item.orders.map((order) => (
                    <Pressable
                      key={order.id}
                      onPress={() => handleOrderPress(order.id)}
                      style={styles.gridItem}
                    >
                      <Card>
                        <Card.Content>
                          <Text variant="titleMedium">
                            Orden #{order.number}
                          </Text>
                          <Text variant="bodySmall">
                            {order.items.length} artículos
                          </Text>
                        </Card.Content>
                      </Card>
                    </Pressable>
                  ))
                ) : (
                  <Text variant="bodySmall" style={styles.emptySection}>
                    Sin órdenes
                  </Text>
                )}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  controls: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  segmentedButtons: {
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 10,
    paddingLeft: 4,
  },
  ordersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
  },
  gridItem: {
    width: "48%",
  },
  emptySection: {
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
});

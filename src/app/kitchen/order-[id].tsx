import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Appbar, ActivityIndicator } from "react-native-paper";
import { useOrdersLiveStore } from "../../stores/ordersLive.store";
import {
  useStartOrderMutation,
  useUpdateOrderStatusMutation,
} from "../../features/orders/hooks";
import { OrderDetailView } from "../../components/kitchen/OrderDetailView";
import { useTranslation } from "react-i18next";

export default function KitchenOrderDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder } = useOrdersLiveStore();
  const { mutate: startOrder, isPending: isStarting } = useStartOrderMutation();
  const { mutate: markReady, isPending: isMarkingReady } =
    useUpdateOrderStatusMutation();

  const order = id ? getOrder(id) : null;

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={t("kitchen.order")} />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const handleStartOrder = () => {
    startOrder(order.id);
  };

  const handleMarkReady = () => {
    markReady({ orderId: order.id, status: "READY" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.BackAction onPress={() => router.back()} />
              <Appbar.Content
                title={`${t("kitchen.order")} #${order.number}`}
              />
            </Appbar.Header>
          ),
        }}
      />

      <OrderDetailView
        order={order}
        onStart={handleStartOrder}
        onMarkReady={handleMarkReady}
        isLoading={isStarting || isMarkingReady}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

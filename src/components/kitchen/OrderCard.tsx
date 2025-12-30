import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { useAuthStore } from "../../stores/auth.store";
import { LiveOrder } from "../../stores/ordersLive.store";
import { formatTime, getMinutesDiff } from "../../lib/utils/dates";
import { formatPrice } from "../../lib/utils/money";

interface OrderCardProps {
  order: LiveOrder;
  onPress?: () => void;
  showPrice?: boolean;
  compact?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  showPrice = true,
  compact = false,
}) => {
  const isKitchen = useAuthStore((state) => state.isKitchenUser());
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    setElapsedMinutes(getMinutesDiff(order.createdAt));
    const interval = setInterval(() => {
      setElapsedMinutes(getMinutesDiff(order.createdAt));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [order.createdAt]);

  const getStatusColor = () => {
    switch (order.status) {
      case "PENDING":
        return "#FF9800"; // Orange
      case "IN_PROGRESS":
        return "#2196F3"; // Blue
      case "READY":
        return "#4CAF50"; // Green
      default:
        return "#757575"; // Grey
    }
  };

  const getStatusLabel = () => {
    switch (order.status) {
      case "PENDING":
        return "Pendiente";
      case "IN_PROGRESS":
        return "En proceso";
      case "READY":
        return "Lista";
      default:
        return "Desconocido";
    }
  };

  if (compact) {
    return (
      <Card
        style={[styles.compactCard, { borderLeftColor: getStatusColor() }]}
        onPress={onPress}
      >
        <Card.Content style={styles.compactContent}>
          <View style={styles.compactHeader}>
            <Text variant="titleMedium" style={styles.orderNumber}>
              #{order.number}
            </Text>
            <Text
              variant="labelSmall"
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              {getStatusLabel()}
            </Text>
          </View>
          <View style={styles.compactDetails}>
            <Text variant="bodySmall" numberOfLines={1}>
              {order.items.length} artículos
            </Text>
            <Text variant="bodySmall" style={styles.time}>
              {elapsedMinutes}m
            </Text>
            {showPrice && !isKitchen && (
              <Text variant="titleSmall" style={styles.price}>
                ${formatPrice(order.total)}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  }

  // Standard card
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="headlineSmall">Orden #{order.number}</Text>
            <Text variant="bodySmall" style={styles.time}>
              {formatTime(order.createdAt)} ({elapsedMinutes}m)
            </Text>
          </View>
          <View
            style={[
              styles.statusBadgeLarge,
              { backgroundColor: getStatusColor() },
            ]}
          >
            <Text style={styles.statusText}>{getStatusLabel()}</Text>
          </View>
        </View>

        {/* Order details */}
        <View style={styles.details}>
          <Text variant="bodySmall">
            <Text style={styles.label}>Tipo:</Text>{" "}
            {order.type === "DINE_IN" ? "Comer aquí" : "Para llevar"}
          </Text>
          {order.tableNumber && (
            <Text variant="bodySmall">
              <Text style={styles.label}>Mesa:</Text> {order.tableNumber}
            </Text>
          )}
          {order.customerName && (
            <Text variant="bodySmall">
              <Text style={styles.label}>Cliente:</Text> {order.customerName}
            </Text>
          )}
          <Text variant="bodySmall">
            <Text style={styles.label}>Artículos:</Text> {order.items.length}
          </Text>
        </View>

        {/* Items list */}
        <View style={styles.itemsList}>
          {order.items.slice(0, 3).map((item, idx) => (
            <Text key={idx} variant="bodySmall" numberOfLines={1}>
              • {item.quantity}x {item.name}
            </Text>
          ))}
          {order.items.length > 3 && (
            <Text variant="bodySmall">+{order.items.length - 3} más</Text>
          )}
        </View>

        {/* Price and action */}
        {!isKitchen && (
          <View style={styles.priceSection}>
            <View>
              <Text variant="bodySmall" style={styles.subtotalLabel}>
                Subtotal
              </Text>
              <Text variant="titleSmall">${formatPrice(order.subtotal)}</Text>
              <Text variant="bodySmall" style={styles.taxLabel}>
                + ${formatPrice(order.tax)} (IVA)
              </Text>
            </View>
            <View style={styles.totalBox}>
              <Text variant="labelSmall">Total</Text>
              <Text variant="headlineSmall">${formatPrice(order.total)}</Text>
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 0,
  },
  compactCard: {
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  compactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderNumber: {
    fontWeight: "600",
  },
  time: {
    color: "#999",
    marginTop: 4,
  },
  statusBadge: {
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    fontWeight: "600",
  },
  statusBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  details: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    color: "#555",
  },
  itemsList: {
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  compactContent: {
    padding: 12,
  },
  compactDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  price: {
    fontWeight: "600",
    color: "#2E7D32",
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginTop: 10,
  },
  subtotalLabel: {
    color: "#999",
  },
  taxLabel: {
    color: "#999",
    marginTop: 2,
  },
  totalBox: {
    alignItems: "flex-end",
  },
});

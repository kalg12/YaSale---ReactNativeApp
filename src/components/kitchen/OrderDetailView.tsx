import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, Button, Divider } from "react-native-paper";
import { LiveOrder } from "../../stores/ordersLive.store";
import { formatTime, getMinutesDiff } from "../../lib/utils/dates";

interface OrderDetailProps {
  order: LiveOrder;
  onMarkReady?: () => void;
  onStart?: () => void;
  isLoading?: boolean;
}

export const OrderDetailView: React.FC<OrderDetailProps> = ({
  order,
  onMarkReady,
  onStart,
  isLoading = false,
}) => {
  const elapsedMinutes = getMinutesDiff(order.createdAt);

  const getStatusColor = () => {
    switch (order.status) {
      case "PENDING":
        return "#FF9800";
      case "IN_PROGRESS":
        return "#2196F3";
      case "READY":
        return "#4CAF50";
      default:
        return "#757575";
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

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.titleRow}>
            <Text variant="displaySmall">Orden #{order.number}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              <Text style={styles.statusText}>{getStatusLabel()}</Text>
            </View>
          </View>
          <Text variant="bodySmall" style={styles.timeText}>
            {formatTime(order.createdAt)} ({elapsedMinutes}m)
          </Text>
        </Card.Content>
      </Card>

      {/* Order metadata */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.sectionTitle}>
            Información de la orden
          </Text>
          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.label}>
              Tipo:
            </Text>
            <Text variant="bodySmall">
              {order.type === "DINE_IN" ? "Comer aquí" : "Para llevar"}
            </Text>
          </View>
          {order.tableNumber && (
            <View style={styles.infoRow}>
              <Text variant="bodySmall" style={styles.label}>
                Mesa:
              </Text>
              <Text variant="bodySmall">{order.tableNumber}</Text>
            </View>
          )}
          {order.customerName && (
            <View style={styles.infoRow}>
              <Text variant="bodySmall" style={styles.label}>
                Cliente:
              </Text>
              <Text variant="bodySmall">{order.customerName}</Text>
            </View>
          )}
          {order.notes && (
            <View style={styles.infoRow}>
              <Text variant="bodySmall" style={styles.label}>
                Notas:
              </Text>
              <Text variant="bodySmall" style={styles.flex}>
                {order.notes}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Items */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.sectionTitle}>
            Artículos ({order.items.length})
          </Text>
          {order.items.map((item, idx) => (
            <View key={idx}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text variant="bodyMedium" style={styles.itemName}>
                    {item.quantity}x {item.name}
                  </Text>
                  {item.selectedVariants.length > 0 && (
                    <View style={styles.variantsContainer}>
                      {item.selectedVariants.map((variant, vidx) => (
                        <Text
                          key={vidx}
                          variant="labelSmall"
                          style={styles.variant}
                        >
                          • {variant.name}
                        </Text>
                      ))}
                    </View>
                  )}
                  {item.modifiers.length > 0 && (
                    <View style={styles.modifiersContainer}>
                      {item.modifiers.map((mod, midx) => (
                        <Text
                          key={midx}
                          variant="labelSmall"
                          style={[
                            styles.modifier,
                            {
                              color: mod.type === "ADD" ? "#4CAF50" : "#F44336",
                            },
                          ]}
                        >
                          {mod.type === "ADD" ? "+" : "-"} {mod.name}
                        </Text>
                      ))}
                    </View>
                  )}
                  {item.notes && (
                    <Text variant="labelSmall" style={styles.itemNotes}>
                      Notas: {item.notes}
                    </Text>
                  )}
                </View>
              </View>
              {idx < order.items.length - 1 && (
                <Divider style={styles.itemDivider} />
              )}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        {order.status === "PENDING" && onStart && (
          <Button
            mode="contained"
            onPress={onStart}
            loading={isLoading}
            disabled={isLoading}
            style={styles.fullWidthButton}
            buttonColor="#2196F3"
          >
            Iniciar Orden
          </Button>
        )}
        {order.status === "IN_PROGRESS" && onMarkReady && (
          <Button
            mode="contained"
            onPress={onMarkReady}
            loading={isLoading}
            disabled={isLoading}
            style={styles.fullWidthButton}
            buttonColor="#4CAF50"
          >
            Marcar como Lista
          </Button>
        )}
        {order.status === "READY" && (
          <Button mode="outlined" disabled style={styles.fullWidthButton}>
            Orden Lista - Esperando que la recojan
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  headerCard: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  timeText: {
    color: "#999",
    marginTop: 4,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    marginRight: 8,
    minWidth: 80,
  },
  flex: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  variantsContainer: {
    marginTop: 4,
    marginLeft: 4,
  },
  variant: {
    color: "#2196F3",
    marginBottom: 2,
  },
  modifiersContainer: {
    marginTop: 4,
    marginLeft: 4,
  },
  modifier: {
    marginBottom: 2,
    fontWeight: "500",
  },
  itemNotes: {
    marginTop: 4,
    fontStyle: "italic",
    color: "#666",
  },
  itemDivider: {
    marginVertical: 8,
  },
  buttonContainer: {
    marginBottom: 24,
    gap: 10,
  },
  fullWidthButton: {
    paddingVertical: 4,
  },
});

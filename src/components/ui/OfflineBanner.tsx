import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Snackbar, Text } from "react-native-paper";
import { useNetworkState } from "expo-network";
import { useUIStore } from "../../stores/ui.store";

export const OfflineBanner: React.FC = () => {
  const networkState = useNetworkState();
  const { isOnline, setOnline } = useUIStore();
  const { snackbarMessage, snackbarType, hideSnackbar } = useUIStore();

  useEffect(() => {
    const isConnected =
      networkState.isConnected !== false && networkState.type !== "NONE";
    setOnline(isConnected);
  }, [networkState.isConnected, networkState.type, setOnline]);

  return (
    <>
      {/* Offline banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text variant="labelSmall" style={styles.offlineText}>
            Sin conexión
          </Text>
        </View>
      )}

      {/* Snackbar for messages */}
      <Snackbar
        visible={!!snackbarMessage}
        onDismiss={hideSnackbar}
        duration={3000}
        style={[
          styles.snackbar,
          {
            backgroundColor:
              snackbarType === "success"
                ? "#4CAF50"
                : snackbarType === "error"
                ? "#F44336"
                : "#2196F3",
          },
        ]}
      >
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  offlineText: {
    color: "white",
    fontWeight: "bold",
  },
  snackbar: {
    marginBottom: 16,
  },
  snackbarText: {
    color: "white",
    fontSize: 14,
  },
});

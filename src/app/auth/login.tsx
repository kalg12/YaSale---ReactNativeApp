import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Card,
  ActivityIndicator,
  SegmentedButtons,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { usePinLoginMutation } from "../../features/auth/hooks";
import { useAuthStore } from "../../stores/auth.store";

interface LoginFormData {
  pin: string;
  storeId?: string;
}

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    defaultValues: {
      pin: "",
      storeId: "",
    },
  });

  const { mutate: login, isPending } = usePinLoginMutation();
  const user = useAuthStore((state) => state.user);

  const [pinError, setPinError] = useState<string | null>(null);

  const onSubmit = (data: LoginFormData) => {
    setPinError(null);

    if (!data.pin || data.pin.length < 4) {
      setPinError("El PIN debe tener al menos 4 dígitos");
      return;
    }

    login(
      {
        pin: data.pin,
        storeId: data.storeId || undefined,
      },
      {
        onError: (error: any) => {
          setPinError(error?.response?.data?.message || "PIN incorrecto");
        },
      }
    );
  };

  // PIN keypad handler
  const handlePinInput = (value: string) => {
    if (/^\d{0,6}$/.test(value)) {
      setPinError(null);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="displayMedium" style={styles.title}>
            YaSale
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sistema de Cocina
          </Text>
        </View>

        {/* Login Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Iniciar Sesión
            </Text>

            {/* Store Selection (if user has multiple stores) */}
            {user?.stores && user.stores.length > 1 && (
              <Controller
                control={control}
                name="storeId"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.fieldContainer}>
                    <Text variant="labelMedium">Seleccionar Tienda</Text>
                    <SegmentedButtons
                      value={value || ""}
                      onValueChange={onChange}
                      buttons={user.stores.map((store) => ({
                        value: store.id,
                        label: store.name,
                      }))}
                      style={styles.segmentedButtons}
                    />
                  </View>
                )}
              />
            )}

            {/* PIN Input */}
            <View style={styles.fieldContainer}>
              <Controller
                control={control}
                name="pin"
                rules={{
                  required: "El PIN es requerido",
                  minLength: { value: 4, message: "Mínimo 4 dígitos" },
                  pattern: { value: /^\d+$/, message: "Solo números" },
                }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <TextInput
                      label="PIN"
                      value={value}
                      onChangeText={(text) => {
                        handlePinInput(text);
                        onChange(text);
                      }}
                      secureTextEntry
                      keyboardType="number-pad"
                      maxLength={6}
                      mode="outlined"
                      error={!!pinError || !!errors.pin}
                    />
                    {(pinError || errors.pin) && (
                      <Text style={styles.errorText}>
                        {pinError || errors.pin?.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* PIN Keypad */}
            <View style={styles.keypad}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <Button
                  key={num}
                  mode="outlined"
                  onPress={() => {
                    const currentPin = watch("pin");
                    if (currentPin.length < 6) {
                      handlePinInput(currentPin + num);
                      control._formValues.pin = currentPin + num;
                    }
                  }}
                  style={styles.keypadButton}
                >
                  {num}
                </Button>
              ))}
              <Button
                mode="outlined"
                onPress={() => {
                  const currentPin = watch("pin");
                  if (currentPin.length > 0) {
                    const newPin = currentPin.slice(0, -1);
                    handlePinInput(newPin);
                    control._formValues.pin = newPin;
                  }
                }}
                style={[styles.keypadButton, styles.deleteButton]}
              >
                ⌫
              </Button>
            </View>

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              disabled={isPending}
              style={styles.submitButton}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </Card.Content>
        </Card>

        {/* Footer */}
        <Text variant="labelSmall" style={styles.footer}>
          Ingrese su PIN de 4-6 dígitos
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontWeight: "700",
    color: "#2196F3",
  },
  subtitle: {
    color: "#666",
    marginTop: 8,
  },
  card: {
    marginBottom: 24,
    elevation: 4,
  },
  cardTitle: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  fieldContainer: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  errorText: {
    color: "#F44336",
    fontSize: 12,
    marginTop: 4,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  keypadButton: {
    width: "30%",
    marginBottom: 8,
  },
  deleteButton: {
    width: "100%",
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 4,
  },
  footer: {
    textAlign: "center",
    color: "#999",
  },
});
